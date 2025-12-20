import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

test.describe('Checkout Process Tests', () => {
  let homePage: HomePage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  const testBillingInfo = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'US'
  };

  const testPaymentInfo = {
    cardNumber: '4111111111111111',
    expiryDate: '12/25',
    cvv: '123',
    cardHolderName: 'John Doe',
    paymentMethod: 'credit-card'
  };

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    // Add item to cart before each test
    await homePage.navigate();
    await homePage.clickLatestCollectionProduct(0);
    await page.locator('[data-testid="add-to-cart-button"]').click();
    await homePage.goToCart();
    await cartPage.proceedToCheckout();
  });

  test('should complete checkout with valid information', async ({ page }) => {
    await checkoutPage.verifyPageLoaded();
    
    // Fill checkout form
    await checkoutPage.completeCheckout(testBillingInfo, testPaymentInfo);
    
    // Verify order confirmation
    await expect(page).toHaveURL('/order');
    await expect(page.locator('[data-testid="order-confirmation"]')).toBeVisible();
  });

  test('should validate required billing fields', async ({ page }) => {
    await checkoutPage.verifyPageLoaded();
    
    // Try to place order without filling required fields
    await checkoutPage.validateRequiredFields();
  });

  test('should validate email format in billing form', async ({ page }) => {
    await checkoutPage.verifyPageLoaded();
    
    await checkoutPage.verifyFormValidation();
  });

  test('should display order summary correctly', async ({ page }) => {
    await checkoutPage.verifyPageLoaded();
    
    const orderSummary = await checkoutPage.getOrderSummary();
    
    // Verify order summary has required fields
    expect(orderSummary.subtotal).toMatch(/\$\d+\.\d{2}/);
    expect(orderSummary.total).toMatch(/\$\d+\.\d{2}/);
    expect(orderSummary.itemCount).toBeGreaterThan(0);
  });

  test('should allow different payment methods', async ({ page }) => {
    await checkoutPage.verifyPageLoaded();
    
    // Test credit card payment
    await checkoutPage.selectPaymentMethod('credit-card');
    await expect(page.locator('[data-testid="payment-method-credit-card"]')).toBeChecked();
    
    // Test PayPal payment
    await checkoutPage.selectPaymentMethod('paypal');
    await expect(page.locator('[data-testid="payment-method-paypal"]')).toBeChecked();
    
    // Test Cash on Delivery
    await checkoutPage.selectPaymentMethod('cod');
    await expect(page.locator('[data-testid="payment-method-cod"]')).toBeChecked();
  });

  test('should validate credit card information', async ({ page }) => {
    await checkoutPage.verifyPageLoaded();
    
    await checkoutPage.selectPaymentMethod('credit-card');
    
    // Test invalid card number
    await checkoutPage.fillPaymentInformation({
      cardNumber: '1234',
      expiryDate: '12/25',
      cvv: '123',
      cardHolderName: 'John Doe'
    });
    
    await checkoutPage.clickElement('[data-testid="place-order-button"]');
    
    // Verify card validation error
    await expect(page.locator('[data-testid="card-validation"]')).toBeVisible();
  });

  test('should handle expired credit cards', async ({ page }) => {
    await checkoutPage.verifyPageLoaded();
    
    await checkoutPage.fillBillingInformation(testBillingInfo);
    await checkoutPage.fillPaymentInformation({
      ...testPaymentInfo,
      expiryDate: '12/20' // Expired date
    });
    
    await checkoutPage.clickElement('[data-testid="place-order-button"]');
    
    // Verify expiry validation error
    await expect(page.locator('[data-testid="expiry-validation"]')).toBeVisible();
  });

  test('should allow going back to cart', async ({ page }) => {
    await checkoutPage.verifyPageLoaded();
    
    await checkoutPage.goBackToCart();
    
    // Verify navigation back to cart
    await expect(page).toHaveURL('/cart');
  });

  test('should handle checkout with multiple items', async ({ page }) => {
    // Add another item to cart
    await page.goBack(); // Go back to cart
    await cartPage.continueShopping();
    await homePage.clickLatestCollectionProduct(1);
    await page.locator('[data-testid="add-to-cart-button"]').click();
    await homePage.goToCart();
    await cartPage.proceedToCheckout();
    
    await checkoutPage.verifyPageLoaded();
    
    const orderSummary = await checkoutPage.getOrderSummary();
    expect(orderSummary.itemCount).toBeGreaterThanOrEqual(2);
    
    // Complete checkout
    await checkoutPage.completeCheckout(testBillingInfo, testPaymentInfo);
    
    // Verify order confirmation
    await expect(page).toHaveURL('/order');
  });

  test('should calculate taxes and shipping correctly', async ({ page }) => {
    await checkoutPage.verifyPageLoaded();
    
    const orderSummary = await checkoutPage.getOrderSummary();
    
    // Verify calculations
    const subtotal = parseFloat(orderSummary.subtotal.replace('$', ''));
    const shipping = parseFloat(orderSummary.shipping.replace('$', ''));
    const tax = parseFloat(orderSummary.tax.replace('$', ''));
    const total = parseFloat(orderSummary.total.replace('$', ''));
    
    const expectedTotal = subtotal + shipping + tax;
    expect(total).toBeCloseTo(expectedTotal, 2);
  });

  test('should handle PayPal payment flow', async ({ page }) => {
    await checkoutPage.verifyPageLoaded();
    
    await checkoutPage.fillBillingInformation(testBillingInfo);
    await checkoutPage.selectPaymentMethod('paypal');
    
    await checkoutPage.clickElement('[data-testid="place-order-button"]');
    
    // Verify PayPal integration (mock or redirect)
    await expect(page.locator('[data-testid="paypal-container"]')).toBeVisible();
  });

  test('should handle Cash on Delivery', async ({ page }) => {
    await checkoutPage.verifyPageLoaded();
    
    await checkoutPage.fillBillingInformation(testBillingInfo);
    await checkoutPage.selectPaymentMethod('cod');
    
    await checkoutPage.clickElement('[data-testid="place-order-button"]');
    
    // Verify COD order confirmation
    await expect(page).toHaveURL('/order');
    await expect(page.locator('[data-testid="cod-confirmation"]')).toBeVisible();
  });

  test('should preserve form data on page refresh', async ({ page }) => {
    await checkoutPage.verifyPageLoaded();
    
    // Fill partial form
    await checkoutPage.fillInput('[data-testid="first-name-input"]', testBillingInfo.firstName);
    await checkoutPage.fillInput('[data-testid="email-input"]', testBillingInfo.email);
    
    // Refresh page
    await page.reload();
    await checkoutPage.verifyPageLoaded();
    
    // Verify form data is preserved
    await expect(page.locator('[data-testid="first-name-input"]')).toHaveValue(testBillingInfo.firstName);
    await expect(page.locator('[data-testid="email-input"]')).toHaveValue(testBillingInfo.email);
  });

  test('should handle network errors during checkout', async ({ page }) => {
    await checkoutPage.verifyPageLoaded();
    
    // Simulate network failure
    await page.route('**/api/orders', route => route.abort());
    
    await checkoutPage.completeCheckout(testBillingInfo, testPaymentInfo);
    
    // Verify error handling
    await expect(page.locator('[data-testid="checkout-error"]')).toBeVisible();
  });
});