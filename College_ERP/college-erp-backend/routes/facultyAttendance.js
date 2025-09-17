const express = require('express');
const router = express.Router();
const { Faculty, FacultyAttendance } = require('../models');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const DataSyncService = require('../services/DataSyncService');
const NotificationService = require('../services/NotificationService');
const { Op } = require('sequelize');

/**
 * @route GET /api/faculty-attendance
 * @desc Get faculty attendance records
 * @access Private (Admin, Faculty for own records)
 */
router.get('/', 
  authenticateToken,
  async (req, res) => {
    try {
      const { 
        facultyId, 
        startDate, 
        endDate, 
        status,
        page = 1,
        limit = 50 
      } = req.query;
      
      const offset = (page - 1) * limit;
      let whereClause = {};
      
      // Faculty can only see their own attendance
      if (req.user.role === 'faculty') {
        whereClause.facultyId = req.user.id;
      } else if (facultyId) {
        whereClause.facultyId = facultyId;
      }
      
      // Date range filter
      if (startDate && endDate) {
        whereClause.date = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      } else if (startDate) {
        whereClause.date = {
          [Op.gte]: new Date(startDate)
        };
      } else if (endDate) {
        whereClause.date = {
          [Op.lte]: new Date(endDate)
        };
      }
      
      // Status filter
      if (status) {
        whereClause.status = status;
      }
      
      const attendanceRecords = await FacultyAttendance.findAndCountAll({
        where: whereClause,
        include: [{
          model: Faculty,
          attributes: ['Faculty_ID', 'Full_Name', 'Department', 'Designation']
        }],
        limit: parseInt(limit),
        offset: offset,
        order: [['date', 'DESC']]
      });
      
      // Calculate summary statistics
      const totalRecords = await FacultyAttendance.count({ where: whereClause });
      const presentCount = await FacultyAttendance.count({ 
        where: { ...whereClause, status: 'present' } 
      });
      const absentCount = await FacultyAttendance.count({ 
        where: { ...whereClause, status: 'absent' } 
      });
      const lateCount = await FacultyAttendance.count({ 
        where: { ...whereClause, status: 'late' } 
      });
      
      const summary = {
        total: totalRecords,
        present: presentCount,
        absent: absentCount,
        late: lateCount,
        attendancePercentage: totalRecords > 0 ? 
          ((presentCount + lateCount) / totalRecords * 100).toFixed(2) : 0
      };
      
      res.json({
        success: true,
        data: {
          records: attendanceRecords.rows,
          summary,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(attendanceRecords.count / limit),
            totalCount: attendanceRecords.count,
            limit: parseInt(limit)
          }
        }
      });
      
    } catch (error) {
      console.error('Get faculty attendance error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch faculty attendance',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route POST /api/faculty-attendance/mark
 * @desc Mark faculty attendance
 * @access Private (Admin, Faculty for own attendance)
 */
router.post('/mark', 
  authenticateToken,
  async (req, res) => {
    try {
      const { 
        facultyId, 
        date, 
        checkIn, 
        checkOut, 
        status = 'present', 
        remarks,
        location 
      } = req.body;
      
      // Validate required fields
      if (!facultyId || !date) {
        return res.status(400).json({
          success: false,
          message: 'Faculty ID and date are required'
        });
      }
      
      // Check if user can mark this attendance
      if (req.user.role === 'faculty' && req.user.id !== facultyId) {
        return res.status(403).json({
          success: false,
          message: 'You can only mark your own attendance'
        });
      }
      
      // Verify faculty exists
      const faculty = await Faculty.findByPk(facultyId);
      if (!faculty) {
        return res.status(404).json({
          success: false,
          message: 'Faculty not found'
        });
      }
      
      // Check if attendance already marked for this date
      const existingRecord = await FacultyAttendance.findOne({
        where: {
          facultyId,
          date: new Date(date)
        }
      });
      
      let attendanceRecord;
      
      // Calculate working hours if both check-in and check-out provided
      let workingHours = null;
      if (checkIn && checkOut) {
        const checkInTime = new Date(`2000-01-01 ${checkIn}`);
        const checkOutTime = new Date(`2000-01-01 ${checkOut}`);
        workingHours = (checkOutTime - checkInTime) / (1000 * 60 * 60); // Hours
      }
      
      const attendanceData = {
        facultyId,
        date: new Date(date),
        checkIn: checkIn || null,
        checkOut: checkOut || null,
        status,
        workingHours,
        markedBy: req.user.role === 'admin' ? req.user.id : null,
        remarks: remarks || null,
        location: location || null,
        isAutoMarked: req.user.role === 'faculty'
      };
      
      if (existingRecord) {
        // Update existing record
        await existingRecord.update(attendanceData);
        attendanceRecord = existingRecord;
      } else {
        // Create new record
        attendanceRecord = await FacultyAttendance.create(attendanceData);
      }
      
      // Update faculty attendance percentage
      await this.updateFacultyAttendancePercentage(facultyId);
      
      // Send real-time notification
      const dataSyncService = req.app.get('dataSyncService');
      if (dataSyncService) {
        dataSyncService.syncFacultyAttendanceUpdate({
          facultyId,
          date: date,
          status,
          workingHours,
          markedBy: req.user.id,
          department: faculty.Department
        });
      }
      
      // Send notification to faculty if marked by admin
      if (req.user.role === 'admin' && req.user.id !== facultyId) {
        const notificationService = req.app.get('notificationService');
        await notificationService.sendToUser(facultyId, {
          type: 'info',
          title: 'Attendance Marked',
          message: `Your attendance for ${date} has been marked as ${status}`,
          priority: 'medium'
        });
      }
      
      res.json({
        success: true,
        message: existingRecord ? 'Attendance updated successfully' : 'Attendance marked successfully',
        data: {
          record: attendanceRecord
        }
      });
      
    } catch (error) {
      console.error('Mark faculty attendance error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark attendance',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route GET /api/faculty-attendance/stats/:facultyId
 * @desc Get faculty attendance statistics
 * @access Private (Admin, Faculty for own stats)
 */
router.get('/stats/:facultyId', 
  authenticateToken,
  async (req, res) => {
    try {
      const { facultyId } = req.params;
      const { period = '30' } = req.query; // days
      
      // Check access permissions
      if (req.user.role === 'faculty' && req.user.id !== facultyId) {
        return res.status(403).json({
          success: false,
          message: 'You can only view your own statistics'
        });
      }
      
      // Get faculty details
      const faculty = await Faculty.findByPk(facultyId);
      if (!faculty) {
        return res.status(404).json({
          success: false,
          message: 'Faculty not found'
        });
      }
      
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(period));
      
      // Get attendance records for the period
      const attendanceRecords = await FacultyAttendance.findAll({
        where: {
          facultyId,
          date: {
            [Op.between]: [startDate, endDate]
          }
        },
        order: [['date', 'ASC']]
      });
      
      // Calculate statistics
      const totalDays = attendanceRecords.length;
      const presentDays = attendanceRecords.filter(r => r.status === 'present').length;
      const absentDays = attendanceRecords.filter(r => r.status === 'absent').length;
      const lateDays = attendanceRecords.filter(r => r.status === 'late').length;
      const halfDays = attendanceRecords.filter(r => r.status === 'half_day').length;
      
      const attendancePercentage = totalDays > 0 ? 
        ((presentDays + lateDays + halfDays * 0.5) / totalDays * 100) : 0;
      
      // Calculate average working hours
      const recordsWithHours = attendanceRecords.filter(r => r.workingHours);
      const avgWorkingHours = recordsWithHours.length > 0 ?
        recordsWithHours.reduce((sum, r) => sum + r.workingHours, 0) / recordsWithHours.length : 0;
      
      // Weekly pattern analysis
      const weeklyPattern = {};
      attendanceRecords.forEach(record => {
        const dayOfWeek = new Date(record.date).getDay();
        const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
        
        if (!weeklyPattern[dayName]) {
          weeklyPattern[dayName] = { total: 0, present: 0 };
        }
        
        weeklyPattern[dayName].total++;
        if (record.status === 'present' || record.status === 'late') {
          weeklyPattern[dayName].present++;
        }
      });
      
      // Convert to percentage
      Object.keys(weeklyPattern).forEach(day => {
        weeklyPattern[day].percentage = weeklyPattern[day].total > 0 ?
          (weeklyPattern[day].present / weeklyPattern[day].total * 100) : 0;
      });
      
      const stats = {
        faculty: {
          id: faculty.Faculty_ID,
          name: faculty.Full_Name,
          department: faculty.Department,
          designation: faculty.Designation
        },
        period: {
          days: parseInt(period),
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0]
        },
        summary: {
          totalDays,
          presentDays,
          absentDays,
          lateDays,
          halfDays,
          attendancePercentage: parseFloat(attendancePercentage.toFixed(2)),
          avgWorkingHours: parseFloat(avgWorkingHours.toFixed(2))
        },
        weeklyPattern,
        recentRecords: attendanceRecords.slice(-10).map(record => ({
          date: record.date,
          status: record.status,
          checkIn: record.checkIn,
          checkOut: record.checkOut,
          workingHours: record.workingHours
        }))
      };
      
      res.json({
        success: true,
        data: stats
      });
      
    } catch (error) {
      console.error('Get faculty attendance stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch attendance statistics',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route GET /api/faculty-attendance/summary
 * @desc Get overall faculty attendance summary (Admin only)
 * @access Private (Admin only)
 */
router.get('/summary', 
  authenticateToken,
  authorizeRoles(['admin']),
  async (req, res) => {
    try {
      const { department, period = '30' } = req.query;
      
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(period));
      
      let facultyWhereClause = {};
      if (department) {
        facultyWhereClause.Department = department;
      }
      
      // Get all faculty
      const facultyList = await Faculty.findAll({
        where: facultyWhereClause,
        attributes: ['Faculty_ID', 'Full_Name', 'Department', 'Designation']
      });
      
      // Get attendance records for the period
      const attendanceRecords = await FacultyAttendance.findAll({
        where: {
          date: {
            [Op.between]: [startDate, endDate]
          }
        },
        include: [{
          model: Faculty,
          where: facultyWhereClause,
          attributes: ['Faculty_ID', 'Full_Name', 'Department', 'Designation']
        }]
      });
      
      // Calculate summary for each faculty
      const facultySummary = facultyList.map(faculty => {
        const facultyRecords = attendanceRecords.filter(
          record => record.facultyId === faculty.Faculty_ID
        );
        
        const totalDays = facultyRecords.length;
        const presentDays = facultyRecords.filter(r => r.status === 'present').length;
        const absentDays = facultyRecords.filter(r => r.status === 'absent').length;
        const lateDays = facultyRecords.filter(r => r.status === 'late').length;
        
        const attendancePercentage = totalDays > 0 ?
          ((presentDays + lateDays) / totalDays * 100) : 0;
        
        return {
          faculty: {
            id: faculty.Faculty_ID,
            name: faculty.Full_Name,
            department: faculty.Department,
            designation: faculty.Designation
          },
          stats: {
            totalDays,
            presentDays,
            absentDays,
            lateDays,
            attendancePercentage: parseFloat(attendancePercentage.toFixed(2))
          }
        };
      });
      
      // Overall statistics
      const totalFaculty = facultyList.length;
      const avgAttendance = facultySummary.length > 0 ?
        facultySummary.reduce((sum, f) => sum + f.stats.attendancePercentage, 0) / facultySummary.length : 0;
      
      const departmentStats = {};
      facultySummary.forEach(f => {
        const dept = f.faculty.department;
        if (!departmentStats[dept]) {
          departmentStats[dept] = { faculty: 0, totalAttendance: 0 };
        }
        departmentStats[dept].faculty++;
        departmentStats[dept].totalAttendance += f.stats.attendancePercentage;
      });
      
      Object.keys(departmentStats).forEach(dept => {
        departmentStats[dept].avgAttendance = 
          departmentStats[dept].totalAttendance / departmentStats[dept].faculty;
      });
      
      res.json({
        success: true,
        data: {
          period: {
            days: parseInt(period),
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
          },
          overview: {
            totalFaculty,
            avgAttendancePercentage: parseFloat(avgAttendance.toFixed(2))
          },
          departmentStats,
          facultyDetails: facultySummary.sort((a, b) => 
            b.stats.attendancePercentage - a.stats.attendancePercentage
          )
        }
      });
      
    } catch (error) {
      console.error('Get faculty attendance summary error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch attendance summary',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * Helper function to update faculty attendance percentage
 */
async function updateFacultyAttendancePercentage(facultyId) {
  try {
    // Calculate attendance for current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const attendanceRecords = await FacultyAttendance.findAll({
      where: {
        facultyId,
        date: {
          [Op.gte]: startOfMonth
        }
      }
    });
    
    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter(r => 
      r.status === 'present' || r.status === 'late'
    ).length;
    
    const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 100;
    
    // Update faculty record
    await Faculty.update(
      { attendancePercentage: parseFloat(attendancePercentage.toFixed(2)) },
      { where: { Faculty_ID: facultyId } }
    );
    
  } catch (error) {
    console.error('Error updating faculty attendance percentage:', error);
  }
}

module.exports = router;