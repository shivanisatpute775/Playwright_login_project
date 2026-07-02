import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

/**
 * Login flow step definitions for src/tests/features/login.feature.
 *
 * NOTE: Generic step phrases such as "the user enters email {string} and
 * password {string}" and "the user clicks the Sign In button" already exist in
 * src/tests/steps/eventhub.steps.ts (which is auto-loaded by cucumber.js).
 * We deliberately do NOT re-register those phrases here to avoid the
 * "Multiple step definitions match" ambiguity Cucumber reports. This file
 * only registers the login-feature-specific phrases that don't exist
 * elsewhere:
 *
 *   - "I am on the EventHub login page"     (Background step)
 *   - "the user clicks the Sign In button without filling the form"
 *   - "the user should be redirected to the home page"
 *   - "the Logout button should be visible"
 *   - "the Logout button should not be visible"
 *
 * The "the user should remain on the login page" phrase already exists in
 * eventhub.steps.ts ("the user remains on the login page"). We use the
 * existing phrasing in the feature file.
 */

const LOGIN_URL = 'https://eventhub.rahulshettyacademy.com/login';

/**
 * Open the EventHub login page directly. Distinct from the existing
 * "the user opens the EventHub login page" (which navigates to BASE_URL
 * "/" and waits for the form to appear there). This variant pins to /login
 * so the Background guarantees each scenario starts on the login route
 * — important for TC_002/TC_004 where the URL assertion is load-bearing.
 */
Given('I am on the EventHub login page', async function (this: CustomWorld) {
  await this.page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded' });
  // Auto-wait for the email input so subsequent fills don't race the form render.
  await this.pageLocator.testPage.userEmailInput.waitFor({ state: 'visible' });
});

/**
 * TC_003 boundary case: click Sign In without filling either field.
 * HTML5 `required` validation should block submission; we also defensively
 * check that the URL does not change so a regression that wires up
 * noValidate on the form would be caught loudly.
 */
When(
  'the user clicks the Sign In button without filling the form',
  async function (this: CustomWorld) {
    const urlBefore = this.page.url();
    await this.pageLocator.testPage.signInButton.click();
    // HTML5 validation aborts the submit synchronously — a short poll is
    // enough to let the browser surface the validation tooltip.
    await this.page.waitForTimeout(500);
    const urlAfter = this.page.url();
    if (urlBefore !== urlAfter) {
      throw new Error(
        `Expected no navigation when submitting empty form, but URL changed ` +
        `from "${urlBefore}" to "${urlAfter}"`
      );
    }
  }
);

/**
 * Assert the post-login URL is the EventHub home page ("/"). The login
 * API responds 200 + a client-side redirect; some builds may leave a
 * trailing slash, so we match the pattern rather than strict equality.
 * Distinct from the existing "the user is redirected away from the login
 * page" (which is a softer check) — this one asserts a positive URL match.
 */
Then('the user should be redirected to the home page', async function (this: CustomWorld) {
  const url = this.page.url();
  expect(url).toMatch(/\/$/);
  expect(url).not.toContain('/login');
});

/**
 * Assert the Logout button is in the DOM and visible. This is the
 * canonical "authenticated" marker per login-testcases.json's expectedResult.
 */
Then('the Logout button should be visible', async function (this: CustomWorld) {
  await expect(this.pageLocator.testPage.logoutButton).toBeVisible({ timeout: 10000 });
});

/**
 * Assert the Logout button is NOT visible. Uses a negated toBeVisible
 * which auto-retries briefly before failing — preferable to a fixed-time
 * sleep that masks slow renders.
 */
Then('the Logout button should not be visible', async function (this: CustomWorld) {
  await expect(this.pageLocator.testPage.logoutButton).not.toBeVisible({ timeout: 5000 });
});