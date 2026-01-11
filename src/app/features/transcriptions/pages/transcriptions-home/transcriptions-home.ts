import { Component } from '@angular/core';
import { TranscriptionsHeader } from "../../components/transcriptions-header/transcriptions-header";
import { RouterOutlet } from '@angular/router';
import { AudiosTranscriptions } from "../audios-transcriptions/audios-transcriptions";

@Component({
  selector: 'app-transcriptions-home',
  imports: [TranscriptionsHeader, RouterOutlet, AudiosTranscriptions],
  templateUrl: './transcriptions-home.html',
})
export class TranscriptionsHome {}
