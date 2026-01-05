import { Component, computed, DestroyRef, effect, ElementRef, inject, signal, Signal, viewChild, WritableSignal } from '@angular/core';
import { CampaignStats } from '../../../../domain/models/campaign.model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AudiosStore } from '../../../audios/state/audios.store';
import { Audio } from '../../../../domain/models/audios.model';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { PageMeta } from '../../../../domain/models/page.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UploadAudios } from '../upload-audios/upload-audios';
import { EditCampaign } from '../../../campaigns/components/edit-campaign/edit-campaign';
import { CampaignsStore } from '../../../campaigns/state/campaigns.store';
import { DeleteCampaign } from '../../../campaigns/components/delete-campaign/delete-campaign';

type TabKey = 'audios' | 'analysis' | 'settings';

@Component({
  selector: 'app-campaign-details',
  imports: [DatePipe, CurrencyPipe, UploadAudios, EditCampaign, DeleteCampaign],
  templateUrl: './campaign-details.html',
})
export class CampaignDetails {

  public readonly dlg: Signal<ElementRef<HTMLDialogElement>> = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');
  public readonly newAudioModal: Signal<UploadAudios> = viewChild.required(UploadAudios);
  public readonly editCampaignModal: Signal<EditCampaign> = viewChild.required(EditCampaign);
  public readonly deletecampaignModal: Signal<DeleteCampaign> = viewChild.required(DeleteCampaign);

  private readonly _campaignStats: WritableSignal<CampaignStats | null> = signal<CampaignStats | null>(null);
  private readonly _store: AudiosStore = inject(AudiosStore);
  private readonly _campaignStore: CampaignsStore = inject(CampaignsStore);
  private readonly _searchSubject: Subject<string> = new Subject<string>();
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);

  public readonly campaign: Signal<CampaignStats | null> = this._campaignStats.asReadonly();
  public readonly tab: WritableSignal<TabKey> = signal<TabKey>('audios');
  public readonly audioQuery: WritableSignal<string> = signal<string>('');
  public readonly audios: Signal<Audio[]> = this._store.audios;
  public readonly searchTerm: WritableSignal<string> = signal<string>('');
  public readonly page: WritableSignal<number> = signal<number>(1);
  public readonly pageSize: WritableSignal<number> = signal<number>(4);
  public readonly meta: Signal<PageMeta | null> = this._store.meta;
  public readonly loading: Signal<boolean> = this._store.loading;
  public readonly error: Signal<string | null> = this._store.error;

  constructor(){
    effect((onCleanup) => {
      const p = this.page();
      const ps = this.pageSize();
      const search = this.searchTerm();

      const sub = this._store
        .load(p, ps,this.campaign()?.id, '', search)
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

  public onSearchChange(term: string): void{
    this._searchSubject.next(term);
  }

  public clearSearch(): void{
    this.searchTerm.set('');
    this.page.set(1);
  }

  public open(campaignStats: CampaignStats | null): void{
    if (!campaignStats) return;

    this._campaignStats.set(campaignStats);
    this.dlg().nativeElement.showModal();
  }

  public close(): void{
    this.dlg().nativeElement.close();
  }

  public kpiTotalAudios(): number | undefined{
    return this._campaignStats()?.total_audios;
  }

  public kpiDone(): number | undefined{
    return this._campaignStats()?.total_transcribed;
  }

  public kpiProcessing(): number | undefined{
    return this._campaignStats()?.processing ?? this._campaignStats()?.queued;
  }

  public kpiTotalDurationLabel(): number | undefined{
    return this._campaignStats()?.total_duration_seconds;
  }

  public kpiTotalCost(): number | undefined{
    return this._campaignStats()?.total_cost;
  }

  public openUploadAudios(): void{
    this.newAudioModal().open();
    this.close();
  }

  public openEditCampaign(): void{
    const campaign_id = this._campaignStats()?.id;

    this._campaignStore.searchByID(campaign_id!).subscribe((campaign) => {
      this.editCampaignModal().open(campaign!);
    });

    this.close();
  }

  public openDeleteCampaign(): void{
    const campaign_id = this._campaignStats()?.id;

    this._campaignStore.searchByID(campaign_id!).subscribe((campaign) => {
      this.deletecampaignModal().open(campaign!);
    });

    this.close();
  }
}
