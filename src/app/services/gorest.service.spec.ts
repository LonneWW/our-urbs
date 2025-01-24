import { TestBed } from '@angular/core/testing';
import { GorestService } from './gorest.service';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { User } from '../interfaces/user';

describe('GorestService', () => {
  let service: GorestService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Fornisce HttpClient
        provideHttpClientTesting(), // Fornisce HttpTestingController
        GorestService,
      ],
    });
    service = TestBed.inject(GorestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch users successfully', () => {
    const dummyUsers: User[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        gender: 'male',
        status: 'active',
      },
      {
        id: '2',
        name: 'Jane Doe',
        email: 'jane@example.com',
        gender: 'female',
        status: 'inactive',
      },
    ];
    service.getUsers(1, 10).subscribe((users) => {
      expect(users).toEqual(dummyUsers);
    });

    const req = httpMock.expectOne(
      `${service['apiUrl']}/users?page=1&per_page=10`
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyUsers);
  });

  it('should create a user', () => {
    const newUser: User = {
      id: '2',
      name: 'Jane Doe',
      email: 'jane@example.com',
      gender: 'female',
      status: 'inactive',
    };
    service.createUser(newUser).subscribe((user) => {
      expect(user).toEqual(newUser);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/users`);
    expect(req.request.method).toBe('POST');
    req.flush(newUser);
  });

  it('should delete a user', () => {
    const user: User = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      gender: 'male',
      status: 'active',
    };
    service.deleteUser(user).subscribe((response) => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/users/${user.id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should patch a user', () => {
    const user: User = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      gender: 'male',
      status: 'active',
    };
    const changes = { name: 'John Updated' };
    service.patchUser(user, changes).subscribe((updatedUser) => {
      expect(updatedUser).toEqual({ ...user, ...changes });
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/users/${user.id}`);
    expect(req.request.method).toBe('PATCH');
    req.flush({ ...user, ...changes });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
