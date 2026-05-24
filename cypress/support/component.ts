/// <reference types="jasmine" />
/// <reference types="node" />
import { mount } from 'cypress/angular';
import './commands';

/**
 * Comando para montar componentes Angular en Cypress
 */
Cypress.Commands.add('mountComponent', (component: any, config?: any) => {
  return mount(component, config);
});

/**
 * Comando para esperar a que un elemento sea visible
 */
Cypress.Commands.add('waitForElement', (selector: string, timeout: number = 5000) => {
  cy.get(selector, { timeout }).should('be.visible');
});

/**
 * Comando para validar que un servicio fue llamado
 */
Cypress.Commands.add('expectServiceCall', (spy: SinonSpy) => {
  expect(spy).to.have.been.called;
});

/**
 * Comando para simular un delay de red
 */
Cypress.Commands.add('mockNetworkDelay', (delayMs: number = 1000) => {
  cy.intercept('*', (req) => {
    req.reply({ delay: delayMs });
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      mountComponent(component: any, config?: any): Chainable<any>;
      waitForElement(selector: string, timeout?: number): Chainable<void>;
      expectServiceCall(spy: any): Chainable<void>;
      mockNetworkDelay(delayMs?: number): Chainable<void>;
    }
  }
}
