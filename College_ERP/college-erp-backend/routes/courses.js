const express = require('express');
const router = express.Router();
const { Course, Student, Faculty, Enrollment } = require('../models');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { Op } = require('sequelize');

/**
 * @route GET /api/courses
 * @desc Get courses with filters
 * @access Private
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { studentId, facultyId, semester, department, limit = 50 } = req.query;
    
    let includeClause = [];
    let whereClause = {};
    
    if (semester) whereClause.semester = semester;
    if (department) whereClause.department = department;
    
    // If studentId is provided, get enrolled courses
    if (studentId) {
      includeClause.push({
        model: Enrollment,
        where: { studentId },
        attributes: ['enrollmentDate', 'status', 'finalGrade', 'finalMarks']
      });
    }
    
    // If user is student, only show their enrolled courses
    if (req.user.role === 'student' && !studentId) {
      includeClause.push({
        model: Enrollment,
        where: { studentId: req.user.id },
        attributes: ['enrollmentDate', 'status', 'finalGrade', 'finalMarks']
      });
    }
    
    const courses = await Course.findAll({
      where: whereClause,
      include: includeClause,
      order: [['courseName', 'ASC']],
      limit: parseInt(limit)
    });
    
    res.json({
      success: true,
      data: {
        courses,
        total: courses.length
      }
    });
    
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses',
      error: error.message
    });
  }
});

/**
 * @route GET /api/courses/student/:studentId
 * @desc Get courses for a specific student
 * @access Private
 */
router.get('/student/:studentId', authenticateToken, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { semester, status = 'active' } = req.query;
    
    // Students can only view their own courses
    if (req.user.role === 'student' && req.user.id !== studentId) {
      return res.status(403).json({
        success: false,
        message: 'You can only view your own courses'
      });
    }
    
    let whereClause = {};
    if (semester) whereClause.semester = semester;
    
    const enrollments = await Enrollment.findAll({
      where: { 
        studentId,
        status
      },
      include: [
        {
          model: Course,
          where: whereClause,
          attributes: ['id', 'courseName', 'courseCode', 'credits', 'semester', 'description']
        }
      ],
      order: [[Course, 'courseName', 'ASC']]
    });
    
    const courses = enrollments.map(enrollment => ({
      ...enrollment.Course.dataValues,
      enrollment: {
        enrollmentDate: enrollment.enrollmentDate,
        status: enrollment.status,
        finalGrade: enrollment.finalGrade,
        finalMarks: enrollment.finalMarks
      }
    }));
    
    res.json({
      success: true,
      data: {
        courses,
        total: courses.length
      }
    });
    
  } catch (error) {
    console.error('Get student courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student courses',
      error: error.message
    });
  }
});

module.exports = router;