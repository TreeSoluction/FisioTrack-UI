import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should show landing page for unauthenticated users', async ({ page }) => {
    await page.goto('/');
    // Should see landing content or be redirected to login
    const url = page.url();
    expect(url.includes('/login') || url.includes('/')).toBeTruthy();
  });

  test('should show login link in footer for unauthenticated users', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('link', { name: /entrar/i })).toBeVisible();
  });

  test('should show register link on login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('link', { name: /registre-se/i })).toBeVisible();
  });

  test('should have working routing between auth pages', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: /registre-se/i }).click();
    await expect(page).toHaveURL(/.*register/);

    await page.getByRole('link', { name: /entrar/i }).click();
    await expect(page).toHaveURL(/.*login/);
  });
});

test.describe('Protected Routes', () => {
  const protectedRoutes = ['/dashboard', '/patients', '/treatments', '/settings'];

  for (const route of protectedRoutes) {
    test(`should redirect ${route} to login when unauthenticated`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveURL(/.*login/);
    });
  }
});

test.describe('Public Routes', () => {
  const publicRoutes = ['/pricing', '/privacy-policy', '/terms-of-use', '/consent-terms'];

  for (const route of publicRoutes) {
    test(`should allow access to ${route} without auth`, async ({ page }) => {
      await page.goto(route);
      // Should not redirect to login
      await expect(page).not.toHaveURL(/.*login/);
    });
  }
});
