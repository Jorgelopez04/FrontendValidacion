import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { EditFlow } from './edit-flow';
import { FlowsService } from '../../../../services/flows.service';
import { RolesService } from '../../../../services/roles.service';
import { ActivatedRoute, Router } from '@angular/router';

describe('EditFlow', () => {
  let component: EditFlow;
  let fixture: ComponentFixture<EditFlow>;

  let flowsSpy: jasmine.SpyObj<FlowsService>;
  let rolesSpy: jasmine.SpyObj<RolesService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const routeMock = {
    snapshot: {
      params: { id: 1 }
    }
  };

  beforeEach(async () => {
    flowsSpy = jasmine.createSpyObj('FlowsService', ['getById', 'update']);
    rolesSpy = jasmine.createSpyObj('RolesService', ['getAll']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [EditFlow],
      providers: [
        { provide: FlowsService, useValue: flowsSpy },
        { provide: RolesService, useValue: rolesSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: routeMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditFlow);
    component = fixture.componentInstance;
  });

  it('should load flow and roles on init', () => {
    rolesSpy.getAll.and.returnValue(of({ data: [] } as any));

    flowsSpy.getById.and.returnValue(
      of({
        data: {
          role: { id_role: 2 },
          sequence: 1
        }
      } as any)
    );

    fixture.detectChanges(); // ngOnInit

    expect(rolesSpy.getAll).toHaveBeenCalled();
    expect(flowsSpy.getById).toHaveBeenCalledWith(1);
    expect(component.isLoading).toBeFalse();
  });

  it('should submit update flow', () => {
    flowsSpy.update.and.returnValue(of({} as any));

    component.flowForm.setValue({
      id_role: 2,
      sequence: 1
    });

    component.flowId = 1;

    component.onSubmit();

    expect(flowsSpy.update).toHaveBeenCalledWith(1, {
      id_role: 2,
      sequence: 1
    });

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/flows']);
  });

  it('should not submit invalid form', () => {
    component.flowForm.setValue({
      id_role: null,
      sequence: null
    });

    component.onSubmit();

    expect(flowsSpy.update).not.toHaveBeenCalled();
  });
});