import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { EditArea } from './edit-area';
import { AreasService } from '../../../../services/areas.service';

describe('EditArea', () => {
  let component: EditArea;
  let fixture: ComponentFixture<EditArea>;

  let areasSpy: jasmine.SpyObj<AreasService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    areasSpy = jasmine.createSpyObj('AreasService', ['getById', 'update']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [EditArea],
      providers: [
        { provide: AreasService, useValue: areasSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { id: 1 }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditArea);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load area correctly', () => {
    areasSpy.getById.and.returnValue(
      of({ data: { id: 1, name: 'Área test' } } as any)
    );

    component.loadArea();

    expect(areasSpy.getById).toHaveBeenCalledWith(1);
    expect(component.editForm.get('name')?.value).toBe('Área test');
    expect(component.isLoading).toBeFalse();
  });

  it('should handle load error and navigate', () => {
    spyOn(console, 'error');
    spyOn(window, 'alert');

    areasSpy.getById.and.returnValue(
      throwError(() => ({ error: { message: 'fail' } }))
    );

    component.loadArea();

    expect(console.error).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/areas']);
  });

  it('should update area', () => {
    spyOn(window, 'alert');

    areasSpy.update.and.returnValue(of({} as any));

    component.editForm.setValue({ name: 'Nuevo nombre' });

    component.onSubmit();

    expect(areasSpy.update).toHaveBeenCalledWith(
      1,
      jasmine.objectContaining({
        name: 'Nuevo nombre'
      })
    );

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/areas']);
  });

  it('should not submit invalid form', () => {
    component.editForm.setValue({ name: '' });

    component.onSubmit();

    expect(areasSpy.update).not.toHaveBeenCalled();
  });

  it('should cancel navigation', () => {
    component.onCancel();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/areas']);
  });
});