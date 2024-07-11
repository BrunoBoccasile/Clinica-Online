import { Component, OnDestroy, OnInit } from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LegendPosition, NgxChartsModule } from '@swimlane/ngx-charts';
import { TurnosService } from '../../servicios/turnos.service';
import { Subscription } from 'rxjs';
import { LogsService } from '../../servicios/logs.service';
import { DateFormatPipePipe } from '../../pipes/date-format-pipe.pipe';
import { Especialista } from '../../entidades/especialista';
import { EspecialistasService } from '../../servicios/especialistas.service';
import { TablaEspecialistasComponent } from '../tabla-especialistas/tabla-especialistas.component';
import { SweetAlert } from '../../clases/sweetAlert';
import { Router } from '@angular/router';
import { Tiempo } from '../../clases/tiempo';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


// Default export is a4 paper, portrait, using millimeters for units

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [SpinnerComponent, NgClass, FormsModule, NgxChartsModule, DateFormatPipePipe, TablaEspecialistasComponent],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})
export class EstadisticasComponent implements OnInit, OnDestroy
{
  public claseSpinner = "spinner-desactivado";
  // ● Log de ingresos al sistema. Indicando el usuario, día y horario que ingreso al sistema.
  // ● Cantidad de turnos por especialidad.
  // ● Cantidad de turnos por día.
  // ● Cantidad de turnos solicitado por médico en un lapso de tiempo.
  // ● Cantidad de turnos finalizados por médico en un lapso de tiempo.
  
  public tiposDeEstadistica = [
    { nombre: 'Log de ingresos', id: 1 },
    { nombre: 'Cantidad de turnos por especialidad', id: 2 },
    { nombre: 'Cantidad de turnos por día', id: 3 },
    { nombre: 'Cantidad de turnos solicitados', id: 4 },
    { nombre: 'Cantidad de turnos finalizados', id: 5 },
  ]
  public opcionSeleccionada: any;
  public suscripcionTurnos!: Subscription;
  public suscripcionLogs!: Subscription;
  public turnos!: any[];
  public logs!: any;
  public data1!: any;
  public data2!: any;
  public data3!: any;
  public data4!: any;
  public data5!: any;
  public secuencia4 = [true, false];
  public secuencia5 = [true, false];
  public graficoParaPDF = false;
  public swal: SweetAlert = new SweetAlert(this.router);
  public turnosFiltrados!: any[];
  public tiempo: Tiempo = new Tiempo();
  public fechaInicio!: string;
  public fechaFin!: string;


  constructor(public router: Router, public especialistasService: EspecialistasService, public logsService: LogsService, public turnosService: TurnosService) { }

  ngOnInit(): void
  {
    let booleanosSpinner = [false, false];
    this.mostrarSpinner();
    this.suscripcionTurnos = this.turnosService.getTurnos().subscribe({
      next: (res) =>
      {
        this.turnos = res;
        booleanosSpinner[0] = true;
        if (booleanosSpinner[0] && booleanosSpinner[1])
        {
          this.ocultarSpinner();
        }
      }
    })

    this.logsService.getLogsPorFecha().then((res) =>
    {
      this.logs = res.docs.map(doc => doc.data());
      console.log(this.logs);
      booleanosSpinner[1] = true;
      if (booleanosSpinner[0] && booleanosSpinner[1])
      {
        this.ocultarSpinner();
      }
    })

  }

  ngOnDestroy(): void
  {
    if (this.suscripcionTurnos)
    {
      this.suscripcionTurnos.unsubscribe();
    }
    if (this.suscripcionLogs)
    {
      this.suscripcionLogs.unsubscribe();
    }
  }


