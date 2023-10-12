import { test, expect }  from '@playwright/test';
import { PLAYWRIGHT_BASE_URL, PLAYWRIGHT_PREFIX } from '../../env';
import { HomePage } from '../poms/app/home';
import { TeamForm, TeamFormFields } from '../poms/teamManagement/create';
import { TeamList } from '../poms/teamManagement/list';
import {faker} from '@faker-js/faker'
import { waitForSpinner } from '../helpers/utils';
import { LocationUnitList } from '../poms/locationManagement/list';
import { LocationForm, LocationFormFields } from '../poms/locationManagement/create';

/**
 * User is able to manage locations, i.e. create and edit locations, and view all locations.
 */

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

const parentLocation: LocationFormFields = {
    name: `${PLAYWRIGHT_PREFIX}-${faker.location.country()}`,
    alias: faker.word.adjective(),
    status: true,
    physicalType: faker.helpers.arrayElement(['jurisdiction', 'building']),
    description: '',
}

const childLocation: LocationFormFields = {
    partOf: parentLocation.name,
    name: `${PLAYWRIGHT_PREFIX}-${faker.location.country()}`,
    alias: faker.word.adjective(),
    status: true,
    physicalType: faker.helpers.arrayElement(['jurisdiction', 'building']),
    description: '',
}

test.describe("Location Management", () => {
    test('Can see existing Locations', async ({page}) => {
        const homePage = new HomePage(page)
        await homePage.goto()

        // go to location list view
        await homePage.dashboard.locationsLink.click()
        await expect(page.locator("div.ant-spin")).toBeHidden({timeout: 10000})
        await expect(page).toHaveURL(`${PLAYWRIGHT_BASE_URL}/admin/location/unit`)

        // confirm list view is loaded.
        await expect(homePage.dashboard.section.getByRole("heading", {name: /Location Unit management/i})).toBeVisible()
    })

    test.skip('Create locations within a hierarchy', async ({page}) => {
        const homePage = new HomePage(page)
        await homePage.goto()

        // go to location list view
        await homePage.dashboard.locationsLink.click()
        await waitForSpinner(page)
        await expect(page).toHaveURL(`${PLAYWRIGHT_BASE_URL}/admin/location/unit`)

        // confirm organization list view is loaded.
        await expect(homePage.dashboard.section.getByRole("heading", {name: /Location Unit management/i})).toBeVisible()

        // add location
        const locationList = new LocationUnitList(page)
        await locationList.addLocationBtn.click()
        await expect(page).toHaveURL(`${PLAYWRIGHT_BASE_URL}/admin/teams/add`)

        // confirm organization creation view is loaded
        await expect(homePage.dashboard.section.getByRole("heading", {name: /Create team/i})).toBeVisible()

        // we now fill the form.
        const teamForm = new LocationForm(page);
        const formFields: TeamFormFields = {
            name: `${PLAYWRIGHT_PREFIX}-${faker.word.noun()}`,
            alias: `${PLAYWRIGHT_PREFIX}-${faker.word.adjective()}`,
            status: true,
            practitioners: ['test1147'] // TODO - does practitioner exist
        }
        await teamForm.fillForm(formFields)

        // after Action - search for created entity in 
        await locationList.goSearch(formFields.name)
        await waitForSpinner(page)

        // should atleast one entry - TODO - possiblity of having a centralized util methods for interacting with tables - including pagination.
        const table = page.locator(".ant-table table")
        const tableRows = table.locator('tbody tr')
        const content = await tableRows.allTextContents()
        await expect(content).toContain(`${formFields.name}Edit`)
    })
})