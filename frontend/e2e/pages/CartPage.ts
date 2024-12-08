import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  // Locators
  private readonly cartItems: Locator;
  private readonly cartTotal: Locator;
  private readonly checkoutButton: Locator;
  private readonly continueShoppingButton: Locator;
  private readonly emptyCartMessage: Locator;
  private readonly quantityInput: Locator;
  private readonly removeItemButton: Locator;
  private readonly updateCartButton: Locator;
  private readonly subtotal: Locator;
  private readonly shipping: Locator;
  private readonly tax: Locator;
  private readonly discountCode: Locator;
  private readonly applyDiscountButton: Locator;

  constructor(page: Page) {
    super(page, '/cart');
    
    // Initialize locators
    this.cartItems = page.locator('[data-testid="cart-item"]');
    this.cartTotal = page.locator('[data-testid="cart-total"]');
    this.checkoutButton = page.locator('[data-testid="checkout-button"]');
    this.continueShoppingButton = page.locator('[data-testid="continue-shopping-button"]');
    this.emptyCartMessage = page.locator('[data-testid="empty-cart-message"]');
    this.quantityInput = page.locator('[data-testid="quantity-input"]');
    this.removeItemButton = page.locator('[data-testid="remove-item-button"]');
    this.updateCartButton = page.locator('[data-testid="update-cart-button"]');
    this.subtotal = page.locator('[data-testid="subtotal"]');
    this.shipping = page.locator('[data-testid="shipping"]');
    this.tax = page.locator('[data-testid="tax"]');
    this.discountCode = page.locator('[data-testid="discount-code"]');
    this.applyDiscountButton = page.locator('[data-testid="apply-discount-button"]');
  }

  /**
   * Verify cart page is loaded
   */
  async verifyPageLoaded(): Promise<void> {
    await this.waitForElement('[data-testid="cart-container"]');
  }

  /**
   * Get cart items count
   */
  async getCartItemsCount(): Promise<number> {
    return await this.cartItems.count();
  }

  /**
   * Get cart total amount
   */
  async getCartTotal(): Promise<string> {
    return await this.getElementText('[data-testid="cart-total"]');
  }

  /**
   * Get subtotal amount
   */
  async getSubtotal(): Promise<string> {
    return await this.getElementText('[data-testid="subtotal"]');
  }

  /**
   * Update item quantity
   */
  async updateItemQuantity(itemIndex: number, quantity: string): Promise<void> {
    const quantityInputs = this.page.locator('[data-testid="quantity-input"]');
    await quantityInputs.nth(itemIndex).fill(quantity);
    await this.clickElement('[data-testid="update-cart-button"]');
    
    // Wait for cart to update
    await this.page.waitForTimeout(1000);
  }

  /**
   * Remove item from cart
   */
  async removeItem(itemIndex: number): Promise<void> {
    const removeButtons = this.page.locator('[data-testid="remove-item-button"]');
    await removeButtons.nth(itemIndex).click();
    
    // Wait for item to be removed
    await this.page.waitForTimeout(1000);
  }

  /**
   * Proceed to checkout
   */
  async proceedToCheckout(): Promise<void> {
    await this.clickElement('[data-testid="checkout-button"]');
    await this.page.waitForURL('/placeorder');
  }

  /**
   * Continue shopping
   */
  async continueShopping(): Promise<void> {
    await this.clickElement('[data-testid="continue-shopping-button"]');
    await this.page.waitForURL('/collections');
  }

  /**
   * Apply discount code
   */
  async applyDiscountCode(code: string): Promise<void> {
    await this.fillInput('[data-testid="discount-code"]', code);
    await this.clickElement('[data-testid="apply-discount-button"]');
    
    // Wait for discount to be applied
    await this.page.waitForTimeout(2000);
  }

  /**
   * Verify empty cart
   */
  async verifyEmptyCart(): Promise<void> {
    await expect(this.emptyCartMessage).toBeVisible();
    await expect(this.cartItems).toHaveCount(0);
  }

  /**
   * Get item details
   */
  async getItemDetails(itemIndex: number): Promise<{
    name: string;
    price: string;
    quantity: string;
    total: string;
  }> {
    const item = this.cartItems.nth(itemIndex);
    
    return {
      name: await item.locator('[data-testid="item-name"]').textContent() || '',
      price: await item.locator('[data-testid="item-price"]').textContent() || '',
      quantity: await item.locator('[data-testid="quantity-input"]').inputValue() || '',
      total: await item.locator('[data-testid="item-total"]').textContent() || ''
    };
  }

  /**
   * Verify item in cart
   */
  async verifyItemInCart(itemName: string): Promise<void> {
    const itemNames = this.page.locator('[data-testid="item-name"]');
    await expect(itemNames.filter({ hasText: itemName })).toBeVisible();
  }

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<void> {
    const itemCount = await this.getCartItemsCount();
    
    for (let i = itemCount - 1; i >= 0; i--) {
      await this.removeItem(i);
      await this.page.waitForTimeout(500);
    }
    
    await this.verifyEmptyCart();
  }

  /**
   * Get shipping cost
   */
  async getShippingCost(): Promise<string> {
    return await this.getElementText('[data-testid="shipping"]');
  }

  /**
   * Get tax amount
   */
  async getTaxAmount(): Promise<string> {
    return await this.getElementText('[data-testid="tax"]');
  }

  /**
   * Verify cart calculations
   */
  async verifyCartCalculations(): Promise<void> {
    const subtotal = parseFloat((await this.getSubtotal()).replace('$', ''));
    const shipping = parseFloat((await this.getShippingCost()).replace('$', ''));
    const tax = parseFloat((await this.getTaxAmount()).replace('$', ''));
    const total = parseFloat((await this.getCartTotal()).replace('$', ''));
    
    const expectedTotal = subtotal + shipping + tax;
    expect(total).toBeCloseTo(expectedTotal, 2);
  }
}