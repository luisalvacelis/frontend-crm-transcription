import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthApiService } from '../features/auth/services/auth-api.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthApiService);
  const router = inject(Router);

  if (auth.isLoggedIn()) return true;

  return router.createUrlTree(['/auth/login']);
};
