describe('Team assignments', () => {
    it('log in with valid credentials', () => {
        const username = Cypress.env('username')
        const password = Cypress.env('password')
        cy.visit('/')
        cy.get('input[name="username"]').clear()
            .type(username)
        cy.get('input[name="password"]').type(password, { log: false })
        cy.get('#kc-login').click()     
    })

    it('User can search for a location', function () {
        cy.get('.ant-menu-submenu-title .anticon')
            .click()
        cy.get('.ant-menu-inline .ant-menu-submenu-title')
            .eq(2)
            .should('have.text', 'Teams')
            .click()
        cy.get('.ant-menu-item a[href="/admin/teams/team-assignment"]')
            .click()
        cy.get('input.ant-input.ant-input-lg')
            .type('Kericho')
            .focused()
            .clear()
    })

    it('User can view teams in different locations', function () {
        cy.get('.ant-tree-list-holder-inner .ant-tree-switcher')
            .eq(0)
            .click( { timeout: 5000} )
        cy.get('.ant-tree-title')
            .should('have.text', 'Kenya')
            .click()
        cy.get('.ant-tree-node-content-wrapper .ant-tree-title')
            .eq(4)
            .should('have.text', 'Mombasa')
            .click()
    
        
    })
})