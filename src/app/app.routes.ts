import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },

    {
        path: 'login',
        loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
        title: 'Login'
    },

    {
        path: 'event',
        loadComponent: () => import('./components/events/event').then(m => m.Events),
        title: 'Events'
    },

    {
        path: '**',
        redirectTo: '/login'
    }
];
