import { Component, ElementRef, inject, Signal, signal, ViewChild, WritableSignal } from '@angular/core';
import { TranscribeOptions } from "../transcribe-options/transcribe-options";
import { TranscribedAudios } from "../transcribed-audios/transcribed-audios";
import { CampaignStats } from '../../../../domain/models/campaign.model';
import { AudiosStore } from '../../../audios/state/audios.store';

@Component({
  selector: 'app-transcribe-audios',
  imports: [TranscribeOptions, TranscribedAudios],
  templateUrl: './transcribe-audios.html',
})
export class TranscribeAudios {

  @ViewChild('dlg') dlg!: ElementRef<HTMLDialogElement>;

  private readonly _audiosStore = inject(AudiosStore);
  private readonly _currentCampaignStats: WritableSignal<CampaignStats | null> = signal<CampaignStats | null>(null);

  public readonly campaign: Signal<CampaignStats | null> = this._currentCampaignStats.asReadonly();

  public open(campaignStats: CampaignStats): void{
    this._currentCampaignStats.set(campaignStats);
    this._audiosStore.load(1, 4, campaignStats.id).subscribe();
    this.dlg.nativeElement.showModal();
  }

  public close(){
    this.dlg.nativeElement.close();
    this._currentCampaignStats.set(null);
    this._audiosStore.clear();
  }
}
