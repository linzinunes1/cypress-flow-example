const params = require('../fixtures/flowdata.json')
// Prevent 3rd party script errors from failing tests
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

// Timeout to wait for screens to update before getting elements
// TODO: Watch server requests instead
const delayHack = 700;

Object.keys(params).forEach(function (testname) {
  describe('Flow', () => {
    beforeEach(() => {
      cy.visit('https://creditcards.com?exp=182')
    });

    it('should show the right cards on the results page', () => {
      // Open Flow modal
      cy.get('#flow_button').click();

      // What's your credit score?
      // Select "Excellent" and click "Next"
      cy.get("label[for=" + params[testname][0] + "]").click({force:true});
      cy.get('button').contains('Next').click();

      // What type of card are you looking for?
      // Wait for screen to change (TODO: Watch server requests instead)
      cy.wait(delayHack);
      // Select "Balance Transfer" and click "Next"
      cy.get("label[for=" + params[testname][1] + "]").click({force:true});
      cy.get('button').contains('Next').click();

      // Tell us what cards you already have.
      // Wait for screen to change (TODO: Watch server requests instead)
      cy.wait(delayHack);
      // Click "Next"
      cy.get('button').contains('Next').click();

      // Get the best card recommendation
      // Wait for screen to change (TODO: Watch server requests instead)
      cy.wait(delayHack);
      // Click "Skip Step"
      cy.get('button').contains('Skip Step').click();

      // RESULTS PAGE
      cy.location('pathname', { timeout: 60000 }).should('include', '/results');
      // Wait for screen to change (TODO: Watch server requests instead)
      cy.wait(delayHack);
      // Click "Show more credit cards"
      cy.get('main button').contains('Show more').click();

      // Get product IDs from every "Apply Now" button on the page
      // Make sure all expected products are included
      cy.get('a[data-res-field-apply-now]').then((buttons) => {
        const productIds = Array.from(buttons).map(button => button.name);
        const hasEveryProduct = productIds.every(pid => params[testname][2].includes(Number(pid)));
        console.log(params[testname][2], productIds);
        expect(hasEveryProduct).to.be.true;
      });
    });
  });
});
