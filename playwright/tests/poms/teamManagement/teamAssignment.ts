import { Page, Locator } from '@playwright/test';
import { Search } from '../common/search';

export class Modal {
    readonly page: Page
    readonly section: Locator
    readonly modalTitle:Locator
    readonly saveBtn: Locator
    readonly cancelBtn: Locator
    readonly teamSelect: Locator
    readonly modalCloseBtn: Locator

    constructor(page: Page){
        this.page = page
        this.section = page.locator(".ant-modal-content")
        this.modalTitle = this.section.getByText(/Assign\/Unassign Teams/i)
        this.saveBtn = this.section.getByRole("button", {name: /save/i})
        this.cancelBtn = this.section.getByRole("button", {name: /cancel/i})
        this.teamSelect = this.section.getByPlaceholder(/Select teams/i)
        this.modalCloseBtn = this.section.locator("button.ant-modal-close")
    }

    async selectTeams(teamLabels: string[]){
        this.teamSelect.click()
        const dropDownSelect = this.page.locator(".ant-select-dropdown")
        for (const label of teamLabels){
            await dropDownSelect.fill(label)
            await dropDownSelect.getByTitle(new RegExp(label, "i")).getByText(new RegExp(label, "i")).click()
        }
        await this.saveBtn.click()
    }
}

export class TeamAssignment extends Search {
    readonly page: Page
    readonly assignmentModal: Modal

    constructor(page: Page) {
        super(page)
        this.assignmentModal = new Modal(page)
    }
}