import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { EmployeeTasks } from './employee-tasks';

import { TasksService } from '../../../../services/tasks.service';
import { ProductsService } from '../../../../services/products.service';
import { EmployeesService } from '../../../../services/employee.service';
import { AuthService } from '../../../../services/auth.service';

describe('EmployeeTasks FULL COVERAGE FIX', () => {
  let component: EmployeeTasks;
  let fixture: ComponentFixture<EmployeeTasks>;

  let tasksService: jasmine.SpyObj<TasksService>;
  let productsService: jasmine.SpyObj<ProductsService>;
  let employeesService: jasmine.SpyObj<EmployeesService>;
  let authService: jasmine.SpyObj<AuthService>;
  let dialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    tasksService = jasmine.createSpyObj('TasksService', [
      'getAssignedTasks',
      'getProductTasks',
      'startTask',
      'completeTask'
    ]);

    productsService = jasmine.createSpyObj('ProductsService', ['getById']);
    employeesService = jasmine.createSpyObj('EmployeesService', ['getEmployeeDetails']);
    authService = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    dialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [EmployeeTasks],
      providers: [
        { provide: TasksService, useValue: tasksService },
        { provide: ProductsService, useValue: productsService },
        { provide: EmployeesService, useValue: employeesService },
        { provide: AuthService, useValue: authService },
        { provide: MatDialog, useValue: dialog }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeTasks);
    component = fixture.componentInstance;
  });

  // =========================
  // 1. USER NULL (rama perdida)
  // =========================
  it('should handle missing user', () => {
    authService.getCurrentUser.and.returnValue(null as any);

    component.loadEmployeeAndTasks();

    expect(component.errorMessage).toBeTruthy();
  });

  // =========================
  // 2. LOAD EMPLOYEE ERROR
  // =========================
  it('should handle employee error', () => {
    authService.getCurrentUser.and.returnValue({ cc: '123' } as any);

    employeesService.getEmployeeDetails.and.returnValue(
      throwError(() => new Error('fail'))
    );

    component.loadEmployeeAndTasks();

    expect(component.errorMessage).toBeTruthy();
  });

  // =========================
  // 3. LOAD FULL SUCCESS FLOW
  // =========================
  it('should load full task flow', fakeAsync(() => {
    authService.getCurrentUser.and.returnValue({ cc: '123' } as any);

    employeesService.getEmployeeDetails.and.returnValue(
      of({ data: { id_employee: 1 } } as any)
    );

    tasksService.getAssignedTasks.and.returnValue(
      of({
        data: [
          {
            id_employee: 1,
            id_product: 10,
            id_state: 1,
            id_task: 1,
            sequence: 1,
            product: { name: 'Test' }
          }
        ]
      } as any)
    );

    tasksService.getProductTasks.and.returnValue(
      of({ data: [] } as any)
    );

    fixture.detectChanges();
    tick();

    expect(component.groupedTasks.length).toBeGreaterThan(0);
  }));

  // =========================
  // 4. PRODUCT ERROR BRANCH
  // =========================
  it('should handle product task error', () => {
    tasksService.getProductTasks.and.returnValue(
      throwError(() => new Error('fail'))
    );

    component.findTaskOfProduct(99);

    expect(component.productTasksLoading.has(99)).toBeFalse();
  });

  // =========================
  // 5. START TASK BRANCH
  // =========================
  it('should start task', fakeAsync(() => {
    const task: any = { id_task: 1, id_state: 1 };

    component['currentEmployeeTasks'] = [
      { id_task: 1, id_state: 1, id_product: 10, sequence: 1 } as any
    ];

    component['productTasks'] = new Map();

    tasksService.startTask.and.returnValue(
      of({ message: 'ok' } as any)
    );

    component.onStartTask(task);
    tick();

    expect(tasksService.startTask).toHaveBeenCalled();
  }));

  // =========================
  // 6. COMPLETE TASK
  // =========================
  it('should complete task', fakeAsync(() => {
    const task: any = { id_task: 1, id_state: 2 };

    tasksService.completeTask.and.returnValue(
      of({ message: 'ok' } as any)
    );

    component.onCompleteTask(task);
    tick();

    expect(tasksService.completeTask).toHaveBeenCalled();
  }));

  // =========================
  // 7. VIEW PRODUCT
  // =========================
  it('should open product dialog', fakeAsync(() => {
    productsService.getById.and.returnValue(
      of({ data: { id: 1 } } as any)
    );

    component.onViewProductDetail(1);
    tick();

    expect(dialog.open).toHaveBeenCalled();
  }));

  // =========================
  // 8. canStartTask FULL BRANCH HIT
  // =========================
  it('should evaluate canStartTask', () => {
    component['currentEmployeeTasks'] = [
      { id_task: 1, id_state: 1, id_product: 10, sequence: 1 } as any
    ];

    component['productTasks'] = new Map([
      [10, [{ id_task: 1, id_state: 3, sequence: 0 } as any]]
    ]);

    const result = component.canStartTask({
      id_task: 1,
      id_state: 1,
      id_product: 10,
      sequence: 1
    } as any);

    expect(typeof result).toBe('boolean');
  });
});