import { Component, OnInit } from '@angular/core';
import { TablaEspecialistasComponent } from '../tabla-especialistas/tabla-especialistas.component';
import { EspecialidadesService } from '../../servicios/especialidades.service';
import { Subscription } from 'rxjs';
import { Especialidad } from '../../entidades/especialidad';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerComponent } from '../spinner/spinner.component';
import { EspecialistasService } from '../../servicios/especialistas.service';
import { Disponibilidad } from '../../entidades/disponibilidad';
import { MinutosAHoraPipePipe } from '../../pipes/minutos-a-hora-pipe.pipe';
import { DatePipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-solicitar-turno',
  standalone: true,
  imports: [DatePipe, TablaEspecialistasComponent, ReactiveFormsModule, SpinnerComponent, MinutosAHoraPipePipe, NgFor, NgIf],
  templateUrl: './solicitar-turno.component.html',
  styleUrl: './solicitar-turno.component.css'
})
export class SolicitarTurnoComponent implements OnInit
{
  nombreEspecialidad!: string;
  obtenerEspecialidadesSub!: Subscription;
  especialidades!: Especialidad[];
  especialidadesObtenidas = false;
  formTurno!: FormGroup;
  especialistaSeleccionado!: any;


  constructor(public especialidadesService: EspecialidadesService, public fb: FormBuilder, public especialistasService: EspecialistasService)
  {
    this.formTurno = this.fb.group({
      especialidad: ['', [Validators.required]]
    })
  }


  ngOnInit(): void
  {
    this.especialidadesService.obtenerEspecialidades();

    this.obtenerEspecialidadesSub = this.especialidadesService.obtenerEspecialidadesSubject.subscribe(status =>
    {
      if (status)
      {
        this.especialidades = this.especialidadesService.coleccionEspecialidades;
        console.log("especialidades obtenidas");
        this.especialidadesObtenidas = true;
      }
      else
      {
        console.log("asd");
      }
    })


  }


  nada()
  {
    console.log(this.especialidad?.value);
  }

  recibirIdEspecialista(id: string)
  {
    this.especialistasService.obtenerEspecialistaPorId(id).then((respuesta) =>
    {
      this.especialistaSeleccionado = respuesta;
      respuesta?.especialidades.forEach(esp =>
      {
        if (esp.nombre == this.especialidad?.value)
        {
          if (esp.disponibilidades)
          {
            this.generarTurnos(esp.disponibilidades);
          }
        }
      });
    })
  }


  generarTurnos(disponibilidades: Disponibilidad[]) {
  }


  get especialidad()
  {
    return this.formTurno.get('especialidad');
  }
}
