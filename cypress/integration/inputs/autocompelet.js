it('finds my favorite movie', () => {
  cy.visit('#/webtest/order/22');
  cy.viewport(1600, 750);
  cy.wait(1000);

  // test empty option
  cy.get('[data-test-input-name="auto-complete-input"]').click();
  cy.get('[data-test-input-name="auto-complete-input-box"]').type('sdfle');
  cy.contains('ایتم وجود ندارد').should('be.visible');
  cy.get('[data-test-input-name="auto-complete-input-box"]').type(
    '{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}',
  );
  // test search item and click
  cy.get('[data-test-input-name="auto-complete-input-box"]').type('isdele');
  cy.contains('isdeleted')
    .should('be.visible')
    .click();
  cy.get('[data-test-input-name="auto-complete-input-box"]').type('cust');
  cy.contains('customer_id')
    .should('be.visible')
    .click();
  cy.get('[data-test-input-name="auto-complete-input-box"]').type('2');
  cy.contains('test2')
    .should('be.visible')
    .click();
  // test more item on ...
  cy.get('[data-test-input-name="mouse-over-more-test"]').trigger('mouseover');
  cy.get('[data-test-input-name="popover-more-test"]').contains('test2');
});
