import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getCurrentUser();
  const requiredRole = route.data['role'];

  if (requiredRole === 'admin' && user?.id_rol === 1) {
    return true;
  }

  if (requiredRole === 'employee' && user?.id_rol !== 1) {
    return true;
  }

  const homeRoute = authService.getHomeRoute();
  return router.createUrlTree([homeRoute]);
};