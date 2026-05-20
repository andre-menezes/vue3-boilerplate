import { test, expect, type Page } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.route('**/login', async (route) => {
      if (route.request().method() !== 'POST') {
        await route.continue();
        return;
      }

      const body = route.request().postDataJSON() as { email?: string; password?: string };

      if (body.email === 'admin@example.com' && body.password === '123456') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            accessToken: 'e2e-token',
            user: {
              id: '550e8400-e29b-41d4-a716-446655440000',
              email: 'admin@example.com',
              name: 'Admin User',
              role: 'admin',
            },
          }),
        });
        return;
      }

      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Email ou senha inválidos' }),
      });
    });
  });

  async function login(page: Page) {
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 5000 });
    await page.getByLabel('E-mail').fill('admin@example.com');
    await page.getByLabel('Senha').fill('123456');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page).toHaveURL('/', { timeout: 5000 });
  }

  test('should redirect to login when accessing home without token', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 5000 });

    await expect(page).toHaveURL('/login');

    await expect(page.getByLabel('E-mail')).toBeVisible();
    await expect(page.getByLabel('Senha')).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await login(page);

    await expect(page.locator('text=Admin User')).toBeVisible();
    await expect(page.locator('[data-testid="logout-btn"]')).toBeVisible();
  });

  test('should show error message with invalid credentials', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 5000 });

    await page.getByLabel('E-mail').fill('invalid@example.com');
    await page.getByLabel('Senha').fill('wrongpassword');

    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page.locator('text=Email ou senha inválidos')).toBeVisible({ timeout: 5000 });

    await expect(page).toHaveURL('/login');
  });

  test('should maintain authentication after page reload', async ({ page }) => {
    await login(page);

    await page.reload({ waitUntil: 'domcontentloaded', timeout: 5000 });

    await expect(page).toHaveURL('/');
    await expect(page.locator('text=Admin User')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    await login(page);

    await page.locator('[data-testid="logout-btn"]').click();

    await expect(page).toHaveURL('/login', { timeout: 5000 });

    const token = await page.evaluate(() => {
      const auth = localStorage.getItem('auth');
      return auth ? JSON.parse(auth).token : null;
    });

    expect(token).toBeNull();
  });
});
