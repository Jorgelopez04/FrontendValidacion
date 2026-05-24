# Pruebas de Seguridad (Security)

Validación de seguridad de datos, prevención de inyecciones, XSS, y protección de información sensible.

## Archivos de Pruebas

### 1. **products-security.cy.ts**
Pruebas de seguridad para servicio de productos:
- ✅ Protección contra XSS en nombres y descripciones
- ✅ Escape de HTML peligroso
- ✅ Validación de URLs de fotos
- ✅ Validación de IDs numéricos
- ✅ Validación de nombre no vacío
- ✅ Validación de formato de dimensions
- ✅ Validación de campo customized (0 o 1)
- ✅ No exponer detalles de BD en errores
- ✅ Transmisión HTTPS
- ✅ Limitación de cantidad de productos
- ✅ Headers de seguridad (X-Content-Type-Options, X-Frame-Options)
- ✅ Validación de CORS
- ✅ Prevención de SQL injection
- ✅ Validación de parámetros de filtro
- ✅ Validación de token JWT
- ✅ Rate limiting

### 2. **orders-security.cy.ts**
Pruebas de seguridad para servicio de órdenes:
- ✅ Protección de datos de clientes
- ✅ Validación de pertenencia cliente-orden
- ✅ Sanitización de nombre de cliente
- ✅ Validación de formato de email
- ✅ Validación de estados permitidos
- ✅ Validación de transiciones de estado
- ✅ Validación de formato de fecha
- ✅ Validación de fechas lógicas
- ✅ Prevención de SQL injection
- ✅ Validación de ID de orden
- ✅ Autorización: solo cliente vea sus órdenes
- ✅ Admin puede ver todas las órdenes
- ✅ Rechazo de acceso a órdenes de otros
- ✅ No retornar datos bancarios
- ✅ Uso de HTTPS
- ✅ Headers de seguridad CORS
- ✅ Validación de montos positivos
- ✅ Límite de monto máximo

### 3. **tasks-security.cy.ts**
Pruebas de seguridad para servicio de tareas:
- ✅ Protección de email de empleado
- ✅ Empleado solo vea sus tareas
- ✅ Sanitización de nombre de empleado
- ✅ Restricción de reasignación
- ✅ Solo admin/supervisor asigne tareas
- ✅ Validación de id_employee numérico
- ✅ Validación de estados de tarea
- ✅ Validación de transiciones de estado
- ✅ Prevención de marcar sin iniciar
- ✅ Validación de id_area numérico
- ✅ Validación de existencia de área
- ✅ Validación de id_product numérico
- ✅ Sanitización de descripción de producto
- ✅ No exponer precio del producto
- ✅ Validación de secuencia positiva
- ✅ Unicidad de secuencia por producto
- ✅ Validación de fechas
- ✅ Fechas lógicas (inicio antes de fin)
- ✅ Prevención de fechas futuras lejanas
- ✅ Prevención de SQL injection
- ✅ Validación de parámetros numéricos
- ✅ Autorización: permisos de actualización
- ✅ Autorización: permiso de completar
- ✅ Prevención de acceso a tareas privadas
- ✅ Uso de HTTPS
- ✅ Validación de token JWT

## Amenazas de Seguridad Validadas

### XSS (Cross-Site Scripting)
- Inyección de scripts en nombres
- Inyección de scripts en descripciones
- Inyección en atributos de eventos

### SQL Injection
- Caracteres especiales en búsqueda
- Intentos de drop table
- UNION-based injection

### Autorización
- Acceso no autorizado a datos
- Eskalación de privilegios
- Modificación sin permisos

### Validación de Datos
- Tipos incorrectos
- Rangos inválidos
- Formatos incorrectos
- Nulos inesperados

### Transmisión de Datos
- HTTPS obligatorio
- Headers de seguridad
- CORS validation

## Ejecución

```bash
# Todas las pruebas de seguridad
npm run cypress -- security

# Prueba específica
npm run cypress -- security/products-security.cy.ts

# Con reporte
npm run cypress -- security --reporter json --reporter-options reportDir=cypress/reports
```

## Checklist de Seguridad

- [ ] Todos los inputs están validados
- [ ] No hay SQL injection posible
- [ ] No hay XSS en nombres/descripciones
- [ ] IDs son numéricos
- [ ] Estados son valores permitidos
- [ ] Fechas son lógicas
- [ ] Autorización funciona correctamente
- [ ] HTTPS en todas las llamadas
- [ ] Headers de seguridad presentes
- [ ] CORS configurado
- [ ] Datos sensibles protegidos
- [ ] Rate limiting activo
- [ ] JWT validado

