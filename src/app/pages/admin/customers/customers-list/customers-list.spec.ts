import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { CustomersList } from './customers-list';
import { CustomersService } from '../../../../services/customers.service';
import { Router } from '@angular/router';

describe('CustomersList', () => {
  let component: CustomersList;
  let fixture: ComponentFixture<CustomersList>;
  let customersService: jasmine.SpyObj<CustomersService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {

    const customerSpy = jasmine.createSpyObj('CustomersService', ['getAll']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CustomersList],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),

        { provide: CustomersService, useValue: customerSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomersList);
    component = fixture.componentInstance;

    customersService = TestBed.inject(CustomersService) as jasmine.SpyObj<CustomersService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // mock inicial
    customersService.getAll.and.returnValue(of({
      data: [{ id: 1, name: 'Cliente 1' }]
    } as any));

    fixture.detectChanges();
  });

  // ✅ básico
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ✅ ngOnInit / carga
  it('should load customers on init', fakeAsync(() => {
    component.ngOnInit();
    tick();

    expect(component.customers.length).toBe(1);
  }));

  // ✅ error
  it('should handle error on load', fakeAsync(() => {

    spyOn(window, 'alert');

    customersService.getAll.and.returnValue(
      throwError(() => ({
        error: { message: 'Error test' }
      }))
    );

    component.ngOnInit();
    tick();

    expect(window.alert).toHaveBeenCalled();
  }));

  // ✅ lista vacía (relleno útil)
  it('should handle empty list', fakeAsync(() => {

    customersService.getAll.and.returnValue(of({ data: [] } as any));

    component.ngOnInit();
    tick();

    expect(component.customers.length).toBe(0);
  }));

  // ✅ navegación create (si existe en tu componente)
  it('should navigate to create customer', () => {
    component.createCustomer?.();

    expect(router.navigate).toHaveBeenCalled();
  });

  // ✅ navegación edit (si existe)
  it('should navigate to edit customer', () => {
    const customer = { id: 5 } as any;

    component.editCustomer?.(customer);

    expect(router.navigate).toHaveBeenCalled();
  });

});