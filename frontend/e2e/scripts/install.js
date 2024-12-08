#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up E-Commerce QA Automation Framework...\n');

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 16) {
  console.error('❌ Node.js 16 or higher is required. Current version:', nodeVersion);
  process.exit(1);
}

console.log('✅ Node.js version check passed:', nodeVersion);

// Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Install Playwright browsers
console.log('🌐 Installing Playwright browsers...');
try {
  execSync('npx playwright install', { stdio: 'inherit' });
  console.log('✅ Playwright browsers installed successfully');
} catch (error) {
  console.error('❌ Failed to install Playwright browsers:', error.message);
  process.exit(1);
}

// Create necessary directories
const directories = [
  'screenshots',
  'test-results',
  'playwright-report',
  'playwright/.auth'
];

directories.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

// Copy environment file if it doesn't exist
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', '.env.example');

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  fs.copyFileSync(envExamplePath, envPath);
  console.log('✅ Created .env file from .env.example');
  console.log('⚠️  Please update .env file with your configuration');
}

// Verify installation
console.log('\n🔍 Verifying installation...');
try {
  execSync('npx playwright --version', { stdio: 'pipe' });
  console.log('✅ Playwright installation verified');
} catch (error) {
  console.error('❌ Playwright verification failed:', error.message);
  process.exit(1);
}

console.log('\n🎉 E-Commerce QA Automation Framework setup completed successfully!');
console.log('\n📚 Next steps:');
console.log('1. Update .env file with your configuration');
console.log('2. Start your application server');
console.log('3. Run tests with: npm test');
console.log('4. View reports with: npm run report');
console.log('\n📖 For more information, see README.md');