import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { SignUp } from './pages/sign-up/sign-up';

export const auth_routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', title: 'Login | CRM Transcription', component: Login },
  { path: 'sign-up', title: 'Crear cuenta | CRM Transcription', component: SignUp },
  { path: '**', redirectTo: 'login' },
];

export default auth_routes;
