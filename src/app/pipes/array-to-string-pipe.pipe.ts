import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayToStringPipe',
  standalone: true
})
export class ArrayToStringPipePipe implements PipeTransform {

  transform(array: any[], campo: string = ''): string {
    if (!Array.isArray(array)) {
      return '';
    }
    
    if (campo) {
      return array.map(item => item[campo]).join(', ');
    }
    
    return array.join(', ');
  }


}
