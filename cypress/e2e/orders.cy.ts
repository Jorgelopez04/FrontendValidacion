/// <reference types="cypress" />

describe('Orders admin flow', () => {
  const adminToken = 'abc.eyJpZF9yb2xlIjoxLCJjYyI6IjEyMzQ1NiJ9.def';

  beforeEach(() => {
    cy.intercept('GET', '**/orders', { fixture: 'orders.json' }).as('getOrders');
    cy.setAuthToken(adminToken);
    cy.visit('/admin/orders');
  });

  it('muestra la tabla de pedidos con datos del fixture', () => {
    cy.wait('@getOrders');

    cy.contains('Gestión de Pedidos').should('be.visible');
    cy.get('.orders-table').should('exist');
    cy.contains('Juan Pérez').should('be.visible');
    cy.contains('María García').should('be.visible');
    cy.contains('Carlos López').should('be.visible');
  });

  it('redirige a la página de creación de pedido al pulsar Crear Pedido', () => {
    cy.contains('button', 'Crear Pedido').click();
    cy.url().should('include', '/admin/orders/create');
  });
});
