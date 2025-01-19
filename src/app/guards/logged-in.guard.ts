import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

/**
 * The `loggedInGuard` function checks if a user is logged in based on the presence of a token and
 * redirects to the login or register page accordingly.
 * @returns The `loggedInGuard` function returns a boolean value (`true` or `false`) based on the
 * conditions checked within the function. If a valid token is found in the session storage, the
 * function returns `true`, indicating that the user is logged in. If no token is found but a user is
 * present in the local storage, the function navigates to the login page and returns `false`.
 */
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
