/**
 * Test data utilities for E2E tests
 */

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ProductData {
  name: string;
  price: number;
  category: string;
  description: string;
  sku: string;
}

export interface PaymentData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolderName: string;
  paymentMethod: 'credit-card' | 'paypal' | 'stripe' | 'cod';
}

export class TestDataGenerator {
  /**
   * Generate random user data
   */
  static generateUser(): UserData {
    const timestamp = Date.now();
    const randomId = Math.floor(Math.random() * 1000);
    
    return {
      firstName: `TestUser${randomId}`,
      lastName: `LastName${randomId}`,
      email: `test${timestamp}@example.com`,
      password: 'TestPassword123!',
      phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      address: `${Math.floor(Math.random() * 9999) + 1} Test Street`,
      city: 'Test City',
      state: 'TS',
      zipCode: `${Math.floor(Math.random() * 90000) + 10000}`,
      country: 'US'
    };
  }

  /**
   * Generate valid credit card data for testing
   */
  static generatePaymentData(): PaymentData {
    return {
      cardNumber: '4111111111111111', // Valid test card number
      expiryDate: '12/25',
      cvv: '123',
      cardHolderName: 'Test User',
      paymentMethod: 'credit-card'
    };
  }

  /**
   * Generate invalid credit card data for negative testing
   */
  static generateInvalidPaymentData(): PaymentData {
    return {
      cardNumber: '1234567890123456', // Invalid card number
      expiryDate: '12/20', // Expired date
      cvv: '12', // Invalid CVV
      cardHolderName: 'Test User',
      paymentMethod: 'credit-card'
    };
  }

  /**
   * Generate product data
   */
  static generateProduct(): ProductData {
    const randomId = Math.floor(Math.random() * 1000);
    
    return {
      name: `Test Product ${randomId}`,
      price: Math.floor(Math.random() * 500) + 10,
      category: 'Test Category',
      description: `This is a test product description for product ${randomId}`,
      sku: `TEST-SKU-${randomId}`
    };
  }

  /**
   * Get test user credentials from environment or defaults
   */
  static getTestUser(): { email: string; password: string } {
    return {
      email: process.env.TEST_USER_EMAIL || 'test@example.com',
      password: process.env.TEST_USER_PASSWORD || 'password123'
    };
  }

  /**
   * Generate multiple users for bulk testing
   */
  static generateUsers(count: number): UserData[] {
    return Array.from({ length: count }, () => this.generateUser());
  }

  /**
   * Generate test data for different countries
   */
  static generateUserByCountry(country: string): UserData {
    const baseUser = this.generateUser();
    
    const countryData = {
      'US': { state: 'CA', zipCode: '90210', phone: '+1' },
      'UK': { state: 'London', zipCode: 'SW1A 1AA', phone: '+44' },
      'CA': { state: 'ON', zipCode: 'K1A 0A6', phone: '+1' },
      'AU': { state: 'NSW', zipCode: '2000', phone: '+61' }
    };

    const data = countryData[country as keyof typeof countryData] || countryData['US'];
    
    return {
      ...baseUser,
      country,
      state: data.state,
      zipCode: data.zipCode,
      phone: `${data.phone}${Math.floor(Math.random() * 9000000000) + 1000000000}`
    };
  }

  /**
   * Generate discount codes for testing
   */
  static getDiscountCodes() {
    return {
      valid: ['SAVE10', 'WELCOME20', 'FIRST15'],
      invalid: ['EXPIRED', 'INVALID123', 'NOTFOUND'],
      expired: ['OLD2020', 'PAST2021']
    };
  }

  /**
   * Generate test addresses
   */
  static getTestAddresses() {
    return [
      {
        type: 'residential',
        address: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'US'
      },
      {
        type: 'business',
        address: '456 Business Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'US'
      },
      {
        type: 'international',
        address: '789 International Blvd',
        city: 'London',
        state: 'England',
        zipCode: 'SW1A 1AA',
        country: 'UK'
      }
    ];
  }

  /**
   * Generate test products with different categories
   */
  static getTestProducts() {
    return [
      {
        name: 'Test T-Shirt',
        category: 'Clothing',
        price: 29.99,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Red', 'Blue', 'Green']
      },
      {
        name: 'Test Sneakers',
        category: 'Footwear',
        price: 89.99,
        sizes: ['7', '8', '9', '10', '11'],
        colors: ['Black', 'White', 'Gray']
      },
      {
        name: 'Test Backpack',
        category: 'Accessories',
        price: 49.99,
        sizes: ['One Size'],
        colors: ['Black', 'Navy', 'Brown']
      }
    ];
  }

  /**
   * Generate search terms for testing
   */
  static getSearchTerms() {
    return {
      valid: ['shirt', 'shoes', 'bag', 'jacket', 'dress'],
      invalid: ['xyz123', 'nonexistent', '!@#$%'],
      empty: ['', ' ', '   '],
      special: ['shirt & tie', 'size:large', 'price:<50']
    };
  }
}