// Quick test to check if server can start
const path = require('path');

// Set NODE_ENV to test to avoid database connection
process.env.NODE_ENV = 'test';

// Mock database to prevent actual connection
const mockSequelize = {
  authenticate: () => Promise.resolve(),
  sync: () => Promise.resolve(),
  close: () => Promise.resolve()
};

// Mock the config/database module
const Module = require('module');
const originalRequire = Module.prototype.require;

Module.prototype.require = function(...args) {
  if (args[0] === './config/database') {
    return mockSequelize;
  }
  return originalRequire.apply(this, args);
};

console.log('🧪 Testing server startup...');

try {
  // Try to load server.js
  const serverPath = path.join(__dirname, 'server.js');
  delete require.cache[serverPath]; // Clear cache
  
  const server = require('./server.js');
  console.log('✅ Server loaded successfully!');
  console.log('✅ No route pattern errors detected');
  
  // If we get here, the server structure is fine
  process.exit(0);
  
} catch (error) {
  console.error('❌ Server startup failed:', error.message);
  if (error.stack) {
    console.error('Stack:', error.stack.split('\n').slice(0, 5).join('\n'));
  }
  process.exit(1);
}