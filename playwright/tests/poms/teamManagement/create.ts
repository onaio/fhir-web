import {Page, Locator} from '@playwright/test';

export interface TeamFormFields{
    name: string;
    alias?: string;
    status?: boolean;
    practitioners: string[]
}

export class TeamForm{
    readonly page: Page
    readonly nameField: Locator
    readonly aliasField: Locator
    readonly statusActiveRadio: Locator
    readonly statusInactiveRadio: Locator
    readonly practitionersField: Locator
    readonly submitBtn: Locator
    readonly cancelBtn: Locator

    constructor(page: Page){
        this.page = page
        this.nameField = page.getByLabel(/Name/i)
        this.aliasField = page.getByLabel(/Alias/i)
        this.statusActiveRadio = page.getByText(/active/i)
        this.statusInactiveRadio = page.getByText(/Inactive/i)
        this.practitionersField = page.getByLabel(/Practitioners/i)
        this.submitBtn = page.getByRole('button', {name: /save/i})
        this.cancelBtn = page.getByRole('button', {name: /cancel/i})
    }

    async fillForm(formFields: TeamFormFields){
        const {name, alias, status, practitioners} = formFields
        await this.nameField.fill(name)
        alias && await this.aliasField.fill(alias)
        switch(status){
            case true:
                await this.statusActiveRadio.click()
                break
            case false:
                await this.statusInactiveRadio.click()
                break
        }
        if(practitioners){
            await this.practitionersField.click()
            for (const practitioner in practitioners){
                await this.practitionersField.fill(practitioner)
                await this.page.getByTitle(new RegExp(practitioner, "i")).getByText(new RegExp(practitioner, "i")).click()
            }
        }
        await this.submitBtn.click()
    }
}