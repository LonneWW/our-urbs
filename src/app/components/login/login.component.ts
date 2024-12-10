import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  FloatLabelType,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  readonly floatLabelControl = new FormControl('auto' as FloatLabelType);
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      token: new FormControl<string>(''),
    });
  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
}
