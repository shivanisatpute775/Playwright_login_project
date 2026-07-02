import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

Given('I open the login page', async function (this: CustomWorld) {
  await this.page.goto('https://example.com/login', { waitUntil: 'domcontentloaded' });
});

Then('the page title should contain {string}', async function (this: CustomWorld, text: string) {
  await expect(this.page).toHaveTitle(new RegExp(text, 'i'), { timeout: 15000 });
});

Given('user login into the app', async function (this: CustomWorld) {
  await this.page.goto('https://eventhub.rahulshettyacademy.com/');
 // await this.pageLocator.testPage.userEmailInput.waitFor({ state: 'visible' });
  await this.pageLocator.testPage.userEmailInput.fill('manish321@gmail.com');
  await this.pageLocator.testPage.passwordInput.fill('Manish9@@');
  await this.pageLocator.testPage.signInButton.click();
  await this.page.waitForLoadState('networkidle');
});

When('user clicks on Events tab', async function (this: CustomWorld) {
  await this.pageLocator.testPage.eventTab.click();
});

When('user clicks on add new event button', async function (this: CustomWorld) {
  await this.pageLocator.testPage.addNewEvent.click();
});

When('user fills new Event form', async function (this: CustomWorld) {
  await this.pageLocator.testPage.eventTitle.fill('Test Event');
  await this.pageLocator.testPage.categoryDD.selectOption({ index: 2 });
  await this.pageLocator.testPage.eventCity.fill('Test City');
  await this.pageLocator.testPage.eventVenue.fill('Test Venue');
  await this.pageLocator.testPage.eventCalender.fill('2026-06-30T06:28');
  await this.pageLocator.testPage.eventPrice.fill('200');
  await this.pageLocator.testPage.eventSeat.fill('5');
});

When('user clicks on add event button', async function (this: CustomWorld) {
  await this.pageLocator.testPage.addEventButton.click({ });
});

Then('user validates Event has been created', async function (this: CustomWorld) {
  await expect(this.page.getByText('25 Jun 2026')).toHaveCount(1, { timeout: 15000 });
});