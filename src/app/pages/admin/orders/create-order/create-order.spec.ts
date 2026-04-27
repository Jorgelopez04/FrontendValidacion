import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    ordersSpy = jasmine.createSpyObj('OrdersService', ['create', 'createProduct']);
    customersSpy = jasmine.createSpyObj('CustomersService', ['getAllForForms']);
    categoriesSpy = jasmine.createSpyObj('CategoriesService', ['getAll']);
    // Mockeamos el router para evitar errores de rutas no encontradas
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CreateOrder, ReactiveFormsModule],
      providers: [
        { provide: OrdersService, useValue: ordersSpy },
        { provide: CustomersService, useValue: customersSpy },
        { provide: CategoriesService, useValue: categoriesSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    // Mocks iniciales obligatorios para el ngOnInit
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
    const stepperMock = { next: jasmine.createSpy('next') } as any;

    component.orderForm.setValue({
      id_customer: 1,
      estimated_delivery_date: new Date()
    });

    component.createOrderAndContinue(stepperMock);

    expect(ordersSpy.create).toHaveBeenCalled();
    expect(stepperMock.next).toHaveBeenCalled();
  });

  it('should submit product and navigate', fakeAsync(() => {
    component.createdOrderId = 1;

    const mockProduct = {
      name: 'Test',
      id_category: 1,
      customized: false,
      fabric: 'A',
      dimensions: '',
      description: ''
    };

    // --- SOLUCIÓN AL ERROR NG01000 (FormArray) ---
    const productsArray = component.productsForm.get('products') as FormArray;
    
    // Nos aseguramos de que el array tenga exactamente un control antes del setValue
    while (productsArray.length !== 0) {
      productsArray.removeAt(0);
    }
    
    // Llamamos al método que usas en tu lógica para añadir el FormGroup al array
    // Si el método se llama distinto (ej. addProduct), cámbialo aquí:
    if (typeof component.addProduct === 'function') {
      component.addProduct();
    } else {
      // Si no es público, forzamos la creación del control
      (component as any).products.push((component as any).createProductGroup());
    }

    // Ahora setValue no fallará porque la estructura coincide
    component.productsForm.setValue({
      products: [mockProduct]
    });

    component.onSubmit();
    tick(); // Procesamos el observable de createProduct

    expect(ordersSpy.createProduct).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/orders']);
  }));
});