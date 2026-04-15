import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { Login } from './login';
import { AuthService } from '../../services/auth.service';

/* ---------------- MOCKS ---------------- */

class MockAuthService {
  login = jasmine.createSpy('login');
  getHomeRoute = jasmine.createSpy('getHomeRoute');
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

/* ---------------- TEST ---------------- */

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authService: MockAuthService;
  let router: MockRouter;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
        provideNoopAnimations()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService) as any;
    router = TestBed.inject(Router) as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form as invalid', () => {
    expect(component.loginForm.valid).toBeFalse();
  });

  it('should not call login if form is invalid', () => {
    component.onSubmit();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should login and navigate on success', () => {
    component.loginForm.setValue({
      cc: '123',
      password: '123'
    });

    authService.login.and.returnValue(of({}));
    authService.getHomeRoute.and.returnValue('/home');

    component.onSubmit();

    expect(authService.login).toHaveBeenCalled();
    expect(authService.getHomeRoute).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should handle login error', () => {
    spyOn(console, 'error');
    spyOn(window, 'alert');

    component.loginForm.setValue({
      cc: '123',
      password: '123'
    });

    authService.login.and.returnValue(
      throwError(() => new Error('fail'))
    );

    component.onSubmit();

    expect(console.error).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Credenciales inválidas');
  });
});