import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { AreasList } from './areas-list';
import { AreasService } from '../../../../services/areas.service';
import { Router } from '@angular/router';

/* ---------------- MOCKS ---------------- */

const areasSpy = jasmine.createSpyObj('AreasService', ['getAll']);
const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

describe('AreasList', () => {
  let component: AreasList;
  let fixture: ComponentFixture<AreasList>;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [AreasList],
      providers: [
        { provide: AreasService, useValue: areasSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AreasList);
    component = fixture.componentInstance;

    areasSpy.getAll.calls.reset();
    routerSpy.navigate.calls.reset();

    // mock base
    areasSpy.getAll.and.returnValue(
      of({ data: [{ id_area: 1, name: 'Area 1' }] } as any)
    );

    fixture.detectChanges();
  });

  /* ---------------- TESTS ---------------- */

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load areas on init', fakeAsync(() => {

    component.loadAreas();
    tick();

    expect(component.areas.length).toBe(1);
    expect(component.isLoading).toBeFalse();
  }));

  it('should handle error on loadAreas', fakeAsync(() => {

    spyOn(window, 'alert');

    areasSpy.getAll.and.returnValue(
      throwError(() => ({ error: { message: 'Error test' } }))
    );

    component.loadAreas();
    tick();

    expect(component.isLoading).toBeFalse();
    expect(window.alert).toHaveBeenCalled();
  }));

  it('should navigate to create area', () => {
    component.createArea();

    expect(routerSpy.navigate).toHaveBeenCalledWith([
      '/admin/areas/create'
    ]);
  });

  it('should navigate to edit area', () => {
    const area = { id_area: 5 } as any;

    component.editArea(area);

    expect(routerSpy.navigate).toHaveBeenCalledWith([
      '/admin/areas/edit',
      5
    ]);
  });

});