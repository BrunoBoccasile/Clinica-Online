import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { PacientesService } from '../../servicios/pacientes.service';
import { Paciente } from '../../entidades/paciente';
import { Subscription } from 'rxjs';
import { SpinnerComponent } from '../spinner/spinner.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-tabla-pacientes',
  standalone: true,
  imports: [SpinnerComponent, NgIf],
  templateUrl: './tabla-pacientes.component.html',
  styleUrl: './tabla-pacientes.component.css'
})
export class TablaPacientesComponent implements OnInit, OnDestroy {
  public pacientes: Array<Paciente>;
  public obtenerPacientesSub!: Subscription;
  public pacientesObtenidos: boolean;
  @Output() onEnviarId = new EventEmitter<string>();
  @Input() tipoVista = 0;

  enviarId(id: string)
  {
    this.onEnviarId.emit(id);
  }
  
  constructor(public pacientesService: PacientesService)
  {
    this.pacientes = [];
    this.pacientesObtenidos = false;
  }

  ngOnInit(): void
  {
    this.pacientesService.obtenerPacientes();
    this.obtenerPacientesSub = this.pacientesService.obtenerPacientesSubject.subscribe(status =>
    {
      if(status)
        {
          this.pacientes = this.pacientesService.coleccionPacientes;
          console.log("pacientes obtenidos");
          this.pacientesObtenidos = true;
        }
    });
  }

  ngOnDestroy(): void
  {
    this.obtenerPacientesSub.unsubscribe();
  }
}
