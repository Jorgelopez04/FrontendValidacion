import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { OrdersList } from './orders-list';
import { OrdersService } from '../../../../services/orders.service';
import { MatDialog } from '@angular/material/dialog';

describe('OrdersList', () => {
  let component: OrdersList;
  let fixture: ComponentFixture<OrdersList>;
  let ordersService: jasmine.SpyObj<OrdersService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let router: Router;

  beforeEach(async () => {
    const ordersSpy = jasmine.createSpyObj('OrdersService', ['getAll']);
    // Corregimos el mock del Dialog para que devuelva un objeto con afterClosed
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogSpy.open.and.returnValue({
      afterClosed: () => of(true) // Simula el cierre del modal
    } as any);

    await TestBed.configureTestingModule({
      imports: [OrdersList],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: OrdersService, useValue: ordersSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersList);
    component = fixture.componentInstance;

    ordersService = TestBed.inject(OrdersService) as jasmine.SpyObj<OrdersService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    router = TestBed.inject(Router);

    // Mock por defecto para evitar errores en el ngOnInit
    ordersService.getAll.and.returnValue(of({ data: [] } as any));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load orders successfully', fakeAsync(() => {
    ordersService.getAll.and.returnValue(of({
      data: [{ id_order: 1 }]
    } as any));

    component.loadOrders();
    tick();

    expect(component.orders.length).toBe(1);
    expect(component.isLoading).toBeFalse();
  }));

  it('should handle error when loading orders', fakeAsync(() => {
    // Espiamos el console.error para verificar que se loguea el error
    spyOn(console, 'error');
    ordersService.getAll.and.returnValue(
      throwError(() => new Error('fail'))
    );

    component.loadOrders();
    tick();

    expect(component.isLoading).toBeFalse();
    expect(console.error).toHaveBeenCalled();
  }));

  it('should open dialog when viewing order', () => {
    const order = { id_order: 1 } as any;

    component.viewOrderDetails(order);

    expect(dialog.open).toHaveBeenCalled();
  });

  it('should navigate if order is PENDING', () => {
    const navigateSpy = spyOn(router, 'navigate');

    // Nota: Asegúrate de que el estado coincida con lo que espera tu lógica
    // Algunos componentes de TailorFlow usan 'PENDIENTE' en español.
    const order = { id_order: 1, state_name: 'PENDING' } as any;

    component.editOrder(order);

    expect(navigateSpy).toHaveBeenCalledWith(['/admin/orders/edit', 1]);
  });

  it('should block edit if order is not PENDING', () => {
    spyOn(window, 'alert');
    const navigateSpy = spyOn(router, 'navigate');

    const order = { id_order: 1, state_name: 'COMPLETED' } as any;

    component.editOrder(order);

    expect(navigateSpy).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalled();
  });

  it('should navigate to create order', () => {
    const navigateSpy = spyOn(router, 'navigate');

    component.createOrder();

    expect(navigateSpy).toHaveBeenCalledWith(['/admin/orders/create']);
  });
});