import { Routes } from "@angular/router";
import { TranscriptionsHome } from "./pages/transcriptions-home/transcriptions-home";
import { DashboardTranscriptions } from "./pages/dashboard-transcriptions/dashboard-transcriptions";
import { AudiosTranscriptions } from "./pages/audios-transcriptions/audios-transcriptions";

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
        component: AudiosTranscriptions
      }
    ]
  }
];

export default routes;
