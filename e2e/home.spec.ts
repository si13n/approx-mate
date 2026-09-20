import { test, expect } from '@playwright/test';

test('ApproxMate homepage opens', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Approxmate/i);
});