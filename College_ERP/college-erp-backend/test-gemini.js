const GeminiERPChatbot = require('./services/geminiChatbot');

async function testGeminiChatbot() {
    console.log('🤖 Testing Gemini ERP Chatbot');
    console.log('===============================');
    
    const chatbot = new GeminiERPChatbot();
    
    // Test ERP-related query
    console.log('\n📝 Testing ERP-related query...');
    const erpResult = await chatbot.processQuery('How do I check my attendance?', { role: 'student' });
    console.log('✅ ERP Query Response:', erpResult.response.substring(0, 100) + '...');
    console.log('Navigation:', erpResult.isNavigation);
    
    // Test non-ERP query (should be filtered out)
    console.log('\n📝 Testing non-ERP query...');
    const nonErpResult = await chatbot.processQuery('What is the weather today?');
    console.log('✅ Non-ERP Query Response:', nonErpResult.response);
    
    // Test navigation query
    console.log('\n📝 Testing navigation query...');
    const navResult = await chatbot.processQuery('Open student portal');
    console.log('✅ Navigation Response:', navResult.response);
    console.log('Navigation Type:', navResult.navigationType);
    
    // Test suggestions
    console.log('\n📝 Testing suggestions...');
    const suggestions = chatbot.getHelpfulSuggestions('student');
    console.log('✅ Student Suggestions:', suggestions.slice(0, 3));
}

testGeminiChatbot().catch(console.error);