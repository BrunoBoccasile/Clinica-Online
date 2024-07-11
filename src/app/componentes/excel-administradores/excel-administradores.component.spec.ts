import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelAdministradoresComponent } from './excel-administradores.component';

describe('ExcelAdministradoresComponent', () => {
  let component: ExcelAdministradoresComponent;
  let fixture: ComponentFixture<ExcelAdministradoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExcelAdministradoresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExcelAdministradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
