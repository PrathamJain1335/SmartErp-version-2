const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Faculty, Student, FacultyAttendance, Course, AIAnalytics } = require('../models');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { adminAssignSections } = require('../middleware/facultyAccessControl');
const CredentialGenerator = require('../utils/credentialGenerator');
const ProfilePhotoHelper = require('../utils/profilePhotoHelper');
const NotificationService = require('../services/NotificationService');
const { Op } = require('sequelize');

/**
 * @route GET /api/faculties
 * @desc Get all faculty members
 * @access Private (Admin only)
 */
router.get('/', 
  authenticateToken, 
  authorizeRoles(['admin']), 
  async (req, res) => {
    try {
      const { 
        page = 1, 
        limit = 50, 
        search, 
        department,
        status = 'active',
        designation 
      } = req.query;
      
      const offset = (page - 1) * limit;
      let whereClause = {};
      
      // Apply search filter
      if (search) {
        whereClause[Op.or] = [
          { Full_Name: { [Op.iLike]: `%${search}%` } },
          { Faculty_ID: { [Op.iLike]: `%${search}%` } },
          { Email_ID: { [Op.iLike]: `%${search}%` } },
          { employeeId: { [Op.iLike]: `%${search}%` } }
        ];
      }
      
      // Apply filters
      if (department) whereClause.Department = department;
      if (designation) whereClause.Designation = designation;
      if (status === 'active') whereClause.isActive = true;
      if (status === 'inactive') whereClause.isActive = false;
      
      const faculties = await Faculty.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: offset,
        order: [['Full_Name', 'ASC']],
        attributes: { exclude: ['password'] }, // Don't send passwords
        include: [
          {
            model: Course,
            attributes: ['courseName', 'courseCode', 'credits']
          },
          {
            model: FacultyAttendance,
            limit: 5,
            order: [['date', 'DESC']],
            attributes: ['date', 'status', 'workingHours']
          }
        ]
      });
      
      // Add profile photos to all faculty members
      const facultiesWithPhotos = ProfilePhotoHelper.addFacultyProfilePhotos(faculties.rows);
      
      res.json({
        success: true,
        data: {
          faculties: facultiesWithPhotos,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(faculties.count / limit),
            totalCount: faculties.count,
            limit: parseInt(limit)
          }
        }
      });
      
    } catch (error) {
      console.error('Get faculties error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch faculties',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route GET /api/faculties/:id
 * @desc Get single faculty details
 * @access Private (Admin, Faculty themselves)
 */
router.get('/:id', 
  authenticateToken, 
  async (req, res) => {
    try {
      const facultyId = req.params.id;
      
      // Faculty can only view their own profile unless admin
      if (req.user.role === 'faculty' && req.user.id !== facultyId) {
        return res.status(403).json({
          success: false,
          message: 'You can only view your own profile'
        });
      }
      
      const faculty = await Faculty.findByPk(facultyId, {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: Course,
            attributes: ['id', 'courseName', 'courseCode', 'credits', 'semester']
          },
          {
            model: FacultyAttendance,
            limit: 30,
            order: [['date', 'DESC']]
          }
        ]
      });
      
      if (!faculty) {
        return res.status(404).json({
          success: false,
          message: 'Faculty not found'
        });
      }
      
      // Get assigned students count
      const assignedSections = faculty.assignedSections || [];
      const assignedDepartments = faculty.assignedDepartments || [faculty.Department];
      
      let studentCount = 0;
      if (assignedSections.length > 0 || assignedDepartments.length > 0) {
        const whereClause = {};
        const sectionDeptFilter = [];
        
        if (assignedSections.length > 0) {
          sectionDeptFilter.push({
            Section: { [Op.in]: assignedSections }
          });
        }
        
        if (assignedDepartments.length > 0) {
          sectionDeptFilter.push({
            Department: { [Op.in]: assignedDepartments }
          });
        }
        
        if (sectionDeptFilter.length > 0) {
          whereClause[Op.or] = sectionDeptFilter;
        }
        
        studentCount = await Student.count({ where: whereClause });
      }
      
      // Add profile photo to faculty data
      const facultyWithPhoto = ProfilePhotoHelper.addFacultyProfilePhoto(faculty);
      
      res.json({
        success: true,
        data: {
          faculty: facultyWithPhoto,
          assignedStudentsCount: studentCount
        }
      });
      
    } catch (error) {
      console.error('Get faculty error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch faculty details',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route POST /api/faculties
 * @desc Create new faculty with unique credentials
 * @access Private (Admin only)
 */
router.post('/', 
  authenticateToken, 
  authorizeRoles(['admin']), 
  async (req, res) => {
    try {
      const facultyData = req.body;
      
      // Validate required fields
      const requiredFields = ['Full_Name', 'Department', 'Designation'];
      for (const field of requiredFields) {
        if (!facultyData[field]) {
          return res.status(400).json({
            success: false,
            message: `${field} is required`
          });
        }
      }
      
      // Generate unique credentials
      const credentials = await CredentialGenerator.generateCompleteFacultyCredentials(facultyData);
      
      // Validate credentials are unique
      const validation = await CredentialGenerator.validateUniqueCredentials('faculty', {
        Faculty_ID: credentials.Faculty_ID,
        Email_ID: credentials.Email_ID,
        employeeId: credentials.employeeId
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
      
      // Prepare faculty data with credentials
      const completeFacultyData = {
        ...facultyData,
        ...credentials,
        password: hashedPassword,
        role: 'faculty',
        isActive: true
      };
      
      // Create faculty
      const faculty = await Faculty.create(completeFacultyData);
      
      // Send notification
      const notificationService = new NotificationService(req.app.get('io'));
      await notificationService.sendToRole('admin', {
        type: 'info',
        title: 'New Faculty Created',
        message: `Faculty ${faculty.Full_Name} (${faculty.Faculty_ID}) has been successfully created.`,
        priority: 'medium'
      });
      
      // Return faculty data without password
      const { password: _, ...facultyResponse } = faculty.toJSON();
      
      res.status(201).json({
        success: true,
        message: 'Faculty created successfully',
        data: {
          faculty: facultyResponse,
          credentials: {
            facultyId: credentials.Faculty_ID,
            email: credentials.Email_ID,
            employeeId: credentials.employeeId,
            temporaryPassword: credentials.password // Send this only on creation
          }
        }
      });
      
    } catch (error) {
      console.error('Create faculty error:', error);
      
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          success: false,
          message: 'Faculty with this credential already exists',
          field: error.errors[0]?.path
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to create faculty',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route PUT /api/faculties/:id
 * @desc Update faculty details
 * @access Private (Admin, Faculty themselves for limited fields)
 */
router.put('/:id', 
  authenticateToken,
  async (req, res) => {
    try {
      const facultyId = req.params.id;
      const updateData = req.body;
      
      const faculty = await Faculty.findByPk(facultyId);
      if (!faculty) {
        return res.status(404).json({
          success: false,
          message: 'Faculty not found'
        });
      }
      
      // Define allowed fields for each role
      const allowedFields = {
        admin: ['Full_Name', 'Contact_No', 'Email_ID', 'Address', 'Qualification', 
               'Designation', 'Department', 'Subjects_Assigned', 'assignedSections',
               'assignedDepartments', 'classAdvisorOf', 'isActive', 'officeRoom', 'officeHours'],
        faculty: ['Contact_No', 'Address', 'profilePicture', 'officeHours', 'researchInterests']
      };
      
      // Faculty can only update their own profile
      if (req.user.role === 'faculty' && req.user.id !== facultyId) {
        return res.status(403).json({
          success: false,
          message: 'You can only update your own profile'
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
      
      // Update faculty
      await faculty.update(filteredUpdateData);
      
      // Send notification for section assignment changes (admin only)
      if (req.user.role === 'admin' && filteredUpdateData.assignedSections) {
        const notificationService = new NotificationService(req.app.get('io'));
        await notificationService.sendToUser(facultyId, {
          type: 'info',
          title: 'Section Assignment Updated',
          message: 'Your section assignments have been updated by the administration.',
          priority: 'medium'
        });
        
        // Real-time update for faculty portal
        req.app.get('io').to(`user-${facultyId}`).emit('section-assignment-updated', {
          facultyId,
          newSections: filteredUpdateData.assignedSections
        });
      }
      
      // Return updated faculty without password
      const { password: _, ...facultyResponse } = faculty.toJSON();
      
      res.json({
        success: true,
        message: 'Faculty updated successfully',
        data: { faculty: facultyResponse }
      });
      
    } catch (error) {
      console.error('Update faculty error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update faculty',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route POST /api/faculties/:id/assign-sections
 * @desc Assign sections to faculty
 * @access Private (Admin only)
 */
router.post('/:id/assign-sections', 
  authenticateToken, 
  adminAssignSections,
  async (req, res) => {
    try {
      const facultyId = req.params.id;
      const { sections, departments, classAdvisorOf } = req.body;
      
      const faculty = await Faculty.findByPk(facultyId);
      if (!faculty) {
        return res.status(404).json({
          success: false,
          message: 'Faculty not found'
        });
      }
      
      // Update section assignments
      const updateData = {};
      if (sections) updateData.assignedSections = sections;
      if (departments) updateData.assignedDepartments = departments;
      if (classAdvisorOf !== undefined) updateData.classAdvisorOf = classAdvisorOf;
      
      await faculty.update(updateData);
      
      // Send notification to faculty
      const notificationService = new NotificationService(req.app.get('io'));
      await notificationService.sendToUser(facultyId, {
        type: 'info',
        title: 'Section Assignment Updated',
        message: `You have been assigned to sections: ${(sections || []).join(', ')}`,
        priority: 'high'
      });
      
      // Real-time update
      req.app.get('io').to(`user-${facultyId}`).emit('section-assignment-updated', {
        facultyId,
        assignedSections: sections,
        assignedDepartments: departments,
        classAdvisorOf
      });
      
      res.json({
        success: true,
        message: 'Section assignments updated successfully',
        data: {
          facultyId,
          assignedSections: sections,
          assignedDepartments: departments,
          classAdvisorOf
        }
      });
      
    } catch (error) {
      console.error('Assign sections error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to assign sections',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route GET /api/faculties/:id/assigned-students
 * @desc Get students assigned to faculty
 * @access Private (Admin, Faculty themselves)
 */
router.get('/:id/assigned-students', 
  authenticateToken,
  async (req, res) => {
    try {
      const facultyId = req.params.id;
      
      // Faculty can only view their own assigned students
      if (req.user.role === 'faculty' && req.user.id !== facultyId) {
        return res.status(403).json({
          success: false,
          message: 'You can only view your own assigned students'
        });
      }
      
      const faculty = await Faculty.findByPk(facultyId);
      if (!faculty) {
        return res.status(404).json({
          success: false,
          message: 'Faculty not found'
        });
      }
      
      const assignedSections = faculty.assignedSections || [];
      const assignedDepartments = faculty.assignedDepartments || [faculty.Department];
      
      const whereClause = {};
      const sectionDeptFilter = [];
      
      if (assignedSections.length > 0) {
        sectionDeptFilter.push({
          Section: { [Op.in]: assignedSections }
        });
      }
      
      if (assignedDepartments.length > 0) {
        sectionDeptFilter.push({
          Department: { [Op.in]: assignedDepartments }
        });
      }
      
      if (sectionDeptFilter.length > 0) {
        whereClause[Op.or] = sectionDeptFilter;
      }
      
      const students = await Student.findAll({
        where: whereClause,
        attributes: { exclude: ['password'] },
        order: [['Full_Name', 'ASC']]
      });
      
      res.json({
        success: true,
        data: {
          students,
          facultyInfo: {
            facultyId: faculty.Faculty_ID,
            name: faculty.Full_Name,
            assignedSections,
            assignedDepartments
          }
        }
      });
      
    } catch (error) {
      console.error('Get assigned students error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch assigned students',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route GET /api/faculties/stats/summary
 * @desc Get faculty statistics
 * @access Private (Admin only)
 */
router.get('/stats/summary', 
  authenticateToken, 
  authorizeRoles(['admin']),
  async (req, res) => {
    try {
      const [totalFaculty, activeFaculty, departments, designations] = await Promise.all([
        Faculty.count(),
        Faculty.count({ where: { isActive: true } }),
        Faculty.findAll({
          attributes: ['Department', [Faculty.sequelize.fn('COUNT', '*'), 'count']],
          group: ['Department'],
          order: [[Faculty.sequelize.literal('count'), 'DESC']]
        }),
        Faculty.findAll({
          attributes: ['Designation', [Faculty.sequelize.fn('COUNT', '*'), 'count']],
          group: ['Designation'],
          order: [[Faculty.sequelize.literal('count'), 'DESC']]
        })
      ]);
      
      // Get faculty with their assigned student counts
      const facultyWithStudentCounts = await Faculty.findAll({
        attributes: ['Faculty_ID', 'Full_Name', 'assignedSections', 'assignedDepartments', 'Department'],
        where: { isActive: true }
      });
      
      const facultyStats = await Promise.all(facultyWithStudentCounts.map(async (faculty) => {
        const assignedSections = faculty.assignedSections || [];
        const assignedDepartments = faculty.assignedDepartments || [faculty.Department];
        
        let studentCount = 0;
        if (assignedSections.length > 0 || assignedDepartments.length > 0) {
          const whereClause = {};
          const sectionDeptFilter = [];
          
          if (assignedSections.length > 0) {
            sectionDeptFilter.push({
              Section: { [Op.in]: assignedSections }
            });
          }
          
          if (assignedDepartments.length > 0) {
            sectionDeptFilter.push({
              Department: { [Op.in]: assignedDepartments }
            });
          }
          
          if (sectionDeptFilter.length > 0) {
            whereClause[Op.or] = sectionDeptFilter;
          }
          
          studentCount = await Student.count({ where: whereClause });
        }
        
        return {
          facultyId: faculty.Faculty_ID,
          name: faculty.Full_Name,
          assignedStudents: studentCount
        };
      }));
      
      res.json({
        success: true,
        data: {
          totalFaculty,
          activeFaculty,
          inactiveFaculty: totalFaculty - activeFaculty,
          departmentBreakdown: departments,
          designationBreakdown: designations,
          facultyStudentAssignments: facultyStats
        }
      });
      
    } catch (error) {
      console.error('Faculty stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch faculty statistics',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

module.exports = router;