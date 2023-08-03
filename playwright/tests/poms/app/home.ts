import {Page, Locator} from  '@playwright/test';

export class MenuBar {
  // navigationlinks
  readonly section: Locator
  readonly logo: Locator
  readonly version: Locator
  readonly administrationNav: Locator
  readonly userManagementNav: Locator
  readonly userListNav: Locator
  readonly userGroupListNav: Locator
  readonly userRolesListNav: Locator
  readonly locationManagementNav: Locator
  readonly locationUnitListNav: Locator
  readonly careTeamsManagementNav: Locator
  readonly teamManagementNav: Locator
  readonly teamListNav: Locator
  readonly teamAssignmentNav: Locator
  readonly groupManagementNav: Locator
  readonly commodityManagementNav: Locator
  readonly questManagementNav: Locator
  

  constructor(page: Page){
    const section = page.locator('aside.ant-layout-sider')
    this.section = section
    this.logo = section.locator("div.logo").filter({
      has: section.getByAltText(/The logo/i)
    })
    this.version = section.locator(".sidebar-version")
    const menuTitleContent = section.locator("span.ant-menu-title-content")
    this.administrationNav = menuTitleContent.filter({
      hasText: /Administration/i
    })
    this.userManagementNav = menuTitleContent.filter({
      hasText: /User Management/i
    })
    this.userListNav = menuTitleContent.filter({
      hasText: /users/i
    })
    this.userGroupListNav = menuTitleContent.filter({
      hasText: /User Groups/i
    })
    this.userRolesListNav = menuTitleContent.filter({
      hasText: /User Roles/i
    })
    this.locationManagementNav = menuTitleContent.filter({
      hasText: /Location Management/i
    })
    this.locationUnitListNav = menuTitleContent.filter({
      hasText: /Location Units/i
    })
    this.careTeamsManagementNav = menuTitleContent.filter({
      hasText: /Care Teams Management/i
    })
    this.teamManagementNav = menuTitleContent.filter({
      hasText: /Team Management/i
    })
    this.teamListNav = menuTitleContent.filter({
      hasText: /Teams/i
    })
    this.teamAssignmentNav = menuTitleContent.filter({
      hasText: /Team Assignment/i
    })
    this.groupManagementNav = menuTitleContent.filter({
      hasText: /Group Management/i
    })
    this.commodityManagementNav = menuTitleContent.filter({
      hasText: /Commodity Management/i
    })
    this.questManagementNav = menuTitleContent.filter({
      hasText: /Questionnaire Management/i
    })
  }

  getNavByText(navText: string){
    return this.section.locator("span.ant-menu-title-content").filter({
      hasText: new RegExp(navText, 'i')
    })
  }
}

export class Dashboard{
  readonly section: Locator
  readonly welcomeMsg: Locator
  readonly usersLink: Locator
  readonly locationsLink: Locator
  readonly careTeamsLink: Locator
  readonly teamsLink: Locator
  readonly groupsLink: Locator
  readonly commoditiesLink: Locator
  readonly questLink: Locator

  constructor(page: Page){
    this.section = page.locator("main.ant-layout-content")
    this.welcomeMsg = this.section.getByText(/Welcome to OpenSRP/i)
    this.usersLink = this.section.getByText(/User Management/i)
    this.locationsLink = this.section.getByText(/Location Management/i)
    this.careTeamsLink = this.section.getByText(/Care Teams Management/i)
    this.teamsLink = this.section.getByText(/Team Management/i)
    this.groupsLink = this.section.getByText(/Group Management/i)
    this.commoditiesLink = this.section.getByText(/Commodity Management/i)
    this.questLink = this.section.getByText(/Questionnaire Management/i)
  }
}

export class HomePage {
    readonly url: string = "/";
    readonly page: Page;
    readonly welcomeMsg: Locator;
    readonly logoutBtn: Locator;
    readonly dashboard: Dashboard;
    readonly sidebar: MenuBar;
  
    constructor(page: Page) {
      this.page = page;
      this.logoutBtn = page.getByText('Logout')
      this.dashboard = new Dashboard(page)
      this.sidebar = new MenuBar(page)
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