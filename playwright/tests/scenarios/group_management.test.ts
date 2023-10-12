import { test, expect } from '@playwright/test';
import { PLAYWRIGHT_BASE_URL } from '../../env';
import { HomePage } from '../poms/app/home';
import { waitForSpinner } from '../helpers/utils';

test.describe("Group Management", () => {
    /**
    * User can see present groups
    */
    test('Can see existing groups', async ({ page }) => {
        const homePage = new HomePage(page)
        await homePage.goto()

        // go to group list view
        await homePage.dashboard.groupsLink.click()
        await waitForSpinner(page)
        await expect(page).toHaveURL(`${PLAYWRIGHT_BASE_URL}/groups/list`)

        // confirm list view is loaded.
        await expect(homePage.dashboard.section.getByRole("heading", { name: /Groups List/i })).toBeVisible()

        // we do not know what groups would be here

        await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
        await expect(page.getByRole('columnheader', { name: 'Active' })).toBeVisible();
        await expect(page.getByRole('columnheader', { name: 'Last Updated' })).toBeVisible();
        await expect(page.getByRole('columnheader', { name: 'Actions' })).toBeVisible();
    })
})