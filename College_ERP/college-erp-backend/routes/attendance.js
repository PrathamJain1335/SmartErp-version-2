const express = require('express');
const router = express.Router();
const db = require('../models');
const { Op } = require('sequelize');

// Get attendance records with AI analytics
router.get('/', async (req, res) => {
  try {
    const { 
      studentId, 
      facultyId, 
      subjectId, 
      section, 
      department,
      startDate, 
      endDate, 
      includeAnalytics = false 
    } = req.query;

    const whereClause = {};
    
    // Apply filters
    if (studentId) whereClause.studentId = studentId;
    if (facultyId) whereClause.facultyId = facultyId;
    if (subjectId) whereClause.subjectId = subjectId;
    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [startDate, endDate]
      };
    }

    const includeClause = [
      { 
        model: db.Student, 
        attributes: ['id', 'Full_Name', 'Department', 'Section', 'Semester'],
        where: {},
        include: [{ model: db.User, attributes: ['firstName', 'lastName'] }]
      },
      { 
        model: db.Faculty,
        attributes: ['id', 'Full_Name', 'Department'],
        include: [{ model: db.User, attributes: ['firstName', 'lastName'] }]
      },
      { 
        model: db.Course, 
        attributes: ['id', 'courseName', 'courseCode'] 
      }
    ];

    // Add section filter to student include
    if (section) {
      includeClause[0].where.Section = section;
    }
    if (department) {
      includeClause[0].where.Department = department;
    }

    const attendanceRecords = await db.Attendance.findAll({
      where: whereClause,
      include: includeClause,
      order: [['date', 'DESC'], ['timestamp', 'DESC']]
    });

    let analytics = null;
    if (includeAnalytics === 'true') {
      const analyticsService = req.app.get('analyticsService');
      analytics = await analyticsService.getAttendanceAnalytics(
        studentId, 
        startDate && endDate ? { startDate, endDate } : null
      );
    }

    res.json({
      success: true,
      data: {
        records: attendanceRecords,
        analytics,
        total: attendanceRecords.length
      }
    });

  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance records',
      error: error.message
    });
  }
});

// Mark attendance with real-time updates
router.post('/mark', async (req, res) => {
  try {
    const { studentId, subjectId, date, status, remarks } = req.body;
    const facultyId = req.user.facultyId; // Assuming faculty is marking attendance

    // Validate required fields
    if (!studentId || !subjectId || !date || !status) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: studentId, subjectId, date, status'
      });
    }

    // Check if attendance already marked for this student-subject-date
    const existingAttendance = await db.Attendance.findOne({
      where: { studentId, subjectId, date }
    });

    let attendanceRecord;
    
    if (existingAttendance) {
      // Update existing record
      await existingAttendance.update({
        status,
        markedBy: facultyId,
        remarks,
        timestamp: new Date()
      });
      attendanceRecord = existingAttendance;
    } else {
      // Create new record
      attendanceRecord = await db.Attendance.create({
        studentId,
        subjectId,
        facultyId,
        date,
        status,
        markedBy: facultyId,
        remarks,
        timestamp: new Date()
      });
    }

    // Get student and subject details for notification
    const student = await db.Student.findByPk(studentId, {
      include: [{ model: db.User, attributes: ['firstName', 'lastName'] }]
    });
    
    const subject = await db.Course.findByPk(subjectId);

    // Send real-time updates
    const io = req.app.get('io');
    const notificationService = req.app.get('notificationService');

    // Broadcast attendance update
    await notificationService.sendAttendanceUpdate({
      studentId,
      subjectId,
      section: student.Section,
      department: student.Department,
      status,
      date,
      studentName: `${student.User.firstName} ${student.User.lastName}`,
      subjectName: subject.courseName
    });

    // Send notification to student if absent
    if (status === 'absent') {
      await notificationService.sendToUser(student.userId, {
        title: 'Attendance Alert',
        message: `You were marked absent for ${subject.courseName} on ${date}`,
        type: 'warning',
        priority: 'medium'
      });
    }

    res.json({
      success: true,
      message: 'Attendance marked successfully',
      data: {
        id: attendanceRecord.id,
        studentId,
        subjectId,
        date,
        status,
        timestamp: attendanceRecord.timestamp
      }
    });

  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark attendance',
      error: error.message
    });
  }
});

// Get student-specific attendance records
router.get('/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { 
      startDate, 
      endDate, 
      includeAnalytics = false,
      limit = 50
    } = req.query;

    // For demo purposes, generate mock data specific to this student
    const { generateStudentSpecificData } = require('../utils/mockDataGenerator');
    const mockData = generateStudentSpecificData(studentId, studentId);

    // Use mock attendance data
    let attendanceRecords = mockData.attendance;
    
    // Apply date filter if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      attendanceRecords = attendanceRecords.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= start && recordDate <= end;
      });
    }
    
    // Apply limit
    attendanceRecords = attendanceRecords.slice(0, parseInt(limit));

    // Calculate attendance statistics
    const totalClasses = attendanceRecords.length;
    const presentClasses = attendanceRecords.filter(record => record.status === 'present').length;
    const attendancePercentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;

    let analytics = null;
    if (includeAnalytics === 'true') {
      analytics = {
        weeklyTrend: attendanceRecords.slice(0, 7),
        subjectWise: mockData.statistics,
        recommendations: ['Attend more Mathematics classes', 'Good attendance in Data Structures']
      };
    }

    res.json({
      success: true,
      data: {
        records: attendanceRecords,
        statistics: {
          totalClasses,
          presentClasses,
          absentClasses: totalClasses - presentClasses,
          attendancePercentage
        },
        analytics,
        total: attendanceRecords.length
      }
    });

  } catch (error) {
    console.error('Get student attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student attendance records',
      error: error.message
    });
  }
});

module.exports = router;
