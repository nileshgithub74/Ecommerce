import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { HomePage } from '../../pages/HomePage';

test.describe('Authentication Tests', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
  });

  test('should login with valid credentials', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.verifyPageLoaded();
    
    await loginPage.login('test@example.com', 'password123');
    
    // Verify successful login
    await expect(page).toHaveURL('/');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await loginPage.navigate();
    
    await loginPage.loginWithInvalidCredentials('invalid@example.com', 'wrongpassword');
    
    // Verify error message
    await loginPage.verifyErrorMessage('Invalid email or password');
    await expect(page).toHaveURL('/login');
  });

  test('should validate required fields', async ({ page }) => {
    await loginPage.navigate();
    
    await loginPage.verifyFormValidation();
  });

  test('should toggle between login and signup forms', async ({ page }) => {
    await loginPage.navigate();
    
    // Switch to signup form
    await loginPage.switchToSignupForm();
    await expect(page.locator('[data-testid="signup-form"]')).toBeVisible();
    
    // Switch back to login form
    await loginPage.switchToLoginForm();
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
  });

  test('should handle forgot password flow', async ({ page }) => {
    await loginPage.navigate();
    
    await loginPage.clickForgotPassword();
    
    // Verify navigation to forgot password page or modal
    await expect(page.locator('[data-testid="forgot-password-form"]')).toBeVisible();
  });

  test('should signup new user successfully', async ({ page }) => {
    await loginPage.navigate();
    
    const timestamp = Date.now();
    await loginPage.signup(
      'Test User',
      `test${timestamp}@example.com`,
      'password123'
    );
    
    // Verify successful signup
    await loginPage.verifySuccessMessage('Account created successfully');
  });

  test('should prevent signup with existing email', async ({ page }) => {
    await loginPage.navigate();
    
    await loginPage.signup(
      'Test User',
      'existing@example.com',
      'password123'
    );
    
    // Verify error message
    await loginPage.verifyErrorMessage('Email already exists');
  });

  test('should validate email format', async ({ page }) => {
    await loginPage.navigate();
    
    await loginPage.fillInput('[data-testid="email-input"]', 'invalid-email');
    await loginPage.clickElement('[data-testid="login-button"]');
    
    // Verify email validation
    await expect(page.locator('[data-testid="email-validation"]')).toBeVisible();
  });

  test('should validate password strength', async ({ page }) => {
    await loginPage.navigate();
    await loginPage.switchToSignupForm();
    
    await loginPage.fillInput('[data-testid="password-input"]', '123');
    await loginPage.clickElement('[data-testid="signup-button"]');
    
    // Verify password validation
    await expect(page.locator('[data-testid="password-validation"]')).toBeVisible();
  });

  test('should clear form fields', async ({ page }) => {
    await loginPage.navigate();
    
    await loginPage.fillInput('[data-testid="email-input"]', 'test@example.com');
    await loginPage.fillInput('[data-testid="password-input"]', 'password123');
    
    await loginPage.clearForm();
    
    // Verify fields are cleared
    await expect(page.locator('[data-testid="email-input"]')).toHaveValue('');
    await expect(page.locator('[data-testid="password-input"]')).toHaveValue('');
  });
});