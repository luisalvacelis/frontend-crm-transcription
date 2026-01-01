import { Routes } from "@angular/router";
import { Campaigns } from "./pages/campaigns/campaigns";

export const routes: Routes = [
  {
    path: '',
    component: Campaigns,
    title: 'Campañas | CRM Transcription',
  }
]

export default routes;
