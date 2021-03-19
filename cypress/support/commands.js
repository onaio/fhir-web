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
const referer = Cypress.config('baseUrl')
const currentUser = Cypress.env('currentUser')
const username = Cypress.env('username')

Cypress.Commands.add('loginRequest', () => {
    let body = {
        ...currentUser,
    };
    cy.request({
        method: 'POST',
        url: '/login',
        failOnStatusCode: false, // dont fail so we can make assertions
        form: true, // we are submitting a regular form body
        body: body,
        headers: {
            "referer": referer
        }
    })
})

Cypress.Commands.add("loginByAuth0Api", (username: username, password: "") => {
    cy.log(`Logging in as ${username}`);
      const client_id = Cypress.env("auth0_client_id");
      const client_secret = Cypress.env("auth0_client_secret");
      const audience = Cypress.env("auth0_audience");
      const scope = Cypress.env("auth0_scope");
    
      cy.request({
        method: "POST",
        url: `https://${Cypress.env("auth0_domain")}/oauth/token`,
        body: {
          grant_type: "password",
          username,
          password,
          audience,
          scope,
          client_id,
          client_secret,
        },
      }).then(({ body }) => {
        const claims = jwt.decode(body.id_token);
        const { nickname, name, picture, updated_at, email, email_verified, sub, exp } = claims;
    
        const item = {
          body: {
            ...body,
            decodedToken: {
              claims,
              user: {
                nickname,
                name,
                picture,
                updated_at,
                email,
                email_verified,
                sub,
              },
              audience,
              client_id,
            },
          },
          expiresAt: exp,
        };
    
        window.localStorage.setItem('auth0Cypress', JSON.stringify(item));
    
        cy.visit("/");
      });
    });


    