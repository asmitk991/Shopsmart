import { test, expect } from '@playwright/test';

test.describe('ShopSmart E2E', () => {
  test('homepage loads and shows products', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/ShopSmart/i);
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible({
      timeout: 10000,
    });
  });

  test('can navigate to product detail', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-testid="product-card"]').first().click();
    await expect(page.url()).toContain('/product/');
  });

  test('login page is accessible', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('cart is accessible after login flow', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.goto('/cart');
    await expect(page.locator('[data-testid="cart-container"]')).toBeVisible();
  });
});
