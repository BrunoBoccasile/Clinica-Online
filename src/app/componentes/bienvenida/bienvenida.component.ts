import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-bienvenida',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './bienvenida.component.html',
  styleUrl: './bienvenida.component.css',
  animations: [
    trigger('abajoHaciaArriba', [
      state('abajo', style({
        transform: 'translateY(100%)',
        opacity: 0.8,
        overflow: '0'
      })),
      state('arriba', style({
        transform: 'translateY(0)',
        opacity: 1
      })),
      transition('abajo => arriba', [animate('0.7s')]),
    ])
  ]
})
export class BienvenidaComponent implements OnInit{
public estadoAnimacion: string = 'abajo';
ngOnInit(): void
{
setTimeout(() => {
  this.estadoAnimacion = 'arriba';
  
}, 0.5);
}
}
