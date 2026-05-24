# Pruebas de Accesibilidad (Accessibility)

Validación WCAG 2.1 Level AA para garantizar que la aplicación sea accesible para todos los usuarios, incluyendo aquellos con discapacidades.

## Archivos de Pruebas

### 1. **products-accessibility.cy.ts**
Pruebas WCAG para componentes de productos:
- ✅ Tabla de productos con accesibilidad correcta
- ✅ Labels en filtros de búsqueda
- ✅ ARIA labels en botones de acción
- ✅ Navegación por teclado
- ✅ Contraste de colores suficiente
- ✅ Encabezados semánticos (H1, H2, H3)
- ✅ Texto alternativo en imágenes
- ✅ Dialogs con foco manejable
- ✅ Roles ARIA válidos

### 2. **orders-accessibility.cy.ts**
Pruebas WCAG para componentes de órdenes:
- ✅ Tabla de órdenes accesible
- ✅ Headers de tabla con scope
- ✅ Labels para búsqueda
- ✅ Botones con texto o aria-label
- ✅ Navegación por teclado
- ✅ Manejo de foco visible
- ✅ Orden lógico en navegación
- ✅ Modales con ARIA correctos
- ✅ Estados con aria-live
- ✅ Estructura semántica

### 3. **tasks-accessibility.cy.ts**
Pruebas WCAG para componentes de tareas:
- ✅ Listado de tareas accesible
- ✅ Tarjetas con estructura accesible
- ✅ Botones con aria-label
- ✅ Navegación por teclado
- ✅ Estados claros (no solo por color)
- ✅ Contraste en chips de estado
- ✅ Modales con foco
- ✅ Indicadores de carga con aria-busy
- ✅ Información de empleado/área
- ✅ Validación WCAG AA y crítica

## Estándares Validados

### WCAG 2.1 Level AA
- **Perceivable**: El contenido es presentable
- **Operable**: Navegable por teclado
- **Understandable**: Claro y comprensible
- **Robust**: Compatible con tecnologías asistivas

### Criterios Principales
- 1.4.3 Contrast (Minimum) - AA
- 2.1.1 Keyboard - A
- 2.1.2 No Keyboard Trap - A
- 2.5.3 Label in Name - A
- 3.3.1 Error Identification - A
- 4.1.2 Name, Role, Value - A

## Ejecución

```bash
# Todas las pruebas de accesibilidad
npm run cypress -- accessibility

# Prueba específica
npm run cypress -- accessibility/products-accessibility.cy.ts

# Con reporte detallado
npm run cypress -- accessibility --reporter json --reporter-options reportDir=cypress/reports
```

## Herramientas Usadas

- **cypress-axe**: Integración de Axe Core
- **ARIA Attributes**: Para roles y labels
- **Color Contrast**: Validación de colores

## Checklist de Accesibilidad

- [ ] Todos los botones tienen aria-label o texto visible
- [ ] La tabla tiene headers con scope="col"
- [ ] Los inputs tienen labels asociados
- [ ] El teclado puede navegar todos los elementos interactivos
- [ ] Los colores tienen suficiente contraste
- [ ] Los modales tienen aria-modal="true"
- [ ] Los estados no dependen solo del color
- [ ] Hay encabezados H1, H2, H3
- [ ] Las imágenes tienen alt text
- [ ] Los cambios se anuncian con aria-live

