import { test, expect } from '@playwright/test';
import { PLAYWRIGHT_BASE_URL, PLAYWRIGHT_PREFIX } from '../../env';
import { waitForSpinner } from '../helpers/utils';
import { HomePage } from '../poms/app/home';
import { UserForm, UserFormFields } from '../poms/userManagement/userForm';
import { UserListDash } from '../poms/userManagement/list';
import { faker } from '@faker-js/faker';
import { UserCredentialsForm, UserCrendentials } from '../poms/userManagement/userCredentials';

const formFields: UserFormFields & UserCrendentials = {
    firstName: `${PLAYWRIGHT_PREFIX}-${faker.person.firstName()}`,
    lastName: `${PLAYWRIGHT_PREFIX}-${faker.person.lastName()}`,
    email: faker.internet.email(),
    userType: 'supervisor',
    username: `${PLAYWRIGHT_PREFIX}-${faker.internet.userName()}`,
    keycloakUserGroup: "rbacTest",
    applicationID: 'Device configurations(quest)',
    password: faker.internet.password()

}

test.describe("User management", () => {
    test('Can create user', async ({ page }) => {
        const homePage = new HomePage(page)
        await homePage.goto()

        // got to user list and then user creation
        await homePage.dashboard.usersLink.click()
        await waitForSpinner(page)
        await expect(page).toHaveURL(`${PLAYWRIGHT_BASE_URL}/admin/users`)

        // confirm user list view is loaded.
        await expect(homePage.dashboard.section.getByRole("heading", { name: /User Management/i })).toBeVisible()

        // click add user.
        const userListPage = new UserListDash(page)
        await userListPage.addUserBtn.click()
        await expect(page).toHaveURL(`${PLAYWRIGHT_BASE_URL}/admin/users/new`)

        // confirm user creation view is loaded
        await expect(homePage.dashboard.section.getByRole("heading", { name: /Add User/i })).toBeVisible()


        // we now fill the form.
        const userCreatePage = new UserForm(page);
        await userCreatePage.fillForm(formFields)

        const userCredentials = new UserCredentialsForm(page)
        // confirm credentials update view is loaded
        await expect(homePage.dashboard.section.getByRole("heading", {name: /User credentials/i})).toBeVisible()
        userCredentials.fillForm({password: formFields.password})


        // after Action - search for created entity in 
        await userListPage.goSearch(formFields.username)
        await waitForSpinner(page)

        // should atleast one entry - TODO - possiblity of having a centralized util methods for interacting with tables - including pagination.
        const table = await page.locator(".ant-table table")
        const tableRows = await table.locator('tbody tr')
        const content = await tableRows.allTextContents()
        await expect(content).toContain(`${formFields.firstName}${formFields.lastName}${formFields.username.toLowerCase()}Edit`)
    })
})