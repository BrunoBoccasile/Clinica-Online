import { Component, OnInit, numberAttribute } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';
import '../../clases/sweetAlert'
import { Router } from '@angular/router';
import '../../clases/sweetAlert';
import { SweetAlert } from '../../clases/sweetAlert';
import { SpinnerComponent } from '../spinner/spinner.component';
import { StorageService } from '../../servicios/storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, SpinnerComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit
{
  formLogin!: FormGroup;
  swal: SweetAlert = new SweetAlert(this.router);
  usuariosRapidos: Array<any> = [
    {tipo: "Paciente", mail: "siredim152@jadsys.com", password: "123456", imagePath: "pacientes/siredim152@jadsys.com/1"},
    {tipo: "Paciente", mail: "jekogi2905@noefa.com", password: "123456", imagePath: "pacientes/jekogi2905@noefa.com/1"},
    {tipo: "Paciente", mail: "ndvawrksob@rentforsale7.com", password: "123456", imagePath: "pacientes/ndvawrksob@rentforsale7.com/1"},
    {tipo: "Especialista", mail: "sacirac.hasovag@rungel.net", password: "123456", imagePath: "especialistas/sacirac.hasovag@rungel.net"},
    {tipo: "Especialista", mail: "red962@navalcadets.com", password: "123456", imagePath: "especialistas/red962@navalcadets.com"},
    {tipo: "Admin", mail: "brunobocca03@gmail.com", password: "123456", imagePath: "administradores/brunobocca03@gmail.com"}
  ];
  imagenesBotonesObtenidas = false;

  constructor(private fb: FormBuilder, protected authService: AuthService, public router: Router, public storageService: StorageService) { }
  ngOnInit(): void
  {
    this.formLogin = this.fb.group({
      user: ['', Validators.required],
      password: ['', Validators.required]
    })

    for(let i = 0 ; i <this.usuariosRapidos.length ; i++)
      {
        this.storageService.obtenerImagen(this.usuariosRapidos[i].imagePath).then((imagePath) => {
          this.usuariosRapidos[i].imagePath = imagePath;

          console.log(this.usuariosRapidos[i].imagePath);

          if(i == this.usuariosRapidos.length-1)
            {
              this.imagenesBotonesObtenidas =true;
            }
        });
      }

  }

  iniciarSesion()
  {
    if (this.formLogin.valid)
    {
      this.authService.logIn(this.user?.value, this.password?.value).then((response) =>
      {
        if(response.user.emailVerified == false)
          {
            this.authService.LogOut();
            this.swal.mostrarMensajeWarning("Mail no verificado", "Para iniciar sesión con esta cuenta, debe verificar su email. Por favor revise su bandeja de entrada.")

          }
          else
          {
            console.log(response);
            this.swal.mostrarMensajeExitoYNavegar("Sesión iniciada", "Serás redirigido a la página de bienvenida", "bienvenida")
            
          }
      }).catch((error) =>
      {
        console.log(error);
        this.swal.mostrarMensajeError("Error", this.authService.traducirErrorCode(error.code));
      })
    }



  }

  accesoRapido(usuario: any)
  {
    let user;
    let password;
    user = usuario.mail;
    password = usuario.password;
    this.formLogin.patchValue({ user: user, password: password })
  }

  get user()
  {
    return this.formLogin.get('user');
  }

  get password()
  {
    return this.formLogin.get('password');
  }
}
