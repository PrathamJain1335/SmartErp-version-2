require('dotenv').config();
const { Student, Faculty } = require('../models');

async function showTestCredentials() {
  console.log('🔐 Available Test Authentication Credentials');
  console.log('==========================================\n');

  try {
    // Admin credentials (hardcoded in auth.js)
    console.log('👨‍💼 ADMIN CREDENTIALS:');
    console.log('📧 Email: admin@jecrc.ac.in');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');
    console.log();

    // Get test students
    console.log('👨‍🎓 STUDENT TEST ACCOUNTS:');
    const students = await Student.findAll({
      attributes: ['id', 'Student_ID', 'Full_Name', 'Email_ID', 'password'],
      limit: 5
    });

    if (students.length === 0) {
      console.log('❌ No student accounts found in database');
    } else {
      students.forEach((student, index) => {
        console.log(`${index + 1}. 📚 Student ID: ${student.Student_ID}`);
        console.log(`   👤 Name: ${student.Full_Name}`);
        console.log(`   📧 Email: ${student.Email_ID || 'Not set'}`);
        console.log(`   🔑 Has Password: ${student.password ? 'Yes' : 'No'}`);
        if (!student.password) {
          console.log('   ⚠️  Note: No password set - may need to use demo credentials');
        }
        console.log();
      });
    }

    // Get test faculty
    console.log('👨‍🏫 FACULTY TEST ACCOUNTS:');
    const faculties = await Faculty.findAll({
      attributes: ['Faculty_ID', 'Full_Name', 'Email_ID', 'password'],
      limit: 5
    });

    if (faculties.length === 0) {
      console.log('❌ No faculty accounts found in database');
    } else {
      faculties.forEach((faculty, index) => {
        console.log(`${index + 1}. 🏫 Faculty ID: ${faculty.Faculty_ID}`);
        console.log(`   👤 Name: ${faculty.Full_Name}`);
        console.log(`   📧 Email: ${faculty.Email_ID || 'Not set'}`);
        console.log(`   🔑 Has Password: ${faculty.password ? 'Yes' : 'No'}`);
        if (!faculty.password) {
          console.log('   ⚠️  Note: No password set - may need to use demo credentials');
        }
        console.log();
      });
    }

    // Suggestions for demo credentials
    console.log('💡 DEMO CREDENTIALS SUGGESTIONS:');
    console.log('================================');
    console.log('If users don\'t have passwords, you can:');
    console.log('1. Use the admin account to manage users');
    console.log('2. Create demo credentials by updating the database');
    console.log('3. Add password fields to existing users');
    console.log();

    // Create demo credentials if needed
    console.log('🔧 CREATING DEMO CREDENTIALS...');
    
    // Check if we need to add passwords to existing users
    const studentsWithoutPassword = await Student.findAll({
      where: { password: null },
      limit: 3
    });

    const facultiesWithoutPassword = await Faculty.findAll({
      where: { password: null },
      limit: 3
    });

    if (studentsWithoutPassword.length > 0 || facultiesWithoutPassword.length > 0) {
      console.log('Creating demo passwords for existing users...');
      
      const bcrypt = require('bcryptjs');
      const demoPassword = await bcrypt.hash('demo123', 10);

      // Add passwords to first few students
      for (let i = 0; i < Math.min(3, studentsWithoutPassword.length); i++) {
        const student = studentsWithoutPassword[i];
        const email = student.Email_ID || `${student.Student_ID.toLowerCase()}@student.jecrc.ac.in`;
        
        await Student.update(
          { 
            password: demoPassword,
            Email_ID: email
          },
          { where: { id: student.id } }
        );
        
        console.log(`✅ Student ${student.Student_ID} - Email: ${email}, Password: demo123`);
      }

      // Add passwords to first few faculty
      for (let i = 0; i < Math.min(3, facultiesWithoutPassword.length); i++) {
        const faculty = facultiesWithoutPassword[i];
        const email = faculty.Email_ID || `${faculty.Faculty_ID.toLowerCase()}@jecrc.ac.in`;
        
        await Faculty.update(
          { 
            password: demoPassword,
            Email_ID: email
          },
          { where: { Faculty_ID: faculty.Faculty_ID } }
        );
        
        console.log(`✅ Faculty ${faculty.Faculty_ID} - Email: ${email}, Password: demo123`);
      }
    }

    console.log();
    console.log('🎯 READY TO USE CREDENTIALS:');
    console.log('============================');
    
    // Show final credentials
    console.log('👨‍💼 Admin:');
    console.log('   Email: admin@jecrc.ac.in');
    console.log('   Password: admin123');
    console.log('   Role: admin');
    console.log();

    // Show updated students
    const updatedStudents = await Student.findAll({
      where: { password: { [require('sequelize').Op.not]: null } },
      attributes: ['Student_ID', 'Full_Name', 'Email_ID'],
      limit: 3
    });

    if (updatedStudents.length > 0) {
      console.log('👨‍🎓 Students (Password: demo123):');
      updatedStudents.forEach(student => {
        console.log(`   📧 ${student.Email_ID}`);
        console.log(`   👤 ${student.Full_Name} (${student.Student_ID})`);
        console.log('   🔑 Password: demo123');
        console.log('   👤 Role: student');
        console.log();
      });
    }

    // Show updated faculty
    const updatedFaculty = await Faculty.findAll({
      where: { password: { [require('sequelize').Op.not]: null } },
      attributes: ['Faculty_ID', 'Full_Name', 'Email_ID'],
      limit: 3
    });

    if (updatedFaculty.length > 0) {
      console.log('👨‍🏫 Faculty (Password: demo123):');
      updatedFaculty.forEach(faculty => {
        console.log(`   📧 ${faculty.Email_ID}`);
        console.log(`   👤 ${faculty.Full_Name} (${faculty.Faculty_ID})`);
        console.log('   🔑 Password: demo123');
        console.log('   👤 Role: faculty');
        console.log();
      });
    }

    console.log('🚀 LOGIN INSTRUCTIONS:');
    console.log('======================');
    console.log('1. Open your frontend: http://localhost:5175/');
    console.log('2. Use any of the above credentials to login');
    console.log('3. Select the correct role (admin/student/faculty)');
    console.log('4. Test profile photo upload functionality');
    console.log();

  } catch (error) {
    console.error('❌ Error getting credentials:', error.message);
  }
}

if (require.main === module) {
  showTestCredentials()
    .then(() => {
      console.log('✅ Test credentials ready!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Failed:', error);
      process.exit(1);
    });
}

module.exports = { showTestCredentials };