import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { EmployeeProfileComponent } from './employee-profile';
import { EmployeesService } from '../../../services/employee.service';
import { AuthService } from '../../../services/auth.service';

describe('EmployeeProfileComponent', () => {
  let component: EmployeeProfileComponent;
  let fixture: ComponentFixture<EmployeeProfileComponent>;

  let authSpy: jasmine.SpyObj<AuthService>;
  let employeesSpy: jasmine.SpyObj<EmployeesService>;

  beforeEach(async () => {

    authSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    employeesSpy = jasmine.createSpyObj('EmployeesService', ['getEmployeeDetails']);

    await TestBed.configureTestingModule({
      imports: [EmployeeProfileComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: EmployeesService, useValue: employeesSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeProfileComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load employee profile successfully', () => {

    authSpy.getCurrentUser.and.returnValue({ cc: 123 } as any);

    employeesSpy.getEmployeeDetails.and.returnValue(
      of({
        data: { cc: 123, name: 'Juan' }
      } as any)
    );

    fixture.detectChanges(); // 🔥 dispara ngOnInit

    expect(authSpy.getCurrentUser).toHaveBeenCalled();
  expect(employeesSpy.getEmployeeDetails).toHaveBeenCalled();
    expect(component.employee?.name).toBe('Juan');
    expect(component.isLoading).toBeFalse();
  });

  it('should handle missing user cc', () => {

    authSpy.getCurrentUser.and.returnValue(null as any);

    component.loadEmployeeProfile();

    expect(component.errorMessage).toBe(
      'No se pudo obtener la información del usuario'
    );

    expect(component.isLoading).toBeFalse();
  });

  it('should handle service error', () => {

    spyOn(console, 'error');

    authSpy.getCurrentUser.and.returnValue({ cc: 123 } as any);

    employeesSpy.getEmployeeDetails.and.returnValue(
      of({
        error: 'fail'
      } as any)
    );

    // simulamos error manual en subscribe
    employeesSpy.getEmployeeDetails.and.returnValue({
      subscribe: (handlers: any) => {
        handlers.error(new Error('fail'));
      }
    } as any);

    component.loadEmployeeProfile();

    expect(component.errorMessage).toBe(
      'Error al cargar la información del perfil'
    );

    expect(component.isLoading).toBeFalse();
  });

});