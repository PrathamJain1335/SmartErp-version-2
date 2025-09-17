const { Student, Faculty, ChatHistory } = require('../models');
const sequelize = require('../config/database');

async function cleanupDuplicates() {
  try {
    console.log('🧹 Starting database cleanup...');
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Find duplicate Student_IDs
    const duplicateStudents = await sequelize.query(`
      SELECT "Student_ID", COUNT(*) as count 
      FROM student 
      WHERE "Student_ID" IS NOT NULL 
      GROUP BY "Student_ID" 
      HAVING COUNT(*) > 1
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    console.log(`Found ${duplicateStudents.length} duplicate Student_IDs`);

    if (duplicateStudents.length > 0) {
      console.log('Duplicate Student_IDs:');
      duplicateStudents.forEach(dup => {
        console.log(`  - ${dup.Student_ID} (${dup.count} entries)`);
      });

      // Remove duplicates, keeping the first one
      for (const dup of duplicateStudents) {
        console.log(`Cleaning up duplicate Student_ID: ${dup.Student_ID}`);
        
        // Get all records with this Student_ID
        const records = await sequelize.query(`
          SELECT id FROM student 
          WHERE "Student_ID" = :studentId 
          ORDER BY id ASC
        `, {
          replacements: { studentId: dup.Student_ID },
          type: sequelize.QueryTypes.SELECT
        });

        // Delete all but the first record
        if (records.length > 1) {
          const idsToDelete = records.slice(1).map(r => r.id);
          await sequelize.query(`
            DELETE FROM student 
            WHERE id IN (:idsToDelete)
          `, {
            replacements: { idsToDelete }
          });
          
          console.log(`  ✅ Removed ${idsToDelete.length} duplicate entries`);
        }
      }
    }

    // Find duplicate Faculty_IDs
    const duplicateFaculties = await sequelize.query(`
      SELECT "Faculty_ID", COUNT(*) as count 
      FROM faculty 
      WHERE "Faculty_ID" IS NOT NULL 
      GROUP BY "Faculty_ID" 
      HAVING COUNT(*) > 1
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    console.log(`Found ${duplicateFaculties.length} duplicate Faculty_IDs`);

    if (duplicateFaculties.length > 0) {
      // Remove duplicates for faculties too
      for (const dup of duplicateFaculties) {
        console.log(`Cleaning up duplicate Faculty_ID: ${dup.Faculty_ID}`);
        
        const records = await sequelize.query(`
          SELECT id FROM faculty 
          WHERE "Faculty_ID" = :facultyId 
          ORDER BY id ASC
        `, {
          replacements: { facultyId: dup.Faculty_ID },
          type: sequelize.QueryTypes.SELECT
        });

        if (records.length > 1) {
          const idsToDelete = records.slice(1).map(r => r.id);
          await sequelize.query(`
            DELETE FROM faculty 
            WHERE id IN (:idsToDelete)
          `, {
            replacements: { idsToDelete }
          });
          
          console.log(`  ✅ Removed ${idsToDelete.length} duplicate faculty entries`);
        }
      }
    }

    console.log('✅ Database cleanup completed successfully');
    
    // Now sync the database models
    console.log('📊 Syncing database models...');
    await sequelize.sync({ alter: true });
    console.log('✅ Database models synced successfully');

  } catch (error) {
    console.error('❌ Database cleanup failed:', error);
    throw error;
  } finally {
    await sequelize.close();
    console.log('🔐 Database connection closed');
  }
}

if (require.main === module) {
  cleanupDuplicates()
    .then(() => {
      console.log('🎉 Cleanup completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Cleanup failed:', error);
      process.exit(1);
    });
}

module.exports = { cleanupDuplicates };