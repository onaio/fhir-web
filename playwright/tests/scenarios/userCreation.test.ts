import { test }  from '@playwright/test';
import { HomePage } from '../poms/app/home';
import { UserCreate, UserFormFields } from '../poms/userManagement/create';
import { UserListDash } from '../poms/userManagement/list';

test.describe(() => {
    test('Can create user', async ({page}) => {
        const homePage = new HomePage(page)
        await homePage.goto()

        // got to user list and then user creation
        await homePage.dashboard.usersLink.click()
        // await expect(page).toHaveURL(/.*users\/new/) TODO - fix this comment.

        // confirm user list view is loaded.
        await expect(homePage.dashboard.section.getByRole("heading", {name: /User Management/i})).toBeVisible()

        // click add user.
        const userListPage = new UserListDash(page)
        await userListPage.addUserBtn.click()

        // confirm user creation view is loaded
        await expect(homePage.dashboard.section.getByRole("heading", {name: /Add User/i})).toBeVisible()


        // we now fill the form.
        const userCreatePage = new UserCreate(page);
        const formFields: UserFormFields = {
            firstName: 'Play',
            lastName: 'test',
            email: "playwright@example.com",
            username: 'playTest',
            applicationID: 'Device configurations(quest)'

        }
        await userCreatePage.fillForm(formFields)
    })
    // load home page
})