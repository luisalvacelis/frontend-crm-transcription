import { Component, ElementRef, inject, Signal, signal, viewChild, WritableSignal } from '@angular/core';
import { CampaignsStore } from '../../state/campaigns.store';
import { Campaign } from '../../../../domain/models/campaign.model';

@Component({
  selector: 'app-delete-campaign',
  imports: [],
  templateUrl: './delete-campaign.html',
})
export class DeleteCampaign {

  public readonly dlg: Signal<ElementRef<HTMLDialogElement>> = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');

  private readonly _campaigns: CampaignsStore = inject(CampaignsStore);
  private readonly _currentCampaign: WritableSignal<Campaign | null> = signal<Campaign | null>(null);
  private readonly _loading: Signal<boolean> = this._campaigns.loading;
  private readonly _error: Signal<string | null> = this._campaigns.error;

  public get loading(): boolean{
    return this._loading();
  }

  public get error(): string | null {
    return this._error();
  }

  public get currentCampaign(): Campaign | null{
    return this._currentCampaign();
  }

  public open(campaign: Campaign): void{
    this._currentCampaign.set(campaign);
    this.dlg().nativeElement.showModal();
  }

  public close(): void{
    this._currentCampaign.set(null);
    this.dlg().nativeElement.close();
  }

  public delete(): void{
    const current = this._currentCampaign();
    if(!current) return;

    this._campaigns.delete(current.id).subscribe({
      next: () =>{
        this.close();
      }
    });
  }
}
