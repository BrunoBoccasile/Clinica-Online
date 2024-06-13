import { Component, EventEmitter, Output } from '@angular/core';
import { Especialista } from '../../entidades/especialista';
import { Subscription } from 'rxjs';
import { EspecialistasService } from '../../servicios/especialistas.service';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-tabla-especialistas',
  standalone: true,
  imports: [SpinnerComponent],
  templateUrl: './tabla-especialistas.component.html',
  styleUrl: './tabla-especialistas.component.css'
})
export class TablaEspecialistasComponent {
  public especialistas: Array<Especialista>;
  public obtenerEspecialistasSub!: Subscription;
  public especialistasObtenidos: boolean;
  @Output() onEnviarId = new EventEmitter<string>();

  enviarId(id: string)
  {
    this.onEnviarId.emit(id);

  }
  constructor(public especialistasService: EspecialistasService)
  {
    this.especialistas = [];
    this.especialistasObtenidos = false;
  }

  ngOnInit(): void
  {
    this.especialistasService.obtenerEspecialistas();
    this.obtenerEspecialistasSub = this.especialistasService.obtenerEspecialistasSubject.subscribe(status =>
    {
      if(status)
        {
          this.especialistas = this.especialistasService.coleccionEspecialistas;
          console.log("especialistas obtenidos");
          this.especialistasObtenidos = true;
        }
    });
  }

}
