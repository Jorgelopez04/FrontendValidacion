import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CreateArea } from './create-area';
import { AreasService } from '../../../../services/areas.service';

/* ---------------- MOCKS ---------------- */

class MockAreasService {
  create = jasmine.createSpy('create');
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

/* ---------------- TEST ---------------- */

describe('CreateArea', () => {
  let component: CreateArea;
  let fixture: ComponentFixture<CreateArea>;
  let areasService: MockAreasService;
  let router: MockRouter;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateArea, ReactiveFormsModule],
      providers: [
        { provide: AreasService, useClass: MockAreasService },
        { provide: Router, useClass: MockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateArea);
    component = fixture.componentInstance;

    areasService = TestBed.inject(AreasService) as any;
    router = TestBed.inject(Router) as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form as invalid', () => {
    expect(component.createForm.valid).toBeFalse();
  });

  it('should not submit if form is invalid', () => {
    component.onSubmit();

    expect(areasService.create).not.toHaveBeenCalled();
  });

  it('should create area and navigate on success', () => {
    spyOn(window, 'alert');

    component.createForm.setValue({
      name: 'Área Test'
    });

    areasService.create.and.returnValue(of({}));

    component.onSubmit();

    expect(areasService.create).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Área creada exitosamente');
    expect(router.navigate).toHaveBeenCalledWith(['/admin/areas']);
  });

  it('should handle error and reset saving state', () => {
    spyOn(console, 'error');
    spyOn(window, 'alert');

    component.createForm.setValue({
      name: 'Área Test'
    });

    areasService.create.and.returnValue(
      throwError(() => ({
        error: { message: 'error controlado' }
      }))
    );

    component.onSubmit();

    expect(console.error).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith(
      'Error al crear área: error controlado'
    );
    expect(component.isSaving).toBeFalse();
  });

  it('should navigate on cancel', () => {
    component.onCancel();

    expect(router.navigate).toHaveBeenCalledWith(['/admin/areas']);
  });
});