import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    viewportWidth: 1280,
    viewportHeight: 720,
    setupNodeEvents(on, config) {
      // implementar node event listeners aquí
    },
    specPattern: [
      'cypress/ui/**/*.cy.ts',
      'cypress/accessibility/**/*.cy.ts',
      'cypress/regression/**/*.cy.ts',
      'cypress/security/**/*.cy.ts'
    ],
    excludeSpecPattern: ['cypress/e2e/**/*.cy.ts']
  },
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    supportFile: './cypress/support/component.ts',
    specPattern: './cypress/component/**/*.cy.ts',
  },
});
