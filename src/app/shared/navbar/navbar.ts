import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeButtons } from '../theme-buttons/theme-buttons';
import { AuthFacadeService } from '../../features/auth/services/auth-facade.service';
import { AuthApiService } from '../../features/auth/services/auth-api.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, ThemeButtons],
  templateUrl: './navbar.html',
})
export class Navbar {
  private readonly _auth = inject(AuthApiService);
  private readonly _authFacade = inject(AuthFacadeService);

  public isLoggedIn(): boolean { return this._auth.isLoggedIn(); }
  public getLoading(): boolean { return this._authFacade.loading(); }

  public logout(): void {
    this._authFacade.logout();
  }
}
