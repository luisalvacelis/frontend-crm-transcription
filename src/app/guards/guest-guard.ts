import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthApiService } from '../features/auth/services/auth-api.service';

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthApiService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return router.createUrlTree(['/']);
  }

  return true;
};
