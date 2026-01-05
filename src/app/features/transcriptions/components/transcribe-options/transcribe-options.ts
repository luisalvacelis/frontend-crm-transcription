import {
  Component,
  inject,
  input,
  InputSignal,
  Signal,
  viewChild,
  effect,
  signal,
  WritableSignal,
  OnDestroy,
  computed,
} from '@angular/core';

import { CampaignStats } from '../../../../domain/models/campaign.model';
import { ConfirmModal } from '../../../../shared/confirm-modal/confirm-modal';
import { AudiosStore } from '../../../audios/state/audios.store';
import { CampaignsStore } from '../../../campaigns/state/campaigns.store';
import { TranscriptionsStore } from '../../state/transcriptions.store';

import { EMPTY, interval, Subscription } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-transcribe-options',
  imports: [ConfirmModal],
  templateUrl: './transcribe-options.html',
})
export class TranscribeOptions implements OnDestroy {

  public readonly campaign: InputSignal<CampaignStats | null> = input<CampaignStats | null>(null);
  public readonly isModalOpen: InputSignal<boolean> = input<boolean>(false);
  public readonly confirmModal: Signal<ConfirmModal> = viewChild.required(ConfirmModal);

  private readonly _audiosStore: AudiosStore = inject(AudiosStore);
  private readonly _campaignStore: CampaignsStore = inject(CampaignsStore);
  private readonly _transcriptionsStore: TranscriptionsStore = inject(TranscriptionsStore);

  private readonly _selectedProvider: WritableSignal<'deepgram' | 'whisperx'> = signal<'deepgram' | 'whisperx'>('deepgram');

  private _pollingSubscription: Subscription | null = null;
  private readonly _justStartedTranscription: WritableSignal<boolean> = signal(false);

  public readonly isTranscribing: WritableSignal<boolean> = signal(false);
  public readonly isPolling: WritableSignal<boolean> = signal(false);
  public readonly isCompleted: WritableSignal<boolean> = signal(false);

  public readonly canStart = computed(() => !this.isTranscribing() && !this.isPolling() && !this.isCompleted());

  constructor() {
    effect(() => {
      const c = this.campaign();
      const modalOpen = this.isModalOpen();

      if (!c || !modalOpen) {
        if (!modalOpen) {
          this.resetState();
        }
        return;
      }

      if (!this._justStartedTranscription()) {
        this.updateUiFlagsFromCampaign(c);
      }
    });

    effect(() => {
      const modalOpen = this.isModalOpen();
      const transcribing = this.isTranscribing();

      if (modalOpen && transcribing && !this._pollingSubscription) {
        this.startPolling();
      } else if (!modalOpen && this._pollingSubscription) {
        this.stopPolling();
      }
    });
  }

  private resetState(): void {
    this.isTranscribing.set(false);
    this.isPolling.set(false);
    this.isCompleted.set(false);
    this._justStartedTranscription.set(false);
    this.stopPolling();
  }

  private updateUiFlagsFromCampaign(c: CampaignStats): void {
    const queued = c.queued ?? 0;
    const processing = c.processing ?? 0;
    const uploaded = c.uploaded ?? 0;
    const done = c.done ?? 0;
    const errorCount = c.error ?? 0;

    const processingNow = queued > 0 || processing > 0;
    const completedNow = !processingNow && uploaded === 0 && (done > 0 || errorCount > 0);

    this.isTranscribing.set(processingNow);
    this.isCompleted.set(completedNow);

    if (processingNow) {
      this._justStartedTranscription.set(false);
    }
  }

  public selectProvider(provider: 'deepgram' | 'whisperx'): void {
    if (!this.canStart()) return;
    this._selectedProvider.set(provider);
  }

  public isProviderSelected(provider: 'deepgram' | 'whisperx'): boolean {
    return this._selectedProvider() === provider;
  }

  public onStartTranscription(): void {
    const currentCampaign = this.campaign();
    if (!currentCampaign) return;

    this.confirmModal().open({
      title: 'Transcribir todos los audios',
      message: `¿Estás seguro de transcribir TODOS los audios de la campaña "${currentCampaign.name}"?`,
      confirmText: 'Sí, Transcribir todos',
      cancelText: 'Cancelar',
      confirmButtonClass: 'btn-success',
      details: [
        `Total de audios: ${currentCampaign.total_audios}`,
        `Audios pendientes: ${currentCampaign.uploaded}`,
        `Provider: ${this._selectedProvider().toUpperCase()}`,
        `Costo estimado (Deepgram): $${(currentCampaign.total_audios * 0.006).toFixed(2)}`,
        'Esta acción procesará todos los audios',
      ],
    });
  }

  public onStopTranscription(): void {
    this.stopPolling();
    this.isTranscribing.set(false);
    this.isPolling.set(false);
    const c = this.campaign();
    if (c) {
      this.updateUiFlagsFromCampaign(c);
    }
  }

  public handleTranscribeConfirmed(): void {
    const currentCampaign = this.campaign();
    if (!currentCampaign) return;

    this._justStartedTranscription.set(true);
    this.isCompleted.set(false);
    this.isTranscribing.set(true);
    this.confirmModal().close();
    this.startPolling();

    this._campaignStore.transcribeAll(currentCampaign.id, this._selectedProvider())
      .pipe(
        tap(() => {
          this._audiosStore.refresh();
          this._transcriptionsStore.refresh();
        }),
        catchError((err) => {
          this._justStartedTranscription.set(false);
          this.isTranscribing.set(false);
          this.stopPolling();
          throw err;
        })
      ).subscribe();
  }

  private startPolling(): void {
    if (!this.isModalOpen()) return;
    if (this._pollingSubscription) return;

    const currentCampaign = this.campaign();
    if (!currentCampaign) return;

    const campaignId = currentCampaign.id;

    this.isPolling.set(true);

    this._pollingSubscription = interval(3000).pipe(
      switchMap(() => {
        const meta = this._transcriptionsStore.meta();
        if (!meta) return EMPTY;
        return this._transcriptionsStore.load(meta._page, meta._pageSize);
      }),
      tap(() => {
        this._audiosStore.refresh();
      }),
      tap(() => {
        const updated = this._transcriptionsStore.campaignsStats().find((c) => c.id === campaignId);
        if (!updated) return;

        const queued = updated.queued ?? 0;
        const processing = updated.processing ?? 0;
        const uploaded = updated.uploaded ?? 0;
        const done = updated.done ?? 0;
        const errorCount = updated.error ?? 0;

        const stillProcessing = queued > 0 || processing > 0;

        if (stillProcessing) {
          this._justStartedTranscription.set(false);
        }

        if (!stillProcessing && !this._justStartedTranscription()) {
          this.isTranscribing.set(false);
          this.isCompleted.set(uploaded === 0 && (done > 0 || errorCount > 0));
          this.finalRefreshAndStop();
        }
      }),
      finalize(() => {
        this.isPolling.set(false);
      })
    ).subscribe();
  }

  private finalRefreshAndStop(): void {
    this._audiosStore.refresh();
    this._transcriptionsStore.refresh();

    setTimeout(() => {
      this.stopPolling();
    }, 500);
  }

  public stopPolling(): void {
    if (this._pollingSubscription) {
      this._pollingSubscription.unsubscribe();
      this._pollingSubscription = null;
    }
    this.isPolling.set(false);
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }
}
