import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule, FormsModule, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { GorestService } from '../../services/gorest.service';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';
import { Component, EventEmitter, Output } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-recover-user',
  template: '',
})
class MockRecoverUserComponent {
  @Output() recoverRequest = new EventEmitter<FormGroup>();
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockGorestService: jasmine.SpyObj<GorestService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  beforeEach(async () => {
    mockGorestService = jasmine.createSpyObj('GorestService', [
      'createUser',
      'setSession',
      'setCurrentUser',
    ]);
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'onTokenSubmit',
      'loggedIn',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatTabsModule,
        BrowserAnimationsModule,
        MockRecoverUserComponent, // Import del componente mock standalone
      ],
      providers: [
        { provide: GorestService, useValue: mockGorestService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    const form = component.registerForm;
    expect(form.get('name')?.value).toBe('');
    expect(form.get('email')?.value).toBe('');
    expect(form.get('gender')?.value).toBe('');
    expect(form.get('token')?.value).toBe('');
    expect(form.get('status')?.value).toBe('');
  });

  it('should validate token field correctly', () => {
    const tokenControl = component.registerForm.get('token');
    tokenControl?.setValue('short');
    expect(tokenControl?.valid).toBeFalse();

    tokenControl?.setValue('a'.repeat(64));
    expect(tokenControl?.valid).toBeTrue();
  });

  it('should handle form submission correctly', () => {
    spyOn(component, 'authRequest');
    component.registerForm.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      gender: 'male',
      token: 'a'.repeat(64),
      status: '',
    });
    component.onSubmit();

    expect(component.authRequest).toHaveBeenCalledWith('a'.repeat(64));
  });

  it('should call authRequest with correct parameters', () => {
    component.recoverForm = {
      email: 'john@example.com',
      token: 'a'.repeat(64),
    };
    spyOn(component, 'onSuccessfullRegister');

    mockAuthService.onTokenSubmit.and.returnValue(of([]));
    component.authRequest('a'.repeat(64), 'john@example.com');

    expect(mockAuthService.onTokenSubmit).toHaveBeenCalledWith(
      'a'.repeat(64),
      'john@example.com'
    );
    expect(component.onSuccessfullRegister).not.toHaveBeenCalled();
  });

  it('should handle successful registration', () => {
    const form = {
      name: 'John Doe',
      email: 'john@example.com',
      gender: 'male',
      status: 'active',
      token: '2c4vasfd'.repeat(8),
    };
    component.registerForm.setValue(form);

    mockGorestService.createUser.and.returnValue(of({}));
    component.onSuccessfullRegister();

    expect(mockAuthService.loggedIn).toHaveBeenCalled();
    expect(mockGorestService.setSession).toHaveBeenCalledWith(form.token);
    expect(mockGorestService.setCurrentUser).toHaveBeenCalledWith(form);
  });

  it('should recover user details', () => {
    const dummyResponse: User[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        gender: 'male',
        status: 'active',
      },
    ];
    component.recoverForm = {
      email: 'john@example.com',
      token: 'a'.repeat(64),
    };

    component.recoverUserDetails(dummyResponse);

    expect(mockAuthService.loggedIn).toHaveBeenCalled();
    expect(mockGorestService.setSession).toHaveBeenCalledWith('a'.repeat(64));
    expect(mockGorestService.setCurrentUser).toHaveBeenCalledWith(
      dummyResponse[0]
    );
  });

  it('should show error if email is not registered', () => {
    component.recoverForm = {
      email: 'john@example.com',
      token: 'a'.repeat(64),
    };

    component.recoverUserDetails([]);
  });
});
