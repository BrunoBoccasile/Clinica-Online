import { Injectable } from '@angular/core';
import { FirebaseError, initializeApp } from '@angular/fire/app';
import { Auth, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { addDoc, collection } from '@angular/fire/firestore';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Administrador } from '../entidades/administrador';
import { AdministradoresService } from './administradores.service';
import { PacientesService } from './pacientes.service';
import { EspecialistasService } from './especialistas.service';
import { Paciente } from '../entidades/paciente';
import { Especialista } from '../entidades/especialista';
import { SweetAlert } from '../clases/sweetAlert';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService
{
  public loggedUser: string = "";
  public errorRegistro: boolean = false;
  public mensajeErrorRegister: string = "";
  public errorLogin: boolean = false;
  public mensajeErrorLogin: string = "";
  public isLoggedIn: boolean = false;
  public firebaseInicializado: boolean = false;
  public usuarioLogeado!: any;
  public tipoUsuario: string = "";
  swal: SweetAlert = new SweetAlert(this.router);
  private userLoadedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public secondaryApp: any;
  constructor(public auth: Auth, public administradoresService: AdministradoresService, public pacientesService: PacientesService, public especialistasService: EspecialistasService, public router: Router)
  {
    this.auth.authStateReady().then(() =>
    {
      // Firebase está inicializado y listo para usar
      this.firebaseInicializado = true;
    });

    const secondaryAppConfig = {
      apiKey: 'AIzaSyBJtKrLY8S0BOLk38rEEeNTQXen4KLTZwk',
      authDomain: 'projectId.firebaseapp.com',
      databaseURL: 'https://databaseName.firebaseio.com',
    };
    this.secondaryApp = initializeApp(secondaryAppConfig, 'Secondary');



    //verifico el tipo de usuario
    onAuthStateChanged(this.auth, (user) =>
    {
      if (user && user.emailVerified)
      {
        if (user.email)
        {
          this.administradoresService.getAdminByMail(user.email).then(res =>
          {
            if (res.docs.length > 0)
            {
              this.usuarioLogeado = res.docs[0].data();
              this.usuarioLogeado.id = res.docs[0].id;

              console.log(this.usuarioLogeado);
              this.tipoUsuario = "administrador";
              this.userLoadedSubject.next(true);
            }
          })

          this.pacientesService.getPacienteByMail(user.email).then(res =>
          {
            if (res.docs.length > 0)
            {
              this.usuarioLogeado = res.docs[0].data();
              this.usuarioLogeado.id = res.docs[0].id;
              console.log(this.usuarioLogeado);
              this.tipoUsuario = "paciente";
              this.userLoadedSubject.next(true);

            }
          })

          this.especialistasService.getEspecialistaByMail(user.email).then(res =>
          {
            if (res.docs.length > 0)
            {
              this.usuarioLogeado = res.docs[0].data();
              this.usuarioLogeado.id = res.docs[0].id;

              console.log(this.usuarioLogeado);
              this.tipoUsuario = "especialista";
              this.userLoadedSubject.next(true);

            }
          })
        }
        else
        {
          this.usuarioLogeado = null;
          this.userLoadedSubject.next(true);
        }
      }
    });
  }


  esperarCargarUsuario(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.userLoadedSubject.getValue()) {
        resolve();
      } else {
        const subscription = this.userLoadedSubject.subscribe((loaded) => {
          if (loaded) {
            resolve();
            subscription.unsubscribe();
          }
        });
      }
    });
  }


  authStateReady(): Promise<void>
  {
    return this.auth.authStateReady();
  }

  registerSinLogin(email: string, password: string)
  {
    const auth = getAuth(this.secondaryApp);

    if (auth.currentUser)
    {
      return signOut(auth)
        .catch(() =>
        {
          // Ignorar el error de signOut y proceder con la creación del usuario
        })
        .then(() =>
        {
          return createUserWithEmailAndPassword(auth, email, password);
        })
        .catch(error =>
        {
          // Manejar el error de createUserWithEmailAndPassword si ocurre
          throw error;
        });
    }
    else
    {
      return createUserWithEmailAndPassword(auth, email, password);

    }


  }

  register(email: string, password: string)
  {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }


  logIn(userMail: string, userPassword: string)
  {
    return this.especialistasService.obtenerEspecialistaPorEmail(userMail).then(res =>
    {
      if (res)
      {
        console.log(res);
        if (res.estado === "aprobado")
        {
          return signInWithEmailAndPassword(this.auth, userMail, userPassword);
        } 
        else
        {
          throw new FirebaseError("especialista-no-aprobado", "El especialista no ha sido aprobado por un administrador.");
        }
      } 
      else
      {
        return signInWithEmailAndPassword(this.auth, userMail, userPassword);
      }
    }).catch((error: FirebaseError) =>
    { 
      throw error; 
    });
  }

  LogOut()
  {
    signOut(this.auth).then(() =>
    {
      this.tipoUsuario = "";
      this.usuarioLogeado = null;
    });
  }

  traducirErrorCode(error: string): string
  {
    let errorTraducido;
    switch (error)
    {
      case "auth/email-already-in-use":
        errorTraducido = "el email ya está en uso";
        break;
      case "auth/weak-password":
        errorTraducido = "la contraseña debe tener más de 6 caracteres";
        break;
      case "auth/invalid-email":
        errorTraducido = "el email es inválido";
        break;
      case "auth/invalid-credential":
        errorTraducido = "el usuario no existe o la contraseña es incorrecta";
        break;
      case "auth/missing-password":
        errorTraducido = "la contraseña no puede estar vacía";
        break;
      case "auth/missing-email":
        errorTraducido = "el email no puede estar vacío";
        break;
      case "especialista-no-aprobado":
        errorTraducido = "El especialista no ha sido aprobado por un administrador";
        break;
      default:
        errorTraducido = "ocurrió un error inesperado";
        break;
    }
    return errorTraducido;
  }
}
