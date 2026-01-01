import { Component } from '@angular/core';
import { TranscriptionsTable } from "../../components/transcriptions-table/transcriptions-table";

@Component({
  selector: 'app-audios-transcriptions',
  imports: [TranscriptionsTable],
  templateUrl: './audios-transcriptions.html',
})
export class AudiosTranscriptions { }
