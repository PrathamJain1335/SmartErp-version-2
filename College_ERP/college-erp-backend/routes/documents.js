const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');
const { Document } = require('../models/newModels');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/documents');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const baseName = file.originalname.replace(extension, '').replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${baseName}-${uniqueSuffix}${extension}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPG, and PNG files are allowed.'), false);
    }
  }
});

/**
 * @route POST /api/documents/upload
 * @desc Upload a document
 * @access Private
 */
router.post('/upload', authenticateToken, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { category, description, tags, subject, semester } = req.body;
    const userId = req.user.id || req.user.rollNo || req.user.Faculty_ID;
    const userRole = req.user.role || 'student';
    
    // Create document record in database
    const document = await Document.create({
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      category: category || 'other',
      description: description || req.file.originalname,
      uploadedBy: userId,
      uploaderType: userRole,
      tags: tags ? JSON.parse(tags) : [],
      subject: subject,
      semester: semester ? parseInt(semester) : null,
      academicYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
      isActive: true,
      isVerified: false
    });
    
    console.log('✅ Document uploaded to database:', {
      id: document.id,
      fileName: document.fileName,
      originalName: document.originalName,
      size: `${(document.fileSize / 1024).toFixed(2)} KB`,
      category: document.category,
      uploadedBy: userId,
      uploaderType: userRole
    });

    res.json({
      success: true,
      message: 'Document uploaded successfully',
      document: {
        id: document.id,
        fileName: document.fileName,
        originalName: document.originalName,
        url: `/uploads/documents/${document.fileName}`,
        fileSize: document.fileSize,
        category: document.category,
        description: document.description,
        uploadDate: document.createdAt,
        tags: document.tags,
        subject: document.subject,
        semester: document.semester
      }
    });

  } catch (error) {
    console.error('Document upload error:', error);
    
    // Clean up file if there was an error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    if (error.message.includes('Invalid file type')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to upload document'
    });
  }
});

