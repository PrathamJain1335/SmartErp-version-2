const express = require('express');
const router = express.Router();
const path = require('path');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validateStudentAccess } = require('../middleware/facultyAccessControl');
const ProfilePhotoService = require('../services/ProfilePhotoService');
const NotificationService = require('../services/NotificationService');
const { Student, Faculty } = require('../models');

// Initialize profile photo service
const profilePhotoService = new ProfilePhotoService();

/**
 * @route POST /api/profile-photos/upload
 * @desc Upload profile photo for current user
 * @access Private (Student, Faculty, Admin)
 */
router.post('/upload', 
  authenticateToken,
  (req, res, next) => {
    // Use the multer middleware from profile photo service
    profilePhotoService.getUploadMiddleware()(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || 'File upload failed',
          error: process.env.NODE_ENV === 'development' ? err : undefined
        });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;

      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded. Please select an image file.'
        });
      }

      // Validate the uploaded file
      const validationErrors = profilePhotoService.validateImageFile(req.file);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid file',
          errors: validationErrors
        });
      }

      // Delete old profile photo if exists
      await profilePhotoService.deleteOldProfilePhoto(userId, userRole);

      // Save new profile photo URL to database
      const profilePhotoUrl = await profilePhotoService.saveProfilePhoto(
        userId, 
        userRole, 
        req.file.filename
      );

      // Send real-time notification
      const notificationService = req.app.get('notificationService');
      if (notificationService) {
        await notificationService.sendToUser(userId, {
          type: 'profile_update',
          title: 'Profile Photo Updated',
          message: 'Your profile photo has been successfully updated',
          priority: 'low'
        });

        // Notify admin of profile updates
        await notificationService.sendToRole('admin', {
          type: 'profile_photo_update',
          title: 'Profile Photo Update',
          message: `${userRole} ${userId} updated their profile photo`,
          priority: 'low'
        });
      }

      // Send real-time update via Socket.IO
      const io = req.app.get('io');
      if (io) {
        // Notify user's portal
        io.to(`user-${userId}`).emit('profile-photo-updated', {
          userId,
          userRole,
          profilePhotoUrl,
          timestamp: new Date().toISOString()
        });

        // Notify admin portal
        io.to('admin-portal').emit('user-profile-updated', {
          userId,
          userRole,
          updateType: 'profile_photo',
          timestamp: new Date().toISOString()
        });
      }

      res.json({
        success: true,
        message: 'Profile photo uploaded successfully',
        data: {
          profilePhotoUrl,
          filename: req.file.filename,
          fileSize: req.file.size,
          uploadedAt: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Profile photo upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload profile photo',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route GET /api/profile-photos/:userId
 * @desc Get profile photo URL for a specific user
 * @access Private (Admin, Faculty with access, Student themselves)
 */
router.get('/:userId', 
  authenticateToken,
  validateStudentAccess,
  async (req, res) => {
    try {
      const userId = req.params.userId;
      const requestingUserRole = req.user.role;
      const requestingUserId = req.user.id;

      // Determine target user role and validate access
      let targetUserRole = null;
      let hasAccess = false;

      // Try to find user in students first
      const student = await Student.findOne({
        where: { id: userId },
        attributes: ['id', 'Student_ID', 'Full_Name', 'profilePicture']
      });

      if (student) {
        targetUserRole = 'student';
        // Students can only access their own photos, admin can access all, faculty with proper access
        hasAccess = (requestingUserRole === 'student' && requestingUserId === userId) ||
                   (requestingUserRole === 'admin') ||
                   (requestingUserRole === 'faculty' && req.hasStudentAccess);
      } else {
        // Try faculty
        const faculty = await Faculty.findOne({
          where: { Faculty_ID: userId },
          attributes: ['Faculty_ID', 'Full_Name', 'profilePicture']
        });

        if (faculty) {
          targetUserRole = 'faculty';
          // Faculty can access their own, admin can access all, students cannot access faculty photos
          hasAccess = (requestingUserRole === 'faculty' && requestingUserId === userId) ||
                     (requestingUserRole === 'admin');
        }
      }

      if (!targetUserRole) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You cannot view this user\'s profile photo.'
        });
      }

      // Get profile photo URL
      const profilePhotoUrl = await profilePhotoService.getProfilePhotoUrl(userId, targetUserRole);

      res.json({
        success: true,
        data: {
          userId,
          userRole: targetUserRole,
          profilePhotoUrl,
          hasDefaultPhoto: profilePhotoUrl.includes('default-avatar.png')
        }
      });

    } catch (error) {
      console.error('Get profile photo error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get profile photo',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route GET /api/profile-photos/current/me
 * @desc Get current user's profile photo
 * @access Private (All authenticated users)
 */
router.get('/current/me', 
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;

      const profilePhotoUrl = await profilePhotoService.getProfilePhotoUrl(userId, userRole);

      res.json({
        success: true,
        data: {
          userId,
          userRole,
          profilePhotoUrl,
          hasDefaultPhoto: profilePhotoUrl.includes('default-avatar.png')
        }
      });

    } catch (error) {
      console.error('Get current user profile photo error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get profile photo',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route DELETE /api/profile-photos/current/me
 * @desc Delete current user's profile photo (reset to default)
 * @access Private (All authenticated users)
 */
router.delete('/current/me', 
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;

      // Delete the current profile photo file
      await profilePhotoService.deleteOldProfilePhoto(userId, userRole);

      // Reset profile photo URL in database to null (will show default)
      if (userRole === 'faculty') {
        await Faculty.update(
          { profilePicture: null },
          { where: { Faculty_ID: userId } }
        );
      } else {
        await Student.update(
          { profilePicture: null },
          { where: { id: userId } }
        );
      }

      // Send real-time notification
      const notificationService = req.app.get('notificationService');
      if (notificationService) {
        await notificationService.sendToUser(userId, {
          type: 'profile_update',
          title: 'Profile Photo Removed',
          message: 'Your profile photo has been reset to default',
          priority: 'low'
        });
      }

      // Send real-time update via Socket.IO
      const io = req.app.get('io');
      if (io) {
        io.to(`user-${userId}`).emit('profile-photo-updated', {
          userId,
          userRole,
          profilePhotoUrl: '/uploads/profiles/default-avatar.png',
          timestamp: new Date().toISOString()
        });
      }

      res.json({
        success: true,
        message: 'Profile photo removed successfully',
        data: {
          profilePhotoUrl: '/uploads/profiles/default-avatar.png'
        }
      });

    } catch (error) {
      console.error('Delete profile photo error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete profile photo',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route GET /api/profile-photos/cleanup/orphaned
 * @desc Clean up orphaned profile photo files (Admin only)
 * @access Private (Admin only)
 */
router.get('/cleanup/orphaned', 
  authenticateToken,
  authorizeRoles(['admin']),
  async (req, res) => {
    try {
      const cleanedCount = await profilePhotoService.cleanupOrphanedFiles();

      res.json({
        success: true,
        message: `Cleanup completed. Removed ${cleanedCount} orphaned files.`,
        data: {
          cleanedFilesCount: cleanedCount,
          cleanupDate: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Cleanup orphaned files error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to cleanup orphaned files',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

module.exports = router;