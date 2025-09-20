const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Assignment, Student, Faculty, Course } = require('../models');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { Op } = require('sequelize');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads/assignments');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `assignment_${req.user?.id || 'user'}_${uniqueSuffix}_${sanitizedFilename}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow PDF, DOC, DOCX files
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed!'));
    }
  }
});

/**
 * @route GET /api/assignments
 * @desc Get assignments with filters
 * @access Private
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { studentId, courseId, status, limit = 50, page = 1 } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = {};
    
    // If user is student, only show their assignments
    if (req.user.role === 'student') {
      whereClause.studentId = req.user.id;
    } else if (studentId) {
      whereClause.studentId = studentId;
    }
    
    if (courseId) whereClause.courseId = courseId;
    if (status) whereClause.status = status;
    
    const assignments = await Assignment.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Course,
          attributes: ['courseName', 'courseCode']
        },
        {
          model: Student,
          attributes: ['Full_Name', 'Student_ID']
        },
        {
          model: Faculty,
          attributes: ['Full_Name', 'Faculty_ID']
        }
      ],
      order: [['dueDate', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json({
      success: true,
      data: {
        assignments: assignments.rows,
        pagination: {
          total: assignments.count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(assignments.count / limit)
        }
      }
    });
    
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assignments',
      error: error.message
    });
  }
});

/**
 * @route GET /api/assignments/student/:studentId
 * @desc Get assignments for a specific student
 * @access Private
 */
router.get('/student/:studentId', authenticateToken, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { status, courseId, limit = 50 } = req.query;
    
    // Students can only view their own assignments
    if (req.user.role === 'student' && req.user.id !== studentId) {
      return res.status(403).json({
        success: false,
        message: 'You can only view your own assignments'
      });
    }
    
    let whereClause = { studentId };
    if (status) whereClause.status = status;
    if (courseId) whereClause.courseId = courseId;
    
    // For demo purposes, generate mock data specific to this student
    const { generateStudentSpecificData } = require('../utils/mockDataGenerator');
    const mockData = generateStudentSpecificData(studentId, studentId);
    
    // Use mock assignments data
    let assignments = mockData.assignments;
    
    // Apply filters
    if (status) {
      assignments = assignments.filter(a => a.status === status);
    }
    
    assignments = assignments.slice(0, parseInt(limit));
    
    // Calculate assignment statistics
    const totalAssignments = assignments.length;
    const pendingAssignments = assignments.filter(a => a.status === 'pending').length;
    const submittedAssignments = assignments.filter(a => a.status === 'submitted').length;
    const gradedAssignments = assignments.filter(a => a.status === 'graded').length;
    
    res.json({
      success: true,
      data: {
        assignments: assignments,
        statistics: {
          total: totalAssignments,
          pending: pendingAssignments,
          submitted: submittedAssignments,
          graded: gradedAssignments
        }
      }
    });
    
  } catch (error) {
    console.error('Get student assignments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student assignments',
      error: error.message
    });
  }
});

/**
 * @route POST /api/assignments
 * @desc Create new assignment (Faculty/Admin only)
 * @access Private
 */
router.post('/', 
  authenticateToken,
  authorizeRoles(['admin', 'faculty']),
  async (req, res) => {
    try {
      const {
        title,
        description,
        courseId,
        dueDate,
        maxMarks,
        studentIds = []
      } = req.body;
      
      // Validate required fields
      if (!title || !description || !courseId || !dueDate) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: title, description, courseId, dueDate'
        });
      }
      
      // Create assignment for each student
      const assignmentPromises = studentIds.map(studentId => 
        Assignment.create({
          title,
          description,
          courseId,
          studentId,
          assignedBy: req.user.id,
          dueDate,
          maxMarks: maxMarks || 100,
          status: 'pending',
          assignedDate: new Date()
        })
      );
      
      const createdAssignments = await Promise.all(assignmentPromises);
      
      res.status(201).json({
        success: true,
        message: 'Assignments created successfully',
        data: {
          assignments: createdAssignments,
          count: createdAssignments.length
        }
      });
      
    } catch (error) {
      console.error('Create assignment error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create assignment',
        error: error.message
      });
    }
  }
);

