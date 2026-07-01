import { test, expect } from '@playwright/test';

test.describe('Settings Page', () => {
  test('should redirect to login when unauthenticated', async ({ page }) => {
    await page.goto('/settings');
    await expect(page).toHaveURL(/.*login/);
  });
});

test.describe('Pricing Page', () => {
  test('should display pricing plans', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByText(/gratuito/i)).toBeVisible();
    await expect(page.getByText(/pro/i)).first().toBeVisible();
    await expect(page.getByText(/enterprise/i)).toBeVisible();
  });

  test('should show plan prices', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByText(/r\$/i).first()).toBeVisible();
  });
});

test.describe('Static Pages', () => {
  test('should render privacy policy page', async ({ page }) => {
    await page.goto('/privacy-policy');
    await expect(page.locator('body')).toContainText(/privacidade/i);
  });

  test('should render terms of use page', async ({ page }) => {
    await page.goto('/terms-of-use');
    await expect(page.locator('body')).toContainText(/termos/i);
  });

  test('should render consent terms page', async ({ page }) => {
    await page.goto('/consent-terms');
    await expect(page.locator('body')).toContainText(/consent/i);
  });
});
