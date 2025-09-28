// scripts/setupDatabase.js - Database Setup and Migration Script
const { seedDatabase } = require('../seeders/jecrcUniversitySeeder');
const { sequelize, setupAssociations } = require('../models/newModels');

async function setupDatabase() {
  console.log('🚀 Starting JECRC University Database Setup...\n');
  
  try {
    // Test database connection
    console.log('🔗 Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');
    
    // Run the comprehensive seeder (which will handle associations)
    console.log('📊 Running database migration and seeding...');
    await seedDatabase();
    console.log('✅ Database setup completed successfully!\n');
    
    // Verify the setup
    console.log('🔍 Verifying database setup...');
    const results = await Promise.all([
      sequelize.models.Department.count(),
      sequelize.models.Faculty.count(),
      sequelize.models.Student.count(),
      sequelize.models.Section.count(),
      sequelize.models.Subject.count(),
    ]);
    
    console.log('📊 Final Database Statistics:');
    console.log(`   🏢 Departments: ${results[0]}`);
    console.log(`   👨‍🏫 Faculty: ${results[1]}`);
    console.log(`   👨‍🎓 Students: ${results[2]}`);
    console.log(`   🎓 Sections: ${results[3]}`);
    console.log(`   📚 Subjects: ${results[4]}`);
    
    console.log('\n🎉 JECRC University Database is ready for use!');
    console.log('');
    console.log('🔐 Default Login Credentials:');
    console.log('   Admin: admin@jecrc.ac.in / admin123');
    console.log('   Faculty: Use any generated faculty email with password "faculty123"');
    console.log('   Student: Use any generated roll number or email with password "student123"');
    console.log('');
    console.log('🚀 You can now start the application server!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    console.error('');
    console.error('💡 Troubleshooting tips:');
    console.error('   1. Ensure PostgreSQL is running');
    console.error('   2. Check database credentials in .env file');
    console.error('   3. Verify database "erp_data" exists');
    console.error('   4. Check network connectivity to database');
    throw error;
  }
}

// Handle command line execution
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('✨ Database setup completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database setup failed:', error.message);
      process.exit(1);
    });
}

module.exports = { setupDatabase };