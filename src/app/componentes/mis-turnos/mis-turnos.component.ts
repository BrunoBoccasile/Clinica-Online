import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';
import { EspecialistasService } from '../../servicios/especialistas.service';
import { TurnosService } from '../../servicios/turnos.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MinutosAHoraPipePipe } from '../../pipes/minutos-a-hora-pipe.pipe';
import { Modal } from 'bootstrap';
import { EspecialidadesService } from '../../servicios/especialidades.service';
import { Especialidad } from '../../entidades/especialidad';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TablaEspecialistasComponent } from '../tabla-especialistas/tabla-especialistas.component';
import { LowerCasePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { SweetAlert } from '../../clases/sweetAlert';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { TablaPacientesComponent } from '../tabla-pacientes/tabla-pacientes.component';
import { PacientesService } from '../../servicios/pacientes.service';
import { Tiempo } from '../../clases/tiempo';
import { CapitalizePipePipe } from '../../pipes/capitalize-pipe.pipe';

@Component({
  selector: 'app-mis-turnos',
  standalone: true,
  imports: [CapitalizePipePipe, SpinnerComponent, MinutosAHoraPipePipe, FormsModule, TablaEspecialistasComponent, NgIf, NgClass, ReactiveFormsModule, NgFor, TablaPacientesComponent],
  templateUrl: './mis-turnos.component.html',
  styleUrl: './mis-turnos.component.css'
})
export class MisTurnosComponent implements OnInit, OnDestroy
{
  public tiempo: Tiempo = new Tiempo();
  public turnos!: Array<any> | null;
  public especialidades!: Array<Especialidad>
  public obtenerEspecialidadesSub!: Subscription;
  public especialidadSeleccionada!: string;
  public especialistaSeleccionado!: string;
  public pacienteSeleccionado!: string;
  public fechaSeleccionada!: string;
  public horaSeleccionada!: string;
  public estadoSeleccionado!: string;
  public pesoSeleccionado!: string;
  public alturaSeleccionada!: string;
  public temperaturaSeleccionada!: string;
  public presionSeleccionada!: string;
  public datosDinamicoSeleccionados = [{ setted: false, clave: '', valor: '' }, { setted: false, clave: '', valor: '' }, { setted: false,clave: '', valor: '' }];
  public hayTurnos = false;
  public turnosListos = false;
  public autenticacionLista = false;
  @ViewChild('modalFiltroEspecialidades') modalFiltroEspecialidades!: ElementRef;
  @ViewChild('modalFiltroEspecialistas') modalFiltroEspecialistas!: ElementRef;
  @ViewChild('modalFiltroPacientes') modalFiltroPacientes!: ElementRef;

  @ViewChild('modalAccionesTurno') modalAccionesTurno!: ElementRef;
  public mostrarBotonesAcciones = {
    cancelar: false,
    verCalificacion: false,
    completarEncuesta: false,
    calificarAtencion: false,
    rechazarTurno: false,
    aceptarTurno: false,
    finalizarTurno: false,
    verHistoriaClinica: false
  }
  public turnoSeleccionado!: any;
  public filtrosActivos: { [key: string]: string } = {};
  public claseSpinner = "spinner-desactivado";
  public suscripcionActual!: Subscription;
  public motivosCancelacion!: string | null;
  public motivosRechazo!: string | null;
  public preguntasEncuesta =
    [
      { number: 1, question: '¿El sistema le brindó una buena experiencia?' },
      { number: 2, question: '¿El personal de recepción cumplió su trabajo de forma eficiente?' },
      { number: 3, question: '¿Volvería a sacar un turno en nuestra clínica?' },
      { number: 4, question: '¿Está conforme con el trato del médico en la consulta?' },
      { number: 5, question: '¿El tiempo de espera antes de ser atendido fue razonable?' },
      { number: 6, question: '¿La limpieza de las instalaciones fue adecuada?' }
    ]

  public estrellas = [false, false, false, false, false];
  public datosDinamicos: Array<any> = [false, false, false];
  public datosDinamicosFiltros = [false, false, false];
  public formEncuesta!: FormGroup;
  public formCalificacion!: FormGroup;
  public formHistoriaClinica!: FormGroup;
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
      this.formCalificacion = this.fb.group({
        comentario: ['', [Validators.required]],
        estrellas: ['', [Validators.required]]
      })

      this.formHistoriaClinica = this.fb.group({
        altura: ['', [Validators.required, Validators.min(1)]],
        peso: ['', [Validators.required, Validators.min(1)]],
        temperatura: ['', [Validators.required, Validators.min(1)]],
        presion: ['', [Validators.required, Validators.min(1)]],
        claveDinamica1: [''],
        valorDinamico1: [''],
        claveDinamica2: [''],
        valorDinamico2: [''],
        claveDinamica3: [''],
        valorDinamico3: [''],
      })
    })

  }

  ngOnDestroy(): void
  {
    if (this.suscripcionActual)
    {
      this.suscripcionActual.unsubscribe();
    }
    if(this.obtenerEspecialidadesSub)
    {
      this.obtenerEspecialidadesSub.unsubscribe();
    }
  }

  traerTurnos()
  {
    this.mostrarSpinner();

    if (this.suscripcionActual)
    {
      this.suscripcionActual.unsubscribe();
    }
    if (this.authService.tipoUsuario != "administrador")
    {


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
    else
    {
      this.suscripcionActual = this.turnosService.getTurnos().subscribe({
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
      })
    }
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
      verCalificacion: false,
      completarEncuesta: false,
      calificarAtencion: false,
      rechazarTurno: false,
      aceptarTurno: false,
      finalizarTurno: false,
      verHistoriaClinica: false
    }
    console.log(turno);
    this.formCalificacion.reset();
    this.formEncuesta.reset();
    this.estrellas.forEach((estrella, i) =>
    {
      this.estrellas[i] = false;
    });
    for (let i = 0; i < this.datosDinamicos.length; i++)
    {
      this.datosDinamicos[i] = false;
    }
    this.formHistoriaClinica.reset();
    if (turno.estado == "pendiente")
    {
      this.mostrarBotonesAcciones.cancelar = true;
    }
    if (turno.calificacion && this.authService.tipoUsuario != "administrador")
    {
      this.mostrarBotonesAcciones.verCalificacion = true;
    }
    if (turno.calificacion && turno.estado == "realizado" && !turno.encuesta && this.authService.tipoUsuario == "paciente")
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
    if(turno.estado == "realizado" && turno.historiaClinica)
    {
      this.mostrarBotonesAcciones.verHistoriaClinica = true;
    }

    console.log(this.mostrarBotonesAcciones);
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
        this.swal.mostrarMensajeExito(`¡Turno cancelado con éxito!`, 'Presione Ok para continuar');

        this.motivosCancelacion = null;
      });
    }
  }

  rechazarTurno()
  {
    this.mostrarSpinner();

    if (this.motivosRechazo)
    {

      this.turnosService.rechazarTurno(this.turnoSeleccionado.id, this.motivosRechazo).then(() =>
      {
        this.ocultarSpinner();
        this.swal.mostrarMensajeExito(`¡Turno rechazado con éxito!`, 'Presione Ok para continuar');

        this.motivosRechazo = null;
      });
    }
  }

  cambiarEstadoTurno(estado: string)
  {
    this.mostrarSpinner();

    this.turnosService.setTurnoField(this.turnoSeleccionado.id, "estado", estado).then(() =>
    {
      this.swal.mostrarMensajeExito(`¡Ahora el turno está ${estado}!`, 'Presione Ok para continuar');

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

  enviarCalificacion()
  {
    this.mostrarSpinner();
    this.turnosService.calificarTurno(this.turnoSeleccionado.id, this.comentarioCalificacion?.value, this.estrellasCalificacion?.value).then(() =>
    {
      this.swal.mostrarMensajeExito('¡Calificación enviada con éxito!', 'Presione Ok para continuar');
      this.ocultarSpinner();
    })
  }

  establecerEstrellas(indice: number)
  {
    this.estrellas.forEach((estrella, i) =>
    {
      this.estrellas[i] = false;

    })


    this.estrellas.forEach((estrella, i) =>
    {
      if (i <= indice)
      {
        this.estrellas[i] = !this.estrellas[i];
      }
    });

    this.formCalificacion.patchValue({
      estrellas: indice + 1
    })
  }

  limpiarFiltros()
  {
    this.filtrosActivos = {};
    this.especialidadSeleccionada = '';
    this.especialistaSeleccionado = '';
    this.pacienteSeleccionado = '';
    this.fechaSeleccionada = '';
    this.horaSeleccionada = '';
    this.estadoSeleccionado = '';
    this.pesoSeleccionado = '';
    this.alturaSeleccionada = '';
    this.temperaturaSeleccionada = '';
    this.presionSeleccionada = '';
    for(let i=0 ; i<this.datosDinamicosFiltros.length ; i++)
    {
      this.datosDinamicosFiltros[i] = false;
    }
    for(let i=0 ; i<this.datosDinamicoSeleccionados.length ; i++)
    {
      this.datosDinamicoSeleccionados[i].clave = '';
      this.datosDinamicoSeleccionados[i].valor = '';
      this.datosDinamicoSeleccionados[i].setted = false;

    }

    this.traerTurnos();
  }

  establecerFiltro(filter: string, field: any)
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
        case 'hora':
          field = this.tiempo.horaAMinutos(field);
        break;
    }

    console.log(`${filter}:${field}`)
    this.filtrosActivos[filter] = field;

    const fields = Object.keys(this.filtrosActivos);
    const values = Object.values(this.filtrosActivos);

    this.filtrarTurnos(fields, values);
  }

  setearClaveDinamica(indice: number)
  {
    this.datosDinamicoSeleccionados[indice].setted = true;
  }
  filtrarTurnos(fields: string[], values: string[])
  {
    this.turnosListos = false;
    this.mostrarSpinner();
    if(this.suscripcionActual)
    {
      this.suscripcionActual.unsubscribe();
    }

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
    else if (this.authService.tipoUsuario == "administrador")
    {
      this.suscripcionActual = this.turnosService.obtenerTurnosPorFields(fields, values).subscribe({
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
      })
    }

  }


  agregarDatoDinamico()
  {
    for (let i = 0; i < this.datosDinamicos.length; i++)
    {
      if (!this.datosDinamicos[i])
      {
        this.datosDinamicos[i] = true;
        break;
      }
    }

  }

  agregarDatoDinamicoFiltro()
  {
    for (let i = 0; i < this.datosDinamicosFiltros.length; i++)
    {
      if (!this.datosDinamicosFiltros[i])
      {
        this.datosDinamicosFiltros[i] = true;
        break;
      }
    }

  }
  finalizarTurno()
  {
    let historiaClinica: any = {
      altura: this.altura?.value,
      peso: this.peso?.value,
      temperatura: this.temperatura?.value,
      presion: this.presion?.value
    };

    if (this.claveDinamica1?.value && this.valorDinamico1?.value)
    {
      historiaClinica[this.claveDinamica1.value.toLowerCase()] = this.valorDinamico1.value;
    }

    if (this.claveDinamica2?.value && this.valorDinamico2?.value)
    {
      historiaClinica[this.claveDinamica2.value.toLowerCase()] = this.valorDinamico2.value;
    }
    if (this.claveDinamica3?.value && this.valorDinamico3?.value)
    {
      historiaClinica[this.claveDinamica3.value.toLowerCase()] = this.valorDinamico3.value;
    }
    console.log(historiaClinica);

    this.mostrarSpinner();
    Promise.all([
      this.turnosService.setTurnoField(this.turnoSeleccionado.id, 'historiaClinica', historiaClinica),
      this.turnosService.setTurnoField(this.turnoSeleccionado.id, 'estado', 'realizado')
    ]).then(() =>
    {
      this.ocultarSpinner();
      this.swal.mostrarMensajeExito('¡Turno finalizado con éxito!', 'Presione Ok para continuar');

    });
  }


  objectKeys(obj: any) {
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

  get comentarioCalificacion()
  {
    return this.formCalificacion.get('comentario');
  }

  get estrellasCalificacion()
  {
    return this.formCalificacion.get('estrellas');
  }

  get peso()
  {
    return this.formHistoriaClinica.get('peso');
  }
  get temperatura()
  {
    return this.formHistoriaClinica.get('temperatura');
  }
  get altura()
  {
    return this.formHistoriaClinica.get('altura');
  }
  get presion()
  {
    return this.formHistoriaClinica.get('presion');
  }
  get claveDinamica1()
  {
    return this.formHistoriaClinica.get('claveDinamica1');
  }
  get claveDinamica2()
  {
    return this.formHistoriaClinica.get('claveDinamica2');
  }
  get claveDinamica3()
  {
    return this.formHistoriaClinica.get('claveDinamica3');
  }
  get valorDinamico1()
  {
    return this.formHistoriaClinica.get('valorDinamico1');
  }
  get valorDinamico2()
  {
    return this.formHistoriaClinica.get('valorDinamico2');
  }
  get valorDinamico3()
  {
    return this.formHistoriaClinica.get('valorDinamico3');
  }

}
