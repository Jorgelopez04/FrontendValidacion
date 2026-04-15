import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { EditCustomer } from './edit-customer';
import { CustomersService } from '../../../../services/customers.service';
import { Router } from '@angular/router';

describe('EditCustomer', () => {
  let component: EditCustomer;
  let fixture: ComponentFixture<EditCustomer>;
  let customersService: jasmine.SpyObj<CustomersService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {

    const customerSpy = jasmine.createSpyObj('CustomersService', ['getById', 'update']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [EditCustomer],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),

        { provide: CustomersService, useValue: customerSpy },
        { provide: Router, useValue: routerSpy },

        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id: '1' } } }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCustomer);
    component = fixture.componentInstance;

    customersService = TestBed.inject(CustomersService) as jasmine.SpyObj<CustomersService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // mock inicial
    customersService.getById.and.returnValue(of({
      data: {
        id: 1,
        name: 'Cliente Test',
        address: 'Calle 123',
        phone: '123456'
      }
    } as any));

    fixture.detectChanges();
  });

  // ✅ create
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ✅ carga exitosa
  it('should load customer on init', fakeAsync(() => {
    component.ngOnInit();
    tick();

    expect(component.editForm.value.name).toBe('Cliente Test');
    expect(component.isLoading).toBeFalse();
  }));

  // ✅ error en carga
  it('should handle error on load', fakeAsync(() => {

    spyOn(window, 'alert');

    customersService.getById.and.returnValue(
      throwError(() => ({ error: {} }))
    );

    component.ngOnInit();
    tick();

    expect(component.isLoading).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/admin/customers']);
  }));

  // ✅ submit inválido
  it('should not submit if form is invalid', () => {

    component.editForm.patchValue({
      name: 'a'.repeat(101) // rompe maxLength
    });

    component.onSubmit();

    expect(component.editForm.invalid).toBeTrue();
  });

  // ✅ submit exitoso (con campos)
  it('should update customer successfully', fakeAsync(() => {

    spyOn(window, 'alert');

    customersService.update.and.returnValue(of({} as any));

    component.editForm.patchValue({
      name: 'Nuevo',
      address: 'Nueva dir',
      phone: '999'
    });

    component.onSubmit();

    expect(component.isSaving).toBeTrue();

    tick();

    expect(customersService.update).toHaveBeenCalledWith(1, {
      name: 'Nuevo',
      address: 'Nueva dir',
      phone: '999'
    });

    expect(router.navigate).toHaveBeenCalledWith(['/admin/customers']);
  }));

  // ✅ submit con campos parciales (esto sube coverage fino 🔥)
  it('should update only provided fields', fakeAsync(() => {

    customersService.update.and.returnValue(of({} as any));

    component.editForm.patchValue({
      name: 'Solo nombre'
    });

    component.onSubmit();
    tick();

    expect(customersService.update).toHaveBeenCalledWith(1, {
      name: 'Solo nombre'
    });
  }));

  // ✅ error en submit
  it('should handle error on update', fakeAsync(() => {

    spyOn(window, 'alert');

    customersService.update.and.returnValue(
      throwError(() => ({
        error: { message: 'Error update' }
      }))
    );

    component.editForm.patchValue({
      name: 'Error'
    });

    component.onSubmit();
    tick();

    expect(component.isSaving).toBeFalse();
  }));

  // ✅ cancel
  it('should navigate on cancel', () => {
    component.onCancel();

    expect(router.navigate).toHaveBeenCalledWith(['/admin/customers']);
  });

});