  public filtrarTurnosPorRango(fechaInicio: string, fechaFin: string)
  {
    const fechaInicioDate = this.tiempo.fechaADate(fechaInicio);
    const fechaFinDate = this.tiempo.fechaADate(fechaFin);

    let turnosFiltradosAux = this.turnos.filter(turno =>
    {
      const fechaTurno = this.tiempo.fechaADate(turno.fecha);
      return fechaTurno >= fechaInicioDate && fechaTurno <= fechaFinDate;
    });

    if (turnosFiltradosAux.length > 0)
    {
      this.secuencia4[0] = false;
      this.secuencia4[1] = true;

      this.turnosFiltrados = turnosFiltradosAux;
      this.agruparYContarTurnos(turnosFiltradosAux, 4);
      console.log(this.turnosFiltrados);
    }
    else
    {
      this.swal.mostrarMensajeError('No hay turnos en esas fechas', 'Por favor, ingrese otro lapso');
    }
  }

  public filtrarTurnosTerminadosPorRango(fechaInicio: string, fechaFin: string)
  {
    const fechaInicioDate = this.tiempo.fechaADate(fechaInicio);
    const fechaFinDate = this.tiempo.fechaADate(fechaFin);

    let turnosFiltradosAux = this.turnos.filter(turno =>
    {
      const fechaTurno = this.tiempo.fechaADate(turno.fecha);
      return fechaTurno >= fechaInicioDate && fechaTurno <= fechaFinDate && turno.estado == 'realizado';
    });

    if (turnosFiltradosAux.length > 0)
    {
      this.secuencia5[0] = false;
      this.secuencia5[1] = true;

      this.turnosFiltrados = turnosFiltradosAux;
      this.agruparYContarTurnos(turnosFiltradosAux, 5);
      console.log(this.turnosFiltrados);
    }
    else
    {
      this.swal.mostrarMensajeError('No hay turnos en esas fechas', 'Por favor, ingrese otro lapso');
    }
  }

  public agruparYContarTurnos(turnos: any[], data: number)
  {
    const turnosPorEspecialista: { [key: string]: { name: string, count: number } } = {};

    turnos.forEach(turno =>
    {
      const key = turno.idEspecialista;
      const nombreCompleto = `${turno.nombreEspecialista} ${turno.apellidoEspecialista}`;

      if (!turnosPorEspecialista[key])
      {
        turnosPorEspecialista[key] = { name: nombreCompleto, count: 0 };
      }

      turnosPorEspecialista[key].count += 1;
    });

    switch (data)
    {
      case 4:
        this.data4 = Object.values(turnosPorEspecialista).map(especialista => ({
          name: especialista.name,
          value: especialista.count
        }));
        break;
      case 5:
        this.data5 = Object.values(turnosPorEspecialista).map(especialista => ({
          name: especialista.name,
          value: especialista.count
        }));
        break;
    }
  }



  public verEstadistica()
  {
    switch (this.opcionSeleccionada)
    {
      case '1':
        console.log('Log de ingresos');
        this.data1 = this.contarLogsPorEmail();
        break;
      case '2':
        console.log('Cantidad de turnos por especialidad');
        this.data2 = this.contarTurnosPorEspecialidad();
        break;
      case '3':
        this.data3 = this.contarTurnosPorDia();
        console.log('Cantidad de turnos por día');
        break;
      case '4':
        console.log('Cantidad de turnos solicitados');
        this.secuencia4 = [true, false];
        this.fechaInicio = '';
        this.fechaFin = '';
        //traigo especialistas OK
        //traigo turnos del especialista seleccionado
        break;
      case '5':
        console.log('Cantidad de turnos finalizados');
        this.secuencia5 = [true, false];
        this.fechaInicio = '';
        this.fechaFin = '';
        break;
    }
  }


  private contarTurnosPorEspecialidad()
  {
    const conteo: { [key: string]: number } = {};

    for (const turno of this.turnos)
    {
      if (conteo[turno.especialidad])
      {
        conteo[turno.especialidad]++;
      } else
      {
        conteo[turno.especialidad] = 1;
      }
    }

    const result = Object.keys(conteo).map(especialidad =>
    {
      return { name: especialidad, value: conteo[especialidad] };
    });

    return result;
  }

