import { DatePipe } from '@angular/common';
import { Component, DestroyRef, effect, inject, Signal, signal, viewChild, WritableSignal } from '@angular/core';
import { TranscriptionsStore } from '../../state/transcriptions.store';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { CampaignStats } from '../../../../domain/models/campaign.model';
import { PageMeta } from '../../../../domain/models/page.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UploadAudios } from "../upload-audios/upload-audios";
import { CampaignDetails } from '../campaign-details/campaign-details';
import { Router } from "@angular/router";
import { CampaignsStore } from '../../../campaigns/state/campaigns.store';
import { DeleteCampaign } from '../../../campaigns/components/delete-campaign/delete-campaign';

@Component({
  selector: 'app-transcriptions-table',
  imports: [DatePipe, UploadAudios, CampaignDetails, DeleteCampaign],
  templateUrl: './transcriptions-table.html',
})
export class TranscriptionsTable {

  public readonly newAudiosTranscriptionModal: Signal<UploadAudios> = viewChild.required(UploadAudios);
  public readonly campaignDetailsModal: Signal<CampaignDetails> = viewChild.required(CampaignDetails);
  public readonly deletecampaignModal: Signal<DeleteCampaign> = viewChild.required(DeleteCampaign);

  private readonly _store: TranscriptionsStore = inject(TranscriptionsStore);
  private readonly _campaignStore: CampaignsStore = inject(CampaignsStore);
  private readonly _router: Router = inject(Router);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private readonly _searchSubject: Subject<string> = new Subject<string>();

  public readonly page: WritableSignal<number> = signal<number>(1);
  public readonly pageSize: WritableSignal<number> = signal<number>(10);
  public readonly searchTerm: WritableSignal<string> = signal<string>('');

  public readonly campaignsStats: Signal<CampaignStats[]> = this._store.campaignsStats;
  public readonly meta: Signal<PageMeta | null> = this._store.meta;
  public readonly loading: Signal<boolean> = this._store.loading;
  public readonly error: Signal<string | null> = this._store.error;

  constructor(){
    effect((onCleanup) => {
      const p = this.page();
      const ps = this.pageSize();
      const search = this.searchTerm();

      const sub = this._store
        .load(p, ps, search)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe();

      onCleanup(() => sub.unsubscribe());

      this._searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe((term) => {
        this.searchTerm.set(term);
        this.page.set(1);
      });
    });
  }

  public onSearchChange(term: string): void{
    this._searchSubject.next(term);
  }

  public clearSearch(): void{
    this.searchTerm.set('');
    this.page.set(1);
  }

  public nextPage(): void{
    const m = this.meta();
    if(!m) return;
    if(this.page() < m._pages) this.page.set(this.page() + 1);
  }

  public prevPage(): void{
    if(this.page() > 1) this.page.set(this.page() - 1);
  }

  public setPageSize(pageSize: number): void{
    this.pageSize.set(pageSize);
    this.page.set(1);
  }

  public newAudios(): void{
    this.newAudiosTranscriptionModal().open();
  }

  public transcribeAudios(campaignStats: CampaignStats): void {
    if (!campaignStats) return;
    const encoded = btoa(campaignStats.id.toString());
    this._router.navigate(['/transcriptions/audios/transcribe', encoded]);
  }

  public campaignDetails(campaignStats: CampaignStats): void {
    if(!campaignStats) return;
    this.campaignDetailsModal().open(campaignStats);
  }

  public deleteCampaign(campaignStats: CampaignStats): void {
    if(!campaignStats) return;

    this._campaignStore.searchByID(campaignStats.id!).subscribe((campaign) => {
      this.deletecampaignModal().open(campaign!);
    });
  }
}
