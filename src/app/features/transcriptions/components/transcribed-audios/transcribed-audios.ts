import { Component, computed, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudiosStore } from '../../../audios/state/audios.store';
import { PageMeta } from '../../../../domain/models/page.model';
import { Audio } from '../../../../domain/models/audios.model';

@Component({
  selector: 'app-transcribed-audios',
  imports: [CommonModule],
  templateUrl: './transcribed-audios.html',
})
export class TranscribedAudios {

  private readonly _audiosStore = inject(AudiosStore);

  public readonly audios: Signal<Audio[]> = this._audiosStore.audios;
  public readonly meta: Signal<PageMeta | null> = this._audiosStore.meta;
  public readonly loading: Signal<boolean> = this._audiosStore.loading;
  public readonly error: Signal<string | null> = this._audiosStore.listError;

  public readonly hasAudios = computed(() => this._audiosStore.audios().length > 0);
  public readonly currentPage = computed(() => this._audiosStore.meta()?._page ?? 1);
  public readonly totalPages = computed(() => this._audiosStore.meta()?._pages ?? 0);
  public readonly totalAudios = computed(() => this._audiosStore.meta()?._total ?? 0);

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
    console.log('Ver transcripción:', audio);
  }

  public onDelete(audio: Audio): void {

  }
}
