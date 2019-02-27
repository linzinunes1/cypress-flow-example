const params = require('../fixtures/flowdata.json')

Cypress.Commands.add('getFlow', (selector) => {
  return cy.get(`#flow_modal ${selector}`);
});

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

      cy.eyesOpen({
        appName: 'Flow Cypress!',
        testName: 'Flow for Cypress!',
        browser: { width: 800, height: 600 },
      });

    });

    it('should show the right cards on the results page', () => {
      // Open Flow modal
      cy.get('#flow_button').click();

      // What's your credit score?
      // Select "Excellent" and click "Next"
      cy.get("label[for=" + params[testname][0] + "]").click({force:true});
      cy.get('button').contains('Next').click();
      cy.eyesCheckWindow("screen 1")

      // What type of card are you looking for?
      // Wait for screen to change (TODO: Watch server requests instead)
      cy.wait(delayHack);
      // Select "Balance Transfer" and click "Next"
      cy.get("label[for=" + params[testname][1] + "]").click({force:true});
      cy.get('button').contains('Next').click();
      cy.eyesCheckWindow("screen 2")

      // Tell us what cards you already have.
      // Wait for next form element to show up
      cy.getFlow('input[id*="autocomplete"]');
      // Click "Next"
      cy.getFlow('button').contains('Next').click();
      cy.eyesCheckWindow("screen 3")

      // Get the best card recommendation
      // Wait for next form element to show up
      cy.getFlow('input[id*="name"]');
      // Click "Skip Step"
      cy.getFlow('button').contains('Skip Step').click();
      cy.eyesCheckWindow("screen 4")

      // RESULTS PAGE
      cy.location('pathname', { timeout: 60000 }).should('include', '/results');
      // Wait for screen to change (TODO: Watch server requests instead)
      cy.wait(delayHack);
      cy.get("h1.hero__title").should('contain', "These cards are a match!")
      cy.eyesCheckWindow("Results")

      // Click "Show more credit cards"
      try {
        cy.get('main button').contains('Show more').click();
      }catch(err){
        
      }

      // Get product IDs from every "Apply Now" button on the page
      // Make sure all expected products are included
      cy.get('a[data-res-field-apply-now]').then((buttons) => {
        const productIds = Array.from(buttons).map(button => button.name);
        const hasEveryProduct = productIds.every(pid => params[testname][2].includes(Number(pid)));
        console.log(params[testname][0] + params[testname][1] + productIds);
        expect(hasEveryProduct).to.be.true;
      });

      cy.eyesClose(true);
    });
  });
});
