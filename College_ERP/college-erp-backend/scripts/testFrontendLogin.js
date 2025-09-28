// scripts/testFrontendLogin.js - Test Frontend Login Integration
const fetch = require('node-fetch');

async function testFrontendIntegration() {
  try {
    console.log('🧪 Testing Frontend-Backend Integration...\n');
    
    // Simulate the exact request that the frontend will make
    console.log('📤 Testing Frontend API Call Format:');
    
    // Test student login with email (as frontend would send it)
    const frontendLoginData = {
      identifier: 'suresh.shah.21.1@jecrc.ac.in',
      password: 'student123',
      role: 'student'
    };
    
    console.log(`Identifier: ${frontendLoginData.identifier}`);
    console.log(`Password: ${frontendLoginData.password}`);
    console.log(`Role: ${frontendLoginData.role}\n`);
    
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(frontendLoginData)
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('✅ Frontend Integration SUCCESS!');
      console.log('📋 Response Format:');
      console.log(`   Success: ${result.success}`);
      console.log(`   Token: ${result.token ? result.token.substring(0, 20) + '...' : 'Not provided'}`);
      console.log(`   User Name: ${result.user?.name || 'Not provided'}`);
      console.log(`   User Email: ${result.user?.email || 'Not provided'}`);
      console.log(`   User Roll No: ${result.user?.rollNo || 'Not provided'}`);
      console.log(`   Role: ${result.role || result.user?.role || 'Not provided'}`);
      console.log(`   Message: ${result.message || 'Not provided'}`);
    } else {
      console.log('❌ Frontend Integration FAILED!');
      console.log('📋 Error Response:');
      console.log(JSON.stringify(result, null, 2));
    }
    
    // Test roll number login
    console.log('\n\n📤 Testing Roll Number Login:');
    const rollLoginData = {
      identifier: 'JECRC-CSE-21-001',
      password: 'student123',
      role: 'student'
    };
    
    console.log(`Roll Number: ${rollLoginData.identifier}`);
    
    const rollResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rollLoginData)
    });
    
    const rollResult = await rollResponse.json();
    
    if (rollResponse.ok && rollResult.success) {
      console.log('✅ Roll Number Login SUCCESS!');
      console.log(`   User Name: ${rollResult.user?.name || 'Not provided'}`);
      console.log(`   User Email: ${rollResult.user?.email || 'Not provided'}`);
    } else {
      console.log('❌ Roll Number Login FAILED!');
      console.log(JSON.stringify(rollResult, null, 2));
    }
    
    console.log('\n🎉 Frontend-Backend Integration Test Complete!');
    console.log('💡 You can now use the frontend at http://localhost:5173');
    
  } catch (error) {
    console.error('❌ Integration Test Failed:', error.message);
    console.log('💡 Make sure both servers are running:');
    console.log('   - Backend: http://localhost:5000');
    console.log('   - Frontend: http://localhost:5173');
  }
}

testFrontendIntegration();