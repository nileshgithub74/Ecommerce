import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { LoginPage } from '../../pages/LoginPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

test.describe('Visual Regression Tests', () => {
  test('should match home page screenshot', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.verifyPageLoaded();
    
    // Wait for all images to load
    await page.waitForLoadState('networkidle');
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('home-page.png', {
      fullPage: true,
      threshold: 0.2
    });
  });

  test('should match login page screenshot', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.verifyPageLoaded();
    
    await expect(page).toHaveScreenshot('login-page.png', {
      fullPage: true,
      threshold: 0.2
    });
  });

  test('should match cart page screenshot - empty state', async ({ page }) => {
    const cartPage = new CartPage(page);
    await cartPage.navigate();
    await cartPage.verifyPageLoaded();
    
    await expect(page).toHaveScreenshot('cart-page-empty.png', {
      fullPage: true,
      threshold: 0.2
    });
  });

  test('should match cart page screenshot - with items', async ({ page }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);
    
    // Add item to cart
    await homePage.navigate();
    await homePage.clickLatestCollectionProduct(0);
    await page.locator('[data-testid="add-to-cart-button"]').click();
    
    // Navigate to cart
    await homePage.goToCart();
    await cartPage.verifyPageLoaded();
    
    await expect(page).toHaveScreenshot('cart-page-with-items.png', {
      fullPage: true,
      threshold: 0.2
    });
  });

  test('should match checkout page screenshot', async ({ page }) => {
    const homePage = new HomePage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);
    
    // Add item and go to checkout
    await homePage.navigate();
    await homePage.clickLatestCollectionProduct(0);
    await page.locator('[data-testid="add-to-cart-button"]').click();
    await homePage.goToCart();
    await cartPage.proceedToCheckout();
    
    await checkoutPage.verifyPageLoaded();
    
    await expect(page).toHaveScreenshot('checkout-page.png', {
      fullPage: true,
      threshold: 0.2
    });
  });

  test('should match navigation bar across different pages', async ({ page }) => {
    const homePage = new HomePage(page);
    
    await homePage.navigate();
    await homePage.verifyPageLoaded();
    
    // Screenshot navigation bar only
    const navbar = page.locator('[data-testid="navbar"]');
    await expect(navbar).toHaveScreenshot('navbar-home.png', {
      threshold: 0.2
    });
    
    // Navigate to collections and compare navbar
    await homePage.goToCollections();
    await expect(navbar).toHaveScreenshot('navbar-collections.png', {
      threshold: 0.2
    });
  });

  test('should match product cards layout', async ({ page }) => {
    const homePage = new HomePage(page);
    
    await homePage.navigate();
    await homePage.verifyPageLoaded();
    
    // Screenshot latest collections section
    const latestCollections = page.locator('[data-testid="latest-collections"]');
    await expect(latestCollections).toHaveScreenshot('latest-collections.png', {
      threshold: 0.2
    });
    
    // Screenshot best sellers section
    const bestSellers = page.locator('[data-testid="best-sellers"]');
    await expect(bestSellers).toHaveScreenshot('best-sellers.png', {
      threshold: 0.2
    });
  });

  test('should match footer across different pages', async ({ page }) => {
    const homePage = new HomePage(page);
    
    await homePage.navigate();
    await homePage.verifyPageLoaded();
    
    // Scroll to footer
    await page.locator('[data-testid="footer"]').scrollIntoViewIfNeeded();
    
    // Screenshot footer
    const footer = page.locator('[data-testid="footer"]');
    await expect(footer).toHaveScreenshot('footer.png', {
      threshold: 0.2
    });
  });

  test('should match mobile responsive design', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.verifyPageLoaded();
    
    await expect(page).toHaveScreenshot('home-page-mobile.png', {
      fullPage: true,
      threshold: 0.2
    });
  });

  test('should match tablet responsive design', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.verifyPageLoaded();
    
    await expect(page).toHaveScreenshot('home-page-tablet.png', {
      fullPage: true,
      threshold: 0.2
    });
  });

  test('should match form states - empty and filled', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.navigate();
    await loginPage.verifyPageLoaded();
    
    // Screenshot empty form
    const loginForm = page.locator('[data-testid="login-form"]');
    await expect(loginForm).toHaveScreenshot('login-form-empty.png', {
      threshold: 0.2
    });
    
    // Fill form and screenshot
    await loginPage.fillInput('[data-testid="email-input"]', 'test@example.com');
    await loginPage.fillInput('[data-testid="password-input"]', 'password123');
    
    await expect(loginForm).toHaveScreenshot('login-form-filled.png', {
      threshold: 0.2
    });
  });

  test('should match error states', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.navigate();
    await loginPage.loginWithInvalidCredentials('invalid@example.com', 'wrongpassword');
    
    // Screenshot error state
    await expect(page).toHaveScreenshot('login-error-state.png', {
      fullPage: true,
      threshold: 0.2
    });
  });

  test('should match loading states', async ({ page }) => {
    const homePage = new HomePage(page);
    
    // Intercept API calls to simulate loading
    await page.route('**/api/products', route => {
      setTimeout(() => route.continue(), 2000);
    });
    
    await homePage.navigate();
    
    // Screenshot loading state
    await expect(page.locator('[data-testid="loading-spinner"]')).toBeVisible();
    await expect(page).toHaveScreenshot('loading-state.png', {
      threshold: 0.2
    });
  });

  test('should match dark mode theme', async ({ page }) => {
    const homePage = new HomePage(page);
    
    await homePage.navigate();
    await homePage.verifyPageLoaded();
    
    // Toggle dark mode if available
    const darkModeToggle = page.locator('[data-testid="dark-mode-toggle"]');
    if (await darkModeToggle.isVisible()) {
      await darkModeToggle.click();
      await page.waitForTimeout(500); // Wait for theme transition
      
      await expect(page).toHaveScreenshot('home-page-dark-mode.png', {
        fullPage: true,
        threshold: 0.2
      });
    }
  });
});