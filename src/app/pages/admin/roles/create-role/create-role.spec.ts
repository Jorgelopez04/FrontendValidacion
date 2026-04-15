import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CreateRole } from './create-role';
import { RolesService } from '../../../../services/roles.service';
import { AreasService } from '../../../../services/areas.service';
import { Router } from '@angular/router';

describe('CreateRole', () => {
  let component: CreateRole;
  let fixture: ComponentFixture<CreateRole>;
  let rolesService: jasmine.SpyObj<RolesService>;
  let areasService: jasmine.SpyObj<AreasService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {

    const rolesSpy = jasmine.createSpyObj('RolesService', ['create']);
    const areasSpy = jasmine.createSpyObj('AreasService', ['getAll']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CreateRole],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),

        { provide: RolesService, useValue: rolesSpy },
        { provide: AreasService, useValue: areasSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateRole);
    component = fixture.componentInstance;

    rolesService = TestBed.inject(RolesService) as jasmine.SpyObj<RolesService>;
    areasService = TestBed.inject(AreasService) as jasmine.SpyObj<AreasService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // mock inicial para que ngOnInit no explote
    areasService.getAll.and.returnValue(of({ data: [] } as any));

    fixture.detectChanges();
  });

  // ✅ create
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ✅ carga áreas
  it('should load areas', fakeAsync(() => {
    areasService.getAll.and.returnValue(of({
      data: [{ id_area: 1 }]
    } as any));

    component.loadAreas();
    tick();

    expect(component.areas.length).toBe(1);
    expect(component.isLoading).toBeFalse();
  }));

  // ✅ error en carga
  it('should handle error loading areas', fakeAsync(() => {
    spyOn(window, 'alert');

    areasService.getAll.and.returnValue(
      throwError(() => new Error('fail'))
    );

    component.loadAreas();
    tick();

    expect(router.navigate).toHaveBeenCalledWith(['/admin/roles']);
  }));

  // ✅ submit inválido
  it('should not submit if form invalid', () => {
    component.onSubmit();
    expect(component.createForm.invalid).toBeTrue();
  });

  // ✅ submit exitoso
  it('should create role', fakeAsync(() => {
    spyOn(window, 'alert');

    rolesService.create.and.returnValue(of({} as any));

    component.createForm.patchValue({
      name: 'Admin',
      description: 'Rol admin',
      id_area: 1
    });

    component.onSubmit();
    tick();

    expect(rolesService.create).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/admin/roles']);
  }));

  // ✅ error en submit
  it('should handle error on create', fakeAsync(() => {
    spyOn(window, 'alert');

    rolesService.create.and.returnValue(
      throwError(() => ({ error: { message: 'fail' } }))
    );

    component.createForm.patchValue({
      name: 'Error',
      description: 'Test',
      id_area: 1
    });

    component.onSubmit();
    tick();

    expect(component.isSaving).toBeFalse();
  }));

  // ✅ cancel
  it('should navigate on cancel', () => {
    component.onCancel();
    expect(router.navigate).toHaveBeenCalledWith(['/admin/roles']);
  });

});