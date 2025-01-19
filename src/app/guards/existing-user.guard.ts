import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

/**
 * The `existingUserGuard` function checks if a user is already logged in (saved in the local storage)
 * and redirects to the registration page if not.
 * @returns The `existingUserGuard` function returns a boolean value based on whether a user is found
 * in the localStorage. If a user is found, it returns `true`, indicating that the user exists. If a
 * user is not found, it displays an alert message and navigates to the 'register' route using the
 * router, then returns `false`.
 */
export const existingUserGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const user = localStorage.getItem('user');
  if (user) {
    return true;
  } else {
    alert(
      'User not found. Please register first or try recover your user details.'
    );
    router.navigate(['register']);
    return false;
  }
};
