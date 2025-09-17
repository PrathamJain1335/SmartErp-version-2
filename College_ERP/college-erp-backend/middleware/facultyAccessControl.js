const { Student, Faculty } = require('../models');
const { Op } = require('sequelize');

/**
 * Middleware to ensure faculty can only access students from their assigned sections
 */
const facultyStudentAccessControl = async (req, res, next) => {
  try {
    // Only apply this middleware for faculty users
    if (req.user.role !== 'faculty') {
      return next();
    }

    const facultyId = req.user.id; // This should be Faculty_ID
    
    // Get faculty details with assigned sections
    const faculty = await Faculty.findOne({
      where: { Faculty_ID: facultyId },
      attributes: ['assignedSections', 'assignedDepartments', 'Department']
    });

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty not found'
      });
    }

    // Extract assigned sections and departments
    const assignedSections = faculty.assignedSections || [];
    const assignedDepartments = faculty.assignedDepartments || [faculty.Department];

    // Add faculty access filter to request for use in routes
    req.facultyAccess = {
      sections: assignedSections,
      departments: assignedDepartments,
      facultyId: facultyId
    };

    // Helper function to filter students based on faculty access
    req.getAccessibleStudents = async (additionalFilters = {}) => {
      const whereClause = {
        ...additionalFilters
      };

      // Faculty can see students from their assigned sections or departments
      const sectionDeptFilter = [];
      
      if (assignedSections.length > 0) {
        sectionDeptFilter.push({
          Section: {
            [Op.in]: assignedSections
          }
        });
      }
      
      if (assignedDepartments.length > 0) {
        sectionDeptFilter.push({
          Department: {
            [Op.in]: assignedDepartments
          }
        });
      }

      if (sectionDeptFilter.length > 0) {
        whereClause[Op.or] = sectionDeptFilter;
      }

      return await Student.findAll({
        where: whereClause,
        order: [['Full_Name', 'ASC']]
      });
    };

    // Helper function to check if faculty can access specific student
    req.canAccessStudent = async (studentId) => {
      const student = await Student.findByPk(studentId);
      
      if (!student) {
        return false;
      }

      // Check if student is in faculty's assigned sections or departments
      const canAccessBySection = assignedSections.length === 0 || 
                                assignedSections.includes(student.Section);
      
      const canAccessByDepartment = assignedDepartments.length === 0 || 
                                   assignedDepartments.includes(student.Department);

      return canAccessBySection || canAccessByDepartment;
    };

    next();
  } catch (error) {
    console.error('Faculty access control error:', error);
    res.status(500).json({
      success: false,
      message: 'Access control validation failed'
    });
  }
};

/**
 * Middleware to validate faculty access to specific student
 */
const validateStudentAccess = async (req, res, next) => {
  try {
    if (req.user.role !== 'faculty') {
      return next();
    }

    const studentId = req.params.studentId || req.params.id || req.body.studentId;
    
    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required'
      });
    }

    // Check if faculty can access this student
    if (req.canAccessStudent && !(await req.canAccessStudent(studentId))) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view students from your assigned sections.'
      });
    }

    next();
  } catch (error) {
    console.error('Student access validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Student access validation failed'
    });
  }
};

/**
 * Get filtered student query for faculty
 */
const getFacultyStudentQuery = (facultyAccess, additionalFilters = {}) => {
  const whereClause = {
    ...additionalFilters
  };

  if (facultyAccess.sections.length > 0 || facultyAccess.departments.length > 0) {
    const sectionDeptFilter = [];
    
    if (facultyAccess.sections.length > 0) {
      sectionDeptFilter.push({
        Section: {
          [Op.in]: facultyAccess.sections
        }
      });
    }
    
    if (facultyAccess.departments.length > 0) {
      sectionDeptFilter.push({
        Department: {
          [Op.in]: facultyAccess.departments
        }
      });
    }

    whereClause[Op.or] = sectionDeptFilter;
  }

  return whereClause;
};

