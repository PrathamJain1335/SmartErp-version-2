require('dotenv').config();
const OpenAI = require('openai');

async function testOpenAI() {
    console.log('Testing OpenAI API connection...');
    console.log('API Key (first 20 chars):', process.env.OPENAI_API_KEY?.substring(0, 20) + '...');
    
    try {
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant."
                },
                {
                    role: "user",
                    content: "Say hello in exactly 5 words."
                }
            ],
            max_tokens: 20,
            temperature: 0.5
        });
        
        console.log('✅ OpenAI API test successful!');
        console.log('Response:', completion.choices[0].message.content);
        
    } catch (error) {
        console.error('❌ OpenAI API test failed:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

testOpenAI();