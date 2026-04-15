import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { EditEmployee } from './edit-employee';
import { EmployeesService } from '../../../../services/employee.service';

describe('EditEmployee', () => {
  let component: EditEmployee;
  let fixture: ComponentFixture<EditEmployee>;
  let service: jasmine.SpyObj<EmployeesService>;

  beforeEach(async () => {

    service = jasmine.createSpyObj('EmployeesService', [
      'getById',
      'update'
    ]);

    await TestBed.configureTestingModule({
      imports: [EditEmployee, RouterTestingModule],
      providers: [
        { provide: EmployeesService, useValue: service },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: { id: '1' } }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditEmployee);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load employee on init', fakeAsync(() => {

    service.getById.and.returnValue(
      of({ data: { state: 'ACTIVE' } } as any)
    );

    component.ngOnInit();
    tick();

    expect(component.employee).toBeDefined();
    expect(component.isLoading).toBeFalse();
  }));

  it('should submit update successfully', fakeAsync(() => {

    service.update.and.returnValue(of({} as any));

    component.initForm();

    component.employeeForm.patchValue({
      state: 'ACTIVE',
      password: '123456'
    });

    component.onSubmit();
    tick();

    expect(service.update).toHaveBeenCalled();
    expect(component.isSaving).toBeFalse();
  }));

  it('should handle invalid form', () => {

    component.initForm();

    component.employeeForm.patchValue({
      state: ''
    });

    component.onSubmit();

    expect(component.employeeForm.invalid).toBeTrue();
  });

  it('should handle update error', fakeAsync(() => {

    service.update.and.returnValue(
      throwError(() => new Error('error'))
    );

    component.initForm();

    component.employeeForm.patchValue({
      state: 'ACTIVE'
    });

    component.onSubmit();
    tick();

    expect(component.isSaving).toBeFalse();
  }));
});