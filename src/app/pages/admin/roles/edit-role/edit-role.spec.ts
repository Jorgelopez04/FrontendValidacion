import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { EditRole } from './edit-role';
import { RolesService } from '../../../../services/roles.service';

describe('EditRole Integration', () => {
  let component: EditRole;
  let fixture: ComponentFixture<EditRole>;
  let rolesService: jasmine.SpyObj<RolesService>;
  let router: Router;

  beforeEach(async () => {
    // Definimos los métodos que usa el componente
    const spy = jasmine.createSpyObj('RolesService', ['getById', 'update']);

    await TestBed.configureTestingModule({
      imports: [EditRole],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations(),
        provideRouter([]),
        { provide: RolesService, useValue: spy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id: '1' } } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditRole);
    component = fixture.componentInstance;
    rolesService = TestBed.inject(RolesService) as jasmine.SpyObj<RolesService>;
    router = TestBed.inject(Router);
  });

  it('should initialize and load role data', () => {
    // ✅ Mock de carga inicial con estructura .data
    const mockRole = {
      data: {
        id_role: 1,
        name: 'Supervisor',
        description: 'Gestión de planta',
        area: { name: 'Producción' }
      }
    };
    rolesService.getById.and.returnValue(of(mockRole as any));

    fixture.detectChanges(); // Dispara ngOnInit y loadRole

    expect(component.roleId).toBe(1);
    expect(component.editForm.get('name')?.value).toBe('Supervisor');
    expect(component.isLoading).toBeFalse();
  });

  it('should handle error when loading role', () => {
    rolesService.getById.and.returnValue(throwError(() => new Error('API Error')));
    const navigateSpy = spyOn(router, 'navigate');
    spyOn(window, 'alert');

    fixture.detectChanges();

    expect(navigateSpy).toHaveBeenCalledWith(['/admin/roles']);
    expect(window.alert).toHaveBeenCalledWith('Error al cargar el rol');
  });

  it('should complete update flow on valid submission', () => {
    // Setup inicial para que el componente tenga los datos y el form esté listo
    rolesService.getById.and.returnValue(of({ data: { id_role: 1 } } as any));
    fixture.detectChanges();

    // ✅ CORRECCIÓN CLAVE: of con estructura .data
    rolesService.update.and.returnValue(of({ data: { success: true } } as any));
    
    const navigateSpy = spyOn(router, 'navigate');
    spyOn(window, 'alert');

    // Llenar datos requeridos para que form.invalid sea false
    component.editForm.patchValue({
      name: 'Nuevo Nombre',
      description: 'Nueva Descripción'
    });

    component.onSubmit();

    expect(rolesService.update).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Rol actualizado exitosamente');
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/roles']);
  });

  it('should handle update error and stop isSaving', () => {
    rolesService.getById.and.returnValue(of({ data: {} } as any));
    fixture.detectChanges();

    // Mock de error con estructura de mensaje
    rolesService.update.and.returnValue(throwError(() => ({ 
      error: { message: 'Falla de red' },
      message: 'Error'
    })));
    
    spyOn(window, 'alert');
    component.editForm.patchValue({ name: 'Test', description: 'Test' });

    component.onSubmit();

    expect(component.isSaving).toBeFalse();
    expect(window.alert).toHaveBeenCalled();
  });

  it('should navigate away when onCancel is called', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.onCancel();
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/roles']);
  });
});