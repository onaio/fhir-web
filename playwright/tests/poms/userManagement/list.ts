import { Page, Locator } from '@playwright/test';
import { ListCommon } from '../listCommon';

export class UserListDash extends ListCommon {
    readonly page: Page
    readonly addUserBtn: Locator

    constructor(page:Page){
        super(page)
        this.addUserBtn = page.getByRole('button', {name: /Add User/i})
    }
}