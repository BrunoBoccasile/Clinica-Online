import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/bienvenida', pathMatch: "full" },
    {
        path: 'bienvenida',
        loadComponent: () => import('./componentes/bienvenida/bienvenida.component').then(m => m.BienvenidaComponent)
    },
    {
        path: 'registro',
        loadComponent: () => import('./componentes/registro/registro.component').then(m => m.RegistroComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./componentes/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'gestion-usuarios',
        loadComponent: () => import('./componentes/gestion-usuarios/gestion-usuarios.component').then(m => m.GestionUsuariosComponent)
    }
];
