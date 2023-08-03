import {Page, Locator} from  '@playwright/test';
/**
 * keycloak login page
 *  - Need to add locators for error messages as well.
 *  - Add storage layer for authentication state.
 */

export class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly signInBtn: Locator;
    readonly invalidLoginText: Locator;
  
    constructor(page: Page) {
      this.page = page;
      this.usernameInput = page.locator('id=username');
      this.passwordInput = page.locator('id=password');
      this.signInBtn =  page.getByRole('button', { name: 'Sign In' })
      this.invalidLoginText = page.getByText('Invalid username or password.')
    }

    async login(username:string, password: string){
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.signInBtn.click()
    }

  }