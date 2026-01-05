import { Routes } from "@angular/router";
import { TranscriptionsHome } from "./pages/transcriptions-home/transcriptions-home";
import { DashboardTranscriptions } from "./pages/dashboard-transcriptions/dashboard-transcriptions";
import { AudiosTranscriptions } from "./pages/audios-transcriptions/audios-transcriptions";
import { TranscribeAudiosPage } from "./pages/transcribe-audios-page/transcribe-audios-page";

export const routes: Routes = [
  {
    path: '',
    component: TranscriptionsHome,
    title: 'Transcripciones | CRM Transcription',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        component: DashboardTranscriptions
      },
      {
        path: 'audios',
        component: AudiosTranscriptions,
      }
    ]
  },
  {
    path: 'audios/transcribe/:campaignId',
    component: TranscribeAudiosPage,
    title: 'Transcribir Audios | CRM Transcription'
  }
];

export default routes;
