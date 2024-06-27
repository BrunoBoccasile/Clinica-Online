import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { inject } from '@angular/core';

export const pacienteGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
console.log(authService.tipoUsuario)
  if (authService.tipoUsuario == "paciente" || authService.tipoUsuario == "administrador")
    {
      return true;
    }
    else
    {
      router.navigateByUrl('bienvenida');
      return false;
    }
  
};
