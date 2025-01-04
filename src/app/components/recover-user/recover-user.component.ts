import { Component, EventEmitter, Output } from '@angular/core';
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
import { Subject } from 'rxjs';

@Component({
  selector: 'app-recover-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './recover-user.component.html',
  styleUrl: './recover-user.component.scss',
})
export class RecoverUserComponent {
  protected recoverUserForm: FormGroup = new FormGroup({
    email: new FormControl<string>(''),
    token: new FormControl<string>('', [
      Validators.minLength(64),
      Validators.maxLength(64),
      Validators.required,
    ]),
  });
  private destroy$: Subject<void> = new Subject<void>();
  @Output() recoverRequest: EventEmitter<FormGroup> =
    new EventEmitter<FormGroup>();

  onSubmit() {
    this.recoverRequest.emit(this.recoverUserForm);
    console.log('submitted');
  }
}
