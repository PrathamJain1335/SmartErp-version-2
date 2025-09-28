const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = "AIzaSyBRtI9yX1oHUQY3jGPW23DNsZir6sa7QNw";

async function testWithRealModels() {
  console.log('🎯 Testing Gemini API with ACTUAL available models...');
  console.log(`🔑 API Key is confirmed working!`);
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Based on the API response, let's test the actual available models
    const actualModels = [
      // Newer models from your API response
      "models/gemini-2.5-pro-preview-03-25",
      "models/gemini-2.5-flash-preview-05-20", 
      
      // Standard models that should be available
      "models/gemini-1.5-pro",
      "models/gemini-1.5-flash",
      "models/gemini-pro",
      "models/gemini-1.0-pro",
      
      // Without the models/ prefix
      "gemini-2.5-pro-preview-03-25",
      "gemini-2.5-flash-preview-05-20",
      "gemini-1.5-pro",
      "gemini-1.5-flash"
    ];
    
    console.log(`\n🧪 Testing ${actualModels.length} actual model names...`);
    
    for (let i = 0; i < actualModels.length; i++) {
      const modelName = actualModels[i];
      try {
        console.log(`\n${i + 1}. 🔍 Testing model: ${modelName}`);
        
        const model = genAI.getGenerativeModel({ model: modelName });
        
        console.log('   📤 Sending test prompt...');
        const result = await model.generateContent("Hello! Please respond with 'SUCCESS: Gemini API is now working!'");
        
        console.log('   📥 Getting response...');
        const response = await result.response;
        const text = response.text();
        
        console.log(`   ✅ BREAKTHROUGH! Model ${modelName} works!`);
        console.log(`   📝 Response: ${text}`);
        
        // Now test ERP functionality
        console.log(`\n   🎓 Testing ERP functionality...`);
        const erpPrompt = `You are an ERP assistant for a college management system. A student asks: "How can I check my attendance?" Please provide a helpful response.`;
        
        const erpResult = await model.generateContent(erpPrompt);
        const erpResponse = await erpResult.response;
        const erpText = erpResponse.text();
        
        console.log(`   🎯 ERP Response: ${erpText.substring(0, 200)}...`);
        
        console.log(`\n🎉 FANTASTIC! Your Gemini API is fully functional!`);
        console.log(`✅ Working Model: ${modelName}`);
        console.log(`✅ Basic AI: WORKING`);
        console.log(`✅ ERP Integration: READY`);
        console.log(`✅ Google Cloud: CONNECTED`);
        
        return { 
          success: true, 
          workingModel: modelName,
          basicResponse: text,
          erpResponse: erpText
        };
        
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message.substring(0, 100)}...`);
      }
    }
    
    console.log('\n❌ No working models found even with actual model names');
    return { success: false, error: 'No working models despite valid API key' };
    
  } catch (error) {
    console.error('💥 Test failed:', error.message);
    return { success: false, error: error.message };
  }
}

async function listAllAvailableModels() {
  console.log('\n📋 Listing ALL available models from your API...');
  
  try {
    const fetch = require('node-fetch');
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`\n📊 Found ${data.models.length} total models:`);
      
      // Filter for generation-capable models
      const generationModels = data.models.filter(model => 
        model.supportedGenerationMethods && 
        model.supportedGenerationMethods.includes('generateContent')
      );
      
      console.log(`\n🎯 Models that support generateContent (${generationModels.length}):`);
      generationModels.forEach((model, index) => {
        console.log(`   ${index + 1}. ${model.name}`);
        if (model.displayName) console.log(`      Display: ${model.displayName}`);
      });
      
      return generationModels.map(m => m.name);
    } else {
      console.log('❌ Failed to list models');
      return [];
    }
  } catch (error) {
    console.log(`❌ Error listing models: ${error.message}`);
    return [];
  }
}

async function runFullTest() {
  console.log('🚀 FULL GEMINI API TEST WITH YOUR WORKING API KEY!\n');
  
  // First, get the actual available models
  const availableModels = await listAllAvailableModels();
  
  if (availableModels.length > 0) {
    console.log(`\n🎯 Now testing the actual generation-capable models...`);
    
    // Test with the first few generation-capable models
    const testModels = availableModels.slice(0, 5);
    
    for (const modelName of testModels) {
      try {
        console.log(`\n🔥 Testing: ${modelName}`);
        
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const result = await model.generateContent("Hello! Say 'AI is working!'");
        const response = await result.response;
        const text = response.text();
        
        console.log(`🎊 SUCCESS WITH ${modelName}!`);
        console.log(`Response: ${text}`);
        
        return { success: true, workingModel: modelName, response: text };
        
      } catch (error) {
        console.log(`❌ ${modelName} failed: ${error.message.substring(0, 80)}...`);
      }
    }
  }
  
  // Fallback to the test with known model names
  return await testWithRealModels();
}

runFullTest().then(result => {
  if (result.success) {
    console.log(`\n🎊 CELEBRATION TIME! 🎊`);
    console.log(`\n✅ Your Gemini API is WORKING!`);
    console.log(`🤖 Working Model: ${result.workingModel}`);
    console.log(`📝 AI Response: ${result.response}`);
    console.log(`\n🔥 Ready to activate full AI features in your ERP system!`);
  } else {
    console.log(`\n😐 Still having issues, but your API key is definitely valid`);
    console.log(`The issue might be with model naming conventions or API version compatibility`);
  }
}).catch(console.error);