import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { BienvenidaComponent } from './componentes/bienvenida/bienvenida.component';
import { AuthService } from './servicios/auth.service';
import { SpinnerComponent } from './componentes/spinner/spinner.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BienvenidaComponent, RouterLink, SpinnerComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  constructor(public authService: AuthService, public router: Router){}
  title = 'clinicaonline';

  logOut()
  {
    this.authService.LogOut();
    this.router.navigateByUrl('bienvenida');
  }

  ngOnInit(): void
  {

  }
}
