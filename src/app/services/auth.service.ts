import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GorestService } from './gorest.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isLoggedIn: boolean = true; //da settare default false!
  private _token: string = '';
  constructor(private http: HttpClient, private gorestService: GorestService) {}

  //TO-DO: i setter i getter sono un po' da rivedere. Se questi non vengono ottenute/cambiate al di fuori della classe non ha senso tenerli. Questo riguarda principalmente il token.
  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }
  set isLoggedIn(value: boolean) {
    if (value === false) {
      this._isLoggedIn = false;
    }
  }

  getAuthToken(): string {
    if (this._token) {
      return this._token;
    } else {
      return '';
    }
  }

  setAuthToken(newToken: string): void {
    this._token = newToken;
  }

  onTokenSubmit(userToken: string): Observable<any> {
    this.setAuthToken(userToken);
    return this.gorestService.getUsers(1);
  }

  onSuccessfullLogin(): void {
    this._isLoggedIn = true;
  }
}
