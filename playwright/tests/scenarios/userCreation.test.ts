import {test} from '@playwright/test';
import { HomePage } from '../poms/app/home';
import { UserListDash } from '../poms/userManagement/list';

test.describe(() => {
    test('Can create user', async ({page}) => {
        const homePage = new HomePage(page)
        await homePage.goto()

        // got to user list and then user creation
        await homePage.dashboard.usersLink.click()

        // confirm user list view is loaded.
        await expect(homePage.dashboard.section.getByRole("heading", {name: /User Management/i})).toBeVisible()

        // click add user.
        const userListPage = new UserListDash(page)
        await userListPage.addUserBtn.click()

    })
    // load home page
})