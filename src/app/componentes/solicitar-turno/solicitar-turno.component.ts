import { Component, OnInit } from '@angular/core';
import { TablaEspecialistasComponent } from '../tabla-especialistas/tabla-especialistas.component';
import { EspecialidadesService } from '../../servicios/especialidades.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerComponent } from '../spinner/spinner.component';
import { MinutosAHoraPipePipe } from '../../pipes/minutos-a-hora-pipe.pipe';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Especialidad } from '../../entidades/especialidad';
import { EspecialistasService } from '../../servicios/especialistas.service';
import { Especialista } from '../../entidades/especialista';
import { StorageService } from '../../servicios/storage.service';
import { Tiempo } from '../../clases/tiempo';
import { SweetAlert } from '../../clases/sweetAlert';
import { Router } from '@angular/router';
import { TurnosService } from '../../servicios/turnos.service';
import { Turno } from '../../entidades/turno';
import { AuthService } from '../../servicios/auth.service';
import { PacientesService } from '../../servicios/pacientes.service';
import { AdministradoresService } from '../../servicios/administradores.service';
import { TablaPacientesComponent } from '../tabla-pacientes/tabla-pacientes.component';

@Component({
  selector: 'app-solicitar-turno',
  standalone: true,
  imports: [DatePipe, TablaEspecialistasComponent, ReactiveFormsModule, SpinnerComponent, MinutosAHoraPipePipe, NgFor, NgIf, MinutosAHoraPipePipe, TablaPacientesComponent],
  templateUrl: './solicitar-turno.component.html',
  styleUrl: './solicitar-turno.component.css'
})
export class SolicitarTurnoComponent implements OnInit
{
  public obtenerEspecialidadesSub!: Subscription;
  public obtenerEspecialistasSub!: Subscription;
  public especialidades!: Array<Especialidad>;
  public especialistas!: Array<Especialista>;
  public especialistasFiltrados!: Array<Especialista>;
  public secuenciaCard!: string;
  public arrayTurnosEspecialista!:
    Array<{
      fecha: string,
      horarios: { inicio: number, fin: number }
    }>;
  public tiempo: Tiempo = new Tiempo();
  public swal: SweetAlert = new SweetAlert(this.router);
  public horariosFechaSeleccionada!: Array<number>;
  public esAdmin = false;
  public horariosCargados = false;
  public opcionesSeleccionadas: {
    especialidad?: string,
    especialista?: Especialista,
    fecha?: string,
    hora?: number
  } = {};
  public idPaciente: string = "";
  constructor(public administradoresService: AdministradoresService, public pacientesService: PacientesService, public authService: AuthService, public turnosService: TurnosService, public router: Router, public storageService: StorageService, public especialistasService: EspecialistasService, public especialidadesService: EspecialidadesService) { }

  ngOnInit(): void
  {
    if (this.authService.auth.currentUser?.email)
    {
      this.administradoresService.esAdmin(this.authService.auth.currentUser?.email).then(res =>
      {
        this.esAdmin = res;
        console.log("Admin: " + this.esAdmin);
        if (res)
        {
          this.secuenciaCard = "pacientes"
        }
        else
        {
          this.secuenciaCard = "especialidades"
        }
      });
    }

    this.especialidadesService.obtenerEspecialidades();
    this.obtenerEspecialidadesSub = this.especialidadesService.obtenerEspecialidadesSubject.subscribe(status =>
    {
      if (status)
      {
        this.especialidades = this.especialidadesService.coleccionEspecialidades;
      }
    })
    this.especialistasService.obtenerEspecialistas();

    this.obtenerEspecialistasSub = this.especialistasService.obtenerEspecialistasSubject.subscribe(status =>
    {
      if (status)
      {
        this.especialistas = this.especialistasService.coleccionEspecialistas;
      }
    });
  }



  recibirIdPaciente(idPaciente: string)
  {
    this.idPaciente = idPaciente;
  }

  cambiarSecuencia(adelante: boolean)
  {
    if (adelante)
    {
      switch (this.secuenciaCard)
      {
        case "pacientes":
          this.secuenciaCard = "especialidades";
          break;
        case "especialidades":
          this.secuenciaCard = "especialistas";
          break;
        case "especialistas":
          this.secuenciaCard = "fechas";
          break;
        case "fechas":
          this.secuenciaCard = "horarios";
          break;
      }
    }
    else
    {
      switch (this.secuenciaCard)
      {
        case "especialidades":
          if (this.esAdmin)
          {
            this.secuenciaCard = "pacientes";
          }
          break;
        case "especialistas":
          this.secuenciaCard = "especialidades";
          break;
        case "fechas":
          this.secuenciaCard = "especialistas";
          break;
        case "horarios":
          this.secuenciaCard = "fechas";
          break;
      }
    }
  }

  seleccionarEspecialidad(nombreEspecialidad: string)
  {
    this.cambiarSecuencia(true);
    this.opcionesSeleccionadas.especialidad = nombreEspecialidad;
    this.especialistasFiltrados = this.especialistas.filter((especialista) =>
    {
      return especialista.especialidades.includes(nombreEspecialidad);
    });

    console.log(this.especialistasFiltrados);
    this.especialistas.forEach(especialista =>
    {
      this.storageService.obtenerImagen(`especialistas/${especialista.mail}`).then((url) =>
      {
        if (url)
        {
          especialista.imagen = url;
        }
      })
    });

  }

