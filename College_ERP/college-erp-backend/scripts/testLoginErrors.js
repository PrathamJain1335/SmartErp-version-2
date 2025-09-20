// scripts/testLoginErrors.js - Test Login Error Handling
const fetch = require('node-fetch');

async function testLoginErrors() {
  try {
    console.log('🧪 Testing Login Error Handling...\n');
    
    // Test invalid password
    console.log('📤 Testing Invalid Password:');
    const invalidPassResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: 'suresh.shah.21.1@jecrc.ac.in',
        password: 'wrongpassword',
        role: 'student'
      })
    });
    
    const invalidPassResult = await invalidPassResponse.json();
    console.log(`Status: ${invalidPassResponse.status}`);
    console.log(`Message: ${invalidPassResult.message || JSON.stringify(invalidPassResult)}`);
    
    // Test invalid email
    console.log('\n📤 Testing Invalid Email:');
    const invalidEmailResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: 'nonexistent@jecrc.ac.in',
        password: 'student123',
        role: 'student'
      })
    });
    
    const invalidEmailResult = await invalidEmailResponse.json();
    console.log(`Status: ${invalidEmailResponse.status}`);
    console.log(`Message: ${invalidEmailResult.message || JSON.stringify(invalidEmailResult)}`);
    
    // Test invalid roll number
    console.log('\n📤 Testing Invalid Roll Number:');
    const invalidRollResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: 'JECRC-CSE-21-999',
        password: 'student123',
        role: 'student'
      })
    });
    
    const invalidRollResult = await invalidRollResponse.json();
    console.log(`Status: ${invalidRollResponse.status}`);
    console.log(`Message: ${invalidRollResult.message || JSON.stringify(invalidRollResult)}`);
    
    // Test missing fields
    console.log('\n📤 Testing Missing Fields:');
    const missingFieldsResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: 'suresh.shah.21.1@jecrc.ac.in',
        // missing password and role
      })
    });
    
    const missingFieldsResult = await missingFieldsResponse.json();
    console.log(`Status: ${missingFieldsResponse.status}`);
    console.log(`Message: ${missingFieldsResult.message || JSON.stringify(missingFieldsResult)}`);
    
    console.log('\n✅ Error handling tests completed!');
    
  } catch (error) {
    console.error('❌ Error Test Failed:', error.message);
  }
}

testLoginErrors();