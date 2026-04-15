import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { CompletedTasks } from './completed-tasks';
import { TasksService } from '../../../services/tasks.service';
import { ProductsService } from '../../../services/products.service';

describe('CompletedTasks', () => {
  let component: CompletedTasks;
  let fixture: ComponentFixture<CompletedTasks>;

  let tasksSpy: jasmine.SpyObj<TasksService>;
  let productsSpy: jasmine.SpyObj<ProductsService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    tasksSpy = jasmine.createSpyObj('TasksService', ['getAssignedTasks']);
    productsSpy = jasmine.createSpyObj('ProductsService', ['getById']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [CompletedTasks],
      providers: [
        { provide: TasksService, useValue: tasksSpy },
        { provide: ProductsService, useValue: productsSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CompletedTasks);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load completed tasks and group them', fakeAsync(() => {
    tasksSpy.getAssignedTasks.and.returnValue(
      of({
        data: [
          {
            id_state: 3,
            id_product: 1,
            sequence: 1,
            start_date: new Date('2024-01-01'),
            end_date: new Date('2024-01-02'),
            product: { name: 'Mesa' }
          },
          {
            id_state: 3,
            id_product: 1,
            sequence: 2,
            start_date: new Date('2024-01-02'),
            end_date: new Date('2024-01-03'),
            product: { name: 'Mesa' }
          }
        ]
      } as any)
    );

    component.loadCompletedTasks();
    tick();

    expect(component.tasks.length).toBe(2);
    expect(component.groupedTasks.length).toBe(1);
    expect(component.isLoading).toBeFalse();
  }));

  it('should handle load error', fakeAsync(() => {
    spyOn(console, 'error');

    tasksSpy.getAssignedTasks.and.returnValue(
      throwError(() => new Error('fail'))
    );

    component.loadCompletedTasks();
    tick();

    expect(component.isLoading).toBeFalse();
    expect(component.errorMessage).toBeTruthy();
  }));

  it('should calculate duration correctly', () => {
    const start = new Date('2024-01-01T00:00:00');
    const end = new Date('2024-01-01T05:00:00');

    const result = component.calculateDuration(start, end);

    expect(result).toContain('5h');
  });

  it('should format total duration', () => {
    expect(component.formatTotalDuration(0)).toBe('N/A');
    expect(component.formatTotalDuration(30)).toContain('1d');
  });

  it('should open product detail dialog', fakeAsync(() => {
    productsSpy.getById.and.returnValue(
      of({ data: { id: 1, name: 'Silla' } } as any)
    );

    dialogSpy.open.and.returnValue({} as any);

    component.onViewProductDetail(1);
    tick();

    expect(productsSpy.getById).toHaveBeenCalledWith(1);
    expect(dialogSpy.open).toHaveBeenCalled();
    expect(component.loadingProductId).toBeNull();
  }));

  it('should handle product detail error', fakeAsync(() => {
    spyOn(console, 'error');
    spyOn(window, 'alert');

    productsSpy.getById.and.returnValue(
      throwError(() => new Error('fail'))
    );

    component.onViewProductDetail(1);
    tick();

    expect(component.loadingProductId).toBeNull();
    expect(window.alert).toHaveBeenCalled();
  }));
});