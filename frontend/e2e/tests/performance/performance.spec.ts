import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test.describe('Performance Tests', () => {
  test('should load home page within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.verifyPageLoaded();
    
    const loadTime = Date.now() - startTime;
    
    // Assert page loads within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    console.log(`Home page loaded in ${loadTime}ms`);
  });

  test('should have good Core Web Vitals', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.verifyPageLoaded();
    
    // Measure Core Web Vitals
    const vitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const vitals: any = {};
          
          entries.forEach((entry: any) => {
            if (entry.name === 'first-contentful-paint') {
              vitals.fcp = entry.startTime;
            }
            if (entry.name === 'largest-contentful-paint') {
              vitals.lcp = entry.startTime;
            }
            if (entry.entryType === 'layout-shift') {
              vitals.cls = (vitals.cls || 0) + entry.value;
            }
          });
          
          resolve(vitals);
        });
        
        observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] });
        
        // Fallback timeout
        setTimeout(() => resolve({}), 5000);
      });
    });
    
    console.log('Core Web Vitals:', vitals);
    
    // Assert Core Web Vitals thresholds
    if (vitals.fcp) {
      expect(vitals.fcp).toBeLessThan(1800); // FCP < 1.8s
    }
    if (vitals.lcp) {
      expect(vitals.lcp).toBeLessThan(2500); // LCP < 2.5s
    }
    if (vitals.cls) {
      expect(vitals.cls).toBeLessThan(0.1); // CLS < 0.1
    }
  });

  test('should handle concurrent users', async ({ browser }) => {
    const concurrentUsers = 5;
    const promises = [];
    
    for (let i = 0; i < concurrentUsers; i++) {
      const promise = (async () => {
        const context = await browser.newContext();
        const page = await context.newPage();
        const homePage = new HomePage(page);
        
        const startTime = Date.now();
        await homePage.navigate();
        await homePage.verifyPageLoaded();
        const loadTime = Date.now() - startTime;
        
        await context.close();
        return loadTime;
      })();
      
      promises.push(promise);
    }
    
    const loadTimes = await Promise.all(promises);
    const averageLoadTime = loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length;
    
    console.log(`Average load time with ${concurrentUsers} concurrent users: ${averageLoadTime}ms`);
    console.log('Individual load times:', loadTimes);
    
    // Assert average load time is acceptable
    expect(averageLoadTime).toBeLessThan(5000);
  });

  test('should have acceptable resource loading times', async ({ page }) => {
    const homePage = new HomePage(page);
    
    // Start monitoring network requests
    const resourceTimes: { [key: string]: number } = {};
    
    page.on('response', (response) => {
      const url = response.url();
      const timing = response.timing();
      if (timing) {
        resourceTimes[url] = timing.responseEnd - timing.requestStart;
      }
    });
    
    await homePage.navigate();
    await homePage.verifyPageLoaded();
    
    // Check specific resource types
    const imageRequests = Object.keys(resourceTimes).filter(url => 
      /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url)
    );
    
    const jsRequests = Object.keys(resourceTimes).filter(url => 
      /\.js$/i.test(url)
    );
    
    const cssRequests = Object.keys(resourceTimes).filter(url => 
      /\.css$/i.test(url)
    );
    
    console.log(`Loaded ${imageRequests.length} images, ${jsRequests.length} JS files, ${cssRequests.length} CSS files`);
    
    // Assert resource loading times
    imageRequests.forEach(url => {
      expect(resourceTimes[url]).toBeLessThan(2000); // Images < 2s
    });
    
    jsRequests.forEach(url => {
      expect(resourceTimes[url]).toBeLessThan(3000); // JS files < 3s
    });
    
    cssRequests.forEach(url => {
      expect(resourceTimes[url]).toBeLessThan(1000); // CSS files < 1s
    });
  });

  test('should handle slow network conditions', async ({ page }) => {
    // Simulate slow 3G network
    const client = await page.context().newCDPSession(page);
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: 1.5 * 1024 * 1024 / 8, // 1.5 Mbps
      uploadThroughput: 750 * 1024 / 8,           // 750 Kbps
      latency: 300 // 300ms
    });
    
    const startTime = Date.now();
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.verifyPageLoaded();
    const loadTime = Date.now() - startTime;
    
    console.log(`Page loaded in ${loadTime}ms on slow network`);
    
    // Assert page still loads within reasonable time on slow network
    expect(loadTime).toBeLessThan(10000); // 10 seconds max on slow network
  });

  test('should have efficient memory usage', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.verifyPageLoaded();
    
    // Get memory usage
    const memoryUsage = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory;
      }
      return null;
    });
    
    if (memoryUsage) {
      console.log('Memory usage:', {
        used: `${(memoryUsage.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        total: `${(memoryUsage.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        limit: `${(memoryUsage.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`
      });
      
      // Assert memory usage is reasonable (less than 50MB)
      expect(memoryUsage.usedJSHeapSize).toBeLessThan(50 * 1024 * 1024);
    }
  });

  test('should handle large product catalogs efficiently', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.verifyPageLoaded();
    
    // Navigate to collections page
    await homePage.goToCollections();
    
    const startTime = Date.now();
    
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-item"]', { timeout: 10000 });
    
    const loadTime = Date.now() - startTime;
    const productCount = await page.locator('[data-testid="product-item"]').count();
    
    console.log(`Loaded ${productCount} products in ${loadTime}ms`);
    
    // Assert products load efficiently
    expect(loadTime).toBeLessThan(3000);
    expect(productCount).toBeGreaterThan(0);
  });

  test('should have fast search functionality', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.verifyPageLoaded();
    
    const startTime = Date.now();
    
    // Perform search
    await homePage.searchProducts('shirt');
    
    // Wait for search results
    await page.waitForSelector('[data-testid="search-results"]', { timeout: 5000 });
    
    const searchTime = Date.now() - startTime;
    
    console.log(`Search completed in ${searchTime}ms`);
    
    // Assert search is fast
    expect(searchTime).toBeLessThan(2000);
  });

  test('should handle cart operations efficiently', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.verifyPageLoaded();
    
    // Add multiple items to cart and measure time
    const startTime = Date.now();
    
    // Add first item
    await homePage.clickLatestCollectionProduct(0);
    await page.locator('[data-testid="add-to-cart-button"]').click();
    await page.goBack();
    
    // Add second item
    await homePage.clickLatestCollectionProduct(1);
    await page.locator('[data-testid="add-to-cart-button"]').click();
    await page.goBack();
    
    // Go to cart
    await homePage.goToCart();
    await page.waitForSelector('[data-testid="cart-item"]');
    
    const totalTime = Date.now() - startTime;
    
    console.log(`Cart operations completed in ${totalTime}ms`);
    
    // Assert cart operations are efficient
    expect(totalTime).toBeLessThan(5000);
  });

  test('should maintain performance during checkout', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.verifyPageLoaded();
    
    // Add item to cart
    await homePage.clickLatestCollectionProduct(0);
    await page.locator('[data-testid="add-to-cart-button"]').click();
    await homePage.goToCart();
    
    const startTime = Date.now();
    
    // Proceed to checkout
    await page.locator('[data-testid="checkout-button"]').click();
    await page.waitForSelector('[data-testid="billing-form"]');
    
    const checkoutLoadTime = Date.now() - startTime;
    
    console.log(`Checkout page loaded in ${checkoutLoadTime}ms`);
    
    // Assert checkout loads quickly
    expect(checkoutLoadTime).toBeLessThan(3000);
  });
});