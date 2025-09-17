const { spawn } = require('child_process');
const { completeTest } = require('./complete-test');

async function startServerAndCompleteTest() {
  console.log('🚀 Starting College ERP Backend Server for Complete Testing...');
  
  // Start the server
  const server = spawn('node', ['start.js'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    cwd: process.cwd()
  });

  let serverReady = false;

  // Listen for server output
  server.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(output);
    
    // Check if server is ready
    if (output.includes('Server running on port 5000') && !serverReady) {
      serverReady = true;
      console.log('\n⏱️  Waiting 3 seconds for complete initialization...\n');
      
      // Wait a bit for full initialization, then run complete tests
      setTimeout(async () => {
        console.log('🧪 Running Complete Integration Tests...\n');
        await completeTest();
        
        console.log('\n🛑 Stopping server...');
        server.kill('SIGINT');
        process.exit(0);
      }, 3000);
    }
  });

  server.stderr.on('data', (data) => {
    console.error('Server Error:', data.toString());
  });

  server.on('close', (code) => {
    console.log(`\n✅ Server stopped with code ${code}`);
  });

  // Handle termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Terminating...');
    server.kill('SIGINT');
    process.exit(0);
  });
}

startServerAndCompleteTest().catch(console.error);