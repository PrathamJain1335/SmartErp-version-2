// scripts/getFacultyCredentials.js - Get Faculty Login Credentials
require('dotenv').config();
const { Faculty, Department, setupAssociations } = require('../models/newModels');

async function getFacultyCredentials() {
  try {
    console.log('🔍 Fetching Faculty Login Credentials...\n');
    
    // Setup associations first
    setupAssociations();
    
    const faculties = await Faculty.findAll({
      attributes: ['id', 'email', 'firstName', 'lastName', 'designation', 'isHOD', 'isClassAdvisor'],
      limit: 15,
      order: [['createdAt', 'ASC']]
    });
    
    console.log('📋 Sample Faculty Login Credentials (Email / Password: faculty123):\n');
    console.log('┌────────────────────────────────────────────────────────────────────────────────┐');
    console.log('│                           FACULTY LOGIN CREDENTIALS                           │');
    console.log('├────────────────────────────────────────────────────────────────────────────────┤');
    
    faculties.forEach((faculty, index) => {
      const name = `${faculty.firstName} ${faculty.lastName}`;
      const role = faculty.isHOD ? '(HOD)' : faculty.isClassAdvisor ? '(Advisor)' : '';
      
      console.log(`│ ${(index + 1).toString().padStart(2)} | Email: ${faculty.email.padEnd(42)} │`);
      console.log(`│    | Name:  ${name.padEnd(25)} | ${faculty.designation} ${role.padEnd(8)} │`);
      console.log('├────────────────────────────────────────────────────────────────────────────────┤');
    });
    
    console.log('└────────────────────────────────────────────────────────────────────────────────┘');
    console.log('\n🔑 Login Instructions:');
    console.log('   1. Use ANY of the above email addresses as the "identifier"');
    console.log('   2. Use "faculty123" as the password');
    console.log('   3. Select "faculty" as the role');
    console.log('   4. Or use Faculty ID (e.g., FAC-0001) as identifier\n');
    
    console.log('💡 Admin Login:');
    console.log('   Email: admin@jecrc.ac.in');
    console.log('   Password: admin123');
    console.log('   Role: admin\n');
    
    // Get some sample student credentials too
    const { Student } = require('../models/newModels');
    const students = await Student.findAll({
      attributes: ['rollNo', 'email', 'firstName', 'lastName'],
      limit: 5,
      order: [['createdAt', 'ASC']]
    });
    
    console.log('👨‍🎓 Sample Student Login Credentials (Password: student123):');
    students.forEach((student, index) => {
      console.log(`   ${index + 1}. Roll No: ${student.rollNo} | Name: ${student.firstName} ${student.lastName}`);
      console.log(`      Email: ${student.email}`);
    });
    
    console.log('\n✅ Database is fully functional and ready for logins!');
    
  } catch (error) {
    console.error('❌ Error fetching faculty credentials:', error);
  }
  
  process.exit(0);
}

getFacultyCredentials();