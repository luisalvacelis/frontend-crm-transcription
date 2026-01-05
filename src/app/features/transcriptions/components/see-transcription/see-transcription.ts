import { Component, computed, ElementRef, Signal, signal, viewChild, WritableSignal } from '@angular/core';
import { Audio } from '../../../../domain/models/audios.model';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { TranscriptionRow } from '../../../../api/dtos/transcription-row.interface';

@Component({
  selector: 'app-see-transcription',
  imports: [DecimalPipe, CurrencyPipe],
  templateUrl: './see-transcription.html',
})
export class SeeTranscription {

  public readonly dlg = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');

  private readonly _audio: WritableSignal<Audio | null> = signal<Audio | null>(null);

  public readonly audio: Signal<Audio | null> = this._audio.asReadonly();
  public readonly transcriptionRows = computed(() => {
    const a = this.audio();
    return this.parseTranscriptionToRows(a?.transcription);
  });

  public open(audio: Audio){
    this._audio.set(audio);
    console.log(this.audio());
    this.dlg().nativeElement.showModal();
  }

  public close(){
    this.dlg().nativeElement.close();
  }

  public copyTranscription(text: string | null | undefined) {
  if (!text) return;
  navigator.clipboard.writeText(text);
}


  private parseTranscriptionToRows(raw: string | null | undefined): TranscriptionRow[] {
    if (!raw) return [];

    const lines = raw
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(Boolean);

    const rows: TranscriptionRow[] = [];

    for (const line of lines) {
      if (/^time\s*\|\s*speaker\s*\|\s*transcription/i.test(line)) continue;
      const parts = line.split('|').map(p => p.trim());

      if (parts.length < 3) {
        if (rows.length) rows[rows.length - 1].text += ' ' + line;
        continue;
      }

      const timePart = parts[0];
      const speakerPart = parts[1];
      const textPart = parts.slice(2).join(' | ').trim();

      const [start, end] = timePart.split('-').map(x => x.trim());

      if (!start || !end) {
        if (rows.length) rows[rows.length - 1].text += ' ' + line;
        continue;
      }

      rows.push({
        start,
        end,
        speaker: speakerPart.replace(/^SPK\s*:?\s*/i, 'SPK ').trim(),
        text: textPart,
      });
    }

    return rows;
  }




}
