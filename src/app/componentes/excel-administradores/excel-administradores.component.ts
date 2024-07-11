import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Administrador } from '../../entidades/administrador';
import { AdministradoresService } from '../../servicios/administradores.service';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { NgClass } from '@angular/common';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-excel-administradores',
  standalone: true,
  imports: [NgClass, SpinnerComponent],
  templateUrl: './excel-administradores.component.html',
  styleUrl: './excel-administradores.component.css'
})
export class ExcelAdministradoresComponent {
  public suscripcion!: Subscription;
  public claseSpinner = 'spinner-desactivado';
  public administradores!: Administrador[];

  constructor(public administradoresService: AdministradoresService, public authService: AuthService, public router: Router){}
  ngOnInit(): void
  {
    this.mostrarSpinner();
    this.authService.esperarCargarUsuario().then(() => {
      if(this.authService.tipoUsuario == 'administrador')
      {

        this.suscripcion = this.administradoresService.getAdministradores().subscribe({
          next: (res) => {
            this.administradores = res;
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

    XLSX.writeFile(wb, 'administradores.xlsx');
  }
}
