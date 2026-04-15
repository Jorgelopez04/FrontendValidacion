import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { CreateEmployee } from './create-employee';
import { EmployeesService } from '../../../../services/employee.service';
import { RolesService } from '../../../../services/roles.service';
import { Router } from '@angular/router';

/* ---------------- MOCKS ---------------- */

const employeesSpy = jasmine.createSpyObj('EmployeesService', ['create']);
const rolesSpy = jasmine.createSpyObj('RolesService', ['getAll']);
const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

describe('CreateEmployee', () => {
  let component: CreateEmployee;
  let fixture: ComponentFixture<CreateEmployee>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [CreateEmployee, ReactiveFormsModule],
      providers: [
        { provide: EmployeesService, useValue: employeesSpy },
        { provide: RolesService, useValue: rolesSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateEmployee);
    component = fixture.componentInstance;

    employeesSpy.create.calls.reset();
    rolesSpy.getAll.calls.reset();
    routerSpy.navigate.calls.reset();

    rolesSpy.getAll.and.returnValue(
      of({ data: [{ id_role: 1, name: 'Admin' }] } as any)
    );

    fixture.detectChanges();
  });

  /* ---------------- BASIC ---------------- */

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form invalid initially', () => {
    expect(component.employeeForm.valid).toBeFalse();
  });

  it('should load roles on init', () => {
    expect(rolesSpy.getAll).toHaveBeenCalled();
    expect(component.roles.length).toBe(1);
  });

  /* ---------------- SUBMIT ---------------- */

  it('should not submit if form invalid', () => {
    component.onSubmit();

    expect(employeesSpy.create).not.toHaveBeenCalled();
  });

  it('should create employee successfully', fakeAsync(() => {

    spyOn(window, 'alert');

    employeesSpy.create.and.returnValue(
      of({ data: { name: 'Juan' } } as any)
    );

    component.employeeForm.setValue({
      cc: '1234567',
      name: 'Juan',
      password: '123456',
      id_role: 1
    });

    component.onSubmit();
    tick();

    expect(employeesSpy.create).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith(
      'Empleado Juan creado exitosamente'
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith([
      '/admin/employees'
    ]);
  }));

  it('should handle create error', fakeAsync(() => {

    spyOn(console, 'error');
    spyOn(window, 'alert');

    employeesSpy.create.and.returnValue(
      throwError(() => ({
        error: { message: 'error creando' }
      }))
    );

    component.employeeForm.setValue({
      cc: '1234567',
      name: 'Juan',
      password: '123456',
      id_role: 1
    });

    component.onSubmit();
    tick();

    expect(component.isSaving).toBeFalse();
    expect(console.error).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalled();
  }));

  /* ---------------- CANCEL ---------------- */

  it('should navigate on cancel', () => {
    component.onCancel();

    expect(routerSpy.navigate).toHaveBeenCalledWith([
      '/admin/employees'
    ]);
  });
});