const axios = require('axios');

// Test the public chatbot endpoints
async function testChatbotAPI() {
  console.log('🧪 Testing Chatbot API endpoints...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:5000/api/chatbot/health');
    console.log('✅ Health check:', healthResponse.data);
    
    // Test suggestions endpoint
    console.log('\n2. Testing suggestions endpoint...');
    const suggestionsResponse = await axios.get('http://localhost:5000/api/chatbot/public-suggestions?role=student');
    console.log('✅ Suggestions:', suggestionsResponse.data.data.suggestions.slice(0, 3));
    
    // Test chat endpoint
    console.log('\n3. Testing chat endpoint...');
    const chatResponse = await axios.post('http://localhost:5000/api/chatbot/public-chat', {
      message: 'Tell me about the ERP system',
      context: { userRole: 'student' }
    });
    console.log('✅ Chat response:', chatResponse.data.data.response.substring(0, 100) + '...');
    
    console.log('\n🎉 All tests passed! Chatbot API is working correctly.');
    
  } catch (error) {
    console.error('❌ API Test failed:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
  }
}

testChatbotAPI();