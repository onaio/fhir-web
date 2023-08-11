import { test, expect }  from '@playwright/test';
import { PLAYWRIGHT_BASE_URL, PLAYWRIGHT_PREFIX } from '../../env';
import { HomePage } from '../poms/app/home';
import { TeamForm, TeamFormFields } from '../poms/teamManagement/create';
import { TeamList } from '../poms/teamManagement/list';
import {faker} from '@faker-js/faker'
import { waitForSpinner } from '../helpers/utils';

test.beforeEach(async ({page}) => {
    // TODO - attempt at recording requests for reveral later.
    // page.on('requestfinished', async request => {
    //     const response = await request.response()
    //     console.log(response?.status(), request.method(), request.url(), request.postData())
    //     const method = request.method()
    //     const methodIsCreational = ["PUT", "POST"].includes(method)
    //     const responseIsCreational = 
    //     if (method === "PUT" || method)
    //     // shit - for 
    //     debugger;
    // })
})

test.describe("Team/Organization creation", () => {
    test('Can create Organization', async ({page}) => {
        const homePage = new HomePage(page)
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


        // we now fill the form.
        const teamForm = new TeamForm(page);
        const formFields: TeamFormFields = {
            name: `${PLAYWRIGHT_PREFIX}-${faker.word.noun()}`,
            alias: `${PLAYWRIGHT_PREFIX}-${faker.word.adjective()}`,
            status: true,
            practitioners: ['test1147'] // TODO - does practitioner exist
        }
        await teamForm.fillForm(formFields)

        // after Action - search for created entity in 
        await teamList.goSearch(formFields.name)
        await waitForSpinner(page)

        // should atleast one entry - TODO - possiblity of having a centralized util methods for interacting with tables - including pagination.
        const table = page.locator(".ant-table table")
        const tableRows = table.locator('tbody tr')
        const content = await tableRows.allTextContents()
        await expect(content).toContain(`${formFields.name}Edit`)
    })
})