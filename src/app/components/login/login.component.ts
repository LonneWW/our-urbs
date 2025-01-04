import { Component, OnInit, OnDestroy } from '@angular/core';
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

@Component({
  selector: 'app-login',
  standalone: true,
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
export class LoginComponent implements OnInit, OnDestroy {
  protected loginForm!: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  readonly floatLabelControl = new FormControl('auto' as FloatLabelType);

  constructor(
    private http: GorestService,
    private auth: AuthService,
    private ruoter: Router,
    private _snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      token: new FormControl<string>('', [
        Validators.minLength(64),
        Validators.maxLength(64),
        Validators.required,
      ]),
    });
  }

  onSubmit(): void {
    const form = this.loginForm.value;
    this.authRequest(form.token);
  }

  authRequest(token: string): void {
    this.auth
      .onTokenSubmit(token)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (r) => {
          if (r) {
            this._snackbar.open('Logged in successfully', 'Ok', {
              duration: 2000,
            });
            this.auth.loggedIn();
            this.http.setSession(token);
          }
          this.ruoter.navigate(['/users']);
        },
        error: (e) => {
          this._snackbar.open('Invalid token, please try again', 'Ok');
          this.loginForm.reset();
        },
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
