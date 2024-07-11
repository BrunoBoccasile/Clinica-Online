import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaBarraAGuion',
  standalone: true
})
export class FechaBarraAGuionPipe implements PipeTransform {

  transform(value: string): string {
    if (!value || !/^\d{2}\/\d{2}$/.test(value)) {
      return value;
    }

    return value.replace(/\//g, '-');
  }
}