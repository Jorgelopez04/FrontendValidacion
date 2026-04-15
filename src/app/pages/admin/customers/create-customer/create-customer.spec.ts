import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { CreateCustomer } from './create-customer';
import { CustomersService } from '../../../../services/customers.service';
import { Router } from '@angular/router';

describe('CreateCustomer', () => {
  let component: CreateCustomer;
  let fixture: ComponentFixture<CreateCustomer>;
  let customersService: jasmine.SpyObj<CustomersService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const customerSpy = jasmine.createSpyObj('CustomersService', ['create']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CreateCustomer],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CustomersService, useValue: customerSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCustomer);
    component = fixture.componentInstance;

    customersService = TestBed.inject(CustomersService) as jasmine.SpyObj<CustomersService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should not submit if form is invalid', () => {
    component.customerForm.patchValue({
      name: '',
      email: ''
    });

    component.onSubmit();

    expect(component.customerForm.valid).toBeFalse();
    expect(customersService.create).not.toHaveBeenCalled();
  });

  it('should create customer successfully', fakeAsync(() => {
    customersService.create.and.returnValue(of({ message: 'ok' } as any));

    fixture.detectChanges();

    component.customerForm.patchValue({
      name: 'Cliente Test',
      email: 'test@mail.com'
    });

    component.onSubmit();

    expect(component.isSaving).toBeTrue();

    tick();

    expect(component.isSaving).toBeFalse();
    expect(customersService.create).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalled();
  }));

  it('should handle error on create', fakeAsync(() => {
    spyOn(window, 'alert');

    customersService.create.and.returnValue(
      throwError(() => ({ error: { message: 'Error test' } }))
    );

    fixture.detectChanges();

    component.customerForm.patchValue({
      name: 'Error',
      email: 'error@mail.com'
    });

    component.onSubmit();
    tick();

    expect(component.isSaving).toBeFalse();
    expect(window.alert).toHaveBeenCalled();
  }));

  it('should execute full flow', fakeAsync(() => {
    customersService.create.and.returnValue(of({} as any));

    fixture.detectChanges();

    component.customerForm.patchValue({
      name: 'Flow',
      email: 'flow@mail.com'
    });

    component.onSubmit();
    tick();

    expect(customersService.create).toHaveBeenCalled();
  }));
});