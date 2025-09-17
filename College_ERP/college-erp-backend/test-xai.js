require('dotenv').config();
const axios = require('axios');

async function testXAI() {
    console.log('Testing xAI API connection...');
    console.log('API Key (first 15 chars):', process.env.XAI_API_KEY?.substring(0, 15) + '...');
    
    try {
        const response = await axios.post('https://api.x.ai/v1/chat/completions', {
            model: "grok-beta",
            messages: [
                {
                    role: "system",
                    content: "You are Grok, a helpful assistant."
                },
                {
                    role: "user",
                    content: "Say hello in exactly 5 words."
                }
            ],
            max_tokens: 20,
            temperature: 0.5,
            stream: false
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });
        
        console.log('✅ xAI API test successful!');
        console.log('Response:', response.data.choices[0].message.content);
        console.log('Model used:', response.data.model);
        console.log('Tokens used:', response.data.usage);
        
    } catch (error) {
        console.error('❌ xAI API test failed:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

testXAI();