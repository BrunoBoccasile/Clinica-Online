import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaAdministradoresComponent } from './tabla-administradores.component';

describe('TablaAdministradoresComponent', () => {
  let component: TablaAdministradoresComponent;
  let fixture: ComponentFixture<TablaAdministradoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaAdministradoresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TablaAdministradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
