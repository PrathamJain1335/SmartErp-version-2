const sequelize = require('./config/database');

async function checkDatabase() {
  try {
    console.log('Checking student table structure...');
    
    const studentColumns = await sequelize.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'student' ORDER BY ordinal_position;",
      { type: sequelize.QueryTypes.SELECT }
    );
    
    console.log('Student table columns:');
    studentColumns.forEach(col => console.log(' -', col.column_name));
    
    console.log('\nChecking faculty table structure...');
    
    const facultyColumns = await sequelize.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'faculty' ORDER BY ordinal_position;",
      { type: sequelize.QueryTypes.SELECT }
    );
    
    console.log('Faculty table columns:');
    facultyColumns.forEach(col => console.log(' -', col.column_name));
    
  } catch (error) {
    console.error('Error checking database:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkDatabase();