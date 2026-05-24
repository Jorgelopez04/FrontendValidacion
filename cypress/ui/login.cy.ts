/// <reference types="cypress" />

describe('Login UI', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('debe mostrar el formulario de login', () => {
    cy.get('input[formControlName="cc"]').should('be.visible');
    cy.get('input[formControlName="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('debe permitir completar los campos de login', () => {
    cy.get('input[formControlName="cc"]').type('123456789');
    cy.get('input[formControlName="password"]').type('password123');
    cy.get('button[type="submit"]').should('not.be.disabled');
  });
});
