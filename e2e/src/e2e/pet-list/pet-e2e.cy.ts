describe('Pet List Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the list of pets', () => {
    cy.get('[data-cy="pets-table"]').should('exist');
    cy.get('[data-cy^="pet-id-"]').should('have.length.greaterThan', 0);
  });

  it('should filter pets by name', () => {
    cy.get('[data-cy="search-input"]').type('doggie');
    cy.get('[data-cy^="pet-name-"]').each(($el) => {
      cy.wrap($el).should('contain.text', 'doggie');
    });
  });

  it('should filter pets by status', () => {
    cy.get('[data-cy="status-select"]').click();
    cy.get('[data-cy="status-option-sold"]').click({ force: true });
    cy.wait(500);
    cy.get('[data-cy^="pet-status-"]').each(($el) => {
      cy.wrap($el).should('contain.text', 'sold');
    });
  });

  it('should open the Add Pet form', () => {
    cy.get('[data-cy="add-pet-btn"]').click({ force: true });
    cy.get('h2').should('contain.text', 'Dodaj zwierzę');
  });

  it('should add a new pet', () => {
    cy.get('[data-cy="add-pet-btn"]').click();
    cy.get('[data-cy="form-title"]').should('contain.text', 'Dodaj zwierzę');

    cy.get('[data-cy="pet-name"]')
      .click()
      .clear()
      .type('Golden Retriever', { force: true });
    cy.get('[data-cy="pet-category"]')
      .click()
      .clear()
      .type('Dog', { force: true });
    cy.get('[data-cy="pet-photo-0"]')
      .click()
      .clear()
      .type('https://example.com/photo.jpg', { force: true });

    cy.get('[data-cy="pet-status"]').click();
    cy.get('[data-cy="status-option-available"]').click({ force: true });

    cy.get('[data-cy="add-tag-input"]').click().type('NowyTag{enter}');
    cy.get('[data-cy^="pet-tag-"]').should('contain.text', 'NowyTag');

    cy.get('[data-cy^="remove-tag-"]').first().click();
    cy.get('[data-cy^="pet-tag-"]').should('not.exist');

    cy.get('[data-cy="submit-pet"]').click();

    cy.get('simple-snack-bar', {
      includeShadowDom: true,
      timeout: 7000,
    })
      .should('exist')
      .should('contain.text', 'Zwierzę zostało dodane!');
  });

  //Fails because of API id 500
  it('should edit an existing pet', () => {
    cy.get('[data-cy="search-input"]').type('Golden Retriever');
    cy.get('[data-cy^="pet-name-"]').each(($el) => {
      cy.wrap($el).should('contain.text', 'Golden Retriever');
    });
    cy.get('[data-cy^="edit-pet-btn-"]').first().click();
    cy.get('input[formControlName="name"]').clear().type('Updated Pet Name');
    cy.get('[data-cy="pet-photo-0"]')
      .click()
      .clear()
      .type('https://example.com/photo.jpg', { force: true });
    cy.get('button[type="submit"]').click();
    cy.get('simple-snack-bar').should(
      'contain.text',
      'Zwierzę zostało zaktualizowane!'
    );
  });

  it('should delete a pet after confirmation', () => {
    cy.get('[data-cy^="delete-pet-btn-"]').first().click();
    cy.get('[data-cy^="delete-confirm"]').click();
  });

  it('should display the pet details', () => {
    cy.get('[data-cy^="details-pet-btn-"]').first().click();
    cy.get('h2').should('contain.text', 'Szczegóły zwierzęcia');
  });

  it('should paginate through pets', () => {
    cy.get('[data-cy="pagination"]').should('exist');
    cy.get('[data-cy="pagination"]').find('button').last().click();
    cy.wait(500);
    cy.get('[data-cy="pets-table"]').should('exist');
  });

  it('should show "Brak wyników" when search finds no results', () => {
    cy.get('[data-cy="search-input"]').type('NonExistentPet');
    cy.get('[data-cy="pets-table"]').should('exist');
    cy.get('[data-cy="no-results"]').should('contain.text', 'Brak wyników. Spróbuj wyszukać inną nazwę');
    cy.get('[data-cy^="pet-id-"]').should('not.exist');
  });
});

describe('Dark Mode Toggle', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should toggle dark mode', () => {
    cy.get('mat-slide-toggle').should('exist');
    cy.get('mat-slide-toggle').click();
    cy.get('body').should('have.class', 'dark-mode');

    cy.window().then((win) => {
      expect(win.localStorage.getItem('dark-mode')).to.eq('enabled');
    });

    cy.get('mat-slide-toggle').click();
    cy.get('body').should('not.have.class', 'dark-mode');

    cy.window().then((win) => {
      expect(win.localStorage.getItem('dark-mode')).to.eq('disabled');
    });
  });

  it('should remember dark mode after page reload', () => {
    cy.get('mat-slide-toggle').click();
    cy.get('body').should('have.class', 'dark-mode');

    cy.reload();

    cy.get('body').should('have.class', 'dark-mode');

    cy.window().then((win) => {
      expect(win.localStorage.getItem('dark-mode')).to.eq('enabled');
    });

    cy.get('mat-slide-toggle').click();
    cy.get('body').should('not.have.class', 'dark-mode');

    cy.reload();

    cy.get('body').should('not.have.class', 'dark-mode');
  });
});