/**
 * Middleware to assign sections to faculty (admin only)
 */
const adminAssignSections = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can assign sections to faculty'
      });
    }

    next();
  } catch (error) {
    console.error('Admin section assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Section assignment validation failed'
    });
  }
};

/**
 * Helper function to get all accessible students for a faculty member
 */
const getAccessibleStudentsForFaculty = async (facultyId) => {
  try {
    const faculty = await Faculty.findOne({
      where: { Faculty_ID: facultyId },
      attributes: ['assignedSections', 'assignedDepartments', 'Department']
    });

    if (!faculty) {
      return [];
    }

    const assignedSections = faculty.assignedSections || [];
    const assignedDepartments = faculty.assignedDepartments || [faculty.Department];

    const whereClause = {};
    const sectionDeptFilter = [];
    
    if (assignedSections.length > 0) {
      sectionDeptFilter.push({
        Section: {
          [Op.in]: assignedSections
        }
      });
    }
    
    if (assignedDepartments.length > 0) {
      sectionDeptFilter.push({
        Department: {
          [Op.in]: assignedDepartments
        }
      });
    }

    if (sectionDeptFilter.length > 0) {
      whereClause[Op.or] = sectionDeptFilter;
    }

    return await Student.findAll({
      where: whereClause,
      order: [['Full_Name', 'ASC']]
    });
  } catch (error) {
    console.error('Error getting accessible students:', error);
    return [];
  }
};

/**
 * Helper function to check if a faculty can access a specific student
 */
const canFacultyAccessStudent = async (facultyId, studentId) => {
  try {
    const faculty = await Faculty.findOne({
      where: { Faculty_ID: facultyId },
      attributes: ['assignedSections', 'assignedDepartments', 'Department']
    });

    if (!faculty) {
      return false;
    }

    const student = await Student.findByPk(studentId);
    
    if (!student) {
      return false;
    }

    const assignedSections = faculty.assignedSections || [];
    const assignedDepartments = faculty.assignedDepartments || [faculty.Department];

    // Check if student is in faculty's assigned sections or departments
    const canAccessBySection = assignedSections.length === 0 || 
                              assignedSections.includes(student.Section);
    
    const canAccessByDepartment = assignedDepartments.length === 0 || 
                                 assignedDepartments.includes(student.Department);

    return canAccessBySection || canAccessByDepartment;
  } catch (error) {
    console.error('Error checking faculty-student access:', error);
    return false;
  }
};

/**
 * Get students count accessible to faculty
 */
const getFacultyStudentCount = async (facultyId) => {
  try {
    const faculty = await Faculty.findOne({
      where: { Faculty_ID: facultyId },
      attributes: ['assignedSections', 'assignedDepartments', 'Department']
    });

    if (!faculty) {
      return 0;
    }

    const assignedSections = faculty.assignedSections || [];
    const assignedDepartments = faculty.assignedDepartments || [faculty.Department];

    const whereClause = {};
    const sectionDeptFilter = [];
    
    if (assignedSections.length > 0) {
      sectionDeptFilter.push({
        Section: {
          [Op.in]: assignedSections
        }
      });
    }
    
    if (assignedDepartments.length > 0) {
      sectionDeptFilter.push({
        Department: {
          [Op.in]: assignedDepartments
        }
      });
    }

    if (sectionDeptFilter.length > 0) {
      whereClause[Op.or] = sectionDeptFilter;
    }

    return await Student.count({
      where: whereClause
    });
  } catch (error) {
    console.error('Error getting faculty student count:', error);
    return 0;
  }
};

module.exports = {
  facultyStudentAccessControl,
  validateStudentAccess,
  getFacultyStudentQuery,
  adminAssignSections,
  getAccessibleStudentsForFaculty,
  canFacultyAccessStudent,
  getFacultyStudentCount
};