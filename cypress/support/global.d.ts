/// <reference types="cypress" />
/// <reference types="cypress-axe" />
/// <reference types="cypress-plugin-tab" />
/// <reference types="jasmine" />

declare namespace Cypress {
  interface Chainable {
    login(cc: string, password: string): Chainable<void>;
    logout(): Chainable<void>;
    setAuthToken(token: string): Chainable<void>;

    mountComponent(component: any, config?: any): Chainable<any>;
    waitForElement(selector: string, timeout?: number): Chainable<void>;
    expectServiceCall(spy: Cypress.SinonSpy): Chainable<void>;
    mockNetworkDelay(delayMs?: number): Chainable<void>;
  }
}
