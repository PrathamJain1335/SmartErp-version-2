const bcrypt = require('bcryptjs');
const sequelize = require('./config/database');

async function addJecrcUsers() {
  try {
    console.log('Adding JECRC domain users for authentication...');
    
    // Hash passwords for JECRC users
    const studentPassword = await bcrypt.hash('student123', 10);
    const facultyPassword = await bcrypt.hash('faculty123', 10);
    
    // Check and add JECRC student
    const existingStudent = await sequelize.query(
      "SELECT * FROM student WHERE \"Email_ID\" = 'student@jecrc.ac.in' LIMIT 1;",
      { type: sequelize.QueryTypes.SELECT }
    );
    
    if (existingStudent.length === 0) {
      await sequelize.query(
        `INSERT INTO student (
          "Student_ID", "Full_Name", "Date_of_Birth", "Enrollment_No", 
          "Department", "Program", "Batch/Year", "Semester", 
          "Email_ID", "password", "role"
        ) VALUES (
          'JECSTU001', 'JECRC Student', '2000-01-01', 'JECEN001', 
          'Computer Science', 'B.Tech', '2024', 1,
          'student@jecrc.ac.in', '${studentPassword}', 'student'
        );`,
        { type: sequelize.QueryTypes.INSERT }
      );
      console.log('✅ JECRC student added (student@jecrc.ac.in / student123)');
    } else {
      console.log('✅ JECRC student already exists');
    }
    
    // Check and add JECRC faculty
    const existingFaculty = await sequelize.query(
      "SELECT * FROM faculty WHERE \"Email_ID\" = 'faculty@jecrc.ac.in' LIMIT 1;",
      { type: sequelize.QueryTypes.SELECT }
    );
    
    if (existingFaculty.length === 0) {
      await sequelize.query(
        `INSERT INTO faculty (
          "Faculty_ID", "Full_Name", "Email_ID", "password", "role"
        ) VALUES (
          'JECFAC001', 'JECRC Faculty', 'faculty@jecrc.ac.in', '${facultyPassword}', 'faculty'
        );`,
        { type: sequelize.QueryTypes.INSERT }
      );
      console.log('✅ JECRC faculty added (faculty@jecrc.ac.in / faculty123)');
    } else {
      console.log('✅ JECRC faculty already exists');
    }
    
    console.log('\n🎉 JECRC users added successfully!');
    console.log('You can now test login with:');
    console.log('Student: student@jecrc.ac.in / student123');
    console.log('Faculty: faculty@jecrc.ac.in / faculty123');
    console.log('Admin: admin@jecrc.ac.in / admin123');
    
  } catch (error) {
    console.error('❌ Error adding JECRC users:', error.message);
  } finally {
    await sequelize.close();
  }
}

addJecrcUsers();