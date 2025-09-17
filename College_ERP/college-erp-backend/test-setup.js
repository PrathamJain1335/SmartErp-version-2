#!/usr/bin/env node

/**
 * College ERP Backend - Setup Verification Test
 * This script verifies that all enhanced features are properly configured
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

async function runTests() {
  log('\n🧪 College ERP Backend - Setup Verification', 'cyan');
  log('============================================', 'cyan');

  let allTestsPassed = true;

  // Test 1: Check if all required files exist
  log('\n1. Checking required files...', 'blue');
  
  const requiredFiles = [
    'server.js',
    'package.json',
    '.env.example',
    'models/index.js',
    'services/AIService.js',
    'services/NotificationService.js',
    'services/AnalyticsService.js',
    'routes/attendance.js',
    'routes/chatbot.js',
    'SETUP.md',
    'deploy.js'
  ];

  for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
      log(`  ✅ ${file}`, 'green');
    } else {
      log(`  ❌ ${file} - MISSING`, 'red');
      allTestsPassed = false;
    }
  }

  // Test 2: Check package.json dependencies
  log('\n2. Checking package.json dependencies...', 'blue');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredDeps = [
      'express',
      'socket.io',
      'openai',
      'compression',
      'helmet',
      'sequelize',
      'pg',
      'pg-hstore',
      'express-rate-limit'
    ];

    const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    for (const dep of requiredDeps) {
      if (allDeps[dep]) {
        log(`  ✅ ${dep} (${allDeps[dep]})`, 'green');
      } else {
        log(`  ❌ ${dep} - NOT INSTALLED`, 'red');
        allTestsPassed = false;
      }
    }
  } catch (error) {
    log('  ❌ Failed to read package.json', 'red');
    allTestsPassed = false;
  }

  // Test 3: Check environment configuration
  log('\n3. Checking environment configuration...', 'blue');
  
  if (fs.existsSync('.env')) {
    try {
      const envContent = fs.readFileSync('.env', 'utf8');
      
      const requiredEnvVars = [
        'DB_HOST',
        'DB_NAME',
        'DB_USER',
        'JWT_SECRET',
        'OPENAI_API_KEY'
      ];

      for (const envVar of requiredEnvVars) {
        if (envContent.includes(`${envVar}=`) && !envContent.includes(`${envVar}=your_`)) {
          log(`  ✅ ${envVar} - Configured`, 'green');
        } else if (envContent.includes(`${envVar}=your_`)) {
          log(`  ⚠️  ${envVar} - Needs configuration`, 'yellow');
        } else {
          log(`  ❌ ${envVar} - Missing`, 'red');
          allTestsPassed = false;
        }
      }

      // Special check for OpenAI API key
      if (envContent.includes('OPENAI_API_KEY=sk-') && !envContent.includes('sk-your-openai')) {
        log('  ✅ OpenAI API Key appears properly configured', 'green');
      } else {
        log('  ⚠️  OpenAI API Key needs to be configured for AI features', 'yellow');
      }
      
    } catch (error) {
      log('  ❌ Failed to read .env file', 'red');
      allTestsPassed = false;
    }
  } else {
    log('  ❌ .env file not found', 'red');
    allTestsPassed = false;
  }

  // Test 4: Check if directories exist
  log('\n4. Checking required directories...', 'blue');
  
  const requiredDirs = [
    'models',
    'routes',
    'services',
    'config',
    'uploads'
  ];

  for (const dir of requiredDirs) {
    if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
      log(`  ✅ ${dir}/`, 'green');
    } else {
      log(`  ❌ ${dir}/ - MISSING`, 'red');
      allTestsPassed = false;
    }
  }

  // Test 5: Check service files structure
  log('\n5. Checking service implementations...', 'blue');
  
  try {
    const aiService = fs.readFileSync('services/AIService.js', 'utf8');
    const notificationService = fs.readFileSync('services/NotificationService.js', 'utf8');
    const analyticsService = fs.readFileSync('services/AnalyticsService.js', 'utf8');

    if (aiService.includes('getChatbotResponse') && aiService.includes('getAttendanceAnalytics')) {
      log('  ✅ AIService - Complete', 'green');
    } else {
      log('  ❌ AIService - Incomplete', 'red');
      allTestsPassed = false;
    }

    if (notificationService.includes('sendToUser') && notificationService.includes('socket.io')) {
      log('  ✅ NotificationService - Complete', 'green');
    } else {
      log('  ❌ NotificationService - Incomplete', 'red');
      allTestsPassed = false;
    }

    if (analyticsService.includes('getAttendanceAnalytics') && analyticsService.includes('getAcademicAnalytics')) {
      log('  ✅ AnalyticsService - Complete', 'green');
    } else {
      log('  ❌ AnalyticsService - Incomplete', 'red');
      allTestsPassed = false;
    }

  } catch (error) {
    log('  ❌ Failed to check service files', 'red');
    allTestsPassed = false;
  }

  // Test 6: Check server.js configuration
  log('\n6. Checking server.js configuration...', 'blue');
  
  try {
    const serverContent = fs.readFileSync('server.js', 'utf8');
    
    const checks = [
      { name: 'Socket.IO integration', pattern: 'socketIo' },
      { name: 'AI Service import', pattern: 'AIService' },
      { name: 'Notification Service import', pattern: 'NotificationService' },
      { name: 'Chatbot routes', pattern: 'chatbot' },
      { name: 'Attendance routes', pattern: 'attendance' },
      { name: 'Health check endpoint', pattern: '/api/health' },
      { name: 'Rate limiting', pattern: 'rateLimit' },
      { name: 'Error handling middleware', pattern: 'ValidationError' }
    ];

    for (const check of checks) {
      if (serverContent.includes(check.pattern)) {
        log(`  ✅ ${check.name}`, 'green');
      } else {
        log(`  ❌ ${check.name} - Missing`, 'red');
        allTestsPassed = false;
      }
    }
  } catch (error) {
    log('  ❌ Failed to check server.js', 'red');
    allTestsPassed = false;
  }

  // Final Results
  log('\n' + '='.repeat(50), 'cyan');
  if (allTestsPassed) {
    log('🎉 ALL TESTS PASSED! Your enhanced backend is ready!', 'green');
    log('\nNext steps:', 'blue');
    log('1. Configure your OpenAI API key in .env', 'cyan');
    log('2. Update database credentials in .env', 'cyan');
    log('3. Run: npm run dev', 'cyan');
    log('4. Test the health endpoint: http://localhost:5000/api/health', 'cyan');
  } else {
    log('❌ Some tests failed. Please check the issues above.', 'red');
    log('\nTo fix issues:', 'yellow');
    log('1. Run: node deploy.js for automated setup', 'cyan');
    log('2. Manually address any missing files or configurations', 'cyan');
  }
  log('='.repeat(50), 'cyan');
}

// Run tests
runTests().catch((error) => {
  log('\n❌ Test suite failed:', 'red');
  console.error(error);
  process.exit(1);
});