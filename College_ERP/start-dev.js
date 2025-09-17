#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting College ERP Development Environment...\n');

const isWindows = os.platform() === 'win32';

// Function to run a command in a specific directory
function runCommand(command, args, cwd, title) {
  console.log(`📦 Starting ${title}...`);
  
  const child = spawn(command, args, {
    cwd: cwd,
    stdio: 'inherit',
    shell: isWindows
  });

  child.on('error', (err) => {
    console.error(`❌ Failed to start ${title}:`, err);
  });

  return child;
}

// Start all services
async function startServices() {
  const projectRoot = __dirname;
  const backendPath = path.join(projectRoot, 'college-erp-backend');
  const aiServicePath = path.join(projectRoot, 'college-erp-backend', 'ai-service');

  console.log('Starting services in parallel...\n');

  // 1. Start the Node.js backend
  setTimeout(() => {
    runCommand('node', ['start.js'], backendPath, 'Node.js Backend (Port 5000)');
  }, 1000);

  // 2. Start the AI service (Python)
  setTimeout(() => {
    runCommand('python', ['start.py'], aiServicePath, 'AI Service (Port 8001)');
  }, 2000);

  // 3. Start the React frontend
  setTimeout(() => {
    runCommand(isWindows ? 'npm.cmd' : 'npm', ['run', 'dev'], projectRoot, 'React Frontend (Port 5173)');
  }, 3000);

  console.log(`
🎉 College ERP System Starting...

📋 Services:
   ├── 🔗 Frontend:  http://localhost:5173
   ├── ⚙️  Backend:   http://localhost:5000
   └── 🤖 AI Service: http://localhost:8001

🔑 Demo Credentials:
   ├── Admin:    admin@jecrc.ac.in / admin123
   ├── Student:  alice.johnson.cse25004@jecrc.edu / demo123
   └── Faculty:  jane.smith@jecrc.edu / demo123

💡 Features Available:
   ├── 🎨 Dark/Light Theme Toggle
   ├── 📱 Responsive Design
   ├── 🤖 AI Chatbot Assistant
   ├── 📄 AI Portfolio Generator
   ├── 📊 Dashboard Analytics
   ├── 👥 User Management
   └── 🔔 Real-time Notifications

⭐ Quick Start:
   1. Wait for all services to start (30-60 seconds)
   2. Open http://localhost:5173 in your browser
   3. Login with demo credentials above
   4. Explore the features!

🛑 To stop all services: Press Ctrl+C multiple times or close terminal

===============================================
`);
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down College ERP Development Environment...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down College ERP Development Environment...');
  process.exit(0);
});

// Start the services
startServices().catch(console.error);