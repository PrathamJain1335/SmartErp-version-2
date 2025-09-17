const { Client } = require('pg');
require('dotenv').config();

async function directReset() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS,
    database: process.env.DB_NAME || 'erp_data'
  });

  try {
    console.log('🔄 Starting direct database reset...');
    
    // Connect to database
    await client.connect();
    console.log('✅ Database connected successfully');

    // Drop all tables directly
    console.log('🗑️  Dropping all tables...');
    
    const dropTables = [
      'DROP TABLE IF EXISTS "ChatHistory" CASCADE',
      'DROP TABLE IF EXISTS "Grade" CASCADE',
      'DROP TABLE IF EXISTS "Assignment" CASCADE', 
      'DROP TABLE IF EXISTS "Attendance" CASCADE',
      'DROP TABLE IF EXISTS "Result" CASCADE',
      'DROP TABLE IF EXISTS "Exam" CASCADE',
      'DROP TABLE IF EXISTS "Fee" CASCADE',
      'DROP TABLE IF EXISTS "Library" CASCADE',
      'DROP TABLE IF EXISTS "Career" CASCADE',
      'DROP TABLE IF EXISTS "Feedback" CASCADE',
      'DROP TABLE IF EXISTS "FacultyAttendance" CASCADE',
      'DROP TABLE IF EXISTS "Faculty" CASCADE',
      'DROP TABLE IF EXISTS "Student" CASCADE'
    ];

    for (const dropQuery of dropTables) {
      try {
        await client.query(dropQuery);
        console.log(`✅ Executed: ${dropQuery}`);
      } catch (err) {
        console.log(`⚠️  Warning: ${err.message}`);
      }
    }

    console.log('✅ All tables dropped successfully');
    console.log('🎉 Database reset completed - you can now start the server');

  } catch (error) {
    console.error('❌ Database reset failed:', error);
    throw error;
  } finally {
    await client.end();
    console.log('🔐 Database connection closed');
  }
}

if (require.main === module) {
  directReset()
    .then(() => {
      console.log('🎉 Direct database reset completed successfully');
      console.log('📝 Run `npm run dev` to start the server and create fresh tables');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database reset failed:', error);
      process.exit(1);
    });
}

module.exports = { directReset };