import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const loggedInGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = localStorage.getItem('user');
  const token = sessionStorage.getItem('token');
  if (token) {
    authService.loggedIn();
    return true;
  } else {
    if (user) {
      router.navigate(['login']);
    } else {
      router.navigate(['register']);
    }
    return false;
  }
};
