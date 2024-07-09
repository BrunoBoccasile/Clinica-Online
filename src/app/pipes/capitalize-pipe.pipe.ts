import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizePipe',
  standalone: true
})
export class CapitalizePipePipe implements PipeTransform {

  transform(texto: string | undefined): string | undefined {
    if (texto != undefined) {
      return texto.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    } else {
      return texto;
    }
  }

}
