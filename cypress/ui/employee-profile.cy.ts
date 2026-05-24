/// <reference types="cypress" />

describe('Employee profile UI', () => {
  const employeeToken = 'abc.eyJpZF9yb2xlIjoyLCJjYyI6Ijk4NzY1NDMyMSJ9.def';

  beforeEach(() => {
    cy.intercept('GET', '**/employees/cc/987654321', { fixture: 'employee-profile.json' }).as('employeeProfile');
    cy.setAuthToken(employeeToken);
    cy.visit('/employee/profile');
  });

  it('muestra los datos del perfil del empleado', () => {
    cy.wait('@employeeProfile');

    cy.contains('Mi Perfil').should('be.visible');
    cy.contains('.info-item', 'Nombre').should('contain', 'Ana Pérez');
    cy.contains('.info-item', 'Cédula').should('contain', '987654321');
    cy.contains('.info-item', 'Rol').should('contain', 'Empleado');
  });
});
