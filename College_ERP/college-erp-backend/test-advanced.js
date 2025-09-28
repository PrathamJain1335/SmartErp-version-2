const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = "AIzaSyB9BAKOS4g1zJFx1Us6G7aV7g_ItVv1IOk";

async function advancedAPITest() {
  console.log('🔍 Advanced Gemini API Key Testing...');
  console.log(`🔑 Testing API Key: ${apiKey.substring(0, 20)}...${apiKey.substring(apiKey.length-5)}`);
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Test 1: Try to list available models first
    console.log('\n📋 Step 1: Checking API key validity...');
    
    // Test 2: Try different API versions and model names
    const testConfigurations = [
      { model: "gemini-1.5-flash", version: "v1beta" },
      { model: "gemini-1.5-pro", version: "v1beta" },
      { model: "gemini-pro", version: "v1" },
      { model: "gemini-1.0-pro", version: "v1" },
      { model: "models/gemini-1.5-flash", version: "v1beta" },
      { model: "models/gemini-pro", version: "v1" },
      { model: "models/text-bison-001", version: "v1beta" }
    ];
    
    console.log(`\n🧪 Step 2: Testing ${testConfigurations.length} different configurations...`);
    
    for (const config of testConfigurations) {
      try {
        console.log(`\n🔍 Testing: ${config.model} (API version: ${config.version})`);
        
        const model = genAI.getGenerativeModel({ 
          model: config.model 
        });
        
        const result = await model.generateContent("Say 'Hello, API is working!'");
        const response = await result.response;
        const text = response.text();
        
        console.log(`✅ SUCCESS! Configuration works:`);
        console.log(`   Model: ${config.model}`);
        console.log(`   Response: ${text.substring(0, 100)}`);
        
        return { 
          success: true, 
          workingModel: config.model,
          workingVersion: config.version,
          response: text 
        };
        
      } catch (error) {
        const errorMsg = error.message || error.toString();
        console.log(`❌ Failed: ${errorMsg.substring(0, 80)}...`);
        
        // Check for specific error types
        if (errorMsg.includes('API_KEY_INVALID')) {
          console.log('🔑 Error: API Key is invalid');
          return { success: false, error: 'Invalid API Key' };
        }
        if (errorMsg.includes('quota')) {
          console.log('📊 Error: API quota exceeded');
          return { success: false, error: 'Quota exceeded' };
        }
        if (errorMsg.includes('permission')) {
          console.log('🔒 Error: Permission denied');
          return { success: false, error: 'Permission denied' };
        }
      }
    }
    
    console.log('\n❌ No working configuration found');
    return { success: false, error: 'No compatible model configuration found' };
    
  } catch (error) {
    console.error('💥 API initialization failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Test with simpler approach
async function simpleTest() {
  console.log('\n🔧 Trying simple direct approach...');
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try the most basic model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    console.log('📝 Model created, testing generation...');
    
    const prompt = "Hello";
    const result = await model.generateContent(prompt);
    console.log('🔄 Generation completed, getting response...');
    
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Simple test SUCCESS!');
    console.log(`Response: ${text}`);
    return true;
    
  } catch (error) {
    console.log(`❌ Simple test failed: ${error.message}`);
    return false;
  }
}

// Run all tests
(async () => {
  console.log('🚀 Starting comprehensive Gemini API tests...\n');
  
  // Test 1: Advanced test
  const advancedResult = await advancedAPITest();
  
  if (advancedResult.success) {
    console.log(`\n🎉 EXCELLENT! API Key is working!`);
    console.log(`✅ Working Model: ${advancedResult.workingModel}`);
    console.log(`✅ API Version: ${advancedResult.workingVersion}`);
    console.log(`📝 Sample Response: ${advancedResult.response}`);
  } else {
    console.log(`\n⚠️ Advanced test failed: ${advancedResult.error}`);
    
    // Test 2: Try simple approach
    const simpleResult = await simpleTest();
    
    if (!simpleResult) {
      console.log('\n❌ All tests failed. Possible issues:');
      console.log('1. API Key might be invalid or expired');
      console.log('2. API Key might not have Generative AI permissions');
      console.log('3. There might be geographic restrictions');
      console.log('4. The API Key might be for a different Google service');
      console.log('\n🔧 Please verify:');
      console.log('- API Key is from Google AI Studio (ai.google.dev)');
      console.log('- API Key has "Generative AI" permissions enabled');
      console.log('- Your region supports Gemini API');
    }
  }
})();