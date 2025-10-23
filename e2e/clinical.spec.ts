import { test, expect } from '@playwright/test';

test.describe('Clinical Documentation Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@hospital.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('should navigate to clinical dashboard', async ({ page }) => {
    await page.click('text=Clinical Docs');
    await page.waitForURL('/clinical');
    await expect(page.locator('h1')).toContainText('Clinical Documentation');
  });

  test('should display clinical statistics', async ({ page }) => {
    await page.goto('/clinical');
    await expect(page.locator('text=Total Clinical Notes')).toBeVisible();
    await expect(page.locator('text=Documents Uploaded')).toBeVisible();
    await expect(page.locator('text=Pending Reviews')).toBeVisible();
  });

  test('should navigate to clinical notes list', async ({ page }) => {
    await page.goto('/clinical');
    await page.click('text=Clinical Notes');
    await page.waitForURL('/clinical/notes');
    await expect(page.locator('h1')).toContainText('Clinical Notes');
  });

  test('should filter notes by type', async ({ page }) => {
    await page.goto('/clinical/notes');
    await page.selectOption('select[aria-label="Filter by type"]', 'progress');
    await page.waitForTimeout(500);
    await expect(page.locator('table')).toBeVisible();
  });

  test('should search clinical notes', async ({ page }) => {
    await page.goto('/clinical/notes');
    await page.fill('input[aria-label="Search"]', 'fracture');
    await page.waitForTimeout(500);
    await expect(page.locator('text=Ankle Fracture')).toBeVisible();
  });

  test('should display audit indicators', async ({ page }) => {
    await page.goto('/clinical/notes');
    await expect(page.locator('text=Audited')).toBeVisible();
  });

  test('should enforce RBAC for clinical access', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'viewer@hospital.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');

    await expect(page.locator('text=Clinical Docs')).not.toBeVisible();
  });
});
