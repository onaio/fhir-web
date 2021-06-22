describe('Location unit group', () => {
    it('log in with valid credentials', () => {
        const username = Cypress.env('username')
        const password = Cypress.env('password')
        cy.visit('/')
        cy.get('input[name="username"]').clear()
            .type(username)
        cy.get('input[name="password"]').type(password, { log: false })
        cy.get('#kc-login').click()     
    })

    it('User can search for a unit group', function () {
        cy.get('.ant-menu-submenu-title .ant-menu-submenu-arrow')
            .click( { force: true} )
        cy.wait(5000)
        cy.get('.ant-menu-inline .ant-menu-submenu-title')
            .eq(2)
            .should('have.text', 'Locations')
            .click()
        cy.get('.ant-menu-item a[href="/admin/location/group"]')
            .click()
        cy.get('input.ant-input.ant-input-lg')
            .type('Madaraka', { timeout: 5000 } )
            .focused()
            .clear()
    })

    // it('User can add a location group', function () {
    //     cy.get('div a[href="/admin/location/group/add"]')
    //         .click()
    //     cy.get('.ant-form-item-control-input input.ant-input')
    //         .type('Test Group')
    //     cy.get('.ant-radio-group .ant-radio')
    //         .eq(1)
    //         .click()
    //     cy.get('.ant-form-item-control-input textarea.ant-input')
    //         .type('Just a test group')
    //     cy.get('#submit')
    //         .should('have.text', 'Save')
    //         .click()
    // })

    it('User can edit a location group', function () {
        cy.get('table tbody tr:nth-child(1) td:last-child a')
            .should('have.text', 'Edit')
            .click()
        cy.get('#submit')
            .should('have.text', 'Save')
            .click()
    })

    it('User can view location group details', function () {
        cy.get('table tbody tr:nth-child(1) td:last-child svg')
            .click()
        cy.get('.ant-dropdown ul li.viewdetails')
            .should('have.text', 'View Details')
            .click()
        cy.get('.pl-3 svg')
            .click()
    })

    it('User can move to the next page of the location group list', function () {
        cy.get('.ant-pagination .ant-pagination-next')
            .click()
    })

    it('User can view more than 5 location groups per page', function () {
        cy.get('.ant-pagination-options .ant-select-selector')
            .click()
        cy.get('.rc-virtual-list-holder-inner div[title="10 / page"]')
            .click()
        cy.get('.ant-pagination-options .ant-select-selector')
            .click()
        cy.get('.rc-virtual-list-holder-inner div[title="20 / page"]')
            .click()
    })

})
