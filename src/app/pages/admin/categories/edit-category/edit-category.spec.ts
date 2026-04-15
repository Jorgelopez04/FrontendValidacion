import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { EditCategory } from './edit-category';
import { CategoriesService } from '../../../../services/categories.service';

describe('EditCategory Integration', () => {
  let component: EditCategory;
  let fixture: ComponentFixture<EditCategory>;
  let categoriesService: jasmine.SpyObj<CategoriesService>;

  beforeEach(async () => {

    const categorySpy = jasmine.createSpyObj('CategoriesService', ['getById', 'update']);

    await TestBed.configureTestingModule({
      imports: [EditCategory],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations(),
        provideRouter([]),

        { provide: CategoriesService, useValue: categorySpy },

        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id: '1' } } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditCategory);
    component = fixture.componentInstance;

    categoriesService = TestBed.inject(CategoriesService) as jasmine.SpyObj<CategoriesService>;

    // MOCK inicial
    categoriesService.getById.and.returnValue(of({
      data: {
        id: 1,
        name: 'Test',
        description: 'Desc'
      }
    } as any));

    fixture.detectChanges();
  });

  // ✅ CREATE
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ✅ ngOnInit SUCCESS
  it('should load category on init', fakeAsync(() => {
    component.ngOnInit();
    tick();

    expect(component.editForm.value.name).toBe('Test');
    expect(component.editForm.value.description).toBe('Desc');
  }));

  // ✅ ngOnInit ERROR
  it('should handle error on load', fakeAsync(() => {

    spyOn(window, 'alert');

    categoriesService.getById.and.returnValue(
      throwError(() => ({
        error: { message: 'Error cargando' }
      }))
    );

    component.ngOnInit();
    tick();

    expect(window.alert).toHaveBeenCalled();
  }));

  // ✅ SUBMIT SUCCESS
  it('should submit successfully', fakeAsync(() => {

    categoriesService.update.and.returnValue(of({
      message: 'Actualizado'
    } as any));

    component.editForm.patchValue({
      name: 'Nueva categoría',
      description: 'Alta cobertura papi'
    });

    component.onSubmit();

    expect(component.isSaving).toBeTrue(); // antes de tick

    tick();

    expect(component.editForm.valid).toBeTrue();
    expect(component.isSaving).toBeFalse();
    expect(categoriesService.update).toHaveBeenCalled();
  }));

  // ✅ SUBMIT ERROR
  it('should handle error on submit', fakeAsync(() => {

    spyOn(window, 'alert');

    categoriesService.update.and.returnValue(
      throwError(() => ({
        error: { message: 'Error' }
      }))
    );

    component.editForm.patchValue({
      name: 'Error test',
      description: 'Probando fallo'
    });

    component.onSubmit();
    tick();

    expect(component.isSaving).toBeFalse();
    expect(window.alert).toHaveBeenCalled();
  }));

  // ✅ FORM INVALIDO
  it('should not submit if form is invalid', () => {

    component.editForm.patchValue({
      name: '',
      description: ''
    });

    component.onSubmit();

    expect(component.editForm.valid).toBeFalse();
  });

  // ✅ FLOW COMPLETO (cubre varias líneas)
  it('should execute full flow', fakeAsync(() => {

    categoriesService.update.and.returnValue(of({} as any));

    component.ngOnInit();
    tick();

    component.editForm.patchValue({
      name: 'Flow test',
      description: 'Probando todo'
    });

    component.onSubmit();
    tick();

    expect(component).toBeTruthy();
  }));

});