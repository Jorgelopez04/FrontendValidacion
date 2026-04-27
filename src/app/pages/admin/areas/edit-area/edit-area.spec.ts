import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

import { EditArea } from './edit-area';
import { AreasService } from '../../../../services/areas.service';

describe('EditArea', () => {
  let component: EditArea;
  let fixture: ComponentFixture<EditArea>;
  let areasSpy: jasmine.SpyObj<AreasService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Creamos los espías de los servicios
    areasSpy = jasmine.createSpyObj('AreasService', ['getById', 'update']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      // Si EditArea es standalone, va en imports. Si no, va en declarations.
      imports: [EditArea, ReactiveFormsModule],
      providers: [
        { provide: AreasService, useValue: areasSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            // Se provee el ID en ambos formatos para evitar el 'undefined'
            snapshot: { params: { id: 1 } },
            params: of({ id: 1 })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditArea);
    component = fixture.componentInstance;

    // Mock por defecto para evitar errores en la carga inicial (ngOnInit)
    areasSpy.getById.and.returnValue(
      of({ data: { id: 1, name: 'Área inicial' } } as any)
    );
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load area correctly', fakeAsync(() => {
    // Configuramos el mock específico para este test
    areasSpy.getById.and.returnValue(
      of({ data: { id: 1, name: 'Área test' } } as any)
    );

    component.ngOnInit(); // O component.loadArea() si lo llamas manualmente
    tick();
    fixture.detectChanges();

    // Usamos jasmine.anything() o jasmine.any(Number) para ser flexibles con string/number
    expect(areasSpy.getById).toHaveBeenCalledWith(jasmine.anything());
    expect(component.editForm.get('name')?.value).toBe('Área test');
    expect(component.isLoading).toBeFalse();
  }));

  it('should handle load error and navigate', fakeAsync(() => {
    spyOn(window, 'alert');
    areasSpy.getById.and.returnValue(
      throwError(() => ({ error: { message: 'fail' } }))
    );

    component.loadArea();
    tick();

    expect(window.alert).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/areas']);
  }));

  it('should update area and navigate', fakeAsync(() => {
    spyOn(window, 'alert');
    areasSpy.update.and.returnValue(of({ message: 'Actualizado' } as any));

    // Aseguramos que el formulario sea válido y tenga el ID
    component.areaId = 1;
    component.editForm.patchValue({ name: 'Nuevo nombre' });

    component.onSubmit();
    tick();

    expect(areasSpy.update).toHaveBeenCalledWith(
      1,
      jasmine.objectContaining({ name: 'Nuevo nombre' })
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/areas']);
  }));

  it('should not submit invalid form', () => {
    component.editForm.patchValue({ name: '' });
    component.onSubmit();
    expect(areasSpy.update).not.toHaveBeenCalled();
  });

  it('should navigate back on cancel', () => {
    component.onCancel();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/areas']);
  });
});