const { Student, Faculty, Attendance, Grade, Assignment, ChatHistory } = require('../models');
const sequelize = require('../config/database');

async function resetDatabase() {
  try {
    console.log('🔄 Starting complete database reset...');
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Drop all tables and recreate them
    console.log('🗑️  Dropping all tables...');
    await sequelize.drop();
    console.log('✅ All tables dropped');

    // Recreate all tables with proper constraints
    console.log('📊 Recreating all tables...');
    await sequelize.sync({ force: true });
    console.log('✅ All tables recreated successfully');

    console.log('✅ Database reset completed successfully');

  } catch (error) {
    console.error('❌ Database reset failed:', error);
    throw error;
  } finally {
    await sequelize.close();
    console.log('🔐 Database connection closed');
  }
}

if (require.main === module) {
  resetDatabase()
    .then(() => {
      console.log('🎉 Database reset completed successfully');
      console.log('📝 You can now start adding fresh data to your ERP system');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database reset failed:', error);
      process.exit(1);
    });
}

module.exports = { resetDatabase };