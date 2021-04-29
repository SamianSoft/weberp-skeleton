/* eslint-disable no-undef */
describe('Login page', function() {
  it('Should be able to login with default parameters into Farsi dashboard', function() {
    // Mocking request - GET method
    cy.intercept('GET', '/v2/setting/systemlanguages?skip=0&takeCount=1000&sort=id&sortType=ASC', {
      fixture: 'mock/auth/shared/get/systemlanguages.json',
    }).as('languagesGet');

    cy.intercept('GET', '/v2/account/erpweb/profile?withRelation=true', {
      fixture: 'mock/auth/01-login-default/get/profile-fa.json',
    }).as('profileGet');

    cy.intercept('GET', '/v2/account/erpweb/menu', {
      fixture: 'mock/auth/shared/get/menu.json',
    }).as('menuGet');

    cy.intercept(
      'GET',
      '/v2/dropdown/425?search=1&parameters=&skip=0&takeCount=10&forceTreeLevel=false&filters=',
      {
        fixture: 'mock/auth/shared/get/warehouse.json',
      },
    ).as('warehouseGet');

    // Mocking request -- POST method
    cy.intercept('POST', '/v2/account/erpweb/login', {
      fixture: 'mock/auth/shared/post/login.json',
    }).as('loginPost');

    cy.visit('/'); // change URL to match your dev URL

    cy.url().should('include', '/login');

    const { username, password } = Cypress.env();

    cy.get('#username')
      .type(username)
      .should('have.value', username);

    cy.get('#password')
      .type(password)
      .should('have.value', password)
      .type('{enter}'); // {enter} causes the form to submit

    // Body test Post
    cy.wait('@loginPost').then(xhr => {
      expect(xhr.request.body).to.deep.equal({ username: 'webtest', password: '110110' });
    });

    cy.url().should('not.include', '/login');

    cy.refreshMeta();

    cy.get('#react-admin-title').should('contain', 'خانه');
  });
});
