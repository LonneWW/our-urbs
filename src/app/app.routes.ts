import { Routes } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { PostsListComponent } from './components/posts-list/posts-list.component';
import { UserPageComponent } from './components/user-page/user-page.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { loggedInGuard } from './guards/logged-in.guard';
import { loggingOutGuard } from './guards/logging-out.guard';
import { existingUserGuard } from './guards/existing-user.guard';

export const routes: Routes = [
  {
    path: '',
    component: UsersListComponent,
    canActivate: [loggedInGuard, existingUserGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [existingUserGuard, loggingOutGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [loggingOutGuard],
  },
  {
    path: 'users',
    component: UsersListComponent,
    canActivate: [loggedInGuard, existingUserGuard],
  },
  {
    path: 'posts',
    component: PostsListComponent,
    canActivate: [loggedInGuard, existingUserGuard],
  },
  {
    path: 'users/:id',
    component: UserPageComponent,
    canActivate: [loggedInGuard, existingUserGuard],
  },
  {
    path: 'error',
    component: NotFoundComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
