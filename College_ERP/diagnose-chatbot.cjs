const axios = require('axios');

async function diagnoseChatbot() {
    console.log('🔍 ERP Chatbot Error Diagnosis');
    console.log('===============================');
    
    let issues = [];
    let fixes = [];
    
    try {
        // Test 1: Backend Connectivity
        console.log('\n1. Testing backend connectivity...');
        try {
            const response = await axios.get('http://localhost:5001/api/test');
            console.log('✅ Backend is reachable:', response.data.message);
        } catch (error) {
            console.log('❌ Backend connectivity issue:', error.message);
            issues.push('Backend not running on port 5001');
            fixes.push('Start backend: cd college-erp-backend && npm start');
        }
        
        // Test 2: Chatbot Health
        console.log('\n2. Testing chatbot service...');
        try {
            const response = await axios.get('http://localhost:5001/api/chatbot/health');
            console.log('✅ Chatbot service is healthy:', response.data.status);
        } catch (error) {
            console.log('❌ Chatbot service issue:', error.message);
            issues.push('Chatbot health endpoint not accessible');
            fixes.push('Check if chatbot routes are properly configured');
        }
        
        // Test 3: Auth-required endpoints
        console.log('\n3. Testing authenticated endpoints...');
        try {
            const response = await axios.get('http://localhost:5001/api/chatbot/suggestions/student');
            console.log('❌ Unexpected: Got response without auth');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log('✅ Auth protection working correctly');
            } else {
                console.log('❌ Unexpected error:', error.message);
                issues.push('Authentication middleware issue');
                fixes.push('Check authentication token handling');
            }
        }
        
        // Test 4: CORS Configuration
        console.log('\n4. Testing CORS configuration...');
        try {
            // This test simulates frontend request
            const response = await axios.options('http://localhost:5001/api/chatbot/health', {
                headers: {
                    'Origin': 'http://localhost:5174',
                    'Access-Control-Request-Method': 'GET'
                }
            });
            console.log('✅ CORS configured correctly');
        } catch (error) {
            console.log('❌ CORS issue detected:', error.message);
            issues.push('CORS not properly configured for frontend port 5174');
            fixes.push('Update CORS origin in server.js to http://localhost:5174');
        }
        
        // Test 5: Gemini API Configuration
        console.log('\n5. Testing Gemini API configuration...');
        try {
            const GeminiERPChatbot = require('./college-erp-backend/services/geminiChatbot');
            const chatbot = new GeminiERPChatbot();
            const result = await chatbot.processQuery('test query', { role: 'student' });
            
            if (result.success) {
                console.log('✅ Gemini API working correctly');
            } else {
                console.log('❌ Gemini API error:', result.error);
                issues.push('Gemini API not responding');
                fixes.push('Check GEMINI_API_KEY in .env file');
            }
        } catch (error) {
            console.log('❌ Gemini service error:', error.message);
            issues.push('Gemini service initialization failed');
            fixes.push('Check if @google/generative-ai is installed and GEMINI_API_KEY is set');
        }
        
        // Summary
        console.log('\n' + '='.repeat(50));
        if (issues.length === 0) {
            console.log('🎉 No issues detected! Chatbot should be working.');
            console.log('\nIf you\'re still seeing errors, please check:');
            console.log('- Browser console for frontend errors');
            console.log('- Network tab in browser dev tools');
            console.log('- Authentication token in localStorage');
        } else {
            console.log(`❌ Found ${issues.length} issue(s):`);
            issues.forEach((issue, index) => {
                console.log(`   ${index + 1}. ${issue}`);
            });
            
            console.log('\n🛠️ Suggested fixes:');
            fixes.forEach((fix, index) => {
                console.log(`   ${index + 1}. ${fix}`);
            });
        }
        
        console.log('\n📋 Quick Checklist:');
        console.log('□ Backend running on port 5001');
        console.log('□ Frontend running on port 5174');
        console.log('□ User logged in with valid token');
        console.log('□ Browser has no CORS errors');
        console.log('□ Network requests reaching backend');
        
    } catch (error) {
        console.error('\n💥 Diagnosis script error:', error.message);
    }
}

diagnoseChatbot();