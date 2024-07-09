import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';

export const especialistaGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
console.log(authService.tipoUsuario)
  if (authService.tipoUsuario == "especialista" || authService.tipoUsuario == "administrador")
    {
      return true;
    }
    else
    {
      router.navigateByUrl('bienvenida');
      return false;
    }
};
