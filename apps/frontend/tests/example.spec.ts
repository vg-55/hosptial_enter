import { expect, test } from '@playwright/test';

test.describe('Home page', () => {
  test('should render welcome hero', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      /platform analytics/i,
    );
  });
});
