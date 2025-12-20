import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown...');
  
  // Cleanup operations can be added here
  // For example: database cleanup, file cleanup, etc.
  
  console.log('✅ Global teardown completed');
}

export default globalTeardown;