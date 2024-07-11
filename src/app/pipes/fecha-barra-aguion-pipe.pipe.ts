import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaBarraAGuion',
  standalone: true
})
export class FechaBarraAGuionPipe implements PipeTransform {

  transform(value: string): string {
    // Validamos que el valor no sea nulo y tenga el formato esperado
    if (!value || !/^\d{2}\/\d{2}$/.test(value)) {
      return value;
    }

    // Reemplazamos las barras por guiones
    return value.replace(/\//g, '-');
  }
}