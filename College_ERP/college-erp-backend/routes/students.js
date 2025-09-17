const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Student, Faculty, Attendance, Course, Enrollment, AIAnalytics } = require('../models');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { facultyStudentAccessControl, validateStudentAccess } = require('../middleware/facultyAccessControl');
const CredentialGenerator = require('../utils/credentialGenerator');
const ProfilePhotoHelper = require('../utils/profilePhotoHelper');
const NotificationService = require('../services/NotificationService');
const { Op } = require('sequelize');

/**
 * @route GET /api/students
 * @desc Get all students (admin) or accessible students (faculty)
 * @access Private (Admin, Faculty)
 */
router.get('/', 
  authenticateToken, 
  authorizeRoles(['admin', 'faculty']), 
  facultyStudentAccessControl,
  async (req, res) => {
    try {
      const { 
        page = 1, 
        limit = 50, 
        search, 
        department, 
        section, 
        semester,
        status = 'active' 
      } = req.query;
      
      const offset = (page - 1) * limit;
      let whereClause = {};
      
      // Apply search filter
      if (search) {
        whereClause[Op.or] = [
          { Full_Name: { [Op.iLike]: `%${search}%` } },
          { Student_ID: { [Op.iLike]: `%${search}%` } },
          { Email_ID: { [Op.iLike]: `%${search}%` } },
          { Enrollment_No: { [Op.iLike]: `%${search}%` } },
          { Roll_No: { [Op.iLike]: `%${search}%` } }
        ];
      }
      
      // Apply filters
      if (department) whereClause.Department = department;
      if (section) whereClause.Section = section;
      if (semester) whereClause.Semester = parseInt(semester);
      if (status) whereClause.accountStatus = status;
      
      let students;
      let totalCount;
      
      if (req.user.role === 'faculty' && req.getAccessibleStudents) {
        // Faculty can only see their assigned students
        students = await req.getAccessibleStudents(whereClause);
        totalCount = students.length;
        
        // Apply pagination manually for faculty
        students = students.slice(offset, offset + parseInt(limit));
      } else {
        // Admin can see all students
        students = await Student.findAndCountAll({
          where: whereClause,
          limit: parseInt(limit),
          offset: offset,
          order: [['Full_Name', 'ASC']],
          attributes: { exclude: ['password'] } // Don't send passwords
        });
        
        totalCount = students.count;
        students = students.rows;
      }
      
      // Add profile photos to all students
      const studentsWithPhotos = ProfilePhotoHelper.addStudentProfilePhotos(students);
      
      res.json({
        success: true,
        data: {
          students: studentsWithPhotos,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
            limit: parseInt(limit)
          }
        }
      });
      
    } catch (error) {
      console.error('Get students error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch students',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route GET /api/students/:id
 * @desc Get single student details
 * @access Private (Admin, Faculty with access, Student themselves)
 */
router.get('/:id', 
  authenticateToken, 
  facultyStudentAccessControl,
  validateStudentAccess,
  async (req, res) => {
    try {
      const studentId = req.params.id;
      
      // Students can only view their own profile
      if (req.user.role === 'student' && req.user.id !== studentId) {
        return res.status(403).json({
          success: false,
          message: 'You can only view your own profile'
        });
      }
      
      const student = await Student.findByPk(studentId, {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: Attendance,
            limit: 10,
            order: [['date', 'DESC']]
          },
          {
            model: Enrollment,
            include: [
              {
                model: Course,
                attributes: ['courseName', 'courseCode', 'credits']
              }
            ]
          }
        ]
      });
      
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }
      
      // Get AI analytics if available
      const aiAnalytics = await AIAnalytics.findOne({
        where: { 
          studentId: studentId,
          isActive: true
        },
        order: [['createdAt', 'DESC']]
      });
      
      // Add profile photo to student data
      const studentWithPhoto = ProfilePhotoHelper.addStudentProfilePhoto(student);
      
      res.json({
        success: true,
        data: {
          student: studentWithPhoto,
          aiAnalytics
        }
      });
      
    } catch (error) {
      console.error('Get student error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch student details',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route POST /api/students
 * @desc Create new student with unique credentials
 * @access Private (Admin only)
 */
router.post('/', 
  authenticateToken, 
  authorizeRoles(['admin']), 
  async (req, res) => {
    try {
      const studentData = req.body;
      
      // Validate required fields
      const requiredFields = ['Full_Name', 'Department', 'Section', 'Batch/Year'];
      for (const field of requiredFields) {
        if (!studentData[field]) {
          return res.status(400).json({
            success: false,
            message: `${field} is required`
          });
        }
      }
      
      // Generate unique credentials
      const credentials = await CredentialGenerator.generateCompleteStudentCredentials(studentData);
      
      // Validate credentials are unique
      const validation = await CredentialGenerator.validateUniqueCredentials('student', {
        Student_ID: credentials.Student_ID,
        Email_ID: credentials.Email_ID,
        Enrollment_No: credentials.Enrollment_No,
        Roll_No: credentials.Roll_No
      });
      
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Credential validation failed',
          errors: validation.errors
        });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(credentials.password, 10);
      
      // Prepare student data with credentials
      const completeStudentData = {
        ...studentData,
        ...credentials,
        password: hashedPassword,
        role: 'student',
        isActive: true,
        accountStatus: 'active'
      };
      
      // Create student
      const student = await Student.create(completeStudentData);
      
      // Send notification (you could also send email with credentials)
      const notificationService = new NotificationService(req.app.get('io'));
      await notificationService.sendToRole('admin', {
        type: 'info',
        title: 'New Student Created',
        message: `Student ${student.Full_Name} (${student.Student_ID}) has been successfully created.`,
        priority: 'medium'
      });
      
      // Return student data without password
      const { password: _, ...studentResponse } = student.toJSON();
      
      res.status(201).json({
        success: true,
        message: 'Student created successfully',
        data: {
          student: studentResponse,
          credentials: {
            studentId: credentials.Student_ID,
            email: credentials.Email_ID,
            enrollmentNo: credentials.Enrollment_No,
            rollNo: credentials.Roll_No,
            temporaryPassword: credentials.password // Send this only on creation
          }
        }
      });
      
    } catch (error) {
      console.error('Create student error:', error);
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          success: false,
          message: 'Student with this credential already exists',
          field: error.errors[0]?.path
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to create student',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route PUT /api/students/:id
 * @desc Update student details
 * @access Private (Admin, Student themselves for limited fields)
 */
router.put('/:id', 
  authenticateToken,
  facultyStudentAccessControl,
  async (req, res) => {
    try {
      const studentId = req.params.id;
      const updateData = req.body;
      
      const student = await Student.findByPk(studentId);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }
      
      // Define allowed fields for each role
      const allowedFields = {
        admin: ['Full_Name', 'Contact_No', 'Address', 'City', 'State', 'PIN', 
               'Parent/Guardian_Name', 'Parent_Contact_No', 'Department', 
               'Section', 'Semester', 'accountStatus', 'isActive'],
        student: ['Contact_No', 'Address', 'City', 'State', 'PIN', 'profilePicture'],
        faculty: [] // Faculty cannot update student details directly
      };
      
      // Students can only update their own profile
      if (req.user.role === 'student' && req.user.id !== studentId) {
        return res.status(403).json({
          success: false,
          message: 'You can only update your own profile'
        });
      }
      
      // Faculty cannot update students (only view)
      if (req.user.role === 'faculty') {
        return res.status(403).json({
          success: false,
          message: 'Faculty cannot update student details'
        });
      }
      
      const userAllowedFields = allowedFields[req.user.role] || [];
      const filteredUpdateData = {};
      
      // Filter update data based on user role
      for (const [key, value] of Object.entries(updateData)) {
        if (userAllowedFields.includes(key)) {
          filteredUpdateData[key] = value;
        }
      }
      
      if (Object.keys(filteredUpdateData).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid fields provided for update'
        });
      }
      
      // Update student
      await student.update(filteredUpdateData);
      
      // Send notification for significant updates (admin only)
      if (req.user.role === 'admin' && (filteredUpdateData.Department || filteredUpdateData.Section)) {
        const notificationService = new NotificationService(req.app.get('io'));
        await notificationService.sendToUser(studentId, {
          type: 'info',
          title: 'Profile Updated',
          message: 'Your profile has been updated by the administration.',
          priority: 'medium'
        });
      }
      
      // Return updated student without password
      const { password: _, ...studentResponse } = student.toJSON();
      
      res.json({
        success: true,
        message: 'Student updated successfully',
        data: { student: studentResponse }
      });
      
    } catch (error) {
      console.error('Update student error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update student',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route DELETE /api/students/:id
 * @desc Delete/deactivate student
 * @access Private (Admin only)
 */
router.delete('/:id', 
  authenticateToken, 
  authorizeRoles(['admin']), 
  async (req, res) => {
    try {
      const studentId = req.params.id;
      const { permanent = false } = req.query;
      
      const student = await Student.findByPk(studentId);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }
      
      if (permanent) {
        // Permanent deletion (use with caution)
        await student.destroy();
        
        res.json({
          success: true,
          message: 'Student permanently deleted'
        });
      } else {
        // Soft delete - deactivate account
        await student.update({
          isActive: false,
          accountStatus: 'suspended'
        });
        
        res.json({
          success: true,
          message: 'Student account deactivated'
        });
      }
      
    } catch (error) {
      console.error('Delete student error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete student',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route POST /api/students/:id/reset-password
 * @desc Reset student password
 * @access Private (Admin only)
 */
router.post('/:id/reset-password', 
  authenticateToken, 
  authorizeRoles(['admin']), 
  async (req, res) => {
    try {
      const studentId = req.params.id;
      const { newPassword } = req.body;
      
      const student = await Student.findByPk(studentId);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }
      
      // Generate new password if not provided
      const password = newPassword || CredentialGenerator.generatePassword();
      const hashedPassword = await bcrypt.hash(password, 10);
      
      await student.update({ password: hashedPassword });
      
      // Send notification to student
      const notificationService = new NotificationService(req.app.get('io'));
      await notificationService.sendToUser(studentId, {
        type: 'warning',
        title: 'Password Reset',
        message: 'Your password has been reset by the administration. Please change it after login.',
        priority: 'high'
      });
      
      res.json({
        success: true,
        message: 'Password reset successfully',
        data: {
          temporaryPassword: password // Only send this to admin
        }
      });
      
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reset password',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route GET /api/students/stats/summary
 * @desc Get student statistics
 * @access Private (Admin, Faculty with access)
 */
router.get('/stats/summary', 
  authenticateToken, 
  authorizeRoles(['admin', 'faculty']),
  facultyStudentAccessControl,
  async (req, res) => {
    try {
      let whereClause = {};
      
      if (req.user.role === 'faculty' && req.facultyAccess) {
        // Faculty stats for their accessible students
        const sectionDeptFilter = [];
        
        if (req.facultyAccess.sections.length > 0) {
          sectionDeptFilter.push({
            Section: { [Op.in]: req.facultyAccess.sections }
          });
        }
        
        if (req.facultyAccess.departments.length > 0) {
          sectionDeptFilter.push({
            Department: { [Op.in]: req.facultyAccess.departments }
          });
        }
        
        if (sectionDeptFilter.length > 0) {
          whereClause[Op.or] = sectionDeptFilter;
        }
      }
      
      const [totalStudents, activeStudents, departments, sections] = await Promise.all([
        Student.count({ where: whereClause }),
        Student.count({ where: { ...whereClause, accountStatus: 'active' } }),
        Student.findAll({
          where: whereClause,
          attributes: ['Department', [Student.sequelize.fn('COUNT', '*'), 'count']],
          group: ['Department'],
          order: [[Student.sequelize.literal('count'), 'DESC']]
        }),
        Student.findAll({
          where: whereClause,
          attributes: ['Section', [Student.sequelize.fn('COUNT', '*'), 'count']],
          group: ['Section'],
          order: ['Section']
        })
      ]);
      
      res.json({
        success: true,
        data: {
          totalStudents,
          activeStudents,
          suspendedStudents: totalStudents - activeStudents,
          departmentBreakdown: departments,
          sectionBreakdown: sections
        }
      });
      
    } catch (error) {
      console.error('Student stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch student statistics',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

module.exports = router;