const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = "AIzaSyBRtI9yX1oHUQY3jGPW23DNsZir6sa7QNw";

async function testGoogleCloudKey() {
  console.log('🌩️ Testing Google Cloud Enabled Gemini API Key...');
  console.log(`🔑 API Key: ${apiKey.substring(0, 20)}...${apiKey.substring(apiKey.length-5)}`);
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Test with comprehensive model list including latest models
    const modelNames = [
      // Latest Gemini models (2024)
      "gemini-1.5-flash",
      "gemini-1.5-pro", 
      "gemini-1.5-flash-latest",
      "gemini-1.5-pro-latest",
      
      // Stable models
      "gemini-pro",
      "gemini-1.0-pro",
      
      // Alternative naming patterns
      "models/gemini-1.5-flash",
      "models/gemini-1.5-pro",
      "models/gemini-pro",
      
      // Legacy models (if still supported)
      "text-bison-001",
      "chat-bison-001"
    ];
    
    console.log(`\n🧪 Testing ${modelNames.length} different Gemini models...`);
    
    for (let i = 0; i < modelNames.length; i++) {
      const modelName = modelNames[i];
      try {
        console.log(`\n${i + 1}. 🔍 Testing model: ${modelName}`);
        
        const model = genAI.getGenerativeModel({ model: modelName });
        
        // Simple test first
        console.log('   📝 Sending test prompt...');
        const result = await model.generateContent("Hello! Please respond with 'Gemini AI is now working with Google Cloud!'");
        
        console.log('   ⏳ Getting response...');
        const response = await result.response;
        const text = response.text();
        
        console.log(`   ✅ SUCCESS! Model ${modelName} is working!`);
        console.log(`   📝 Response: ${text.substring(0, 100)}...`);
        
        // Test ERP-specific functionality
        console.log(`\n   🎯 Testing ERP Assistant functionality...`);
        const erpPrompt = `You are an ERP (Enterprise Resource Planning) assistant for a college management system. 
        A student asks: "How can I check my attendance records?" 
        Please provide a helpful, detailed response about accessing attendance in an ERP system.`;
        
        const erpResult = await model.generateContent(erpPrompt);
        const erpResponse = await erpResult.response;
        const erpText = erpResponse.text();
        
        console.log(`   🎓 ERP Response: ${erpText.substring(0, 200)}...`);
        
        // Test with user context
        console.log(`\n   👤 Testing with user context...`);
        const contextPrompt = `You are an ERP assistant. Current user: Student (ID: JECRC-CSE-21-001, Name: Test Student).
        The student asks: "What's my current attendance percentage?"
        Provide a response acknowledging the user and explaining how they can check their attendance.`;
        
        const contextResult = await model.generateContent(contextPrompt);
        const contextResponse = await contextResult.response;
        const contextText = contextResponse.text();
        
        console.log(`   👤 Contextual Response: ${contextText.substring(0, 150)}...`);
        
        console.log(`\n🎉 EXCELLENT! API Key is fully functional!`);
        console.log(`✅ Working Model: ${modelName}`);
        console.log(`✅ Google Cloud Integration: SUCCESS`);
        console.log(`✅ ERP Functionality: READY`);
        console.log(`✅ Contextual Responses: WORKING`);
        
        return { 
          success: true, 
          workingModel: modelName,
          testResponse: text,
          erpResponse: erpText.substring(0, 300),
          contextResponse: contextText.substring(0, 300)
        };
        
      } catch (modelError) {
        const errorMsg = modelError.message || modelError.toString();
        console.log(`   ❌ Failed: ${errorMsg.substring(0, 100)}...`);
        
        // Check for specific error types
        if (errorMsg.includes('API_KEY_INVALID')) {
          console.log('🔑 Error: API Key is still invalid');
          return { success: false, error: 'Invalid API Key' };
        }
        if (errorMsg.includes('PERMISSION_DENIED')) {
          console.log('🔒 Error: Permission denied - check Google Cloud settings');
          return { success: false, error: 'Permission denied' };
        }
        if (errorMsg.includes('RESOURCE_EXHAUSTED') || errorMsg.includes('quota')) {
          console.log('📊 Error: API quota exceeded');
          return { success: false, error: 'Quota exceeded' };
        }
        if (errorMsg.includes('403') || errorMsg.includes('Forbidden')) {
          console.log('🚫 Error: Access forbidden - check billing/permissions');
          return { success: false, error: 'Access forbidden' };
        }
      }
    }
    
    console.log('\n❌ No working models found');
    return { success: false, error: 'No compatible models found' };
    
  } catch (error) {
    console.error('💥 API initialization failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Test with timeout
async function testWithTimeout() {
  console.log('🚀 Starting Gemini API test with 30-second timeout...\n');
  
  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Test timed out after 30 seconds')), 30000)
  );
  
  try {
    const result = await Promise.race([testGoogleCloudKey(), timeoutPromise]);
    
    if (result.success) {
      console.log(`\n🎊 FANTASTIC! Your Google Cloud Gemini API is working perfectly!`);
      console.log(`\n📊 Test Results:`);
      console.log(`   🤖 Working Model: ${result.workingModel}`);
      console.log(`   ✅ Basic Response: ${result.testResponse}`);
      console.log(`   🎓 ERP Functionality: Available`);
      console.log(`   👤 Context Awareness: Working`);
      console.log(`\n🔥 Your ERP system now has REAL AI capabilities!`);
      return true;
    } else {
      console.log(`\n😞 Test failed: ${result.error}`);
      return false;
    }
    
  } catch (error) {
    if (error.message.includes('timeout')) {
      console.log('\n⏰ Test timed out - this might indicate network issues');
    } else {
      console.log(`\n💥 Test error: ${error.message}`);
    }
    return false;
  }
}

// Run the test
testWithTimeout().then(success => {
  if (success) {
    console.log('\n🎯 Next: Starting the ERP server to activate AI features...');
  } else {
    console.log('\n🔧 Troubleshooting needed - check Google Cloud console for any issues');
  }
}).catch(console.error);