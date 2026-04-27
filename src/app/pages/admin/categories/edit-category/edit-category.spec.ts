import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, ActivatedRoute, Router } from '@angular/router'; // Añadido Router
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { EditCategory } from './edit-category';
import { CategoriesService } from '../../../../services/categories.service';
import { Component } from '@angular/core';

// Componente dummy para evitar errores de ruta
@Component({ template: '' })
class DummyComponent {}

describe('EditCategory Integration', () => {
  let component: EditCategory;
  let fixture: ComponentFixture<EditCategory>;
  let categoriesService: jasmine.SpyObj<CategoriesService>;
  let router: Router; // Para validar navegación

  beforeEach(async () => {
    const categorySpy = jasmine.createSpyObj('CategoriesService', ['getById', 'update']);

    await TestBed.configureTestingModule({
      imports: [EditCategory],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations(),
        // 1. DEFINIR LAS RUTAS que el componente usa para navegar al terminar
        provideRouter([
          { path: 'admin/categories', component: DummyComponent }
        ]),
        { provide: CategoriesService, useValue: categorySpy },
        {
          provide: ActivatedRoute,
          useValue: { 
            // Usamos params como observable por si el componente se suscribe
            params: of({ id: '1' }),
            snapshot: { params: { id: '1' } } 
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditCategory);
    component = fixture.componentInstance;
    categoriesService = TestBed.inject(CategoriesService) as jasmine.SpyObj<CategoriesService>;
    router = TestBed.inject(Router);

    // MOCK inicial exitoso
    categoriesService.getById.and.returnValue(of({
      data: { id: 1, name: 'Test', description: 'Desc' }
    } as any));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load category on init', fakeAsync(() => {
    component.ngOnInit();
    tick();
    expect(component.editForm.value.name).toBe('Test');
  }));

  it('should handle error on load', fakeAsync(() => {
    spyOn(window, 'alert');
    // Forzamos error en el servicio
    categoriesService.getById.and.returnValue(throwError(() => ({ error: { message: 'Error' } })));
    
    component.ngOnInit();
    tick();
    expect(window.alert).toHaveBeenCalled();
  }));

  it('should submit successfully and navigate', fakeAsync(() => {
    const navigateSpy = spyOn(router, 'navigate');
    categoriesService.update.and.returnValue(of({ message: 'Actualizado' } as any));

    component.editForm.patchValue({
      name: 'Nueva categoría',
      description: 'Alta cobertura papi'
    });

    component.onSubmit();
    expect(component.isSaving).toBeTrue();
    
    tick(); // Procesar el observable de update
    fixture.detectChanges(); 
    tick(); // Procesar la navegación (si es promesa)

    expect(categoriesService.update).toHaveBeenCalled();
    expect(component.isSaving).toBeFalse();
    // 2. VALIDAR NAVEGACIÓN (Esto mata el error NG04002)
    expect(navigateSpy).toHaveBeenCalledWith(['admin/categories']);
  }));

  it('should handle error on submit', fakeAsync(() => {
    spyOn(window, 'alert');
    categoriesService.update.and.returnValue(throwError(() => ({ error: { message: 'Error' } })));

    component.editForm.patchValue({
      name: 'Error test',
      description: 'Probando fallo'
    });

    component.onSubmit();
    tick();
    expect(window.alert).toHaveBeenCalled();
    expect(component.isSaving).toBeFalse();
  }));

  it('should not submit if form is invalid', () => {
    component.editForm.patchValue({ name: '' });
    component.onSubmit();
    expect(component.editForm.valid).toBeFalse();
    expect(categoriesService.update).not.toHaveBeenCalled();
  });
});