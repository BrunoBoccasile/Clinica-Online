import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TurnosService } from '../../servicios/turnos.service';
import { AuthService } from '../../servicios/auth.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { NgClass } from '@angular/common';
import { Subscription } from 'rxjs';
import { PacientesService } from '../../servicios/pacientes.service';
import { Paciente } from '../../entidades/paciente';
import { Tiempo } from '../../clases/tiempo';
import { MinutosAHoraPipePipe } from '../../pipes/minutos-a-hora-pipe.pipe';
import { Modal } from 'bootstrap';
import { CapitalizePipePipe } from '../../pipes/capitalize-pipe.pipe';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [SpinnerComponent, NgClass, MinutosAHoraPipePipe, CapitalizePipePipe],
  templateUrl: './pacientes.component.html',
  styleUrl: './pacientes.component.css'
})
export class PacientesComponent implements OnInit, OnDestroy
{
  public claseSpinner = "spinner-desactivado";
  public suscripcionTurnos!: Subscription;
  public suscripcionPacientes!: Subscription;
  public turnos!: any;
  public pacientes!: Array<Paciente>;
  public tiempo: Tiempo = new Tiempo();
  public pacienteSeleccionado!: Paciente;
  @ViewChild('modalHistoriaClinica') modalHistoriaClinica!: ElementRef;
  @ViewChild('modalDetallePaciente') modalDetallePaciente!: ElementRef;
  constructor(public pacientesService: PacientesService, public turnosService: TurnosService, public authService: AuthService) { }
  ngOnInit(): void
  {
    let ocultarSpinner = [false, false];
    this.mostrarSpinner();
    this.authService.esperarCargarUsuario().then(() =>
    {
      this.suscripcionTurnos = this.turnosService.obtenerTurnosByField('idEspecialista', this.authService.usuarioLogeado.id).subscribe({
        next: (res) =>
        {
          this.turnos = res;
          console.log(this.turnos);
          ocultarSpinner[0] = true;
          if (!ocultarSpinner.includes(false))
          {
            this.ocultarSpinner();
          }
        }
      })

      this.suscripcionPacientes = this.pacientesService.getPacientes().subscribe({
        next: (res) =>
        {
          this.pacientes = res;
          ocultarSpinner[1] = true;
          if (!ocultarSpinner.includes(false))
          {
            this.ocultarSpinner();
          }
        }
      })
    });
  }

  ngOnDestroy(): void
  {
    if (this.suscripcionTurnos)
    {
      this.suscripcionTurnos.unsubscribe();
    }
    if (this.suscripcionPacientes)
    {
      this.suscripcionPacientes.unsubscribe();
    }
  }

  filtrarPacientes()
  {
    let pacientesFiltrados: any[] = [];
    let idsFiltrados: Set<string | undefined> = new Set();

    for (let i = 0; i < this.turnos.length; i++)
    {
      for (let j = 0; j < this.pacientes.length; j++)
      {
        //turnos que correspondan al paciente y esten realizados
        if (this.turnos[i].idPaciente == this.pacientes[j].id && this.turnos[i].estado == "realizado")
        {
          if (idsFiltrados.has(this.pacientes[j].id))
          {
            break;
          } else
          {
            pacientesFiltrados.push(this.pacientes[j]);
            idsFiltrados.add(this.pacientes[j].id);
          }
        }
      }
    }
    return pacientesFiltrados;
  }

  filtrarUltimosTresTurnos(paciente: Paciente)
  {
    //solo los turnos que correspondan al paciente y ya esten realizados
    let turnosFiltrados = this.turnos.filter((turno: any) => turno.idPaciente === paciente.id && turno.estado == 'realizado');
    //ordenar turnos por fecha descendente
    let turnosOrdenados = turnosFiltrados.sort((a: any, b: any) => this.tiempo.fechaADate(b.fecha).getTime() - this.tiempo.fechaADate(a.fecha).getTime());
    //primeros 3 turnos
    return turnosOrdenados.slice(0, 3);
  }

  mostrarModalHistoriaClinica(paciente: Paciente)
  {
    this.pacienteSeleccionado = paciente;
    const modal: any = new Modal(this.modalHistoriaClinica.nativeElement);
    modal.show();
  }

  mostrarModalDetallePaciente(paciente: Paciente)
  {
    this.pacienteSeleccionado = paciente;
    const modal: any = new Modal(this.modalDetallePaciente.nativeElement);
    modal.show();
  }

  objectKeys(obj: any)
  {
    return Object.keys(obj);
  }

  mostrarSpinner()
  {
    this.claseSpinner = "spinner-activado";
  }

  ocultarSpinner()
  {
    this.claseSpinner = "spinner-desactivado";
  }
}
