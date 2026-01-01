import { Routes } from "@angular/router";
import { CampaignsPage } from "./pages/campaigns-page/campaigns-page";

export const routes: Routes = [
  {
    path: '',
    component: CampaignsPage,
    title: 'Campañas | CRM Transcription',
  }
]

export default routes;
