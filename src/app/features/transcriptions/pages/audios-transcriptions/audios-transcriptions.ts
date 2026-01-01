import { Component } from '@angular/core';
import { TableTranscriptions } from "../../components/table-transcriptions/table-transcriptions";

@Component({
  selector: 'app-audios-transcriptions',
  imports: [TableTranscriptions],
  templateUrl: './audios-transcriptions.html',
})
export class AudiosTranscriptions { }
