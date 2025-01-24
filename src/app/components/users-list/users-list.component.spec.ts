import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersListComponent } from './users-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, BehaviorSubject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { GorestService } from '../../services/gorest.service';
import { SearchService } from '../../services/search.service';
import { User } from '../../interfaces/user';

describe('UsersListComponent', () => {
  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;
  let mockGorestService: jasmine.SpyObj<GorestService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let searchSubject: BehaviorSubject<string>;

  beforeEach(async () => {
    mockGorestService = jasmine.createSpyObj('GorestService', [
      'getUsers',
      'setCurrentUser',
    ]);
    mockAuthService = jasmine.createSpyObj('AuthService', ['loggingOut']);
    searchSubject = new BehaviorSubject<string>('');
    const mockSearchService = {
      search$: searchSubject.asObservable(),
      updateSearch: jasmine
        .createSpy('updateSearch')
        .and.callFake((query: string) => searchSubject.next(query)),
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
        UsersListComponent,
      ],
      providers: [
        { provide: GorestService, useValue: mockGorestService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: SearchService, useValue: mockSearchService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update users on search', () => {
    const dummyUsers: User[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        gender: 'male',
        status: 'active',
      },
    ];
    mockGorestService.getUsers.and.returnValue(of(dummyUsers));

    searchSubject.next('John');
    fixture.detectChanges();

    expect(component.users).toEqual(dummyUsers);
    expect(mockGorestService.getUsers).toHaveBeenCalledWith(1, 8, 'John');
  });

  it('should handle empty search string', () => {
    searchSubject.next('');
    fixture.detectChanges();

    expect(component.getSearchString()).toBe('');
  });

  it('should navigate to user page', () => {
    const navigateSpy = spyOn((component as any).router, 'navigate');
    const user: User = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      gender: 'male',
      status: 'active',
    };

    component.redirectToUserPage(user);

    expect(navigateSpy).toHaveBeenCalledWith([`/users/${user.id}`]);
  });

  it('should clean up on destroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
});
