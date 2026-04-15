import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { CreateFlow } from './create-flow';
import { FlowsService } from '../../../../services/flows.service';
import { CategoriesService } from '../../../../services/categories.service';
import { RolesService } from '../../../../services/roles.service';
import { Router } from '@angular/router';

/* ---------------- MOCKS ---------------- */

const flowsSpy = jasmine.createSpyObj('FlowsService', ['create']);
const categoriesSpy = jasmine.createSpyObj('CategoriesService', ['getAll']);
const rolesSpy = jasmine.createSpyObj('RolesService', ['getAll']);
const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

describe('CreateFlow', () => {
  let component: CreateFlow;
  let fixture: ComponentFixture<CreateFlow>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [CreateFlow, ReactiveFormsModule],
      providers: [
        { provide: FlowsService, useValue: flowsSpy },
        { provide: CategoriesService, useValue: categoriesSpy },
        { provide: RolesService, useValue: rolesSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateFlow);
    component = fixture.componentInstance;

    flowsSpy.create.calls.reset();
    categoriesSpy.getAll.calls.reset();
    rolesSpy.getAll.calls.reset();
    routerSpy.navigate.calls.reset();

    categoriesSpy.getAll.and.returnValue(
      of({ data: [{ id_category: 1, name: 'Cat' }] } as any)
    );

    rolesSpy.getAll.and.returnValue(
      of({ data: [{ id_role: 1, name: 'Admin' }] } as any)
    );

    fixture.detectChanges();
  });

  /* ---------------- BASIC ---------------- */

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories and roles on init', () => {
    expect(categoriesSpy.getAll).toHaveBeenCalled();
    expect(rolesSpy.getAll).toHaveBeenCalled();
  });

  /* ---------------- LOAD ERRORS ---------------- */

  it('should handle category load error', () => {

    spyOn(window, 'alert');

    categoriesSpy.getAll.and.returnValue(
      throwError(() => new Error('fail'))
    );

    component.loadCategories();

    expect(window.alert).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/flows']);
  });

  it('should handle role load error', () => {

    spyOn(window, 'alert');

    rolesSpy.getAll.and.returnValue(
      throwError(() => new Error('fail'))
    );

    component.loadRoles();

    expect(window.alert).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/flows']);
  });

  /* ---------------- SUBMIT ---------------- */

  it('should not submit if form invalid', () => {

    component.onSubmit();

    expect(flowsSpy.create).not.toHaveBeenCalled();
  });

  it('should create flow successfully', fakeAsync(() => {

    spyOn(window, 'alert');

    flowsSpy.create.and.returnValue(of({} as any));

    component.flowForm.setValue({
      id_category: 1,
      id_role: 1,
      sequence: 1
    });

    component.onSubmit();
    tick();

    expect(flowsSpy.create).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith([
      '/admin/flows'
    ]);
  }));

  it('should handle create error', fakeAsync(() => {

    spyOn(console, 'error');
    spyOn(window, 'alert');

    flowsSpy.create.and.returnValue(
      throwError(() => ({
        error: { message: 'error flow' }
      }))
    );

    component.flowForm.setValue({
      id_category: 1,
      id_role: 1,
      sequence: 1
    });

    component.onSubmit();
    tick();

    expect(component.isSaving).toBeFalse();
    expect(console.error).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalled();
  }));

  /* ---------------- CANCEL ---------------- */

  it('should navigate on cancel', () => {

    component.onCancel();

    expect(routerSpy.navigate).toHaveBeenCalledWith([
      '/admin/flows'
    ]);
  });
});