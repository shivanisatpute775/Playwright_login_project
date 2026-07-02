import { setWorldConstructor, World } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from 'playwright';
import { PageManager } from '../locators/POManager';

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  pageLocator!: PageManager;
}
setWorldConstructor(CustomWorld);