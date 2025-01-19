import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

/**
 * The loggingOutGuard function checks if a user is logged in and prompts for logout confirmation, with
 * a fallback to redirect to the users page if logout is denied.
 * @returns The `loggingOutGuard` function is returning a boolean value based on the conditions inside
 * the function. If there is a token in the session storage, it will prompt the user with a
 * confirmation dialog to logout. If the user confirms, it will call the `authService.loggingOut()`
 * method and return `true`. Otherwise it returns false.
 */
export const loggingOutGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const currentUser = localStorage.getItem('user');
  const token = sessionStorage.getItem('token');
  if (currentUser && token) {
    let approval = confirm('Do you wish to logout?');
    if (approval) {
      authService.loggingOut();
      return true;
    } else {
      //If there's a user in the localStorage and the first access is to the login page
      //the guard will activate. If you deny the logout it could redirect into an empty
      //page. In these cases, forcing the navigation to the users page should fix the issue.
      if ((window.location.pathname = '/')) router.navigate(['users']);
      return false;
    }
  }
  authService.loggingOut();
  return true;
};
