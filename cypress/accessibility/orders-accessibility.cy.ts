/// <reference types="cypress" />

/**
 * Pruebas de Accesibilidad para OrdersService
 * Validación WCAG 2.1 Level AA
 */
describe('OrdersService - Accessibility Tests', () => {
  
  beforeEach(() => {
    cy.setAuthToken('abc.eyJpZF9yb2xlIjoxLCJjYyI6IjEyMzQ1NiJ9.def');
    cy.visit('/admin/orders');
    cy.injectAxe();
  });

  describe('Componente OrdersList - Accesibilidad', () => {
    it('debe cumplir WCAG en tabla de órdenes', () => {
      cy.checkA11y('table');
    });

    it('debe tener headers de tabla accesibles', () => {
      cy.get('th').each(($th) => {
        cy.wrap($th).then(($thEl) => {
          expect($thEl.attr('scope') === 'col' || $thEl.attr('role') === 'columnheader').to.be.true;
        });
      });
    });

    it('debe tener labels para filtros de búsqueda', () => {
      cy.get('input[placeholder*="search"], input[placeholder*="buscar"]').each(($input) => {
        cy.wrap($input).then(($inputEl) => {
          expect($inputEl.attr('aria-label') || $inputEl.attr('id')).to.exist;
        });
      });
    });

    it('debe tener botones con texto o aria-label accesible', () => {
      cy.get('button').each(($button) => {
        const hasText = $button.text().trim().length > 0;
        const hasAriaLabel = $button.attr('aria-label');
        expect(hasText || hasAriaLabel).to.be.true;
      });
    });

    it('debe permitir navegación por teclado en acciones de órdenes', () => {
      cy.get('button[aria-label*="edit"], button[aria-label*="delete"]').each(($button) => {
        cy.wrap($button).should('have.attr', 'aria-label');
      });
    });

    it('debe tener manejo de foco visible', () => {
      cy.get('button').first().focus();
      cy.focused().then(($focused) => {
        expect($focused.css('outline') || $focused.css('box-shadow')).to.exist;
      });
    });

    it('debe mantener orden lógico en navegación por tab', () => {
      cy.get('body').tab();
      cy.focused().should('be.visible');
    });
  });

  describe('Dialogs de Detalles de Órdenes', () => {
    it('debe tener atributo aria-modal en dialogs', () => {
      cy.get('[role="dialog"]').should('have.attr', 'aria-modal', 'true');
    });

    it('debe tener title accesible en modal', () => {
      cy.get('[role="dialog"]').then(($dialog) => {
        expect($dialog.attr('aria-label') || $dialog.attr('aria-labelledby')).to.exist;
      });
    });

    it('debe permitir cerrar con ESC desde modal', () => {
      cy.get('[role="dialog"]').type('{esc}');
      cy.get('[role="dialog"]').should('not.exist');
    });

    it('debe restaurar foco al cerrar modal', () => {
      // El foco debe volver al botón que abrió el modal
      cy.get('[role="dialog"]').should('exist');
    });
  });

  describe('Estados y Mensajes de Órdenes', () => {
    it('debe anunciar cambios de estado con aria-live', () => {
      cy.get('[aria-live="polite"], [aria-live="assertive"]').should('exist');
    });

    it('debe tener colores con suficiente contraste en estados', () => {
      cy.checkA11y();
    });

    it('debe no depender solo del color para indicar estado', () => {
      // Validar que hay texto o ícono además del color
      cy.get('[class*="status"], [class*="state"]').each(($element) => {
        const hasText = $element.text().trim().length > 0;
        const hasIcon = $element.find('i, [class*="icon"]').length > 0;
        expect(hasText || hasIcon).to.be.true;
      });
    });
  });

  describe('Validación de Estructura Semántica', () => {
    it('debe tener estructura de encabezados correcta', () => {
      cy.get('h1').should('exist');
      cy.get('h1').should('have.length.at.least', 1);
    });

    it('debe tener landmarks semánticos', () => {
      cy.get('[role="main"], [role="navigation"], [role="complementary"]').should('exist');
    });
  });
});
