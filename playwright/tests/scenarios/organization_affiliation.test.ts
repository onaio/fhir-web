import { faker } from '@faker-js/faker';
import { test, expect } from '@playwright/test';
import { PLAYWRIGHT_BASE_URL, PLAYWRIGHT_PREFIX } from '../../env';
import { HomePage } from '../poms/app/home';
import { LocationCreate, LocationFormFields } from '../poms/locationManagement/create';
import { LocationUnitList } from '../poms/locationManagement/list';
import { TeamForm, TeamFormFields } from '../poms/teamManagement/create';
import { TeamList } from '../poms/teamManagement/list';
import { TeamAssignment } from '../poms/teamManagement/teamAssignment';
import { UserForm, UserFormFields } from '../poms/userManagement/userForm';
import { UserListDash } from '../poms/userManagement/list';
import { UserCredentialsForm, UserCrendentials } from '../poms/userManagement/userCredentials';
import { waitForSpinner } from '../helpers/utils';

const locationPayload: LocationFormFields = {
    name: `${PLAYWRIGHT_PREFIX}-${faker.location.city()}`,
    alias: `${PLAYWRIGHT_PREFIX}-${faker.word.adjective()}`,
    description: faker.word.words(10)
}

const userFormPayload: UserFormFields & UserCrendentials = {
    firstName: `${PLAYWRIGHT_PREFIX}-${faker.person.firstName()}`,
    lastName: `${PLAYWRIGHT_PREFIX}-${faker.person.lastName()}`,
    email: faker.internet.email(),
    userType: 'supervisor',
    username: `${PLAYWRIGHT_PREFIX}-${faker.internet.userName()}`,
    keycloakUserGroup: "rbacTest",
    applicationID: 'Device configurations(quest)',
    password: faker.internet.password()
}

const teamFormPayload: TeamFormFields = {
    name: `${PLAYWRIGHT_PREFIX}-${faker.word.noun()}`,
    alias: `${PLAYWRIGHT_PREFIX}-${faker.word.adjective()}`,
    status: true,
    practitioners: [userFormPayload.firstName] // TODO - does practitioner exist
}



test.describe.configure({ mode: 'serial' });

test.describe("User modification", () => {
    // TODO - Duplicated in user creation
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
        const userForm = new UserForm(page);
        await userForm.fillForm(userFormPayload)


        const userCredentials = new UserCredentialsForm(page)
        // confirm credentials update view is loaded
        await expect(homePage.dashboard.section.getByRole("heading", {name: /User credentials/i})).toBeVisible()
        userCredentials.fillForm({password: userFormPayload.password})

        // after Action - search for created entity in 
        await userListPage.goSearch(userFormPayload.username)
        await waitForSpinner(page)

        // should atleast one entry - TODO - possiblity of having a centralized util methods for interacting with tables - including pagination.
        const table = await page.locator(".ant-table table")
        const tableRows = await table.locator('tbody tr')
        const content = await tableRows.allTextContents()
        await expect(content).toContain(`${userFormPayload.firstName}${userFormPayload.lastName}${userFormPayload.username.toLowerCase()}Edit`)
    })

    test('creates a location', async ({ page }) => {
        const homePage = new HomePage(page)
        await homePage.goto()

        // go to location list and then create location
        await homePage.dashboard.locationsLink.click()
        await expect(page).toHaveURL(`${PLAYWRIGHT_BASE_URL}/admin/location/unit`)


        // confirm location unit list view is loaded.
        await expect(homePage.dashboard.section.getByRole("heading", { name: /Location Unit Management/i })).toBeVisible()

        // click add location.
        const locationListPage = new LocationUnitList(page)
        await locationListPage.addLocationBtn.click()
        await expect(page).toHaveURL(`${PLAYWRIGHT_BASE_URL}/admin/location/unit/add`)

        // confirm location unit creation view is loaded
        await expect(homePage.dashboard.section.getByRole("heading", { name: /Add Location Unit/i })).toBeVisible()

        // fill location form
        const locationForm = new LocationCreate(page)

        await locationForm.fillForm(locationPayload)

        // confirm that location unit shows up on location list - TODO - update to work for nested locations.
        await locationListPage.goSearch(locationPayload.name)
        await page.getByTitle(new RegExp(locationPayload.name, "i"))
    })

    test("create and assign user to team", async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.goto()

        // go to organization list and then organization creation
        await homePage.dashboard.teamsLink.click()
        await waitForSpinner(page)
        await expect(page).toHaveURL(`${PLAYWRIGHT_BASE_URL}/admin/teams`)

        // confirm organization list view is loaded.
        await expect(homePage.dashboard.section.getByRole("heading", {name: /Organization list/i})).toBeVisible()

        // // click add organization.
        const teamList = new TeamList(page)
        await teamList.addTeamBtn.click()
        await expect(page).toHaveURL(`${PLAYWRIGHT_BASE_URL}/admin/teams/add`)

        // confirm organization creation view is loaded
        await expect(homePage.dashboard.section.getByRole("heading", {name: /Create team/i})).toBeVisible()

        const teamForm = new TeamForm(page)
        await teamForm.fillForm(teamFormPayload)

        // after Action - search for created entity in 
        await teamList.goSearch(teamFormPayload.name)
        await waitForSpinner(page)

         // should atleast one entry - TODO - possiblity of having a centralized util methods for interacting with tables - including pagination.
         const table = page.locator(".ant-table table")
         const tableRows = table.locator('tbody tr')
         const content = await tableRows.allTextContents()
         await expect(content).toContain(`${teamFormPayload.name}Edit`)
    })

    test("Assign team to location", async ({ page }) => {
        const homePage = new HomePage(page)
        await homePage.goto()

        // to to team assignment
        await homePage.sidebar.teamAssignmentNav.click()
        await expect(page).toHaveURL(`${PLAYWRIGHT_BASE_URL}/admin/teams/teams-assignment`)

        // search for location in tree
        const teamAssignment = new TeamAssignment(page)
        teamAssignment.goSearch(locationPayload.name)

        // click on the location
        await teamAssignment.page.getByTitle(new RegExp(locationPayload.name, "i")).click()

        // open modal to make assignment by clicking edit.
        const editCta = teamAssignment.page.locator("table tbody tr").locator('nth=0').getByText("Edit")
        await editCta.click()

        await teamAssignment.assignmentModal.selectTeams([teamFormPayload.name])

        // we should be back on the plain team assignment view.
        // search for location in tree
        teamAssignment.goSearch(locationPayload.name)

        // click on the location
        await teamAssignment.page.getByTitle(new RegExp(locationPayload.name, "i")).click()

        // look if assigned team is in table.
        const rowContents = await teamAssignment.page.locator("table tbody tr").locator('nth=0').allTextContents()
        expect(rowContents).toEqual(`${locationPayload.name}${teamFormPayload.name}Edit`)
    })
})