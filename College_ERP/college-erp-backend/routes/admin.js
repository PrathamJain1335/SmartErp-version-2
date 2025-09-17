const express = require('express');
const { Student, Faculty, Assignment } = require('../models');
const authMiddleware = require('../utils/auth');
const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');

const router = express.Router();

// Middleware to check admin role
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Get dashboard statistics
router.get('/dashboard/stats', authMiddleware, adminOnly, async (req, res) => {
  try {
    const totalStudents = await Student.count();
    const totalFaculty = await Faculty.count();
    const totalAssignments = await Assignment.count();
    
    const studentsThisSemester = await Student.count({
      where: { Semester: { [Op.gte]: new Date().getMonth() > 6 ? 1 : 2 } }
    });
    
    const avgAttendance = await Student.findOne({
      attributes: [[Student.sequelize.fn('AVG', Student.sequelize.col('Attendance_Percent')), 'avgAttendance']]
    });

    const gradeDistribution = await Student.findAll({
      attributes: [
        'Grade',
        [Student.sequelize.fn('COUNT', Student.sequelize.col('Grade')), 'count']
      ],
      group: ['Grade']
    });

    const departmentStats = await Student.findAll({
      attributes: [
        'Department',
        [Student.sequelize.fn('COUNT', Student.sequelize.col('Department')), 'count']
      ],
      group: ['Department']
    });

    res.json({
      totalStudents,
      totalFaculty,
      totalAssignments,
      studentsThisSemester,
      avgAttendance: parseFloat(avgAttendance?.dataValues?.avgAttendance || 0).toFixed(2),
      gradeDistribution,
      departmentStats
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// Get all students with filters
router.get('/students', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { department, semester, grade, page = 1, limit = 50, search } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = {};
    if (department) whereClause.Department = department;
    if (semester) whereClause.Semester = semester;
    if (grade) whereClause.Grade = grade;
    if (search) {
      whereClause[Op.or] = [
        { Full_Name: { [Op.iLike]: `%${search}%` } },
        { Student_ID: { [Op.iLike]: `%${search}%` } },
        { Email_ID: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Student.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['Student_ID', 'ASC']]
    });

    res.json({
      students: rows,
      totalCount: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Get all faculty with filters
router.get('/faculty', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { department, designation, page = 1, limit = 50, search } = req.query;
    const offset = (page - 1) * limit;
    
    const whereClause = {};
    if (department) whereClause.Department = department;
    if (designation) whereClause.Designation = designation;
    if (search) {
      whereClause[Op.or] = [
        { Full_Name: { [Op.iLike]: `%${search}%` } },
        { Faculty_ID: { [Op.iLike]: `%${search}%` } },
        { Email_ID: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Faculty.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['Faculty_ID', 'ASC']]
    });

    res.json({
      faculty: rows,
      totalCount: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error('Get faculty error:', error);
    res.status(500).json({ error: 'Failed to fetch faculty' });
  }
});

// AI Institutional Analytics
router.get('/ai/institutional-analytics', authMiddleware, adminOnly, async (req, res) => {
  try {
    // Calculate retention rate (mock calculation)
    const totalStudents = await Student.count();
    const activeStudents = await Student.count({ 
      where: { Attendance_Percent: { [Op.gte]: 75 } } 
    });
    const retentionRate = totalStudents > 0 ? (activeStudents / totalStudents * 100).toFixed(2) : 0;

    // Grade distribution
    const gradeDistribution = await Student.findAll({
      attributes: [
        'Grade',
        [Student.sequelize.fn('COUNT', Student.sequelize.col('Grade')), 'count']
      ],
      group: ['Grade']
    });

    const gradeMap = {};
    gradeDistribution.forEach(grade => {
      gradeMap[grade.Grade] = parseInt(grade.dataValues.count);
    });

    // Department performance
    const departmentPerformances = await Student.findAll({
      attributes: [
        'Department',
        [Student.sequelize.fn('AVG', Student.sequelize.col('Internal_Marks')), 'avgInternalMarks'],
        [Student.sequelize.fn('AVG', Student.sequelize.col('Attendance_Percent')), 'avgAttendance'],
        [Student.sequelize.fn('COUNT', Student.sequelize.col('Student_ID')), 'studentCount']
      ],
      group: ['Department']
    });

    // Faculty utilization
    const facultyUtilization = await Faculty.findAll({
      attributes: [
        'Department',
        [Faculty.sequelize.fn('COUNT', Faculty.sequelize.col('Faculty_ID')), 'facultyCount'],
        [Faculty.sequelize.fn('AVG', Faculty.sequelize.col('Weekly_Lectures_Assigned')), 'avgLectures']
      ],
      group: ['Department']
    });

    const institutionData = {
      studentRetentionRate: parseFloat(retentionRate),
      avgGradeDistribution: gradeMap,
      departmentPerformances: departmentPerformances.map(dept => ({
        department: dept.Department,
        avgInternalMarks: parseFloat(dept.dataValues.avgInternalMarks || 0).toFixed(2),
        avgAttendance: parseFloat(dept.dataValues.avgAttendance || 0).toFixed(2),
        studentCount: parseInt(dept.dataValues.studentCount)
      })),
      facultyUtilization: facultyUtilization.map(dept => ({
        department: dept.Department,
        facultyCount: parseInt(dept.dataValues.facultyCount),
        avgLectures: parseFloat(dept.dataValues.avgLectures || 0).toFixed(2)
      })),
      enrollmentTrends: {
        thisYear: totalStudents,
        lastYear: Math.floor(totalStudents * 0.95), // Mock data
        growthRate: 5.0 // Mock data
      }
    };

    const analytics = await AIService.generateInstitutionalAnalytics(institutionData);
    
    res.json({ analytics, rawData: institutionData });
  } catch (error) {
    console.error('Institutional analytics error:', error);
    res.status(500).json({ error: 'Failed to generate institutional analytics' });
  }
});

// Performance Reports
router.get('/reports/performance', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { department, semester, startDate, endDate } = req.query;
    
    const whereClause = {};
    if (department) whereClause.Department = department;
    if (semester) whereClause.Semester = semester;

    const students = await Student.findAll({
      where: whereClause,
      attributes: [
        'Student_ID', 'Full_Name', 'Department', 'Semester',
        'Internal_Marks', 'Practical_Marks', 'Mid_Sem_Marks', 'End_Sem_Marks',
        'Grade', 'Attendance_Percent'
      ]
    });

    const report = {
      totalStudents: students.length,
      averagePerformance: {
        internal: students.reduce((sum, s) => sum + (s.Internal_Marks || 0), 0) / students.length,
        practical: students.reduce((sum, s) => sum + (s.Practical_Marks || 0), 0) / students.length,
        midSem: students.reduce((sum, s) => sum + (s.Mid_Sem_Marks || 0), 0) / students.length,
        attendance: students.reduce((sum, s) => sum + (s.Attendance_Percent || 0), 0) / students.length
      },
      gradeDistribution: {
        A: students.filter(s => s.Grade === 'A').length,
        B: students.filter(s => s.Grade === 'B').length,
        C: students.filter(s => s.Grade === 'C').length,
        D: students.filter(s => s.Grade === 'D').length,
        F: students.filter(s => s.Grade === 'F').length
      },
      lowPerformers: students.filter(s => 
        s.Grade === 'F' || (s.Attendance_Percent || 0) < 75
      ).map(s => ({
        id: s.Student_ID,
        name: s.Full_Name,
        department: s.Department,
        grade: s.Grade,
        attendance: s.Attendance_Percent
      })),
      topPerformers: students.filter(s => 
        s.Grade === 'A' && (s.Attendance_Percent || 0) > 90
      ).map(s => ({
        id: s.Student_ID,
        name: s.Full_Name,
        department: s.Department,
        grade: s.Grade,
        attendance: s.Attendance_Percent
      }))
    };

    res.json(report);
  } catch (error) {
    console.error('Performance report error:', error);
    res.status(500).json({ error: 'Failed to generate performance report' });
  }
});

// Create student (simplified)
router.post('/students', authMiddleware, adminOnly, [
  body('Student_ID').isString(),
  body('Full_Name').isString(),
  body('Email_ID').isEmail(),
  body('Department').isString()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const student = await Student.create(req.body);
    res.status(201).json({ message: 'Student created successfully', student });
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ error: 'Failed to create student' });
  }
});

// Create faculty (simplified)
router.post('/faculty', authMiddleware, adminOnly, [
  body('Faculty_ID').isString(),
  body('Full_Name').isString(),
  body('Email_ID').isEmail(),
  body('Department').isString()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const faculty = await Faculty.create(req.body);
    res.status(201).json({ message: 'Faculty created successfully', faculty });
  } catch (error) {
    console.error('Create faculty error:', error);
    res.status(500).json({ error: 'Failed to create faculty' });
  }
});

// Update student
router.put('/students/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const [updatedRowsCount] = await Student.update(req.body, {
      where: { Student_ID: id }
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const updatedStudent = await Student.findByPk(id);
    res.json({ message: 'Student updated successfully', student: updatedStudent });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// Update faculty
router.put('/faculty/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const [updatedRowsCount] = await Faculty.update(req.body, {
      where: { Faculty_ID: id }
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    const updatedFaculty = await Faculty.findByPk(id);
    res.json({ message: 'Faculty updated successfully', faculty: updatedFaculty });
  } catch (error) {
    console.error('Update faculty error:', error);
    res.status(500).json({ error: 'Failed to update faculty' });
  }
});

// Get system health metrics
router.get('/system/health', authMiddleware, adminOnly, async (req, res) => {
  try {
    const dbHealth = await Student.sequelize.authenticate()
      .then(() => 'Connected')
      .catch(() => 'Disconnected');

    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();

    const health = {
      database: dbHealth,
      uptime: `${Math.floor(uptime / 60)} minutes`,
      memory: {
        used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
        total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`
      },
      nodeVersion: process.version,
      timestamp: new Date().toISOString()
    };

    res.json(health);
  } catch (error) {
    console.error('System health error:', error);
    res.status(500).json({ error: 'Failed to get system health' });
  }
});

module.exports = router;