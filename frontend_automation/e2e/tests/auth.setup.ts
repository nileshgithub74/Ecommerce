import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  console.log('🔐 Setting up authentication...');
  
  const loginPage = new LoginPage(page);
  
  // Navigate to login page
  await loginPage.navigate();
  
  // Perform authentication
  await loginPage.login(
    process.env.TEST_USER_EMAIL || 'test@example.com',
    process.env.TEST_USER_PASSWORD || 'password123'
  );
  
  // Wait for successful login - adjust selector based on your app
  await expect(page.locator('[data-testid="user-menu"]')).toBeVisible({ timeout: 10000 });
  
  // Save signed-in state to 'authFile'
  await page.context().storageState({ path: authFile });
  
  console.log('✅ Authentication setup completed');
});