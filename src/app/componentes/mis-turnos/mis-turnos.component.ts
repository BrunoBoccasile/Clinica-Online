import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Turno } from '../../entidades/turno';
import { EspecialistasService } from '../../servicios/especialistas.service';
import { TurnosService } from '../../servicios/turnos.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MinutosAHoraPipePipe } from '../../pipes/minutos-a-hora-pipe.pipe';
import { Modal } from 'bootstrap';
import { EspecialidadesService } from '../../servicios/especialidades.service';
import { Especialidad } from '../../entidades/especialidad';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TablaEspecialistasComponent } from '../tabla-especialistas/tabla-especialistas.component';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { SweetAlert } from '../../clases/sweetAlert';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { TablaPacientesComponent } from '../tabla-pacientes/tabla-pacientes.component';
import { PacientesService } from '../../servicios/pacientes.service';

@Component({
  selector: 'app-mis-turnos',
  standalone: true,
  imports: [SpinnerComponent, MinutosAHoraPipePipe, FormsModule, TablaEspecialistasComponent, NgIf, NgClass, ReactiveFormsModule, NgFor, TablaPacientesComponent],
  templateUrl: './mis-turnos.component.html',
  styleUrl: './mis-turnos.component.css'
})
export class MisTurnosComponent implements OnInit, OnDestroy
{
  public turnos!: Array<any> | null;
  public especialidades!: Array<Especialidad>
  public obtenerEspecialidadesSub!: Subscription;
  public especialidadSeleccionada!: string;
  public especialistaSeleccionado!: string;
  public pacienteSeleccionado!: string;
  public hayTurnos = false;
  public turnosListos = false;
  public autenticacionLista = false;
  @ViewChild('modalFiltroEspecialidades') modalFiltroEspecialidades!: ElementRef;
  @ViewChild('modalFiltroEspecialistas') modalFiltroEspecialistas!: ElementRef;
  @ViewChild('modalFiltroPacientes') modalFiltroPacientes!: ElementRef;

  @ViewChild('modalAccionesTurno') modalAccionesTurno!: ElementRef;
  public mostrarBotonesAcciones = {
    cancelar: false,
    verResena: false,
    completarEncuesta: false,
    calificarAtencion: false,
    rechazarTurno: false,
    aceptarTurno: false,
    finalizarTurno: false
  }
  public turnoSeleccionado!: any;
  public filtrosActivos: { [key: string]: string } = {};
  public claseSpinner = "spinner-desactivado";
  public suscripcionActual!: Subscription;
  public motivosCancelacion!: string | null;
  public preguntasEncuesta =
    [
      { number: 1, question: '¿El sistema le brindó una buena experiencia?' },
      { number: 2, question: '¿El personal de recepción cumplió su trabajo de forma eficiente?' },
      { number: 3, question: '¿Volvería a sacar un turno en nuestra clínica?' },
      { number: 4, question: '¿Está conforme con el trato del médico en la consulta?' },
      { number: 5, question: '¿El tiempo de espera antes de ser atendido fue razonable?' },
      { number: 6, question: '¿La limpieza de las instalaciones fue adecuada?' }
    ]
  public formEncuesta!: FormGroup;
  public swal: SweetAlert = new SweetAlert(this.router);

  constructor(public pacientesService: PacientesService, public authService: AuthService, public router: Router, public fb: FormBuilder, public especialistasService: EspecialistasService, public turnosService: TurnosService, public especialidadesService: EspecialidadesService) { }

  ngOnInit(): void
  {
    this.mostrarSpinner();
    this.authService.esperarCargarUsuario().then(() =>
    {
      this.ocultarSpinner();
      this.autenticacionLista = true;
      this.traerTurnos();

      this.especialidadesService.obtenerEspecialidades();
      this.obtenerEspecialidadesSub = this.especialidadesService.obtenerEspecialidadesSubject.subscribe(status =>
      {
        if (status)
        {
          this.especialidades = this.especialidadesService.coleccionEspecialidades;
        }
      }
      )


      this.formEncuesta = this.fb.group({
        question1: ['', [Validators.required]],
        question2: ['', [Validators.required]],
        question3: ['', [Validators.required]],
        question4: ['', [Validators.required]],
        question5: ['', [Validators.required]],
        question6: ['', [Validators.required]],
      })
    })
  }

  ngOnDestroy(): void
  {
    if (this.suscripcionActual)
    {
      this.suscripcionActual.unsubscribe();
    }
    this.obtenerEspecialidadesSub.unsubscribe();
  }

  traerTurnos()
  {
    this.mostrarSpinner();

    if (this.suscripcionActual)
    {
      this.suscripcionActual.unsubscribe();
    }
    let campoId;
    if (this.authService.tipoUsuario == "paciente")
    {
      campoId = "idPaciente";
    }
    else
    {
      campoId = "idEspecialista";
    }
    this.suscripcionActual = this.turnosService.obtenerTurnosByField(campoId, this.authService.usuarioLogeado.id).subscribe({
      next: (res) =>
      {
        this.turnos = res;
        this.turnosListos = true;
        if (res.length > 0)
        {
          this.hayTurnos = true;
        }
        else
        {
          this.hayTurnos = false;
        }
        this.ocultarSpinner();
      }
    });
  }
  mostrarModalFiltroEspecialidades()
  {
    const modal: any = new Modal(this.modalFiltroEspecialidades.nativeElement);
    modal.show();
  }

  mostrarModalFiltroEspecialistas()
  {
    const modal: any = new Modal(this.modalFiltroEspecialistas.nativeElement);
    modal.show();
  }

