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

@Component({
  selector: 'app-register',
  standalone: true,
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
  protected registerForm: FormGroup = new FormGroup({
    name: new FormControl<string>(''),
    email: new FormControl<string>(''),
    gender: new FormControl<string>(''),
    token: new FormControl<string>('', [
      Validators.minLength(64),
      Validators.maxLength(64),
      Validators.required,
    ]),
    status: new FormControl<string>(''),
  });
  private recoverForm: any;
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
    if (token) {
      //snackbar, token invalido, vai al login
      //guard del logout per login e register
    }
  }

  onSubmit(): void {
    const form = this.registerForm.value;
    console.log(form);
    this.authRequest(form.token);
  }

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
          this._snackbar.open('Invalid token, please try again', 'Ok');
          this.registerForm.reset();
        },
      });
  }

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
          console.log('User created successfully');
          this._snackbar.open('Registered successfully', 'Ok', {
            duration: 2000,
          });
          //MAT-SNACKBAR DA APP-COMPONENT
          this.ruoter.navigate(['/users']);
        },
        error: (e) => {
          if (e.error.length > 1) {
            let message = `There has been some errors:`;
            for (let i = 0; e.error.length == i; i++) {
              message = message + `\n${e.error[i].field} ${e.error[i].message}`;
            }
            alert(message);
          }
          this._snackbar.open(
            `Error: ${e.error[0].field} ${e.error[0].message}`,
            'Ok'
          );
          if (localStorage.getItem('user')) localStorage.removeItem('user');
          console.log(e);
          this.registerForm.reset();
        },
      });
  }

  onRecoverRequest(recoverForm: FormGroup) {
    const form = recoverForm.value;
    this.recoverForm = form;
    this.authRequest(form.token, form.email);
  }

  recoverUserDetails(r: User[]) {
    if (!r[0]) {
      this._snackbar.open('Incorrect email, please try again.', 'Ok', {
        duration: 2000,
      });
    } else {
      const token = this.recoverForm.token;
      let user = r[0];
      this.auth.loggedIn();
      this.http.setSession(this.recoverForm.token);
      this.http.setCurrentUser(user);
      this._snackbar.open('Data recovered successfully', 'Ok', {
        duration: 2000,
      });
      this.ruoter.navigate(['/users']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
