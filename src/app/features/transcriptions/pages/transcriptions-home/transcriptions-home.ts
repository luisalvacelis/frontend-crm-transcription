import { Component } from '@angular/core';
import { HeaderTranscriptions } from "../../components/header-transcriptions/header-transcriptions";
import { OptionsTranscriptions } from "../../components/options-transcriptions/options-transcriptions";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-transcriptions-home',
  imports: [HeaderTranscriptions, OptionsTranscriptions, RouterOutlet],
  templateUrl: './transcriptions-home.html',
})
export class TranscriptionsHome {}
