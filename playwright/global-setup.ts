import { chromium, type FullConfig } from '@playwright/test';
import { PLAYWRIGHT_PASSWORD, PLAYWRIGHT_USERNAME } from './env';
import { LoginPage } from './tests/app/poms/keycloakLogin';

async function globalSetup(config: FullConfig) {
  const { baseURL, storageState } = config.projects[0].use;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(baseURL!);
  const loginPage = new LoginPage(page);
  await loginPage.login(PLAYWRIGHT_USERNAME, PLAYWRIGHT_PASSWORD)
  await page.context().storageState({ path: storageState as string });
  await browser.close();
}

export default globalSetup;