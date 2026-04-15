import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { CategoriesList } from './categories-list';
import { CategoriesService } from '../../../../services/categories.service';
import { Router } from '@angular/router';

describe('CategoriesList', () => {
  let component: CategoriesList;
  let fixture: ComponentFixture<CategoriesList>;
  let categoriesService: jasmine.SpyObj<CategoriesService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {

    const catSpy = jasmine.createSpyObj('CategoriesService', ['getAll']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CategoriesList],
      providers: [
        { provide: CategoriesService, useValue: catSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesList);
    component = fixture.componentInstance;

    categoriesService = TestBed.inject(CategoriesService) as jasmine.SpyObj<CategoriesService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // mock inicial
    categoriesService.getAll.and.returnValue(of({
      data: [{ id: 1, name: 'Cat 1' }]
    } as any));

    fixture.detectChanges();
  });

  // ✅ básico
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ✅ ngOnInit
  it('should load categories on init', fakeAsync(() => {
    component.ngOnInit();
    tick();

    expect(component.categories.length).toBe(1);
  }));

  // ✅ error
  it('should handle error on load', fakeAsync(() => {

    spyOn(window, 'alert');

    categoriesService.getAll.and.returnValue(
      throwError(() => ({
        error: { message: 'Error test' }
      }))
    );

    component.ngOnInit();
    tick();

    expect(window.alert).toHaveBeenCalled();
  }));

  // ✅ navegación create
  it('should navigate to create category', () => {
    component.createCategory();

    expect(router.navigate).toHaveBeenCalledWith(['/admin/categories/create']);
  });

  // ✅ navegación edit
  it('should navigate to edit category', () => {
    const cat = { id: 10 } as any;

    component.editCategory(cat);

    expect(router.navigate).toHaveBeenCalledWith(['/admin/categories/edit', 10]);
  });

});