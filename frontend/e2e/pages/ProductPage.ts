import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  // Locators
  private readonly productTitle: Locator;
  private readonly productPrice: Locator;
  private readonly productDescription: Locator;
  private readonly productImages: Locator;
  private readonly addToCartButton: Locator;
  private readonly quantitySelector: Locator;
  private readonly sizeSelector: Locator;
  private readonly colorSelector: Locator;
  private readonly stockStatus: Locator;
  private readonly productReviews: Locator;
  private readonly relatedProducts: Locator;
  private readonly breadcrumb: Locator;

  constructor(page: Page) {
    super(page, '/products');
    
    // Initialize locators
    this.productTitle = page.locator('[data-testid="product-title"]');
    this.productPrice = page.locator('[data-testid="product-price"]');
    this.productDescription = page.locator('[data-testid="product-description"]');
    this.productImages = page.locator('[data-testid="product-images"]');
    this.addToCartButton = page.locator('[data-testid="add-to-cart-button"]');
    this.quantitySelector = page.locator('[data-testid="quantity-selector"]');
    this.sizeSelector = page.locator('[data-testid="size-selector"]');
    this.colorSelector = page.locator('[data-testid="color-selector"]');
    this.stockStatus = page.locator('[data-testid="stock-status"]');
    this.productReviews = page.locator('[data-testid="product-reviews"]');
    this.relatedProducts = page.locator('[data-testid="related-products"]');
    this.breadcrumb = page.locator('[data-testid="breadcrumb"]');
  }

  /**
   * Navigate to specific product
   */
  async navigateToProduct(productId: string): Promise<void> {
    await this.page.goto(`/products/${productId}`);
    await this.waitForPageLoad();
  }

  /**
   * Verify product page is loaded
   */
  async verifyPageLoaded(): Promise<void> {
    await this.waitForElement('[data-testid="product-title"]');
    await this.waitForElement('[data-testid="add-to-cart-button"]');
  }

  /**
   * Get product title
   */
  async getProductTitle(): Promise<string> {
    return await this.getElementText('[data-testid="product-title"]');
  }

  /**
   * Get product price
   */
  async getProductPrice(): Promise<string> {
    return await this.getElementText('[data-testid="product-price"]');
  }

  /**
   * Add product to cart
   */
  async addToCart(quantity: number = 1, size?: string, color?: string): Promise<void> {
    // Select quantity
    if (quantity > 1) {
      await this.quantitySelector.selectOption(quantity.toString());
    }
    
    // Select size if provided
    if (size) {
      await this.sizeSelector.selectOption(size);
    }
    
    // Select color if provided
    if (color) {
      await this.colorSelector.selectOption(color);
    }
    
    // Add to cart
    await this.clickElement('[data-testid="add-to-cart-button"]');
    
    // Wait for success indication
    await this.waitForElement('[data-testid="cart-success-message"]');
  }

  /**
   * Check if product is in stock
   */
  async isInStock(): Promise<boolean> {
    const stockText = await this.getElementText('[data-testid="stock-status"]');
    return stockText.toLowerCase().includes('in stock');
  }

  /**
   * Get available sizes
   */
  async getAvailableSizes(): Promise<string[]> {
    const sizeOptions = await this.sizeSelector.locator('option').allTextContents();
    return sizeOptions.filter(size => size.trim() !== '');
  }

  /**
   * Get available colors
   */
  async getAvailableColors(): Promise<string[]> {
    const colorOptions = await this.colorSelector.locator('option').allTextContents();
    return colorOptions.filter(color => color.trim() !== '');
  }

  /**
   * View product image
   */
  async viewProductImage(index: number = 0): Promise<void> {
    const images = this.productImages.locator('img');
    await images.nth(index).click();
  }

  /**
   * Get product description
   */
  async getProductDescription(): Promise<string> {
    return await this.getElementText('[data-testid="product-description"]');
  }

  /**
   * Click related product
   */
  async clickRelatedProduct(index: number = 0): Promise<void> {
    const relatedItems = this.relatedProducts.locator('[data-testid="product-item"]');
    await relatedItems.nth(index).click();
  }

  /**
   * Verify breadcrumb navigation
   */
  async verifyBreadcrumb(expectedPath: string[]): Promise<void> {
    const breadcrumbItems = this.breadcrumb.locator('a');
    const actualPath = await breadcrumbItems.allTextContents();
    
    expect(actualPath).toEqual(expectedPath);
  }

  /**
   * Share product
   */
  async shareProduct(platform: 'facebook' | 'twitter' | 'email'): Promise<void> {
    await this.clickElement(`[data-testid="share-${platform}"]`);
  }

  /**
   * Add to wishlist
   */
  async addToWishlist(): Promise<void> {
    await this.clickElement('[data-testid="add-to-wishlist"]');
    await this.waitForElement('[data-testid="wishlist-success"]');
  }

  /**
   * Write product review
   */
  async writeReview(rating: number, title: string, comment: string): Promise<void> {
    await this.clickElement('[data-testid="write-review-button"]');
    
    // Select rating
    await this.page.locator(`[data-testid="rating-${rating}"]`).click();
    
    // Fill review form
    await this.fillInput('[data-testid="review-title"]', title);
    await this.fillInput('[data-testid="review-comment"]', comment);
    
    // Submit review
    await this.clickElement('[data-testid="submit-review"]');
    
    // Wait for success message
    await this.waitForElement('[data-testid="review-success"]');
  }

  /**
   * Get product reviews count
   */
  async getReviewsCount(): Promise<number> {
    const reviewsText = await this.getElementText('[data-testid="reviews-count"]');
    const match = reviewsText.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  /**
   * Get average rating
   */
  async getAverageRating(): Promise<number> {
    const ratingText = await this.getElementText('[data-testid="average-rating"]');
    return parseFloat(ratingText);
  }

  /**
   * Verify product details
   */
  async verifyProductDetails(expectedDetails: {
    title: string;
    price: string;
    inStock: boolean;
  }): Promise<void> {
    const actualTitle = await this.getProductTitle();
    const actualPrice = await this.getProductPrice();
    const actualStock = await this.isInStock();
    
    expect(actualTitle).toContain(expectedDetails.title);
    expect(actualPrice).toContain(expectedDetails.price);
    expect(actualStock).toBe(expectedDetails.inStock);
  }
}