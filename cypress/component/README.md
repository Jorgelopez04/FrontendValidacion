# Pruebas de Componentes - Guía de Ejecución

## Servicios Testeados

### 1. **ProductsService.getAll()** + **ProductsService.getById()**
Archivo: `cypress/component/products.cy.ts`

#### Casos de Prueba:
- ✅ Obtener todos los productos correctamente
- ✅ Manejar error cuando el servidor no está disponible
- ✅ Retornar lista vacía cuando no hay productos
- ✅ Hacer request GET a la URL correcta
- ✅ Mapear correctamente los datos del producto
- ✅ Backend service `findOne()` / `getById()` devuelve producto por ID
- ✅ Manejar error 404 cuando el producto no existe
- ✅ Backend service `create()` crea un producto correctamente
- ✅ Manejar error 400 en creación de producto inválido
- ✅ Backend service `update()` actualiza un producto correctamente
- ✅ Manejar error 400 en actualización de producto inválida

**Endpoints**:
- `GET /api/products`
- `GET /api/products/{id}`
- `POST /api/products`
- `PATCH /api/products/{id}`

**Respuesta Mock (getAll):**
```json
{
  "statusCode": 200,
  "message": "Products retrieved successfully",
  "data": [
    {
      "id_product": 1,
      "name": "Almohada Personalizada",
      "customized": 1,
      "category_name": "Textiles",
      "state_name": "En Proceso"
    }
  ]
}
```

**Respuesta Mock (getById):**
```json
{
  "statusCode": 200,
  "message": "Product retrieved successfully",
  "data": {
    "id_product": 1,
    "name": "Almohada Personalizada",
    "customized": 1,
    "category_name": "Textiles",
    "state_name": "En Proceso"
  }
}
```

---

### 2. **OrdersService.getAll()**
Archivo: `cypress/component/orders-list.cy.ts`

#### Casos de Prueba:
- ✅ Cargar todas las órdenes correctamente
- ✅ Mostrar loading mientras carga órdenes
- ✅ Manejar error cuando falla la carga
- ✅ Inicializar con array vacío
- ✅ Tener columnas displayadas correctas
- ✅ Llamar a loadOrders en ngOnInit
- ✅ Mapear correctamente datos de órdenes
- ✅ Retornar lista vacía cuando no hay órdenes
- ✅ Desactivar loading al finalizar

**Endpoint**: `GET /api/orders/all`

