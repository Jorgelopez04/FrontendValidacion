import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();


  if(token){
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(clonedReq).pipe(
      catchError((error: HttpErrorResponse)=>{
        if(error.status === 401){
          authService.logout();
          alert('Tu sesión ha expirado. Por favor inicia sesión de nuevo');
        }
        return throwError(()=> error);
      })
    )
  }
  
  return next(req);
};
