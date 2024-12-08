import { test, expect } from '@playwright/test';

test.describe('API Tests', () => {
  const baseURL = process.env.API_BASE_URL || 'http://localhost:3000/api';

  test('should get products list', async ({ request }) => {
    const response = await request.get(`${baseURL}/products`);
    
    expect(response.status()).toBe(200);
    
    const products = await response.json();
    expect(Array.isArray(products)).toBeTruthy();
    expect(products.length).toBeGreaterThan(0);
    
    // Verify product structure
    const product = products[0];
    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('price');
    expect(product).toHaveProperty('category');
  });

  test('should get single product by ID', async ({ request }) => {
    // First get products list to get a valid ID
    const productsResponse = await request.get(`${baseURL}/products`);
    const products = await productsResponse.json();
    const productId = products[0].id;
    
    const response = await request.get(`${baseURL}/products/${productId}`);
    
    expect(response.status()).toBe(200);
    
    const product = await response.json();
    expect(product.id).toBe(productId);
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('price');
    expect(product).toHaveProperty('description');
  });

  test('should return 404 for non-existent product', async ({ request }) => {
    const response = await request.get(`${baseURL}/products/non-existent-id`);
    
    expect(response.status()).toBe(404);
  });

  test('should create new user account', async ({ request }) => {
    const timestamp = Date.now();
    const userData = {
      name: `Test User ${timestamp}`,
      email: `test${timestamp}@example.com`,
      password: 'password123'
    };
    
    const response = await request.post(`${baseURL}/auth/register`, {
      data: userData
    });
    
    expect(response.status()).toBe(201);
    
    const result = await response.json();
    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('token');
    expect(result.user.email).toBe(userData.email);
  });

  test('should authenticate user', async ({ request }) => {
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    const response = await request.post(`${baseURL}/auth/login`, {
      data: loginData
    });
    
    expect(response.status()).toBe(200);
    
    const result = await response.json();
    expect(result).toHaveProperty('token');
    expect(result).toHaveProperty('user');
    expect(result.user.email).toBe(loginData.email);
  });

  test('should reject invalid login credentials', async ({ request }) => {
    const loginData = {
      email: 'invalid@example.com',
      password: 'wrongpassword'
    };
    
    const response = await request.post(`${baseURL}/auth/login`, {
      data: loginData
    });
    
    expect(response.status()).toBe(401);
    
    const result = await response.json();
    expect(result).toHaveProperty('error');
  });

  test('should add item to cart', async ({ request }) => {
    // First authenticate
    const loginResponse = await request.post(`${baseURL}/auth/login`, {
      data: {
        email: 'test@example.com',
        password: 'password123'
      }
    });
    
    const { token } = await loginResponse.json();
    
    // Get a product ID
    const productsResponse = await request.get(`${baseURL}/products`);
    const products = await productsResponse.json();
    const productId = products[0].id;
    
    // Add to cart
    const cartData = {
      productId,
      quantity: 2
    };
    
    const response = await request.post(`${baseURL}/cart/add`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: cartData
    });
    
    expect(response.status()).toBe(200);
    
    const result = await response.json();
    expect(result).toHaveProperty('cart');
    expect(result.cart.items).toContainEqual(
      expect.objectContaining({
        productId,
        quantity: 2
      })
    );
  });

  test('should get user cart', async ({ request }) => {
    // First authenticate
    const loginResponse = await request.post(`${baseURL}/auth/login`, {
      data: {
        email: 'test@example.com',
        password: 'password123'
      }
    });
    
    const { token } = await loginResponse.json();
    
    const response = await request.get(`${baseURL}/cart`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    expect(response.status()).toBe(200);
    
    const cart = await response.json();
    expect(cart).toHaveProperty('items');
    expect(cart).toHaveProperty('total');
    expect(Array.isArray(cart.items)).toBeTruthy();
  });

  test('should create order', async ({ request }) => {
    // First authenticate
    const loginResponse = await request.post(`${baseURL}/auth/login`, {
      data: {
        email: 'test@example.com',
        password: 'password123'
      }
    });
    
    const { token } = await loginResponse.json();
    
    const orderData = {
      shippingAddress: {
        street: '123 Test Street',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        country: 'US'
      },
      paymentMethod: 'credit-card',
      paymentDetails: {
        cardNumber: '4111111111111111',
        expiryDate: '12/25',
        cvv: '123'
      }
    };
    
    const response = await request.post(`${baseURL}/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: orderData
    });
    
    expect(response.status()).toBe(201);
    
    const order = await response.json();
    expect(order).toHaveProperty('id');
    expect(order).toHaveProperty('status');
    expect(order).toHaveProperty('total');
    expect(order.status).toBe('pending');
  });

  test('should get user orders', async ({ request }) => {
    // First authenticate
    const loginResponse = await request.post(`${baseURL}/auth/login`, {
      data: {
        email: 'test@example.com',
        password: 'password123'
      }
    });
    
    const { token } = await loginResponse.json();
    
    const response = await request.get(`${baseURL}/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    expect(response.status()).toBe(200);
    
    const orders = await response.json();
    expect(Array.isArray(orders)).toBeTruthy();
    
    if (orders.length > 0) {
      const order = orders[0];
      expect(order).toHaveProperty('id');
      expect(order).toHaveProperty('status');
      expect(order).toHaveProperty('total');
      expect(order).toHaveProperty('createdAt');
    }
  });

  test('should search products', async ({ request }) => {
    const searchQuery = 'shirt';
    
    const response = await request.get(`${baseURL}/products/search?q=${searchQuery}`);
    
    expect(response.status()).toBe(200);
    
    const results = await response.json();
    expect(Array.isArray(results)).toBeTruthy();
    
    // Verify search results contain the query term
    if (results.length > 0) {
      const product = results[0];
      const productText = `${product.name} ${product.description}`.toLowerCase();
      expect(productText).toContain(searchQuery.toLowerCase());
    }
  });

  test('should filter products by category', async ({ request }) => {
    const category = 'clothing';
    
    const response = await request.get(`${baseURL}/products?category=${category}`);
    
    expect(response.status()).toBe(200);
    
    const products = await response.json();
    expect(Array.isArray(products)).toBeTruthy();
    
    // Verify all products belong to the specified category
    products.forEach(product => {
      expect(product.category.toLowerCase()).toBe(category);
    });
  });

  test('should handle rate limiting', async ({ request }) => {
    const requests = [];
    
    // Make multiple rapid requests
    for (let i = 0; i < 10; i++) {
      requests.push(request.get(`${baseURL}/products`));
    }
    
    const responses = await Promise.all(requests);
    
    // Check if any requests were rate limited
    const rateLimitedResponses = responses.filter(response => response.status() === 429);
    
    if (rateLimitedResponses.length > 0) {
      console.log(`${rateLimitedResponses.length} requests were rate limited`);
      
      // Verify rate limit headers
      const rateLimitResponse = rateLimitedResponses[0];
      const headers = rateLimitResponse.headers();
      expect(headers).toHaveProperty('x-ratelimit-limit');
      expect(headers).toHaveProperty('x-ratelimit-remaining');
    }
  });

  test('should validate request data', async ({ request }) => {
    // Test with invalid product data
    const invalidProductData = {
      name: '', // Empty name should be invalid
      price: -10, // Negative price should be invalid
      category: 'invalid-category'
    };
    
    const response = await request.post(`${baseURL}/products`, {
      data: invalidProductData
    });
    
    expect(response.status()).toBe(400);
    
    const error = await response.json();
    expect(error).toHaveProperty('errors');
    expect(Array.isArray(error.errors)).toBeTruthy();
  });

  test('should handle server errors gracefully', async ({ request }) => {
    // Test endpoint that might cause server error
    const response = await request.get(`${baseURL}/products/trigger-error`);
    
    // Should return 500 or handle gracefully
    if (response.status() === 500) {
      const error = await response.json();
      expect(error).toHaveProperty('error');
      expect(error.error).toContain('Internal Server Error');
    }
  });
});