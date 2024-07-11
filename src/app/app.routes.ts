import { Routes } from '@angular/router';
import { adminGuardGuard } from './guards/admin-guard.guard';
import { pacienteGuardGuard } from './guards/paciente-guard.guard';
import { logeadoGuardGuard } from './guards/logeado-guard.guard';
import { especialistaGuardGuard } from './guards/especialista-guard.guard';

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
    },
    {
        path: 'pacientes',
        loadComponent: () => import('./componentes/pacientes/pacientes.component').then(m => m.PacientesComponent),
        canActivate: [especialistaGuardGuard]
    },
    {
        path: 'pdf-historia-clinica',
        loadComponent: () => import('./componentes/pdf-historia-clinica/pdf-historia-clinica.component').then(m => m.PdfHistoriaClinicaComponent)
    },
    {
        path: 'pdf-atenciones',
        loadComponent: () => import('./componentes/pdf-atenciones/pdf-atenciones.component').then(m => m.PdfAtencionesComponent)
    },
    {
        path: 'estadisticas',
        loadComponent: () => import('./componentes/estadisticas/estadisticas.component').then(m => m.EstadisticasComponent),
        canActivate: [adminGuardGuard]
    },
    {
        path: 'excel-pacientes',
        loadComponent: () => import('./componentes/excel-pacientes/excel-pacientes.component').then(m => m.ExcelPacientesComponent)
    },
    {
        path: 'excel-especialistas',
        loadComponent: () => import('./componentes/excel-especialistas/excel-especialistas.component').then(m => m.ExcelEspecialistasComponent)
    },
    {
        path: 'excel-administradores',
        loadComponent: () => import('./componentes/excel-administradores/excel-administradores.component').then(m => m.ExcelAdministradoresComponent)    },
];
