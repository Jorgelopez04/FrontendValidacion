/// <reference types="cypress" />

/**
 * Pruebas de Accesibilidad para ProductsService
 * Validación WCAG 2.1 Level AA
 */
describe('ProductsService - Accessibility Tests', () => {
  
  beforeEach(() => {
    cy.setAuthToken('abc.eyJpZF9yb2xlIjoxLCJjYyI6IjEyMzQ1NiJ9.def');
    cy.visit('/admin/products');
    cy.injectAxe();
  });

  describe('Componente de Listado de Productos', () => {
    it('debe cumplir con estándares WCAG en la tabla de productos', () => {
      // Validar accesibilidad de la tabla
      cy.checkA11y('table');
    });

    it('debe tener labels para filtros de productos', () => {
      // Validar que los inputs de búsqueda tengan labels
      cy.get('input[type="text"]').each(($input) => {
        cy.wrap($input).then(($inputEl) => {
          expect($inputEl.attr('aria-label') || $inputEl.attr('id')).to.exist;
        });
      });
    });

    it('debe tener atributos ARIA correctos en botones de acción', () => {
      // Validar botones con aria-labels
      cy.get('button[aria-label]').each(($button) => {
        cy.wrap($button)
          .should('have.attr', 'aria-label')
          .and('not.be.empty');
      });
    });

    it('debe ser navegable por teclado', () => {
      // Tab a través de elementos interactivos
      cy.get('body').tab();
      cy.focused().then(($focused) => {
        expect($focused.attr('tabindex') || $focused.attr('aria-label')).to.exist;
      });
    });

    it('debe tener contraste de color suficiente', () => {
      cy.checkA11y();
    });

    it('debe tener encabezados semánticos (h1, h2, h3)', () => {
      cy.get('h1, h2, h3').should('exist');
      cy.get('h1').should('have.length.at.least', 1);
    });

    it('debe tener texto alternativo en imágenes de productos', () => {
      cy.get('img').each(($img) => {
        cy.wrap($img)
          .should('have.attr', 'alt')
          .and('not.be.empty');
      });
    });
  });

  describe('Dialogs y Modales de Productos', () => {
    it('debe tener foco manejable en modales de detalles', () => {
      cy.get('[role="dialog"]').should('have.attr', 'aria-modal', 'true');
      cy.get('[role="dialog"]').should('have.attr', 'aria-labelledby');
    });

    it('debe permitir cerrar dialogs con ESC', () => {
      cy.get('[role="dialog"]').type('{esc}');
      cy.get('[role="dialog"]').should('not.exist');
    });
  });

  describe('Validación de Roles ARIA', () => {
    it('debe tener roles ARIA semánticamente correctos', () => {
      cy.checkA11y();
    });

    it('debe tener aria-label o aria-labelledby en regiones', () => {
      cy.get('[role="main"]').then(($main) => {
        expect($main.attr('aria-label') || $main.attr('aria-labelledby')).to.exist;
      });
    });
  });
});
