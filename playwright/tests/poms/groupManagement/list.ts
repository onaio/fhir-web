import { Page, Locator } from '@playwright/test';
import { Search } from '../common/search';

export class GroupList extends Search {
    readonly page: Page

    constructor(page: Page) {
        super(page)
    }
}
