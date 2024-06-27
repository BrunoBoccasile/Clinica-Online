import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Administrador } from '../../entidades/administrador';
import { AdministradoresService } from '../../servicios/administradores.service';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-tabla-administradores',
  standalone: true,
  imports: [SpinnerComponent],
  templateUrl: './tabla-administradores.component.html',
  styleUrl: './tabla-administradores.component.css'
})
export class TablaAdministradoresComponent implements OnInit, OnDestroy{
  public administradores: Array<Administrador>;
  public obtenerAdministradoresSub!: Subscription;
  public administradoresObtenidos: boolean;
  @Output() onEnviarId = new EventEmitter<string>();
  enviarId(id: string)
  {
    this.onEnviarId.emit(id);

  }
  constructor(public administradoresService: AdministradoresService)
  {
    this.administradores = [];
    this.administradoresObtenidos = false;
  }

  ngOnInit(): void
  {
    this.administradoresService.obtenerAdministradores();
    this.obtenerAdministradoresSub = this.administradoresService.obtenerAdministradoresSubject.subscribe(status =>
    {
      if(status)
        {
          this.administradores = this.administradoresService.coleccionAdministradores;
          console.log("especialistas obtenidos");
          this.administradoresObtenidos = true;
        }
    });

  }

  ngOnDestroy(): void
  {
    this.obtenerAdministradoresSub.unsubscribe();
  }
}
