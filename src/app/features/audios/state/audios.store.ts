import { Injectable, signal, WritableSignal, Signal, computed } from '@angular/core';
import { catchError, finalize, Observable, of, Subject, tap, throwError } from 'rxjs';
import { AudiosService } from '../services/audios.service';
import { Page, PageMeta } from '../../../domain/models/page.model';
import { Audio } from '../../../domain/models/audios.model';

@Injectable({
  providedIn: 'root'
})
export class AudiosStore {

  private readonly _uploading: WritableSignal<boolean> = signal<boolean>(false);
  private readonly _error: WritableSignal<string | null> = signal<string | null>(null);
  private readonly _uploadComplete = new Subject<void>();

  public readonly uploadComplete$ = this._uploadComplete.asObservable();
  public readonly uploading: Signal<boolean> = this._uploading.asReadonly();
  public readonly error: Signal<string | null> = this._error.asReadonly();

  private readonly _page: WritableSignal<Page<Audio> | null> = signal<Page<Audio> | null>(null);
  private readonly _loading: WritableSignal<boolean> = signal<boolean>(false);
  private readonly _listError: WritableSignal<string | null> = signal<string | null>(null);

  private readonly _currentCampaignId: WritableSignal<number | null> = signal<number | null>(null);

  public readonly page: Signal<Page<Audio> | null> = this._page.asReadonly();
  public readonly audios: Signal<Audio[]> = computed(() => this._page()?.items ?? []);
  public readonly meta: Signal<PageMeta | null> = computed(() => this._page()?.meta ?? null);
  public readonly loading: Signal<boolean> = this._loading.asReadonly();
  public readonly listError: Signal<string | null> = this._listError.asReadonly();

  constructor(
    private readonly _api: AudiosService
  ) { }

  public uploadSingle(file: File, campaign_id: number): Observable<any> {
    this._uploading.set(true);
    this._error.set(null);

    return this._api.uploadAudio({ file, campaign_id }).pipe(
      tap(() => {
        this._uploadComplete.next();
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
        this._uploadComplete.next();
      }),
      catchError((err) => {
        this._error.set(err?.error?.detail ?? 'Error al subir los audios');
        return of(null);
      }),
      finalize(() => this._uploading.set(false))
    );
  }

  public clear(): void{
    this._page.set(null);
    this._listError.set(null);
    this._currentCampaignId.set(null);
  }

  public clearError(): void {
    this._error.set(null);
  }

  public load(page: number, pageSize: number, campaignId?: number, status?: string, search?: string): Observable<Page<Audio> | never[]> {
    this._loading.set(true);
    this._listError.set(null);

    if (campaignId !== undefined) {
      this._currentCampaignId.set(campaignId);
    }

    const finalCampaignId = campaignId ?? this._currentCampaignId();

    return this._api.load(page, pageSize, finalCampaignId ?? undefined, status, search).pipe(
      tap(result => {
        this._page.set(result);
      }),
      catchError((err) => {
        this._listError.set(err?.error?.detail ?? err?.error?.message ?? 'Error cargando audios');
        return of([]);
      }),
      finalize(() => this._loading.set(false))
    );
  }

  public refresh(): void {
    const currentMeta = this.meta();
    const currentCampaignId = this._currentCampaignId();

    if (currentMeta) {
      this.load(
        currentMeta._page,
        currentMeta._pageSize,
        currentCampaignId ?? undefined
      ).subscribe();
    }
  }

  public delete(audioId: number): Observable<void> {
    this._loading.set(true);
    this._listError.set(null);

    return this._api.delete(audioId).pipe(
      tap(() => {
        this.refresh();
      }),
      catchError((err) => {
        const message = err?.error?.detail ?? err?.error?.message ?? 'Error: No se pudo eliminar el audio.';
        this._listError.set(message);
        return throwError(() => err);
      }),
      finalize(() => this._loading.set(false))
    );
  }

  public deleteAllByCampaign(campaignId: number): Observable<void> {
    this._loading.set(true);
    this._listError.set(null);

    return this._api.deleteAllByCampaign(campaignId).pipe(
      tap(() => {
        this._page.set(null);
        this._currentCampaignId.set(null);
      }),
      catchError((err) => {
        const message = err?.error?.detail ?? err?.error?.message ?? 'Error: No se pudieron eliminar los audios.';
        this._listError.set(message);
        return throwError(() => err);
      }),
      finalize(() => this._loading.set(false))
    );
  }
}
