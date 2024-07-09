import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfAtencionesComponent } from './pdf-atenciones.component';

describe('PdfAtencionesComponent', () => {
  let component: PdfAtencionesComponent;
  let fixture: ComponentFixture<PdfAtencionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfAtencionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PdfAtencionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
