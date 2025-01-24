import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { GorestService } from './gorest.service';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let mockGorestService: jasmine.SpyObj<GorestService>;

  beforeEach(() => {
    mockGorestService = jasmine.createSpyObj('GorestService', [
      'getUsers',
      'deleteCurrentUser',
    ]);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: GorestService, useValue: mockGorestService }, // Fornisce il mock di GorestService
      ],
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get auth token from sessionStorage', () => {
    const token = 'dummy-token';
    sessionStorage.setItem('token', token);

    expect(service.getAuthToken()).toBe(token);
    sessionStorage.removeItem('token');
  });

  it('should set auth token', () => {
    const token = 'new-token';
    service.setAuthToken(token);

    expect(service.getAuthToken()).toBe(token);
  });

  it('should set and get isLoggedIn status', () => {
    service.loggedIn();
    expect(service.isLoggedIn).toBe(true);

    service.loggingOut();
    expect(service.isLoggedIn).toBe(false);
  });

  it('should call GorestService getUsers on token submit', () => {
    const userToken = 'dummy-token';
    service.setAuthToken(userToken);
    const dummyUser = { id: 1, name: 'John Doe', email: 'john@example.com' };
    mockGorestService.getUsers.and.returnValue(of([dummyUser]));

    service.onTokenSubmit(userToken).subscribe((response) => {
      expect(response).toEqual([dummyUser]);
    });

    expect(mockGorestService.getUsers).toHaveBeenCalledWith(1, 1, undefined);
    expect(service.getAuthToken()).toBe(userToken);
  });

  it('should call GorestService deleteCurrentUser on logging out', () => {
    service.loggingOut();
    expect(service.isLoggedIn).toBe(false);
    expect(service.getAuthToken()).toBe(undefined);
    expect(mockGorestService.deleteCurrentUser).toHaveBeenCalled();
  });
});
