import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  FloatLabelType,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { GorestService } from '../../services/gorest.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

/* The LoginComponent class handles user authentication by submitting a token, logging in
the user upon successful response, and navigating to the homepage, while displaying appropriate
messages and resetting the form on error. */
@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy {
  /* The loginForm only requires the token, since the user data, after the login, should be saved
  in the localStorage. If not so, a route guard should prevent the client to navigate on the page,
  forcing him to recover the user data or register first.
  */
  protected loginForm: FormGroup = new FormGroup({
    token: new FormControl<string>('', [
      Validators.minLength(64),
      Validators.maxLength(64),
      Validators.required,
    ]),
  });
  /* The line `private destroy$: Subject<void> = new Subject<void>();` is declaring a private property
  `destroy$` of type `Subject<void>` and initializing it with a new instance of `Subject<void>`.
  It's used to unsubscribe to multiple subscriptions on the ngOnDestroy of the component. */
  private destroy$: Subject<void> = new Subject<void>();
  readonly floatLabelControl = new FormControl('auto' as FloatLabelType);

  constructor(
    private http: GorestService,
    private auth: AuthService,
    private ruoter: Router,
    private _snackbar: MatSnackBar
  ) {}

  onSubmit(): void {
    const form = this.loginForm.value;
    this.authRequest(form.token);
  }

  /* The `authRequest(token: string): void` function in the LoginComponent class is responsible for
handling the authentication request when a user submits the login form. Here is a breakdown of what
it does. First it makes the call to the API: if the response is positive it logges in the user (auth.loggedIn), 
saves the auth token in the sessionStorage, show a message to the client and then navigates to the "homepage";
otherwise it shows an error message and reset the form.
*/
  authRequest(token: string): void {
    this.auth
      .onTokenSubmit(token)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (r) => {
          if (r) {
            this._snackbar.open('Logged in successfully.', 'Ok', {
              duration: 2000,
            });
            this.auth.loggedIn();
            this.http.setSession(token);
          }
          this.ruoter.navigate(['/users']);
        },
        error: (e) => {
          this._snackbar.open('Invalid token, please try again.', 'Ok');
          console.log(e);
          this.loginForm.reset();
          this.loginForm.controls['token'].markAsUntouched();
        },
      });
  }

  /**
   * The ngOnDestroy function in TypeScript is used to clean up resources and unsubscribe from
   * observables by completing a subject.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
