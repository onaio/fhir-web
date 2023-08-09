import { test, expect }  from '@playwright/test';
import { PLAYWRIGHT_BASE_URL } from '../../env';
import { HomePage } from '../poms/app/home';
import { UserCreate, UserFormFields } from '../poms/userManagement/create';
import { UserListDash } from '../poms/userManagement/list';

test.describe("User modification", () => {
    test('Can create user', async ({page}) => {
        const homePage = new HomePage(page)
        await homePage.goto()

        // got to user list and then user creation
        await homePage.dashboard.usersLink.click()
        await expect(page).toHaveURL(`${PLAYWRIGHT_BASE_URL}/admin/users`)

        // confirm user list view is loaded.
        await expect(homePage.dashboard.section.getByRole("heading", {name: /User Management/i})).toBeVisible()

        // click add user.
        const userListPage = new UserListDash(page)
        await userListPage.addUserBtn.click()
        await expect(page).toHaveURL(`${PLAYWRIGHT_BASE_URL}/admin/users/new`)

        // confirm user creation view is loaded
        await expect(homePage.dashboard.section.getByRole("heading", {name: /Add User/i})).toBeVisible()


        // we now fill the form.
        const userCreatePage = new UserCreate(page);
        const formFields: UserFormFields = {
            firstName: 'Play',
            lastName: 'test',
            email: "playwright@example.com",
            userType: 'supervisor',
            username: 'playTest',
            keycloakUserGroup: "rbacTest",
            applicationID: 'Device configurations(quest)'

        }
        await userCreatePage.fillForm(formFields)

        // after Action - search for created entity in 
        await userListPage.goSearch(formFields.username)

        // should atleast one entry - TODO - possiblity of having a centralized util methods for interacting with tables - including pagination.
        const table = await page.locator(".ant-table table")
        const tableRows = await table.locator('tbody tr')
        await expect(tableRows.allTextContents).toContain(`${formFields.firstName}${formFields.lastName}${formFields.username}Edit`)
    })
})