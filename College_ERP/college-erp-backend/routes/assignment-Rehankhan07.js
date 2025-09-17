const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Enrollment = sequelize.define('enrollments', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  studentId: {
    type: DataTypes.INTEGER, // Match the type of student.id
    references: {
      model: 'student',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  courseId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'courses',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  enrollmentDate: {
    type: DataTypes.DATE,
  },
  status: {
    type: DataTypes.STRING(255),
    defaultValue: 'active',
  },
  finalGrade: {
    type: DataTypes.STRING(255),
  },
  finalMarks: {
    type: DataTypes.DECIMAL(5, 2),
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'enrollments',
  timestamps: true, // Enable createdAt and updatedAt
});

module.exports = Enrollment;