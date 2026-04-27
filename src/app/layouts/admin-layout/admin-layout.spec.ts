import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { AdminLayoutComponent } from './admin-layout';

describe('AdminLayoutComponent', () => {
  let component: AdminLayoutComponent;
  let fixture: ComponentFixture<AdminLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // AdminLayoutComponent es standalone, se mantiene en imports
      imports: [AdminLayoutComponent], 
      providers: [
        // ✅ Solución al error NG0201: Provee el contexto de rutas necesario
        provideRouter([]), 
        // ✅ Proveedores de HTTP para servicios dependientes (como AuthService)
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLayoutComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle sidebar state', () => {
    // Forzamos un estado inicial conocido
    component.sidebarOpened = true;
    
    component.toggleSidebar();
    expect(component.sidebarOpened).toBeFalse();

    component.toggleSidebar();
    expect(component.sidebarOpened).toBeTrue();
  });
});