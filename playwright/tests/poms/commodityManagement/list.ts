import { Page, Locator } from '@playwright/test';
import { GroupList } from '../groupManagement/list';

export class CommodityList extends GroupList{
    readonly addCommodityBtn: Locator

    constructor(page: Page){
        super(page)
        this.addCommodityBtn = page.getByRole('button', { name: /Add Commodity/i })
    }
}