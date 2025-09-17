#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (question) => {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
};

async function main() {
  log('\n🚀 College ERP Backend - Enhanced Setup Wizard', 'cyan');
  log('================================================', 'cyan');

  try {
    // Check if .env exists
    const envPath = path.join(__dirname, '.env');
    const envExamplePath = path.join(__dirname, '.env.example');
    
    if (!fs.existsSync(envPath)) {
      log('\n📝 Setting up environment configuration...', 'yellow');
      
      if (fs.existsSync(envExamplePath)) {
        fs.copyFileSync(envExamplePath, envPath);
        log('✅ Created .env file from template', 'green');
      } else {
        // Create basic .env if example doesn't exist
        const basicEnv = `# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=college_erp
DB_USER=your_db_username
DB_PASSWORD=your_db_password

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5177

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRE=7d

# OpenAI Configuration (REQUIRED for AI features)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# Real-time Features
SOCKET_CORS_ORIGIN=http://localhost:5177
`;
        fs.writeFileSync(envPath, basicEnv);
        log('✅ Created basic .env file', 'green');
      }
    }

    // Check for OpenAI API key
    log('\n🤖 Checking AI Configuration...', 'yellow');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    if (envContent.includes('sk-your-openai-api-key-here') || !envContent.includes('OPENAI_API_KEY=sk-')) {
      log('❌ OpenAI API key not configured!', 'red');
      log('Please configure your OpenAI API key in the .env file:', 'yellow');
      log('1. Visit: https://platform.openai.com/api-keys', 'blue');
      log('2. Create a new API key', 'blue');
      log('3. Replace OPENAI_API_KEY=sk-your-openai-api-key-here with your actual key', 'blue');
      
      const continueSetup = await ask('\nDo you want to continue setup without AI features? (y/n): ');
      if (continueSetup.toLowerCase() !== 'y') {
        log('Setup cancelled. Please configure your OpenAI API key and run again.', 'red');
        process.exit(1);
      }
    } else {
      log('✅ OpenAI API key appears to be configured', 'green');
    }

    // Install dependencies
    log('\n📦 Installing dependencies...', 'yellow');
    try {
      execSync('npm install', { stdio: 'inherit', cwd: __dirname });
      log('✅ Dependencies installed successfully', 'green');
    } catch (error) {
      log('❌ Failed to install dependencies', 'red');
      log('Please run "npm install" manually', 'yellow');
    }

    // Check database connection
    log('\n🗄️  Database Setup...', 'yellow');
    
    const setupDb = await ask('Do you want to sync database models now? (y/n): ');
    if (setupDb.toLowerCase() === 'y') {
      try {
        // Try to sync database
        const { sequelize } = require('./models');
        await sequelize.authenticate();
        log('✅ Database connection successful', 'green');
        
        await sequelize.sync({ alter: true });
        log('✅ Database models synced successfully', 'green');
        log('📋 New tables/columns have been added for AI features', 'blue');
        
        await sequelize.close();
      } catch (error) {
        log('❌ Database setup failed:', 'red');
        log(error.message, 'red');
        log('Please check your database configuration in .env', 'yellow');
      }
    }

    // Create logs directory
    const logsDir = path.join(__dirname, 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
      log('✅ Created logs directory', 'green');
    }

    // Create uploads directory
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      log('✅ Created uploads directory', 'green');
    }

    log('\n🎉 Setup Complete!', 'green');
    log('==================', 'green');
    
    log('\n📋 Next Steps:', 'cyan');
    log('1. Configure your OpenAI API key in .env (if not done)', 'blue');
    log('2. Update database credentials in .env', 'blue');
    log('3. Start the server:', 'blue');
    log('   npm run dev (development)', 'magenta');
    log('   npm run server (production)', 'magenta');
    
    log('\n🔗 Useful URLs:', 'cyan');
    log('- Health Check: http://localhost:5000/api/health', 'blue');
    log('- API Base: http://localhost:5000/api/', 'blue');
    
    log('\n📚 Features Available:', 'cyan');
    log('✅ Real-time notifications with Socket.IO', 'green');
    log('✅ AI-powered analytics and predictions', 'green');
    log('✅ Faculty attendance management', 'green');
    log('✅ ERP-specific chatbot', 'green');
    log('✅ Role-based access control', 'green');
    log('✅ Cross-portal data synchronization', 'green');

    const startNow = await ask('\nDo you want to start the server now? (y/n): ');
    if (startNow.toLowerCase() === 'y') {
      log('\n🚀 Starting the enhanced backend server...', 'cyan');
      execSync('npm run dev', { stdio: 'inherit', cwd: __dirname });
    } else {
      log('\n💡 To start the server later, run: npm run dev', 'yellow');
    }

  } catch (error) {
    log('\n❌ Setup failed:', 'red');
    log(error.message, 'red');
    log('\nPlease check the error above and try again.', 'yellow');
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  log('\n\n👋 Setup cancelled by user', 'yellow');
  rl.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('\n\n👋 Setup terminated', 'yellow');
  rl.close();
  process.exit(0);
});

if (require.main === module) {
  main().catch((error) => {
    log('\n❌ Unexpected error:', 'red');
    log(error.message, 'red');
    process.exit(1);
  });
}