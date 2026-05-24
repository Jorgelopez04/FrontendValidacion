/// <reference types="cypress" />

describe('Admin UI', () => {
  const adminToken = 'abc.eyJpZF9yb2xlIjoxLCJjYyI6IjEyMzQ1NiJ9.def';

  beforeEach(() => {
    cy.setAuthToken(adminToken);
    cy.visit('/admin');
  });

  it('muestra el menú principal del administrador', () => {
    cy.contains('a', 'Dashboard').should('exist');
    cy.contains('a', 'Pedidos').should('exist');
    cy.contains('a', 'Clientes').should('exist');
    cy.contains('button', 'Salir').should('be.visible');
  });

  it('permite cerrar sesión desde el navbar', () => {
    cy.contains('button', 'Salir').click();
    cy.url().should('eq', `${Cypress.config('baseUrl')}/`);
  });
});
