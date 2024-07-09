import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { NgClass } from '@angular/common';
import { TurnosService } from '../../servicios/turnos.service';
import { Paciente } from '../../entidades/paciente';
import { Subscription } from 'rxjs';
import { CapitalizePipePipe } from '../../pipes/capitalize-pipe.pipe';
import { Tiempo } from '../../clases/tiempo';
import {jsPDF} from "jspdf";
import html2canvas from "html2canvas";

@Component({
  selector: 'app-pdf-historia-clinica',
  standalone: true,
  imports: [SpinnerComponent, NgClass, CapitalizePipePipe],
  templateUrl: './pdf-historia-clinica.component.html',
  styleUrl: './pdf-historia-clinica.component.css'
})
export class PdfHistoriaClinicaComponent implements OnInit, OnDestroy{
public  claseSpinner = 'spinner-desactivado';
constructor(public authService: AuthService, public turnosService: TurnosService){}
public paciente!: Paciente;
public suscripcionTurnos!: Subscription;
public turnos!: any;
public fechaActual!: string;
public tituloInforme!: string;
public tiempo: Tiempo = new Tiempo();
ngOnInit(): void
{
  this.mostrarSpinner();
  this.authService.esperarCargarUsuario().then(() => {
    this.fechaActual = this.tiempo.getFechaActual();
    this.paciente = this.authService.usuarioLogeado; 
    this.tituloInforme = `Historia clínica de ${this.authService.usuarioLogeado.nombre} ${this.authService.usuarioLogeado.apellido} DNI ${this.authService.usuarioLogeado.dni}`
    this.suscripcionTurnos = this.turnosService.obtenerTurnosPorFields(['idPaciente'], [this.authService.usuarioLogeado.id]).subscribe({
      next: (res) => {
        this.turnos = res;
          this.suscripcionTurnos.unsubscribe();
        }
      })
      
      this.ocultarSpinner();
  })
}

ngOnDestroy(): void
{
  if(this.suscripcionTurnos)
  {
    this.suscripcionTurnos.unsubscribe();
  }
}

downloadPDF(): void {
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

objectKeys(obj: any) {
  return Object.keys(obj);
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
