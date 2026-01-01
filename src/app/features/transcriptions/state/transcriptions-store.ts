import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Campaign, CampaignStats } from '../../../domain/models/campaign.model';
import { Page, PageMeta } from '../../../domain/models/page.model';
import { CampaignsService } from '../../campaigns/services/campaigns.service';
import { catchError, finalize, Observable, of, tap } from 'rxjs';
import { TranscriptionsService } from '../services/transcriptions.service';

@Injectable({
  providedIn: 'root'
})
export class TranscriptionsStore {

  private readonly _page: WritableSignal<Page<CampaignStats> | null> = signal<Page<CampaignStats> | null>(null);
  private readonly _loading: WritableSignal<boolean> = signal<boolean>(false);
  private readonly _error: WritableSignal<string | null> = signal<string | null>(null);

  public readonly page: Signal<Page<CampaignStats> | null> = this._page.asReadonly();
  public readonly campaignsStats: Signal<CampaignStats[]> = computed(() => this._page()?.items ?? []);
  public readonly meta: Signal<PageMeta | null> = computed(() => this._page()?.meta ?? null);

  public readonly loading: Signal<boolean> = this._loading.asReadonly();
  public readonly error: Signal<string | null> = this._error.asReadonly();

  constructor(
    private readonly _campaignService: CampaignsService,
    private readonly _api: TranscriptionsService
  ) { }

  public clear(): void{
    this._page.set(null);
    this._error.set(null);
  }

  public clearError(): void{
    this._error.set(null);
  }

  public load(page: number, pageSize: number, search?: string): Observable<Page<CampaignStats> | never[]>{
    this._loading.set(true);
    this._error.set(null);

    return this._campaignService.loadStatsAll(page, pageSize, search).pipe(
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


  public uploadSingle(file: File, campaign_id: number): Observable<any> {
    this._loading.set(true);
    this._error.set(null);

    return this._api.uploadAudio({file, campaign_id}).pipe(
      tap(() => {
        // const sub = this._store
        //   .load(p, ps, search)
        //   .pipe(takeUntilDestroyed(this._destroyRef))
        //   .subscribe();
      }),
      catchError((err) => {
        this._error.set(err?.error?.detail ?? 'Error al subir el audio');
        return of(null);
      }),
      finalize(() => this._loading.set(false))
    );
  }

  public uploadMultiple(files: File[], campaign_id: number): Observable<any> {
    this._loading.set(true);
    this._error.set(null);

    return this._api.uploadMultipleAudios({files, campaign_id}).pipe(
      tap(() => {
        // this.loadAll(); // Recargar lista
      }),
      catchError((err) => {
        this._error.set(err?.error?.detail ?? 'Error al subir los audios');
        return of(null);
      }),
      finalize(() => this._loading.set(false))
    );
  }
}
