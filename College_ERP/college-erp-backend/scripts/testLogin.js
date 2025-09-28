// scripts/testLogin.js - Test Login Functionality
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Student, Faculty, setupAssociations } = require('../models/newModels');

async function testLogin() {
  try {
    setupAssociations();
    
    console.log('🔍 Testing Student Login...\n');
    
    // Test email from the screenshot
    const testEmail = 'suresh.shah.21.1@jecrc.ac.in';
    const testPassword = 'student123';
    
    console.log(`Testing email: ${testEmail}`);
    console.log(`Testing password: ${testPassword}`);
    
    // Try to find student by email
    const student = await Student.findOne({
      where: { email: testEmail }
    });
    
    if (!student) {
      console.log('❌ Student not found by email');
      
      // Try by roll number
      const rollNo = 'JECRC-CSE-21-001';
      console.log(`\nTrying with roll number: ${rollNo}`);
      
      const studentByRoll = await Student.findOne({
        where: { rollNo: rollNo }
      });
      
      if (!studentByRoll) {
        console.log('❌ Student not found by roll number either');
        
        // Let's see what students actually exist
        const existingStudents = await Student.findAll({
          attributes: ['rollNo', 'email', 'firstName', 'lastName'],
          limit: 5,
          order: [['id', 'ASC']]
        });
        
        console.log('\n📋 First 5 students in database:');
        existingStudents.forEach((s, index) => {
          console.log(`${index + 1}. ${s.rollNo} | ${s.firstName} ${s.lastName} | ${s.email}`);
        });
        
        return;
      } else {
        console.log(`✅ Found student by roll number: ${studentByRoll.firstName} ${studentByRoll.lastName}`);
        console.log(`Email: ${studentByRoll.email}`);
        
        // Test password
        const passwordMatch = await bcrypt.compare(testPassword, studentByRoll.password);
        console.log(`Password match: ${passwordMatch ? '✅ YES' : '❌ NO'}`);
      }
      
    } else {
      console.log(`✅ Found student: ${student.firstName} ${student.lastName}`);
      console.log(`Roll No: ${student.rollNo}`);
      
      // Test password
      const passwordMatch = await bcrypt.compare(testPassword, student.password);
      console.log(`Password match: ${passwordMatch ? '✅ YES' : '❌ NO'}`);
      
      if (!passwordMatch) {
        console.log('\n🔍 Checking actual password hash...');
        console.log(`Stored hash: ${student.password.substring(0, 20)}...`);
        
        // Try hashing the test password to compare
        const newHash = await bcrypt.hash(testPassword, 10);
        console.log(`New hash: ${newHash.substring(0, 20)}...`);
      }
    }
    
    // Test faculty login too
    console.log('\n\n🔍 Testing Faculty Login...');
    const facultyEmail = 'kavya.sharma1@jecrc.ac.in';
    const facultyPassword = 'faculty123';
    
    console.log(`Testing faculty email: ${facultyEmail}`);
    
    const faculty = await Faculty.findOne({
      where: { email: facultyEmail }
    });
    
    if (faculty) {
      console.log(`✅ Found faculty: ${faculty.firstName} ${faculty.lastName}`);
      const facultyPasswordMatch = await bcrypt.compare(facultyPassword, faculty.password);
      console.log(`Faculty password match: ${facultyPasswordMatch ? '✅ YES' : '❌ NO'}`);
    } else {
      console.log('❌ Faculty not found');
    }
    
  } catch (error) {
    console.error('❌ Error testing login:', error);
  }
  
  process.exit(0);
}

testLogin();