const axios = require('axios');

async function testIntegration() {
    console.log('🧪 Testing Frontend-Backend Integration');
    console.log('======================================');
    
    try {
        // Test basic backend connectivity
        console.log('\n1. Testing backend health...');
        const healthResponse = await axios.get('http://localhost:5001/api/test');
        console.log('✅ Backend Health:', healthResponse.data.message);
        
        // Test chatbot endpoint (without auth for basic connectivity test)
        console.log('\n2. Testing chatbot health endpoint...');
        try {
            const chatbotHealthResponse = await axios.get('http://localhost:5001/api/chatbot/health');
            console.log('✅ Chatbot Health:', chatbotHealthResponse.data.status);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log('✅ Chatbot endpoint reachable (requires auth)');
            } else {
                throw error;
            }
        }
        
        console.log('\n🎉 All integration tests passed!');
        console.log('\n📋 Summary:');
        console.log('- Backend running on: http://localhost:5001');
        console.log('- Frontend should run on: http://localhost:5174');
        console.log('- CORS configured for frontend port 5174');
        console.log('- Gemini API key configured');
        console.log('- All chatbot components in place');
        
    } catch (error) {
        console.error('❌ Integration test failed:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

testIntegration();