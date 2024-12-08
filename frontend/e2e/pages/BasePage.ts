import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  protected page: Page;
  protected url: string;

  constructor(page: Page, url: string = '') {
    this.page = page;
    this.url = url;
  }

  /**
   * Navigate to the page
   */
  async navigate(): Promise<void> {
    await this.page.goto(this.url);
    await this.waitForPageLoad();
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ 
      path: `screenshots/${name}.png`,
      fullPage: true 
    });
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(selector: string, timeout: number = 10000): Promise<Locator> {
    const element = this.page.locator(selector);
    await expect(element).toBeVisible({ timeout });
    return element;
  }

  /**
   * Click element with retry logic
   */
  async clickElement(selector: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await element.click();
  }

  /**
   * Fill input field
   */
  async fillInput(selector: string, value: string): Promise<void> {
    const element = await this.waitForElement(selector);
    await element.fill(value);
  }

  /**
   * Get element text
   */
  async getElementText(selector: string): Promise<string> {
    const element = await this.waitForElement(selector);
    return await element.textContent() || '';
  }

  /**
   * Check if element exists
   */
  async isElementVisible(selector: string): Promise<boolean> {
    try {
      await this.page.locator(selector).waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Scroll to element
   */
  async scrollToElement(selector: string): Promise<void> {
    const element = this.page.locator(selector);
    await element.scrollIntoViewIfNeeded();
  }

  /**
   * Wait for API response
   */
  async waitForApiResponse(urlPattern: string | RegExp): Promise<void> {
    await this.page.waitForResponse(urlPattern);
  }

  /**
   * Handle alerts/dialogs
   */
  async handleDialog(accept: boolean = true): Promise<void> {
    this.page.on('dialog', async dialog => {
      if (accept) {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    });
  }
}