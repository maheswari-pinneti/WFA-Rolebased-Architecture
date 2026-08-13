import { test, expect } from '@playwright/test';

test.describe('Workforce Analytics Dashboard - E2E UI Flow', () => {
  test('should load login page, enter corporate email, and navigate through the MFA flow', async ({ page }) => {
    // 1. Visit Login screen
    await page.goto('http://localhost:5173/login');
    await expect(page).toHaveTitle(/Workforce Analytics/i);

    // 2. Locate and enter corporate email
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
    await emailInput.fill('employee@thestackly.com');

    // 3. Click Login / Submit button
    const loginButton = page.locator('button:has-text("Sign In"), button:has-text("Login")');
    await loginButton.click();

    // 4. Assert transition to MFA Challenge screen
    const otpInput = page.locator('input[name="code"], input[placeholder*="OTP"]');
    await expect(otpInput).toBeVisible({ timeout: 5000 });

    // 5. Fill valid OTP bypass code
    await otpInput.fill('631620'); // Developer default bypass seed code
    const verifyButton = page.locator('button:has-text("Verify"), button:has-text("Submit")');
    await verifyButton.click();

    // 6. Verify employee dashboard welcomes page load
    await expect(page).toHaveURL(/.*dashboard/);
  });
});
