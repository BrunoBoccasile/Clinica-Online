import { Component, ElementRef, ViewChild } from '@angular/core';
import { Paciente } from '../../entidades/paciente';
import { AuthService } from '../../servicios/auth.service';
import { TurnosService } from '../../servicios/turnos.service';
import { Subscription } from 'rxjs';
import { Tiempo } from '../../clases/tiempo';
import { Modal } from 'bootstrap';
import { NgClass } from '@angular/common';
import { SpinnerComponent } from '../spinner/spinner.component';
import { CapitalizePipePipe } from '../../pipes/capitalize-pipe.pipe';
import { MinutosAHoraPipePipe } from '../../pipes/minutos-a-hora-pipe.pipe';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-pdf-atenciones',
  standalone: true,
  imports: [NgClass, SpinnerComponent, CapitalizePipePipe, MinutosAHoraPipePipe],
  templateUrl: './pdf-atenciones.component.html',
  styleUrl: './pdf-atenciones.component.css'
})
export class PdfAtencionesComponent
{
  public claseSpinner = 'spinner-desactivado';
  public paciente!: Paciente;
  public suscripcionTurnos!: Subscription;
  public turnos!: any;
  public fechaActual!: string;
  public tituloInforme!: string;
  public tiempo: Tiempo = new Tiempo();
  @ViewChild('modalEspecialidades') modalEspecialidades!: ElementRef;
  public especialidades: string[] = [];
  public especialidadSeleccionada!: string;


  constructor(public authService: AuthService, public turnosService: TurnosService) { }

  ngOnInit(): void
  {
    this.mostrarSpinner();
    this.authService.esperarCargarUsuario().then(() =>
    {
      this.fechaActual = this.tiempo.getFechaActual();
      this.paciente = this.authService.usuarioLogeado;
      this.suscripcionTurnos = this.turnosService.obtenerTurnosPorPacienteYFields(this.authService.usuarioLogeado.id, ['estado'], ['realizado']).subscribe({
        next: (res) =>
        {
          this.turnos = res;
          this.suscripcionTurnos.unsubscribe();
          this.obtenerEspecialidadesDelPaciente();
          this.ocultarSpinner();
        }
      })
      this.mostrarModalEspecialidades();
    })
  }

  seleccionarEspecialidad(especialidad: string)
  {
    this.tituloInforme = `Atenciones de ${this.authService.usuarioLogeado.nombre} ${this.authService.usuarioLogeado.apellido} DNI ${this.authService.usuarioLogeado.dni} para ${especialidad}`

    this.especialidadSeleccionada = especialidad;
  }

  obtenerEspecialidadesDelPaciente() {
    let especialidadesSet = new Set(this.especialidades);
  
    for (let i = 0; i < this.turnos.length; i++) {
      if (!especialidadesSet.has(this.turnos[i].especialidad)) {
        especialidadesSet.add(this.turnos[i].especialidad);
        this.especialidades.push(this.turnos[i].especialidad);
      }
    }
  }

  ngOnDestroy(): void
  {
    if (this.suscripcionTurnos)
    {
      this.suscripcionTurnos.unsubscribe();
    }
  }

  objectKeys(obj: any)
  {
    return Object.keys(obj);
  }

  mostrarModalEspecialidades()
  {
    const modal: any = new Modal(this.modalEspecialidades.nativeElement);
    modal.show();
  }

  downloadPDF()
  {
    this.mostrarSpinner();
    const DATA: any = document.getElementById('htmlData');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3
    };
    html2canvas(DATA, options).then((canvas) => {
      const img = canvas.toDataURL('image/PNG');
      console.log("ok");
      const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() -2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      return doc;
    }).then((docResult) => {
      docResult.save('historiaclinica.pdf');
      this.ocultarSpinner();
    })

  }
  mostrarSpinner()
  {
    this.claseSpinner = 'spinner-activado';
  }

  ocultarSpinner()
  {
    this.claseSpinner = 'spinner-desactivado';
  }
}
