import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { catchError, finalize, Observable, of, switchMap, tap } from 'rxjs';

import { AuthApiService } from '../services/auth-api.service';
import { TokenStorageService } from '../../../core/storage/token-storage.service';
import { User } from '../../../domain/models/user.model';
import { LoginDto, LoginResponseDto, SignUpDto, SignUpResponseDto } from '../../../api/dtos/auh.interface';

@Injectable({ providedIn: 'root' })
export class SessionStore {

  private readonly _accessToken: WritableSignal<string | null> = signal<string | null>('');
  private readonly _tokenType: WritableSignal<string | null> = signal<string | null>('');
  private readonly _me: WritableSignal<User | null> = signal<User | null>(null);
  private readonly _loading: WritableSignal<boolean> = signal(false);
  private readonly _error: WritableSignal<string | null> = signal<string | null>(null);

  public readonly me: Signal<User | null> = this._me.asReadonly();
  public readonly loading: Signal<boolean> = this._loading.asReadonly();
  public readonly error: Signal<string | null> = this._error.asReadonly();

  constructor(
    private readonly _authApi: AuthApiService,
    private readonly _token: TokenStorageService,
  ) {}

  public setLoginResponse(response: LoginResponseDto): void {
    this._accessToken.set(response.access_token);
    this._tokenType.set(response.token_type);
  }

  public clear(): void {
    this._accessToken.set(null);
    this._tokenType.set(null);
    this._me.set(null);
    this._error.set(null);
  }

  public loadMeOnce(): Observable<User | null> {
    if (this._me()) return of(this._me());
    return this.loadMe();
  }

  public loadMe(): Observable<User | null> {
    if (!this._token.hasToken()) {
      this.clear();
      return of(null);
    }

    this._loading.set(true);
    this._error.set(null);

    return this._authApi.me().pipe(
      tap(u => this._me.set(u)),
      catchError(() => {
        this.clear();
        this._error.set('No se pudo cargar el usuario');
        return of(null);
      }),
      finalize(() => this._loading.set(false)),
    );
  }

  public login(dto: LoginDto): Observable<User | null> {
    this._loading.set(true);
    this._error.set(null);

    return this._authApi.login(dto).pipe(
      switchMap(() => this.loadMe()),
      catchError((err) => {
        this._error.set(err?.error?.detail ?? err?.error?.message ?? 'Error: No se pudo loguear.');
        return of(null);
      }),
      finalize(() => this._loading.set(false))
    );
  }

  public singUp(dto: SignUpDto): Observable<SignUpResponseDto | null>{
    this._loading.set(true);
    this._error.set(null);

    return this._authApi.signUp(dto).pipe(
      catchError((err) =>{
        this._error.set(err?.error?.detail ?? err?.error?.message ?? 'Error: No se pudo registrar.');
        return of(null);
      }),
      finalize(() => this._loading.set(false))
    );
  }
}
