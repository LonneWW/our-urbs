import { TestBed } from '@angular/core/testing';

import { HttpGorestService } from './http-gorest.service';

describe('HttpGorestService', () => {
  let service: HttpGorestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpGorestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
