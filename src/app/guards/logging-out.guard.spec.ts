import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { loggingOutGuard } from './logging-out.guard';

describe('loggingOutGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => loggingOutGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
