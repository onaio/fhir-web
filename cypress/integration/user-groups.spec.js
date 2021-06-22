describe('User Groups functions', () => {
    it('User can search for a user group', function () {
        cy.get('.ant-menu-inline .ant-menu-submenu-title')
            .eq(2)
            .click()
        cy.get('.ant-menu-item a[href="/admin/users/groups"]')
            .click()
        cy.get('.search-input-wrapper .ant-input-affix-wrapper-lg')
            .type('Super')
        cy.get('.ant-input-suffix .ant-input-clear-icon')
            .click()      
    })

    // it('User can add a new user group', function () {
    //     cy.get('a[href="/admin/users/group/new"]')
    //         .click()
    //     cy.get('.ant-form-item-control-input-content input[type="text"]')
    //         .type('Test Group')
    //     cy.get('div .create-group')
    //         .click()
    // })

    it('User can edit a group details', function () {
        cy.get('table tbody tr:nth-child(3) td:last-child a')
            .should('have.text', 'Edit')
            .click()
        cy.get('.ant-form-item-control-input input[type="text"]')
            .clear()
            .type('New Group')
        cy.get('.ant-form-item-control-input button[type="submit"]')
            .click()
    })

    it('User can view a groups details', function () {
        cy.get('table tbody tr:nth-child(3) td:last-child .more-options')
            .click()
        cy.get('.ant-dropdown ul li.viewdetails')
            .should('have.text', 'View Details')
            .click()
        cy.get('.flex-right .anticon-close')
            .click()
    })
})

describe('User Roles', () => {
    it('User can search for a role', function () {
            cy.get('.ant-menu-inline .ant-menu-submenu-title')
            .eq(3)
            .click()
        cy.get('.ant-menu-item a[href="/admin/users/roles"]')
            .click()
        cy.get('.search-input-wrapper .ant-input-affix-wrapper-lg')
            .type('open')
        cy.get('.ant-input-suffix .ant-input-clear-icon')
            .click()      
        })

        it('User can move to the next page of the roles list', function () {
            cy.get('.ant-pagination .ant-pagination-next')
                .click()
    })
})
