import { Page, Locator } from '@playwright/test';
import { Search } from '../common/search';

export class LocationUnitList extends Search {
    readonly page: Page
    readonly addLocationBtn: Locator

    constructor(page: Page) {
        super(page)
        this.addLocationBtn = page.getByRole('button', { name: /Add Location Unit/i })
    }
}