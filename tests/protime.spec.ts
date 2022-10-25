import { test, expect } from '@playwright/test';

test('protime check-in', async ({ page }) => {
  await page.goto('https://ac-systems.myprotime.eu/');

  // Log-in
  await expect(page).toHaveURL(/^https?:\/\/authentication.+/);

  await page.getByLabel('Email').fill(process.env.PROTIME_USERNAME);
  await page.getByLabel('Password').fill(process.env.PROTIME_PASSWORD);
  await page.getByText('Let me in').click();

  // Click check-in/out btn
  await expect(page).toHaveURL('https:\/\/ac-systems.myprotime.eu/#/me/');

  const checkinBtn = page.locator('[data-testid="clockingWidget_clockInOutBtn"]')
  await checkinBtn.click();
});
