import { Component, ElementRef, OnDestroy, OnInit, viewChild, ViewChild } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { PacientesService } from '../../servicios/pacientes.service';
import { AdministradoresService } from '../../servicios/administradores.service';
import { EspecialistasService } from '../../servicios/especialistas.service';
import { StorageService } from '../../servicios/storage.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { NgClass, NgIf } from '@angular/common';
import { ArrayToStringPipePipe } from '../../pipes/array-to-string-pipe.pipe';
import { Modal } from 'bootstrap';
import { EspecialidadesService } from '../../servicios/especialidades.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SweetAlert } from '../../clases/sweetAlert';
import { Router } from '@angular/router';
import { MinutosAHoraPipePipe } from '../../pipes/minutos-a-hora-pipe.pipe';
import { Disponibilidad } from '../../entidades/disponibilidad';
import { Especialidad } from '../../entidades/especialidad';
import { TurnosService } from '../../servicios/turnos.service';
import { CapitalizePipePipe } from '../../pipes/capitalize-pipe.pipe';
@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [SpinnerComponent, NgIf, ArrayToStringPipePipe, ReactiveFormsModule, FormsModule, MinutosAHoraPipePipe, NgClass, CapitalizePipePipe],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent implements OnInit, OnDestroy
{
  usuarioActual: any;
  imagenActual: string;
  imagenActual2: string;
  @ViewChild('modalCargarDisponibilidad') modalCargarDisponibilidad!: ElementRef;
  @ViewChild('modalAgregarEspecialidad') modalAgregarEspecialidad!: ElementRef;
  @ViewChild('modalHistoriaClinica') modalHistoriaClinica!: ElementRef;
  obtenerEspecialidadesSub!: Subscription;
  especialidades: Array<Especialidad> = [];
  especialidadesObtenidas: boolean = false;
  formEspecialidad!: FormGroup;
  formDisponibilidad!: FormGroup;
  swal: SweetAlert = new SweetAlert(this.router);
  especialidadSeleccionada: string = "";
  dias: Array<string> = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  horarios: Array<number> = [];
  claseSpinner: string = "spinner-desactivado";
  turnos!: Array<any> | null;
  suscripcionTurnos!: Subscription;
  tieneHistoriaClinica = false;
  constructor(public turnosService: TurnosService, public router: Router, public fb: FormBuilder, public especialidadesService: EspecialidadesService, public storageService: StorageService, public authService: AuthService, public administradoresService: AdministradoresService, public pacientesService: PacientesService, public especialistasService: EspecialistasService)
  {
    this.imagenActual = "";
    this.imagenActual2 = "";
    this.cargarDatos();

    this.formEspecialidad = this.fb.group({
      nombre: ['', [Validators.pattern("^[A-Za-zÁÉÍÓÚáéíóúÑñÜü -]{1,50}$"), Validators.required]]
    })

    this.formDisponibilidad = this.fb.group({
      dia: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required]
    })

    for (let i = 480; i <= 1140; i = i + 30)
    {
      this.horarios.push(i);
    }
  }

  ngOnDestroy(): void
  {
    if(this.suscripcionTurnos)
    {
      this.suscripcionTurnos.unsubscribe();
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

  objectKeys(obj: any) {
    return Object.keys(obj);
}


  cargarDatos()
  {
    if (this.authService.auth.currentUser?.email)
    {

      switch (this.authService.tipoUsuario)
      {
        case "administrador":
          this.administradoresService.obtenerAdministradorPorEmail(this.authService.auth.currentUser?.email).then(response =>
          {
            this.usuarioActual = response;
            this.storageService.obtenerImagen("administradores/" + response?.mail).then((url) =>
            {
              if (url)
              {
                this.imagenActual = url;
              }
            });
          })
          break;
        case "paciente":
          this.pacientesService.obtenerPacientePorEmail(this.authService.auth.currentUser?.email).then(response =>
          {
            this.usuarioActual = response;
            Promise.all([
              this.storageService.obtenerImagen(`pacientes/${response?.mail}/1`),
              this.storageService.obtenerImagen(`pacientes/${response?.mail}/2`)
            ]).then(([url1, url2]) =>
            {
              if (url1)
              {
                this.imagenActual = url1;
              }
              if (url2)
              {
                this.imagenActual2 = url2;
              }
            })
            this.suscripcionTurnos = this.turnosService.obtenerTurnosByField('idPaciente', response?.id).subscribe({
              next: ((turnos) => {
                this.turnos = turnos;
              })
            });
          });

          break;
        case "especialista":
          this.especialistasService.obtenerEspecialistaPorEmail(this.authService.auth.currentUser?.email).then(response =>
          {
            this.usuarioActual = response;
            this.storageService.obtenerImagen("especialistas/" + response?.mail).then((url) =>
            {
              if (url)
              {
                this.imagenActual = url;
              }
            });
          })
          break;
      }
    }
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
    })
  }
  mostrarModalCargarDisponibilidad()
  {
    const modal: any = new Modal(this.modalCargarDisponibilidad.nativeElement);
    modal.show();
  }
  mostrarModalAgregarEspecialidad()
  {
    const modal: any = new Modal(this.modalAgregarEspecialidad.nativeElement);
    modal.show();
  }
  mostrarModalHistoriaClinica()
  {
    this.tieneHistoriaClinica = false;
    if(this.turnos)
    {

      for(let i=0 ; i<this.turnos.length ; i++)
      {
        if(this.turnos[i].historiaClinica)
          {
            this.tieneHistoriaClinica = true;
            break;
          }
        }
    }
    else
    {
      this.tieneHistoriaClinica = false;
    }
      const modal: any = new Modal(this.modalHistoriaClinica.nativeElement);
    modal.show();
  }

  descargarPDF()
  {
    window.open('pdf-historia-clinica');
  }
  descargarAtenciones()
  {
    window.open('pdf-atenciones');
  }
  enviarFormEspecialidad()
  {
    if (this.formEspecialidad.valid)
    {
      let especialidad = this.nombreEspecialidad?.value;
      let especialidadExistente = false;
      this.especialidades.forEach(especialidad =>
      {
        if (this.nombreEspecialidad?.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() == especialidad.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase())
        {
          this.swal.mostrarMensajeError("Error", "Esa especialidad ya está en la lista");
          especialidadExistente = true;
        }
      });
      if (!especialidadExistente)
      {
        this.especialidadesService.guardarEspecialidad(especialidad);
        this.formEspecialidad.reset();
      }
    } else
    {
      this.formEspecialidad.markAllAsTouched();
    }
  }

  enviarFormDisponibilidad()
  {

    if (this.formDisponibilidad.valid)
    {
      let disponibilidad: Disponibilidad = {
        dia: this.dia?.value,
        horaInicio: parseInt(this.horaInicio?.value),
        horaFin: parseInt(this.horaFin?.value)
      }
      this.mostrarSpinner();
      this.especialistasService.cargarDisponibilidad(this.usuarioActual.id, disponibilidad).then(() =>
      {
        this.swal.mostrarMensajeExito("Exito", "Disponibilidad cargada con éxito");
        this.cargarDatos();
        this.formDisponibilidad.reset();
        this.ocultarSpinner();
      }).catch(() =>
      {
        this.swal.mostrarMensajeError("Error", "Ocurrio un error inesperado al cargar la disponibilidad");
        this.ocultarSpinner();
      });

    } else
    {
      this.formEspecialidad.markAllAsTouched();
    }
  }

  seleccionarEspecialidad(especialidad: string)
  {
    this.especialidadSeleccionada = especialidad;
  }

  agregarEspecialidad()
  {
    let especialidadRepetida = false;
    this.usuarioActual.especialidades.forEach((especialidad: string) =>
    {
      if (especialidad == this.especialidadSeleccionada)
      {
        this.swal.mostrarMensajeError("Error", "Ya posee la especialidad " + this.especialidadSeleccionada);
        especialidadRepetida = true;
      }
    });

    if (!especialidadRepetida)
    {
      this.mostrarSpinner();
      this.especialistasService.agregarEspecialidad(this.usuarioActual.id, this.especialidadSeleccionada).then(() =>
      {
        this.cargarDatos();
        this.ocultarSpinner();
        this.swal.mostrarMensajeExito("Exito", "Especialidad agregada con éxito");

      });
    }
    this.especialidadSeleccionada = "";
  }

  get nombreEspecialidad()
  {
    return this.formEspecialidad.get('nombre');
  }

  get dia()
  {
    return this.formDisponibilidad.get('dia');
  }
  get horaInicio()
  {
    return this.formDisponibilidad.get('horaInicio');
  }
  get horaInicioValue(): number
  {
    const control = this.formDisponibilidad.get('horaInicio');
    return control ? control.value : null;
  }
  get diaValue(): string
  {
    const control = this.formDisponibilidad.get('dia');
    return control ? control.value : null;
  }
  get horaFin()
  {
    return this.formDisponibilidad.get('horaFin');
  }
}
