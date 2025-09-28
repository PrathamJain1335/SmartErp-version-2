const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

/**
 * @route GET /api/timetable/student/:studentId
 * @desc Get timetable for a specific student
 * @access Private
 */
router.get('/student/:studentId', authenticateToken, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { week, semester } = req.query;
    
    // Students can only view their own timetable
    if (req.user.role === 'student' && req.user.id !== studentId) {
      return res.status(403).json({
        success: false,
        message: 'You can only view your own timetable'
      });
    }
    
    // Mock timetable data for demo
    const mockTimetable = [
      {
        id: 1,
        day: 'Monday',
        time: '09:00-10:00',
        subject: 'Data Structures',
        faculty: 'Dr. Amit Sharma',
        room: 'CS-101',
        type: 'Lecture'
      },
      {
        id: 2,
        day: 'Monday',
        time: '10:00-11:00',
        subject: 'Mathematics-III',
        faculty: 'Dr. Priya Agarwal',
        room: 'MA-201',
        type: 'Lecture'
      },
      {
        id: 3,
        day: 'Monday',
        time: '11:15-12:15',
        subject: 'Data Structures Lab',
        faculty: 'Prof. Rahul Gupta',
        room: 'CS-Lab-1',
        type: 'Lab'
      },
      {
        id: 4,
        day: 'Tuesday',
        time: '09:00-10:00',
        subject: 'Database Management',
        faculty: 'Dr. Neha Singh',
        room: 'CS-102',
        type: 'Lecture'
      },
      {
        id: 5,
        day: 'Tuesday',
        time: '10:00-11:00',
        subject: 'Operating Systems',
        faculty: 'Prof. Vikash Kumar',
        room: 'CS-103',
        type: 'Lecture'
      },
      {
        id: 6,
        day: 'Wednesday',
        time: '09:00-10:00',
        subject: 'Computer Networks',
        faculty: 'Dr. Anjali Sharma',
        room: 'CS-104',
        type: 'Lecture'
      },
      {
        id: 7,
        day: 'Wednesday',
        time: '11:15-12:15',
        subject: 'DBMS Lab',
        faculty: 'Prof. Suresh Patel',
        room: 'CS-Lab-2',
        type: 'Lab'
      },
      {
        id: 8,
        day: 'Thursday',
        time: '09:00-10:00',
        subject: 'Software Engineering',
        faculty: 'Dr. Kavita Jain',
        room: 'CS-105',
        type: 'Lecture'
      },
      {
        id: 9,
        day: 'Thursday',
        time: '14:00-15:00',
        subject: 'Project Work',
        faculty: 'Prof. Manoj Verma',
        room: 'CS-106',
        type: 'Project'
      },
      {
        id: 10,
        day: 'Friday',
        time: '09:00-10:00',
        subject: 'Web Development',
        faculty: 'Prof. Ravi Sharma',
        room: 'CS-107',
        type: 'Lecture'
      }
    ];
    
    res.json({
      success: true,
      data: {
        timetable: mockTimetable,
        studentInfo: {
          studentId,
          semester: semester || 'Current',
          section: 'A',
          department: 'Computer Science Engineering'
        },
        total: mockTimetable.length
      }
    });
    
  } catch (error) {
    console.error('Get student timetable error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student timetable',
      error: error.message
    });
  }
});

/**
 * @route GET /api/timetable/faculty/:facultyId
 * @desc Get timetable for a specific faculty
 * @access Private
 */
router.get('/faculty/:facultyId', authenticateToken, async (req, res) => {
  try {
    const { facultyId } = req.params;
    
    // Faculty can only view their own timetable unless admin
    if (req.user.role === 'faculty' && req.user.id !== facultyId) {
      return res.status(403).json({
        success: false,
        message: 'You can only view your own timetable'
      });
    }
    
    // Mock faculty timetable
    const mockFacultyTimetable = [
      {
        id: 1,
        day: 'Monday',
        time: '09:00-10:00',
        subject: 'Data Structures',
        section: 'CSE-A',
        room: 'CS-101',
        type: 'Lecture'
      },
      {
        id: 2,
        day: 'Tuesday',
        time: '10:00-11:00',
        subject: 'Data Structures',
        section: 'CSE-B',
        room: 'CS-102',
        type: 'Lecture'
      },
      {
        id: 3,
        day: 'Wednesday',
        time: '11:15-12:15',
        subject: 'Data Structures Lab',
        section: 'CSE-A',
        room: 'CS-Lab-1',
        type: 'Lab'
      }
    ];
    
    res.json({
      success: true,
      data: {
        timetable: mockFacultyTimetable,
        facultyInfo: {
          facultyId,
          name: 'Dr. Amit Sharma',
          department: 'Computer Science Engineering'
        },
        total: mockFacultyTimetable.length
      }
    });
    
  } catch (error) {
    console.error('Get faculty timetable error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch faculty timetable',
      error: error.message
    });
  }
});

module.exports = router;