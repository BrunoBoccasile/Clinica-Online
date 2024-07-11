import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelEspecialistasComponent } from './excel-especialistas.component';

describe('ExcelEspecialistasComponent', () => {
  let component: ExcelEspecialistasComponent;
  let fixture: ComponentFixture<ExcelEspecialistasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExcelEspecialistasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExcelEspecialistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