/**
 * @route PUT /api/assignments/:id/submit
 * @desc Submit assignment (Student only)
 * @access Private
 */
router.put('/:id/submit',
  authenticateToken,
  authorizeRoles(['student']),
  upload.single('assignmentFile'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { submissionText } = req.body;
      const submissionFile = req.file;
      
      const assignment = await Assignment.findByPk(id);
      if (!assignment) {
        return res.status(404).json({
          success: false,
          message: 'Assignment not found'
        });
      }
      
      // Students can only submit their own assignments
      if (assignment.studentId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'You can only submit your own assignments'
        });
      }
      
      // Check if assignment is already submitted
      if (assignment.status === 'submitted' || assignment.submitted) {
        return res.status(400).json({
          success: false,
          message: 'Assignment has already been submitted'
        });
      }
      
      // Check if assignment is past due date (allow late submission with warning)
      const isLate = new Date() > new Date(assignment.dueDate);
      
      // Prepare update data
      const updateData = {
        submissionText: submissionText || null,
        submittedDate: new Date(),
        submitted: true,
        status: 'submitted'
      };
      
      // Add file path if file was uploaded
      if (submissionFile) {
        updateData.submissionFile = submissionFile.path;
      }
      
      await assignment.update(updateData);
      
      res.json({
        success: true,
        message: isLate ? 
          'Assignment submitted successfully (late submission)' : 
          'Assignment submitted successfully',
        data: { 
          assignment,
          isLate,
          submissionFile: submissionFile ? {
            originalName: submissionFile.originalname,
            fileName: submissionFile.filename,
            size: submissionFile.size
          } : null
        }
      });
      
    } catch (error) {
      console.error('Submit assignment error:', error);
      
      // Clean up uploaded file on error
      if (req.file && req.file.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (cleanupError) {
          console.error('Error cleaning up file:', cleanupError);
        }
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to submit assignment',
        error: error.message
      });
    }
  }
);

/**
 * @route GET /api/assignments/:id/download/:type
 * @desc Download assignment files (question or submission)
 * @access Private
 */
router.get('/:id/download/:type', authenticateToken, async (req, res) => {
  try {
    const { id, type } = req.params; // type: 'question' or 'submission'
    
    const assignment = await Assignment.findByPk(id);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }
    
    // Check permissions
    const isStudent = req.user.role === 'student';
    const isFaculty = req.user.role === 'faculty' || req.user.role === 'admin';
    
    if (isStudent && assignment.studentId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    let filePath;
    if (type === 'question' && assignment.pdfUrl) {
      filePath = assignment.pdfUrl;
    } else if (type === 'submission' && assignment.submissionFile) {
      filePath = assignment.submissionFile;
    } else {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server'
      });
    }
    
    // Set appropriate headers
    const fileName = path.basename(filePath);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('Download file error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download file',
      error: error.message
    });
  }
});

/**
 * @route GET /api/assignments/:id/details
 * @desc Get detailed assignment information
 * @access Private
 */
router.get('/:id/details', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const assignment = await Assignment.findByPk(id, {
      include: [
        {
          model: Course,
          attributes: ['courseName', 'courseCode']
        },
        {
          model: Student,
          attributes: ['Full_Name', 'Student_ID', 'Email_ID']
        },
        {
          model: Faculty,
          attributes: ['Full_Name', 'Faculty_ID'],
          as: 'AssignedBy'
        }
      ]
    });
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }
    
    // Check permissions
    const isStudent = req.user.role === 'student';
    if (isStudent && assignment.studentId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    res.json({
      success: true,
      data: { assignment }
    });
    
  } catch (error) {
    console.error('Get assignment details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get assignment details',
      error: error.message
    });
  }
});

module.exports = router;