/**
 * @route GET /api/documents
 * @desc Get user's documents
 * @access Private
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id || req.user.rollNo || req.user.Faculty_ID;
    const userRole = req.user.role || 'student';
    const { category, subject, semester, tags, search } = req.query;
    
    // Build query conditions
    const whereConditions = {
      uploadedBy: userId,
      isActive: true
    };
    
    if (category) whereConditions.category = category;
    if (subject) whereConditions.subject = subject;
    if (semester) whereConditions.semester = parseInt(semester);
    
    // Fetch documents from database
    const documents = await Document.findAll({
      where: whereConditions,
      order: [['createdAt', 'DESC']],
      attributes: [
        'id', 'originalName', 'fileName', 'fileSize', 'mimeType',
        'category', 'description', 'tags', 'subject', 'semester',
        'isVerified', 'verifiedBy', 'createdAt', 'updatedAt'
      ]
    });
    
    // Filter by search term if provided
    let filteredDocuments = documents;
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredDocuments = documents.filter(doc => 
        doc.originalName.toLowerCase().includes(searchTerm) ||
        doc.description?.toLowerCase().includes(searchTerm) ||
        doc.subject?.toLowerCase().includes(searchTerm)
      );
    }
    
    // Transform documents for frontend
    const transformedDocuments = filteredDocuments.map(doc => ({
      id: doc.id,
      originalName: doc.originalName,
      fileName: doc.fileName,
      url: `/uploads/documents/${doc.fileName}`,
      fileSize: doc.fileSize,
      mimeType: doc.mimeType,
      category: doc.category,
      description: doc.description,
      tags: doc.tags,
      subject: doc.subject,
      semester: doc.semester,
      isVerified: doc.isVerified,
      verifiedBy: doc.verifiedBy,
      uploadDate: doc.createdAt,
      lastModified: doc.updatedAt
    }));
    
    res.json({
      success: true,
      documents: transformedDocuments,
      total: transformedDocuments.length,
      filters: { category, subject, semester, search }
    });
    
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch documents'
    });
  }
});

/**
 * @route DELETE /api/documents/:id
 * @desc Delete a document
 * @access Private
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const documentId = req.params.id;
    const userId = req.user.id || req.user.rollNo || req.user.Faculty_ID;
    
    // Find the document in database
    const document = await Document.findOne({
      where: {
        id: documentId,
        uploadedBy: userId,
        isActive: true
      }
    });
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found or you do not have permission to delete it'
      });
    }
    
    // Delete file from filesystem
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }
    
    // Delete thumbnail if exists
    if (document.thumbnailPath && fs.existsSync(document.thumbnailPath)) {
      fs.unlinkSync(document.thumbnailPath);
    }
    
    // Soft delete from database
    await document.update({ isActive: false });
    
    console.log(`🗑️ Document deleted successfully: ${documentId} by user ${userId}`);
    
    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete document'
    });
  }
});

/**
 * @route GET /api/documents/:id
 * @desc Get document details
 * @access Private
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const documentId = req.params.id;
    const userId = req.user.id || req.user.rollNo || req.user.Faculty_ID;
    
    // Fetch document from database
    const document = await Document.findOne({
      where: {
        id: documentId,
        isActive: true
      }
    });
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }
    
    // Check access permissions
    const hasAccess = (
      document.uploadedBy === userId ||
      document.isPublic ||
      (document.sharedWith && document.sharedWith.includes(userId))
    );
    
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this document'
      });
    }
    
    console.log(`📄 Document details accessed: ${documentId} by user ${userId}`);
    
    res.json({
      success: true,
      document: {
        id: document.id,
        originalName: document.originalName,
        fileName: document.fileName,
        url: `/uploads/documents/${document.fileName}`,
        fileSize: document.fileSize,
        mimeType: document.mimeType,
        category: document.category,
        description: document.description,
        tags: document.tags,
        subject: document.subject,
        semester: document.semester,
        academicYear: document.academicYear,
        uploadedBy: document.uploadedBy,
        uploaderType: document.uploaderType,
        isPublic: document.isPublic,
        isVerified: document.isVerified,
        verifiedBy: document.verifiedBy,
        verificationDate: document.verificationDate,
        uploadDate: document.createdAt,
        lastModified: document.updatedAt
      }
    });
    
  } catch (error) {
    console.error('Error fetching document details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch document details'
    });
  }
});

/**
 * @route POST /api/documents/:id/category
 * @desc Update document category
 * @access Private
 */
router.post('/:id/category', authenticateToken, async (req, res) => {
  try {
    const documentId = req.params.id;
    const { category, description, tags, subject } = req.body;
    const userId = req.user.id || req.user.rollNo || req.user.Faculty_ID;
    
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required'
      });
    }
    
    // Find and update document
    const document = await Document.findOne({
      where: {
        id: documentId,
        uploadedBy: userId,
        isActive: true
      }
    });
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found or you do not have permission to edit it'
      });
    }
    
    // Update document fields
    const updateData = { category };
    if (description !== undefined) updateData.description = description;
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : JSON.parse(tags || '[]');
    if (subject !== undefined) updateData.subject = subject;
    
    await document.update(updateData);
    
    console.log(`🏷️ Document updated: ${documentId} by user ${userId}`, updateData);
    
    res.json({
      success: true,
      message: 'Document updated successfully',
      document: {
        id: document.id,
        category: document.category,
        description: document.description,
        tags: document.tags,
        subject: document.subject
      }
    });
    
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update document'
    });
  }
});

/**
 * @route GET /api/documents/categories
 * @desc Get available document categories
 * @access Private
 */
router.get('/categories', authenticateToken, (req, res) => {
  try {
    const categories = [
      { id: 'academic', label: 'Academic Records', description: 'Transcripts, certificates, academic documents' },
      { id: 'certificates', label: 'Certificates', description: 'Professional certifications, course certificates' },
      { id: 'identity', label: 'Identity Documents', description: 'ID cards, passport, driving license' },
      { id: 'medical', label: 'Medical Records', description: 'Medical certificates, health records' },
      { id: 'financial', label: 'Financial Documents', description: 'Fee receipts, bank statements' },
      { id: 'other', label: 'Other Documents', description: 'Miscellaneous documents' }
    ];
    
    res.json({
      success: true,
      categories
    });
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});

module.exports = router;