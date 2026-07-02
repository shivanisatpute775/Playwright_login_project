const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  await page.goto('https://eventhub.rahulshettyacademy.com/', { waitUntil: 'domcontentloaded' });
  await page.getByPlaceholder('you@email.com').fill('manish123@gmail.com');
  await page.getByPlaceholder('••••••').fill('Manish9@@');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForLoadState('networkidle');
  await page.goto('https://eventhub.rahulshettyacademy.com/events', { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle');

  // Open the form
  await page.getByRole('button', { name: 'Add New Event' }).click();
  await page.waitForTimeout(300);

  // Submit a valid event with whitespace-only title
  await page.locator('#event-title-input').fill('   ');
  await page.locator('#city').fill('C');
  await page.locator('#venue').fill('V');
  await page.locator('//input[@id="event-date-&-time"]').fill('2026-06-30T06:28');
  await page.locator('input[placeholder="0.00"]').fill('100');
  await page.locator('#total-seats').fill('5');
  await page.locator('#add-event-btn').click();

  // After 1.5s, what state are we in?
  await page.waitForTimeout(1500);
  console.log('URL after submit:', page.url());
  console.log('Form button visible:', await page.locator('#add-event-btn').isVisible().catch(() => false));
  console.log('Title input visible:', await page.locator('#event-title-input').isVisible().catch(() => false));
  console.log('Toast visible:', await page.locator('p', { hasText: /^Event created!$/ }).isVisible().catch(() => false));

  // Inspect the form's state (was it cleared?)
  const titleValue = await page.locator('#event-title-input').inputValue().catch(() => '(no input)');
  const cityValue = await page.locator('#city').inputValue().catch(() => '(no input)');
  console.log('Title input value after submit:', JSON.stringify(titleValue));
  console.log('City input value after submit:', JSON.stringify(cityValue));

  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });