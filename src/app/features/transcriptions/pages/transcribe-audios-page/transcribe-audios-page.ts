import { Component, inject, OnInit, signal, computed, WritableSignal, Signal, ElementRef, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AudiosStore } from '../../../audios/state/audios.store';
import { TranscriptionsStore } from '../../state/transcriptions.store';
import { TranscribeOptions } from "../../components/transcribe-options/transcribe-options";
import { TranscribedAudios } from "../../components/transcribed-audios/transcribed-audios";
import { UploadAudios } from '../../components/upload-audios/upload-audios';

@Component({
  selector: 'app-transcribe-audios-page',
  imports: [TranscribeOptions, TranscribedAudios, UploadAudios],
  templateUrl: './transcribe-audios-page.html',
})
export class TranscribeAudiosPage implements OnInit {

  public readonly newAudioModal: Signal<UploadAudios> = viewChild.required(UploadAudios);

  private readonly _route: ActivatedRoute = inject(ActivatedRoute);
  private readonly _router: Router = inject(Router);
  private readonly _audiosStore: AudiosStore = inject(AudiosStore);
  private readonly _transcriptionsStore: TranscriptionsStore = inject(TranscriptionsStore);
  private readonly _campaignId: WritableSignal<number | null> = signal<number | null>(null);
  private readonly _isPageActive: WritableSignal<boolean> = signal<boolean>(true);

  public readonly campaign = computed(() => {
    const id = this._campaignId();
    if (!id) return null;
    return this._transcriptionsStore.campaignsStats().find(c => c.id === id) ?? null;
  });

  public readonly isPageActive = this._isPageActive.asReadonly();

  ngOnInit(): void {
    const encodedId = this._route.snapshot.paramMap.get('campaignId');

    if (encodedId) {
      try {
        const campaignId = parseInt(atob(encodedId), 10);

        if (!isNaN(campaignId)) {
          this._campaignId.set(campaignId);
          this._isPageActive.set(true);

          this._transcriptionsStore.load(1, 100).subscribe();
          this._audiosStore.load(1, 10, campaignId).subscribe();
        } else {
          this._router.navigate(['/transcriptions/audios']);
        }
      } catch (e) {
        this._router.navigate(['/transcriptions/audios']);
      }
    } else {
      this._router.navigate(['/transcriptions/audios']);
    }
  }

  public openUploadAudios(): void{
    this.newAudioModal().open();
  }

  public goBack(): void {
    this._isPageActive.set(false);
    this._audiosStore.clear();
    this._router.navigate(['/transcriptions']);
  }
}
