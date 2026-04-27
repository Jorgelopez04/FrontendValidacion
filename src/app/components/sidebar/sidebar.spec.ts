import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { SidebarComponent } from './sidebar'; 
import { ADMIN_MENU_ITEMS } from '../../common/menu-items';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        provideRouter([]),
        // ✅ Crucial: Provee HttpClient para que AuthService no rompa el test
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default menu items', () => {
    expect(component.menuItems).toEqual(ADMIN_MENU_ITEMS);
  });

  it('should update menu items when input changes', () => {
    const mockMenu = [
      { label: 'Test', icon: 'home', route: '/test' }
    ] as any;

    component.menuItems = mockMenu;
    fixture.detectChanges();

    expect(component.menuItems).toEqual(mockMenu);
  });
});