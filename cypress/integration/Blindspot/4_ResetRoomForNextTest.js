import 'cypress-file-upload';
import 'cypress-wait-until';
import "cypress-localstorage-commands";

const config = {
	homepage: 'https://blindspotgame.com'
}

const playerName = 'FrisseBlikken'

describe('Blindsport Single Player Mode', () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
	  // Preserve cookie in every test
	  Cypress.Cookies.defaults({
	    preserve: (cookie) => {
	      return true;
	    }
	  })
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });


it('Open the Game', () => {
    cy.visit(config.homepage)
    cy.get('#signupTitle')
        .should('be.visible')
        .and('contain.text', 'Welcome to Blindspot')

//Request Login Link
    cy.contains('Create a room').click()
    cy.get('#leadEmail').clear()
        .type('tapanafax@gmail.com')
    cy.contains('Submit').click()
    cy.get('#general-snackbar-wrapper', {timeout: 50000})
        .should('be.visible')
        .and('contain.text', 'Login link has been sent, please check your e-mail.')
});

//Get Token From Inbox
var token  
it('Login', (done) => {
  (done)
  cy.wait(5000)
  cy.task("gmail:check", {
    subject: "You have succesfuly created a game", // We are looking for 'Activate Your Account' in the subject of the message.
    from: "no-reply@blindspotgame.com", // We are looking for a sender header which is 'no-reply@domain.com'.
    to: "tapanafax@gmail.com", // Which inbox to poll. credentials.json should contain the credentials to it.
    wait_time_sec: 10, // Poll interval (in seconds).
    max_wait_time_sec: 30, // Maximum poll time (in seconds), after which we'll giveup.
    include_body: true
  })
  .then(email => {
    const html = email[0].body.html;
    console.log('html', html)
    var user_pattern = /token=([a-z0-9\-]+)/i
  // Now we attempt the actual match. If successful, user[1] will be the user's name.
  token = html.match(user_pattern)[1]
  done()
  })
})

//Login with valid token
it('Reset the room for next test', () => {
  console.log('token', token)
  cy.visit(config.homepage + '/login?token=' + token)
  cy.url().should('eq', config.homepage + '/setup-profile')

  //Setup Profile
    cy.get('#playerName')
        .clear()
        .type(playerName)
    const filePath = 'img_1317.jpg';
    cy.get('#avatar-upload').attachFile(filePath)
    cy.get('#submit-profile-btn').click()
    cy.waitForResource('Briefing_Option%202-compressed-70.jpg', {timeout: 100000})
    cy.get('#language').select('en')
    cy.waitForResource('Briefing_Option%202-compressed-70.jpg', {timeout: 100000})
    
//Get Ready
    cy.get('.close-info', {timeout: 10000})
      .should('be.visible')
      .click({force: true})
    cy.get('#ready-btn', {timeout: 10000})
      .should('be.visible')
      .and('contain.text', "I'm ready")
      .click()

//Start the game
    cy.contains('Start Game').click()
    cy.get('#start-confirmation-all-players-ready', {timeout: 10000})
        .should('be.visible')
        .and('contain.text', 'Are you sure you want to start the game?')
    cy.get('#force-start', {timeout: 10000})
        .should('be.visible')
        .and('contain.text', 'Start Game')
        .click()

// verify countdown timer is displayed
    cy.get('#general-snackbar-wrapper', {timeout: 50000})
        .should('be.visible')
        .and('contain.text','Start game in')
})

});