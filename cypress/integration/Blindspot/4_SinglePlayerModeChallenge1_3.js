import 'cypress-file-upload';
import 'cypress-wait-until';
import "cypress-localstorage-commands";

const config = {
	homepage: 'https://blindspotgame.com'
}

const playerName = 'FrisseBlikken'

describe('Blindsport Single Player Mode', () => {
  before(() => {
    cy.clearCookies()
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

  after(() => {
    cy.getCookie('october_session')
        .should('have.property', 'value')
        .then((cookie) => {
    // cookieValue = cookie.value;
    // YOU SHOULD CONSUME `cookieValue` here
    // .. go ahead inside this `then` callback
            cy.log(cookie);
            cy.writeFile('path/to/cookie.txt', cookie)
        })
    
  })


//=================================================cy.waitForResource()=================================================
// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="Cypress" />

/**
 * Adds command "cy.waitForResource(name)" that checks performance entries
 * for resource that ends with the given name.
 * This command only applies to the tests in this spec file
 *
 * @see_https://developers.google.com/web/tools/chrome-devtools/network/understanding-resource-timing
 */
Cypress.Commands.add('waitForResource', (name, options = {}) => {
    cy.log(`Waiting for resource ${name}`)
  
    const log = false // let's not log inner commands
    const timeout = options.timeout || Cypress.config('defaultCommandTimeout')
  
    cy.window({ log }).then(
      // note that ".then" method has options first, callback second
      // https://on.cypress.io/then
      { log, timeout },
      (win) => {
        return new Cypress.Promise((resolve, reject) => {
          let foundResource
  
          // control how long we should try finding the resource
          // and if it is still not found. An explicit "reject"
          // allows us to show nice informative message
          setTimeout(() => {
            if (foundResource) {
              // nothing needs to be done, successfully found the resource
              return
            }
  
            clearInterval(interval)
            reject(new Error(`Timed out waiting for resource ${name}`))
          }, timeout)
  
          const interval = setInterval(() => {
            foundResource = win.performance
            .getEntriesByType('resource')
            .find((item) => item.name.endsWith(name))
  
            if (!foundResource) {
              // resource not found, will try again
              return
            }
  
            clearInterval(interval)
            // because cy.log changes the subject, let's resolve the returned promise
            // with log + returned actual result
            resolve(
              cy.log('✅ success').then(() => {
                // let's resolve with the found performance object
                // to allow tests to inspect it
                return foundResource
              })
            )
          }, 100)
        })
      }
    )
  })

  //=================================================cy.waitForResource()=================================================




it('Visit the homepage', () => {
    cy.visit(config.homepage)
    cy.get('#signupTitle')
        .should('be.visible')
        .and('contain.text', 'Welcome to Blindspot')
});

it('Request Login Link', () => {
    cy.contains('Create a room').click()
    cy.get('#leadEmail').clear()
        .type('tapanafax@gmail.com')
    cy.contains('Submit').click()
    cy.get('#general-snackbar-wrapper', {timeout: 50000})
        .should('be.visible')
        .and('contain.text', 'Login link has been sent, please check your e-mail.')
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

//Login with valid token
it('Login with valid token', () => {
  console.log('token', token)
  cy.visit(config.homepage + '/login?token=' + token)
  cy.url().should('eq', config.homepage + '/setup-profile')

})

it('Setup Profile', () => {
    cy.get('#playerName')
        .clear()
        .type(playerName)
    const filePath = 'img_1317.jpg';
    cy.get('#avatar-upload').attachFile(filePath)
    cy.get('#submit-profile-btn').click()
   
})

it('Get Ready', () => {
    cy.get('.close-info', {timeout: 10000})
      .should('be.visible')
      .click({force: true})
    cy.get('#ready-btn', {timeout: 10000})
      .should('be.visible')
      .and('contain.text', "I'm ready")
      .click()
});

it('Start the game', () => {
    cy.contains('Start Game').click()
    cy.get('#start-confirmation-all-players-ready', {timeout: 10000})
        .should('be.visible')
        .and('contain.text', 'Are you sure you want to start the game?')
    cy.get('#force-start', {timeout: 10000})
        .should('be.visible')
        .and('contain.text', 'Start Game')
        .click()
});

it('verify countdown timer is displayed', () => {
    cy.get('#general-snackbar-wrapper', {timeout: 50000})
        .should('be.visible')
        .and('contain.text','Start game in')
})

it('Verify Welcome message is displayed', () => {
    
    cy.get('.gsc-inner', {timeout: 100000})
        .should('be.visible')
        .and('contain.text', 'Welcome to Blindspot')
    
});

it('Verify next button in welcome message functionality', () => {
    cy.contains('Next').click();
});

it('Verify introduction video is displayed', () => {
    cy.get('.gsc-inner', {timeout: 100000})
        .should('be.visible')
    cy.wait(10000)
});

it('Verify next button in introduction video functionality', () => {
    cy.get('.next-btn', {timeout: 50000})
       .should('be.visible')
       .and('contain.text', 'Next')
       .click();
});

it('Verify Day 0 introduction message is displayed', () => {
    cy.get('.gsc-inner', {timeout: 100000})
        .should('be.visible')
        .and('contain.text', 'You and your team are on the boat on the way to the island')
});

it('Verify next button in Day 0 introduction functionality', () => {
    //cy.contains('Next').click();
    cy.get('.next-btn', {timeout: 50000})
       .should('be.visible')
       .and('contain.text', 'Next')
       .click();
});

it('Verify Day 0 Beriefing message is displayed', () => {
    cy.get('.brief-inner', {timeout: 100000})
        .should('be.visible')
        .and('contain.text', 'Getting up to speed')
})

it('Verify Day 0 Briefing message can be scroll', () => {
    cy.get('.brief-inner').scrollTo('bottom')
})

it('Verify Start Challenge button is displayed', () => {
    cy.get('#start-challenge-in-briefing', {timeout: 50000})
        .should('be.visible')
        .and('contain.text', 'Start Challenge')
})

it('Verify Start Challenge button functionality', () => {
    cy.get('#start-challenge-in-briefing').click()
    cy.get('.brief-inner')
        .should('not.be.visible')
})

it('Verify the 1st tutorial in individual answer is displayed', () => {
    cy.get('#tutor-brief > .tutor-inner', {timeout: 100000})
        .should('be.visible')
        .and('contain.text', "(1/5)")
    cy.get('#tutor-brief > .close-tutor').click();
})

it('Verify the 2nd tutorial in individual answer is displayed', () => {
    cy.get('#tutor-timer > .tutor-inner', {timeout: 100000})
        .should('be.visible')
        .and('contain.text', "(2/5)")
    cy.get('#tutor-timer > .close-tutor').click();
})

it('Verify the 3rd tutorial in individual answer is displayed', () => {
    cy.get('#tutor-zoom > .tutor-inner', {timeout: 100000})
        .should('be.visible')
        .and('contain.text', "(3/5)")
    cy.get('#tutor-zoom > .close-tutor').click();
})

it('Verify the 4th tutorial in individual answer is displayed', () => {
    cy.get('#tutor-arrow > .tutor-inner', {timeout: 100000})
        .should('be.visible')
        .and('contain.text', "(4/5)")
    cy.get('#tutor-arrow > .close-tutor').click();
})

it('Verify zoom button functionality', () =>{
    // we can wait for the <img> element to appear
    // but the image has not been loaded yet.
    cy.get('.answer-item.imSlide-item img')
    cy.waitForResource('kernwaardenhappiness-authenticity-compressed-70.png', {timeout: 100000})
    //     .find("img")
    //     .should('be.visible')
    //     .and(($img) => {
    // // "naturalWidth" and "naturalHeight" are set when the image loads
    // expect($img[0].naturalWidth).to.be.greaterThan(0)
    // })
    // cy.wait(15000)
    cy.get('.slick-current > :nth-child(1) > .answer-item > .zoom-detail', {timeout: 50000})
        .should('be.visible')
        .click()
    cy.get('.embedMedia', {timeout: 50000})
        .should('be.visible')
})

it('Verify cloose button in image functionality', () => {
    cy.get('.close-idb', {timeout: 50000}).click()
    cy.get('.embedMedia')
        .should('not.exist')

});

it('Verify the slide button functionlity', () => {
    cy.get('.slick-next').click()
        .trigger('change')
})

it('Verify select the answer functionality', () => {
    cy.get('#answer-1', {timeout: 50000})
        .should('be.visible')
        .click()
    //.find('span')
    //cy.get('*[class^="choose-answer"]', {timeout: 50000})
    //.should('have.class', 'btn-primary')
})


it('Verify the 5th tutorial in individual answer is displayed', () => {
    cy.get('#tutorial-wrapper > #tutor-submit > .tutor-inner', {timeout: 100000})
        .should('be.visible')
        .and('contain.text', "(5/5)")
    cy.get('#tutorial-wrapper > #tutor-submit > .close-tutor').click();
})

it('Verify submit answer button functionality', () => {
    cy.get('.next-btn', {timeout: 50000})
        .should('be.visible')
        .and('contain.text', 'Submit Answer')
        .click()
})

it('Verify the 1st tutorial in group answer is displayed', () => {
    cy.waitForResource('challenge-1-game.jpg', {timeout: 100000})
    cy.get('#tutor-main > .tutor-inner', {timeout: 100000})
        .should('be.visible')
        .and('contain.text', "(1/3)")
    cy.get('#tutor-main > .close-tutor').click();
})


it('Verify the 2nd tutorial in group answer is displayed', () => {
    cy.get('#tutor-popup > .tutor-inner', {timeout: 100000})
        .should('be.visible')
        .and('contain.text', "(2/3)")
    cy.get('#tutor-popup > .close-tutor').click();
})

it('Verify the 3rd tutorial in group answer is displayed', () => {
    cy.get('#tutor-submit > .tutor-inner', {timeout: 100000})
        .should('be.visible')
        .and('contain.text', "(3/3)")
    cy.get('#tutor-submit > .close-tutor').click();
})

it('Verify selected individual answer displayed in group answer ', () => {
    cy.get('*[class^="answerbox-item answer-item selected"]', {timeout: 100000})  
        .find('div')  
        .should('have.class', 'answer-count').find('span')
        .should('have.class', 'number').and('contain.text', '1')
    // cy.get('#answer-1', {timeout: 10000})
    //     .should('be.visible')
    //     .should('have.class', 'number')
    //     .and('contain.text', '1')
    // cy.get('*[class^="answer-count"]', {timeout: 50000})
    //     .find('span')
    //     .should('have.class', 'number')
    //     .and('contain.text', '1')
    //.and('contain.text', 'you')
    // cy.contains('you', {timeout: 1000000})

})

it('Verify submit group answer fuctionality', () => {
    cy.wait(3000)
    cy.get('.input-group-answer', {timeout:10000})
        .should('be.visible')
        .click()
})

it('Verify the 1st tutorial in feedback screen is displayed', () => {
    cy.get('#tutor-earned > .tutor-inner', {timeout: 100000})
        .should('be.visible')
        .and('contain.text', "(1/2)")
    cy.get('#tutor-earned > .close-tutor').click();
})


it('Verify the 2nd tutorial in feedback screen is displayed', () => {
    cy.get('#tutor-progression > .tutor-inner', {timeout: 100000})
        .should('be.visible')
        .and('contain.text', "(2/2)")
    cy.get('#tutor-progression > .close-tutor').click();

    //var storages = JSON.stringify(Object.keys(localStorage))
    var storages = JSON.parse(JSON.stringify(localStorage))
    cy.writeFile('path/to/storages.json', storages);
});

it('Verify the feedback message is displayed in feedback screen', () => {
    cy.get('.scl-row > :nth-child(1)', {timeout: 50000})
        .should('be.visible')
        .and('contain.text', 'Response from the UFC')
})

it('Verify earned vote displayed in feedback screen', () =>{
    cy.get('#votes-earned', {timeout:10000})
        .should('be.visible')
        .and('contain.text', '1')
})

it('Verify next button functionality in feedback screen challenge 0', () => {
    cy.waitForResource('feedback.jpg', {timeout: 100000})
    cy.wait(3000)
    cy.get('.next-btn', {timeout: 50000})
        // .should('be.visible')
        // .and('contain.text', 'Next')
        .click()
});

it('Verify Day 1 Introduction is displayed', () => {
    cy.waitForResource('puzzle-compressed-70.jpg', {timeout: 100000})
    cy.get('h3 > strong', {timeout: 100000})
        .should('be.visible')
        .and('contain.text', 'Day 1')
    cy.get('.gsc-inner > :nth-child(3)', {timeout: 100000})
        .should('be.visible')
        .and('contain.text', 'You just arrived on the island, but you have a problem')
})

it('Verify next button functionality in Day 1 Introduction', () =>{
    cy.get('.next-btn', {timeout: 50000})
        .should('be.visible')
        .and('contain.text', 'Next')
        .click()
})


it('Verify Day 1 Beriefing message is displayed', () => {
    cy.get('.brief-inner', {timeout: 100000})
        .should('be.visible')
        .and('contain.text', 'Lead Project Manager')
})

it('Verify Day 1 Briefing message can be scroll', () => {
    cy.get('.brief-inner').scrollTo('bottom')
})

it('Verify Day 1 Start Challenge button is displayed', () => {
    cy.get('#start-challenge-in-briefing', {timeout: 50000})
        .should('be.visible')
        .and('contain.text', 'Start Challenge')
})

it('Verify Day 1 Start Challenge button functionality', () => {
    cy.get('#start-challenge-in-briefing').click()
    cy.get('.brief-inner')
        .should('not.be.visible')
})

it('Verify the 1st tutorial in individual answer is not displayed', () => {
    cy.get('#tutor-brief > .tutor-inner', {timeout: 100000})
        .should('not.be.visible')
})

it('Verify the 2nd tutorial in individual answer is not displayed', () => {
    cy.get('#tutor-timer > .tutor-inner', {timeout: 100000})
        .should('not.be.visible')
})

it('Verify the 3rd tutorial in individual answer is not displayed', () => {
    cy.get('#tutor-zoom > .tutor-inner', {timeout: 100000})
        .should('not.be.visible')
})

it('Verify the 4th tutorial in individual answer is not displayed', () => {
    cy.get('#tutor-arrow > .tutor-inner', {timeout: 100000})
        .should('not.be.visible')
})

it('Verify zoom button functionality', () =>{
    cy.waitForResource('Summary_PaulCarter-compressed-70.png', {timeout: 100000})
    cy.get('.slick-current > :nth-child(1) > .answer-item > .zoom-detail', {timeout: 50000})
        .should('be.visible')
        .click()
    cy.get('.embedMedia', {timeout: 50000})
        .should('be.visible')
})

it('Verify cloose button in image functionality', () => {
    cy.get('.close-idb', {timeout: 50000}).click()
    cy.get('.embedMedia')
        .should('not.exist')

});

it('Verify the slide button functionlity', () => {
    cy.get('.slick-next').click()
        .trigger('change')
})

it('Verify select the answer functionality', () => {
    cy.get('#answer-1', {timeout: 50000})
        .should('be.visible')
        .click()
})


it('Verify the 5th tutorial in individual answer is not displayed', () => {
    cy.get('#tutorial-wrapper > #tutor-submit > .tutor-inner', {timeout: 100000})
        .should('not.be.visible')
})


it('Verify submit answer button functionality', () => {
    cy.get('.next-btn', {timeout: 50000})
        .should('be.visible')
        .and('contain.text', 'Submit Answer')
        .click()
})

it('Verify the 1st tutorial in group answer is not displayed', () => {
    cy.wait(5000)
    cy.waitForResource('challenge-1-game.jpg', {timeout: 100000})
    cy.get('#tutor-main > .tutor-inner', {timeout: 100000})
        .should('not.be.visible')
})


it('Verify the 2nd tutorial in group answer is not displayed', () => {
    cy.get('#tutor-popup > .tutor-inner', {timeout: 100000})
        .should('not.be.visible')
})

it('Verify the 3rd tutorial in group answer is not displayed', () => {
    cy.get('#tutor-submit > .tutor-inner', {timeout: 100000})
        .should('not.be.visible')
})

it('Verify selected individual answer displayed in group answer ', () => {
    cy.get('*[class^="answerbox-item answer-item selected"]', {timeout: 100000})  
        .find('div')  
        .should('have.class', 'answer-count').find('span')
        .should('have.class', 'number').and('contain.text', '1')
    
})


it('Verify submit group answer fuctionality', () => {
    cy.wait(3000)
    cy.get('.input-group-answer', {timeout:10000})
        .should('be.visible')
        .click()
})

it('Verify the 1st tutorial in feedback screen is not displayed', () => {
    cy.get('#tutor-earned > .tutor-inner', {timeout: 100000})
        .should('not.be.visible')
})


it('Verify the 2nd tutorial in feedback screen is not displayed', () => {
    cy.get('#tutor-progression > .tutor-inner', {timeout: 100000})
        .should('not.be.visible')
})

it('Verify the feedback message is displayed in feedback screen', () => {
    cy.get('.scl-row > :nth-child(1)', {timeout: 100000})
        .should('be.visible')
        .and('contain.text', 'Response from the UFC')
})

// it('Verify start vote correctly displayed', () => {
//     cy.get('#stat-number')
//         .should('be.visible')
//         .and('contain.text', '3')
// })

it('Verify earned vote displayed in feedback screen', () =>{
    cy.get('#votes-earned', {timeout:100000})
        .should('be.visible')
        .and('contain.text', '6')
})

it('Verify next button functionality in feedback screen challenge 1', () => {
    //cy.waitForResource('feedback.jpg', {timeout: 100000})
    cy.wait(3000)
    cy.get('.next-btn', {timeout: 100000})
        // .should('be.visible')
        // .and('contain.text', 'Next')
        .click()
});

it('Verify Day 1 - Reaction Lead Project Manager is displayed', () => {
    cy.waitForResource('wheelchair-compressed-70.jpg', {timeout: 100000})
    cy.get('strong', {timeout: 100000})
        .should('be.visible')
        .and('contain.text', "The Lead Project Manager is already onboarding in the team and has sent you a quick message")
})


it('Verify next button functionality in Day 1 - Reaction Lead Project Manager', () =>{
    cy.get('.next-btn', {timeout: 100000})
        .should('be.visible')
        .and('contain.text', 'Next')
        .click()
})


it('Verify Day 2 Introduction is displayed', () => {
    cy.waitForResource('people-compressed-70.jpg', {timeout: 100000})
    cy.get('strong', {timeout: 100000})
        .should('be.visible')
        .and('contain.text', 'Day 2')
        cy.get('p > span', {timeout: 100000})
        .should('be.visible')
        .and('contain.text', 'When you arrive at the island you are confronted')
})

it('Verify next button functionality in Day 2 Introduction', () =>{
    cy.get('.next-btn', {timeout: 100000})
        .should('be.visible')
        .and('contain.text', 'Next')
        .click()
})


it('Verify Day 2 Beriefing message is displayed', () => {
    cy.waitForResource('blindspot-heatmaps-en-1-1-compressed-70.png', {timeout: 100000})
    cy.get('.brief-inner', {timeout: 100000})
        .should('be.visible')
        .and('contain.text', 'The protest')
})

it('Verify Day 2 Briefing message can be scroll', () => {
    cy.get('.brief-inner').scrollTo('bottom')
})

it('Verify Day 2 Start Challenge button is displayed', () => {
    cy.get('#start-challenge-in-briefing', {timeout: 100000})
        .should('be.visible')
        .and('contain.text', 'Start Challenge')
})

it('Verify Day 2 Start Challenge button functionality', () => {
    cy.get('#start-challenge-in-briefing').click()
    cy.get('.brief-inner')
        .should('not.be.visible')
})

it('Verify Chairman button funtionality', () => {
    cy.get('[data-id="1"]')
        .click()
    cy.get('.active', {timeout:100000})
        .should('be.visible')
    cy.waitForResource('ChairmanEN1-compressed-70.png', {timeout: 100000})
})

it('Verify close Chairman button functionality', () => {
    cy.get('.close-hp', {timeout: 100000}) 
        .should('be.visible')
        .click({force:true})
})

it('Verify choose Chairman button functionality', () => {
    cy.get('[data-id="1"]').click()
    cy.get('.active > .hp-header', {timeout: 100000})
        .should('be.visible')
        .click()
    cy.get('.active', {timeout:100000})   
        .should('not.be.visible')
    cy.get('.hotspot-item.selected')
        .should('be.visible')
});


it('Verify Leader Project Manager button funtionality', () => {
    cy.get('[data-id="2"]')
        .click()
    cy.get('.active', {timeout:100000})
        .should('be.visible')
    cy.waitForResource('ProjectLeadEn1-compressed-70.png', {timeout: 100000})
})

it('Verify close Leader Project Manager button functionality', () => {
    cy.get('.close-hp', {timeout: 50000}) 
        .should('be.visible')
        .click({force:true})
})

it('Verify choose Leader Project Manager button functionality', () => {
    cy.get('[data-id="2"]').click()
    cy.get('.active > .hp-header', {timeout: 100000})
        .should('be.visible')
        .click()
    cy.get('.active', {timeout:100000})   
        .should('not.be.visible')
    cy.get('.hotspot-item.selected')
        .should('be.visible')
});


it('Verify Assistant button funtionality', () => {
    cy.get('[data-id="3"]')
        .click()
    cy.get('.active', {timeout:100000})
        .should('be.visible')
    cy.waitForResource('AssistantEn1-compressed-70.png', {timeout: 100000})
})

it('Verify close Assistant button functionality', () => {
    cy.get('.close-hp', {timeout: 100000}) 
        .should('be.visible')
        .click({force:true})
})

it('Verify choose Assistant button functionality', () => {
    cy.get('[data-id="3"]').click()
    cy.get('.active > .hp-header', {timeout: 100000})
        .should('be.visible')
        .click()
    cy.get('.active', {timeout:100000})   
        .should('not.be.visible')
    cy.get('.hotspot-item.selected')
        .should('be.visible')
});

it('Verify submit answer button functionality', () => {
    cy.get('.next-btn', {timeout:100000})
        .should('be.visible')
        .click()
});


it('Verify the 1st tutorial in group answer is not displayed', () => {
    cy.get('#tutor-main > .tutor-inner', {timeout: 100000})
        .should('not.be.visible');
})


it('Verify the 2nd tutorial in group answer is not displayed', () => {
    cy.get('#tutor-popup > .tutor-inner', {timeout: 100000})
        .should('not.be.visible');
})

it('Verify the 3rd tutorial in group answer is not displayed', () => {
    cy.get('#tutor-submit > .tutor-inner', {timeout: 100000})
        .should('not.be.visible');
})

it('Verify selected individual answer displayed in group answer ', () => {
    cy.get('*[class^="answerbox-item answer-item selected"]', {timeout: 100000})  
        .find('div')  
        .should('have.class', 'answer-count').find('span')
        .should('have.class', 'number').and('contain.text', '1')
    
})

it('Verify submit group answer fuctionality', () => {
    cy.wait(3000)
    cy.get('.input-group-answer', {timeout:100000})
        .should('be.visible')
        .click()
})

it('Verify Day 2 - Situation 1 - Assistant is displayed', () => {
    cy.waitForResource('menigte-compressed-70.jpg', {timeout: 100000})
    cy.get('.gsc-inner', {timeout: 100000})
        .should('be.visible')
        .and('contain.text', 'The speakers address their own part of the crowd for a while')

});

it('Verify next button functionality in Day 2 - Situation 1 - Assistant', () => {
    cy.get('.next-btn', {timeout:100000})
        .should('be.visible')
        .and('contain.text', 'Next')
        .click()
});


it('Verify Day 2 - Situation 2 Beriefing message is displayed', () => {
    cy.waitForResource('blindspot-heatmaps-en-2-1-compressed-70.jpg', {timeout: 100000})
    cy.get('.brief-inner', {timeout: 100000})
        .should('be.visible')
        .and('contain.text', 'The protest')
})

it('Verify Day 2 - Situation 2 Briefing message can be scroll', () => {
    cy.get('.brief-inner').scrollTo('bottom')
})

it('Verify Day 2 - Situation 2 Start Challenge button is displayed', () => {
    cy.get('#start-challenge-in-briefing', {timeout: 100000})
        .should('be.visible')
        .and('contain.text', 'Start Challenge')
})

it('Verify Day 2 - Situation 2 Start Challenge button functionality', () => {
    cy.get('#start-challenge-in-briefing').click()
    cy.get('.brief-inner')
        .should('not.be.visible')
})

it('Verify Chairman button funtionality', () => {
    cy.waitForResource('ChairmanEn2-compressed-70.png', {timeout: 100000})
    cy.get('[data-id="1"]')
        .click()
    cy.get('.active', {timeout:100000})
        .should('be.visible')
})

it('Verify close Chairman button functionality', () => {
    cy.get('.close-hp', {timeout: 100000}) 
        .should('be.visible')
        .click({force:true})
})

it('Verify choose Chairman button functionality', () => {
    cy.get('[data-id="1"]').click()
    cy.get('.active > .hp-header', {timeout: 100000})
        .should('be.visible')
        .click()
    cy.get('.active', {timeout:100000})   
        .should('not.be.visible')
    cy.get('.hotspot-item.selected')
        .should('be.visible')
});


it('Verify Leader Project Manager button funtionality', () => {
    cy.waitForResource('ProjectLeadEN2-compressed-70.png', {timeout: 100000})
    cy.get('[data-id="2"]')
        .click()
    cy.get('.active', {timeout:100000})
        .should('be.visible')
})

it('Verify close Leader Project Manager button functionality', () => {
    cy.get('.close-hp', {timeout: 100000}) 
        .should('be.visible')
        .click({force:true})
})

it('Verify choose Leader Project Manager button functionality', () => {
    cy.get('[data-id="2"]').click()
    cy.get('.active > .hp-header', {timeout: 100000})
        .should('be.visible')
        .click()
    cy.get('.active', {timeout:100000})   
        .should('not.be.visible')
    cy.get('.hotspot-item.selected')
        .should('be.visible')
});


it('Verify Assistant button funtionality', () => {
    cy.waitForResource('AssistantEN2-compressed-70.png', {timeout: 100000})
    cy.get('[data-id="3"]')
        .click()
    cy.get('.active', {timeout:100000})
        .should('be.visible')
})

it('Verify close Assistant button functionality', () => {
    cy.get('.close-hp', {timeout: 100000}) 
        .should('be.visible')
        .click({force:true})
})

it('Verify choose Assistant button functionality', () => {
    cy.get('[data-id="3"]').click()
    cy.get('.active > .hp-header', {timeout: 100000})
        .should('be.visible')
        .click()
    cy.get('.active', {timeout:100000})   
        .should('not.be.visible')
    cy.get('.hotspot-item.selected')
        .should('be.visible')
});

it('Verify submit answer button functionality', () => {
    cy.get('.next-btn', {timeout:100000})
        .should('be.visible')
        .click()
});


it('Verify the 1st tutorial in group answer is not displayed', () => {
    cy.get('#tutor-main > .tutor-inner', {timeout: 100000})
        .should('not.be.visible');
})


it('Verify the 2nd tutorial in group answer is not displayed', () => {
    cy.get('#tutor-popup > .tutor-inner', {timeout: 100000})
        .should('not.be.visible');
})

it('Verify the 3rd tutorial in group answer is not displayed', () => {
    cy.get('#tutor-submit > .tutor-inner', {timeout: 100000})
        .should('not.be.visible');
})

it('Verify selected individual answer displayed in group answer ', () => {
    cy.get('*[class^="answerbox-item answer-item selected"]', {timeout: 100000})  
        .find('div')  
        .should('have.class', 'answer-count').find('span')
        .should('have.class', 'number').and('contain.text', '1')
    
})

it('Verify submit group answer fuctionality', () => {
    cy.wait(3000)
    cy.get('.input-group-answer', {timeout:100000})
        .should('be.visible')
        .click()
})


it('Verify Day 2 - Situation 2 - Assistant is displayed', () => {
    cy.waitForResource('demonstranten-compressed-70.jpg', {timeout: 100000})
    cy.get('.gsc-inner', {timeout: 100000})
        .should('be.visible')
        .and('contain.text', 'You observe the crowd vigilantly, making sure no bad actors tag along')

});

it('Verify next button functionality in Day 2 - Situation 2 - Assistant', () => {
    cy.get('.next-btn', {timeout:100000})
        .should('be.visible')
        .and('contain.text', 'Next')
        .click()
});


it('Verify Day 2 - Situation 3 Beriefing message is displayed', () => {
    cy.get('.brief-inner', {timeout: 100000})
        .should('be.visible')
        .and('contain.text', 'The protest')
})

it('Verify Day 2 - Situation 3 Briefing message can be scroll', () => {
    cy.get('.brief-inner').scrollTo('bottom')
})

it('Verify Day 2 - Situation 3 Start Challenge button is displayed', () => {
    cy.get('#start-challenge-in-briefing', {timeout: 100000})
        .should('be.visible')
        .and('contain.text', 'Start Challenge')
})

it('Verify Day 2 - Situation 3 Start Challenge button functionality', () => {
    cy.get('#start-challenge-in-briefing').click()
    cy.get('.brief-inner')
        .should('not.be.visible')
})

it('Verify Chairman button funtionality', () => {
    cy.get('[data-id="1"]')
        .click()
    cy.get('.active', {timeout:100000})
        .should('be.visible')
})

it('Verify close Chairman button functionality', () => {
    cy.get('.close-hp', {timeout: 100000}) 
        .should('be.visible')
        .click({force:true})
})

it('Verify choose Chairman button functionality', () => {
    cy.get('[data-id="1"]').click()
    cy.get('.active > .hp-header', {timeout: 100000})
        .should('be.visible')
        .click()
    cy.get('.active', {timeout:100000})   
        .should('not.be.visible')
    cy.get('.hotspot-item.selected')
        .should('be.visible')
});


it('Verify Leader Project Manager button funtionality', () => {
    cy.get('[data-id="2"]')
        .click()
    cy.get('.active', {timeout:100000})
        .should('be.visible')
})

it('Verify close Leader Project Manager button functionality', () => {
    cy.get('.close-hp', {timeout: 100000}) 
        .should('be.visible')
        .click({force:true})
})

it('Verify choose Leader Project Manager button functionality', () => {
    cy.get('[data-id="2"]').click()
    cy.get('.active > .hp-header', {timeout: 100000})
        .should('be.visible')
        .click()
    cy.get('.active', {timeout:100000})   
        .should('not.be.visible')
    cy.get('.hotspot-item.selected')
        .should('be.visible')
});


it('Verify Assistant button funtionality', () => {
    cy.get('[data-id="3"]')
        .click()
    cy.get('.active', {timeout:100000})
        .should('be.visible')
})

it('Verify close Assistant button functionality', () => {
    cy.get('.close-hp', {timeout: 100000}) 
        .should('be.visible')
        .click({force:true})
})

it('Verify choose Assistant button functionality', () => {
    cy.get('[data-id="3"]').click()
    cy.get('.active > .hp-header', {timeout: 100000})
        .should('be.visible')
        .click()
    cy.get('.active', {timeout:100000})   
        .should('not.be.visible')
    cy.get('.hotspot-item.selected')
        .should('be.visible')
});

it('Verify submit answer button functionality', () => {
    cy.get('.next-btn', {timeout:10000})
        .should('be.visible')
        .click()
});


it('Verify the 1st tutorial in group answer is not displayed', () => {
    cy.get('#tutor-main > .tutor-inner', {timeout: 100000})
        .should('not.be.visible');
})


it('Verify the 2nd tutorial in group answer is not displayed', () => {
    cy.get('#tutor-popup > .tutor-inner', {timeout: 100000})
        .should('not.be.visible');
})

it('Verify the 3rd tutorial in group answer is not displayed', () => {
    cy.get('#tutor-submit > .tutor-inner', {timeout: 100000})
        .should('not.be.visible');
})

it('Verify selected individual answer displayed in group answer ', () => {
    cy.get('*[class^="answerbox-item answer-item selected"]', {timeout: 100000})  
        .find('div')  
        .should('have.class', 'answer-count').find('span')
        .should('have.class', 'number').and('contain.text', '1')
    
})

it('Verify submit group answer fuctionality', () => {
    cy.wait(3000)
    cy.get('.input-group-answer', {timeout:10000})
        .should('be.visible')
        .click()
})

it('Verify the 1st tutorial in feedback screen is not displayed', () => {
    cy.waitForResource('feedback.jpg', {timeout: 100000})
    cy.wait(3000)
    cy.get('#tutor-earned > .tutor-inner', {timeout: 100000})
        .should('not.be.visible');
})


it('Verify the 2nd tutorial in feedback screen is not displayed', () => {
    cy.get('#tutor-progression > .tutor-inner', {timeout: 100000})
        .should('not.be.visible');
})

it('Verify the feedback message is displayed in feedback screen', () => {
    cy.get('.scl-row > :nth-child(1)', {timeout: 50000})
        .should('be.visible')
        .and('contain.text', 'Response from the UFC')
})

it('Verify earned vote displayed in feedback screen', () =>{
    cy.get('#votes-earned', {timeout:10000})
        .should('be.visible')
        .and('contain.text', '+0')
})

it('Verify next button functionality in feedback screen ', () => {
    cy.waitForResource('feedback.jpg', {timeout: 100000})
    cy.wait(3000)
    cy.get('.next-btn', {timeout: 50000})
        // .should('be.visible')
        // .and('contain.text', 'Next')
        .click()
});


it('Verify Day 2 - End is displayed', () => {
    cy.waitForResource('challenge-1-game.jpg', {timeout: 100000})
    cy.get('.gsc-inner', {timeout: 100000})
        .should('be.visible')
        .and('contain.text', 'The last protesters have returned to home. It should be obvious that people are still not happy with the current state of the healthcare system.')

});

it('Verify next button functionality in Day 2 - End', () => {
    cy.get('.next-btn', {timeout:100000})
        .should('be.visible')
        .and('contain.text', 'Next')
        .click()
});



it('Verify Day 3 - Introduction is displayed', () => {
    cy.waitForResource('talking-compressed-70.jpg', {timeout: 100000})
    cy.get('.gsc-inner', {timeout: 100000})
        .should('be.visible')
        .and('contain.text', 'Of course, managing a demonstration well does not solve the problem at the root of the demonstration.')
    cy.get('strong', {timeout: 100000})
        .should('be.visible')
        .and('contain.text', 'Day 3')

});

it('Verify next button functionality in Day 3 - Introduction', () => {
    cy.get('.next-btn', {timeout:100000})
        .should('be.visible')
        .and('contain.text', 'Next')
        .click()
});

it('Verify Day 3 Part 1 Beriefing message is displayed', () => {
    cy.get('.brief-inner', {timeout: 100000})
        .should('be.visible')
        .and('contain.text', "Although we don't know much about the citizens, we were able to find two photos and some background information.")
})

// it('Verify Day 3 Part 1 Briefing message can be scroll', () => {
//     cy.get('.brief-inner').scrollTo('bottom')
// })

it('Verify Day 3 Part 1 Start Challenge button is displayed', () => {
    cy.get('#start-challenge-in-briefing', {timeout: 50000})
        .should('be.visible')
        .and('contain.text', 'Start Challenge')
})

it('Verify Day 3 Part 1 Start Challenge button functionality', () => {
    cy.get('#start-challenge-in-briefing').click()
    cy.get('.brief-inner')
        .should('not.be.visible')
})


it('Verify the 1st tutorial in individual answer is not displayed', () => {
    cy.get('#tutor-brief > .tutor-inner', {timeout: 100000})
        .should('not.be.visible');
})

it('Verify the 2nd tutorial in individual answer is not displayed', () => {
    cy.get('#tutor-timer > .tutor-inner', {timeout: 100000})
        .should('not.be.visible');
})

it('Verify the 3rd tutorial in individual answer is not displayed', () => {
    cy.get('#tutor-zoom > .tutor-inner', {timeout: 100000})
        .should('not.be.visible');
})

it('Verify the 4th tutorial in individual answer is not displayed', () => {
    cy.get('#tutor-arrow > .tutor-inner', {timeout: 100000})
        .should('not.be.visible');
})

it('Verify zoom button functionality', () =>{
    cy.waitForResource('Introduction%20Milov%20Vjazemski%20-compressed-70.png', {timeout: 100000})
    cy.get('.slick-current > :nth-child(1) > .answer-item > .zoom-detail', {timeout: 50000})
        .should('be.visible')
        .click()
    cy.get('.embedMedia', {timeout: 50000})
        .should('be.visible')
})

it('Verify cloose button in image functionality', () => {
    cy.get('.close-idb', {timeout: 50000}).click()
    cy.get('.embedMedia')
        .should('not.exist')

});

it('Verify the slide button functionlity', () => {
    cy.get('.slick-next').click()
        .trigger('change')
})

it('Verify select the answer functionality', () => {
    cy.wait(15000)
    cy.get('#answer-1', {timeout: 50000})
        .should('be.visible')
        .click()
})


it('Verify the 5th tutorial in individual answer is not displayed', () => {
    cy.get('#tutorial-wrapper > #tutor-submit > .tutor-inner', {timeout: 100000})
        .should('not.be.visible');
})


it('Verify submit answer button functionality', () => {
    cy.get('.next-btn', {timeout: 50000})
        .should('be.visible')
        .and('contain.text', 'Submit Answer')
        .click()
})

it('Verify the 1st tutorial in group answer is not displayed', () => {
    cy.waitForResource('challenge-1-game.jpg', {timeout: 100000})
    cy.get('#tutor-main > .tutor-inner', {timeout: 100000})
        .should('not.be.visible');
})


it('Verify the 2nd tutorial in group answer is not displayed', () => {
    cy.get('#tutor-popup > .tutor-inner', {timeout: 100000})
        .should('not.be.visible');
})

it('Verify the 3rd tutorial in group answer is not displayed', () => {
    cy.get('#tutor-submit > .tutor-inner', {timeout: 100000})
        .should('not.be.visible');
})

it('Verify selected individual answer displayed in group answer ', () => {
    cy.get('*[class^="answerbox-item answer-item selected"]', {timeout: 100000})  
        .find('div')  
        .should('have.class', 'answer-count').find('span')
        .should('have.class', 'number').and('contain.text', '1')
    
})

it('Verify submit group answer fuctionality', () => {
    cy.wait(3000)
    cy.get('.input-group-answer', {timeout:10000})
        .should('be.visible')
        .click()
})


it('Verify Day 3 - Yun Suk Beriefing message is displayed', () => {
    cy.waitForResource('Experts-compressed-70.jpg', {timeout: 100000})
    cy.get('.brief-inner', {timeout: 50000})
        .should('be.visible')
        .and('contain.text', 'Improvement initiative – Yun Suk')
})

it('Verify Day 3 - Yun Suk Briefing message can be scroll', () => {
    cy.get('.brief-inner').scrollTo('bottom')
})

it('Verify Day 3 - Yun Suk Start Challenge button is displayed', () => {
    cy.get('#start-challenge-in-briefing', {timeout: 50000})
        .should('be.visible')
        .and('contain.text', 'Start Challenge')
})

it('Verify Day 3 - Yun Suk Start Challenge button functionality', () => {
    cy.get('#start-challenge-in-briefing').click()
    cy.get('.brief-inner')
        .should('not.be.visible')
})

it('Verify Multiple choice question is displayed', () => {
    cy.get('strong', {timeout: 100000})
        .should('be.visible')
        .and('contain.text', 'What do you choose to do?')
})

it('Verify Multiple choice answer is displayed', () => {
    cy.get('[data-index="0"] > label > span', {timeout:100000})
        .should('be.visible')
        .and('contain.text', 'Yes I accept the initiative')
    cy.get('[data-index="1"] > label > span', {timeout:100000})
        .should('be.visible')
        .and('contain.text', 'No I do not accept the initiative') 
})

it('Verify select answer funtionality', () => {
    cy.get('[data-index="0"] > label > span').click()
    cy.get('.selected > label > span', {timeout:100000})
        .should('be.visible')
})

it('Verify Submit button functionality', () => {
    cy.get('.basic-challenge > .btn', {timeout:1000000})
        .should('be.visible')
        .and('contain.text', 'Submit')
        .click()
});


it('Verify the 1st tutorial in group answer is not displayed', () => {
    cy.get('#tutor-main > .tutor-inner', {timeout: 100000})
        .should('not.be.visible');
})


it('Verify the 2nd tutorial in group answer is not displayed', () => {
    cy.get('#tutor-popup > .tutor-inner', {timeout: 100000})
        .should('not.be.visible');
})

it('Verify the 3rd tutorial in group answer is not displayed', () => {
    cy.get('#tutor-submit > .tutor-inner', {timeout: 100000})
        .should('not.be.visible');
})

it('Verify selected individual answer displayed in group answer ', () => {
    cy.get('*[class^="answerbox-item answer-item selected"]', {timeout: 100000})  
        .find('div')  
        .should('have.class', 'answer-count').find('span')
        .should('have.class', 'number').and('contain.text', '1')
    
})

it('Verify submit group answer fuctionality', () => {
    cy.wait(3000)
    cy.get('.input-group-answer', {timeout:10000})
        .should('be.visible')
        .click()
})


it('Verify the 1st tutorial in feedback screen is not displayed', () => {
    cy.waitForResource('feedback.jpg', {timeout: 100000})
    cy.wait(3000)
    cy.get('#tutor-earned > .tutor-inner', {timeout: 100000})
        .should('not.be.visible');
})


it('Verify the 2nd tutorial in feedback screen is not displayed', () => {
    cy.get('#tutor-progression > .tutor-inner', {timeout: 100000})
        .should('not.be.visible');
})

it('Verify the feedback message is displayed in feedback screen', () => {
    cy.get('.scl-row > :nth-child(1)', {timeout: 50000})
        .should('be.visible')
        .and('contain.text', 'Response from the UFC')
})

// it('Verify start vote correctly displayed', () => {
//     cy.get('#stat-number')
//         .should('be.visible')
//         .and('contain.text', '+3')
// })

it('Verify earned vote displayed in feedback screen', () =>{
    cy.get('#votes-earned', {timeout:10000})
        .should('be.visible')
        .and('contain.text', '+5')
});

it('Verify next button functionality in feedback screen', () => {
    cy.waitForResource('feedback.jpg', {timeout: 100000})
    cy.wait(3000)
    cy.get('.next-btn', {timeout: 50000})
        // .should('be.visible')
        // .and('contain.text', 'Next')
        .click()

    cy.get('.brief-inner', {timeout: 100000})
        .should('be.visible')
        .and('contain.text', "The chairman's bag")
})


});
