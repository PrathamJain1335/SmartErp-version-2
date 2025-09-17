const { Client } = require('pg');
require('dotenv').config();

async function recreateDatabase() {
  // First connect to postgres database to drop and recreate the ERP database
  const adminClient = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS,
    database: 'postgres' // Connect to default postgres database
  });

  try {
    console.log('🔄 Connecting to PostgreSQL server...');
    await adminClient.connect();
    console.log('✅ Connected to PostgreSQL server');

    const dbName = process.env.DB_NAME || 'erp_data';

    // Terminate all connections to the target database
    console.log(`🔌 Terminating all connections to database: ${dbName}`);
    await adminClient.query(`
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = $1
        AND pid <> pg_backend_pid()
    `, [dbName]);

    // Drop the database
    console.log(`🗑️  Dropping database: ${dbName}`);
    await adminClient.query(`DROP DATABASE IF EXISTS "${dbName}"`);

    // Create the database
    console.log(`📊 Creating database: ${dbName}`);
    await adminClient.query(`CREATE DATABASE "${dbName}"`);

    console.log('✅ Database recreated successfully');

  } catch (error) {
    console.error('❌ Database recreation failed:', error);
    throw error;
  } finally {
    await adminClient.end();
    console.log('🔐 Admin database connection closed');
  }
}

if (require.main === module) {
  recreateDatabase()
    .then(() => {
      console.log('🎉 Database recreation completed successfully');
      console.log('📝 Run `npm run dev` to start the server with fresh database');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database recreation failed:', error);
      process.exit(1);
    });
}

module.exports = { recreateDatabase };