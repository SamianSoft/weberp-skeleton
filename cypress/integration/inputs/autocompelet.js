it('finds my favorite movie', () => {
  cy.visit('#/webtest/order/22');
  cy.wait(1000);

  // test empty option
  cy.get('[data-test-input-name="auto-complete-input"]').click();
  cy.focused().type('sdfle');
  cy.contains('ایتم وجود ندارد').should('be.visible');
  cy.focused().type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}');
  // test search item and click
  cy.get('[data-test-input-name="auto-complete-input"]').click();
  cy.focused().type('isdele');
  cy.contains('isdeleted')
    .should('be.visible')
    .and('have.class', 'MuiAutocomplete-option')
    .click();
  cy.get('[data-test-input-name="auto-complete-input"]').click();
  cy.focused().type('cust');
  cy.contains('customer_id')
    .should('be.visible')
    .and('have.class', 'MuiAutocomplete-option')
    .click();
  // test more item on ...
  cy.get('[data-test-input-name="mouse-over-more-test"]').trigger('mouseover');
  cy.get('[data-test-input-name="popover-more-test"]').contains('customer_id');
  // test show all options
  cy.focused().type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}');
  cy.get('.MuiAutocomplete-option')
    .should('have.length', 3)
    .and(el$ => {
      expect(el$[0]).to.have.text('customer_id');
      expect(el$[1]).to.have.text('isdeleted');
      expect(el$[2]).to.have.text('test');
    });
});
