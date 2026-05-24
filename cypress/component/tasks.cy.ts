import { TasksService } from '../../src/app/services/tasks.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../src/environments/environment';
import { ResponseDto } from '../../src/app/core/models/response.dto';
import { Task } from '../../src/app/core/models/task.model';

describe('TasksService - createTask()', () => {
  let service: TasksService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TasksService, provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(TasksService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe crear una tarea correctamente', () => {
    // Arrange
    const taskToCreate = {
      id_product: 1,
      id_employee: 1,
      id_area: 1,
      id_state: 1,
      sequence: 1,
      start_date: new Date('2025-06-01T08:00:00')
    };

    const mockResponse: ResponseDto<Task> = {
      statusCode: 201,
      message: 'Task created successfully',
      data: {
        id_task: 10,
        ...taskToCreate
      }
    };

    // Act
    service.createTask(taskToCreate).subscribe(response => {
      // Assert
      expect(response.statusCode).to.equal(201);
      expect(response.data.id_task).to.equal(10);
      expect(response.data.id_product).to.equal(1);
      expect(response.data.sequence).to.equal(1);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks`);
    expect(req.request.method).to.equal('POST');
    expect(req.request.body).to.deep.equal(taskToCreate);
    req.flush(mockResponse, { status: 201, statusText: 'Created' });
  });

  it('debe manejar error 400 cuando la tarea es inválida', () => {
    // Arrange
    const taskToCreate = {
      id_product: 0,
      id_employee: 0,
      id_area: 0,
      id_state: 0,
      sequence: 0
    };

    // Act & Assert
    service.createTask(taskToCreate).subscribe({
      next: () => fail('debería haber fallado'),
      error: (error) => {
        expect(error.status).to.equal(400);
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks`);
    expect(req.request.method).to.equal('POST');
    expect(req.request.body).to.deep.equal(taskToCreate);
    req.flush({ message: 'Invalid task payload' }, { status: 400, statusText: 'Bad Request' });
  });

  describe('TasksService.startTask() - Backend service startTask()', () => {
    it('debe iniciar una tarea correctamente', () => {
      // Arrange
      const taskId = 10;
      const mockResponse: ResponseDto<Task> = {
        statusCode: 200,
        message: 'Task started successfully',
        data: {
          id_task: taskId,
          id_product: 1,
          id_employee: 1,
          id_area: 1,
          id_state: 2,
          sequence: 1,
          start_date: new Date('2025-06-01T09:00:00')
        }
      };

      // Act
      service.startTask(taskId).subscribe(response => {
        // Assert
        expect(response.statusCode).to.equal(200);
        expect(response.data.id_task).to.equal(taskId);
        expect(response.data.id_state).to.equal(2);
        expect(response.data.start_date).to.not.be.null;
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/tasks/${taskId}/start`);
      expect(req.request.method).to.equal('PATCH');
      req.flush(mockResponse);
    });

    it('debe manejar error 404 cuando la tarea no existe', () => {
      // Arrange
      const taskId = 999;

      // Act & Assert
      service.startTask(taskId).subscribe({
        next: () => fail('debería haber fallado'),
        error: (error) => {
          expect(error.status).to.equal(404);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/tasks/${taskId}/start`);
      expect(req.request.method).to.equal('PATCH');
      req.flush('Task not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('TasksService.completeTask() - Backend service completeTask()', () => {
    it('debe completar una tarea correctamente', () => {
      // Arrange
      const taskId = 10;
      const mockResponse: ResponseDto<Task> = {
        statusCode: 200,
        message: 'Task completed successfully',
        data: {
          id_task: taskId,
          id_product: 1,
          id_employee: 1,
          id_area: 1,
          id_state: 3,
          sequence: 1,
          start_date: new Date('2025-06-01T09:00:00'),
          end_date: new Date('2025-06-01T17:00:00')
        }
      };

      // Act
      service.completeTask(taskId).subscribe(response => {
        // Assert
        expect(response.statusCode).to.equal(200);
        expect(response.data.id_task).to.equal(taskId);
        expect(response.data.id_state).to.equal(3);
        expect(response.data.end_date).to.not.be.null;
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/tasks/${taskId}/complete`);
      expect(req.request.method).to.equal('PATCH');
      req.flush(mockResponse);
    });

    it('debe manejar error 404 cuando la tarea no existe', () => {
      // Arrange
      const taskId = 999;

      // Act & Assert
      service.completeTask(taskId).subscribe({
        next: () => fail('debería haber fallado'),
        error: (error) => {
          expect(error.status).to.equal(404);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/tasks/${taskId}/complete`);
      expect(req.request.method).to.equal('PATCH');
      req.flush('Task not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('TasksService.updateCascadingStates() - Backend service updateCascadingStates()', () => {
    it('debe actualizar estados en cascada correctamente', () => {
      // Arrange
      const taskId = 5;
      const stateUpdate = {
        id_state: 3,
        updateDependents: true
      };

      const mockResponse: ResponseDto<Task[]> = {
        statusCode: 200,
        message: 'Cascading states updated successfully',
        data: [
          {
            id_task: taskId,
            id_product: 1,
            id_employee: 1,
            id_area: 1,
            id_state: 3,
            sequence: 1,
            start_date: new Date('2025-06-01T09:00:00'),
            end_date: new Date('2025-06-01T17:00:00')
          },
          {
            id_task: 6,
            id_product: 1,
            id_employee: 2,
            id_area: 2,
            id_state: 2,
            sequence: 2,
            start_date: new Date('2025-06-02T09:00:00')
          }
        ]
      };

      // Act
      service.updateCascadingStates(taskId, stateUpdate).subscribe(response => {
        // Assert
        expect(response.statusCode).to.equal(200);
        expect(response.data.length).to.equal(2);
        expect(response.data[0].id_task).to.equal(taskId);
        expect(response.data[0].id_state).to.equal(3);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/tasks/${taskId}/cascading-states`);
      expect(req.request.method).to.equal('PATCH');
      expect(req.request.body).to.deep.equal(stateUpdate);
      req.flush(mockResponse);
    });

    it('debe manejar error 400 cuando el estado es inválido', () => {
      // Arrange
      const taskId = 5;
      const stateUpdate = {
        id_state: 0,
        updateDependents: true
      };

      // Act & Assert
      service.updateCascadingStates(taskId, stateUpdate).subscribe({
        next: () => fail('debería haber fallado'),
        error: (error) => {
          expect(error.status).to.equal(400);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/tasks/${taskId}/cascading-states`);
      expect(req.request.method).to.equal('PATCH');
      expect(req.request.body).to.deep.equal(stateUpdate);
      req.flush({ message: 'Invalid state update' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('TasksService.assignEmployee() - Backend service method', () => {
    it('debe asignar un empleado a una tarea exitosamente', () => {
      // Arrange
      const taskId = 3;
      const employeeAssignment = {
        id_employee: 5
      };
      const mockResponse: ResponseDto<Task> = {
        statusCode: 200,
        message: 'Employee assigned successfully',
        data: {
          id_task: taskId,
          id_product: 1,
          id_employee: 5,
          id_area: 1,
          id_state: 1,
          sequence: 1,
          start_date: new Date('2025-06-01T09:00:00')
        }
      };

      // Act
      service.assignEmployee(taskId, employeeAssignment).subscribe(response => {
        // Assert
        expect(response.statusCode).to.equal(200);
        expect(response.data.id_task).to.equal(taskId);
        expect(response.data.id_employee).to.equal(5);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/tasks/${taskId}/assign-employee`);
      expect(req.request.method).to.equal('PATCH');
      expect(req.request.body).to.deep.equal(employeeAssignment);
      req.flush(mockResponse);
    });

    it('debe manejar error 404 cuando la tarea no existe', () => {
      // Arrange
      const taskId = 999;
      const employeeAssignment = {
        id_employee: 5
      };

      // Act & Assert
      service.assignEmployee(taskId, employeeAssignment).subscribe({
        next: () => fail('debería haber fallado'),
        error: (error) => {
          expect(error.status).to.equal(404);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/tasks/${taskId}/assign-employee`);
      expect(req.request.method).to.equal('PATCH');
      req.flush({ message: 'Task not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('TasksService.findAssignedTasks() - Backend service method', () => {
    it('debe encontrar tareas asignadas con filtros correctamente', () => {
      // Arrange
      const filters = {
        id_state: 1,
        id_area: 2
      };
      const mockResponse: ResponseDto<Task[]> = {
        statusCode: 200,
        message: 'Assigned tasks found',
        data: [
          {
            id_task: 2,
            id_product: 1,
            id_employee: 3,
            id_area: 2,
            id_state: 1,
            sequence: 2,
            start_date: new Date('2025-06-02T09:00:00')
          },
          {
            id_task: 5,
            id_product: 2,
            id_employee: 4,
            id_area: 2,
            id_state: 1,
            sequence: 1,
            start_date: new Date('2025-06-03T09:00:00')
          }
        ]
      };

      // Act
      service.findAssignedTasks(filters).subscribe(response => {
        // Assert
        expect(response.statusCode).to.equal(200);
        expect(response.data.length).to.equal(2);
        expect(response.data[0].id_area).to.equal(2);
        expect(response.data[1].id_state).to.equal(1);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/tasks/find-assigned`);
      expect(req.request.method).to.equal('POST');
      expect(req.request.body).to.deep.equal(filters);
      req.flush(mockResponse);
    });

    it('debe manejar error 400 cuando los filtros son inválidos', () => {
      // Arrange
      const filters = {
        id_state: -1,
        id_area: null
      };

      // Act & Assert
      service.findAssignedTasks(filters).subscribe({
        next: () => fail('debería haber fallado'),
        error: (error) => {
          expect(error.status).to.equal(400);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/tasks/find-assigned`);
      expect(req.request.method).to.equal('POST');
      req.flush({ message: 'Invalid filter parameters' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('TasksService.findAll() - Backend service method', () => {
    it('debe encontrar todas las tareas con filtros correctamente', () => {
      // Arrange
      const filters = {
        id_product: 1,
        id_state: 2,
        limit: 10,
        offset: 0
      };
      const mockResponse: ResponseDto<Task[]> = {
        statusCode: 200,
        message: 'Tasks found',
        data: [
          {
            id_task: 1,
            id_product: 1,
            id_employee: 1,
            id_area: 1,
            id_state: 2,
            sequence: 1,
            start_date: new Date('2025-06-01T09:00:00')
          },
          {
            id_task: 3,
            id_product: 1,
            id_employee: 2,
            id_area: 2,
            id_state: 2,
            sequence: 2,
            start_date: new Date('2025-06-02T09:00:00')
          },
          {
            id_task: 5,
            id_product: 1,
            id_employee: 3,
            id_area: 1,
            id_state: 2,
            sequence: 3,
            start_date: new Date('2025-06-03T09:00:00')
          }
        ]
      };

      // Act
      service.findAll(filters).subscribe(response => {
        // Assert
        expect(response.statusCode).to.equal(200);
        expect(response.data.length).to.equal(3);
        expect(response.data[0].id_product).to.equal(1);
        expect(response.data.every(task => task.id_state === 2)).to.be.true;
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/tasks/find-all`);
      expect(req.request.method).to.equal('POST');
      expect(req.request.body).to.deep.equal(filters);
      req.flush(mockResponse);
    });

    it('debe retornar lista vacía cuando no hay tareas que coincidan con los filtros', () => {
      // Arrange
      const filters = {
        id_product: 999,
        id_state: 5
      };
      const mockResponse: ResponseDto<Task[]> = {
        statusCode: 200,
        message: 'No tasks found',
        data: []
      };

      // Act
      service.findAll(filters).subscribe(response => {
        // Assert
        expect(response.statusCode).to.equal(200);
        expect(response.data.length).to.equal(0);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/tasks/find-all`);
      expect(req.request.method).to.equal('POST');
      req.flush(mockResponse);
    });

    it('debe manejar error 400 cuando los filtros son inválidos', () => {
      // Arrange
      const filters = {
        limit: -1,
        offset: 'invalid'
      };

      // Act & Assert
      service.findAll(filters).subscribe({
        next: () => fail('debería haber fallado'),
        error: (error) => {
          expect(error.status).to.equal(400);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/tasks/find-all`);
      expect(req.request.method).to.equal('POST');
      req.flush({ message: 'Invalid parameters' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('TasksService.findPreviousTask() - Backend service method', () => {
    it('debe encontrar la tarea previa correctamente', () => {
      // Arrange
      const taskId = 5;
      const mockResponse: ResponseDto<Task> = {
        statusCode: 200,
        message: 'Previous task found',
        data: {
          id_task: 4,
          id_product: 1,
          id_employee: 2,
          id_area: 1,
          id_state: 2,
          sequence: 1,
          start_date: new Date('2025-05-30T09:00:00'),
          end_date: new Date('2025-05-30T17:00:00')
        }
      };

      // Act
      service.findPreviousTask(taskId).subscribe(response => {
        // Assert
        expect(response.statusCode).to.equal(200);
        expect(response.data.id_task).to.equal(4);
        expect(response.data.id_state).to.equal(2);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/tasks/find-previous/${taskId}`);
      expect(req.request.method).to.equal('GET');
      req.flush(mockResponse);
    });

    it('debe manejar error 404 cuando no existe tarea previa', () => {
      // Arrange
      const taskId = 1;

      // Act & Assert
      service.findPreviousTask(taskId).subscribe({
        next: () => fail('debería haber fallado'),
        error: (error) => {
          expect(error.status).to.equal(404);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/tasks/find-previous/${taskId}`);
      expect(req.request.method).to.equal('GET');
      req.flush({ message: 'Previous task not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('TasksService.findById() - Backend service method', () => {
    it('debe encontrar una tarea por ID correctamente', () => {
      // Arrange
      const taskId = 3;
      const filters = {
        includeDetails: true
      };
      const mockResponse: ResponseDto<Task> = {
        statusCode: 200,
        message: 'Task found',
        data: {
          id_task: taskId,
          id_product: 2,
          id_employee: 2,
          id_area: 1,
          id_state: 2,
          sequence: 2,
          start_date: new Date('2025-06-02T09:00:00'),
          end_date: new Date('2025-06-02T17:00:00')
        }
      };

      // Act
      service.findById(taskId, filters).subscribe(response => {
        // Assert
        expect(response.statusCode).to.equal(200);
        expect(response.data.id_task).to.equal(taskId);
        expect(response.data.id_employee).to.equal(2);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/tasks/find-by-id/${taskId}`);
      expect(req.request.method).to.equal('POST');
      expect(req.request.body).to.deep.equal(filters);
      req.flush(mockResponse);
    });

    it('debe encontrar una tarea por ID sin filtros adicionales', () => {
      // Arrange
      const taskId = 1;
      const mockResponse: ResponseDto<Task> = {
        statusCode: 200,
        message: 'Task found',
        data: {
          id_task: taskId,
          id_product: 1,
          id_employee: 1,
          id_area: 1,
          id_state: 1,
          sequence: 1,
          start_date: new Date('2025-06-01T09:00:00')
        }
      };

      // Act
      service.findById(taskId).subscribe(response => {
        // Assert
        expect(response.statusCode).to.equal(200);
        expect(response.data.id_task).to.equal(taskId);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/tasks/find-by-id/${taskId}`);
      expect(req.request.method).to.equal('POST');
      expect(req.request.body).to.deep.equal({});
      req.flush(mockResponse);
    });

    it('debe manejar error 404 cuando la tarea no existe', () => {
      // Arrange
      const taskId = 999;

      // Act & Assert
      service.findById(taskId).subscribe({
        next: () => fail('debería haber fallado'),
        error: (error) => {
          expect(error.status).to.equal(404);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/tasks/find-by-id/${taskId}`);
      expect(req.request.method).to.equal('POST');
      req.flush({ message: 'Task not found' }, { status: 404, statusText: 'Not Found' });
    });
  });
});
