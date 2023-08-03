import {Page, Locator} from '@playwright/test';

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
export interface UserFormFields{
    firstName: string;
    lastName: string;
    email?: string;
    username: string;
    userType?: 'practitioner' | 'supervisor';
    enableUser?: boolean;
    keycloakUserGroup?: string
    applicationID: string
}

export class UserCreate{
    readonly page: Page
    readonly firstNameField: Locator
    readonly lastNameField: Locator
    readonly emailField: Locator
    readonly usernameField: Locator
    readonly userTypeSupervisor: Locator
    readonly userTypePractitioner: Locator
    readonly enableUserYes: Locator
    readonly enableUserNo: Locator
    readonly keycloakUserGroup: Locator
    readonly applicationId :Locator
    readonly submitBtn: Locator
    readonly cancelBtn: Locator

    constructor(page: Page){
        this.page = page
        this.firstNameField = page.getByLabel(/First Name/i)
        this.lastNameField = page.getByLabel(/Last Name/i)
        this.emailField = page.getByLabel(/email/i)
        this.usernameField = page.getByLabel(/username/i)
        this.keycloakUserGroup = page.getByLabel(/Keycloak User Group/i)
        this.applicationId = page.getByLabel(/Application ID/i)
        this.submitBtn = page.getByRole('button', {name: /save/i})
        this.cancelBtn = page.getByRole('button', {name: /cancel/i})
    }

    async fillForm(formFields: UserFormFields){
        const {firstName, lastName, email, username, userType, enableUser, keycloakUserGroup, applicationID} = formFields
        firstName && await this.firstNameField.fill(firstName)
        lastName && await this.lastNameField.fill(lastName)
        email && await this.emailField.fill(email)
        username && await this.usernameField.fill(email!)
        switch(userType){
            case 'practitioner':
                await this.userTypePractitioner.check()
                break
            case 'supervisor':
                await this.userTypeSupervisor.check()
                break
        }
        if(enableUser){
            await this.enableUserYes.check()
        }else if (enableUser == false){
            await this.enableUserNo.check()
        }
        keycloakUserGroup && await this.keycloakUserGroup.selectOption({label: keycloakUserGroup})
        applicationID && await this.applicationId.selectOption({label: applicationID})
        await this.submitBtn.click()
    }
}