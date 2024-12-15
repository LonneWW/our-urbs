import { TestBed } from '@angular/core/testing';

import { GorestService } from './gorest.service';

describe('GorestService', () => {
  let service: GorestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GorestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
