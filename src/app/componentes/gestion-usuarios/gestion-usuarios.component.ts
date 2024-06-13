import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TablaPacientesComponent } from '../tabla-pacientes/tabla-pacientes.component';
import { TablaEspecialistasComponent } from '../tabla-especialistas/tabla-especialistas.component';
import { Modal } from 'bootstrap'
import { EspecialistasService } from '../../servicios/especialistas.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { tipoArchivoValidator } from '../../validators/tipoarchivo';
import { Paciente } from '../../entidades/paciente';
import { AuthService } from '../../servicios/auth.service';
import '../../clases/sweetAlert'
import { SweetAlert } from '../../clases/sweetAlert';
import { Router } from '@angular/router';
import { StorageService } from '../../servicios/storage.service';
import { getAuth, sendEmailVerification } from '@angular/fire/auth';
import { PacientesService } from '../../servicios/pacientes.service';
import { Especialista } from '../../entidades/especialista';
import { EspecialidadesService } from '../../servicios/especialidades.service';
import { Especialidad } from '../../entidades/especialidad';
import { Subscription } from 'rxjs';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [TablaPacientesComponent, TablaEspecialistasComponent, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './gestion-usuarios.component.html',
  styleUrl: './gestion-usuarios.component.css'
})
export class GestionUsuariosComponent implements OnInit
{
  idEspecialistaSeleccionado: string;
  @ViewChild('staticBackdrop') staticBackdrop!: ElementRef;
  formPaciente!: FormGroup;
  formEspecialista!: FormGroup;
  formEspecialidad!: FormGroup;

