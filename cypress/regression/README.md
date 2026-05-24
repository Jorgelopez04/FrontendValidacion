# Pruebas de Regresión (Regression)

Aseguran que cambios y actualizaciones futuras no rompan la funcionalidad existente. Validan compatibilidad hacia atrás.

## Archivos de Pruebas

### 1. **products-regression.cy.ts**
Pruebas de regresión para ProductsService:
- ✅ Estructura esperada de respuesta Product
- ✅ Tipos de datos correctos
- ✅ ResponseDto con estructura correcta
- ✅ Métodos retornan Observable
- ✅ URLs de API consistentes
- ✅ Campos opcionales vs requeridos
- ✅ Validación de id_product no nulo
- ✅ Paginación (máximo N productos)
- ✅ Filtrado por categoría
- ✅ Ordenamiento por nombre
- ✅ Consistencia en cache
- ✅ Invalidación de cache
- ✅ Manejo de respuestas vacías
- ✅ Mensajes de error claros
- ✅ Compatibilidad con versión anterior
- ✅ Aceptación de productos sin campos nuevos
- ✅ Integridad después de create
- ✅ Integridad después de update
- ✅ Integridad después de delete

### 2. **orders-regression.cy.ts**
Pruebas de regresión para OrdersService:
- ✅ Estructura esperada de Order
- ✅ Tipos de datos correctos
- ✅ ResponseDto con estructura correcta
- ✅ Estados de orden válidos
- ✅ Transiciones de estado válidas
- ✅ Información del cliente consistente
- ✅ Información mínima de cliente
- ✅ Formato de fecha consistente
- ✅ estimated_delivery_date opcional
- ✅ Validación de fechas lógicas
- ✅ Interface OrderWithProducts
- ✅ Compatibilidad sin productos
- ✅ Método getAll()
- ✅ Método getById()
- ✅ Método create()
- ✅ Método update()
- ✅ Paginación correcta
- ✅ Filtrado por estado
- ✅ Ordenamiento por fecha
- ✅ Integridad después de crear
- ✅ Integridad después de actualizar
- ✅ Manejo de lista vacía
- ✅ Mensaje de error legible

### 3. **tasks-regression.cy.ts**
Pruebas de regresión para TasksService:
- ✅ Estructura esperada de Task
- ✅ Tipos de datos correctos
- ✅ ResponseDto con estructura correcta
- ✅ Estados de tarea válidos
- ✅ Transiciones de estado válidas
- ✅ Relación con Product
- ✅ Relación con Employee
- ✅ Relación con Area
- ✅ Relación con State
- ✅ Secuencia única por producto
- ✅ Múltiples secuencias para diferentes productos
- ✅ Formato de fecha consistente
- ✅ start_date y end_date opcionales
- ✅ Validación de fechas lógicas
- ✅ Método getAssignedTasks()
- ✅ Método getTaskById()
- ✅ Método startTask()
- ✅ Método completeTask()
- ✅ Método getProductTasks()
- ✅ Método getAllTasks()
- ✅ Filtrado por empleado
- ✅ Filtrado por área
- ✅ Ordenamiento por secuencia
- ✅ Integridad después de crear
- ✅ Integridad después de actualizar
- ✅ Manejo de lista vacía
- ✅ Tareas sin relaciones completas

## Casos de Uso Validados

### Cambios Potenciales
- Agregar nuevos campos a modelos
- Cambiar formato de respuestas
- Modificar lógica de validación
- Actualizar transiciones de estado
- Cambiar estructura de IDs

### Compatibilidad
- Versión anterior de API
- Campos opcionales
- Relaciones opcionales
- Transiciones de estado
- Tipos de datos

## Ejecución

```bash
# Todas las pruebas de regresión
npm run cypress -- regression

# Prueba específica
npm run cypress -- regression/products-regression.cy.ts

# Modo watch (re-ejecuta en cambios)
npm run cypress -- regression --watch

# Con reporte
npm run cypress -- regression --reporter json --reporter-options reportDir=cypress/reports
```

## Estrategia de Regresión

1. **Before Each Deployment**
   ```bash
   npm run cypress -- regression
   ```

2. **After Schema Changes**
   - Verificar que estructura de datos sea retrocompatible
   - Ejecutar todo antes de merge

3. **After Service Updates**
   - Validar que respuestas mantienen formato
   - Verificar transiciones de estado

4. **Before Release**
   - Suite completa de regresión
   - Incluir en CI/CD pipeline

## Checklist de Regresión

- [ ] Estructura de datos no cambió
- [ ] Tipos de datos son iguales
- [ ] Campos opcionales siguen siendo opcionales
- [ ] Transiciones de estado son válidas
- [ ] URLs de API son consistentes
- [ ] Métodos retornan Observable
- [ ] Paginación funciona igual
- [ ] Filtrado funciona igual
- [ ] Ordenamiento funciona igual
- [ ] Cache funciona igual
- [ ] Error handling igual
- [ ] Integridad de datos después de CRUD

## Relación con Otras Pruebas

- **Component Tests**: Validan funcionalidad individual
- **Security Tests**: Validan seguridad de datos
- **Accessibility Tests**: Validan WCAG compliance
- **Regression Tests**: Validan compatibilidad hacia atrás

