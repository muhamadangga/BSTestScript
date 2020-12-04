import 'cypress-file-upload';
import 'cypress-wait-until';

const config = {
	homepage: 'https://blindspotgame.com'
}

const playerName = "Muhamad Angga Subiyantoroooooo"

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
})

it('Verify warning message displayed if user enter game without Team ID', () => {
    cy.get('#join-game').click()
    cy.get('.join-game__error', {timeout: 5000})
      .should('be.visible')
      .and('contain.text', 'Game ID is invalid')
})

it('Verify warning message displayed if user input worng Team ID', () => {
    cy.get('#input-game-code').type('XXXXXX')
    cy.get('#join-game').click()
    cy.get('.join-game__error', {timeout: 5000})
      .should('be.visible')
      .and('contain.text', 'Code is not found')
})

it('Verify user successfully login with valid code', () => {
    cy.readFile('path/to/teamID.txt').then(tim => {
    console.log(tim);
    cy.get('#input-game-code').clear()
      .type(tim)
    cy.get('#join-game').click()
    cy.url().should('eq', config.homepage + '/setup-profile')
    })
})

it('Verify setup profile page is displayed', () =>{
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
    .and('contain.text', "Klaar")
})

it('Verify the member language same as leader after change to Dutch ', () => {
  cy.get('#ready-btn', {timeout: 10000})
    .should('be.visible')
    .and('contain.text', "Klaar")
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
});

it('Verify the message displayed in aspiration wall', () => {
cy.get('.membermessage-content', {timeout: 50000})
  .should('be.visible')
  .and('contain.text', playerName)
});


});