import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { BienvenidaComponent } from './componentes/bienvenida/bienvenida.component';
import { AuthService } from './servicios/auth.service';
import { SpinnerComponent } from './componentes/spinner/spinner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BienvenidaComponent, RouterLink, SpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  constructor(public authService: AuthService){}
  title = 'clinicaonline';

  logOut()
  {
    this.authService.LogOut();
  }

  ngOnInit(): void
  {

  }
}
