import { Page, expect } from '@playwright/test';

/**
 * Utility functions for E2E tests
 */

export class TestHelpers {
  /**
   * Wait for element to be visible with custom timeout
   */
  static async waitForElement(page: Page, selector: string, timeout: number = 10000) {
    await page.locator(selector).waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for multiple elements to be visible
   */
  static async waitForElements(page: Page, selectors: string[], timeout: number = 10000) {
    await Promise.all(
      selectors.map(selector => 
        page.locator(selector).waitFor({ state: 'visible', timeout })
      )
    );
  }

  /**
   * Scroll element into view and click
   */
  static async scrollAndClick(page: Page, selector: string) {
    const element = page.locator(selector);
    await element.scrollIntoViewIfNeeded();
    await element.click();
  }

  /**
   * Fill form with retry logic
   */
  static async fillFormField(page: Page, selector: string, value: string, retries: number = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        await page.locator(selector).fill(value);
        const inputValue = await page.locator(selector).inputValue();
        if (inputValue === value) {
          return;
        }
      } catch (error) {
        if (i === retries - 1) throw error;
        await page.waitForTimeout(1000);
      }
    }
  }

  /**
   * Take screenshot with timestamp
   */
  static async takeTimestampedScreenshot(page: Page, name: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await page.screenshot({ 
      path: `screenshots/${name}-${timestamp}.png`,
      fullPage: true 
    });
  }

  /**
   * Wait for API response with specific status
   */
  static async waitForApiResponse(page: Page, urlPattern: string | RegExp, status: number = 200) {
    const response = await page.waitForResponse(response => 
      (typeof urlPattern === 'string' ? response.url().includes(urlPattern) : urlPattern.test(response.url())) &&
      response.status() === status
    );
    return response;
  }

  /**
   * Mock API response
   */
  static async mockApiResponse(page: Page, url: string | RegExp, response: any, status: number = 200) {
    await page.route(url, route => {
      route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(response)
      });
    });
  }

  /**
   * Generate random string
   */
  static generateRandomString(length: number = 10): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate random email
   */
  static generateRandomEmail(): string {
    const timestamp = Date.now();
    const randomString = this.generateRandomString(5);
    return `test-${randomString}-${timestamp}@example.com`;
  }

  /**
   * Wait for page to be fully loaded
   */
  static async waitForPageLoad(page: Page) {
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');
  }

  /**
   * Clear browser storage
   */
  static async clearStorage(page: Page) {
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }

  /**
   * Set local storage item
   */
  static async setLocalStorage(page: Page, key: string, value: string) {
    await page.evaluate(({ key, value }) => {
      localStorage.setItem(key, value);
    }, { key, value });
  }

  /**
   * Get local storage item
   */
  static async getLocalStorage(page: Page, key: string): Promise<string | null> {
    return await page.evaluate((key) => {
      return localStorage.getItem(key);
    }, key);
  }

  /**
   * Simulate slow network
   */
  static async simulateSlowNetwork(page: Page) {
    const client = await page.context().newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: 1000 * 1024 / 8, // 1 Mbps
      uploadThroughput: 500 * 1024 / 8,    // 500 Kbps
      latency: 100 // 100ms
    });
  }

  /**
   * Simulate offline network
   */
  static async simulateOfflineNetwork(page: Page) {
    await page.context().setOffline(true);
  }

  /**
   * Restore network
   */
  static async restoreNetwork(page: Page) {
    await page.context().setOffline(false);
  }

  /**
   * Wait for element to contain text
   */
  static async waitForTextContent(page: Page, selector: string, text: string, timeout: number = 10000) {
    await expect(page.locator(selector)).toContainText(text, { timeout });
  }

  /**
   * Hover over element
   */
  static async hoverElement(page: Page, selector: string) {
    await page.locator(selector).hover();
  }

  /**
   * Double click element
   */
  static async doubleClickElement(page: Page, selector: string) {
    await page.locator(selector).dblclick();
  }

  /**
   * Right click element
   */
  static async rightClickElement(page: Page, selector: string) {
    await page.locator(selector).click({ button: 'right' });
  }

  /**
   * Upload file
   */
  static async uploadFile(page: Page, selector: string, filePath: string) {
    await page.locator(selector).setInputFiles(filePath);
  }

  /**
   * Download file and return path
   */
  static async downloadFile(page: Page, triggerSelector: string): Promise<string> {
    const downloadPromise = page.waitForEvent('download');
    await page.locator(triggerSelector).click();
    const download = await downloadPromise;
    const path = await download.path();
    return path || '';
  }

  /**
   * Handle dialog (alert, confirm, prompt)
   */
  static async handleDialog(page: Page, accept: boolean = true, promptText?: string) {
    page.on('dialog', async dialog => {
      if (dialog.type() === 'prompt' && promptText) {
        await dialog.accept(promptText);
      } else if (accept) {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    });
  }

  /**
   * Get element count
   */
  static async getElementCount(page: Page, selector: string): Promise<number> {
    return await page.locator(selector).count();
  }

  /**
   * Check if element exists
   */
  static async elementExists(page: Page, selector: string): Promise<boolean> {
    try {
      await page.locator(selector).waitFor({ state: 'attached', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get current URL
   */
  static async getCurrentUrl(page: Page): Promise<string> {
    return page.url();
  }

  /**
   * Navigate back
   */
  static async goBack(page: Page) {
    await page.goBack();
  }

  /**
   * Navigate forward
   */
  static async goForward(page: Page) {
    await page.goForward();
  }

  /**
   * Refresh page
   */
  static async refreshPage(page: Page) {
    await page.reload();
  }

  /**
   * Get page title
   */
  static async getPageTitle(page: Page): Promise<string> {
    return await page.title();
  }

  /**
   * Switch to new tab/window
   */
  static async switchToNewTab(page: Page): Promise<Page> {
    const [newPage] = await Promise.all([
      page.context().waitForEvent('page'),
      // Trigger action that opens new tab
    ]);
    await newPage.waitForLoadState();
    return newPage;
  }

  /**
   * Close current tab
   */
  static async closeCurrentTab(page: Page) {
    await page.close();
  }

  /**
   * Format currency for comparison
   */
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  /**
   * Parse currency string to number
   */
  static parseCurrency(currencyString: string): number {
    return parseFloat(currencyString.replace(/[$,]/g, ''));
  }

  /**
   * Generate test report data
   */
  static generateTestReport(testName: string, status: 'passed' | 'failed', duration: number, error?: string) {
    return {
      testName,
      status,
      duration,
      timestamp: new Date().toISOString(),
      error: error || null
    };
  }
}