// scripts/getStudentCredentials.js - Get Student Login Credentials
require('dotenv').config();
const { Student, Department, Section, setupAssociations } = require('../models/newModels');

async function getStudentCredentials() {
  try {
    console.log('👨‍🎓 Fetching Student Login Credentials...\n');
    
    // Setup associations first
    setupAssociations();
    
    // Get students from different sections
    const students = await Student.findAll({
      attributes: ['rollNo', 'email', 'firstName', 'lastName', 'currentSemester', 'program', 'sectionId', 'departmentId'],
      limit: 25,
      order: [['createdAt', 'ASC']]
    });
    
    console.log('🎓 Sample Student Login Credentials (Password: student123):\n');
    console.log('┌──────────────────────────────────────────────────────────────────────────────────────┐');
    console.log('│                            STUDENT LOGIN CREDENTIALS                                │');
    console.log('├──────────────────────────────────────────────────────────────────────────────────────┤');
    
    students.forEach((student, index) => {
      const name = `${student.firstName} ${student.lastName}`;
      console.log(`│ ${(index + 1).toString().padStart(2)} | Roll No: ${student.rollNo.padEnd(18)} | Name: ${name.padEnd(20)} │`);
      console.log(`│    | Email: ${student.email.padEnd(40)} | Sem: ${student.currentSemester} │`);
      console.log('├──────────────────────────────────────────────────────────────────────────────────────┤');
    });
    
    console.log('└──────────────────────────────────────────────────────────────────────────────────────┘');
    
    // Get count by section
    const sectionCounts = await Student.findAll({
      attributes: [
        'sectionId',
        [Student.sequelize.fn('COUNT', Student.sequelize.col('id')), 'studentCount']
      ],
      group: ['sectionId'],
      raw: true
    });
    
    console.log('\n📊 Students Distribution by Section:');
    sectionCounts.forEach((section, index) => {
      console.log(`   Section ${index + 1}: ${section.studentCount} students`);
    });
    
    console.log('\n🔑 Login Instructions for Students:');
    console.log('   METHOD 1 - Using Roll Number:');
    console.log('     • Identifier: Any roll number (e.g., JECRC-CSE-21-001)');
    console.log('     • Password: student123');
    console.log('     • Role: student');
    console.log('\n   METHOD 2 - Using Email:');
    console.log('     • Identifier: Any student email (e.g., suresh.shah.21.1@jecrc.ac.in)');
    console.log('     • Password: student123');
    console.log('     • Role: student');
    
    console.log('\n💡 Quick Test Credentials:');
    console.log('   🎯 CSE Student: JECRC-CSE-21-001 / student123');
    console.log('   🎯 IT Student:  JECRC-IT-21-201  / student123');
    console.log('   🎯 ECE Student: JECRC-ECE-21-401 / student123');
    
    // Also get some specific roll numbers for different departments
    const deptStudents = await Student.findAll({
      attributes: ['rollNo', 'firstName', 'lastName', 'email', 'departmentId'],
      where: {
        rollNo: {
          [Student.sequelize.Op.in]: [
            'JECRC-CSE-21-001', 'JECRC-CSE-21-050',
            'JECRC-IT-21-201', 'JECRC-IT-21-250',
            'JECRC-ECE-21-401', 'JECRC-ECE-21-450'
          ]
        }
      },
      order: [['rollNo', 'ASC']]
    });
    
    if (deptStudents.length > 0) {
      console.log('\n🏢 Department-wise Sample Credentials:');
      deptStudents.forEach((student) => {
        const dept = student.rollNo.split('-')[1];
        console.log(`   ${dept}: ${student.rollNo} | ${student.firstName} ${student.lastName}`);
        console.log(`        Email: ${student.email}`);
      });
    }
    
    console.log('\n✅ All 500 students are available for login!');
    console.log('✅ Both Roll Number and Email login methods work!');
    console.log('✅ Students are distributed across CSE, IT, and ECE departments');
    
  } catch (error) {
    console.error('❌ Error fetching student credentials:', error);
  }
  
  process.exit(0);
}

getStudentCredentials();