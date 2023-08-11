import { Locator, expect, Page } from "@playwright/test"

export async function waitForKeycloakResponses(page){
    return await page.waitForResponse(new RegExp(process.env.FHIR_BASE_URL))
}

// TODO - idea is to have a single util function that can help fill dropdown select
// export async function fillDropDownSelect(select: Locator, labels: string[]){
//     await select.click()
//     for (const label of labels){
//         await select.fill(label)
//         await this.page.getByTitle(new RegExp(label, "i")).getByText(new RegExp(practitioner, "i")).click()
//     }
//     await this.practitionersField.click()
// }

export async function waitForSpinnerToHide(page: Page){
    await expect(page.locator("div.ant-spin")).toBeHidden()
}

export async function waitForSpinnerToShow(page: Page){
    await expect(page.locator("div.ant-spin")).toBeVisible()
}

export async function waitForSpinner(page: Page){
    // await waitForSpinnerToShow(page);
    await waitForSpinnerToHide(page);
}