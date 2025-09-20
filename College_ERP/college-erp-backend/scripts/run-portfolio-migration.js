#!/usr/bin/env node

const { sequelize } = require('../models');
const migration = require('../migrations/add_portfolio_fields');
const { QueryInterface } = require('sequelize');

async function runMigration() {
  try {
    console.log('🚀 Starting portfolio fields migration...');
    
    // Create QueryInterface instance
    const queryInterface = sequelize.getQueryInterface();
    
    // Run the migration
    await migration.up(queryInterface, sequelize.Sequelize);
    
    console.log('✅ Portfolio fields migration completed successfully!');
    console.log('📊 The following fields have been added to the student table:');
    console.log('  - skills (JSON)');
    console.log('  - projects (JSON)');
    console.log('  - achievements (JSON)');
    console.log('  - certifications (JSON)');
    console.log('  - extracurricular (JSON)');
    console.log('  - internships (JSON)');
    console.log('  - portfolioData (JSON)');
    console.log('  - portfolioLastGenerated (DATE)');
    console.log('  - careerGoals (TEXT)');
    console.log('  - linkedinProfile (STRING)');
    console.log('  - githubProfile (STRING)');
    console.log('  - personalWebsite (STRING)');
    console.log('');
    console.log('📋 The following fields have been added to the faculty table:');
    console.log('  - researchAreas (JSON)');
    console.log('  - industryExperience (JSON)');
    console.log('  - mentorshipPreferences (JSON)');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    
    // If the error is about columns already existing, that's OK
    if (error.message.includes('already exists')) {
      console.log('⚠️ Some portfolio fields already exist in the database. This is normal if migration was run before.');
      console.log('✅ Database schema is ready for portfolio functionality!');
    } else {
      console.error('💥 Full error details:', error);
      process.exit(1);
    }
  } finally {
    // Close database connection
    await sequelize.close();
    console.log('🔐 Database connection closed.');
  }
}

// Run the migration
runMigration();