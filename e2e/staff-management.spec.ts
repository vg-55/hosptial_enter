import { test, expect } from '@playwright/test';

test.describe('Staff Management Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@hospital.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('should navigate to staff dashboard', async ({ page }) => {
    await page.click('text=Staff Mgmt');
    await page.waitForURL('/staff');
    await expect(page.locator('h1')).toContainText('Staff Management');
  });

  test('should display staff statistics', async ({ page }) => {
    await page.goto('/staff');
    await expect(page.locator('text=Total Staff')).toBeVisible();
    await expect(page.locator('text=Active Shifts')).toBeVisible();
    await expect(page.locator('text=Avg. Performance Rating')).toBeVisible();
  });

  test('should navigate to staff directory', async ({ page }) => {
    await page.goto('/staff');
    await page.click('text=Staff Directory');
    await page.waitForURL('/staff/list');
    await expect(page.locator('h1')).toContainText('Staff Directory');
  });

  test('should filter staff by department', async ({ page }) => {
    await page.goto('/staff/list');
    const departmentSelect = page.locator('select[aria-label="Filter by department"]');
    await departmentSelect.selectOption('Emergency');
    await page.waitForTimeout(500);
    await expect(page.locator('table')).toBeVisible();
  });

  test('should search staff members', async ({ page }) => {
    await page.goto('/staff/list');
    await page.fill('input[aria-label="Search"]', 'Sarah');
    await page.waitForTimeout(500);
    await expect(page.locator('text=Dr. Sarah Johnson')).toBeVisible();
  });

  test('should navigate to shift scheduler', async ({ page }) => {
    await page.goto('/staff');
    await page.click('text=Shift Scheduling');
    await page.waitForURL('/staff/schedule');
    await expect(page.locator('h1')).toContainText('Shift Scheduler');
  });

  test('should display shifts for selected date', async ({ page }) => {
    await page.goto('/staff/schedule');
    const dateInput = page.locator('input[type="date"]');
    await dateInput.fill('2024-02-15');
    await page.waitForTimeout(500);
    await expect(page.locator('text=Morning Shift').or(page.locator('text=No shifts scheduled'))).toBeVisible();
  });

  test('should enforce RBAC for staff management', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'viewer@hospital.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');

    await expect(page.locator('text=Staff Mgmt')).not.toBeVisible();
  });
});
