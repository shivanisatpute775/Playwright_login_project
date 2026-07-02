import { Page } from '@playwright/test';
import { TestPage } from '../locators/test.locator';

export class PageManager {
    constructor(private page: Page) { }

    private _testPage?: TestPage;


    get testPage(): TestPage {
        if (!this._testPage) {
            this._testPage = new TestPage(this.page);
        }
        return  this._testPage;
    }
}