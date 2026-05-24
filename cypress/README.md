# Cypress Test Suite

Esta carpeta contiene todas las pruebas de Cypress del proyecto, excepto las pruebas `e2e` que se mantienen en `cypress/e2e`.

## Estructura

- `cypress/component/`: pruebas de componentes Angular con Cypress.
- `cypress/ui/`: pruebas de interfaz de usuario y navegación.
- `cypress/accessibility/`: pruebas de accesibilidad con `cypress-axe`.
- `cypress/regression/`: validaciones de regresión locales.
- `cypress/security/`: pruebas de seguridad y validación de datos.
- `cypress/fixtures/`: datos de prueba y respuestas simuladas.
- `cypress/support/`: comandos personalizados y configuraciones globales.

## Configuración importante

- El archivo principal de configuración es `cypress.config.ts`.
- Las pruebas `ui`, `accessibility`, `regression` y `security` se ejecutan por defecto.
- Las pruebas `e2e` están excluidas de la ejecución predeterminada para esta fase.

## Scripts útiles

```bash
npm run cypress:open
npm run cypress:run
npm run cypress:component
npm run cypress:ui
npm run cypress:accessibility
npm run cypress:regression
npm run cypress:security
```

## Buenas prácticas

- Usa `cypress/fixtures/` para datos de usuario, órdenes, productos y tareas.
- Define comandos reutilizables en `cypress/support/commands.ts`.
- Agrega nuevas rutas y pruebas en carpetas explícitas en lugar de mezclar tipos de pruebas.
- Mantén los tests de `e2e` separados si quieres avanzar a la siguiente funcionalidad sin bloquear la ejecución actual.
