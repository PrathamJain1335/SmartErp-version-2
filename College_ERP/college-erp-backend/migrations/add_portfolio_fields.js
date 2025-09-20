// Migration to add portfolio-related fields to database
const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add portfolio-related fields to Student table
    await queryInterface.addColumn('student', 'skills', {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Technical and soft skills as JSON array'
    });

    await queryInterface.addColumn('student', 'projects', {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Student projects as JSON array with title, description, technologies'
    });

    await queryInterface.addColumn('student', 'achievements', {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Student achievements and awards as JSON array'
    });

    await queryInterface.addColumn('student', 'certifications', {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Professional certifications as JSON array'
    });

    await queryInterface.addColumn('student', 'extracurricular', {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Extracurricular activities as JSON array'
    });

    await queryInterface.addColumn('student', 'internships', {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Internship experiences as JSON array'
    });

    await queryInterface.addColumn('student', 'portfolioData', {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'AI-generated portfolio data cache'
    });

    await queryInterface.addColumn('student', 'portfolioLastGenerated', {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Timestamp of last AI portfolio generation'
    });

    await queryInterface.addColumn('student', 'careerGoals', {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Student career objectives and goals'
    });

    await queryInterface.addColumn('student', 'linkedinProfile', {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'LinkedIn profile URL'
    });

    await queryInterface.addColumn('student', 'githubProfile', {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'GitHub profile URL'
    });

    await queryInterface.addColumn('student', 'personalWebsite', {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Personal website or portfolio URL'
    });

    // Add portfolio-related fields to Faculty table for recommendations
    await queryInterface.addColumn('faculty', 'researchAreas', {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Faculty research areas and interests'
    });

    await queryInterface.addColumn('faculty', 'industryExperience', {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Previous industry experience'
    });

    await queryInterface.addColumn('faculty', 'mentorshipPreferences', {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Areas where faculty can provide mentorship'
    });

    console.log('✅ Portfolio fields migration completed successfully');
  },

  down: async (queryInterface, Sequelize) => {
    // Remove portfolio-related fields from Student table
    await queryInterface.removeColumn('student', 'skills');
    await queryInterface.removeColumn('student', 'projects');
    await queryInterface.removeColumn('student', 'achievements');
    await queryInterface.removeColumn('student', 'certifications');
    await queryInterface.removeColumn('student', 'extracurricular');
    await queryInterface.removeColumn('student', 'internships');
    await queryInterface.removeColumn('student', 'portfolioData');
    await queryInterface.removeColumn('student', 'portfolioLastGenerated');
    await queryInterface.removeColumn('student', 'careerGoals');
    await queryInterface.removeColumn('student', 'linkedinProfile');
    await queryInterface.removeColumn('student', 'githubProfile');
    await queryInterface.removeColumn('student', 'personalWebsite');

    // Remove portfolio-related fields from Faculty table
    await queryInterface.removeColumn('faculty', 'researchAreas');
    await queryInterface.removeColumn('faculty', 'industryExperience');
    await queryInterface.removeColumn('faculty', 'mentorshipPreferences');

    console.log('✅ Portfolio fields migration rollback completed');
  }
};