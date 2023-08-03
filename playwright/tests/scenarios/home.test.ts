import { test, expect, type Page } from '@playwright/test';
import { Dashboard, HomePage } from '../home';
// check home page texts and links.

test.describe("Home view", () =>{
    test('Landing view details', async ({page}) => {
        // catch all
        const homePage = new HomePage(page);
        await homePage.goto();

        const dashContents = await homePage.dashboard.section.textContent()
        expect(dashContents).toEqual()
    
    })
})