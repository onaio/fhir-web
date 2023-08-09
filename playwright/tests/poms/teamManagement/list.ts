import { Page, Locator } from '@playwright/test';
import { Search } from '../common/search';

export class TeamList extends Search {
    readonly page: Page
    readonly addTeamBtn: Locator

    constructor(page: Page) {
        super(page)
        this.addTeamBtn = page.getByRole('button', { name: /Add Organization/i })
    }
}