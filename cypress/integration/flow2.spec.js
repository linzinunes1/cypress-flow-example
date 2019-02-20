const params = require('../fixtures/flowdata.json')
const axios = require('axios')
const fs = require('browserify-fs')
const querystring = require('querystring')
const _ = require('lodash')
import promisify from 'cypress-promise'

Object.keys(params).forEach(function (testname) {
    Cypress.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
      return false
    })
    context('Go Through Flow for' + testname, () => {
        beforeEach(() => {
          try {
            cy.visit('https://creditcards.com?exp=182')     
          }
          catch {}
        })
      
        describe('Select Credit Score', async() => {
          it('.should() - make a selection on view one ' +params[testname][0], () =>{
            cy.get('#flow_button').click()
            //cy.eyesCheckWindow("screen 1")
            cy.get("label[for=" + params[testname][0] + "]").click({force:true})
            cy.get(".nexus-button.nexus-button--contained.nexus-button--primary.nexus-button--large").click({force:true})
            cy.wait(700)
            //cy.get(".flow-ccdc-header .flow-ccdc-header__title").contains("What type of card are you looking for?")
           // cy.eyesCheckWindow("screen 2")
            cy.get("label[for=" + params[testname][1] + "]").click({force:true})
            cy.get(".nexus-button.nexus-button--contained.nexus-button--primary.nexus-button--large").click({force:true})
            cy.wait(300)
            //cy.get(".flow-ccdc-header .flow-ccdc-header__title").contains("Tell us what cards you already have.")
            //cy.eyesCheckWindow("screen 3")
            cy.wait(300)
            cy.get(".nexus-button.nexus-button--contained.nexus-button--primary.nexus-button--large").click({force:true})
            cy.wait(300)
            cy.get("h1.flow-ccdc-header__title").contains("Get the best card recommendation")
            //cy.eyesCheckWindow("screen 4")
            cy.get(".flow-ccdc-buttons__button.flow-ccdc-buttons__button--pull-right.nexus-button--text.nexus-button").click({force:true})
            cy.get("h1.hero__title").contains("These cards are a match!")
            const listOfIds = []
            cy.get("button.show-more").click()
              for (let i = 1; i <= 3; i++) {
                    for (let it = 1; it <= 3; it++) {
                        cy.get (".results-wrapper .results-grid:nth-of-type("+i+") .results__card:nth-of-type("+it+") .card__apply-button").scrollIntoView().should('be.visible').invoke('attr', 'name').then(($button) => {
                        listOfIds.push($button)
                        })
                    }
                }
            
            expect(listOfIds).to.not.be.null
            
           
              
          cy.eyesClose(true)
          })
        })
    })

});
