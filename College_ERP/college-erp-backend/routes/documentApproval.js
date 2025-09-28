const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { Document, DocumentApproval, Student, Faculty } = require('../models/newModels');
const NotificationService = require('../services/NotificationService');

// Demo mapping: Suresh Shah -> Kavya faculty
const DEMO_APPROVAL_MAPPING = {
  'suresh.shah.cse25001@jecrc.edu': 'kavya@jecrc.edu', // Suresh Shah's documents go to Kavya
  // Add more mappings as needed
};

/**
 * @route POST /api/document-approval/submit
 * @desc Submit a document for approval
 * @access Private (Students)
 */
router.post('/submit', authenticateToken, authorizeRoles(['student']), async (req, res) => {
  try {
    const { documentId, category, priority, comments } = req.body;
    const studentEmail = req.user.email;
    const studentId = req.user.id;

    // Validate document exists and belongs to student
    const document = await Document.findOne({
      where: {
        id: documentId,
        uploadedBy: studentId,
        uploaderType: 'student'
      }
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found or you do not have permission to submit it for approval'
      });
    }

    // Check if already submitted for approval
    const existingApproval = await DocumentApproval.findOne({
      where: {
        documentId,
        status: 'pending'
      }
    });

    if (existingApproval) {
      return res.status(400).json({
        success: false,
        message: 'Document is already pending approval'
      });
    }

    // Determine which faculty to assign based on demo mapping
    let assignedFaculty = DEMO_APPROVAL_MAPPING[studentEmail];
    
    if (!assignedFaculty) {
      // Default assignment logic - find class advisor or department faculty
      const student = await Student.findOne({
        where: { email: studentEmail },
        include: [{
          model: require('../models/newModels').Section,
          as: 'section',
          include: [{
            model: require('../models/newModels').Faculty,
            as: 'classAdvisor'
          }]
        }]
      });

      if (student?.section?.classAdvisor) {
        assignedFaculty = student.section.classAdvisor.id;
      } else {
        // Fallback to first faculty in department
        const departmentFaculty = await Faculty.findOne({
          where: { 
            departmentId: student?.departmentId,
            isActive: true 
          }
        });
        assignedFaculty = departmentFaculty?.id;
      }
    } else {
      // Convert email to faculty ID for demo mapping
      const facultyRecord = await Faculty.findOne({
        where: { email: assignedFaculty }
      });
      assignedFaculty = facultyRecord?.id;
    }

    if (!assignedFaculty) {
      return res.status(400).json({
        success: false,
        message: 'No faculty available for approval. Please contact administration.'
      });
    }

    // Create approval request
    const approval = await DocumentApproval.create({
      documentId,
      submittedBy: studentId,
      submittedByType: 'student',
      assignedTo: assignedFaculty,
      assignedToType: 'faculty',
      category: category || 'general',
      priority: priority || 'normal',
      approvalMetadata: {
        studentComments: comments,
        originalFileName: document.originalName,
        fileCategory: document.category
      }
    });

    // Send notification to faculty
    const notificationService = req.app.get('notificationService');
    if (notificationService) {
      await notificationService.sendToUser(assignedFaculty, {
        type: 'document_approval_request',
        title: 'New Document Approval Request',
        message: `${req.user.firstName} ${req.user.lastName} has submitted "${document.originalName}" for your approval`,
        priority: priority || 'normal',
        data: {
          approvalId: approval.id,
          documentId,
          studentName: `${req.user.firstName} ${req.user.lastName}`,
          category: category || 'general'
        }
      });
    }

    res.json({
      success: true,
      message: 'Document submitted for approval successfully',
      data: {
        approvalId: approval.id,
        status: approval.status,
        assignedTo: assignedFaculty,
        submissionDate: approval.submissionDate
      }
    });

  } catch (error) {
    console.error('Document approval submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit document for approval',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route GET /api/document-approval/pending
 * @desc Get pending approval requests for faculty
 * @access Private (Faculty)
 */
router.get('/pending', authenticateToken, authorizeRoles(['faculty', 'admin']), async (req, res) => {
  try {
    const facultyId = req.user.id;
    const { page = 1, limit = 10, category, priority } = req.query;

    const whereClause = {
      assignedTo: facultyId,
      status: 'pending'
    };

    if (category) whereClause.category = category;
    if (priority) whereClause.priority = priority;

    const approvals = await DocumentApproval.findAll({
      where: whereClause,
      include: [{
        model: Document,
        as: 'approvalDocument',
        attributes: ['id', 'originalName', 'category', 'description', 'fileSize', 'mimeType']
      }],
      order: [['submissionDate', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    // Get student details for each approval
    const approvalsWithStudents = await Promise.all(
      approvals.map(async (approval) => {
        const student = await Student.findOne({
          where: { rollNo: approval.submittedBy },
          attributes: ['rollNo', 'firstName', 'lastName', 'email', 'currentSemester']
        });

        return {
          ...approval.toJSON(),
          studentDetails: student
        };
      })
    );

    const totalCount = await DocumentApproval.count({ where: whereClause });

    res.json({
      success: true,
      data: {
        approvals: approvalsWithStudents,
        pagination: {
          total: totalCount,
          page: parseInt(page),
          limit: parseInt(limit),
          hasMore: (parseInt(page) * parseInt(limit)) < totalCount
        }
      }
    });

  } catch (error) {
    console.error('Get pending approvals error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve pending approvals',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route POST /api/document-approval/:id/approve
 * @desc Approve a document
 * @access Private (Faculty)
 */
router.post('/:id/approve', authenticateToken, authorizeRoles(['faculty', 'admin']), async (req, res) => {
  try {
    const approvalId = req.params.id;
    const { comments } = req.body;
    const facultyId = req.user.id;

    const approval = await DocumentApproval.findOne({
      where: {
        id: approvalId,
        assignedTo: facultyId,
        status: 'pending'
      },
      include: [{
        model: Document,
        as: 'approvalDocument'
      }]
    });

    if (!approval) {
      return res.status(404).json({
        success: false,
        message: 'Approval request not found or not authorized'
      });
    }

    // Update approval status
    await approval.update({
      status: 'approved',
      reviewedDate: new Date(),
      approverComments: comments
    });

    // Update document status
    await Document.update(
      { 
        isVerified: true,
        verifiedBy: facultyId,
        verificationDate: new Date()
      },
      { where: { id: approval.documentId } }
    );

    // Send notification to student
    const notificationService = req.app.get('notificationService');
    if (notificationService) {
      await notificationService.sendToUser(approval.submittedBy, {
        type: 'document_approved',
        title: 'Document Approved',
        message: `Your document "${approval.approvalDocument.originalName}" has been approved by ${req.user.firstName} ${req.user.lastName}`,
        priority: 'high',
        data: {
          documentId: approval.documentId,
          approvalId: approvalId,
          approverComments: comments,
          approvedBy: `${req.user.firstName} ${req.user.lastName}`
        }
      });
    }

    res.json({
      success: true,
      message: 'Document approved successfully',
      data: {
        approvalId: approvalId,
        status: 'approved',
        reviewedDate: approval.reviewedDate,
        comments: comments
      }
    });

  } catch (error) {
    console.error('Document approval error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve document',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route POST /api/document-approval/:id/reject
 * @desc Reject a document
 * @access Private (Faculty)
 */
router.post('/:id/reject', authenticateToken, authorizeRoles(['faculty', 'admin']), async (req, res) => {
  try {
    const approvalId = req.params.id;
    const { reason, comments } = req.body;
    const facultyId = req.user.id;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const approval = await DocumentApproval.findOne({
      where: {
        id: approvalId,
        assignedTo: facultyId,
        status: 'pending'
      },
      include: [{
        model: Document,
        as: 'approvalDocument'
      }]
    });

    if (!approval) {
      return res.status(404).json({
        success: false,
        message: 'Approval request not found or not authorized'
      });
    }

    // Update approval status
    await approval.update({
      status: 'rejected',
      reviewedDate: new Date(),
      rejectionReason: reason,
      approverComments: comments
    });

    // Send notification to student
    const notificationService = req.app.get('notificationService');
    if (notificationService) {
      await notificationService.sendToUser(approval.submittedBy, {
        type: 'document_rejected',
        title: 'Document Rejected',
        message: `Your document "${approval.approvalDocument.originalName}" has been rejected by ${req.user.firstName} ${req.user.lastName}`,
        priority: 'high',
        data: {
          documentId: approval.documentId,
          approvalId: approvalId,
          rejectionReason: reason,
          approverComments: comments,
          rejectedBy: `${req.user.firstName} ${req.user.lastName}`
        }
      });
    }

    res.json({
      success: true,
      message: 'Document rejected successfully',
      data: {
        approvalId: approvalId,
        status: 'rejected',
        reviewedDate: approval.reviewedDate,
        reason: reason,
        comments: comments
      }
    });

  } catch (error) {
    console.error('Document rejection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject document',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route GET /api/document-approval/my-submissions
 * @desc Get student's document approval submissions
 * @access Private (Students)
 */
router.get('/my-submissions', authenticateToken, authorizeRoles(['student']), async (req, res) => {
  try {
    const studentId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    const whereClause = {
      submittedBy: studentId
    };

    if (status) whereClause.status = status;

    const approvals = await DocumentApproval.findAll({
      where: whereClause,
      include: [{
        model: Document,
        as: 'approvalDocument',
        attributes: ['id', 'originalName', 'category', 'description']
      }],
      order: [['submissionDate', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    const totalCount = await DocumentApproval.count({ where: whereClause });

    res.json({
      success: true,
      data: {
        submissions: approvals,
        pagination: {
          total: totalCount,
          page: parseInt(page),
          limit: parseInt(limit),
          hasMore: (parseInt(page) * parseInt(limit)) < totalCount
        }
      }
    });

  } catch (error) {
    console.error('Get student submissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve your submissions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;