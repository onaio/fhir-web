describe('Authentication', () => {
    it('log in with invalid credentials', () => {
      cy.visit('/')
      cy.get('input[name="username"]').type('invalid')
      cy.get('input[name="password"]').type('invalid')
      cy.get('#kc-login').click()
      cy.get('.kc-feedback-text').should('have.text', 'Invalid username or password.')
    })

    it('log in with valid credentials', () => {
      const username = Cypress.env('username')
      const password = Cypress.env('password')
      cy.visit('/')
      cy.get('input[name="username"]').clear()
          .type(username)
      cy.get('input[name="password"]').type(password, { log: false })
      cy.get('#kc-login').click()     
    })
      
})