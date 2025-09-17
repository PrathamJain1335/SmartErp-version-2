const bcrypt = require('bcryptjs');
const sequelize = require('./config/database');

async function addTestUsers() {
  try {
    console.log('Adding test users for authentication...');
    
    // Hash password for test users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Check and add test student
    const existingStudent = await sequelize.query(
      "SELECT * FROM student WHERE \"Email_ID\" = 'student@test.com' LIMIT 1;",
      { type: sequelize.QueryTypes.SELECT }
    );
    
    if (existingStudent.length === 0) {
      await sequelize.query(
        `INSERT INTO student (
          "Student_ID", "Full_Name", "Date_of_Birth", "Enrollment_No", 
          "Department", "Program", "Batch/Year", "Semester", 
          "Email_ID", "password", "role"
        ) VALUES (
          'STU001', 'Test Student', '2000-01-01', 'EN001', 
          'Computer Science', 'B.Tech', '2024', 1,
          'student@test.com', '${hashedPassword}', 'student'
        );`,
        { type: sequelize.QueryTypes.INSERT }
      );
      console.log('✅ Test student added (student@test.com / password123)');
    } else {
      console.log('✅ Test student already exists');
    }
    
    // Check and add test faculty
    const existingFaculty = await sequelize.query(
      "SELECT * FROM faculty WHERE \"Email_ID\" = 'faculty@test.com' LIMIT 1;",
      { type: sequelize.QueryTypes.SELECT }
    );
    
    if (existingFaculty.length === 0) {
      await sequelize.query(
        `INSERT INTO faculty (
          "Faculty_ID", "Full_Name", "Email_ID", "password", "role"
        ) VALUES (
          'FAC001', 'Test Faculty', 'faculty@test.com', '${hashedPassword}', 'faculty'
        );`,
        { type: sequelize.QueryTypes.INSERT }
      );
      console.log('✅ Test faculty added (faculty@test.com / password123)');
    } else {
      console.log('✅ Test faculty already exists');
    }
    
    console.log('\n🎉 Test users added successfully!');
    console.log('You can now test login with:');
    console.log('Student: student@test.com / password123');
    console.log('Faculty: faculty@test.com / password123');
    console.log('Admin: admin@jecrc.ac.in / admin123');
    
  } catch (error) {
    console.error('❌ Error adding test users:', error.message);
  } finally {
    await sequelize.close();
  }
}

addTestUsers();