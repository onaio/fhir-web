import { Page, Locator } from '@playwright/test';

export class Search {
    readonly search: Locator

    constructor(page: Page) {
        this.search = page.getByPlaceholder(/search/i)
    }

    async goSearch(searchText: string) {
        await this.search.fill(searchText)
    }

    async clearSearch() {
        await this.search.fill("")
    }

}