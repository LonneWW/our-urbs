import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
/* The SearchService class in TypeScript defines a service that allows updating and observing search
queries. */
export class SearchService {
  private searchSubject = new BehaviorSubject<string>('');
  search$ = this.searchSubject.asObservable();

  updateSearch(query: any): void {
    if (query === '') query = undefined;
    this.searchSubject.next(query);
  }
}
