import { Component } from '@angular/core';
import { TranscriptionsHeader } from "../../components/transcriptions-header/transcriptions-header";
import { OptionsTranscriptions } from "../../components/options-transcriptions/options-transcriptions";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-transcriptions-home',
  imports: [TranscriptionsHeader, OptionsTranscriptions, RouterOutlet],
  templateUrl: './transcriptions-home.html',
})
export class TranscriptionsHome {}
