import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  // protected resultsPerPage DA IMPLEMENTARE
  private searchSubject = new BehaviorSubject<string>('');
  search$ = this.searchSubject.asObservable();

  updateSearch(query: any): void {
    if (query === '') query = undefined;
    this.searchSubject.next(query);
  }
}
