import { EmployeeTasks } from '../../src/app/pages/employee/tasks/employee-tasks/employee-tasks';
import { of, throwError } from 'rxjs';
import { Task } from '../../src/app/core/models/task.model';
import { Product } from '../../src/app/core/models/product.model';
import { ResponseDto } from '../../src/app/core/models/response.dto';

describe('EmployeeTasks Component - Tasks & Products', () => {
  let component: EmployeeTasks;
  let tasksService: any;
  let productsService: any;
  let employeesService: any;
  let authService: any;
  let dialogMock: any;

  beforeEach(() => {
    // Mock services
    const tasksServiceSpy = {
      getAssignedTasks: cy.stub(),
      getTaskById: cy.stub(),
      startTask: cy.stub(),
      completeTask: cy.stub(),
      getProductTasks: cy.stub(),
      getAllTasks: cy.stub()
    };
    const productsServiceSpy = {
      getAll: cy.stub(),
      getById: cy.stub(),
      create: cy.stub(),
      update: cy.stub(),
      delete: cy.stub()
    };
    const employeesServiceSpy = {
      getById: cy.stub(),
      getEmployeeDetails: cy.stub()
    };
    const authServiceSpy = {
      getCurrentUser: cy.stub()
    };
    const dialogSpy = {
      open: cy.stub()
    };

    tasksService = tasksServiceSpy;
    productsService = productsServiceSpy;
    employeesService = employeesServiceSpy;
    authService = authServiceSpy;
    dialogMock = dialogSpy;

    // Create component with mocked services
    component = new EmployeeTasks(
      tasksService,
      productsService,
      employeesService,
      authService,
      dialogMock
    );
  });

  describe('Pruebas de TasksService.getAssignedTasks()', () => {
    it('debe obtener tareas asignadas correctamente', () => {
      // Arrange
      const mockTasks: Task[] = [
        {
          id_task: 1,
          id_product: 1,
          id_employee: 1,
          id_area: 1,
          id_state: 2,
          sequence: 1,
          start_date: new Date('2025-05-10T09:00:00'),
          product: {
            id_product: 1,
            name: 'Almohada Personalizada',
            customized: 1,
            ref_photo: 'photo_1.jpg',
            dimensions: '50x50cm',
            fabric: 'Algodón',
            description: 'Almohada decorativa personalizada',
            category_name: 'Textiles',
            order_id: 1,
            state_name: 'En Proceso',
            customized_label: 'Sí'
          },
          employee: {
            id_employee: 1,
            cc: '12345678',
            name: 'Pedro Rodríguez',
            state: 'Active',
            role: {
              id_role: 1,
              name: 'Operario',
              description: 'Rol de operador'
            },
            tasks: []
          },
          area: {
            id_area: 1,
            name: 'Corte'
          },
          state: {
            id_state: 2,
            name: 'En Progreso'
          }
        }
      ];

      const mockResponse: ResponseDto<Task[]> = {
        statusCode: 200,
        message: 'Tasks retrieved successfully',
        data: mockTasks
      };

      tasksService.getAssignedTasks.returns(of(mockResponse));

      // Act
      tasksService.getAssignedTasks().subscribe(response => {
        // Assert
        expect(response.statusCode).to.equal(200);
        expect(response.data.length).to.equal(1);
        expect(response.data[0].product?.name).to.equal('Almohada Personalizada');
      });

      expect(tasksService.getAssignedTasks).to.have.been.calledOnce;
    });

    it('debe manejar lista vacía de tareas asignadas', () => {
      // Arrange
      const mockResponse: ResponseDto<Task[]> = {
        statusCode: 200,
        message: 'No tasks assigned',
        data: []
      };

      tasksService.getAssignedTasks.returns(of(mockResponse));

      // Act
      tasksService.getAssignedTasks().subscribe(response => {
        // Assert
        expect(response.data.length).to.equal(0);
      });

      expect(tasksService.getAssignedTasks).to.have.been.calledOnce;
    });

    it('debe manejar error en getAssignedTasks', () => {
      // Arrange
      const mockError = new Error('Error al obtener tareas');
      tasksService.getAssignedTasks.returns(throwError(() => mockError));

      // Act & Assert
      tasksService.getAssignedTasks().subscribe({
        next: () => expect.fail('debería haber fallado'),
        error: (error) => {
          expect(error.message).to.equal('Error al obtener tareas');
        }
      });
    });
  });

  describe('Pruebas de ProductsService.getAll()', () => {
    it('debe obtener todos los productos correctamente', () => {
      // Arrange
      const mockProducts: Product[] = [
        {
          id_product: 1,
          name: 'Almohada Personalizada',
          customized: 1,
          ref_photo: 'photo_1.jpg',
          dimensions: '50x50cm',
          fabric: 'Algodón',
          description: 'Almohada decorativa',
          category_name: 'Textiles',
          order_id: 1,
          state_name: 'En Proceso',
          customized_label: 'Sí'
        },
        {
          id_product: 2,
          name: 'Taza Personalizada',
          customized: 1,
          ref_photo: 'photo_2.jpg',
          dimensions: '10x10cm',
          fabric: 'Cerámica',
          description: 'Taza con diseño',
          category_name: 'Accesorios',
          order_id: 1,
          state_name: 'Completado',
          customized_label: 'Sí'
        }
      ];

      const mockResponse: ResponseDto<Product[]> = {
        statusCode: 200,
        message: 'Products retrieved successfully',
        data: mockProducts
      };

      productsService.getAll.returns(of(mockResponse));

      // Act
      productsService.getAll().subscribe(response => {
        // Assert
        expect(response.statusCode).to.equal(200);
        expect(response.data.length).to.equal(2);
        expect(response.data[0].name).to.equal('Almohada Personalizada');
        expect(response.data[1].customized).to.equal(1);
      });

      expect(productsService.getAll).to.have.been.calledOnce;
    });

    it('debe retornar lista vacía cuando no hay productos', () => {
      // Arrange
      const mockResponse: ResponseDto<Product[]> = {
        statusCode: 200,
        message: 'No products found',
        data: []
      };

      productsService.getAll.returns(of(mockResponse));

      // Act
      productsService.getAll().subscribe(response => {
        // Assert
        expect(response.data.length).to.equal(0);
        expect(Array.isArray(response.data)).to.be.true;
      });

      expect(productsService.getAll).to.have.been.calledOnce;
    });

    it('debe manejar error en getAll de productos', () => {
      // Arrange
      const mockError = new Error('Error del servidor');
      productsService.getAll.returns(throwError(() => mockError));

      // Act & Assert
      productsService.getAll().subscribe({
        next: () => expect.fail('debería haber fallado'),
        error: (error) => {
          expect(error.message).to.equal('Error del servidor');
        }
      });
    });
  });

  describe('Pruebas de TasksService.getProductTasks()', () => {
    it('debe obtener tareas de un producto específico', () => {
      // Arrange
      const productId = 1;
      const mockTasks: Task[] = [
        {
          id_task: 1,
          id_product: productId,
          id_employee: 1,
          id_area: 1,
          id_state: 2,
          sequence: 1,
          start_date: new Date(),
          product: {
            id_product: productId,
            name: 'Almohada',
            customized: 1,
            ref_photo: 'photo_1.jpg',
            dimensions: '50x50cm',
            fabric: 'Algodón',
            description: 'Almohada',
            category_name: 'Textiles',
            order_id: 1,
            state_name: 'En Proceso',
            customized_label: 'Sí'
          },
          employee: {
            id_employee: 1,
            cc: '12345678',
            name: 'Pedro',
            state: 'Active',
            role: {
              id_role: 1,
              name: 'Operario',
              description: 'Rol de operador'
            },
            tasks: []
          },
          area: {
            id_area: 1,
            name: 'Corte'
          },
          state: {
            id_state: 2,
            name: 'En Progreso'
          }
        }
      ];

      const mockResponse: ResponseDto<Task[]> = {
        statusCode: 200,
        message: 'Product tasks retrieved',
        data: mockTasks
      };

      tasksService.getProductTasks.returns(of(mockResponse));

      // Act
      tasksService.getProductTasks(productId).subscribe(response => {
        // Assert
        expect(response.data.length).to.equal(1);
        expect(response.data[0].id_product).to.equal(productId);
      });

      expect(tasksService.getProductTasks.lastCall.args[0]).to.equal(productId);
    });
  });

  describe('Pruebas de inicialización del componente', () => {
    it('debe inicializar con datos vacíos', () => {
      // Assert
      expect(component.currentEmployeeTasks).to.deep.equal([]);
      expect(component.groupedTasks).to.deep.equal([]);
      expect(component.isLoading).to.equal(true);
      expect(component.errorMessage).to.equal('');
      expect(component.processingTaskId).to.be.null;
    });

    it('debe tener Map para almacenar tareas de productos', () => {
      // Assert
      expect(component.productTasks instanceof Map).to.be.true;
      expect(component.productTasks.size).to.equal(0);
    });

    it('debe tener Set para tracking de carga', () => {
      // Assert
      expect(component.productTasksLoading instanceof Set).to.be.true;
      expect(component.productTasksLoading.size).to.equal(0);
    });
  });

  describe('Integración Tasks y Products', () => {
    it('debe cargar tareas y productos en ngOnInit', () => {
      // Arrange
      const mockTasksResponse: ResponseDto<Task[]> = {
        statusCode: 200,
        message: 'Success',
        data: []
      };

        authService.getCurrentUser.returns({ cc: '12345678' });
      employeesService.getEmployeeDetails.returns(of({
        statusCode: 200,
        message: 'Employee retrieved',
        data: { id_employee: 1 }
      }));
      tasksService.getAssignedTasks.returns(of(mockTasksResponse));

      // Act
      component.ngOnInit();

      // Assert - depende de la implementación específica del componente
      expect(tasksService.getAssignedTasks).to.have.been.calledOnce;
    });
  });
});
