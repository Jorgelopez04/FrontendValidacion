/// <reference types="cypress" />
/// <reference types="jasmine" />
/// <reference types="node" />

export {};

// Comandos personalizados para tus pruebas
// Aquí puedes definir comandos reutilizables

const tokenKey = 'token';

/**
 * Comando para login en la aplicación.
 */
Cypress.Commands.add('login', (cc: string, password: string) => {
  cy.visit('/');
  cy.get('input[formControlName="cc"]').should('be.visible').type(cc);
  cy.get('input[formControlName="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

/**
 * Comando para establecer token manualmente en localStorage.
 */
Cypress.Commands.add('setAuthToken', (token: string) => {
  cy.visit('/', {
    onBeforeLoad(window) {
      window.localStorage.setItem(tokenKey, token);
    }
  });
});

/**
 * Comando para logout en la aplicación.
 */
Cypress.Commands.add('logout', () => {
  cy.contains('button', 'Salir').click();
  cy.url().should('eq', `${Cypress.config('baseUrl')}/`);
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(cc: string, password: string): Chainable<void>;
      logout(): Chainable<void>;
      setAuthToken(token: string): Chainable<void>;
    }
  }
}
