require('dotenv').config();

async function testHybridService() {
    console.log('Testing HybridAIService...');
    
    try {
        const HybridAIService = require('./services/HybridAIService');
        const aiService = new HybridAIService(process.env.XAI_API_KEY);
        
        console.log('✅ HybridAIService initialized successfully');
        console.log('Status:', aiService.getStatus());
        
        // Wait for xAI test to complete
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log('Final status:', aiService.getStatus());
        
    } catch (error) {
        console.error('❌ HybridAIService test failed:', error.message);
        console.error('Stack:', error.stack);
    }
}

testHybridService();