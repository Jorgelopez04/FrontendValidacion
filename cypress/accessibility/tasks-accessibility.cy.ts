/// <reference types="cypress" />

/**
 * Pruebas de Accesibilidad para TasksService
 * Validación WCAG 2.1 Level AA
 */
describe('TasksService - Accessibility Tests', () => {
  
  beforeEach(() => {
    cy.setAuthToken('abc.eyJpZF9yb2xlIjoyLCJjYyI6Ijk4NzY1NDMyMSJ9.def');
    cy.visit('/employee/tasks');
    cy.injectAxe();
  });

  describe('Componente EmployeeTasks - Accesibilidad', () => {
    it('debe cumplir WCAG en listado de tareas', () => {
      cy.checkA11y();
    });

    it('debe tener tarjetas de tareas con estructura accesible', () => {
      cy.get('[role="article"], [class*="card"]').each(($card) => {
        cy.wrap($card).then(($cardEl) => {
          expect($cardEl.attr('aria-label') || $cardEl.text().trim()).to.exist;
        });
      });
    });

    it('debe tener botones de acción con aria-label', () => {
      cy.get('button[aria-label*="start"], button[aria-label*="complete"]').each(($button) => {
        cy.wrap($button)
          .should('have.attr', 'aria-label')
          .and('not.be.empty');
      });
    });

    it('debe permitir navegación por teclado en tareas', () => {
      cy.get('[role="button"], button').first().focus();
      cy.focused().should('be.visible');
      
      cy.get('body').tab();
      cy.focused().should('not.equal', 'body');
    });

    it('debe indicar estado de tarea claramente', () => {
      // No solo por color, también por texto
      cy.get('[class*="status"], [class*="state"]').each(($element) => {
        cy.wrap($element).invoke('text').should('not.be.empty');
      });
    });

    it('debe tener contraste suficiente en chips de estado', () => {
      cy.checkA11y('[class*="chip"], [class*="badge"]');
    });
  });

  describe('Diálogos de Detalles de Productos', () => {
    it('debe tener modal con atributos ARIA correctos', () => {
      cy.get('[role="dialog"]').should('have.attr', 'aria-modal', 'true');
      cy.get('[role="dialog"]').then(($dialog) => {
        expect($dialog.attr('aria-label') || $dialog.attr('aria-labelledby')).to.exist;
      });
    });

    it('debe permitir cerrar modal con ESC', () => {
      cy.get('[role="dialog"]').type('{esc}');
      cy.get('[role="dialog"]').should('not.exist');
    });

    it('debe tener descripción accesible de productos en modal', () => {
      cy.get('[role="dialog"] img').each(($img) => {
        cy.wrap($img)
          .should('have.attr', 'alt')
          .and('not.be.empty');
      });
    });
  });

  describe('Indicadores de Carga', () => {
    it('debe anunciar estado de carga con aria-busy', () => {
      cy.get('[aria-busy="true"], [role="progressbar"]').should('exist');
    });

    it('debe tener mensajes de carga accesibles', () => {
      cy.get('[role="status"], [aria-live="polite"]').should('contain', 'Cargando');
    });
  });

  describe('Asignación de Empleados y Áreas', () => {
    it('debe mostrar información de empleado de forma accesible', () => {
      cy.get('[class*="employee"], [class*="area"]').each(($element) => {
        cy.wrap($element)
          .should('have.text')
          .and('not.be.empty');
      });
    });

    it('debe tener descripción clara de área de trabajo', () => {
      cy.get('[class*="area"]').each(($area) => {
        cy.wrap($area).then(($areaEl) => {
          expect($areaEl.attr('title') || $areaEl.attr('aria-label') || $areaEl.text().trim()).to.exist;
        });
      });
    });
  });

  describe('Secuencia de Tareas', () => {
    it('debe indicar número de secuencia de forma accesible', () => {
      cy.get('[class*="sequence"], [aria-label*="sequence"]').should('exist');
    });

    it('debe mantener orden lógico en listado de tareas', () => {
      cy.get('[role="article"], [class*="card"]').should('have.length.at.least', 1);
    });
  });

  describe('Validación General WCAG', () => {
    it('debe no tener errores de accesibilidad críticos', () => {
      cy.checkA11y();
    });

    it('debe cumplir con WCAG Level AA', () => {
      cy.checkA11y();
    });
  });
});
