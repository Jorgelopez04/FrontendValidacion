import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { EmployeeLayoutComponent } from './employee-layout';

describe('EmployeeLayout', () => {
  let component: EmployeeLayoutComponent;
  let fixture: ComponentFixture<EmployeeLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EmployeeLayoutComponent,
        RouterTestingModule
      ],
      // Agregamos los providers de HttpClient para que AuthService no falle
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeLayoutComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle sidebar state', () => {
    const initial = component.sidebarOpened;
    component.toggleSidebar();
    expect(component.sidebarOpened).toBe(!initial);
    component.toggleSidebar();
    expect(component.sidebarOpened).toBe(initial);
  });

  it('should have employee menu items', () => {
    expect(component.employeeMenuItems).toBeDefined();
    // Verifica que el arreglo tenga elementos (RF13/RF18: Consultar tareas)
    expect(component.employeeMenuItems.length).toBeGreaterThan(0);
  });
});