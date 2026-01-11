import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Page, PageMeta } from '../../../domain/models/page.model';
import { catchError, finalize, Observable, of, tap, throwError } from 'rxjs';
import { Campaign, CampaignTranscribeAll } from '../../../domain/models/campaign.model';
import { CampaignsService } from '../services/campaigns.service';
import { CampaignCreateDto } from '../../../api/dtos/campaigns.interface';
import { TranscriptionsService } from '../../transcriptions/services/transcriptions.service';

@Injectable({
  providedIn: 'root'
})
export class CampaignsStore {

  private readonly _page: WritableSignal<Page<Campaign> | null> = signal<Page<Campaign> | null>(null);
  private readonly _loading: WritableSignal<boolean> = signal<boolean>(false);
  private readonly _error: WritableSignal<string | null> = signal<string | null>(null);

  public readonly page: Signal<Page<Campaign> | null> = this._page.asReadonly();
  public readonly campaigns: Signal<Campaign[]> = computed(() => this._page()?.items ?? []);
  public readonly campaignResponse: WritableSignal<Campaign | null> = signal<Campaign | null>(null);
  public readonly meta: Signal<PageMeta | null> = computed(() => this._page()?.meta ?? null);

  public readonly loading: Signal<boolean> = this._loading.asReadonly();
  public readonly error: Signal<string | null> = this._error.asReadonly();

  constructor(
    private readonly _api: CampaignsService
  ) { }

  public clear(): void{
    this._page.set(null);
    this._error.set(null);
  }

  public clearError(): void{
    this._error.set(null);
  }

  public searchByID(campaign_id: number): Observable<Campaign | null>{
    this._loading.set(true);
    this._error.set(null);
    return this._api.searchByID(campaign_id).pipe(
      tap(result => {
        this.campaignResponse.set(result);
      }),
      catchError((err) => {
        this._error.set(err?.error?.detail ?? err?.error?.message ?? 'Error cargando permisos');
        return of(null);
      }),
      finalize(() => this._loading.set(false))
    );
  }

  public load(page: number, pageSize: number, search?: string): Observable<Page<Campaign> | never[]>{
    this._loading.set(true);
    this._error.set(null);

    return this._api.load(page, pageSize, search).pipe(
      tap(result => {
        this._page.set(result);
      }),
      catchError((err) => {
        this._error.set(err?.error?.detail ?? err?.error?.message ?? 'Error cargando permisos');
        return of([]);
      }),
      finalize(() => this._loading.set(false))
    );
  }

  public loadAll(): void {
    this._loading.set(true);
    this._error.set(null);

    this._api.load(1, 100).pipe(
      tap(result => {
        this._page.set(result);
      }),
      catchError((err) => {
        this._error.set(err?.error?.detail ?? 'Error cargando campañas');
        return of(null);
      }),
      finalize(() => this._loading.set(false))
    ).subscribe();
  }

  public create(dto: CampaignCreateDto): Observable<Object | never[]> {
    this._loading.set(true);
    this._error.set(null);

    return this._api.create(dto).pipe(
      tap(() => {
        const currentMeta = this.meta();
        if (currentMeta) {
          this.load(currentMeta._page, currentMeta._pageSize).subscribe();
        }
      }),
      catchError((err) => {
        this._error.set(err?.error?.detail ?? err?.error?.message ?? 'Error: No se pudo registrar la campaña.');
        return of([]);
      }),
      finalize(() => this._loading.set(false))
    );
  }

  public update(id: number, dto: CampaignCreateDto): Observable<void> {
    this._loading.set(true);
    this._error.set(null);

    return this._api.update(id, dto).pipe(
      tap(() => {
        const meta = this.meta();
        if (meta) {
          this.load(meta._page, meta._pageSize).subscribe();
        }
      }),
      catchError((err) => {
        const message = err?.error?.detail ?? err?.error?.message ?? 'Error: No se pudo actualizar la campaña.';
        this._error.set(message);
        return throwError(() => err);
      }),
      finalize(() => this._loading.set(false))
    );
  }

  public delete(id: number): Observable<void> {
    this._loading.set(true);
    this._error.set(null);

    return this._api.delete(id).pipe(
      tap(() => {
        const meta = this.meta();
        if (meta) {
          this.load(meta._page, meta._pageSize).subscribe();
        }
      }),
      catchError((err) => {
        const message = err?.error?.detail ?? err?.error?.message ?? 'Error: No se pudo eliminar la campaña.';
        this._error.set(message);
        return throwError(() => err);
      }),
      finalize(() => this._loading.set(false))
    );
  }

  public transcribeAll(campaignId: number, provider: 'deepgram' | 'whisperx'): Observable<CampaignTranscribeAll> {
    this._loading.set(true);
    this._error.set(null);

    return this._api.transcribeAll(campaignId, provider).pipe(
      catchError((err) => {
        const message = err?.error?.detail ?? err?.error?.message ?? 'Error: No se pudo transcribir la campaña.';
        this._error.set(message);
        return throwError(() => err);
      }),
      finalize(() => this._loading.set(false))
    );
  }


}
