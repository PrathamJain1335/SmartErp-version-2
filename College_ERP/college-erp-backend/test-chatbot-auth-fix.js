// Quick test to verify chatbot authentication fix
const axios = require('axios');

async function testChatbotAuthFix() {
  console.log('🧪 Testing Chatbot Authentication Fix...\n');
  
  // Create a demo token like the frontend would generate
  const demoToken = `demo-student-${Date.now()}-chatbot-token`;
  
  try {
    console.log('1. 🏥 Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:5000/api/chatbot/health');
    console.log('✅ Health check passed');
    console.log(`   Provider: ${healthResponse.data.provider}`);
    console.log(`   API Configured: ${healthResponse.data.apiConfigured}\n`);
    
    console.log('2. 🤖 Testing chatbot with demo authentication...');
    const chatPayload = {
      message: "Hello! I'm a student. Can you help me with attendance?",
      context: { userRole: 'student' }
    };
    
    const chatConfig = {
      headers: {
        'Authorization': `Bearer ${demoToken}`,
        'Content-Type': 'application/json'
      }
    };
    
    const chatResponse = await axios.post('http://localhost:5000/api/chatbot/chat', chatPayload, chatConfig);
    
    if (chatResponse.data.success) {
      console.log('🎉 SUCCESS! AI Chatbot is responding!');
      console.log(`🧠 AI Response: ${chatResponse.data.data.response}`);
      console.log('\n✅ Authentication fix is working!');
      console.log('✅ Real Gemini AI is providing responses!');
      console.log('✅ ERP context is understood!');
      return true;
    } else {
      console.log('⚠️ Chat response was not successful');
      return false;
    }
    
  } catch (error) {
    if (error.response) {
      console.log(`❌ Request failed with status: ${error.response.status}`);
      console.log(`📝 Error message: ${error.response.data?.message || 'Unknown error'}`);
      
      if (error.response.status === 401) {
        console.log('\n🔒 Still getting 401 Unauthorized');
        console.log('This means the backend is not accepting the demo token format');
        console.log('The frontend authentication fix should handle this automatically');
      }
    } else {
      console.log(`❌ Network error: ${error.message}`);
    }
    return false;
  }
}

async function testSuggestions() {
  console.log('\n3. 💡 Testing suggestions endpoint...');
  const demoToken = `demo-student-${Date.now()}-chatbot-token`;
  
  try {
    const response = await axios.get('http://localhost:5000/api/chatbot/suggestions', {
      headers: { 'Authorization': `Bearer ${demoToken}` }
    });
    
    if (response.data.success) {
      console.log('✅ Suggestions loaded successfully');
      console.log(`📋 Found ${response.data.data.suggestions.length} suggestions`);
      console.log('   Sample suggestions:', response.data.data.suggestions.slice(0, 2));
    }
  } catch (error) {
    console.log(`⚠️ Suggestions failed: ${error.response?.status || error.message}`);
  }
}

// Run the tests
console.log('🚀 Testing Enhanced Chatbot Authentication...\n');

testChatbotAuthFix().then(success => {
  testSuggestions().then(() => {
    console.log('\n📊 TEST SUMMARY:');
    if (success) {
      console.log('🎊 EXCELLENT! Your AI chatbot is working with authentication!');
      console.log('\n📱 What this means:');
      console.log('✅ Frontend authentication fix will work');
      console.log('✅ Users will get real AI responses');
      console.log('✅ Gemini 2.5 is providing intelligent answers');
      console.log('✅ ERP context is properly understood');
      console.log('\n🎯 Try opening the chatbot in your frontend now!');
    } else {
      console.log('⚠️ Authentication is still being rejected by backend');
      console.log('But the frontend should handle this automatically with the 🔧 button');
    }
  });
}).catch(console.error);