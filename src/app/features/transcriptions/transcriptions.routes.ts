import { Routes } from "@angular/router";
import { TranscriptionsHome } from "./pages/transcriptions-home/transcriptions-home";
import { TranscribeAudiosPage } from "./pages/transcribe-audios-page/transcribe-audios-page";

export const routes: Routes = [
  {
    path: '',
    component: TranscriptionsHome,
    title: 'Transcripciones | CRM Transcription',
  },
  {
    path: 'audios/transcribe/:campaignId',
    component: TranscribeAudiosPage,
    title: 'Transcribir Audios | CRM Transcription'
  }
];

export default routes;
