const { Client } = require('pg');
require('dotenv').config();

async function checkDatabase() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS,
    database: process.env.DB_NAME || 'erp_data'
  });

  try {
    await client.connect();
    console.log('✅ Database connected successfully');

    // Check if any tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    console.log('\n📋 Existing tables:');
    if (tablesResult.rows.length === 0) {
      console.log('  No tables found');
    } else {
      tablesResult.rows.forEach(row => {
        console.log(`  - ${row.table_name}`);
      });

      // Check for Student table specifically and count records
      const studentTableExists = tablesResult.rows.some(row => 
        row.table_name.toLowerCase() === 'student'
      );

      if (studentTableExists) {
        console.log('\n👥 Student table analysis:');
        
        const studentCount = await client.query('SELECT COUNT(*) as count FROM student');
        console.log(`  Total students: ${studentCount.rows[0].count}`);

        // Check for duplicate Student_IDs
        const duplicates = await client.query(`
          SELECT "Student_ID", COUNT(*) as count 
          FROM student 
          GROUP BY "Student_ID" 
          HAVING COUNT(*) > 1
          LIMIT 10
        `);

        if (duplicates.rows.length > 0) {
          console.log('\n❌ Found duplicates:');
          duplicates.rows.forEach(dup => {
            console.log(`  - ${dup.Student_ID}: ${dup.count} entries`);
          });
        } else {
          console.log('  ✅ No duplicates found');
        }

        // Sample a few records
        const sampleRecords = await client.query(`
          SELECT id, "Student_ID", "Name", "Email" 
          FROM student 
          LIMIT 5
        `);

        console.log('\n📄 Sample records:');
        sampleRecords.rows.forEach(record => {
          console.log(`  ID: ${record.id}, Student_ID: ${record.Student_ID}, Name: ${record.Name}`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Error checking database:', error.message);
  } finally {
    await client.end();
  }
}

checkDatabase();