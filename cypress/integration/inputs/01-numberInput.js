describe('Create a new Purchase Invoice', () => {
  beforeEach('Should login to app before anything', () => {
    cy.login();
  });

  it('Should seprate price fields with 3 digits', () => {
    cy.visit('#/webtest/order');
    cy.wait(1000);

    cy.setSort('شناسه Order', 'desc');
    cy.removeAllGridFilter();

    cy.get('#quickCreateButton').click();
    cy.get('#quickCreateFormFullInsertButton').click();

    // Define alias
    cy.get('[data-test-field-name="fieldrequired"]').as('field');

    // Check seperator with manual type: 2000 ---turns into---> 2,000
    cy.wait(1000)
      .get('@field')
      .type('2000');
    cy.get('@field')
      .find('input')
      .should('have.value', '2,000');

    // Check seperator by typing - to add 000: 2,000 + '-' ---turns into---> 2,000,000
    cy.get('@field').type('-');
    cy.get('@field')
      .find('input')
      .should('have.value', '2,000,000');
  });

  it('Should show Error if value be more than JS integer max safe value', () => {
    const unsafeInteger = '11111111111111111';

    cy.visit('#/webtest/testNumber');
    cy.wait(3000);

    cy.get('#quickCreateButton').click();
    cy.wait(2000);

    cy.get('[data-test-input-name="optionalfraction"]').type(unsafeInteger);
    cy.wait(2000);
    cy.get('[data-test-input-name="requiredfraction"]').type(unsafeInteger);
    cy.wait(2000);
    cy.get('[data-test-input-name="noformat"]').type(unsafeInteger);
    cy.wait(2000);
    cy.get('[data-test-input-name="noprecision"]').type(unsafeInteger);
    cy.wait(2000);
    cy.get('[data-test-input-name="withprecision"]').type(unsafeInteger);
    cy.wait(2000);

    cy.get('[data-test-field-name="optionalfraction"]').should(
      'have.attr',
      'data-test-has-error',
      'true',
    );
    cy.get('[data-test-field-name="requiredfraction"]').should(
      'have.attr',
      'data-test-has-error',
      'true',
    );
    cy.get('[data-test-field-name="noformat"]').should('have.attr', 'data-test-has-error', 'true');
    cy.get('[data-test-field-name="noprecision"]').should(
      'have.attr',
      'data-test-has-error',
      'true',
    );
    cy.get('[data-test-field-name="withprecision"]').should(
      'have.attr',
      'data-test-has-error',
      'true',
    );
  });

  it('it should check precision', () => {
    cy.visit('#/webtest/testnumber');
    cy.wait(3000);

    cy.get('#quickCreateButton').click();
    cy.wait(2000);

    cy.get('[data-test-input-name="noprecision"]').should('have.attr', 'data-test-precision', '0');

    cy.get('[data-test-input-name="withprecision"]').should(
      'have.attr',
      'data-test-precision',
      '2',
    );

    cy.get('[data-test-input-name="withprecision"]')
      .clear()
      .type(1.11)
      .should('have.value', '1.11');

    cy.get('[data-test-input-name="withprecision"]')
      .clear()
      .type(1111.11)
      .should('have.value', '1,111.11');

    cy.get('[data-test-input-name="withprecision"]')
      .clear()
      .type(1.111)
      .should('have.value', '1.11');

    cy.get('[data-test-input-name="withprecision"]')
      .clear()
      .type(1111.111)
      .should('have.value', '1,111.11');

    cy.get('[data-test-input-name="noprecision"]')
      .clear()
      .type(1.11)
      .should('have.value', '111');

    cy.get('[data-test-input-name="noprecision"]')
      .clear()
      .type(1111.11)
      .should('have.value', '111,111');

    cy.get('[data-test-input-name="noprecision"]')
      .clear()
      .type(1.111)
      .should('have.value', '1,111');

    cy.get('[data-test-input-name="noprecision"]')
      .clear()
      .type(1111.111)
      .should('have.value', '1,111,111');
  });

  it('Check format in grid row and edit view and show view', () => {
    cy.intercept(
      'GET',
      '/v2/webtest/testnumber?skip=0&takeCount=10&sort=testnumber_id&sortType=DESC',
      { fixture: 'mock/inputs/01-numberInput/get/webtest-testnumber.json' },
    ).as('getNumber');

    cy.intercept('GET', '/v2/webtest/testnumber/137?withRelation=true', {
      fixture: 'mock/inputs/01-numberInput/get/webtest-testnumber-record137.json',
    }).as('getNumber137');

    cy.visit('#/webtest/testnumber');
    cy.wait(2000);

    cy.get('[data-test-number-field-name="noformat"]').should('have.text', '1234567');
    cy.get('[data-test-number-field-name="requiredfraction"]').should('have.text', '1,234,567.00');

    cy.get('[data-test-grid-row="137"]')
      .click()
      .wait(1000);

    cy.get('[data-test-number-field-name="noformat"]').should('have.text', '1234567');
    cy.get('[data-test-number-field-name="requiredfraction"]').should('have.text', '1,234,567.00');

    cy.get('#editActionButton')
      .click()
      .wait(1000);

    cy.get('[data-test-input-name="noformat"]').should('have.value', '1234567');
    cy.get('[data-test-input-name="requiredfraction"]').should('have.value', '1,234,567');
  });
});
