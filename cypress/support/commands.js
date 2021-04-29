/* eslint-disable no-undef */
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// const { username, password } = Cypress.env();
Cypress.Commands.add('login', (params = {}) => {
  const {
    lang = 'fa',
    cal = 'jalali',
    username = Cypress.env('username'),
    password = Cypress.env('password'),
    wait = true,
  } = params;

  // cy.intercept('POST', '/v2/account/erpweb/login', {
  //   fixture: 'mock/shared/post/login.json',
  // }).as('login');
  // cy.intercept('GET', '/v2/account/erpweb/profile?withRelation=true', {
  //   fixture: 'mock/shared/get/profile.json',
  // }).as('profile');

  cy.intercept('GET', '/v2/dropdown/425', {
    fixture: 'mock/shared/get/warehouse-dropdown.json',
  }).as('dropdown/425');

  cy.visit('#/login'); // change URL to match your dev URL
  if (lang === 'en') {
    cy.get('#lang')
      .find('[data-test="lang-en"]')
      .click();
  }
  cy.get(`[data-test="cal-${cal}"]`).click();
  cy.get('#username')
    .type(username)
    .should('have.value', username);

  cy.get('#password')
    .type(password)
    .should('have.value', password)
    .type('{enter}'); //{enter} causes the form to submit

  if (wait) {
    cy.wait(3000);
  }
  cy.url().should('not.include', '/login');
});

Cypress.Commands.add(
  'selectFromDropdown',
  (name, text = ' {backspace}', options, waitTime = 100) => {
    cy.get(`[data-test-field-name="${name}"]`, options)
      .find('[data-test-dropdown-search-input="true"]')
      .should('not.have.class', 'loading')
      .wait(waitTime)
      .find('input')
      .last()
      .wait(waitTime)
      .type(text, { force: true })
      .wait(waitTime)
      .parent()
      .wait(waitTime * 2)
      .find('[role="option"]')
      .first()
      .click();

    cy.get(`[data-test-field-name="${name}"]`, options)
      .find('[data-test-dropdown-search-input="true"] input')
      .should('not.have.class', 'error');
  },
);

Cypress.Commands.add('writeInInput', (name, text, options) => {
  cy.get(`[data-test-field-name="${name}"]`, options)
    .find(`input`)
    .click({ force: true })
    .wait(1000)
    .type(text, { force: true });
});

Cypress.Commands.add('saveForm', () => cy.get('[id="formMainSaveButton"]').click());

Cypress.Commands.add('getQuickCreateForm', () => {
  return cy.get('#quickCreateDialogDiv');
});

Cypress.Commands.add('getTableRowSpan', (rowIndex, columnIndex) => {
  return cy
    .get('tbody tr')
    .eq(rowIndex)
    .find('[data-test-grid-column-link-name]')
    .eq(columnIndex)
    .find('span')
    .wait(1000);
});

Cypress.Commands.add('serviceSelect', (serviceId, isManual = 'false') => {
  return cy
    .get(`[data-test-service-id="${serviceId}"]`)
    .should('not.have.class', 'Mui-disabled')
    .should('have.attr', 'data-test-is-manual-service', isManual)
    .click({ force: true });
});

Cypress.Commands.add('toggleCheckbox', (eq, tabListParent) => {
  return cy
    .get(tabListParent ? `${tabListParent} tbody tr` : `tbody tr`)
    .eq(eq)
    .find('[type="checkbox"]')
    .click({ force: true });
});

Cypress.Commands.add('getTableRow', (table, row) => {
  cy.get('tbody')
    .eq(table)
    .find('tr')
    .eq(row);
});

