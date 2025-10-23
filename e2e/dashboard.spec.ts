import { test, expect } from '@playwright/test';

test.describe('Dashboard Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@hospital.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('should display dashboard overview', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Dashboard Overview');
    await expect(page.locator('text=Total Patients Today')).toBeVisible();
  });

  test('should navigate to patient flow dashboard', async ({ page }) => {
    await page.click('text=Patient Flow');
    await page.waitForURL('/patient-flow');
    await expect(page.locator('h1')).toContainText('Patient Flow Analytics');
  });

  test('should navigate to occupancy dashboard', async ({ page }) => {
    await page.click('text=Occupancy');
    await page.waitForURL('/occupancy');
    await expect(page.locator('h1')).toContainText('Occupancy Analytics');
  });

  test('should navigate to custom report builder', async ({ page }) => {
    await page.click('text=Custom Reports');
    await page.waitForURL('/custom-reports');
    await expect(page.locator('h1')).toContainText('Custom Report Builder');
  });

  test('should logout successfully', async ({ page }) => {
    await page.click('button[title="Logout"]');
    await page.waitForURL('/login');
    await expect(page.locator('h2')).toContainText('Management Analytics');
  });
});

test.describe('Patient Flow Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'manager@hospital.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
    await page.click('text=Patient Flow');
    await page.waitForURL('/patient-flow');
  });

  test('should display patient flow data', async ({ page }) => {
    await expect(page.locator('text=Total Admissions')).toBeVisible();
    await expect(page.locator('text=Total Discharges')).toBeVisible();
    await expect(page.locator('text=Patient Flow Trends')).toBeVisible();
  });

  test('should allow date range filtering', async ({ page }) => {
    await page.click('button:has-text("Last 7 Days")');
    await expect(page.locator('input[type="date"]').first()).toBeVisible();
  });

  test('should export data', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Export")');
    await page.click('text=Export as CSV');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('patient-flow');
  });
});

test.describe('Custom Report Builder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@hospital.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
    await page.click('text=Custom Reports');
    await page.waitForURL('/custom-reports');
  });

  test('should allow report configuration', async ({ page }) => {
    await page.fill('input[placeholder="Enter report name"]', 'Test Report');
    
    await page.check('input[type="checkbox"]:near(:text("Date"))');
    await page.check('input[type="checkbox"]:near(:text("Patient Count"))');
    
    await expect(page.locator('input[placeholder="Enter report name"]')).toHaveValue('Test Report');
  });

  test('should generate custom report', async ({ page }) => {
    await page.fill('input[placeholder="Enter report name"]', 'Test Report');
    await page.check('input[type="checkbox"]:near(:text("Date"))');
    await page.check('input[type="checkbox"]:near(:text("Revenue"))');
    
    await page.click('button:has-text("Generate Report")');
    await page.waitForTimeout(1500);
    
    await expect(page.locator('text=Report Preview')).toBeVisible();
    await expect(page.locator('text=Report Data')).toBeVisible();
  });

  test('should save report configuration', async ({ page }) => {
    await page.fill('input[placeholder="Enter report name"]', 'Saved Report');
    await page.check('input[type="checkbox"]:near(:text("Department"))');
    await page.check('input[type="checkbox"]:near(:text("Cost"))');
    
    page.on('dialog', dialog => dialog.accept());
    await page.click('button:has-text("Save Configuration")');
  });
});

test.describe('Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@hospital.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('dashboard overview screenshot', async ({ page }) => {
    await expect(page).toHaveScreenshot('dashboard-overview.png', { fullPage: true });
  });

  test('patient flow screenshot', async ({ page }) => {
    await page.click('text=Patient Flow');
    await page.waitForURL('/patient-flow');
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot('patient-flow.png', { fullPage: true });
  });

  test('custom report builder screenshot', async ({ page }) => {
    await page.click('text=Custom Reports');
    await page.waitForURL('/custom-reports');
    await expect(page).toHaveScreenshot('custom-reports.png', { fullPage: true });
  });
});
