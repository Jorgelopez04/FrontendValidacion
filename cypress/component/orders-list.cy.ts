import { OrdersList } from '../../src/app/pages/admin/orders/orders-list/orders-list';
import { of, throwError } from 'rxjs';
import { Order } from '../../src/app/core/models/order.model';
import { ResponseDto } from '../../src/app/core/models/response.dto';

describe('OrdersList Component - getAll()', () => {
  let component: OrdersList;
  let ordersService: any;
  let dialogMock: any;
  let routerMock: any;

  beforeEach(() => {
    // Mock services
    ordersService = { getAll: cy.stub() };
    dialogMock = { open: cy.stub() };
    routerMock = { navigate: cy.stub() };

    // Create component with mocked services
    component = new OrdersList(ordersService, dialogMock, routerMock);
  });

  it('debe cargar todas las órdenes correctamente', () => {
    // Arrange
    const mockOrders: Order[] = [
      {
        id_order: 1,
        state_name: 'En Proceso',
        customer_name: 'Juan Pérez',
        entry_date: '2025-05-10T08:30:00',
        estimated_delivery_date: '2025-05-20T17:00:00'
      },
      {
        id_order: 2,
        state_name: 'Completada',
        customer_name: 'María García',
        entry_date: '2025-05-05T10:15:00',
        estimated_delivery_date: '2025-05-15T17:00:00'
      }
    ];

    const mockResponse: ResponseDto<Order[]> = {
      statusCode: 200,
      message: 'Orders retrieved successfully',
      data: mockOrders
    };

    ordersService.getAll.returns(of(mockResponse));

    // Act
    component.loadOrders();

    // Assert
    expect(component.orders).to.deep.equal(mockOrders);
    expect(component.orders.length).to.equal(2);
    expect(component.isLoading).to.equal(false);
    expect(ordersService.getAll).to.have.been.calledOnce;
  });

  it('debe mostrar loading mientras carga órdenes', () => {
    // Arrange
    const mockResponse: ResponseDto<Order[]> = {
      statusCode: 200,
      message: 'Orders retrieved successfully',
      data: []
    };

    ordersService.getAll.returns(of(mockResponse));

    // Act
    component.isLoading = false;
    component.loadOrders();

    // Assert - después de completar
    expect(component.isLoading).to.equal(false);
  });

  it('debe manejar error cuando falla la carga de órdenes', () => {
    // Arrange
    const mockError = new Error('Error al cargar órdenes');
    ordersService.getAll.returns(throwError(() => mockError));

    // Act
    component.loadOrders();

    // Assert
    expect(ordersService.getAll).to.have.been.calledOnce;
  });

  it('debe inicializar con array vacío de órdenes', () => {
    // Assert
    expect(component.orders).to.deep.equal([]);
    expect(Array.isArray(component.orders)).to.be.true;
  });

  it('debe tener las columnas displayadas correctas', () => {
    // Assert
    expect(component.displayedColumns).to.contain('customer_name');
    expect(component.displayedColumns).to.contain('entry_date');
    expect(component.displayedColumns).to.contain('estimated_delivery_date');
    expect(component.displayedColumns).to.contain('state_name');
    expect(component.displayedColumns).to.contain('actions');
    expect(component.displayedColumns.length).to.equal(5);
  });

  it('debe llamar a loadOrders en ngOnInit', () => {
    // Arrange
    const loadOrdersSpy = cy.stub(component, 'loadOrders');

    // Act
    component.ngOnInit();

    // Assert
    expect(loadOrdersSpy).to.have.been.calledOnce;
  });

  it('debe mapear correctamente los datos de órdenes', () => {
    // Arrange
    const mockOrders: Order[] = [
      {
        id_order: 3,
        state_name: 'Pendiente',
        customer_name: 'Carlos López',
        entry_date: '2025-05-15T14:45:00',
        estimated_delivery_date: '2025-05-25T17:00:00'
      }
    ];

    const mockResponse: ResponseDto<Order[]> = {
      statusCode: 200,
      message: 'Orders retrieved successfully',
      data: mockOrders
    };

    ordersService.getAll.returns(of(mockResponse));

    // Act
    component.loadOrders();

    // Assert
    expect(component.orders[0].id_order).to.equal(3);
    expect(component.orders[0].customer_name).to.equal('Carlos López');
    expect(component.orders[0].state_name).to.equal('Pendiente');
  });

  it('debe retornar lista vacía cuando no hay órdenes', () => {
    // Arrange
    const mockResponse: ResponseDto<Order[]> = {
      statusCode: 200,
      message: 'Orders retrieved successfully',
      data: []
    };

    ordersService.getAll.returns(of(mockResponse));

    // Act
    component.loadOrders();

    // Assert
    expect(component.orders.length).to.equal(0);
  });

  it('debe desactivar loading al finalizar carga exitosa', () => {
    // Arrange
    const mockResponse: ResponseDto<Order[]> = {
      statusCode: 200,
      message: 'Orders retrieved successfully',
      data: []
    };

    ordersService.getAll.returns(of(mockResponse));
    component.isLoading = true;

    // Act
    component.loadOrders();

    // Assert
    expect(component.isLoading).to.equal(false);
  });
});
