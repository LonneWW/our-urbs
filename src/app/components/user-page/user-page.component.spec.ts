import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserPageComponent } from './user-page.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GorestService } from '../../services/gorest.service';
import { SearchService } from '../../services/search.service';
import { User } from '../../interfaces/user';
import { Post } from '../../interfaces/post';
import { of, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { LoginComponent } from '../login/login.component';
import { NotFoundComponent } from '../not-found/not-found.component';

@Component({
  selector: 'app-user-details',
  template: '',
  standalone: true,
})
class MockUserDetailsComponent {
  @Input() user!: User;
  @Input() posts!: Post[];
  @Output() deleteUser = new EventEmitter<void>();
}

@Component({
  selector: 'app-posts-list',
  template: '',
  standalone: true,
})
class MockPostsListComponent {
  @Input() posts!: Post[];
  @Input() user!: User;
  @Input() allPostsPage!: boolean;
  @Output() onPostsAvailability = new EventEmitter<Post[]>();
}

describe('UserPageComponent', () => {
  let component: UserPageComponent;
  let fixture: ComponentFixture<UserPageComponent>;
  let mockGorestService: jasmine.SpyObj<GorestService>;
  let mockSearchService: jasmine.SpyObj<SearchService>;
  let mockActivatedRoute;

  beforeEach(async () => {
    mockGorestService = jasmine.createSpyObj('GorestService', [
      'getUsers',
      'patchUser',
      'deleteUser',
      'setCurrentUser',
    ]);
    mockSearchService = jasmine.createSpyObj(
      'SearchService',
      ['updateSearch'],
      {
        search$: new BehaviorSubject<string>(''), // Mock di search$
      }
    );
    mockActivatedRoute = { paramMap: of(new Map().set('id', '1')) }; // Mock di ActivatedRoute

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
        MatTabsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        UserPageComponent,
        MockUserDetailsComponent, // Import del componente mock standalone
        MockPostsListComponent, // Import del componente mock standalone
      ],
      providers: [
        { provide: GorestService, useValue: mockGorestService },
        { provide: SearchService, useValue: mockSearchService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }, // Fornisce ActivatedRoute
        provideHttpClient(),
        provideRouter([
          {
            path: 'register',
            component: LoginComponent,
          },
          {
            path: '**',
            component: NotFoundComponent,
          },
        ]),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should patch user data', () => {
    const dummyUser: User = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      gender: 'male',
      status: 'active',
    };
    const changes = { name: 'John Updated', email: 'email@mazinga.com' };
    mockGorestService.patchUser.and.returnValue(
      of({ ...dummyUser, ...changes })
    );
    component.user = dummyUser;
    component.editCredentialsForm.patchValue(changes);

    spyOn(window, 'confirm').and.returnValue(true);
    component.patchField();

    expect(mockGorestService.patchUser).toHaveBeenCalledWith(
      dummyUser,
      changes
    );
    expect(component.user.name).toBe('John Updated');
    expect(component.user.email).toBe('email@mazinga.com');
  });

  it('should delete user', () => {
    const dummyUser: User = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      gender: 'male',
      status: 'active',
    };
    mockGorestService.deleteUser.and.returnValue(of({}));
    component.currentUser = dummyUser; // Imposta il currentUser
    component.user = dummyUser; // Imposta l'utente

    // Imposta l'utente nel localStorage
    localStorage.setItem('user', JSON.stringify(dummyUser));

    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteUser();

    expect(mockGorestService.deleteUser).toHaveBeenCalledWith(dummyUser);
  });

  it('should update search string and hide posts on destroy', () => {
    component.ngOnDestroy();

    expect(mockSearchService.updateSearch).toHaveBeenCalledWith('');
    expect(component.showPosts).toBeFalse();
  });

  it('should emit available posts', () => {
    const dummyPosts: Post[] = [{ id: 1, title: 'Post 1', body: 'Post body' }];
    component.postsAvailability(dummyPosts);

    expect(component.posts).toEqual(dummyPosts);
    expect(component.showPosts).toBeTrue();
  });
});
