const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = "AIzaSyB9BAKOS4g1zJFx1Us6G7aV7g_ItVv1IOk";

async function testNewGeminiKey() {
  console.log('🧪 Testing new Gemini API key...');
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try the most common current model names
    const modelNames = [
      "gemini-1.5-flash",
      "gemini-1.5-pro", 
      "gemini-pro",
      "gemini-1.5-flash-latest",
      "gemini-1.5-pro-latest",
      "text-bison-001",
      "chat-bison-001"
    ];
    
    console.log(`🔍 Testing ${modelNames.length} different model names...`);
    
    for (const modelName of modelNames) {
      try {
        console.log(`\n🔍 Testing model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const prompt = "Hello! This is a test. Please respond with 'API key is working!'";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log(`✅ SUCCESS! Model ${modelName} works!`);
        console.log(`📝 Response: ${text.substring(0, 100)}...`);
        
        // Test with ERP-specific query
        console.log(`\n🎯 Testing ERP-specific query...`);
        const erpPrompt = "You are an ERP assistant. A student asks: 'How can I check my attendance?' Please provide a helpful response.";
        const erpResult = await model.generateContent(erpPrompt);
        const erpResponse = await erpResult.response;
        const erpText = erpResponse.text();
        
        console.log(`✅ ERP Response: ${erpText.substring(0, 150)}...`);
        console.log(`\n🎉 API Key is fully functional with model: ${modelName}`);
        return { success: true, workingModel: modelName };
        
      } catch (modelError) {
        console.log(`❌ Model ${modelName} failed: ${modelError.message.substring(0, 100)}...`);
      }
    }
    
    console.log('\n❌ No working models found with this API key');
    return { success: false, error: 'No compatible models found' };
    
  } catch (error) {
    console.error('❌ API key test failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Run the test
testNewGeminiKey().then(result => {
  if (result.success) {
    console.log(`\n🎊 GREAT NEWS! Your API key works with model: ${result.workingModel}`);
    console.log('✅ AI services will be fully functional now!');
  } else {
    console.log(`\n😞 API key test failed: ${result.error}`);
    console.log('🔧 Please check if the API key is correct and has proper permissions');
  }
}).catch(error => {
  console.error('💥 Test script error:', error);
});