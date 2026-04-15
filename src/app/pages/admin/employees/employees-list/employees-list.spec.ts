import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { EmployeesList } from './employees-list';
import { EmployeesService } from '../../../../services/employee.service';
import { Router } from '@angular/router';

/* ---------------- MOCKS ---------------- */

const employeesSpy = jasmine.createSpyObj('EmployeesService', ['getAll']);
const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

describe('EmployeesList', () => {
  let component: EmployeesList;
  let fixture: ComponentFixture<EmployeesList>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [EmployeesList],
      providers: [
        { provide: EmployeesService, useValue: employeesSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeesList);
    component = fixture.componentInstance;

    employeesSpy.getAll.calls.reset();
    routerSpy.navigate.calls.reset();

    employeesSpy.getAll.and.returnValue(
      of({
        data: [
          { id_employee: 1, name: 'Juan' }
        ]
      } as any)
    );

    fixture.detectChanges();
  });

  /* ---------------- BASIC ---------------- */

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load employees on init', fakeAsync(() => {

    component.ngOnInit();
    tick();

    expect(employeesSpy.getAll).toHaveBeenCalled();
    expect(component.employees.length).toBe(1);
    expect(component.isLoading).toBeFalse();
  }));

  /* ---------------- LOAD ERROR ---------------- */

  it('should handle error when loading employees', fakeAsync(() => {

    spyOn(console, 'error');
    spyOn(window, 'alert');

    employeesSpy.getAll.and.returnValue(
      throwError(() => new Error('fail'))
    );

    component.loadEmployees();
    tick();

    expect(component.isLoading).toBeFalse();
    expect(console.error).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalled();
  }));

  /* ---------------- NAVIGATION ---------------- */

  it('should navigate to create employee', () => {

    component.createEmployee();

    expect(routerSpy.navigate).toHaveBeenCalledWith([
      '/admin/employees/create'
    ]);
  });

  it('should navigate to edit employee', () => {

    const employee = { id_employee: 10 } as any;

    component.editEmployee(employee);

    expect(routerSpy.navigate).toHaveBeenCalledWith([
      '/admin/employees/edit',
      10
    ]);
  });
});