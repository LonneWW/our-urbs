import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { UsersListComponent } from './components/users-list/users-list.component';
import { loginGuard } from './guards/login.guard';

export const routes: Routes = [
  { path: '', component: UsersListComponent, canActivate: [loginGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: UsersListComponent, canActivate: [loginGuard] },
];
