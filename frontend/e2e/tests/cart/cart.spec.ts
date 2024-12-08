import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { CartPage } from '../../pages/CartPage';
import { ProductPage } from '../../pages/ProductPage';

test.describe('Cart Functionality Tests', () => {
  let homePage: HomePage;
  let cartPage: CartPage;
  let productPage: ProductPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    cartPage = new CartPage(page);
    productPage = new ProductPage(page);
  });

  test('should add product to cart from home page', async ({ page }) => {
    await homePage.navigate();
    await homePage.verifyPageLoaded();
    
    // Add product to cart
    await homePage.clickLatestCollectionProduct(0);
    
    // Verify product page and add to cart
    await page.locator('[data-testid="add-to-cart-button"]').click();
    
    // Verify cart icon shows item count
    const cartCount = await homePage.getCartItemCount();
    expect(parseInt(cartCount)).toBeGreaterThan(0);
  });

  test('should display cart items correctly', async ({ page }) => {
    // Add item to cart first
    await homePage.navigate();
    await homePage.clickLatestCollectionProduct(0);
    await page.locator('[data-testid="add-to-cart-button"]').click();
    
    // Navigate to cart
    await homePage.goToCart();
    await cartPage.verifyPageLoaded();
    
    // Verify cart has items
    const itemCount = await cartPage.getCartItemsCount();
    expect(itemCount).toBeGreaterThan(0);
    
    // Verify cart total is displayed
    const total = await cartPage.getCartTotal();
    expect(total).toMatch(/\$\d+\.\d{2}/);
  });

  test('should update item quantity in cart', async ({ page }) => {
    // Add item to cart
    await homePage.navigate();
    await homePage.clickLatestCollectionProduct(0);
    await page.locator('[data-testid="add-to-cart-button"]').click();
    
    // Go to cart
    await homePage.goToCart();
    await cartPage.verifyPageLoaded();
    
    // Get initial total
    const initialTotal = await cartPage.getCartTotal();
    
    // Update quantity
    await cartPage.updateItemQuantity(0, '2');
    
    // Verify total has changed
    const updatedTotal = await cartPage.getCartTotal();
    expect(updatedTotal).not.toBe(initialTotal);
  });

  test('should remove item from cart', async ({ page }) => {
    // Add item to cart
    await homePage.navigate();
    await homePage.clickLatestCollectionProduct(0);
    await page.locator('[data-testid="add-to-cart-button"]').click();
    
    // Go to cart
    await homePage.goToCart();
    await cartPage.verifyPageLoaded();
    
    // Get initial item count
    const initialCount = await cartPage.getCartItemsCount();
    
    // Remove item
    await cartPage.removeItem(0);
    
    // Verify item count decreased
    const updatedCount = await cartPage.getCartItemsCount();
    expect(updatedCount).toBe(initialCount - 1);
  });

  test('should show empty cart message when no items', async ({ page }) => {
    await cartPage.navigate();
    await cartPage.verifyPageLoaded();
    
    // Clear cart if it has items
    const itemCount = await cartPage.getCartItemsCount();
    if (itemCount > 0) {
      await cartPage.clearCart();
    }
    
    // Verify empty cart message
    await cartPage.verifyEmptyCart();
  });

  test('should apply discount code', async ({ page }) => {
    // Add item to cart
    await homePage.navigate();
    await homePage.clickLatestCollectionProduct(0);
    await page.locator('[data-testid="add-to-cart-button"]').click();
    
    // Go to cart
    await homePage.goToCart();
    await cartPage.verifyPageLoaded();
    
    // Get initial total
    const initialTotal = parseFloat((await cartPage.getCartTotal()).replace('$', ''));
    
    // Apply discount code
    await cartPage.applyDiscountCode('SAVE10');
    
    // Verify discount is applied
    const discountedTotal = parseFloat((await cartPage.getCartTotal()).replace('$', ''));
    expect(discountedTotal).toBeLessThan(initialTotal);
  });

  test('should calculate cart totals correctly', async ({ page }) => {
    // Add multiple items to cart
    await homePage.navigate();
    await homePage.clickLatestCollectionProduct(0);
    await page.locator('[data-testid="add-to-cart-button"]').click();
    await page.goBack();
    
    await homePage.clickLatestCollectionProduct(1);
    await page.locator('[data-testid="add-to-cart-button"]').click();
    
    // Go to cart
    await homePage.goToCart();
    await cartPage.verifyPageLoaded();
    
    // Verify calculations
    await cartPage.verifyCartCalculations();
  });

  test('should proceed to checkout', async ({ page }) => {
    // Add item to cart
    await homePage.navigate();
    await homePage.clickLatestCollectionProduct(0);
    await page.locator('[data-testid="add-to-cart-button"]').click();
    
    // Go to cart
    await homePage.goToCart();
    await cartPage.verifyPageLoaded();
    
    // Proceed to checkout
    await cartPage.proceedToCheckout();
    
    // Verify navigation to checkout page
    await expect(page).toHaveURL('/placeorder');
  });

  test('should continue shopping from cart', async ({ page }) => {
    await cartPage.navigate();
    await cartPage.verifyPageLoaded();
    
    // Continue shopping
    await cartPage.continueShopping();
    
    // Verify navigation to collections page
    await expect(page).toHaveURL('/collections');
  });

  test('should persist cart items across sessions', async ({ page, context }) => {
    // Add item to cart
    await homePage.navigate();
    await homePage.clickLatestCollectionProduct(0);
    await page.locator('[data-testid="add-to-cart-button"]').click();
    
    // Get cart count
    const cartCount = await homePage.getCartItemCount();
    
    // Create new page (simulate new session)
    const newPage = await context.newPage();
    const newHomePage = new HomePage(newPage);
    
    await newHomePage.navigate();
    
    // Verify cart count persists
    const persistedCartCount = await newHomePage.getCartItemCount();
    expect(persistedCartCount).toBe(cartCount);
    
    await newPage.close();
  });

  test('should handle invalid discount codes', async ({ page }) => {
    // Add item to cart
    await homePage.navigate();
    await homePage.clickLatestCollectionProduct(0);
    await page.locator('[data-testid="add-to-cart-button"]').click();
    
    // Go to cart
    await homePage.goToCart();
    await cartPage.verifyPageLoaded();
    
    // Apply invalid discount code
    await cartPage.applyDiscountCode('INVALID123');
    
    // Verify error message
    await expect(page.locator('[data-testid="discount-error"]')).toBeVisible();
  });
});