import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { OrdersService } from '../../src/app/services/orders.service';
import { ResponseDto } from '../../src/app/core/models/response.dto';
import { Order } from '../../src/app/core/models/order.model';
import { environment } from '../../src/environments/environment';
import { provideHttpClient } from '@angular/common/http';

describe('OrdersService', () => {
  let service: OrdersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrdersService, provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(OrdersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('OrdersService.createOrder() - Backend service method', () => {
    it('debe crear una orden correctamente', () => {
      // Arrange
      const orderData = {
        customer_id: 1,
        state_name: 'Pendiente',
        entry_date: new Date('2025-06-01T09:00:00'),
        estimated_delivery_date: new Date('2025-06-10T17:00:00'),
        notes: 'Pedido urgente'
      };
      const mockResponse: ResponseDto<Order> = {
        statusCode: 201,
        message: 'Order created successfully',
        data: {
          id_order: 10,
          customer_name: 'Cliente Nuevo',
          state_name: 'Pendiente',
          entry_date: '2025-06-01T09:00:00',
          estimated_delivery_date: '2025-06-10T17:00:00'
        }
      };

      // Act
      service.createOrder(orderData).subscribe(response => {
        // Assert
        expect(response.statusCode).to.equal(201);
        expect(response.data.id_order).to.equal(10);
        expect(response.data.state_name).to.equal('Pendiente');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/orders/create-order`);
      expect(req.request.method).to.equal('POST');
      expect(req.request.body).to.deep.equal(orderData);
      req.flush(mockResponse);
    });

    it('debe manejar error 400 cuando los datos de la orden son inválidos', () => {
      // Arrange
      const orderData = {
        customer_id: null,
        entry_date: 'invalid-date'
      };

      // Act & Assert
      service.createOrder(orderData).subscribe({
        next: () => fail('debería haber fallado'),
        error: (error) => {
          expect(error.status).to.equal(400);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/orders/create-order`);
      expect(req.request.method).to.equal('POST');
      req.flush({ message: 'Invalid order data' }, { status: 400, statusText: 'Bad Request' });
    });

    it('debe manejar error 409 cuando hay conflicto (cliente no existe)', () => {
      // Arrange
      const orderData = {
        customer_id: 999,
        state_name: 'Pendiente'
      };

      // Act & Assert
      service.createOrder(orderData).subscribe({
        next: () => fail('debería haber fallado'),
        error: (error) => {
          expect(error.status).to.equal(409);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/orders/create-order`);
      expect(req.request.method).to.equal('POST');
      req.flush({ message: 'Customer not found' }, { status: 409, statusText: 'Conflict' });
    });
  });

  describe('OrdersService.updateOrder() - Backend service method', () => {
    it('debe actualizar una orden correctamente', () => {
      // Arrange
      const orderId = 10;
      const orderData = {
        state_name: 'Completada',
        estimated_delivery_date: '2025-06-12T17:00:00'
      };
      const mockResponse: ResponseDto<Order> = {
        statusCode: 200,
        message: 'Order updated successfully',
        data: {
          id_order: orderId,
          state_name: 'Completada',
          customer_name: 'Cliente Nuevo',
          entry_date: '2025-06-01T09:00:00',
          estimated_delivery_date: '2025-06-12T17:00:00'
        }
      };

      // Act
      service.updateOrder(orderId, orderData).subscribe(response => {
        // Assert
        expect(response.statusCode).to.equal(200);
        expect(response.data.id_order).to.equal(orderId);
        expect(response.data.state_name).to.equal('Completada');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/orders/${orderId}/update-order`);
      expect(req.request.method).to.equal('PATCH');
      expect(req.request.body).to.deep.equal(orderData);
      req.flush(mockResponse);
    });

    it('debe manejar error 400 cuando los datos de actualización son inválidos', () => {
      // Arrange
      const orderId = 10;
      const orderData = {
        estimated_delivery_date: 'invalid-date'
      };

      // Act & Assert
      service.updateOrder(orderId, orderData).subscribe({
        next: () => fail('debería haber fallado'),
        error: (error) => {
          expect(error.status).to.equal(400);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/orders/${orderId}/update-order`);
      expect(req.request.method).to.equal('PATCH');
      req.flush({ message: 'Invalid update data' }, { status: 400, statusText: 'Bad Request' });
    });

    it('debe manejar error 404 cuando la orden no existe', () => {
      // Arrange
      const orderId = 999;
      const orderData = {
        state_name: 'Completada'
      };

      // Act & Assert
      service.updateOrder(orderId, orderData).subscribe({
        next: () => fail('debería haber fallado'),
        error: (error) => {
          expect(error.status).to.equal(404);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/orders/${orderId}/update-order`);
      expect(req.request.method).to.equal('PATCH');
      req.flush({ message: 'Order not found' }, { status: 404, statusText: 'Not Found' });
    });
  });
});
