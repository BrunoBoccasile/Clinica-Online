import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';
import { Especialista } from '../../entidades/especialista';
import { EspecialistasService } from '../../servicios/especialistas.service';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { ArrayToStringPipePipe } from '../../pipes/array-to-string-pipe.pipe';
import { NgClass } from '@angular/common';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-excel-especialistas',
  standalone: true,
  imports: [ArrayToStringPipePipe, NgClass, SpinnerComponent],
  templateUrl: './excel-especialistas.component.html',
  styleUrl: './excel-especialistas.component.css'
})
export class ExcelEspecialistasComponent {
  public suscripcion!: Subscription;
  public claseSpinner = 'spinner-desactivado';
  public especialistas!: Especialista[];

  constructor(public especialistasService: EspecialistasService, public authService: AuthService, public router: Router){}
  ngOnInit(): void
  {
    this.mostrarSpinner();
    this.authService.esperarCargarUsuario().then(() => {
      if(this.authService.tipoUsuario == 'administrador')
      {

        this.suscripcion = this.especialistasService.getEspecialistas().subscribe({
          next: (res) => {
            this.especialistas = res;
            this.ocultarSpinner();
          }
        })
      }
      else{
        console.log("no es administrador");
        this.ocultarSpinner();
        this.router.navigateByUrl('bienvenida');
      }
      })
  }

  ngOnDestroy(): void
  {
    if(this.suscripcion)
    {
      this.suscripcion.unsubscribe();
    }
  }
  mostrarSpinner()
  {
    this.claseSpinner = 'spinner-activado';
  }

  ocultarSpinner()
  {
    this.claseSpinner = 'spinner-desactivado';
  }

  descargarExcel()
  {
    let data = document.getElementById('table-data');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'especialistas.xlsx');
  }
}
