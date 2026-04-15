import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { RolesList } from './roles-list';
import { RolesService } from '../../../../services/roles.service';

describe('RolesList', () => {
  let component: RolesList;
  let fixture: ComponentFixture<RolesList>;
  let rolesService: jasmine.SpyObj<RolesService>;
  let router: Router;

  beforeEach(async () => {

    const rolesSpy = jasmine.createSpyObj('RolesService', ['getAll']);

    await TestBed.configureTestingModule({
      imports: [RolesList],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),

        { provide: RolesService, useValue: rolesSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RolesList);
    component = fixture.componentInstance;

    rolesService = TestBed.inject(RolesService) as jasmine.SpyObj<RolesService>;
    router = TestBed.inject(Router);

    rolesService.getAll.and.returnValue(of({
      data: [
        { id_role: 1, name: 'Admin', description: 'desc', area: 'IT' }
      ]
    } as any));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load roles on init', fakeAsync(() => {
    component.loadRoles();
    tick();

    expect(component.roles.length).toBe(1);
    expect(component.isLoading).toBeFalse();
  }));

  it('should handle error when loading roles', fakeAsync(() => {
    rolesService.getAll.and.returnValue(
      throwError(() => new Error('fail'))
    );

    component.loadRoles();
    tick();

    expect(component.isLoading).toBeFalse();
  }));

  it('should navigate to create role', () => {
    spyOn(router, 'navigate');

    component.createRole();

    expect(router.navigate).toHaveBeenCalledWith(['/admin/roles/create']);
  });

  it('should navigate to edit role', () => {
    spyOn(router, 'navigate');

    component.editRole({ id_role: 1 } as any);

    expect(router.navigate).toHaveBeenCalledWith(['/admin/roles/edit', 1]);
  });

});