import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';
import '../../clases/sweetAlert'
import { Router } from '@angular/router';
import '../../clases/sweetAlert';
import { SweetAlert } from '../../clases/sweetAlert';
import { SpinnerComponent } from '../spinner/spinner.component';

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

  constructor(private fb: FormBuilder, protected authService: AuthService, public router: Router) { }
  ngOnInit(): void
  {
    this.formLogin = this.fb.group({
      user: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  iniciarSesion()
  {
    if (this.formLogin.valid)
    {
      this.authService.logIn(this.user?.value, this.password?.value).then((response) =>
      {
        console.log(response);
        this.swal.mostrarMensajeExitoYNavegar("Sesión iniciada", "Serás redirigido a la página de bienvenida", "bienvenida")
      }).catch((error) =>
      {
        console.log(error);
        this.swal.mostrarMensajeError("Error", this.authService.traducirErrorCode(error.code));
      })

    }
  }

  accesoRapido(opcion: string)
  {
    let user;
    let password;
    switch (opcion)
    {
      case "paciente":
        user = "siredim152@jadsys.com";
        password = "123456";
        break;
      case "especialista":
        user = "om80tr1gti@vvatxiy.com";
        password = "123456";

        
        break;
      case "administrador":
        user = "administrador@gmail.com";
        password = "123456";
        break;
    }
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
