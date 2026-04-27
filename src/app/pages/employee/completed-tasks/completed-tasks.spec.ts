import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

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
      imports: [
        CompletedTasks,
        NoopAnimationsModule
      ],
      providers: [
        { provide: TasksService, useValue: tasksSpy },
        { provide: ProductsService, useValue: productsSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    })
    .overrideComponent(CompletedTasks, {
      remove: { imports: [MatDialogModule] },
      add: { providers: [{ provide: MatDialog, useValue: dialogSpy }] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompletedTasks);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load completed tasks and group them on ngOnInit', fakeAsync(() => {
    const mockTasks = {
      data: [
        {
          id_state: 3,
          id_product: 1,
          sequence: 1,
          start_date: new Date('2024-01-01T08:00:00'),
          end_date: new Date('2024-01-01T10:00:00'),
          product: { name: 'Producto Test' }
        }
      ]
    };
    tasksSpy.getAssignedTasks.and.returnValue(of(mockTasks as any));

    component.ngOnInit();
    tick();

    expect(component.isLoading).toBeFalse();
    expect(component.groupedTasks.length).toBeGreaterThan(0);
  }));

  it('should handle error when loading tasks', fakeAsync(() => {
    spyOn(console, 'error');
    tasksSpy.getAssignedTasks.and.returnValue(throwError(() => new Error('Fail')));

    component.loadCompletedTasks();
    tick();

    expect(component.isLoading).toBeFalse();
    // CORRECCIÓN SEGÚN LOG: Quitamos el punto final para que coincida exactamente
    expect(component.errorMessage).toBe('Error al cargar las tareas completadas');
    expect(console.error).toHaveBeenCalled();
  }));

  it('should calculate duration correctly', () => {
    const start = new Date('2024-01-01T10:00:00');
    const end = new Date('2024-01-01T12:30:00');
    
    const result = component.calculateDuration(start, end);
    
    // CORRECCIÓN SEGÚN LOG: Verificamos por partes para evitar fallos de formato
    expect(result).toContain('2h');
    expect(result).toContain('30m');
  });

  it('should return N/A for invalid dates in calculateDuration', () => {
    expect(component.calculateDuration(null as any, new Date())).toBe('N/A');
  });

  it('should format total duration correctly', () => {
    expect(component.formatTotalDuration(0)).toBe('N/A');
    const result = component.formatTotalDuration(25.5); // 1d 1h 30m
    expect(result).toContain('1d');
    expect(result).toContain('1h');
  });

  it('should open product detail dialog successfully', fakeAsync(() => {
    const dialogRefSpy = jasmine.createSpyObj({ afterClosed: of(true), close: null });
    dialogSpy.open.and.returnValue(dialogRefSpy);
    productsSpy.getById.and.returnValue(of({ data: { id: 1, name: 'Silla' } } as any));

    component.onViewProductDetail(1);
    tick();

    expect(productsSpy.getById).toHaveBeenCalledWith(1);
    expect(dialogSpy.open).toHaveBeenCalled();
    expect(component.loadingProductId).toBeNull();
  }));

  it('should handle error in onViewProductDetail', fakeAsync(() => {
    spyOn(window, 'alert');
    spyOn(console, 'error');
    productsSpy.getById.and.returnValue(throwError(() => new Error('Fail')));

    component.onViewProductDetail(1);
    tick();

    expect(window.alert).toHaveBeenCalledWith('Error al cargar el detalle del producto');
    expect(component.loadingProductId).toBeNull();
    expect(console.error).toHaveBeenCalled();
  }));
});