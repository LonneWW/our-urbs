import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { GorestService } from '../../services/gorest.service';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from './login.component';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { UsersListComponent } from '../users-list/users-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockGorestService: jasmine.SpyObj<GorestService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: Router;

  beforeEach(async () => {
    mockGorestService = jasmine.createSpyObj('GorestService', ['setSession']);
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'onTokenSubmit',
      'loggedIn',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: GorestService, useValue: mockGorestService },
        { provide: AuthService, useValue: mockAuthService },
        provideRouter([{ path: 'users', component: UsersListComponent }]),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize loginForm with token control', () => {
    expect(component.loginForm.contains('token')).toBeTrue();
  });

  it('should call authRequest on form submit', () => {
    spyOn(component, 'authRequest');
    component.loginForm.setValue({ token: 'a'.repeat(64) });

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', null);

    expect(component.authRequest).toHaveBeenCalledWith('a'.repeat(64));
  });

  it('should handle successful login', () => {
    mockAuthService.onTokenSubmit.and.returnValue(of(true));
    spyOn(mockRouter, 'navigate');

    component.authRequest('a'.repeat(64));

    expect(mockAuthService.loggedIn).toHaveBeenCalled();
    expect(mockGorestService.setSession).toHaveBeenCalledWith('a'.repeat(64));
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/users']);
  });

  it('should handle login error', () => {
    mockAuthService.onTokenSubmit.and.returnValue(
      throwError(() => new Error('Invalid token'))
    );

    component.authRequest('a'.repeat(64));

    expect(component.loginForm.controls['token'].value).toBe(null);
  });

  it('should reset form and mark token as untouched on login error', () => {
    mockAuthService.onTokenSubmit.and.returnValue(
      throwError(() => new Error('Invalid token'))
    );

    component.authRequest('a'.repeat(64));

    expect(component.loginForm.controls['token'].value).toBe(null);
    expect(component.loginForm.controls['token'].touched).toBeFalse();
  });

  it('should unsubscribe from observables on destroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');

    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
});
