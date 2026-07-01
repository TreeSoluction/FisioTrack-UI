import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should redirect unauthenticated user to login', async ({ page }) => {
    await expect(page).toHaveURL(/.*login/);
  });

  test('should render login form with email and password', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Senha')).toBeVisible();
    await expect(page.getByRole('button', { name: /entrar/i })).toBeVisible();
  });

  test('should show validation error for empty email', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').blur();
    await expect(page.getByText(/email é obrigatório/i)).toBeVisible();
  });

  test('should show validation error for short password', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Senha').fill('123');
    await page.getByLabel('Senha').blur();
    await expect(page.getByText(/pelo menos 6 caracteres/i)).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('wrong@example.com');
    await page.getByLabel('Senha').fill('wrongpassword');
    await page.getByRole('button', { name: /entrar/i }).click();
    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: /registre-se/i }).click();
    await expect(page).toHaveURL(/.*register/);
  });
});

test.describe('Registration Flow', () => {
  test('should render registration form', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByLabel('Nome')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Senha')).toBeVisible();
    await expect(page.getByLabel('Confirmar Senha')).toBeVisible();
  });

  test('should show error for mismatched passwords', async ({ page }) => {
    await page.goto('/register');
    await page.getByLabel('Nome').fill('Test User');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Senha').fill('password123');
    await page.getByLabel('Confirmar Senha').fill('different');
    await page.getByRole('button', { name: /criar conta/i }).click();
    await expect(page.getByText(/senhas não coincidem/i)).toBeVisible();
  });

  test('should navigate back to login', async ({ page }) => {
    await page.goto('/register');
    await page.getByRole('link', { name: /entrar/i }).click();
    await expect(page).toHaveURL(/.*login/);
  });
});
