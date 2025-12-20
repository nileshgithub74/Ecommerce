import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  // Locators
  private readonly billingForm: Locator;
  private readonly shippingForm: Locator;
  private readonly paymentForm: Locator;
  private readonly orderSummary: Locator;
  private readonly placeOrderButton: Locator;
  private readonly backToCartButton: Locator;
  
  // Billing form fields
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly phoneInput: Locator;
  private readonly addressInput: Locator;
  private readonly cityInput: Locator;
  private readonly stateInput: Locator;
  private readonly zipCodeInput: Locator;
  private readonly countrySelect: Locator;
  
  // Payment form fields
  private readonly cardNumberInput: Locator;
  private readonly expiryDateInput: Locator;
  private readonly cvvInput: Locator;
  private readonly cardHolderNameInput: Locator;
  private readonly paymentMethodRadio: Locator;
  
  // Order summary elements
  private readonly orderItems: Locator;
  private readonly orderSubtotal: Locator;
  private readonly orderShipping: Locator;
  private readonly orderTax: Locator;
  private readonly orderTotal: Locator;

  constructor(page: Page) {
    super(page, '/placeorder');
    
    // Initialize form locators
    this.billingForm = page.locator('[data-testid="billing-form"]');
    this.shippingForm = page.locator('[data-testid="shipping-form"]');
    this.paymentForm = page.locator('[data-testid="payment-form"]');
    this.orderSummary = page.locator('[data-testid="order-summary"]');
    this.placeOrderButton = page.locator('[data-testid="place-order-button"]');
    this.backToCartButton = page.locator('[data-testid="back-to-cart-button"]');
    
    // Billing form fields
    this.firstNameInput = page.locator('[data-testid="first-name-input"]');
    this.lastNameInput = page.locator('[data-testid="last-name-input"]');
    this.emailInput = page.locator('[data-testid="email-input"]');
    this.phoneInput = page.locator('[data-testid="phone-input"]');
    this.addressInput = page.locator('[data-testid="address-input"]');
    this.cityInput = page.locator('[data-testid="city-input"]');
    this.stateInput = page.locator('[data-testid="state-input"]');
    this.zipCodeInput = page.locator('[data-testid="zip-code-input"]');
    this.countrySelect = page.locator('[data-testid="country-select"]');
    
    // Payment form fields
    this.cardNumberInput = page.locator('[data-testid="card-number-input"]');
    this.expiryDateInput = page.locator('[data-testid="expiry-date-input"]');
    this.cvvInput = page.locator('[data-testid="cvv-input"]');
    this.cardHolderNameInput = page.locator('[data-testid="card-holder-name-input"]');
    this.paymentMethodRadio = page.locator('[data-testid="payment-method-radio"]');
    
    // Order summary elements
    this.orderItems = page.locator('[data-testid="order-item"]');
    this.orderSubtotal = page.locator('[data-testid="order-subtotal"]');
    this.orderShipping = page.locator('[data-testid="order-shipping"]');
    this.orderTax = page.locator('[data-testid="order-tax"]');
    this.orderTotal = page.locator('[data-testid="order-total"]');
  }

  /**
   * Verify checkout page is loaded
   */
  async verifyPageLoaded(): Promise<void> {
    await this.waitForElement('[data-testid="billing-form"]');
    await this.waitForElement('[data-testid="order-summary"]');
  }

  /**
   * Fill billing information
   */
  async fillBillingInformation(billingInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }): Promise<void> {
    await this.fillInput('[data-testid="first-name-input"]', billingInfo.firstName);
    await this.fillInput('[data-testid="last-name-input"]', billingInfo.lastName);
    await this.fillInput('[data-testid="email-input"]', billingInfo.email);
    await this.fillInput('[data-testid="phone-input"]', billingInfo.phone);
    await this.fillInput('[data-testid="address-input"]', billingInfo.address);
    await this.fillInput('[data-testid="city-input"]', billingInfo.city);
    await this.fillInput('[data-testid="state-input"]', billingInfo.state);
    await this.fillInput('[data-testid="zip-code-input"]', billingInfo.zipCode);
    await this.countrySelect.selectOption(billingInfo.country);
  }

  /**
   * Fill payment information
   */
  async fillPaymentInformation(paymentInfo: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardHolderName: string;
    paymentMethod?: string;
  }): Promise<void> {
    // Select payment method if provided
    if (paymentInfo.paymentMethod) {
      await this.page.locator(`[data-testid="payment-method-${paymentInfo.paymentMethod}"]`).check();
    }
    
    await this.fillInput('[data-testid="card-number-input"]', paymentInfo.cardNumber);
    await this.fillInput('[data-testid="expiry-date-input"]', paymentInfo.expiryDate);
    await this.fillInput('[data-testid="cvv-input"]', paymentInfo.cvv);
    await this.fillInput('[data-testid="card-holder-name-input"]', paymentInfo.cardHolderName);
  }

  /**
   * Select payment method
   */
  async selectPaymentMethod(method: 'credit-card' | 'paypal' | 'stripe' | 'cod'): Promise<void> {
    await this.page.locator(`[data-testid="payment-method-${method}"]`).check();
  }

  /**
   * Place order
   */
  async placeOrder(): Promise<void> {
    await this.clickElement('[data-testid="place-order-button"]');
    
    // Wait for order confirmation or next page
    await this.page.waitForURL('/order', { timeout: 30000 });
  }

  /**
   * Go back to cart
   */
  async goBackToCart(): Promise<void> {
    await this.clickElement('[data-testid="back-to-cart-button"]');
    await this.page.waitForURL('/cart');
  }

  /**
   * Get order summary details
   */
  async getOrderSummary(): Promise<{
    subtotal: string;
    shipping: string;
    tax: string;
    total: string;
    itemCount: number;
  }> {
    return {
      subtotal: await this.getElementText('[data-testid="order-subtotal"]'),
      shipping: await this.getElementText('[data-testid="order-shipping"]'),
      tax: await this.getElementText('[data-testid="order-tax"]'),
      total: await this.getElementText('[data-testid="order-total"]'),
      itemCount: await this.orderItems.count()
    };
  }

  /**
   * Verify order items
   */
  async verifyOrderItems(expectedItems: string[]): Promise<void> {
    const itemCount = await this.orderItems.count();
    expect(itemCount).toBe(expectedItems.length);
    
    for (let i = 0; i < expectedItems.length; i++) {
      const itemName = await this.orderItems.nth(i).locator('[data-testid="item-name"]').textContent();
      expect(itemName).toContain(expectedItems[i]);
    }
  }

  /**
   * Validate form fields
   */
  async validateRequiredFields(): Promise<void> {
    // Try to place order without filling required fields
    await this.clickElement('[data-testid="place-order-button"]');
    
    // Check for validation messages
    const validationMessages = this.page.locator('[data-testid*="validation"]');
    await expect(validationMessages.first()).toBeVisible();
  }

  /**
   * Fill complete checkout form
   */
  async completeCheckout(
    billingInfo: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    },
    paymentInfo: {
      cardNumber: string;
      expiryDate: string;
      cvv: string;
      cardHolderName: string;
      paymentMethod?: string;
    }
  ): Promise<void> {
    await this.fillBillingInformation(billingInfo);
    await this.fillPaymentInformation(paymentInfo);
    await this.placeOrder();
  }

  /**
   * Verify checkout form validation
   */
  async verifyFormValidation(): Promise<void> {
    // Test email validation
    await this.fillInput('[data-testid="email-input"]', 'invalid-email');
    await this.clickElement('[data-testid="place-order-button"]');
    await expect(this.page.locator('[data-testid="email-validation"]')).toBeVisible();
    
    // Test phone validation
    await this.fillInput('[data-testid="phone-input"]', '123');
    await this.clickElement('[data-testid="place-order-button"]');
    await expect(this.page.locator('[data-testid="phone-validation"]')).toBeVisible();
    
    // Test card number validation
    await this.fillInput('[data-testid="card-number-input"]', '1234');
    await this.clickElement('[data-testid="place-order-button"]');
    await expect(this.page.locator('[data-testid="card-validation"]')).toBeVisible();
  }
}