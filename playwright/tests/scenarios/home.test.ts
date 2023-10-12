import { test, expect, type Page } from '@playwright/test';
import { Dashboard, HomePage } from '../poms/app/home';
import { waitForSpinner } from '../helpers/utils';
// check home page texts and links.

test.describe("Home view", () =>{
    test('Landing view details', async ({page}) => {
        // catch all
        const homePage = new HomePage(page);
        await homePage.goto();

        await waitForSpinner(page)

        const dashContents = await homePage.dashboard.section.textContent()
        expect(dashContents).toEqual("Welcome to OpenSRPUser ManagementLocation ManagementCare Teams ManagementTeam ManagementGroup ManagementCommodity ManagementQuestionnaire ManagementPatients")
    
    })
})