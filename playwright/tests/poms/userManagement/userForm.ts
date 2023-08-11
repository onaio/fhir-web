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
export interface UserFormFields {
    firstName: string;
    lastName: string;
    email?: string;
    username: string;
    userType?: 'practitioner' | 'supervisor';
    enableUser?: boolean;
    keycloakUserGroup?: string
    applicationID: string,
}

export class UserForm {
    readonly page: Page
    readonly firstNameField: Locator
    readonly lastNameField: Locator
    readonly emailField: Locator
    readonly usernameField: Locator
    readonly userTypeSupervisorRadio: Locator
    readonly userTypePractitionerRadio: Locator
    readonly enableUserYesRadio: Locator
    readonly enableUserNoRadio: Locator
    readonly keycloakUserGroup: Locator
    readonly applicationId: Locator
    readonly submitBtn: Locator
    readonly cancelBtn: Locator

    constructor(page: Page) {
        this.page = page
        this.firstNameField = page.getByLabel(/First Name/i)
        this.lastNameField = page.getByLabel(/Last Name/i)
        this.emailField = page.getByLabel(/email/i)
        this.usernameField = page.getByLabel(/username/i)
        this.keycloakUserGroup = page.getByLabel(/Keycloak User Group/i)
        this.applicationId = page.getByLabel(/Application ID/i)
        this.submitBtn = page.getByRole('button', { name: /save/i })
        this.cancelBtn = page.getByRole('button', { name: /cancel/i })
        this.userTypeSupervisorRadio = page.getByText('Supervisor');
        this.userTypePractitionerRadio = page.getByText('Practitioner');
        this.enableUserYesRadio = page.getByText('Yes');
        this.enableUserNoRadio = page.getByText('No');
    }

    async fillForm(formFields: UserFormFields) {
        const { firstName, lastName, email, username, userType, enableUser, keycloakUserGroup, applicationID } = formFields
        await this.firstNameField.fill(firstName)
        await this.lastNameField.fill(lastName)
        email && await this.emailField.fill(email)
        await this.usernameField.fill(username)
        switch (userType) {
            case 'practitioner':
                await this.userTypePractitionerRadio.click()
                break
            case 'supervisor':
                await this.userTypeSupervisorRadio.click()
                break
        }
        if (enableUser) {
            await this.enableUserYesRadio.click()
        } else if (enableUser == false) {
            await this.enableUserYesRadio.click()
        }

        if (keycloakUserGroup) {
            await this.keycloakUserGroup.click()
            await this.keycloakUserGroup.fill(keycloakUserGroup)
            await this.page.getByTitle(new RegExp(keycloakUserGroup, "i")).getByText(new RegExp(keycloakUserGroup, "i")).click()
            await this.keycloakUserGroup.press("Escape")
        }
        if (applicationID) {
            await this.applicationId.click()
            // await this.applicationId.fill(applicationID) // TODO - support search - create issue
            // await this.page.getByText(new RegExp(applicationID, "i")).click() // TODO - very wierd this!!!
            await this.page.getByText(applicationID).click()
            await this.keycloakUserGroup.press("Escape")
        }
        await this.submitBtn.click()
    }
}