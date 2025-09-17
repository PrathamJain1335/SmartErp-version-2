const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for console output
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

function colorLog(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, args, cwd, label) {
  return new Promise((resolve, reject) => {
    colorLog('cyan', `\n🚀 Starting ${label}...`);
    colorLog('blue', `   Command: ${command} ${args.join(' ')}`);
    colorLog('blue', `   Directory: ${cwd}`);
    
    const process = spawn(command, args, {
      cwd: cwd,
      stdio: 'inherit',
      shell: true
    });

    process.on('error', (error) => {
      colorLog('red', `❌ Error starting ${label}: ${error.message}`);
      reject(error);
    });

    process.on('exit', (code) => {
      if (code === 0) {
        colorLog('green', `✅ ${label} finished successfully`);
        resolve();
      } else {
        colorLog('red', `❌ ${label} exited with code ${code}`);
        reject(new Error(`Process exited with code ${code}`));
      }
    });

    return process;
  });
}

async function checkPrerequisites() {
  colorLog('yellow', '\n📋 Checking prerequisites...');
  
  // Check if backend directory exists
  const backendPath = path.join(__dirname, 'college-erp-backend');
  if (!fs.existsSync(backendPath)) {
    colorLog('red', '❌ Backend directory not found!');
    return false;
  }
  
  // Check if node_modules exist in backend
  const backendNodeModules = path.join(backendPath, 'node_modules');
  if (!fs.existsSync(backendNodeModules)) {
    colorLog('yellow', '⚠️  Backend node_modules not found. Installing dependencies...');
    await runCommand('npm', ['install'], backendPath, 'Backend Dependencies');
  }
  
  // Check if node_modules exist in frontend
  const frontendNodeModules = path.join(__dirname, 'node_modules');
  if (!fs.existsSync(frontendNodeModules)) {
    colorLog('yellow', '⚠️  Frontend node_modules not found. Installing dependencies...');
    await runCommand('npm', ['install'], __dirname, 'Frontend Dependencies');
  }
  
  colorLog('green', '✅ Prerequisites check completed');
  return true;
}

async function initializeDatabase() {
  colorLog('magenta', '\n🗄️  Initializing database...');
  
  const backendPath = path.join(__dirname, 'college-erp-backend');
  const scriptPath = path.join(backendPath, 'scripts', 'create-test-users.js');
  
  try {
    await runCommand('node', [scriptPath], backendPath, 'Database Initialization');
    colorLog('green', '✅ Database initialized with test users');
  } catch (error) {
    colorLog('yellow', '⚠️  Database initialization had issues, but continuing...');
  }
}

async function startServices() {
  colorLog('bright', '\n🎯 Starting College ERP System...\n');
  
  const backendPath = path.join(__dirname, 'college-erp-backend');
  
  // Start backend server
  colorLog('cyan', '🔧 Starting Backend Server...');
  const backendProcess = spawn('node', ['server.js'], {
    cwd: backendPath,
    stdio: 'pipe',
    shell: true
  });

  backendProcess.stdout.on('data', (data) => {
    process.stdout.write(`${colors.green}[BACKEND]${colors.reset} ${data}`);
  });

  backendProcess.stderr.on('data', (data) => {
    process.stderr.write(`${colors.red}[BACKEND ERROR]${colors.reset} ${data}`);
  });

  // Wait a bit for backend to start
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Start frontend development server
  colorLog('cyan', '🎨 Starting Frontend Server...');
  const frontendProcess = spawn('npm', ['run', 'dev'], {
    cwd: __dirname,
    stdio: 'pipe',
    shell: true
  });

  frontendProcess.stdout.on('data', (data) => {
    process.stdout.write(`${colors.blue}[FRONTEND]${colors.reset} ${data}`);
  });

  frontendProcess.stderr.on('data', (data) => {
    process.stderr.write(`${colors.yellow}[FRONTEND INFO]${colors.reset} ${data}`);
  });

  // Display final instructions
  setTimeout(() => {
    colorLog('bright', '\n' + '='.repeat(60));
    colorLog('green', '🎉 College ERP System Started Successfully!');
    colorLog('bright', '='.repeat(60));
    colorLog('cyan', '📱 Frontend: http://localhost:5173');
    colorLog('cyan', '🔧 Backend:  http://localhost:5000');
    colorLog('bright', '='.repeat(60));
    colorLog('magenta', '🔑 Test Credentials:');
    colorLog('blue', '   👑 Admin:   admin@jecrc.ac.in / admin123');
    colorLog('blue', '   👨‍🎓 Student: alice.johnson.cse25004@jecrc.edu / demo123');
    colorLog('blue', '   👩‍🏫 Faculty: jane.smith@jecrc.edu / demo123');
    colorLog('bright', '='.repeat(60));
    colorLog('yellow', '💡 Tip: Open http://localhost:5173 in your browser');
    colorLog('yellow', '📝 Note: Press Ctrl+C to stop both servers');
    colorLog('bright', '='.repeat(60) + '\n');
  }, 5000);

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    colorLog('yellow', '\n🛑 Shutting down servers...');
    backendProcess.kill();
    frontendProcess.kill();
    setTimeout(() => {
      colorLog('green', '✅ Servers stopped. Goodbye!');
      process.exit(0);
    }, 1000);
  });

  // Keep the process alive
  return new Promise(() => {});
}

async function main() {
  try {
    colorLog('bright', '🎓 College ERP System Debug Starter');
    colorLog('bright', '==================================\n');
    
    const prereqsOk = await checkPrerequisites();
    if (!prereqsOk) {
      process.exit(1);
    }
    
    await initializeDatabase();
    await startServices();
    
  } catch (error) {
    colorLog('red', `❌ Startup failed: ${error.message}`);
    process.exit(1);
  }
}

main();