import { Directive, ElementRef, Input, Renderer2, OnChanges } from '@angular/core';
type Estado = 'rechazado' | 'aceptado' | 'realizado' | 'cancelado' | 'pendiente';

@Directive({
  selector: '[appEstadoTurno]',
  standalone: true
})
export class EstadoTurnoDirective implements OnChanges {
  @Input('appEstadoTurno') estado!: Estado;

  private readonly estadoClases: Record<Estado, string[]> = {
    rechazado: ['bg-danger', 'text-white'],
    aceptado: ['bg-success', 'text-white'],
    realizado: ['bg-primary', 'text-white'],
    cancelado: ['bg-dark', 'text-white'],
    pendiente: ['bg-warning', 'text-black']
  };

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(): void {
    this.limpiarClases();

    const clases = this.estadoClases[this.estado];
    if (clases) {
      clases.forEach(clase => this.renderer.addClass(this.el.nativeElement, clase));
    }
  }

  private limpiarClases() {
    Object.values(this.estadoClases).forEach(clases => {
      clases.forEach(clase => this.renderer.removeClass(this.el.nativeElement, clase));
    });
  }
}