import { test, expect } from '@playwright/test';
import { PLAYWRIGHT_BASE_URL } from '../../env';
import { HomePage } from '../poms/app/home';
import { LocationCreate, LocationFormFields } from '../poms/locationManagement/create';
import { LocationUnitList } from '../poms/locationManagement/list';
import { TeamForm } from '../poms/teamManagement/create';
import { TeamList } from '../poms/teamManagement/list';
import { TeamAssignment } from '../poms/teamManagement/teamAssignment';
import { UserCreate, UserFormFields } from '../poms/userManagement/create';
import { UserListDash } from '../poms/userManagement/list';

const locationPayload: LocationFormFields = {
    name: "PlayTest-location",
    alias: "play-location",
    description: "Auto created location"
}

const teamFormPayload = {
    name: "playOrg",
    alias: "playOrg-alias",
    status: true,
    practitioners: ["Play Test"]
}


test.describe.configure({ mode: 'serial' });

test.describe("User modification", () => {
    // TODO - Duplicated in user creation
    test('Can create user', async ({ page }) => {
        const homePage = new HomePage(page)
        await homePage.goto()

        // got to user list and then user creation
        await homePage.dashboard.usersLink.click()
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

        // go to team list and then create organization
        await homePage.dashboard.teamsLink.click()
        await expect(page).toHaveURL(`${PLAYWRIGHT_BASE_URL}/admin/teams`)

        //confirm that we are in the teams list
        await expect(homePage.dashboard.section.getByRole("heading", { name: /Organization list/i })).toBeVisible()

        // click add organization/team.
        const teamList = new TeamList(page)
        await teamList.addTeamBtn.click()
        await expect(page).toHaveURL(`${PLAYWRIGHT_BASE_URL}/admin/teams/add`)

        const teamForm = new TeamForm(page)

        await teamForm.fillForm(teamFormPayload)

        // after Action - search for created entity in 
        await teamList.goSearch(teamFormPayload.name)

        // should atleast one entry - TODO - possiblity of having a centralized util methods for interacting with tables - including pagination.
        const table = await page.locator(".ant-table table")
        const tableRows = await table.locator('tbody tr')
        await expect(tableRows.allTextContents).toContain(`${teamFormPayload.name}Edit`)
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