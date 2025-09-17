#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('🚀 College ERP Backend Startup Script');
console.log('=====================================');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found!');
  console.log('📝 Please create a .env file with the following variables:');
  console.log(`
PORT=5173
DB_HOST=localhost
DB_USER=postgres
DB_PASS=your_password
DB_NAME=erp_data
DB_PORT=5432
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
  `);
  process.exit(1);
}

// Load environment variables
require('dotenv').config();

// Check required environment variables
const requiredEnvVars = [
  'PORT',
  'DB_HOST', 
  'DB_USER',
  'DB_PASS',
  'DB_NAME',
  'DB_PORT',
  'JWT_SECRET',
  'GEMINI_API_KEY'
];

console.log('🔍 Checking environment variables...');
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  process.exit(1);
}
console.log('✅ All required environment variables are set');

// Check if uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  console.log('📁 Creating uploads directory...');
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Uploads directory created');
}

// Test database connection
console.log('🔗 Testing database connection...');
const sequelize = require('./config/database');

sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connection successful');
    
    // Sync database (create tables if they don't exist)
    console.log('📊 Syncing database models...');
    return sequelize.sync({ alter: false });
  })
  .then(() => {
    console.log('✅ Database models synced');
    
    // Start the server
    console.log('🌟 Starting College ERP Backend Server...');
    console.log(`🚀 Server will run on port ${process.env.PORT || 5173}`);
    console.log('📖 API Documentation: See README.md for endpoint details');
    console.log('🤖 AI Features: Powered by Google Gemini');
    console.log('=====================================');
    
    // Import and start the server
    require('./server');
  })
  .catch(error => {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n🆘 Troubleshooting tips:');
    console.log('1. Make sure PostgreSQL is running');
    console.log('2. Verify database credentials in .env file');
    console.log('3. Ensure database "erp_data" exists');
    console.log('4. Check if database server is accessible');
    process.exit(1);
  });

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT. Shutting down gracefully...');
  sequelize.close().then(() => {
    console.log('✅ Database connection closed.');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM. Shutting down gracefully...');
  sequelize.close().then(() => {
    console.log('✅ Database connection closed.');
    process.exit(0);
  });
});