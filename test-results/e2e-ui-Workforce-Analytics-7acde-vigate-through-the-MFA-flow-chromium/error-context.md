# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e-ui.spec.ts >> Workforce Analytics Dashboard - E2E UI Flow >> should load login page, enter corporate email, and navigate through the MFA flow
- Location: tests\e2e-ui.spec.ts:4:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/login
Call log:
  - navigating to "http://localhost:3000/login", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Workforce Analytics Dashboard - E2E UI Flow', () => {
  4  |   test('should load login page, enter corporate email, and navigate through the MFA flow', async ({ page }) => {
  5  |     // 1. Visit Login screen
> 6  |     await page.goto('http://localhost:3000/login');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/login
  7  |     await expect(page).toHaveTitle(/Workforce Analytics/i);
  8  | 
  9  |     // 2. Locate and enter corporate email
  10 |     const emailInput = page.locator('input[type="email"]');
  11 |     await expect(emailInput).toBeVisible();
  12 |     await emailInput.fill('employee@thestackly.com');
  13 | 
  14 |     // 3. Click Login / Submit button
  15 |     const loginButton = page.locator('button[type="submit"]');
  16 |     await loginButton.click();
  17 | 
  18 |     // 4. Assert transition to MFA Challenge screen (OTP digit inputs exist)
  19 |     const otpInputs = page.locator('input[type="text"][maxlength="1"]');
  20 |     await expect(otpInputs.first()).toBeVisible({ timeout: 5000 });
  21 | 
  22 |     // Wait for the developer auto-fill helper to populate the code
  23 |     await page.waitForTimeout(1000);
  24 | 
  25 |     const verifyButton = page.locator('button:has-text("Sign In with OTP")');
  26 |     await verifyButton.click();
  27 | 
  28 |     // 6. Verify employee dashboard welcomes page load
  29 |     await expect(page).toHaveURL(/.*dashboard/);
  30 |   });
  31 | });
  32 | 
```