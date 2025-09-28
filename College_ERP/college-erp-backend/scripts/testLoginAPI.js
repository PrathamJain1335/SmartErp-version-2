// scripts/testLoginAPI.js - Test Login API Endpoint
const fetch = require('node-fetch');

async function testLoginAPI() {
  try {
    console.log('🧪 Testing Login API Endpoint...\n');
    
    // Test student login
    const studentLoginData = {
      identifier: 'suresh.shah.21.1@jecrc.ac.in',
      password: 'student123',
      role: 'student'
    };
    
    console.log('📤 Testing Student Login:');
    console.log(`Email: ${studentLoginData.identifier}`);
    console.log(`Password: ${studentLoginData.password}`);
    console.log(`Role: ${studentLoginData.role}\n`);
    
    const studentResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentLoginData)
    });
    
    const studentResult = await studentResponse.json();
    
    if (studentResponse.ok) {
      console.log('✅ Student Login SUCCESS!');
      console.log('📋 Response:');
      console.log(`   Token: ${studentResult.token ? studentResult.token.substring(0, 20) + '...' : 'Not provided'}`);
      console.log(`   User Name: ${studentResult.user?.name || 'Not provided'}`);
      console.log(`   Roll No: ${studentResult.user?.rollNo || 'Not provided'}`);
      console.log(`   Department: ${studentResult.user?.department || 'Not provided'}`);
    } else {
      console.log('❌ Student Login FAILED!');
      console.log('📋 Error Response:');
      console.log(JSON.stringify(studentResult, null, 2));
    }
    
    // Test with roll number instead of email
    console.log('\n\n📤 Testing Student Login with Roll Number:');
    const rollNoLoginData = {
      identifier: 'JECRC-CSE-21-001',
      password: 'student123',
      role: 'student'
    };
    
    console.log(`Roll No: ${rollNoLoginData.identifier}`);
    
    const rollNoResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rollNoLoginData)
    });
    
    const rollNoResult = await rollNoResponse.json();
    
    if (rollNoResponse.ok) {
      console.log('✅ Roll Number Login SUCCESS!');
      console.log(`   User Name: ${rollNoResult.user?.name || 'Not provided'}`);
      console.log(`   Email: ${rollNoResult.user?.email || 'Not provided'}`);
    } else {
      console.log('❌ Roll Number Login FAILED!');
      console.log(JSON.stringify(rollNoResult, null, 2));
    }
    
    // Test faculty login
    console.log('\n\n📤 Testing Faculty Login:');
    const facultyLoginData = {
      identifier: 'kavya.sharma1@jecrc.ac.in',
      password: 'faculty123',
      role: 'faculty'
    };
    
    console.log(`Email: ${facultyLoginData.identifier}`);
    
    const facultyResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(facultyLoginData)
    });
    
    const facultyResult = await facultyResponse.json();
    
    if (facultyResponse.ok) {
      console.log('✅ Faculty Login SUCCESS!');
      console.log(`   User Name: ${facultyResult.user?.name || 'Not provided'}`);
      console.log(`   Designation: ${facultyResult.user?.designation || 'Not provided'}`);
      console.log(`   Employee ID: ${facultyResult.user?.employeeId || 'Not provided'}`);
    } else {
      console.log('❌ Faculty Login FAILED!');
      console.log(JSON.stringify(facultyResult, null, 2));
    }
    
  } catch (error) {
    console.error('❌ API Test Error:', error.message);
    console.log('💡 Make sure the server is running on http://localhost:5000');
  }
}

testLoginAPI();