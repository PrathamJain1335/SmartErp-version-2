const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = "AIzaSyBRtI9yX1oHUQY3jGPW23DNsZir6sa7QNw";

async function detailedDebugTest() {
  console.log('🔍 Detailed Debug Test for Gemini API...');
  console.log(`🔑 API Key: ${apiKey}`);
  
  try {
    // Test 1: Check if we can create the client
    console.log('\n📋 Step 1: Creating Google Generative AI client...');
    const genAI = new GoogleGenerativeAI(apiKey);
    console.log('✅ Client created successfully');
    
    // Test 2: Try to get model info with different approaches
    console.log('\n🔍 Step 2: Testing different model access patterns...');
    
    const testCases = [
      {
        name: "Standard gemini-pro",
        config: { model: "gemini-pro" }
      },
      {
        name: "Gemini 1.5 Flash",
        config: { model: "gemini-1.5-flash" }
      },
      {
        name: "With explicit safety settings",
        config: { 
          model: "gemini-pro",
          safetySettings: []
        }
      },
      {
        name: "With generation config",
        config: { 
          model: "gemini-pro",
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 100
          }
        }
      }
    ];
    
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      console.log(`\n${i + 1}. Testing: ${testCase.name}`);
      
      try {
        const model = genAI.getGenerativeModel(testCase.config);
        console.log('   ✅ Model object created');
        
        console.log('   📤 Sending minimal test prompt...');
        const result = await model.generateContent("Hi");
        
        console.log('   📥 Getting response...');
        const response = await result.response;
        console.log('   📝 Extracting text...');
        const text = response.text();
        
        console.log(`   🎉 SUCCESS! Response: ${text}`);
        return { success: true, workingConfig: testCase.config, response: text };
        
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
        
        // Log full error details for debugging
        if (error.status) console.log(`   📊 Status: ${error.status}`);
        if (error.statusText) console.log(`   📝 Status Text: ${error.statusText}`);
        if (error.errorDetails) console.log(`   📋 Error Details: ${JSON.stringify(error.errorDetails)}`);
      }
    }
    
    console.log('\n❌ All test cases failed');
    return { success: false, error: 'All configurations failed' };
    
  } catch (error) {
    console.error('💥 Client creation failed:', error);
    return { success: false, error: error.message };
  }
}

async function testAPIKeyValidity() {
  console.log('\n🔐 Testing API Key Validity...');
  
  try {
    // Try a simple HTTP request to check API key
    const fetch = require('node-fetch');
    
    const testUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    console.log('📡 Making direct API call to list models...');
    
    const response = await fetch(testUrl);
    console.log(`📊 Response Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Key is valid!');
      console.log(`📋 Available models: ${data.models ? data.models.length : 0}`);
      
      if (data.models && data.models.length > 0) {
        console.log('🎯 First few models:');
        data.models.slice(0, 3).forEach((model, index) => {
          console.log(`   ${index + 1}. ${model.name}`);
        });
      }
      
      return { success: true, models: data.models };
    } else {
      const errorText = await response.text();
      console.log(`❌ API call failed: ${errorText}`);
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }
    
  } catch (error) {
    console.error('💥 Direct API test failed:', error.message);
    return { success: false, error: error.message };
  }
}

async function runComprehensiveTest() {
  console.log('🚀 Starting Comprehensive Gemini API Debug Test...\n');
  
  // Test 1: Direct API key validation
  const apiKeyTest = await testAPIKeyValidity();
  
  if (apiKeyTest.success) {
    console.log('\n🎉 API Key is working with direct calls!');
    
    // Test 2: SDK-based testing
    const sdkTest = await detailedDebugTest();
    
    if (sdkTest.success) {
      console.log('\n🎊 EXCELLENT! SDK is also working!');
      console.log(`✅ Working Configuration: ${JSON.stringify(sdkTest.workingConfig)}`);
      console.log(`📝 Sample Response: ${sdkTest.response}`);
      return true;
    } else {
      console.log('\n⚠️ API Key works with direct calls but SDK fails');
      console.log('This might be a version issue with the GoogleGenerativeAI library');
      return false;
    }
    
  } else {
    console.log('\n❌ API Key validation failed');
    console.log(`Error: ${apiKeyTest.error}`);
    
    console.log('\n🔧 Troubleshooting suggestions:');
    console.log('1. Check if API key is from Google AI Studio (ai.google.dev)');
    console.log('2. Verify Generative AI API is enabled in Google Cloud Console');
    console.log('3. Check if billing is properly set up');
    console.log('4. Ensure API key has proper permissions');
    console.log('5. Try regenerating the API key');
    console.log('6. Check if your region supports Gemini API');
    
    return false;
  }
}

// Install node-fetch if not available
try {
  require('node-fetch');
} catch (e) {
  console.log('📦 Installing node-fetch for direct API testing...');
  const { execSync } = require('child_process');
  try {
    execSync('npm install node-fetch@2', { stdio: 'inherit' });
    console.log('✅ node-fetch installed');
  } catch (installError) {
    console.log('⚠️ Could not install node-fetch, skipping direct API test');
  }
}

runComprehensiveTest().catch(console.error);