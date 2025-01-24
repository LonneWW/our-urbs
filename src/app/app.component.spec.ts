import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { UsersListComponent } from './components/users-list/users-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { PostsListComponent } from './components/posts-list/posts-list.component';
import { UserPageComponent } from './components/user-page/user-page.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideHttpClient(),
        provideRouter([
          {
            path: '',
            component: UsersListComponent,
          },
          {
            path: 'login',
            component: LoginComponent,
          },
          {
            path: 'register',
            component: RegisterComponent,
          },
          {
            path: 'users',
            component: UsersListComponent,
          },
          {
            path: 'posts',
            component: PostsListComponent,
          },
          {
            path: 'users/:id',
            component: UserPageComponent,
          },
          {
            path: 'error',
            component: NotFoundComponent,
          },
          {
            path: '**',
            component: NotFoundComponent,
          },
        ]),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
