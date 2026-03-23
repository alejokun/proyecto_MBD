import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Recuperamos el valor de staff del localStorage
  const is_staff = localStorage.getItem('is_staff') === 'true';

  if (is_staff) {
    return true; // Es admin, lo dejamos pasar
  }

  // No es admin: Alerta y para afuera
  alert('Acceso denegado: Se requieren permisos de Administrador.');
  router.navigate(['/']); // Lo mandamos al Index (Home)
  return false;
};