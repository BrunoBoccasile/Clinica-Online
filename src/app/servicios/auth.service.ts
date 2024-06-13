import { Injectable } from '@angular/core';
import { initializeApp } from '@angular/fire/app';
import { Auth, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { addDoc, collection } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

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
  public firebaseInicializado: boolean;

  private secondaryApp: any;
  constructor(public auth: Auth)
  {
    this.firebaseInicializado = false;
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
    
  }

  authStateReady(): Promise<void>
  {
    return this.auth.authStateReady();
  }

  registerAdmin(email: string, password: string)
  {
    return createUserWithEmailAndPassword(getAuth(this.secondaryApp), email, password);
  }

  register(email: string, password: string)
  {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }



  logIn(userMail: string, userPassword: string)
  {
    return signInWithEmailAndPassword(this.auth, userMail, userPassword)
  }

  LogOut()
  {
    signOut(this.auth).then(() =>
    {
      console.log("User signed out:", this.auth.currentUser?.email);
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
      default:
        errorTraducido = "ocurrió un error inesperado";
        break;
    }
    return errorTraducido;
  }
}
