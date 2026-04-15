import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { EmployeeLayout } from './employee-layout';

describe('EmployeeLayout', () => {
  let component: EmployeeLayout;
  let fixture: ComponentFixture<EmployeeLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EmployeeLayout,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeLayout);
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
    expect(component.employeeMenuItems.length).toBeGreaterThan(0);
  });
});