import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlightOnHover]',
  standalone: true
})
export class HighlightOnHoverDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.renderer.setStyle(this.el.nativeElement, 'background-color', 'lightblue');
    this.renderer.setStyle(this.el.nativeElement, 'color', 'white');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.renderer.removeStyle(this.el.nativeElement, 'background-color');
    this.renderer.removeStyle(this.el.nativeElement, 'color');
  }
}