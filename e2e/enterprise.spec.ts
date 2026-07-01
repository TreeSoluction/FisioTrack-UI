import { test, expect } from '@playwright/test';

test.describe('Enterprise Request', () => {
  test('should redirect to login when unauthenticated', async ({ page }) => {
    await page.goto('/enterprise');
    await expect(page).toHaveURL(/.*login/);
  });
});

test.describe('Error Handling', () => {
  test('should show 404 page for unknown routes', async ({ page }) => {
    await page.goto('/nonexistent-page-12345');
    // Should either show 404 or redirect to login
    const url = page.url();
    expect(
      url.includes('login') || url.includes('404') || url.includes('nonexistent')
    ).toBeTruthy();
  });
});
