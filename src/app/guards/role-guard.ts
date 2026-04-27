import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const user = authService.getCurrentUser();
  const expectedRole = route.data['role'];

  console.log('--- GUARD CHECK ---');
  console.log('Ruta:', state.url, '| Esperado:', expectedRole);

  // 1. Si no hay usuario, permitir solo si va al login (ruta vacía), 
  // de lo contrario mandar al login.
  if (!user) {
    if (state.url === '/' || state.url === '/login' || state.url === '') {
      return true;
    }
    router.navigate(['']);
    return false;
  }

  // 2. Extraer el ROL de cualquier forma posible
  const userRoleId = Number(user.id_rol || (user as any).id_role || (user as any).id_rol);

  console.log('Rol del usuario:', userRoleId);

  // 3. Lógica de redirección suave
  if (userRoleId === 1) { // ES ADMIN
    if (expectedRole === 'admin') return true;
    
    // Si un admin intenta entrar a la zona de empleado, lo movemos a admin
    if (expectedRole === 'employee') {
      console.log('Eres admin, moviendo a /admin...');
      router.navigate(['/admin']);
      return false;
    }
  }

  if (userRoleId === 2) { // ES EMPLEADO
    if (expectedRole === 'employee') return true;
    
    // Si un empleado intenta entrar a la zona de admin, lo movemos a su perfil
    if (expectedRole === 'admin') {
      console.log('Eres empleado, moviendo a perfil...');
      router.navigate(['/employee/profile']);
      return false;
    }
  }

  // Si llegamos aquí, dejamos pasar por defecto para no bloquear el botón
  return true;
};