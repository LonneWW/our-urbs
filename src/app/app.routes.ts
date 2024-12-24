import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { PostsListComponent } from './components/posts-list/posts-list.component';
import { UserPageComponent } from './components/user-page/user-page.component';
import { loginGuard } from './guards/login.guard';

export const routes: Routes = [
  { path: '', component: UsersListComponent, canActivate: [loginGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'users', component: UsersListComponent, canActivate: [loginGuard] },
  { path: 'posts', component: PostsListComponent, canActivate: [loginGuard] },
  {
    path: 'users/:id',
    component: UserPageComponent,
    canActivate: [loginGuard],
  },
];
