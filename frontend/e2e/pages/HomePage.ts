import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  // Locators
  private readonly heroSection: Locator;
  private readonly latestCollections: Locator;
  private readonly bestSellers: Locator;
  private readonly policySection: Locator;
  private readonly newsletterBox: Locator;
  private readonly productItems: Locator;
  private readonly searchBar: Locator;
  private readonly cartIcon: Locator;
  private readonly userMenu: Locator;

  constructor(page: Page) {
    super(page, '/');
    
    // Initialize locators
    this.heroSection = page.locator('[data-testid="hero-section"]');
    this.latestCollections = page.locator('[data-testid="latest-collections"]');
    this.bestSellers = page.locator('[data-testid="best-sellers"]');
    this.policySection = page.locator('[data-testid="policy-section"]');
    this.newsletterBox = page.locator('[data-testid="newsletter-box"]');
    this.productItems = page.locator('[data-testid="product-item"]');
    this.searchBar = page.locator('[data-testid="search-bar"]');
    this.cartIcon = page.locator('[data-testid="cart-icon"]');
    this.userMenu = page.locator('[data-testid="user-menu"]');
  }

  /**
   * Verify home page is loaded
   */
  async verifyPageLoaded(): Promise<void> {
    await this.waitForElement('[data-testid="hero-section"]');
    await this.waitForElement('[data-testid="latest-collections"]');
  }

  /**
   * Get hero section text
   */
  async getHeroText(): Promise<string> {
    return await this.heroSection.textContent() || '';
  }

  /**
   * Click on a product from latest collections
   */
  async clickLatestCollectionProduct(index: number = 0): Promise<void> {
    const products = this.latestCollections.locator('[data-testid="product-item"]');
    await products.nth(index).click();
  }

  /**
   * Click on a product from best sellers
   */
  async clickBestSellerProduct(index: number = 0): Promise<void> {
    const products = this.bestSellers.locator('[data-testid="product-item"]');
    await products.nth(index).click();
  }

  /**
   * Search for products
   */
  async searchProducts(searchTerm: string): Promise<void> {
    await this.fillInput('[data-testid="search-bar"]', searchTerm);
    await this.page.keyboard.press('Enter');
  }

  /**
   * Navigate to cart
   */
  async goToCart(): Promise<void> {
    await this.clickElement('[data-testid="cart-icon"]');
  }

  /**
   * Subscribe to newsletter
   */
  async subscribeToNewsletter(email: string): Promise<void> {
    const emailInput = this.newsletterBox.locator('input[type="email"]');
    const subscribeButton = this.newsletterBox.locator('button[type="submit"]');
    
    await emailInput.fill(email);
    await subscribeButton.click();
  }

  /**
   * Get product count in latest collections
   */
  async getLatestCollectionProductCount(): Promise<number> {
    const products = this.latestCollections.locator('[data-testid="product-item"]');
    return await products.count();
  }

  /**
   * Get product count in best sellers
   */
  async getBestSellerProductCount(): Promise<number> {
    const products = this.bestSellers.locator('[data-testid="product-item"]');
    return await products.count();
  }

  /**
   * Verify policy section is visible
   */
  async verifyPolicySection(): Promise<boolean> {
    return await this.isElementVisible('[data-testid="policy-section"]');
  }

  /**
   * Get cart item count
   */
  async getCartItemCount(): Promise<string> {
    const cartBadge = this.page.locator('[data-testid="cart-badge"]');
    return await cartBadge.textContent() || '0';
  }

  /**
   * Navigate to collections page
   */
  async goToCollections(): Promise<void> {
    await this.clickElement('a[href="/collections"]');
  }

  /**
   * Navigate to about page
   */
  async goToAbout(): Promise<void> {
    await this.clickElement('a[href="/about"]');
  }

  /**
   * Navigate to contact page
   */
  async goToContact(): Promise<void> {
    await this.clickElement('a[href="/contact"]');
  }
}