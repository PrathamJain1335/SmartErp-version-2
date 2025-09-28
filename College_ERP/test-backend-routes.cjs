const axios = require('axios');

// Simple test to check if backend routes exist
async function testBackendRoutes() {
  console.log('🧪 Testing Backend Routes...\n');
  
  const baseURL = 'http://localhost:5000';
  
  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${baseURL}/api/health`);
    console.log('✅ Health check:', healthResponse.data.status);
    
    // Test 2: Check if documents route exists (should return 401 without auth)
    console.log('\n2. Testing documents upload endpoint (expect 401)...');
    try {
      await axios.post(`${baseURL}/api/documents/upload`);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Documents upload endpoint exists (returns 401 as expected)');
      } else if (error.response?.status === 404) {
        console.log('❌ Documents upload endpoint NOT FOUND (404)');
      } else {
        console.log(`✅ Documents upload endpoint exists (returns ${error.response?.status})`);
      }
    }
    
    // Test 3: Check if document-approval route exists
    console.log('\n3. Testing document-approval endpoint (expect 401)...');
    try {
      await axios.get(`${baseURL}/api/document-approval/pending`);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Document approval endpoint exists (returns 401 as expected)');
      } else if (error.response?.status === 404) {
        console.log('❌ Document approval endpoint NOT FOUND (404)');
      } else {
        console.log(`✅ Document approval endpoint exists (returns ${error.response?.status})`);
      }
    }
    
    console.log('\n🎉 Backend route test completed!');
    
  } catch (error) {
    console.error('❌ Backend connection failed:', {
      message: error.message,
      code: error.code
    });
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Solution: Make sure your backend server is running on http://localhost:5000');
      console.log('   Run: cd college-erp-backend && npm start');
    }
  }
}

testBackendRoutes();