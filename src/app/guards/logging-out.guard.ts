import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const loggingOutGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = sessionStorage.getItem('token');
  if (token) {
    let response = confirm('Do you wish to logout?');
    if (response) {
      authService.loggingOut();
      return true;
    } else {
      return false;
    }
  }
  return true;
};
