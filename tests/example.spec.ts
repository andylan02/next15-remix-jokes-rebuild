import { test, expect } from '@playwright/test';

test('homepage has expected header', async ({ page, baseURL }) => {
  await page.goto(baseURL || '/');
  // basic smoke check — adjust selector to match your header
  const header = await page.locator('h1').first();
  await expect(header).toBeVisible();
});
