const { spawn } = require('child_process');
const { testAPI } = require('./test-api');

async function startServerAndTest() {
  console.log('🚀 Starting College ERP Backend Server...');
  
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
    if (output.includes('Server running on port 5000')) {
      serverReady = true;
      console.log('\n⏱️  Waiting 3 seconds for complete initialization...\n');
      
      // Wait a bit for full initialization, then run tests
      setTimeout(async () => {
        console.log('🧪 Running API Tests...\n');
        await testAPI();
        
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

startServerAndTest().catch(console.error);