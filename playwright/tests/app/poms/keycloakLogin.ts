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
  
    constructor(page: Page, url: string) {
      this.page = page;
      this.usernameInput = page.locator('id=username');
      this.passwordInput = page.locator('id=password');
      this.signInBtn = page.get_by_text('Sign In');
      this.invalidLoginText = page.get_by_text('Invalid username or password.')
    }

    async login(username:string, password: string){
        this.usernameInput.fill(username);
        this.passwordInput.fill(password);
        this.signInBtn.click()
    }

  }