import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfHistoriaClinicaComponent } from './pdf-historia-clinica.component';

describe('PdfHistoriaClinicaComponent', () => {
  let component: PdfHistoriaClinicaComponent;
  let fixture: ComponentFixture<PdfHistoriaClinicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfHistoriaClinicaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PdfHistoriaClinicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
