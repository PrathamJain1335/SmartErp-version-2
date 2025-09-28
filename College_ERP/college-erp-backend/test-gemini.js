const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY || "AIzaSyCR8_6uNrmnyK4fBS-4dzG74y5OY_J-tPc";

async function testGeminiAPI() {
  console.log('🧪 Testing Gemini API...');
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try different model names
    const modelNames = [
      "gemini-1.5-flash",
      "gemini-1.5-pro", 
      "gemini-pro",
      "gemini-1.0-pro",
      "text-bison-001",
      "models/gemini-1.5-flash",
      "models/gemini-1.5-pro",
      "models/gemini-pro"
    ];
    
    for (const modelName of modelNames) {
      try {
        console.log(`\n🔍 Testing model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello, this is a test message.");
        const response = await result.response;
        const text = response.text();
        
        console.log(`✅ Model ${modelName} works!`);
        console.log(`Response: ${text.substring(0, 50)}...`);
        break; // Stop on first working model
        
      } catch (modelError) {
        console.log(`❌ Model ${modelName} failed: ${modelError.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Gemini API test failed:', error);
  }
}

testGeminiAPI();