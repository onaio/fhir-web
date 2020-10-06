describe('Authentication', () => {
  before(() => {
    cy.fixture('auth').then(function (data) {
        this.data = data 
    })
})

    it('log in with invalid credentials', () => {
      cy.visit('/')
      cy.get('input[name="username"]').type('invalid')
      cy.get('input[name="password"]').type('invalid')
      cy.get('#kc-login').click()
      cy.get('.kc-feedback-text').should('have.text', 'Invalid username or password.')
    })

    it('log in with valid credentials', () => {
      cy.visit('/')
      cy.fixture('auth').should((data) => {
        cy.get('input[name="username"]').clear()
          .type(data.username)
        cy.get('input[name="password"]').type(data.password)
        cy.get('#kc-login').click()
      })
      
    })
  })