  eventoImagen1: any;
  eventoImagen2: any;
  eventoImagenEsp: any;
  swal: SweetAlert = new SweetAlert(this.router);
  tipoRegistro: string;
  especialidades: Array<Especialidad>;
  especialidadesObtenidas: boolean;
  obtenerEspecialidadesSub!: Subscription;
  constructor(public especialidadesService: EspecialidadesService, public fb: FormBuilder ,public especialistasService: EspecialistasService, public authService: AuthService, public router: Router, public storageService: StorageService, public pacientesService: PacientesService)
  {
    this.idEspecialistaSeleccionado = "";
    this.tipoRegistro = "paciente";
    this.especialidades = [];
    this.especialidadesObtenidas = false;
    this.limpiarEventosImagen();
  }
ngOnInit(): void
{
  this.formPaciente = this.fb.group({
    dni: ['', [Validators.min(1000000), Validators.required]],
    nombre: ['', [Validators.pattern("^[A-Za-zÁÉÍÓÚáéíóúÑñÜü -]{1,50}$"), Validators.required]],
    apellido: ['', [Validators.pattern("^[A-Za-zÁÉÍÓÚáéíóúÑñÜü -]{1,50}$"), Validators.required]],
    edad: ['', [Validators.min(18), Validators.required]],
    obraSocial: ['', [Validators.pattern("^[A-Za-zÁÉÍÓÚáéíóúÑñÜü -]{1,50}$"), Validators.required]],
    mail: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.minLength(6), Validators.required]],
    imagen1: ['', [tipoArchivoValidator(['jpg', 'jpeg', 'png']), Validators.required]],
    imagen2: ['', [tipoArchivoValidator(['jpg', 'jpeg', 'png']), Validators.required]]
  })

  this.formEspecialista = this.fb.group({
    dni: ['', [Validators.min(1000000), Validators.required]],
    nombre: ['', [Validators.pattern("^[A-Za-zÁÉÍÓÚáéíóúÑñÜü -]{1,50}$"), Validators.required]],
    apellido: ['', [Validators.pattern("^[A-Za-zÁÉÍÓÚáéíóúÑñÜü -]{1,50}$"), Validators.required]],
    edad: ['', [Validators.min(18), Validators.required]],
    especialidad: ['', [Validators.pattern("^[A-Za-zÁÉÍÓÚáéíóúÑñÜü -]{1,50}$"), Validators.required]],
    mail: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.minLength(6), Validators.required]],
    imagen: ['', [tipoArchivoValidator(['jpg', 'jpeg', 'png']), Validators.required]],
  })
  this.formEspecialidad = this.fb.group({
    nombre: ['', [Validators.pattern("^[A-Za-zÁÉÍÓÚáéíóúÑñÜü -]{1,50}$"), Validators.required]]
  })
  
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
  recibirIdEspecialista(id: string)
  {
    this.idEspecialistaSeleccionado = id;
    this.mostrarModal();
  }

  mostrarModal()
  {
    const modal: any = new Modal(this.staticBackdrop.nativeElement);
    modal.show();
  }

  aprobarEspecialista(id: string)
  {
    this.especialistasService.aprobarEspecialista(id);
  }

  desaprobarEspecialista(id: string)
  {
    this.especialistasService.desaprobarEspecialista(id);
  }

  
  cambiarTipoRegistro(tipoRegistro: string)
  {
    this.tipoRegistro = tipoRegistro;
  }
  enviarFormEspecialidad()
  {

    if (this.formEspecialidad.valid)
    {
      let especialidad: Especialidad = {
        nombre: this.nombreEspecialidad?.value
      }
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
  
  enviarFormEspecialista()
  {
    if (this.formEspecialista.valid)
      {
        let especialista: Especialista = {
          dni: this.dniEspecialista?.value,
          nombre: this.nombreEspecialista?.value,
          apellido: this.apellidoEspecialista?.value,
          edad: this.edadEspecialista?.value,
          especialidad: this.especialidadEspecialista?.value,
          mail: this.mailEspecialista?.value,
          password: this.passwordEspecialista?.value
        };
  
        // Registro del usuario
        this.authService.registerAdmin(especialista.mail, especialista.password).then(response =>
        {
          console.log(response);
          this.swal.mostrarMensajeExito("Cuenta creada con exito", "El usuario registrado deberá verificar su mail.");
  
          // Enviar verificación de mail
          sendEmailVerification(response.user).then(() =>
          {
            console.log('Verificacion de email enviada');
          }).catch(error =>
          {
            console.log('Error enviando la verificacion de email:', error);
          });
  
          // Subir imágenes a Firebase Storage

          this.storageService.subirImagen(this.eventoImagenEsp, 'especialistas/' + especialista.mail).then(() =>
          {
            console.log('La imagene se subió correctamente.');
            // Guardar datos del especialista en Firestore
            this.especialistasService.guardarEspecialista(especialista);
            // Reseteo de eventos de las imágenes
            this.limpiarEventosImagen();
            // Reseteo del formulario
            this.formPaciente.reset();
            this.formEspecialista.reset();
          }).catch(error =>
          {
            console.log('Error al subir las imagenes:', error);
          });
        }).catch(error =>
        {
          console.log(error);
          this.swal.mostrarMensajeError("Error", this.authService.traducirErrorCode(error.code));
        });
      } else
      {
        this.formEspecialista.markAllAsTouched();
      }
  }

  enviarFormPaciente()
  {
    if (this.formPaciente.valid)
    {
      let paciente: Paciente = {
        dni: this.dniPaciente?.value,
        nombre: this.nombrePaciente?.value,
        apellido: this.apellidoPaciente?.value,
        edad: this.edadPaciente?.value,
        obraSocial: this.obraSocialPaciente?.value,
        mail: this.mailPaciente?.value,
        password: this.passwordPaciente?.value
      };

      // Registro del usuario
      this.authService.registerAdmin(paciente.mail, paciente.password).then(response =>
      {
        console.log(response);
        this.swal.mostrarMensajeExito("Cuenta creada con exito", "El usuario registrado deberá verificar su mail.");

        // Enviar verificación de mail
        sendEmailVerification(response.user).then(() =>
          {
            console.log('Verificacion de email enviada');
          }).catch(error =>
          {
            console.log('Error enviando la verificacion de email:', error);
          });

        // Subir imágenes a Firebase Storage
        const promesasUpload = [];
        promesasUpload.push(this.storageService.subirImagen(this.eventoImagen1, 'pacientes/' + paciente.mail + '/1'));
        promesasUpload.push(this.storageService.subirImagen(this.eventoImagen2, 'pacientes/' + paciente.mail + '/2'));

        Promise.all(promesasUpload).then(() =>
        {
          console.log('Las imagenes se subieron correctamente.');
          // Guardar datos del paciente en Firestore
          this.pacientesService.guardarPaciente(paciente);
          // Reseteo de eventos de las imágenes
          this.limpiarEventosImagen();
          // Reseteo del formulario
          this.formPaciente.reset();
          this.formEspecialista.reset();
        }).catch(error =>
        {
          console.log('Error al subir las imagenes:', error);
        });
      }).catch(error =>
      {
        console.log(error);
        this.swal.mostrarMensajeError("Error", this.authService.traducirErrorCode(error.code));
      });
    } else
    {
      this.formPaciente.markAllAsTouched();
    }
  }

  seleccionarEspecialidad(especialidad: Especialidad)
  {
    this.formEspecialista.patchValue({
      especialidad: especialidad.nombre,
    });
  }

  //EVENTOS IMAGEN___________________________________________________________________________________________________________________________________________________________

  guardarEventoImagen(evento: any, numeroImagen?: number)
  {
    switch (numeroImagen)
    {
      case 1:
        this.eventoImagen1 = evento;
        break;
      case 2:
        this.eventoImagen2 = evento;
        break;
      default:
        this.eventoImagenEsp = evento;
        break;
    }
  }

  limpiarEventosImagen()
  {
    this.eventoImagen1 = null;
    this.eventoImagen2 = null;
    this.eventoImagenEsp = null;
  }
   //GETTERS_______________________________________________________________________________________________________________________________________________________________________
   get dniPaciente()
   {
     return this.formPaciente.get('dni');
   }
   get nombrePaciente()
   {
     return this.formPaciente.get('nombre');
   }
   get apellidoPaciente()
   {
     return this.formPaciente.get('apellido');
   }
   get edadPaciente()
   {
     return this.formPaciente.get('edad');
   }
   get obraSocialPaciente()
   {
     return this.formPaciente.get('obraSocial');
   }
   get mailPaciente()
   {
     return this.formPaciente.get('mail');
   }
   get passwordPaciente()
   {
     return this.formPaciente.get('password');
   }
   get imagen1Paciente()
   {
     return this.formPaciente.get('imagen1');
   }
   get imagen2Paciente()
   {
     return this.formPaciente.get('imagen2');
   }
   get dniEspecialista()
   {
     return this.formEspecialista.get('dni');
   }
   get nombreEspecialista()
   {
     return this.formEspecialista.get('nombre');
   }
   get apellidoEspecialista()
   {
     return this.formEspecialista.get('apellido');
   }
   get edadEspecialista()
   {
     return this.formEspecialista.get('edad');
   }
   get especialidadEspecialista()
   {
     return this.formEspecialista.get('especialidad');
   }
   get mailEspecialista()
   {
     return this.formEspecialista.get('mail');
   }
   get passwordEspecialista()
   {
     return this.formEspecialista.get('password');
   }
   get imagenEspecialista()
   {
     return this.formEspecialista.get('imagen');
   }
   get nombreEspecialidad()
   {
     return this.formEspecialidad.get('nombre');
   }
}
