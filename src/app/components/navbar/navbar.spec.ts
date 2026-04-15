import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { Navbar } from './navbar';
import { AuthService } from '../../services/auth.service';
import { EmployeesService } from '../../services/employee.service';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;
  let authService: jasmine.SpyObj<AuthService>;
  let employeeService: jasmine.SpyObj<EmployeesService>;

  beforeEach(async () => {

    const authSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'logout']);
    const employeeSpy = jasmine.createSpyObj('EmployeesService', ['getEmployeeDetails']);

    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),

        { provide: AuthService, useValue: authSpy },
        { provide: EmployeesService, useValue: employeeSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    employeeService = TestBed.inject(EmployeesService) as jasmine.SpyObj<EmployeesService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load employee name', fakeAsync(() => {
    authService.getCurrentUser.and.returnValue({ cc: '123' } as any);
    employeeService.getEmployeeDetails.and.returnValue(
      of({ data: { name: 'Juan' } } as any)
    );

    component.ngOnInit();
    tick();

    expect(component.userName).toBe('Juan');
  }));

  it('should handle error and fallback to cc', fakeAsync(() => {
    authService.getCurrentUser.and.returnValue({ cc: '123' } as any);
    employeeService.getEmployeeDetails.and.returnValue(
      throwError(() => new Error('fail'))
    );

    component.ngOnInit();
    tick();

    expect(component.userName).toBe('123');
  }));

  it('should handle no user', () => {
    authService.getCurrentUser.and.returnValue(null);

    component.ngOnInit();

    expect(component.userName).toBe('Usuario Desconocido');
  });

  it('should emit sidebar toggle', () => {
    spyOn(component.sidebarToggle, 'emit');

    component.toggleSidebar();

    expect(component.sidebarToggle.emit).toHaveBeenCalled();
  });

  it('should call logout', () => {
    component.onLogout();

    expect(authService.logout).toHaveBeenCalled();
  });

});