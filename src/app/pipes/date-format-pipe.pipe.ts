import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Pipe({
  name: 'dateFormatPipe',
  standalone: true
})
export class DateFormatPipePipe implements PipeTransform {

  transform(timestamp: Timestamp): string {
    if (!timestamp) return '';

    const date = timestamp.toDate(); 

    const day = this.pad(date.getDate());
    const month = this.pad(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = this.pad(date.getHours());
    const minutes = this.pad(date.getMinutes());
    const seconds = this.pad(date.getSeconds());

    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
  }

  private pad(n: number): string {
    return n < 10 ? '0' + n : '' + n;
  }
}
