import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelPacientesComponent } from './excel-pacientes.component';

describe('ExcelPacientesComponent', () => {
  let component: ExcelPacientesComponent;
  let fixture: ComponentFixture<ExcelPacientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExcelPacientesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExcelPacientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
