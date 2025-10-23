import { test, expect } from '@playwright/test';

test.describe('Billing Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@hospital.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('should navigate to billing dashboard', async ({ page }) => {
    await page.click('text=Billing');
    await page.waitForURL('/billing');
    await expect(page.locator('h1')).toContainText('Billing Dashboard');
  });

  test('should display billing statistics', async ({ page }) => {
    await page.goto('/billing');
    await expect(page.locator('text=Total Revenue')).toBeVisible();
    await expect(page.locator('text=Outstanding Balance')).toBeVisible();
    await expect(page.locator('text=Claims Processed')).toBeVisible();
  });

  test('should navigate to invoice list', async ({ page }) => {
    await page.goto('/billing');
    await page.click('text=Invoices');
    await page.waitForURL('/billing/invoices');
    await expect(page.locator('h1')).toContainText('Invoices');
  });

  test('should filter invoices by status', async ({ page }) => {
    await page.goto('/billing/invoices');
    await page.selectOption('select[aria-label="Filter by status"]', 'paid');
    await page.waitForTimeout(500);
    await expect(page.locator('tbody tr')).not.toHaveCount(0);
  });

  test('should search invoices', async ({ page }) => {
    await page.goto('/billing/invoices');
    await page.fill('input[aria-label="Search"]', 'John');
    await page.waitForTimeout(500);
    await expect(page.locator('text=John Smith')).toBeVisible();
  });

  test('should view invoice details', async ({ page }) => {
    await page.goto('/billing/invoices');
    await page.waitForTimeout(1000);
    const firstViewButton = page.locator('text=View').first();
    await firstViewButton.click();
    await page.waitForURL(/\/billing\/invoices\/.+/);
    await expect(page.locator('h1')).toContainText('Invoice');
  });

  test('should display insurance claims', async ({ page }) => {
    await page.goto('/billing/claims');
    await expect(page.locator('h1')).toContainText('Insurance Claims');
    await expect(page.locator('table')).toBeVisible();
  });

  test('should enforce RBAC - viewer cannot access billing', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'viewer@hospital.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');

    await expect(page.locator('text=Billing')).not.toBeVisible();
  });
});
