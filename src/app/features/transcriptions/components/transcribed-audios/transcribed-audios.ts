import { ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, input, InputSignal, signal, Signal, viewChild, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudiosStore } from '../../../audios/state/audios.store';
import { PageMeta } from '../../../../domain/models/page.model';
import { Audio } from '../../../../domain/models/audios.model';
import { ConfirmModal } from '../../../../shared/confirm-modal/confirm-modal';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { CampaignStats } from '../../../../domain/models/campaign.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SeeTranscription } from '../see-transcription/see-transcription';

@Component({
  selector: 'app-transcribed-audios',
  imports: [CommonModule, ConfirmModal, SeeTranscription],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './transcribed-audios.html',
})
export class TranscribedAudios {

  public readonly confirmModal: Signal<ConfirmModal> = viewChild.required(ConfirmModal);
  public readonly seeTranscription: Signal<SeeTranscription> = viewChild.required(SeeTranscription);
  public readonly campaign: InputSignal<CampaignStats | null> = input<CampaignStats | null>(null);

  private readonly _audiosStore: AudiosStore = inject(AudiosStore);
  private readonly _searchSubject: Subject<string> = new Subject<string>();
  private readonly _destroyRef: DestroyRef = inject(DestroyRef);
  private _audioToDelete: Audio | null = null;

  public readonly audios: Signal<Audio[]> = this._audiosStore.audios;
  public readonly meta: Signal<PageMeta | null> = this._audiosStore.meta;
  public readonly loading: Signal<boolean> = this._audiosStore.loading;
  public readonly error: Signal<string | null> = this._audiosStore.listError;
  public readonly page: WritableSignal<number> = signal<number>(1);
  public readonly pageSize: WritableSignal<number> = signal<number>(10);
  public readonly searchTerm: WritableSignal<string> = signal<string>('');

  public readonly hasAudios = computed(() => this._audiosStore.audios().length > 0);
  public readonly currentPage = computed(() => this._audiosStore.meta()?._page ?? 1);
  public readonly totalPages = computed(() => this._audiosStore.meta()?._pages ?? 0);
  public readonly totalAudios = computed(() => this._audiosStore.meta()?._total ?? 0);

  constructor(){
    effect((onCleanup) => {
      const p = this.page();
      const ps = this.pageSize();
      const campaign_id = this.campaign()?.id;
      const search = this.searchTerm();

      const sub = this._audiosStore
        .load(p, ps, campaign_id, '', search)
        .pipe(takeUntilDestroyed(this._destroyRef

        ))
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

  public nextPage(): void {
    const meta = this._audiosStore.meta();
    if (meta && meta._page < meta._pages) {
      this._audiosStore.load(meta._page + 1, meta._pageSize).subscribe();
    }
  }

  public prevPage(): void {
    const meta = this._audiosStore.meta();
    if (meta && meta._page > 1) {
      this._audiosStore.load(meta._page - 1, meta._pageSize).subscribe();
    }
  }

  public clearSearch(): void {
    this._audiosStore.load(1, 4).subscribe();
  }

  public onSearchChange(term: string): void{
    this._searchSubject.next(term);
  }

  public getStatusBadgeClass(status: string): string {
    const statusMap: Record<string, string> = {
      'UPLOADED': 'badge-info',
      'QUEUED': 'badge-warning',
      'PROCESSING': 'badge-primary',
      'DONE': 'badge-success',
      'ERROR': 'badge-error'
    };
    return statusMap[status] || 'badge-ghost';
  }

  public formatDuration(seconds: number | null): string {
    if (!seconds) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  public onView(audio: Audio): void {
    this.seeTranscription().open(audio);
  }

  public onDelete(audio: Audio): void {
    this._audioToDelete = audio;

    const details: string[] = [
      `Archivo: ${audio.original_name}`,
      `Estado: ${audio.status}`,
    ];

    if (audio.duration_seconds) {
      details.push(`Duración: ${this.formatDuration(audio.duration_seconds)}`);
    }

    if (audio.cost) {
      details.push(`Costo: $${audio.cost.toFixed(4)}`);
    }if (audio.duration_seconds) {
      details.push(`Duración: ${this.formatDuration(audio.duration_seconds)}`);
    }

    if (audio.cost) {
      details.push(`Costo: $${audio.cost.toFixed(4)}`);
    }

    details.push('Esta acción no se puede deshacer');

    this.confirmModal().open({
      title: 'Eliminar audio',
      message: `¿Estás seguro de eliminar este audio?`,
      confirmText: 'Sí, eliminar',
      cancelText: 'Cancelar',
      confirmButtonClass: 'btn-error',
      details: details
    });
  }

  public handleDeleteConfirmed(): void {
    if (!this._audioToDelete) return;

    this._audiosStore.delete(this._audioToDelete.id).subscribe({
      next: () => {
        this.confirmModal().close();
        this._audioToDelete = null;
      },
      error: () => {
        this._audioToDelete = null;
      }
    });
  }
}
