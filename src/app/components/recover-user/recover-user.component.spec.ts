import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { RecoverUserComponent } from './recover-user.component';
import { By } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('RecoverUserComponent', () => {
  let component: RecoverUserComponent;
  let fixture: ComponentFixture<RecoverUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RecoverUserComponent,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
      ],
      providers: [provideAnimations()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoverUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display form elements', () => {
    const emailInput = fixture.debugElement.query(
      By.css('input[formControlName="email"]')
    );
    const tokenInput = fixture.debugElement.query(
      By.css('input[formControlName="token"]')
    );
    const submitButton = fixture.debugElement.query(
      By.css('button[type="submit"]')
    );

    expect(emailInput).toBeTruthy();
    expect(tokenInput).toBeTruthy();
    expect(submitButton).toBeTruthy();
  });

  it('should emit recoverRequest event on form submit', () => {
    spyOn(component.recoverRequest, 'emit');

    component.recoverUserForm.setValue({
      email: 'test@example.com',
      token: 'a'.repeat(64),
    });

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', null);

    expect(component.recoverRequest.emit).toHaveBeenCalledWith(
      component.recoverUserForm
    );
  });

  it('should reset the form after submit', () => {
    component.recoverUserForm.setValue({
      email: 'test@example.com',
      token: 'a'.repeat(64),
    });

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', null);

    expect(component.recoverUserForm.valid).toBeFalsy();
  });
});
