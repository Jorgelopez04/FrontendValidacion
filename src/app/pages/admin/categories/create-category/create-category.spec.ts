import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { CreateCategory } from './create-category';
import { CategoriesService } from '../../../../services/categories.service';
import { FlowsService } from '../../../../services/flows.service';
import { RolesService } from '../../../../services/roles.service';
import { Router } from '@angular/router';

/* ---------------- MOCKS ---------------- */

const categoriesSpy = jasmine.createSpyObj('CategoriesService', ['create']);
const flowsSpy = jasmine.createSpyObj('FlowsService', ['create']);
const rolesSpy = jasmine.createSpyObj('RolesService', ['getAll']);
const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

describe('CreateCategory', () => {
  let component: CreateCategory;
  let fixture: ComponentFixture<CreateCategory>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [CreateCategory, ReactiveFormsModule],
      providers: [
        { provide: CategoriesService, useValue: categoriesSpy },
        { provide: FlowsService, useValue: flowsSpy },
        { provide: RolesService, useValue: rolesSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCategory);
    component = fixture.componentInstance;

    categoriesSpy.create.calls.reset();
    flowsSpy.create.calls.reset();
    rolesSpy.getAll.calls.reset();
    routerSpy.navigate.calls.reset();

    rolesSpy.getAll.and.returnValue(of({ data: [] } as any));

    fixture.detectChanges();
  });

  /* ---------------- BASIC ---------------- */

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load roles on init', () => {
    expect(rolesSpy.getAll).toHaveBeenCalled();
  });

  /* ---------------- FORM FLOW ---------------- */

  it('should not create category if form invalid', () => {
    component.categoryForm.setValue({
      name: '',
      description: ''
    });

    const stepper = jasmine.createSpyObj('MatStepper', ['next']);

    component.createCategoryAndContinue(stepper);

    expect(categoriesSpy.create).not.toHaveBeenCalled();
  });

  it('should create category and go next step', fakeAsync(() => {

    categoriesSpy.create.and.returnValue(
      of({ data: { id_category: 1 } } as any)
    );

    const stepper = jasmine.createSpyObj('MatStepper', ['next']);

    component.categoryForm.setValue({
      name: 'Cat 1',
      description: 'Desc'
    });

    component.createCategoryAndContinue(stepper);
    tick();

    expect(categoriesSpy.create).toHaveBeenCalled();
    expect(component.createCategoryId).toBe(1);
    expect(stepper.next).toHaveBeenCalled();
  }));

  /* ---------------- FLOWS ARRAY ---------------- */

  it('should add and remove flows', () => {

    component.addFlow();
    expect(component.flows.length).toBe(1);

    component.removeFlow(0);
    expect(component.flows.length).toBe(0);
  });

  /* ---------------- FINAL SUBMIT ---------------- */

  it('should not submit without categoryId', () => {

    spyOn(window, 'alert');

    component.onSubmit();

    expect(window.alert).toHaveBeenCalled();
    expect(flowsSpy.create).not.toHaveBeenCalled();
  });

  it('should create flows sequentially and finish', fakeAsync(() => {

    component.createCategoryId = 1;

    component.addFlow();
    component.getFlowsGroup(0).setValue({
      id_role: 1,
      sequence: 1
    });

    flowsSpy.create.and.returnValue(of({} as any));

    component.onSubmit();
    tick();

    expect(flowsSpy.create).toHaveBeenCalled();
  }));

  it('should handle flow error', fakeAsync(() => {

    spyOn(window, 'alert');

    component.createCategoryId = 1;

    component.addFlow();
    component.getFlowsGroup(0).setValue({
      id_role: 1,
      sequence: 1
    });

    flowsSpy.create.and.returnValue(
      throwError(() => ({ error: { message: 'fail' } }))
    );

    component.onSubmit();
    tick();

    expect(window.alert).toHaveBeenCalled();
  }));

  /* ---------------- CANCEL ---------------- */

  it('should navigate on cancel', () => {
    component.onCancel();

    expect(routerSpy.navigate).toHaveBeenCalledWith([
      '/admin/categories'
    ]);
  });
});