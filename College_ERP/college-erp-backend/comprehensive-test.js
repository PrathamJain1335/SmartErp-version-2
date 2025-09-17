require('dotenv').config();
const GeminiERPChatbot = require('./services/geminiChatbot');

async function comprehensiveTest() {
    console.log('🚀 Comprehensive Gemini ERP Chatbot Test');
    console.log('==========================================');
    
    const chatbot = new GeminiERPChatbot();
    
    const testQueries = [
        // ERP-related queries that should work
        { query: 'How do I check my grades?', role: 'student', expected: 'ERP_RESPONSE' },
        { query: 'Show me student attendance report', role: 'admin', expected: 'ERP_RESPONSE' },
        { query: 'How to enter marks for my class?', role: 'faculty', expected: 'ERP_RESPONSE' },
        
        // Navigation queries
        { query: 'Open faculty portal', role: 'student', expected: 'NAVIGATION' },
        { query: 'Go to attendance section', role: 'student', expected: 'NAVIGATION' },
        { query: 'Navigate to admin dashboard', role: 'admin', expected: 'NAVIGATION' },
        
        // Non-ERP queries that should be filtered
        { query: 'What is the capital of France?', role: 'student', expected: 'FILTERED' },
        { query: 'Tell me a joke', role: 'faculty', expected: 'FILTERED' },
        { query: 'What is machine learning?', role: 'admin', expected: 'FILTERED' },
        
        // Complex ERP queries
        { query: 'How can I improve my academic performance in the ERP system?', role: 'student', expected: 'ERP_RESPONSE' },
        { query: 'What features does the faculty portal have for managing students?', role: 'faculty', expected: 'ERP_RESPONSE' }
    ];
    
    for (let i = 0; i < testQueries.length; i++) {
        const test = testQueries[i];
        console.log(`\\n📝 Test ${i + 1}/${testQueries.length}: "${test.query}"`);
        console.log(`👤 Role: ${test.role}`);
        
        try {
            const result = await chatbot.processQuery(test.query, { role: test.role });
            
            console.log(`✅ Success: ${result.success}`);
            console.log(`🗨️ Response: ${result.response.substring(0, 80)}...`);
            
            if (result.isNavigation) {
                console.log(`🧭 Navigation Type: ${result.navigationType}`);
            }
            
            // Validate response type
            let actualType = 'ERP_RESPONSE';
            if (result.response.includes('I can only help with ERP and college management related queries')) {
                actualType = 'FILTERED';
            } else if (result.isNavigation) {
                actualType = 'NAVIGATION';
            }
            
            const passed = actualType === test.expected;
            console.log(`${passed ? '✅' : '❌'} Expected: ${test.expected}, Got: ${actualType}`);
            
        } catch (error) {
            console.log(`❌ Error: ${error.message}`);
        }
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Test suggestions for all roles
    console.log('\\n📋 Testing Suggestions for All Roles');
    console.log('=====================================');
    
    ['student', 'faculty', 'admin'].forEach(role => {
        const suggestions = chatbot.getHelpfulSuggestions(role);
        console.log(`\\n${role.toUpperCase()} Suggestions:`);
        suggestions.forEach((suggestion, index) => {
            console.log(`  ${index + 1}. ${suggestion}`);
        });
    });
    
    console.log('\\n🎉 Comprehensive test completed!');
}

comprehensiveTest().catch(error => {
    console.error('❌ Test failed:', error);
});