import {Page, Locator} from '@playwright/test';


export interface LocationFormFields{
    partOf?: string;
    name: string;
    alias?: string;
    status?: boolean;
    physicalType?: 'jurisdiction' | 'building';
    description?: string
}

export class LocationForm{
    readonly page: Page
    readonly partOf: Locator
    readonly name: Locator
    readonly alias: Locator
    readonly statusActiveRadio: Locator
    readonly statusInactiveRadio: Locator
    readonly jurisdictionRadio: Locator
    readonly buildingRadio: Locator
    readonly description: Locator
    readonly submitBtn: Locator
    readonly cancelBtn: Locator

    constructor(page: Page){
        this.page = page
        this.partOf = page.getByLabel(/Part Of/i)
        this.name = page.getByLabel(/Name/i)
        this.alias = page.getByLabel(/alias/i)
        this.statusActiveRadio = page.getByText(/Active/i)
        this.statusInactiveRadio = page.getByText(/Inactive/i)
        this.jurisdictionRadio = page.getByText(/Jurisdiction/i)
        this.jurisdictionRadio = page.getByText(/Building/i)
        this.description = page.getByLabel(/Description/i)
        this.submitBtn = page.getByRole('button', {name: /save/i})
        this.cancelBtn = page.getByRole('button', {name: /cancel/i})
    }

    async fillForm(formFields: LocationFormFields){
        const {partOf, name, alias, status, physicalType, description,} = formFields
        if(partOf){
            this.partOf.click()
            const dropDownSelect = this.page.getByRole("tree")
            for (const nodeName of partOf){
                const partLocator = dropDownSelect.getByTitle(nodeName).getByText(nodeName)
                await partLocator.click()
            } 
        }
        await name && this.name.fill(name)
        await alias && this.alias.fill(alias!)
        switch(status){
            case true:
                await this.statusActiveRadio.click()
                break
            case false:
                await this.statusInactiveRadio.click()
                break
        }
        switch(physicalType){
            case 'jurisdiction':
                await this.jurisdictionRadio.click()
                break
            case 'building':
                await this.buildingRadio.click()
                break
        }
        await description && this.description.fill(description!)
        await this.submitBtn.click()
    }
}
