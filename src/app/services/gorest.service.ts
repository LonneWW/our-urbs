import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class GorestService {
  private apiUrl: string = environment.apiEndpoint;
  public users: User[] = [];
  constructor(private http: HttpClient) {}

  getUsers(userPerPage: string, searchString?: string): Observable<Object> {
    return this.http.get(
      `${this.apiUrl}/users?page=${1}&per_page=${userPerPage}${
        searchString ? '&name=' + searchString : ''
      }` //aggiungere parametro page con property binding dalla navbar
    );
  }

  setData(data: User[]): void {
    this.users = data;
    console.log(this.users);
  }
}
