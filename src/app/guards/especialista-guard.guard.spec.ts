import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { especialistaGuardGuard } from './especialista-guard.guard';

describe('especialistaGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => especialistaGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
