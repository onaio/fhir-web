import { test, expect } from '@playwright/test';
import { PLAYWRIGHT_BASE_URL, PLAYWRIGHT_PREFIX } from '../../env';
import { HomePage } from '../poms/app/home';
import { waitForSpinner } from '../helpers/utils';
import { CommodityList } from '../poms/commodityManagement/list';
import { CommodityForm, CommodityFormFields } from '../poms/commodityManagement/create';
import {faker} from '@faker-js/faker'

const commodity1 : CommodityFormFields = {
    name: `${PLAYWRIGHT_PREFIX}-${faker.commerce.productName()}`,
    status: true,
    type: 'Medication',
    measure: 'Tablets'
}

test.describe("Commodity Management", () => {
    test('Can see existing commodities', async ({ page }) => {
        const homePage = new HomePage(page)
        await homePage.goto()

        // go to commodities list view
        await homePage.dashboard.groupsLink.click()
        await waitForSpinner(page)
        await expect(page).toHaveURL(`${PLAYWRIGHT_BASE_URL}/groups/list`)

        // confirm list view is loaded.
        await expect(homePage.dashboard.section.getByRole("heading", { name: /Groups List/i })).toBeVisible()

        // we do not know what commodities would be here
        const tableHeader = homePage.page.locator('table thead')
        await expect(tableHeader.allTextContents()).toEqual("")
    })

    test('Can create new commodities and see them',async ({page}) => {
        const homePage = new HomePage(page)
        await homePage.goto()

        // go to commodities list view
        await homePage.dashboard.groupsLink.click()
        await waitForSpinner(page)
        await expect(page).toHaveURL(`${PLAYWRIGHT_BASE_URL}/groups/list`)

        // confirm list view is loaded.
        await expect(homePage.dashboard.section.getByRole("heading", { name: /Groups List/i })).toBeVisible()

        const commodityList = new CommodityList(page);
        await commodityList.addCommodityBtn.click();

        const commodityForm = new CommodityForm(page);
        commodityForm.fillForm(commodity1);

        commodityList.goSearch(commodity1.name)
        // expect at least on table record and all records names should include this commodity name

        const tableEntries = commodityForm.page.locator('table tbody').getByText(commodity1.name)
        await expect(tableEntries).toBeVisible()

        const areSuperStrings = await (await tableEntries.allInnerTexts()).every(str => str.includes(commodity1.name))
        expect(areSuperStrings).toBeTruthy()
        
        // TODO - edit created commodity
    })
})