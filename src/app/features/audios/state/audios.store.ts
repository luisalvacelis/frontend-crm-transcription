import { Injectable, signal, WritableSignal, Signal } from '@angular/core';
import { catchError, finalize, Observable, of, tap } from 'rxjs';
import { AudiosService } from '../services/audios.service';

@Injectable({
  providedIn: 'root'
})
export class AudiosStore {

  private readonly _uploading: WritableSignal<boolean> = signal<boolean>(false);
  private readonly _error: WritableSignal<string | null> = signal<string | null>(null);

  public readonly uploading: Signal<boolean> = this._uploading.asReadonly();
  public readonly error: Signal<string | null> = this._error.asReadonly();

  constructor(
    private readonly _api: AudiosService
  ) { }

  public clearError(): void {
    this._error.set(null);
  }

  public uploadSingle(file: File, campaign_id: number): Observable<any> {
    this._uploading.set(true);
    this._error.set(null);

    return this._api.uploadAudio({ file, campaign_id }).pipe(
      tap(() => {
        // Recargar si es necesario
      }),
      catchError((err) => {
        this._error.set(err?.error?.detail ?? 'Error al subir el audio');
        return of(null);
      }),
      finalize(() => this._uploading.set(false))
    );
  }

  public uploadMultiple(files: File[], campaign_id: number): Observable<any> {
    this._uploading.set(true);
    this._error.set(null);

    return this._api.uploadMultipleAudios({ files, campaign_id }).pipe(
      tap(() => {
        // Recargar si es necesario
      }),
      catchError((err) => {
        this._error.set(err?.error?.detail ?? 'Error al subir los audios');
        return of(null);
      }),
      finalize(() => this._uploading.set(false))
    );
  }
}
