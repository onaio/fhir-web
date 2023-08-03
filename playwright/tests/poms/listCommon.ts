import { Page, Locator } from '@playwright/test';

export class ListCommon {
    readonly search: Locator

    constructor(page: Page) {
        this.search = page.getByPlaceholder(/search/i)
    }

    goSearch(searchText: string) {
        this.search.fill(searchText)
    }

    clearSearch() {
        this.search.fill("")
    }

}