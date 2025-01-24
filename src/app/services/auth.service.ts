import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GorestService } from './gorest.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isLoggedIn: boolean = false; //da settare default false!
  private _token: string = '';
  constructor(private gorestService: GorestService) {}

  //TO-DO: i setter i getter sono un po' da rivedere. Se questi non vengono ottenute/cambiate al di fuori della classe non ha senso tenerli. Questo riguarda principalmente il token.
  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }
  set isLoggedIn(value: boolean) {
    if (value === false) {
      this._isLoggedIn = false;
    }
  }

  getAuthToken(): string | undefined {
    const token = sessionStorage.getItem('token');
    if (this._token) {
      return this._token;
    } else if (token) {
      return token;
    } else {
      return undefined;
    }
  }

  setAuthToken(newToken: string): void {
    this._token = newToken;
  }

  onTokenSubmit(userToken: string, mail?: string): Observable<any> {
    this.setAuthToken(userToken);
    return this.gorestService.getUsers(1, 1, mail);
  }

  loggedIn(): void {
    this._isLoggedIn = true;
  }

  loggingOut() {
    this.isLoggedIn = false;
    this.setAuthToken('');
    this.gorestService.deleteCurrentUser();
    sessionStorage.removeItem('token');
  }
}
