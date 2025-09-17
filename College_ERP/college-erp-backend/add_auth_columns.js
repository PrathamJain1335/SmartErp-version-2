const sequelize = require('./config/database');

async function addAuthColumns() {
  try {
    console.log('Adding authentication columns to database tables...');
    
    // Check if password column exists in student table
    const studentColumns = await sequelize.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'student' AND column_name = 'password';",
      { type: sequelize.QueryTypes.SELECT }
    );
    
    if (studentColumns.length === 0) {
      console.log('Adding password column to student table...');
      await sequelize.query("ALTER TABLE student ADD COLUMN password VARCHAR(255);");
      console.log('✅ Password column added to student table');
    } else {
      console.log('✅ Password column already exists in student table');
    }
    
    // Check if role column exists in student table
    const studentRoleColumns = await sequelize.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'student' AND column_name = 'role';",
      { type: sequelize.QueryTypes.SELECT }
    );
    
    if (studentRoleColumns.length === 0) {
      console.log('Adding role column to student table...');
      await sequelize.query("ALTER TABLE student ADD COLUMN role VARCHAR(50) DEFAULT 'student';");
      console.log('✅ Role column added to student table');
    } else {
      console.log('✅ Role column already exists in student table');
    }
    
    // Check if password column exists in faculty table
    const facultyColumns = await sequelize.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'faculty' AND column_name = 'password';",
      { type: sequelize.QueryTypes.SELECT }
    );
    
    if (facultyColumns.length === 0) {
      console.log('Adding password column to faculty table...');
      await sequelize.query("ALTER TABLE faculty ADD COLUMN password VARCHAR(255);");
      console.log('✅ Password column added to faculty table');
    } else {
      console.log('✅ Password column already exists in faculty table');
    }
    
    // Check if role column exists in faculty table
    const facultyRoleColumns = await sequelize.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'faculty' AND column_name = 'role';",
      { type: sequelize.QueryTypes.SELECT }
    );
    
    if (facultyRoleColumns.length === 0) {
      console.log('Adding role column to faculty table...');
      await sequelize.query("ALTER TABLE faculty ADD COLUMN role VARCHAR(50) DEFAULT 'faculty';");
      console.log('✅ Role column added to faculty table');
    } else {
      console.log('✅ Role column already exists in faculty table');
    }
    
    console.log('\n✅ All authentication columns have been added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding authentication columns:', error.message);
  } finally {
    await sequelize.close();
  }
}

addAuthColumns();