describe('Authentication', () => {
    it('log in with invalid credentials', () => {
      cy.visit('/')
      cy.get('input[name="username"]').type('invalid')
      cy.get('input[name="password"]').type('invalid')
      cy.get('#kc-login').click()
      cy.get('.kc-feedback-text').should('have.text', 'Invalid username or password.')
    })

    it('log in with valid credentials', () => {
      cy.visit('/')
      cy.get('input[name="username"]').clear()
          .type('ona-admin')
      cy.get('input[name="password"]').type('Amani123')
      cy.get('#kc-login').click()

    })
  })