import { TestBed } from '@angular/core/testing';
import { SearchService } from './search.service';
import { BehaviorSubject } from 'rxjs';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update search value', (done) => {
    const newSearchQuery = 'new search query';
    service.updateSearch(newSearchQuery);
    service.search$.subscribe((value) => {
      expect(value).toBe(newSearchQuery);
      done();
    });
  });

  it('should update search value to undefined when an empty string is passed', (done) => {
    service.updateSearch('');
    service.search$.subscribe((value) => {
      expect(value).toBeUndefined();
      done();
    });
  });
});
