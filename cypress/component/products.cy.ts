import { ProductsService } from '../../src/app/services/products.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../src/environments/environment';
import { ResponseDto } from '../../src/app/core/models/response.dto';
import { Product } from '../../src/app/core/models/product.model';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductsService, provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe obtener todos los productos correctamente', () => {
    // Arrange
    const mockResponse: ResponseDto<Product[]> = {
      statusCode: 200,
      message: 'Products retrieved successfully',
      data: [
        {
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
        {
          id_product: 2,
          name: 'Taza Personalizada',
          customized: 1,
          ref_photo: 'photo_2.jpg',
          dimensions: '10x10cm',
          fabric: 'Cerámica',
          description: 'Taza con diseño personalizado',
          category_name: 'Accesorios',
          order_id: 1,
          state_name: 'Completado',
          customized_label: 'Sí'
        }
      ]
    };

    // Act
    service.getAll().subscribe(response => {
      // Assert
      expect(response.statusCode).to.equal(200);
      expect(response.data.length).to.equal(2);
      expect(response.data[0].name).to.equal('Almohada Personalizada');
      expect(response.data[1].name).to.equal('Taza Personalizada');
      expect(response.data[0].customized).to.equal(1);
      expect(response.data[0].category_name).to.equal('Textiles');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products`);
    expect(req.request.method).to.equal('GET');
    expect(req.request.url).to.contain('/products');
    req.flush(mockResponse);
  });

  it('debe manejar error cuando el servidor no está disponible', () => {
    // Act & Assert
    service.getAll().subscribe({
      next: () => fail('debería haber fallado'),
      error: (error) => {
        expect(error.status).to.equal(500);
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products`);
    req.flush('Error del servidor', { status: 500, statusText: 'Server Error' });
  });

  it('debe retornar lista vacía cuando no hay productos', () => {
    // Arrange
    const mockResponse: ResponseDto<Product[]> = {
      statusCode: 200,
      message: 'Products retrieved successfully',
      data: []
    };

    // Act
    service.getAll().subscribe(response => {
      // Assert
      expect(response.data.length).to.equal(0);
      expect(Array.isArray(response.data)).to.be.true;
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products`);
    expect(req.request.method).to.equal('GET');
    expect(req.request.url).to.contain('/products');
    req.flush(mockResponse);
  });

  it('debe hacer request GET a la URL correcta', () => {
    // Act
    service.getAll().subscribe();

    // Assert
    const req = httpMock.expectOne(`${environment.apiUrl}/products`);
    expect(req.request.method).to.equal('GET');
    expect(req.request.url).to.contain('/products');
    req.flush({ statusCode: 200, message: '', data: [] });
  });

  it('debe mapear correctamente los datos del producto', () => {
    // Arrange
    const mockResponse: ResponseDto<Product[]> = {
      statusCode: 200,
      message: 'Products retrieved successfully',
      data: [
        {
          id_product: 3,
          name: 'Camiseta Estándar',
          customized: 0,
          ref_photo: 'photo_3.jpg',
          dimensions: 'M',
          fabric: '100% Algodón',
          description: 'Camiseta de color sólido',
          category_name: 'Ropa',
          order_id: 2,
          state_name: 'Pendiente',
          customized_label: 'No'
        }
      ]
    };

    // Act
    service.getAll().subscribe(response => {
      const product = response.data[0];
      
      // Assert
      expect(product.id_product).to.equal(3);
      expect(product.name).to.equal('Camiseta Estándar');
      expect(product.customized).to.equal(0);
      expect(product.category_name).to.equal('Ropa');
      expect(product.state_name).to.equal('Pendiente');
      expect(product.customized_label).to.equal('No');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products`);
    req.flush(mockResponse);
  });

  describe('ProductsService.getById() - Backend service findOne()', () => {
    it('debe obtener un producto por ID correctamente', () => {
      // Arrange
      const mockProduct: Product = {
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
      };

      const mockResponse: ResponseDto<Product> = {
        statusCode: 200,
        message: 'Product retrieved successfully',
        data: mockProduct
      };

      // Act
      service.getById(1).subscribe(response => {
        // Assert
        expect(response.statusCode).to.equal(200);
        expect(response.data.id_product).to.equal(1);
        expect(response.data.name).to.equal('Almohada Personalizada');
        expect(response.data.category_name).to.equal('Textiles');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/products/1`);
      expect(req.request.method).to.equal('GET');
      expect(req.request.url).to.contain('/products/1');
      req.flush(mockResponse);
    });

    it('debe manejar error 404 cuando el producto no existe', () => {
      // Act & Assert
      service.getById(999).subscribe({
        next: () => fail('debería haber fallado'),
        error: (error) => {
          expect(error.status).to.equal(404);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/products/999`);
      expect(req.request.method).to.equal('GET');
      req.flush('Product not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('ProductsService.create() - Backend service create()', () => {
    it('debe crear un producto correctamente', () => {
      // Arrange
      const productToCreate = {
        name: 'Manta Personalizada',
        customized: 1,
        ref_photo: 'photo_4.jpg',
        dimensions: '150x200cm',
        fabric: 'Fleece',
        description: 'Manta suave personalizada',
        category_name: 'Textiles',
        order_id: 2,
        state_name: 'Pendiente',
        customized_label: 'Sí'
      };

      const mockResponse: ResponseDto<Product> = {
        statusCode: 201,
        message: 'Product created successfully',
        data: {
          id_product: 4,
          ...productToCreate
        }
      };

      // Act
      service.create(productToCreate).subscribe(response => {
        // Assert
        expect(response.statusCode).to.equal(201);
        expect(response.data.id_product).to.equal(4);
        expect(response.data.name).to.equal('Manta Personalizada');
        expect(response.data.category_name).to.equal('Textiles');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/products`);
      expect(req.request.method).to.equal('POST');
      expect(req.request.body).to.deep.equal(productToCreate);
      req.flush(mockResponse, { status: 201, statusText: 'Created' });
    });

    it('debe manejar error 400 cuando la creación de producto es inválida', () => {
      // Arrange
      const productToCreate = {
        name: '',
        customized: 1,
        category_name: '',
        order_id: 0,
        state_name: '',
        customized_label: 'No'
      };

      // Act & Assert
      service.create(productToCreate).subscribe({
        next: () => fail('debería haber fallado'),
        error: (error) => {
          expect(error.status).to.equal(400);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/products`);
      expect(req.request.method).to.equal('POST');
      expect(req.request.body).to.deep.equal(productToCreate);
      req.flush({ message: 'Invalid product data' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('ProductsService.update() - Backend service update()', () => {
    it('debe actualizar un producto correctamente', () => {
      // Arrange
      const productUpdates = {
        name: 'Almohada Personalizada XL',
        customized: 1,
        ref_photo: 'photo_1_updated.jpg',
        dimensions: '70x70cm',
        fabric: 'Algodón orgánico',
        description: 'Almohada decorativa personalizada XL',
        category_name: 'Textiles',
        order_id: 1,
        state_name: 'En Proceso',
        customized_label: 'Sí'
      };

      const mockResponse: ResponseDto<Product> = {
        statusCode: 200,
        message: 'Product updated successfully',
        data: {
          id_product: 1,
          ...productUpdates
        }
      };

      // Act
      service.update(1, productUpdates).subscribe(response => {
        // Assert
        expect(response.statusCode).to.equal(200);
        expect(response.data.id_product).to.equal(1);
        expect(response.data.name).to.equal('Almohada Personalizada XL');
        expect(response.data.ref_photo).to.equal('photo_1_updated.jpg');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/products/1`);
      expect(req.request.method).to.equal('PATCH');
      expect(req.request.body).to.deep.equal(productUpdates);
      req.flush(mockResponse);
    });

    it('debe manejar error 400 cuando los datos de actualización son inválidos', () => {
      // Arrange
      const productUpdates = {
        name: '',
        customized: 1,
        category_name: '',
        order_id: 0,
        state_name: '',
        customized_label: 'No'
      };

      // Act & Assert
      service.update(1, productUpdates).subscribe({
        next: () => fail('debería haber fallado'),
        error: (error) => {
          expect(error.status).to.equal(400);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/products/1`);
      expect(req.request.method).to.equal('PATCH');
      expect(req.request.body).to.deep.equal(productUpdates);
      req.flush({ message: 'Invalid update payload' }, { status: 400, statusText: 'Bad Request' });
    });
  });
});
