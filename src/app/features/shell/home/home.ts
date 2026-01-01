import { Component, DestroyRef, computed, effect, inject, OnInit, WritableSignal, signal, Signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Navbar } from '../../../shared/navbar/navbar';
import { Sidebar } from '../../../shared/sidebar/sidebar';
import { Footer } from '../../../shared/footer/footer';
import { Loading } from '../../../shared/loading/loading';

import { SessionStore } from '../../auth/state/session.store';

import { User } from '../../../domain/models/user.model';
import { AuthFacadeService } from '../../auth/services/auth-facade.service';

@Component({
  selector: 'app-home',
  imports: [Navbar, Sidebar, RouterOutlet, Footer, Loading],
  templateUrl: './home.html',
})
export class Home implements OnInit {

  private readonly _session: SessionStore = inject(SessionStore);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private readonly _authFacade: AuthFacadeService = inject(AuthFacadeService);

  private readonly _logoutOnce: WritableSignal<boolean> = signal<boolean>(false);
  private readonly _me: Signal<User | null> = this._session.me;
  private readonly _error: Signal<string | null> = this._session.error;

  private readonly _loading: Signal<boolean> = computed(() =>
    this._session.loading()
  );

  constructor() {
    effect(() => {
      const me = this._me();

      if(this._error()){
        this._logoutOnce.set(true);
        this._authFacade.logout('/auth/login');
        return;
      }

      if (!me) {
        return;
      }

      if (!me.is_active && !this._logoutOnce()) {
        this._logoutOnce.set(true);
        this._authFacade.logout('/auth/login');
        return;
      }
    });
  }

  ngOnInit(): void {
    this._session
      .loadMeOnce()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe();
  }

  public get me(): User | null {
    return this._me();
  }
  public get loading(): boolean {
    return this._loading();
  }
}
