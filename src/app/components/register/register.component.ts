import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { RecoverUserComponent } from '../recover-user/recover-user.component';
import { GorestService } from '../../services/gorest.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../interfaces/user';

/* The `RegisterComponent` class defines a component for user registration and data
recovery, handling form submissions, authentication requests, and user creation with error handling
and navigation logic. */
@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTabsModule,
    RecoverUserComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit, OnDestroy {
  /* The `protected registerForm` property is defining a form group.
  Each form control corresponds to the user model of the Go Rest API*/
  protected registerForm: FormGroup = new FormGroup({
    name: new FormControl<string>(''),
    email: new FormControl<string>('', [Validators.email]),
    gender: new FormControl<string>(''),
    token: new FormControl<string>('', [
      Validators.minLength(64),
      Validators.maxLength(64),
      Validators.required,
    ]),
    status: new FormControl<string>(''),
  });
  /* The `private recoverForm` property is defining an object representing a
  FormGroup passed by the "recover-user" component when submitting its form.
  The form is submitted when the user performs the recovery of his data 
  (name, id, gender and status) by email (unique and easily known by all users) 
  and the authorization token.
  The "recover-user" component handles just a little logic, leaving
  the http call, handling errors and so on to this component.
   */
  private recoverForm!: { email: string; token: string };

  /* The line `private destroy$: Subject<void> = new Subject<void>();` is declaring a private property
  `destroy$` of type `Subject<void>` and initializing it with a new instance of `Subject<void>`.
  It's used to unsubscribe to multiple subscriptions on the ngOnDestroy of the component. */
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private http: GorestService,
    private auth: AuthService,
    private ruoter: Router,
    private _snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    const token = sessionStorage.getItem('token');
    // if (token) {
    //   //snackbar, token invalido, vai al login
    //   //guard del logout per login e register
    // }
  }

  onSubmit(): void {
    const form = this.registerForm.value;
    this.authRequest(form.token);
  }

  /**
   * The `authRequest` function handles authentication requests with a token and optional email,
   * subscribing to the response and handling success or error cases accordingly.
   * @param {string} token - The `token` parameter in the `authRequest` function is a required string
   * parameter. It is used for authentication purposes, likely for verifying the user's identity or
   * access rights.
   * @param {string} [mail] - The `mail` parameter in the `authRequest` function is an optional parameter
   * of type string. It is used to provide an email address for authentication along with the token. If a
   * value is provided for `mail`, it will be passed to the `onTokenSubmit` method along with the token.
   * This function handles both register and rocover-user-data requests. The first with only the token,
   * the second also the email.
   * On a successfull response the function calls "recoverUserDetails" or "onSuccessfullRegister" based
   * on the previous action. They both menage the login status in similiar ways.
   */
  authRequest(token: string, mail?: string): void {
    this.auth
      .onTokenSubmit(token, mail)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (r) => {
          if (this.recoverForm) {
            this.recoverUserDetails(r);
          } else {
            this.onSuccessfullRegister();
          }
        },
        error: (e) => {
          this._snackbar.open(
            'There has been an error. Please check the validity of your token.',
            'Ok'
          );
          console.log(e);
          this.registerForm.reset();
        },
      });
  }

  /**
   * The `onSuccessfullRegister` function: set the user status to active,
   * log in the user by "auth.loggedIn",
   * saves the auth token in the session storage,
   * creates a new user serverside,
   * and displays success or error messages accordingly.
   */
  onSuccessfullRegister(): void {
    const form: User = this.registerForm.value;
    form.status = 'active';
    this.auth.loggedIn();
    this.http.setSession(form.token);
    this.http.setCurrentUser(form);
    this.http
      .createUser(form)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this._snackbar.open('Registered successfully', 'Ok', {
            duration: 2000,
          });
          this.ruoter.navigate(['/users']);
        },
        error: (e) => {
          if (localStorage.getItem('user')) localStorage.removeItem('user');
          this._snackbar.open(
            "Couldn't register user successfully, check the console for more details",
            'Ok'
          );
          console.log(e);
          this.registerForm.reset();
        },
      });
  }

  /**
   * The `onRecoverRequest` function takes a FormGroup as a parameter (a form containing email and token fields),
   * extracts its value, assigns it to `this.recoverForm`,
   * and then calls the `authRequest` function with the token and email from the form.
   * @param {FormGroup} recoverForm - The `recoverForm` parameter is a `FormGroup` object that represents
   * a form in Angular. It contains the form controls and their values. In the provided code snippet, the
   * `onRecoverRequest` method takes this `recoverForm` as an input and extracts the form values from it
   * to perform
   */
  onRecoverRequest(recoverForm: FormGroup): void {
    const form = recoverForm.value;
    this.recoverForm = form;
    this.authRequest(form.token, form.email);
  }

  /**
   * The function `recoverUserDetails` checks if a user exists in a response array,
   * (since the API returns an empty array if there is no user registered with the applied email)
   * and then sets session data and navigates to the "homepage" accordingly.
   * If the user does exist the function, like "onSuccessfullLogin",
   * logges in the user by "auth.loggedIn",
   * saves the auth token in the session storage.
   * Then saves the user in the localStorage (setCurrentUser),
   * and displays success or error messages accordingly.
   * @param {User[]} r - An array of User objects.
   */
  recoverUserDetails(r: User[]): void {
    if (r.length == 0) {
      this._snackbar.open(
        'The email is not registered, please try again.',
        'Ok'
      );
    } else {
      const token = this.recoverForm.token;
      let user = r[0];
      this.auth.loggedIn();
      this.http.setSession(this.recoverForm.token);
      this.http.setCurrentUser(user);
      this._snackbar.open('Data recovered successfully', 'Ok');
      this.ruoter.navigate(['/users']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
