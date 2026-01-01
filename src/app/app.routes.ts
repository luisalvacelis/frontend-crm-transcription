import { Routes } from '@angular/router';
import { Home } from './features/shell/home/home';
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Home | CRM Transcription',
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'campaigns',
        loadChildren: () => import('./features/campaigns/campaigns.routes')
      },
      {
        path: 'transcriptions',
        loadChildren: () => import('./features/transcriptions/transcriptions.routes')
      }
    ],
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => import('./features/auth/auth.routes'),
  },
];
