import { Page, Locator } from '@playwright/test';

/**
 * for now we need to define which values we are going to use for
 * keycloak user group and application Id - when selecting the application ids
 * and group to use its best to remember the goal of these tests is to simulate
 * read world scenarios, so the values used meaning should be exerciesed through 
 * the tests as well.
 * 
 * When filling a select, one should prefer the label. if the labels are not unique
 * enough then a one can fall back to using the value.
 */
export interface UserCrendentials {
    password: string
}

export class UserCredentialsForm {
    readonly page: Page
    readonly passwordField: Locator
    readonly confirmPasswordField: Locator
    readonly setPasswordBtn: Locator
    readonly cancelBtn: Locator

    constructor(page: Page) {
        this.page = page
        this.passwordField = page.getByLabel("Password", {exact: true})
        this.confirmPasswordField = page.getByLabel(/Confirm Password/i)
        this.setPasswordBtn  = page.getByRole("button", {name: /Set password/i})
        this.cancelBtn = page.getByRole('button', { name: /cancel/i })
    }

    async fillForm(formFields: UserCrendentials) {
        const { password } = formFields
        await this.passwordField.fill(password)
        await this.confirmPasswordField.fill(password)
        await this.setPasswordBtn.click()
    }
}