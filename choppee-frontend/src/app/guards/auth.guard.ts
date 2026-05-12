// src/app/guards/auth.guard.ts
//
// Functional route guard using the AuthService's isLoggedIn() signal.

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;
  }
  // Redirect to login; the signal-based guard re-evaluates automatically
  return router.createUrlTree(['/login']);
};
