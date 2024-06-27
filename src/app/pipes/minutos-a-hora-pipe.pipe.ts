import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minutosAHoraPipe',
  standalone: true
})
export class MinutosAHoraPipePipe implements PipeTransform {

  transform(minutos: number): string {
  let hora = Math.floor(minutos / 60);
  let minutosRestantes = minutos % 60;

  let horaFormateada = String(hora).padStart(2, '0');
  let minutosFormateados = String(minutosRestantes).padStart(2, '0');

 
  return `${horaFormateada}:${minutosFormateados}`;
  }

}
