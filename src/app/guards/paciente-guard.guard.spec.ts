import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { pacienteGuardGuard } from './paciente-guard.guard';

describe('pacienteGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => pacienteGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
