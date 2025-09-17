const sequelize = require('./config/database');

async function checkConstraints() {
  try {
    console.log('Checking student table constraints...');
    
    const studentCols = await sequelize.query(
      `SELECT column_name, is_nullable, column_default, data_type 
       FROM information_schema.columns 
       WHERE table_name = 'student' AND is_nullable = 'NO' 
       ORDER BY ordinal_position;`,
      { type: sequelize.QueryTypes.SELECT }
    );
    
    console.log('Required student columns:');
    studentCols.forEach(c => {
      console.log(` - ${c.column_name} (${c.data_type}) ${c.column_default ? '- default: ' + c.column_default : ''}`);
    });
    
    console.log('\nChecking faculty table constraints...');
    
    const facultyCols = await sequelize.query(
      `SELECT column_name, is_nullable, column_default, data_type 
       FROM information_schema.columns 
       WHERE table_name = 'faculty' AND is_nullable = 'NO' 
       ORDER BY ordinal_position;`,
      { type: sequelize.QueryTypes.SELECT }
    );
    
    console.log('Required faculty columns:');
    facultyCols.forEach(c => {
      console.log(` - ${c.column_name} (${c.data_type}) ${c.column_default ? '- default: ' + c.column_default : ''}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkConstraints();