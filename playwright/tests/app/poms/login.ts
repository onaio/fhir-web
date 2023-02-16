import {Page, Locator} from  '@playwright/test';

export class LoginPage {
    readonly url: string;
    readonly page: Page;
    // readonly getStartedLink: Locator;
    // readonly gettingStartedHeader: Locator;
    // readonly pomLink: Locator;
    // readonly tocList: Locator;
  
    constructor(page: Page, url: string) {
      this.page = page;
      this.url = url;
    //   this.getStartedLink = page.locator('a', { hasText: 'Get started' });
    //   this.gettingStartedHeader = page.locator('h1', { hasText: 'Installation' });
    //   this.pomLink = page.locator('li', { hasText: 'Guides' }).locator('a', { hasText: 'Page Object Model' });
    //   this.tocList = page.locator('article div.markdown ul > li > a');
    }
  
    async goto() {
      await this.page.goto(this.url);
    }
  
    // async getStarted() {
    //   await this.getStartedLink.first().click();
    //   await expect(this.gettingStartedHeader).toBeVisible();
    // }
  
    // async pageObjectModel() {
    //   await this.getStarted();
    //   await this.pomLink.click();
    // }
  }