  seleccionarEspecialista(especialista: Especialista)
  {
    this.opcionesSeleccionadas.especialista = especialista;
    this.cambiarSecuencia(true);
    this.cargarFechasTurnos();
    this.cargarHorariosTurnos(especialista);
  }

  seleccionarFecha(turno: { fecha: string, horarios: { inicio: number, fin: number } })
  {
    this.opcionesSeleccionadas.fecha = turno.fecha;
    this.cambiarSecuencia(true);
    this.horariosFechaSeleccionada = [];
    this.horariosCargados = false;

    for (let i = turno.horarios.inicio; i < turno.horarios.fin; i = i + 30)
    {
      //si no hay un turno tomado para este horario...
      if (this.opcionesSeleccionadas.especialista?.id)
      {
        this.turnosService.obtenerTurnoPorIdEspecialistaFechaYHora(this.opcionesSeleccionadas.especialista?.id, this.opcionesSeleccionadas.fecha, i).then(res =>
        {
          if (!res)
          {
            this.horariosFechaSeleccionada.push(i);
          }
          if (i == turno.horarios.fin - 30)
          {
            this.horariosCargados = true;
          }
        })
      }
    }
  }

  seleccionarHorario(horario: number)
  {
    this.opcionesSeleccionadas.hora = horario;

    this.swal.mostrarMensajeConfirmar(
      "Confirmar turno",
      `Confirma solicitar turno con ${this.opcionesSeleccionadas.especialista?.nombre} ${this.opcionesSeleccionadas.especialista?.apellido} 
      el día ${this.opcionesSeleccionadas.fecha} a las ${this.tiempo.minutosAHora(this.opcionesSeleccionadas.hora)}?
      `
    ).then((res) =>
    {
      if (res.isConfirmed)
      {
        if (this.esAdmin)
        {
          let paciente = this.pacientesService.obtenerPacientePorId(this.idPaciente).then((res) =>
          {
            if (this.opcionesSeleccionadas.fecha && this.opcionesSeleccionadas.hora && this.opcionesSeleccionadas.especialista?.id && this.opcionesSeleccionadas.especialidad)
            {

              if (res?.nombre && res.apellido)
              {

                let turno: Turno = {
                  fecha: this.opcionesSeleccionadas.fecha,
                  hora: this.opcionesSeleccionadas.hora,
                  idEspecialista: this.opcionesSeleccionadas.especialista.id,
                  especialidad: this.opcionesSeleccionadas.especialidad,
                  idPaciente: this.idPaciente,
                  nombrePaciente: res?.nombre,
                  apellidoPaciente: res.apellido,
                  nombreEspecialista: this.opcionesSeleccionadas.especialista.nombre,
                  apellidoEspecialista: this.opcionesSeleccionadas.especialista.apellido
                }
                this.authService.auth.currentUser?.email
                this.turnosService.guardarTurno(turno);
                this.swal.mostrarMensajeExito("Turno solicitado", "¡El turno fue solicitado con éxito!");
                this.cambiarSecuencia(false);
              }
            }
          })
        }
        else
        {
          if (this.authService.auth.currentUser?.email)
          {

            this.pacientesService.obtenerPacientePorEmail(this.authService.auth.currentUser?.email).then(res =>
            {
              if (this.opcionesSeleccionadas.fecha && this.opcionesSeleccionadas.hora && this.opcionesSeleccionadas.especialista?.id && this.opcionesSeleccionadas.especialidad && res?.id) 
              {
                let turno: Turno = {
                  fecha: this.opcionesSeleccionadas.fecha,
                  hora: this.opcionesSeleccionadas.hora,
                  idEspecialista: this.opcionesSeleccionadas.especialista.id,
                  especialidad: this.opcionesSeleccionadas.especialidad,
                  nombreEspecialista: this.opcionesSeleccionadas.especialista.nombre,
                  apellidoEspecialista: this.opcionesSeleccionadas.especialista.apellido,
                  nombrePaciente: res.nombre,
                  apellidoPaciente: res.apellido,
                  idPaciente: res?.id
                }

                this.authService.auth.currentUser?.email
                this.turnosService.guardarTurno(turno);
                this.swal.mostrarMensajeExito("Turno solicitado", "¡El turno fue solicitado con éxito!");
                this.cambiarSecuencia(false);
              }
            })
          }
        }
      }
    })
  }

  cargarHorariosTurnos(especialista: Especialista)
  {
    if (especialista.disponibilidades)
    {
      especialista.disponibilidades.forEach((disponibilidad) =>
      {

        this.arrayTurnosEspecialista.forEach(turno =>
        {
          if (this.tiempo.getDia(turno.fecha) == disponibilidad.dia)
          {

            turno.horarios = { inicio: disponibilidad.horaInicio, fin: disponibilidad.horaFin }
          }
        });

      })


    }
    for (let i = this.arrayTurnosEspecialista.length - 1; i >= 0; i--)
    {
      const turno = this.arrayTurnosEspecialista[i];
      if (turno.horarios.inicio === 0 && turno.horarios.fin === 0)
      {
        this.arrayTurnosEspecialista.splice(i, 1);
      }
    }
  }



  cargarFechasTurnos()
  {
    let proximos15Dias = this.tiempo.getProximosDias(15);
    this.arrayTurnosEspecialista = proximos15Dias.map(fecha => ({
      fecha,
      horarios: { inicio: 0, fin: 0 }
    }));
  }

  onImageError(event: Event): void
  {
    const target = event.target as HTMLImageElement;
    target.src = '../../../assets/especialidades/Default.png';
  }
}
