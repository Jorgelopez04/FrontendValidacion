import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { EditOrder } from './edit-order';
import { OrdersService } from '../../../../services/orders.service';
import { ActivatedRoute, Router } from '@angular/router';

describe('EditOrder', () => {
  let component: EditOrder;
  let fixture: ComponentFixture<EditOrder>;

  let ordersSpy: jasmine.SpyObj<OrdersService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    ordersSpy = jasmine.createSpyObj('OrdersService', [
      'getOrderWithProducts',
      'update',
      'updateProduct'
    ]);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [EditOrder],
      providers: [
        { provide: OrdersService, useValue: ordersSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: 1 } }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditOrder);
    component = fixture.componentInstance;
  });

  // ✅ 1. LOAD OK (PENDING)
  it('should load order correctly when PENDING', () => {
    ordersSpy.getOrderWithProducts.and.returnValue(
      of({
        data: {
          state_name: 'PENDING',
          estimated_delivery_date: new Date(),
          products: [
            {
              id_product: 1,
              name: 'Silla',
              fabric: 'Cuero',
              dimensions: '10x10',
              description: 'ok'
            }
          ]
        }
      } as any)
    );

    fixture.detectChanges();

    expect(component.order).toBeTruthy();
    expect(component.isLoading).toBeFalse();
  });

  // ❌ 2. LOAD BLOCKED (NO PENDING)
  it('should redirect if order is not PENDING', () => {
    ordersSpy.getOrderWithProducts.and.returnValue(
      of({
        data: {
          state_name: 'DONE',
          estimated_delivery_date: new Date(),
          products: []
        }
      } as any)
    );

    fixture.detectChanges();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/orders']);
  });

  // ❌ 3. LOAD ERROR
  it('should handle load error', () => {
    spyOn(console, 'error');

    ordersSpy.getOrderWithProducts.and.returnValue(
      throwError(() => new Error('fail'))
    );

    fixture.detectChanges();

    expect(component.isLoading).toBeFalse();
  });

  // ✅ 4. SUBMIT + UPDATE FLOW
  it('should submit and update order + products', () => {
    ordersSpy.getOrderWithProducts.and.returnValue(
      of({
        data: {
          state_name: 'PENDING',
          estimated_delivery_date: new Date(),
          products: [
            {
              id_product: 1,
              name: 'Mesa',
              fabric: 'Madera',
              dimensions: '20x20',
              description: 'ok'
            }
          ]
        }
      } as any)
    );

    ordersSpy.update.and.returnValue(of({} as any));
    ordersSpy.updateProduct.and.returnValue(of({} as any));

    fixture.detectChanges();

    component.onSubmit();

    expect(ordersSpy.update).toHaveBeenCalled();
  });

  // ❌ 5. INVALID FORM
  it('should block submit when form invalid', () => {
    component.onSubmit();

    expect(component.isSaving).toBeFalse();
  });
});