Cypress.Commands.add('createNewOrder', (orderdesc, fieldName, text, fullForm = false) => {
  cy.get('#quickCreateButton').click();
  cy.wait(1000);

  if (fullForm) {
    cy.get('#quickCreateFormFullInsertButton').should('not.have.attr', 'disabled');
    cy.get('#quickCreateFormFullInsertButton').click();
    cy.wait(1000);
  }

  if (!fieldName) {
    // ------ its for open drop down if it was close ---------------------
    cy.get('[aria-expanded]').then(div => {
      if (div.attr('aria-expanded') === 'false') {
        cy.get('[aria-expanded]')
          .find('i')
          .click();
        cy.wait(1000);
      }
    });
    cy.wait(2000);

    cy.get('[role="listbox"]')
      .find('div')
      .first()
      .find('span')
      .click({ force: true });
  } else {
    cy.selectFromDropdown(fieldName, text, {}, 1500);
  }

  cy.get('[data-test-input-name="orderdesc"]')
    .type(orderdesc)
    .should('have.value', orderdesc);
  cy.wait(500);

  if (!fullForm) {
    cy.get('#quickCreateFormSave').should('not.have.attr', 'disabled');
    cy.get('#quickCreateFormSave').click();
    cy.wait(1000);
  } else {
    cy.saveForm();
  }
});

Cypress.Commands.add('typeOnSearchInput', text => {
  cy.get('#searchTextField')
    .type(text)
    .should('have.value', text);
  cy.get('[data-test-item-name]')
    .find('[type="checkbox"]')
    .click();
  cy.get('#searchTextField')
    .clear()
    .should('have.value', '');
});

Cypress.Commands.add('removeAllGridFilter', () => {
  cy.get('[data-test-saved-filter-button]').click();
  cy.get('[data-saved-filters-click-fire]').then(div => {
    const isDisabled = div.attr('aria-disabled');
    if (isDisabled === 'false') {
      cy.get(div).click();
    } else {
      cy.get('[role="presentation"]').click();
    }
  });
});

Cypress.Commands.add('checkSelectedTab', (eq, shouldBeSelected, tabListParent) => {
  cy.get(`${tabListParent ? tabListParent : ''}[role="tablist"]`)
    .find('button')
    .eq(eq)
    .should('have.attr', 'aria-selected', shouldBeSelected);
});

Cypress.Commands.add('checkCurrentTab', (tabIndex, tabListParent) => {
  switch (tabIndex) {
    case 0:
      cy.checkSelectedTab(0, 'true', tabListParent);
      cy.checkSelectedTab(1, 'false', tabListParent);
      cy.checkSelectedTab(2, 'false', tabListParent);
      break;
    case 1:
      cy.checkSelectedTab(0, 'false', tabListParent);
      cy.checkSelectedTab(1, 'true', tabListParent);
      cy.checkSelectedTab(2, 'false', tabListParent);
      break;
    case 2:
      cy.checkSelectedTab(0, 'false', tabListParent);
      cy.checkSelectedTab(1, 'false', tabListParent);
      cy.checkSelectedTab(2, 'true', tabListParent);
      break;
    default:
      cy.checkSelectedTab(0, 'true', tabListParent);
      cy.checkSelectedTab(1, 'false', tabListParent);
      cy.checkSelectedTab(2, 'false', tabListParent);
      break;
  }
});

Cypress.Commands.add('selectTab', (eq, tabListParent) => {
  cy.get(`${tabListParent ? tabListParent : ''}[role="tablist"]`)
    .find('button')
    .eq(eq)
    .click();
});

Cypress.Commands.add('setSort', (expectedName, expectedOrder, tableIndex = 0) => {
  cy.get('thead tr')
    .eq(tableIndex)
    .find('th div div div span span')
    .each((firstTimeSpan, index) => {
      const firstTimeName = firstTimeSpan.text();
      cy.wait(400);
      if (firstTimeName && firstTimeName !== '' && firstTimeName === expectedName) {
        cy.wait(2000);
        cy.get('thead tr')
          .eq(tableIndex)
          .find('th div div div span span')
          .eq(index)
          .click()
          .wait(3000)
          .then(() => {
            cy.get('thead tr')
              .eq(tableIndex)
              .find('th div div div span span')
              .each((secondTimeSpan, index) => {
                const secondTimeName = secondTimeSpan.text();
                if (
                  secondTimeName &&
                  secondTimeName !== '' &&
                  String(secondTimeName) === String(expectedName)
                ) {
                  cy.get('thead tr')
                    .eq(tableIndex)
                    .find('th div div div span span')
                    .eq(index)
                    .siblings('svg')
                    .then(svg => {
                      const currentSort = String(svg.attr('class')).includes(
                        'MuiTableSortLabel-iconDirectionDesc',
                      )
                        ? 'desc'
                        : 'asc';
                      if (currentSort !== expectedOrder) {
                        cy.get(secondTimeSpan)
                          .click()
                          .wait(3000);
                      }
                    });
                }
              });
          });
        return false;
      }
    });
});

