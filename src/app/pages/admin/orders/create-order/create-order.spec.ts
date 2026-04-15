import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { MatStepper } from '@angular/material/stepper';

import { CreateOrder } from './create-order';

import { OrdersService } from '../../../../services/orders.service';
import { CustomersService } from '../../../../services/customers.service';
import { CategoriesService } from '../../../../services/categories.service';

describe('CreateOrder', () => {

  let component: CreateOrder;
  let fixture: ComponentFixture<CreateOrder>;

  let ordersSpy: jasmine.SpyObj<OrdersService>;
  let customersSpy: jasmine.SpyObj<CustomersService>;
  let categoriesSpy: jasmine.SpyObj<CategoriesService>;

  beforeEach(async () => {

    ordersSpy = jasmine.createSpyObj('OrdersService', ['create', 'createProduct']);
    customersSpy = jasmine.createSpyObj('CustomersService', ['getAllForForms']);
    categoriesSpy = jasmine.createSpyObj('CategoriesService', ['getAll']);

    await TestBed.configureTestingModule({
      imports: [CreateOrder],
      providers: [
        { provide: OrdersService, useValue: ordersSpy },
        { provide: CustomersService, useValue: customersSpy },
        { provide: CategoriesService, useValue: categoriesSpy }
      ]
    }).compileComponents();

    // 🔥 IMPORTANTE: mocks ANTES de detectChanges
    customersSpy.getAllForForms.and.returnValue(of({ data: [] } as any));
    categoriesSpy.getAll.and.returnValue(of({ data: [] } as any));

    ordersSpy.create.and.returnValue(of({ data: { id_order: 1 } } as any));
    ordersSpy.createProduct.and.returnValue(of({ data: { id_product: 1 } } as any));

    fixture = TestBed.createComponent(CreateOrder);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create order and continue', () => {

    const stepper = { next: jasmine.createSpy() } as any;

    component.orderForm.setValue({
      id_customer: 1,
      estimated_delivery_date: new Date()
    });

    component.createOrderAndContinue(stepper);

    expect(ordersSpy.create).toHaveBeenCalled();
    expect(stepper.next).toHaveBeenCalled();
  });

  it('should submit product and navigate', fakeAsync(() => {

    const routerSpy = spyOn(component['router'], 'navigate');

    component.createdOrderId = 1;

    component.productsForm.setValue({
      products: [
        {
          name: 'Test',
          id_category: 1,
          customized: false,
          fabric: 'A',
          dimensions: '',
          description: ''
        }
      ]
    });

    component.onSubmit();
    tick();

    expect(ordersSpy.createProduct).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['/admin/orders']);
  }));

});