  mostrarModalFiltroPacientes()
  {
    const modal: any = new Modal(this.modalFiltroPacientes.nativeElement);
    modal.show();
  }
  mostrarModalAccionesTurno(turno: any)
  {
    this.turnoSeleccionado = turno;
    this.mostrarBotonesAcciones = {
      cancelar: false,
      verResena: false,
      completarEncuesta: false,
      calificarAtencion: false,
      rechazarTurno: false,
      aceptarTurno: false,
      finalizarTurno: false
    }


    if (turno.estado == "pendiente")
    {
      this.mostrarBotonesAcciones.cancelar = true;
    }
    if (turno.resena)
    {
      this.mostrarBotonesAcciones.verResena = true;
    }
    if (turno.resena && turno.estado == "realizado" && !turno.encuesta && this.authService.tipoUsuario == "paciente")
    {


      this.mostrarBotonesAcciones.completarEncuesta = true;
    }
    if (turno.estado == "realizado" && !turno.calificacion && this.authService.tipoUsuario == "paciente")
    {
      //estrellas + comentario
      this.mostrarBotonesAcciones.calificarAtencion = true;
    }
    if (turno.estado == "pendiente" && this.authService.tipoUsuario == "especialista")
    {
      this.mostrarBotonesAcciones.rechazarTurno = true;
      this.mostrarBotonesAcciones.aceptarTurno = true;
    }
    if (turno.estado == "aceptado" && this.authService.tipoUsuario == "especialista")
    {
      this.mostrarBotonesAcciones.finalizarTurno = true;
    }


    const modal: any = new Modal(this.modalAccionesTurno.nativeElement);
    modal.show();
  }

  cancelarTurno()
  {
    this.mostrarSpinner();

    if (this.motivosCancelacion)
    {

      this.turnosService.cancelarTurno(this.turnoSeleccionado.id, this.motivosCancelacion).then(() =>
      {
        this.ocultarSpinner();
        this.motivosCancelacion = null;
      });
    }
  }

  cambiarEstadoTurno(estado: string)
  {
    this.mostrarSpinner();

    this.turnosService.setTurnoField(this.turnoSeleccionado.id, "estado", estado).then(() => {
      this.ocultarSpinner();
    })
  }


  enviarEncuesta()
  {
    this.mostrarSpinner();
    let encuesta = {
      question1: this.question1?.value,
      question2: this.question2?.value,
      question3: this.question3?.value,
      question4: this.question4?.value,
      question5: this.question5?.value,
      question6: this.question6?.value
    }
    console.log(encuesta);
    this.turnosService.setTurnoField(this.turnoSeleccionado.id, 'encuesta', encuesta).then(() =>
    {
      this.swal.mostrarMensajeExito('¡Encuesta enviada con éxito!', 'Presione Ok para continuar');
      this.ocultarSpinner();
    })
  }

  limpiarFiltros()
  {
    this.filtrosActivos = {};
    this.especialidadSeleccionada = '';
    this.especialistaSeleccionado = '';
    this.traerTurnos();
  }

  establecerFiltro(filter: string, field: string)
  {
    switch (filter)
    {
      case 'especialidad':
        this.especialidadSeleccionada = field;
        break;
      case 'idEspecialista':
        console.log(field);
        this.especialistasService.obtenerEspecialistaPorId(field).then((res) =>
        {
          this.especialistaSeleccionado = `${res?.nombre} ${res?.apellido}`
        });
        break;
      case 'idPaciente':
        console.log(field);
        this.pacientesService.obtenerPacientePorId(field).then((res) =>
        {
          this.pacienteSeleccionado = `${res?.nombre} ${res?.apellido}`
        });
        break;
    }

    this.filtrosActivos[filter] = field;

    const fields = Object.keys(this.filtrosActivos);
    const values = Object.values(this.filtrosActivos);

    this.filtrarTurnos(fields, values);
  }

  filtrarTurnos(fields: string[], values: string[])
  {
    this.turnosListos = false;
    this.mostrarSpinner();
    this.suscripcionActual.unsubscribe();

    let metodo;
    if (this.authService.tipoUsuario == "paciente")
    {

      console.log(this.authService.usuarioLogeado.id)
      this.suscripcionActual = this.turnosService.obtenerTurnosPorPacienteYFields(this.authService.usuarioLogeado.id, fields, values).subscribe({
        next: (res) =>
        {
          this.turnos = res;
          this.turnosListos = true;
          if (res.length > 0)
          {
            this.hayTurnos = true;
          }
          else
          {
            this.hayTurnos = false;
          }
          this.ocultarSpinner();
        }
      });

    }
    else if (this.authService.tipoUsuario == "especialista")
    {

      console.log(this.authService.usuarioLogeado.id)
      this.suscripcionActual = this.turnosService.obtenerTurnosPorEspecialistaYFields(this.authService.usuarioLogeado.id, fields, values).subscribe({
        next: (res) =>
        {
          this.turnos = res;
          this.turnosListos = true;
          if (res.length > 0)
          {
            this.hayTurnos = true;
          }
          else
          {
            this.hayTurnos = false;
          }
          this.ocultarSpinner();
        }
      });

    }




  }











  mostrarSpinner()
  {
    this.claseSpinner = "spinner-activado";
  }

  ocultarSpinner()
  {
    this.claseSpinner = "spinner-desactivado";
  }






  get question1()
  {
    return this.formEncuesta.get('question1');
  }
  get question2()
  {
    return this.formEncuesta.get('question2');
  }
  get question3()
  {
    return this.formEncuesta.get('question3');
  }
  get question4()
  {
    return this.formEncuesta.get('question4');
  }
  get question5()
  {
    return this.formEncuesta.get('question5');
  }
  get question6()
  {
    return this.formEncuesta.get('question6');
  }
}