Cypress.Commands.add('chooseDatePickerDay', (datePickerId, day) => {
  cy.get(datePickerId)
    .last()
    .find('input')
    .click();

  const readyComponents = [];

  cy.get('.dayPickerContainer button')
    .each(button => {
      if (button.text() === day) {
        readyComponents.push(button);
      }
    })
    .then(() => {
      if (readyComponents.length === 1) {
        cy.get(readyComponents[0]).click();
      } else {
        if (
          day === '۱' ||
          day === '۲' ||
          day === '۳' ||
          day === '۴' ||
          day === '۵' ||
          day === '۶' ||
          day === '۷'
        ) {
          cy.get(readyComponents[0]).click();
        }

        if (
          day === '۲۵' ||
          day === '۲۶' ||
          day === '۲۷' ||
          day === '۲۸' ||
          day === '۲۹' ||
          day === '۳۰' ||
          day === '۳۱'
        ) {
          cy.get(readyComponents[1]).click();
        }
      }
    });
});

Cypress.Commands.add('saveCulumnsAsDefaultAndSelectAll', () => {
  // open dialog
  cy.get('#listColumnSelectDialogButton').click();
  cy.wait(1000);

  // save current culemns with current order as default
  cy.get('#DefaultSaveButton').click();
  cy.wait(3000);

  // open dialog again
  cy.get('#listColumnSelectDialogButton').click();
  cy.wait(3000);

  // select all columns
  cy.get('#changeAllCheckbox').click();

  // save
  cy.get('#SaveButton').click();
});

Cypress.Commands.add('resetGridColumnsToDefault', () => {
  // open dialog
  cy.get('#listColumnSelectDialogButton').click();
  cy.wait(3000);

  // deSelect all checkboxes
  cy.get('#changeAllCheckbox').click();

  cy.get('#changeAllCheckbox').click();

  // save current culemns with current order as default
  cy.get('#SaveButton').click();
});

Cypress.Commands.add('saveFormQuickEditToolbar', () => {
  cy.get('#quickEditToolbarSaveButton').click();
});

// check an attribute to have an element
Cypress.Commands.add('checkElementAttribute', (identifire, attribute, expectedValue) => {
  if (expectedValue) {
    cy.get(identifire).should('have.attr', attribute, expectedValue);
  } else {
    cy.get(identifire).should('have.attr', attribute);
  }
});

Cypress.Commands.add('deleteLastRecord', () => {
  cy.getTableRow(0, 0)
    .find('[type="checkbox"]')
    .click({ force: true });
  cy.wait(1000);
  cy.get('#deleteButton').click();
  cy.wait(1000);
  cy.get('#dialogButtonConfirmYes').click();
  cy.wait(4000);
});

Cypress.Commands.add('refreshMeta', () => {
  cy.request({
    method: 'GET',
    url: `${Cypress.env(
      'apiBaseUrl',
    )}/apiadmin/meta/refresh/Do1More2Of3What4Makes5You6Happy.?force=false&justForConnections=false`,
  }).then(response => {
    expect(response.status).to.eq(200);
  });
});

// Select from the list by entering the field name and index
Cypress.Commands.add('selectFromOptionsList', (name, index, waitTime = 100) => {
  cy.get(`[data-test-field-name="${name}"]`)
    .click()
    .wait(waitTime)
    .find('[data-test-dropdown-search-input="true"]')
    .should('not.have.class', 'loading')
    .wait(waitTime)
    .find('[role="option"]')
    .siblings()
    .eq(index)
    .click({ force: true });
});

///---- Click on delete button and confirm ----
Cypress.Commands.add('deleteConfirm', () => {
  cy.get('#deleteButton').click();
  cy.wait(1000);

  cy.get('#dialogButtonConfirmYes').click();
  cy.wait(2000);
});
