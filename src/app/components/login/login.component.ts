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
import { Subscription } from 'rxjs';
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
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  loginSubscription!: Subscription;
  readonly floatLabelControl = new FormControl('auto' as FloatLabelType);

  constructor(
    private http: GorestService,
    private auth: AuthService,
    private ruoter: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      name: new FormControl<string>(''),
      email: new FormControl<string>(''),
      token: new FormControl<string>('', [
        Validators.minLength(64),
        Validators.maxLength(64),
        Validators.required,
      ]),
    });
  }
  ngOnDestroy(): void {
    if (this.loginSubscription) this.loginSubscription.unsubscribe();
  }

  onSubmit(): void {
    const form = this.loginForm.value;
    this.authRequest(form.token);
    this.http.setName(form.name);
    this.http.setEmail(form.email);
    this.loginForm.reset();
  }

  authRequest(token: string): void {
    this.loginSubscription = this.auth.onTokenSubmit(token).subscribe({
      next: (r) => {
        if (r) {
          this.auth.onSuccessfullLogin();
        }
        this.ruoter.navigate(['/home']);
      },
      error: (e) => {
        alert('The token is incorrect. Please try again.');
        //reset form e apparizione snackbar
      },
    });
  }
}
