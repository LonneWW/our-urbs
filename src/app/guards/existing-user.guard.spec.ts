import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { existingUserGuard } from './existing-user.guard';

describe('existingUserGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => existingUserGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
