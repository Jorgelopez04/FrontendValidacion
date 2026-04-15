import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { FlowsList } from './flows-list';
import { FlowsService } from '../../../../services/flows.service';

describe('FlowsList', () => {
  let component: FlowsList;
  let fixture: ComponentFixture<FlowsList>;
  let flowsServiceSpy: jasmine.SpyObj<FlowsService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    flowsServiceSpy = jasmine.createSpyObj('FlowsService', ['getAll']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FlowsList],
      providers: [
        { provide: FlowsService, useValue: flowsServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FlowsList);
    component = fixture.componentInstance;
  });

  it('should load flows on init', fakeAsync(() => {
    flowsServiceSpy.getAll.and.returnValue(
      of({
        data: [
          {
            id_flow: 1,
            sequence: 1,
            category: 'TEST',
            role: { id_role: 1, name: 'Admin' },
            area: { id_area: 1, name: 'IT' }
          }
        ]
      } as any)
    );

    fixture.detectChanges(); // ngOnInit
    tick();

    expect(flowsServiceSpy.getAll).toHaveBeenCalled();
    expect(component.flows.length).toBe(1);
    expect(component.isLoading).toBeFalse();
  }));

  it('should set loading true when loadFlows is called', () => {
    flowsServiceSpy.getAll.and.returnValue(of({ data: [] } as any));

    component.loadFlows();

    expect(component.isLoading).toBeTrue();
  });

  it('should navigate to create flow', () => {
    component.createFlow();

    expect(routerSpy.navigate).toHaveBeenCalledWith([
      '/admin/flows/create'
    ]);
  });

  it('should navigate to edit flow', () => {
    component.editFlow({ id_flow: 10 } as any);

    expect(routerSpy.navigate).toHaveBeenCalledWith([
      '/admin/flows/edit',
      10
    ]);
  });
});