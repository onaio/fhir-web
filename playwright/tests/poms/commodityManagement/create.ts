import { Page, Locator } from '@playwright/test';

export interface CommodityFormFields {
    name: string;
    status?: boolean;
    type?: string;
    measure: string;
}

export class CommodityForm {
    readonly page: Page
    readonly nameField: Locator
    readonly statusActiveRadio: Locator
    readonly statusInactiveRadio: Locator
    readonly commodityTypeSelectField: Locator
    readonly measureSelectField: Locator
    readonly submitBtn: Locator
    readonly cancelBtn: Locator

    constructor(page: Page) {
        this.page = page
        this.nameField = page.getByLabel(/Name/i)
        this.statusActiveRadio = page.getByText(/^active/i, { exact: true })
        this.statusInactiveRadio = page.getByText(/Inactive/i)
        this.commodityTypeSelectField = page.getByLabel(/Select Commodity status/i)
        this.measureSelectField = page.getByLabel(/Select the unit of measure/i)
        this.submitBtn = page.getByRole('button', { name: /save/i })
        this.cancelBtn = page.getByRole('button', { name: /cancel/i })
    }

    async fillForm(formFields: CommodityFormFields) {
        const { name, status, type, measure } = formFields
        await this.nameField.fill(name)
        switch (status) {
            case true:
                await this.statusActiveRadio.click()
                break
            case false:
                await this.statusInactiveRadio.click()
                break
        }
        if (type) {
            await this.commodityTypeSelectField.click()
            await this.commodityTypeSelectField.fill(type)
            await this.page.getByTitle(new RegExp(type, "i")).getByText(new RegExp(type, "i")).click()
            await this.commodityTypeSelectField.press("Escape")
        }
        if (type) {
            await this.measureSelectField.click()
            await this.measureSelectField.fill(type)
            await this.page.getByTitle(new RegExp(measure, "i")).getByText(new RegExp(measure, "i")).click()
            await this.measureSelectField.press("Escape")
        }
        await this.submitBtn.click()
    }
}