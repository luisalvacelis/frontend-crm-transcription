import { DatePipe } from '@angular/common';
import { Component, DestroyRef, effect, inject, Signal, signal, viewChild, WritableSignal } from '@angular/core';
import { CampaignsStore } from '../../state/campaigns.store';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Campaign } from '../../../../domain/models/campaign.model';
import { PageMeta } from '../../../../domain/models/page.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NewCampaign } from '../new-campaign/new-campaign';
import { EditCampaign } from '../edit-campaign/edit-campaign';
import { DeleteCampaign } from '../delete-campaign/delete-campaign';

@Component({
  selector: 'app-table-campaigns',
  imports: [DatePipe, NewCampaign, EditCampaign, DeleteCampaign],
  templateUrl: './table-campaigns.html',
})
export class TableCampaigns {

  public readonly newCampaignModal: Signal<NewCampaign> = viewChild.required(NewCampaign);
  public readonly editCampaignModal: Signal<EditCampaign> = viewChild.required(EditCampaign);
  public readonly deleteCampaignModal: Signal<DeleteCampaign> = viewChild.required(DeleteCampaign);

  private readonly _store: CampaignsStore = inject(CampaignsStore);
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private readonly _searchSubject: Subject<string> = new Subject<string>();

  public readonly page: WritableSignal<number> = signal<number>(1);
  public readonly pageSize: WritableSignal<number> = signal<number>(10);
  public readonly searchTerm: WritableSignal<string> = signal<string>('');

  public readonly campaigns: Signal<Campaign[]> = this._store.campaigns;
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

  public newCampaign(): void{
    this.newCampaignModal().open();
  }

  public editCampaign(campaign: Campaign): void {
    this.editCampaignModal().open(campaign);
  }

  public deleteCampaign(campaign: Campaign): void{
    this.deleteCampaignModal().open(campaign);
  }
}
