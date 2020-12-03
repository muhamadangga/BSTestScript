import 'cypress-file-upload';
import 'cypress-wait-until';

const config = {
	homepage: 'https://blindspotgame.com'
}

const playerName = 'FrisseBlikken'

describe('Blindsport Login', () => {
  beforeEach(() => {
	  // Preserve cookie in every test
	  Cypress.Cookies.defaults({
	    preserve: (cookie) => {
	      return true;
	    }
	  })
  });

it('Visit the homepage', () => {
    cy.visit(config.homepage)
    cy.get('#signupTitle')
        .should('be.visible')
        .and('contain.text', 'Welcome to Blindspot')
});

it('Verify create a room page is displayed', () => {
    cy.contains('Create a room').click()
    cy.url().should('eq', config.homepage + '/login')
    cy.get('#signupTitle')
        .should('be.visible')
        .and('contain.text', 'Welcome to Blindspot')
});

it('Verify Failed Request Login Link due to email domain not valid', () => {
    cy.get('#leadEmail').clear()
      .type('domain_notregistered@mail.com')
    cy.contains('Submit').click()
      .get('#general-snackbar-wrapper', {timeout: 50000})
      .should('be.visible')
      .and('contain.text', 'Email domain [mail.com] is not registered.')
});

it('Verify user can close error message', () => {
    cy.get('.close-snackbar', {timeout: 50000})
        .should('be.visible')
        .click()
})

it('Verify login link has been send message is displayed', () => {
    cy.get('#leadEmail').clear()
        .type('tapanafax@gmail.com')
    cy.contains('Submit').click()
    cy.get('#general-snackbar-wrapper', {timeout: 50000})
        .should('be.visible')
        .and('contain.text', 'Login link has been sent, please check your e-mail.')
});

it('Verify user can close login link has been send message', () => {
    cy.get('.close-snackbar', {timeout: 50000})
        .should('be.visible')
        .click()
})

it('Verify warning message displayed if user submit without email', () => {
    cy.get('#leadEmail').clear()
    cy.contains('Submit').click()
    cy.get('#email-error', {timeout: 50000})
        .should('be.visible')
        .and('contain.text', 'Invalid email address')
});

it('Verify warning message displayed if user submit invalid email', () => {
    cy.get('#leadEmail').clear()
        .type('invalid.email@')
    cy.contains('Submit').click()
    cy.get('#email-error', {timeout: 50000})
        .should('be.visible')
        .and('contain.text', 'Invalid email address')
});

//Check gmail inbox
var token
it('Get Token From Inbox', (done) => {
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

it('Verify login is failed if user ID not found', () => {
    cy.visit(config.homepage + '/login?token=00a95e65b9e3688ed1aa1ea7db0246f6')
      .get('.error', {timeout: 50000})
      .should('be.visible')
      .and('contain.text', 'User ID not found')   
  })

it('Verify user can close User ID not found message', () => {
    cy.get('.error > .close-snackbar', {timeout: 50000})
        .should('be.visible')
        .click()
})

it('Verify login is failed if Token does not match', () => {
    cy.visit(config.homepage + '/login?token=00a95e65b9e3688ed1aa1ea7db0246f6-155')
      .get('.error', {timeout: 50000})
      .should('be.visible')
      .and('contain.text', 'Token does not match')   
  })

it('Verify user can close Token does not match message', () => {
    cy.get('.error > .close-snackbar', {timeout: 50000})
        .should('be.visible')
        .click()
})

//Login with valid token
it('Verify login successfully if login with valid token', () => {
  console.log('token', token)
  cy.visit(config.homepage + '/login?token=' + token)
  cy.url().should('eq', config.homepage + '/setup-profile')
})

it('Verify setup profile page is displayed', () => {
  cy.url().should('eq', config.homepage + '/setup-profile')
})

it('Verify the Team ID displayed in setup profile page', () => {
    cy.get('#theTeamID').then((teamID) => {
        var tim = teamID.text()
          cy.log(tim)
          cy.writeFile('path/to/teamID.txt', tim)
    })
    cy.readFile('path/to/teamID.txt').then(tim => {
        console.log(tim);
      cy.get('#theTeamID')
        .should('be.visible')
        .and('contain.text', tim)
    })
});

it('Verify Team ID copied message is displayed if user click copy button', () => {
  cy.get('.copy-id-button')
    .click()
  cy.get('#general-snackbar-wrapper', {timeout: 50000})
    .should('be.visible')
    .and('contain.text', 'Team ID copied!')
})

it('Verify user can close Team ID copied mesage', () =>{
  cy.get('.close-snackbar', {timeout: 50000})
    .click()
});

it('Verify the Team ID can be copied', () => {
  cy.get('.copy-id-button').click().then(() => {
    cy.task('getClipboard').then(($clip) => {
         const timID = $clip;
         cy.readFile('path/to/teamID.txt').then(tim => {
         cy.log('this is what was in clipboard', timID);
          console.log(tim);
          expect(tim).to.eq(timID)
          });
     });
 });
});

it('Verify warning message displayed if input string as player name', () => {
    cy.get('#playerName')
        .clear()
        .type('javascript:alert(1)')
    cy.get('#submit-profile-btn').click()
    cy.get('#general-snackbar-wrapper', {timeout: 50000})
        .should('be.visible')
        .and('contain.text', 'Invalid character on user name.')
});

it('Verify user can close warning message', () => {
    cy.get('.close-snackbar', {timeout: 50000}).click()
})

it('Verify user can input player name', () => {
    cy.get('#playerName')
        .clear()
        .type(playerName)
});

//Upload Avatar
it('Verify user can upload avatar', () => {
    const filePath = 'img_1317.jpg';
    cy.get('#avatar-upload').attachFile(filePath)
    cy.get('#submit-profile-btn').click()
   
})

it('Verify the waiting room is displayed', () => {
    cy.url().should('eq',config.homepage +'/waiting-room')
})


it('Verify player name is displayed in room info', () => {
    //cy.visit(config.homepage + '/waiting-room')
    cy.contains('Hi ' + playerName)
})

it('Verify ready button is displayed in waiting room', () => {
    cy.get('#ready-btn', {timeout: 10000})
      .should('be.visible')
      .and('contain.text', "I'm ready")
})

it('Verify close info button is displayed and clickable', () => {
    cy.get('.close-info', {timeout: 10000})
      .should('be.visible')
      .click({force: true})
    // cy.get('.gameroombg').click()
})

it('Verify the Team ID displayed in waiting room', () => {
  cy.readFile('path/to/teamID.txt').then(tim => {
    console.log(tim);
  cy.get('#theTeamID')
    .should('be.visible')
    .and('contain.text', tim)
  //cy.get('.gameroombg').click()
})
});


it('Verify the Team ID can be copied', () => {
  cy.get('.copy-id-button').click().then(() => {
    cy.task('getClipboard').then(($clip) => {
         const timID = $clip;
         cy.log('this is what was in clipboard', timID);
         cy.readFile('path/to/teamID.txt').then(tim => {
          console.log(tim);
        expect(tim).to.eq(timID)
          });
     });
 });
});


it('Verify Team ID copied message is displayed if user click copy button', () => {
  // cy.get('.teamidspan').click('topRight')
  // cy.get('.copy-id-button')
  //   .click()
  // cy.contains('Copy ID').click(left)
  cy.get('#general-snackbar-wrapper', {timeout: 50000})
    .should('be.visible')
    .and('contain.text', 'Team ID copied!')
})

it('Verify user can close Team ID copied mesage', () =>{
  cy.get('.close-snackbar', {timeout: 50000})
    .click()
});

it('Verify player name is displayed in waiting room', () =>{
    cy.get('.member-name', {timeout: 50000})
      .should('be.visible')
      .and('contain.text', playerName)
    cy.get('.gameroombg').click()
})

it('Verify the avatar is displayed in waiting room', () => {
    cy.get('.avatar > img', {timeout: 50000})
      .should('be.visible')
    cy.get('.gameroombg').click()
    // cy.get('div').find('avatar')
    //   .should('have.attr', 'src').should('include','img_1317')
})

it('Verify user can open the message box', () => {
  cy.get('.open-chat-btn').click({force: true})
})

it('Verify user can type message in message box', () => {
  cy.get('#chatField').click({force:true})
    .type(playerName)
});

it('Verify user can hide message before send to wall', () => {
  cy.get('.gameroombg').click()
})

it('Verify user can send the message', () => {
  cy.get('#sendMessage > svg').click({force:true})
})

it('Verify the message displayed in aspiration wall', () => {
  cy.get('.membermessage-content', {timeout: 50000})
    .should('be.visible')
    .and('contain.text', playerName)
})


it('Verify user can change the language to Dutch', () => {
  cy.get('#language').select('nl')
})

it('Verify language correctly change to Dutch', () => {
  cy.get('#language', {timeout: 50000})
    .should('be.visible')
    .and('contain.text', 'Dutch')
})


it('Verify player name is displayed in room info after change language', () => {
  cy.contains('Hi ' + playerName)
})

it('Verify ready button is displayed after change language', () => {
  cy.get('#ready-btn', {timeout: 10000})
    .should('be.visible')
    .and('contain.text', "Klaar")
})

it('Verify close info button is displayed and clickable after change language', () => {
  cy.get('.close-info', {timeout: 10000})
    .should('be.visible')
    .click({force: true})
  // cy.get('.gameroombg').click()
})

it('Verify Team ID copied message is displayed if user click copy button after change language', () => {
// cy.get('.teamidspan').click('topRight')
cy.get('.copy-id-button')
  .click({force: true})
// cy.contains('Copy ID').click(left)
cy.get('#general-snackbar-wrapper', {timeout: 50000})
  .should('be.visible')
  .and('contain.text', 'Team ID copied!')
})

it('Verify user can close Team ID copied mesage after change language', () =>{
cy.get('.close-snackbar', {timeout: 50000})
  .click()
});

it('Verify the Team ID displayed after change language', () => {
cy.readFile('path/to/teamID.txt').then(tim => {
  console.log(tim);
cy.get('#theTeamID')
  .should('be.visible')
  .and('contain.text', tim)
})
});


it('Verify the Team ID can be copied after change language', () => {
cy.get('.copy-id-button').click().then(() => {
  cy.task('getClipboard').then(($clip) => {
       const timID = $clip;
       cy.log('this is what was in clipboard', timID);
       cy.readFile('path/to/teamID.txt').then(tim => {
        console.log(tim);
      expect(tim).to.eq(timID)
        });
   });
});
});

it('Verify player name is displayed in waiting room after change language', () =>{
  cy.get('.member-name', {timeout: 50000})
    .should('be.visible')
    .and('contain.text', playerName)
})

it('Verify the avatar is displayed in waiting room after change language', () => {
  cy.get('.avatar > img', {timeout: 50000})
    .should('be.visible')
  // cy.get('div').find('avatar')
  //   .should('have.attr', 'src').should('include','img_1317')
});

it('Verify user can change the language to English', () => {
  cy.get('#language').select('en')
  cy.get('#language', {timeout: 50000})
    .should('be.visible')
    .and('contain.text', 'English')

  //return to dutch for member checking
  cy.get('#language').select('nl')
})

});