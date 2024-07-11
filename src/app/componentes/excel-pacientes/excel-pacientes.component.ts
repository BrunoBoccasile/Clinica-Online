import { Component, OnDestroy, OnInit } from '@angular/core';
import { PacientesService } from '../../servicios/pacientes.service';
import { Subscription } from 'rxjs';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Paciente } from '../../entidades/paciente';
import { NgClass } from '@angular/common';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-excel-pacientes',
  standalone: true,
  imports: [SpinnerComponent, NgClass],
  templateUrl: './excel-pacientes.component.html',
  styleUrl: './excel-pacientes.component.css'
})
export class ExcelPacientesComponent implements OnInit, OnDestroy {
  public suscripcion!: Subscription;
  public claseSpinner = 'spinner-desactivado';
  public pacientes!: Paciente[];

  constructor(public pacientesService: PacientesService, public authService: AuthService, public router: Router){}
  ngOnInit(): void
  {
    this.mostrarSpinner();
    this.authService.esperarCargarUsuario().then(() => {
      if(this.authService.tipoUsuario == 'administrador')
      {

        this.suscripcion = this.pacientesService.getPacientes().subscribe({
          next: (res) => {
            this.pacientes = res;
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

    XLSX.writeFile(wb, 'pacientes.xlsx');
  }
}
