import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';

import { ApiConfigService } from '../../../core/config/api-config.service';
import { TokenStorageService } from '../../../core/storage/token-storage.service';
import { LoginDto, LoginResponseDto, MeDto, SignUpDto, SignUpResponseDto } from '../../../api/dtos/auh.interface';
import { User } from '../../../domain/models/user.model';
import { UserMapper } from '../../../domain/mappers/user.mapper';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  constructor(
    private readonly _http: HttpClient,
    private readonly _api: ApiConfigService,
    private readonly _storage: TokenStorageService,
  ) {}

  public get token(): string | null{
    return this._storage.get();
  }

  public isLoggedIn(): boolean {
    return this._storage.hasToken();
  }

  public login(dto: LoginDto):  Observable<LoginResponseDto> {
    const url = this._api.main('auth/login');
    return this._http.post<LoginResponseDto>(url, dto).pipe(
      tap(res => this._storage.set(res.access_token))
    );
  }

  public signUp(dto: SignUpDto): Observable<SignUpResponseDto> {
    const url = this._api.main('auth/register');
    return this._http.post<SignUpResponseDto>(url, dto);
  }

  public logout()  {
    this._storage.clear();
  }

  public me(): Observable<User> {
    const url = this._api.main('auth/me');
    return this._http.get<MeDto>(url).pipe(
      map(dto => UserMapper.fromDto(dto)),
    );
  }
}
