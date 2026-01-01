import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AuthApiService } from './auth-api.service';

@Injectable({ providedIn: 'root' })
export class AuthFacadeService {

  private readonly _auth = inject(AuthApiService);
  private readonly _router = inject(Router);

  private readonly _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  logout(redirectTo = '/auth/login'): void {
    this._loading.set(true);
    this._auth.logout();
    this._loading.set(false);
    this._router.navigateByUrl(redirectTo);
  }
}
