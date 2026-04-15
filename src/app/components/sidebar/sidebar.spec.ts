import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Sidebar } from './sidebar';
import { ADMIN_MENU_ITEMS } from '../../common/menu-items';

describe('Sidebar', () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sidebar],
      providers: [
        provideRouter([]) // necesario por RouterModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ✅ create
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ✅ valor por defecto
  it('should have default menu items', () => {
    expect(component.menuItems).toEqual(ADMIN_MENU_ITEMS);
  });

  // ✅ cambio de input
  it('should update menu items when input changes', () => {
    const mockMenu = [
      { label: 'Test', icon: 'home', route: '/test' }
    ] as any;

    component.menuItems = mockMenu;
    fixture.detectChanges();

    expect(component.menuItems).toEqual(mockMenu);
  });

});