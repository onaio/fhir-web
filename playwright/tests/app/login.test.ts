import { test, expect } from '@playwright/test';


test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000');
});

// using page Object Modal.

// able to login with correct credentials. - credentials need to be passed as env.
// should not login if credentials are wrong.
// user can logout after loggin in.

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects the URL to contain intro.
  await expect(page).toHaveURL(/.*intro/);
});
