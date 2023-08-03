import { test, expect } from '@playwright/test';
import { PLAYWRIGHT_PASSWORD, PLAYWRIGHT_USERNAME } from '../../env';
import {HomePage} from './poms/home'
import { LoginPage } from './poms/keycloakLogin';

// use no authentication state if one is already created.
test.use({
  storageState: {}
})

test('Will not login wrong credentials', async ({ page }) => {
  const homePage = new HomePage(page)
  await homePage.goto()

  const loginPage = new LoginPage(page)
  await loginPage.login("", "shouldNotExist")

  // expect login attempt to fail
  await expect(loginPage.invalidLoginText).toBeVisible()
});

test('logs in and then out', async ({ page }) => {
  const homePage = new HomePage(page)
  await homePage.goto()

  await expect(homePage.dashboard.welcomeMsg).not.toBeVisible()

  const loginPage = new LoginPage(page)
  await loginPage.login(PLAYWRIGHT_USERNAME, PLAYWRIGHT_PASSWORD)

  // expect login attempt to fail
  await expect(homePage.dashboard.welcomeMsg).toBeVisible()
  await homePage.logout(PLAYWRIGHT_USERNAME)

  await page.waitForSelector("input[name='login']")
});