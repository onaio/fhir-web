import {Page, Locator} from  '@playwright/test';

export class HomePage {
    readonly url: string = "/";
    readonly page: Page;
    readonly welcomeMsg: Locator;
    readonly logoutBtn: Locator;
  
    constructor(page: Page) {
      this.page = page;
      this.welcomeMsg = page.getByText(/Welcome to OpenSRP/i)
      this.logoutBtn = page.getByText('Logout')
    }
  
    async goto() {
      await this.page.goto(this.url);
    }

    accountDropDown(username: string){
      return this.page.getByRole('button', {name: new RegExp(username)})
    }

    async logout(username: string){
      const accountLocator = this.accountDropDown(username)
      accountLocator.hover()
      this.logoutBtn.click()
    }
  }