  private contarTurnosPorDia()
  {
    const conteo: { [key: string]: number } = {};

    for (const turno of this.turnos)
    {
      if (conteo[turno.fecha])
      {
        conteo[turno.fecha]++;
      } else
      {
        conteo[turno.fecha] = 1;
      }
    }

    const result = Object.keys(conteo).map(fecha =>
    {
      return { name: fecha, value: conteo[fecha] };
    });

    return result;
  }

  private contarLogsPorEmail()
  {
    const conteo: { [key: string]: number } = {};

    for (const log of this.logs)
    {
      if (conteo[log.email])
      {
        conteo[log.email]++;
      } else
      {
        conteo[log.email] = 1;
      }
    }

    const result = Object.keys(conteo).map(email =>
    {
      return { name: email, value: conteo[email] };
    });

    return result;
  }
  mostrarSpinner()
  {
    this.claseSpinner = "spinner-activado";
  }

  ocultarSpinner()
  {
    this.claseSpinner = "spinner-desactivado";
  }









  // options
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition = LegendPosition.Below;

  colorScheme: any = {
    domain: [
      '#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#1F77B4', '#FF7F0E', '#2CA02C', '#D62728', '#9467BD', '#8C564B',
      '#E377C2', '#7F7F7F', '#BCBD22', '#17BECF', '#393B79', '#637939', '#8C6D31', '#843C39', '#7B4173', '#A55194',
      '#6B6ECF', '#9C9EDE', '#8CA252', '#CEDB9C', '#BD9E39', '#E7BA52', '#AD494A', '#D6616B', '#E7969C', '#7B4173',
      '#A55194', '#CE6DBD', '#DE9ED6', '#3182BD', '#6BAED6', '#9ECAE1', '#C6DBEF', '#E6550D', '#FD8D3C', '#FDAE6B',
      '#FDD0A2', '#31A354', '#74C476', '#A1D99B', '#C7E9C0', '#756BB1', '#9E9AC8', '#BCBDDC', '#DADAEB', '#636363',
      '#969696', '#BDBDBD', '#D9D9D9', '#8C564B', '#C49C94', '#E377C2', '#F7B6D2', '#7F7F7F', '#C7C7C7', '#BCBD22',
      '#DBDB8D', '#17BECF', '#9EDAE5', '#1F77B4', '#AEC7E8', '#FF7F0E', '#FFBB78', '#2CA02C', '#98DF8A', '#D62728',
      '#FF9896', '#9467BD', '#C5B0D5', '#8C564B', '#C49C94', '#E377C2', '#F7B6D2', '#7F7F7F', '#C7C7C7', '#BCBD22',
      '#DBDB8D', '#17BECF', '#9EDAE5', '#393B79', '#5254A3', '#6B6ECF', '#9C9EDE', '#637939', '#8CA252', '#B5CF6B',
      '#CEDB9C', '#8C6D31', '#BD9E39', '#E7BA52', '#E6550D', '#FD8D3C', '#FDAE6B', '#FDD0A2', '#31A354', '#74C476',
      '#A1D99B', '#C7E9C0'
    ]
  };

  onSelect(data: any): void
  {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data: any): void
  {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void
  {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }



downloadPDF(): void
{
  this.mostrarSpinner();
  if(this.opcionSeleccionada != 1)
  {
    this.graficoParaPDF = true;
  }
  setTimeout(() => {
    this.descargaPDF(`grafico-${this.opcionSeleccionada}`);
  }, 1000);
}

  descargaPDF(nombreGrafico: string): void
  {

    const DATA: any = document.getElementById('cardGrafico');
    
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3
    };
    html2canvas(DATA, options).then((canvas) =>
    {
      console.log("ok");
      const img = canvas.toDataURL('image/PNG');
      const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      return doc;
    }).then((docResult) =>
    {
      docResult.save(`${nombreGrafico}.pdf`);
      this.graficoParaPDF = false;

      this.ocultarSpinner();
    })
  }

}
