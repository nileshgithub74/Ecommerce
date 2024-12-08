import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Locators
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly signupButton: Locator;
  private readonly forgotPasswordLink: Locator;
  private readonly errorMessage: Locator;
  private readonly successMessage: Locator;
  private readonly loginForm: Locator;
  private readonly signupForm: Locator;
  private readonly toggleFormButton: Locator;

  constructor(page: Page) {
    super(page, '/login');
    
    // Initialize locators
    this.emailInput = page.locator('[data-testid="email-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.loginButton = page.locator('[data-testid="login-button"]');
    this.signupButton = page.locator('[data-testid="signup-button"]');
    this.forgotPasswordLink = page.locator('[data-testid="forgot-password-link"]');
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.successMessage = page.locator('[data-testid="success-message"]');
    this.loginForm = page.locator('[data-testid="login-form"]');
    this.signupForm = page.locator('[data-testid="signup-form"]');
    this.toggleFormButton = page.locator('[data-testid="toggle-form-button"]');
  }

  /**
   * Verify login page is loaded
   */
  async verifyPageLoaded(): Promise<void> {
    await this.waitForElement('[data-testid="login-form"]');
  }

  /**
   * Perform login
   */
  async login(email: string, password: string): Promise<void> {
    await this.fillInput('[data-testid="email-input"]', email);
    await this.fillInput('[data-testid="password-input"]', password);
    await this.clickElement('[data-testid="login-button"]');
    
    // Wait for navigation or success indicator
    await this.page.waitForURL('/', { timeout: 10000 });
  }

  /**
   * Perform signup
   */
  async signup(name: string, email: string, password: string): Promise<void> {
    // Switch to signup form if needed
    await this.switchToSignupForm();
    
    await this.fillInput('[data-testid="name-input"]', name);
    await this.fillInput('[data-testid="email-input"]', email);
    await this.fillInput('[data-testid="password-input"]', password);
    await this.clickElement('[data-testid="signup-button"]');
  }

  /**
   * Switch to signup form
   */
  async switchToSignupForm(): Promise<void> {
    const isSignupVisible = await this.isElementVisible('[data-testid="signup-form"]');
    if (!isSignupVisible) {
      await this.clickElement('[data-testid="toggle-form-button"]');
      await this.waitForElement('[data-testid="signup-form"]');
    }
  }

  /**
   * Switch to login form
   */
  async switchToLoginForm(): Promise<void> {
    const isLoginVisible = await this.isElementVisible('[data-testid="login-form"]');
    if (!isLoginVisible) {
      await this.clickElement('[data-testid="toggle-form-button"]');
      await this.waitForElement('[data-testid="login-form"]');
    }
  }

  /**
   * Click forgot password
   */
  async clickForgotPassword(): Promise<void> {
    await this.clickElement('[data-testid="forgot-password-link"]');
  }

  /**
   * Get error message
   */
  async getErrorMessage(): Promise<string> {
    return await this.getElementText('[data-testid="error-message"]');
  }

  /**
   * Get success message
   */
  async getSuccessMessage(): Promise<string> {
    return await this.getElementText('[data-testid="success-message"]');
  }

  /**
   * Verify error message is displayed
   */
  async verifyErrorMessage(expectedMessage: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedMessage);
  }

  /**
   * Verify success message is displayed
   */
  async verifySuccessMessage(expectedMessage: string): Promise<void> {
    await expect(this.successMessage).toBeVisible();
    await expect(this.successMessage).toContainText(expectedMessage);
  }

  /**
   * Login with invalid credentials
   */
  async loginWithInvalidCredentials(email: string, password: string): Promise<void> {
    await this.fillInput('[data-testid="email-input"]', email);
    await this.fillInput('[data-testid="password-input"]', password);
    await this.clickElement('[data-testid="login-button"]');
    
    // Wait for error message
    await this.waitForElement('[data-testid="error-message"]');
  }

  /**
   * Clear form fields
   */
  async clearForm(): Promise<void> {
    await this.emailInput.clear();
    await this.passwordInput.clear();
  }

  /**
   * Verify form validation
   */
  async verifyFormValidation(): Promise<void> {
    // Try to submit empty form
    await this.clickElement('[data-testid="login-button"]');
    
    // Check for validation messages
    const emailValidation = this.page.locator('[data-testid="email-validation"]');
    const passwordValidation = this.page.locator('[data-testid="password-validation"]');
    
    await expect(emailValidation).toBeVisible();
    await expect(passwordValidation).toBeVisible();
  }
}