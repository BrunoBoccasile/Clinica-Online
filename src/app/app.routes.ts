import { Routes } from '@angular/router';
import { adminGuardGuard } from './guards/admin-guard.guard';
import { pacienteGuardGuard } from './guards/paciente-guard.guard';
import { logeadoGuardGuard } from './guards/logeado-guard.guard';

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
        loadComponent: () => import('./componentes/gestion-usuarios/gestion-usuarios.component').then(m => m.GestionUsuariosComponent),
        canActivate: [adminGuardGuard]
    },
    {
        path: 'turnos/solicitar',
        loadComponent: () => import('./componentes/solicitar-turno/solicitar-turno.component').then(m => m.SolicitarTurnoComponent),
        canActivate: [pacienteGuardGuard]
    },
    {
        path: 'mi-perfil',
        loadComponent: () => import('./componentes/mi-perfil/mi-perfil.component').then(m => m.MiPerfilComponent),
        canActivate: [logeadoGuardGuard]
    },
    {
        path: 'turnos/mis-turnos',
        loadComponent: () => import('./componentes/mis-turnos/mis-turnos.component').then(m => m.MisTurnosComponent)
    }
];