**Respuesta Mock:**
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": [
    {
      "id_order": 1,
      "state_name": "En Proceso",
      "customer_name": "Juan Pérez",
      "entry_date": "2025-05-10T08:30:00",
      "estimated_delivery_date": "2025-05-20T17:00:00"
    }
  ]
}
```

---

### 3. **TasksService (EmployeeTasks Component)**
Archivo: `cypress/component/employee-tasks.cy.ts`

#### Casos de Prueba por Servicio:

**a) TasksService.getAssignedTasks()**
- ✅ Obtener tareas asignadas correctamente
- ✅ Manejar lista vacía de tareas
- ✅ Manejar error en getAssignedTasks

**b) TasksService.createTask()**
- ✅ Crear una tarea correctamente
- ✅ Manejar error 400 en payload inválido

**c) TasksService.startTask()**
- ✅ Iniciar una tarea correctamente
- ✅ Manejar error 404 cuando la tarea no existe

**d) TasksService.completeTask()**
- ✅ Completar una tarea correctamente
- ✅ Manejar error 404 cuando la tarea no existe

**e) TasksService.updateCascadingStates()**
- ✅ Actualizar estados en cascada correctamente
- ✅ Manejar error 400 cuando el estado es inválido

**f) TasksService.assignEmployee()**
- ✅ Asignar un empleado a una tarea correctamente
- ✅ Manejar error 404 cuando la tarea no existe

**g) TasksService.findAssignedTasks()**
- ✅ Encontrar tareas asignadas con filtros correctamente
- ✅ Manejar error 400 cuando los filtros son inválidos

**h) TasksService.findAll()**
- ✅ Encontrar todas las tareas con filtros correctamente
- ✅ Retornar lista vacía cuando no hay tareas que coincidan
- ✅ Manejar error 400 cuando los filtros son inválidos

**i) TasksService.findById()**
- ✅ Encontrar una tarea por ID correctamente
- ✅ Encontrar una tarea sin filtros adicionales
- ✅ Manejar error 404 cuando la tarea no existe

**j) TasksService.findById()**
- ✅ Encontrar una tarea por ID correctamente
- ✅ Encontrar una tarea sin filtros adicionales
- ✅ Manejar error 404 cuando la tarea no existe

**k) OrdersService.createOrder()**
- ✅ Crear una orden correctamente
- ✅ Manejar error 400 cuando los datos son inválidos
- ✅ Manejar error 409 cuando hay conflicto (cliente no existe)

**l) ProductsService.getAll()**
- ✅ Obtener todos los productos correctamente
- ✅ Retornar lista vacía cuando no hay productos
- ✅ Manejar error en getAll

**m) OrdersService.updateOrder()**
- ✅ Actualizar una orden correctamente
- ✅ Manejar error 400 cuando los datos son inválidos
- ✅ Manejar error 404 cuando la orden no existe

**n) TasksService.findPreviousTask()**
- ✅ Encontrar la tarea previa correctamente
- ✅ Manejar error 404 cuando no existe tarea previa

**o) TasksService.getProductTasks()**
- ✅ Obtener tareas de un producto específico

**Endpoints**:
- `POST /api/tasks`
- `PATCH /api/tasks/{id}/start`
- `PATCH /api/tasks/{id}/complete`
- `PATCH /api/tasks/{id}/cascading-states`
- `PATCH /api/tasks/{id}/assign-employee`
- `POST /api/tasks/find-assigned`
- `POST /api/tasks/find-all`
- `GET /api/tasks/find-previous/{id}`
- `POST /api/tasks/find-by-id/{id}`
- `POST /api/orders/create-order`
- `PATCH /api/orders/{id}/update-order`
- `GET /api/tasks/assigned`
- `GET /api/products`
- `GET /api/tasks/{id}/product-tasks`
- `POST /api/tasks`
- `GET /api/orders/all`

---

## Cómo Ejecutar las Pruebas

### Ejecutar todas las pruebas de componentes:
```bash
npm run cypress -- --component
```

### Ejecutar pruebas específicas:

**Solo ProductsService:**
```bash
npm run cypress -- --component cypress/component/products.cy.ts
```

**Solo OrdersService:**
```bash
npm run cypress -- --component cypress/component/orders-list.cy.ts
```

**Solo EmployeeTasks:**
```bash
npm run cypress -- --component cypress/component/employee-tasks.cy.ts
```

**Solo TasksService.createTask:**
```bash
npm run cypress -- --component cypress/component/tasks.cy.ts
```

### Modo Headless (CI/CD):
```bash
npm run cypress -- --component --headless
```

### Con reporte de coverage:
```bash
npm run cypress -- --component --code-coverage
```

---

## Estructura de Fixtures

Las pruebas utilizan fixtures mockeadas en `cypress/fixtures/`:

- **products.json** - Datos de productos
- **orders.json** - Datos de órdenes
- **tasks.json** - Datos de tareas

---

## Validaciones Principales

### Products
- ID del producto
- Nombre y descripción
- Categoría y estado
- Si está personalizado o no

### Orders
- ID de la orden
- Nombre del cliente
- Fecha de entrada y entrega estimada
- Estado de la orden

### Tasks
- ID de la tarea y producto
- Empleado asignado
- Área de trabajo
- Estado de progreso
- Fechas de inicio/fin

---

## Próximos Pasos

1. Instalar dependencias de Cypress si no lo has hecho:
   ```bash
   npm install cypress --save-dev
   npm install @cypress/schematic --save-dev
   ```

2. Ejecutar las pruebas desde el workspace `d:\Desktop\Frontend`

3. Revisar reportes en `coverage/` después de ejecutar

