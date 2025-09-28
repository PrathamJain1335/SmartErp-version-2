const axios = require('axios');

// Test authenticated API calls
async function testAuthenticatedAPI() {
  console.log('🔐 Testing Authenticated API Calls...\n');
  
  const baseURL = 'http://localhost:5000';
  
  // Demo token from the demo login system
  const demoTokens = {
    student: 'demo-token-' + Date.now(),
    faculty: 'demo-faculty-token-' + Date.now(),
    admin: 'demo-admin-token-' + Date.now()
  };
  
  console.log('⚠️ This test uses demo tokens. In browser, real tokens should be used from localStorage.');
  console.log('Real token should come from: authManager.getToken() or localStorage.getItem("authToken")\n');
  
  // Test with demo student token
  try {
    console.log('1. Testing with demo student token...');
    await axios.get(`${baseURL}/api/documents/my-documents?status=approved`, {
      headers: { Authorization: `Bearer ${demoTokens.student}` }
    });
    console.log('✅ Request sent successfully (token format accepted)');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('❌ 401 Unauthorized: Demo token rejected (expected in real backend)');
      console.log('   - Error message:', error.response?.data?.message);
      console.log('   - This is normal - backend expects real JWT tokens');
    } else {
      console.log(`❌ Unexpected error: ${error.response?.status} - ${error.response?.data?.message}`);
    }
  }
  
  console.log('\n📋 Next Steps:');
  console.log('1. Make sure you\'re logged in to the frontend');
  console.log('2. Check browser localStorage for "authToken" key');
  console.log('3. Use that real token in API calls');
  console.log('4. If no token exists, login first');
  
  console.log('\n🔍 To debug in browser console:');
  console.log('localStorage.getItem("authToken")');
  console.log('// or');
  console.log('Object.keys(localStorage)');
}

testAuthenticatedAPI();