/* eslint-disable no-undef */

Cypress.Commands.add('addNewRecordInTree', (maxLength, value) => {
  cy.get('[data-test-input-name="title"]').type(value);
  cy.get('[data-test-field-type="CODING_FIELD"] input')
    .should('have.attr', 'maxlength', maxLength)
    .type(value)
    .should('have.value', value)
    .type('{enter}')
    .wait(500);
});

Cypress.Commands.add('deleteRecordInTree', eq => {
  cy.get('[data-test-tree-container] ul li')
    .eq(eq)
    .find('[role="checkbox"] span')
    .click()
    .wait(2000);
  cy.get('#deleteButton').click();
  cy.get('#dialogButtonConfirmYes').click();
  cy.wait(2000);
});

// Remove item of string-single-select
Cypress.Commands.add('deleteItemSingleSelect', () => {
  cy.get('[data-test-field-name="stringselect"] div div i')
    .should('have.class', 'dropdown icon clear')
    .click();

  cy.get('[data-test-field-name="stringselect"] div div div')
    .first()
    .should('not.have.value');
});

// Remove all items of string-multi-select
Cypress.Commands.add('deleteAllItemFromMultiSelect', () => {
  cy.get('[data-test-field-name="stringmultiselecttest"] div div a i').each(selector => {
    cy.get(selector)
      .should('have.class', 'delete icon')
      .click();
    cy.wait(1000);
  });
});

Cypress.Commands.add('validUrlField', url => {
  cy.get('[data-test-quick-edit-button="urlfield"]').click();
  cy.writeInInput('urlfield', url);
  cy.get('#quickEditToolbarSaveButton').click();

  cy.get('#urlfield-helper-text').should('have.text', 'فیلد آدرس به درستی وارد نشده است');
  cy.get('[data-test-quick-edit-toolbar-button="cancell"]').click();
});

Cypress.Commands.add(
  'checkDropdownItemsLength',
  (fieldName, expectedLength, isMultiSelect = false) => {
    cy.get(`[data-test-field-name="${fieldName}"] ${isMultiSelect ? 'i' : 'input'}`)
      .click()
      .wait(500);

    cy.get(`[data-test-field-name="${fieldName}"] div div div div`).should(
      'have.length',
      expectedLength,
    );
  },
);
