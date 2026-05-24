/// <reference types="cypress" />

describe('Login e2e', () => {
  beforeEach(() => {
    cy.intercept('POST', '**/auth/login', { fixture: 'login-admin.json' }).as('loginRequest');
    cy.visit('/');
  });

  it('muestra validaciones de login cuando el formulario está vacío', () => {
    cy.get('button[type="submit"]').should('be.disabled');

    cy.get('input[formControlName="cc"]').focus().blur();
    cy.get('input[formControlName="password"]').focus().blur();

    cy.contains('La cédula es').should('exist');
    cy.contains('La contraseña es').should('exist');
  });

  it('permite iniciar sesión y navega a la ruta de administrador', () => {
    cy.login('123456', 'Password123!');
    cy.wait('@loginRequest');

    cy.url().should('include', '/admin');
    cy.contains('Salir').should('be.visible');
  });

  it('muestra alerta cuando las credenciales son incorrectas', () => {
    cy.intercept('POST', '**/auth/login', {
      statusCode: 401,
      body: {
        success: false,
        message: 'Credenciales inválidas'
      }
    }).as('failedLogin');

    cy.visit('/');
    cy.get('input[formControlName="cc"]').type('000000');
    cy.get('input[formControlName="password"]').type('wrongpassword');

    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });

    cy.get('button[type="submit"]').click();
    cy.wait('@failedLogin');

    cy.get('@alert').should('have.been.calledWith', 'Cédula o contraseña incorrecta');
  });
});
