import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

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
