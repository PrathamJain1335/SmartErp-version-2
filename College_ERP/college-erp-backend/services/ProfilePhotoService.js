const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Student, Faculty } = require('../models');

class ProfilePhotoService {
  constructor() {
    this.uploadDir = path.join(__dirname, '..', 'uploads', 'profiles');
    this.ensureDirectoriesExist();
    this.configureMulter();
  }

  ensureDirectoriesExist() {
    const directories = [
      path.join(this.uploadDir, 'students'),
      path.join(this.uploadDir, 'faculty')
    ];

    directories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
      }
    });
  }

  configureMulter() {
    // Configure multer for profile photo uploads
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        const userType = req.user.role; // 'student', 'faculty'
        const uploadPath = path.join(this.uploadDir, userType === 'faculty' ? 'faculty' : 'students');
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        // Generate unique filename with user ID and timestamp
        const userId = req.user.role === 'faculty' ? req.user.id : req.user.id;
        const timestamp = Date.now();
        const extension = path.extname(file.originalname).toLowerCase();
        const filename = `${req.user.role}_${userId}_${timestamp}${extension}`;
        cb(null, filename);
      }
    });

    // File filter for images only
    const fileFilter = (req, file, cb) => {
      const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'image/gif',
        'image/webp'
      ];

      if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'), false);
      }
    };

    this.upload = multer({
      storage: storage,
      fileFilter: fileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1 // Only one file at a time
      }
    });
  }

  // Get multer middleware
  getUploadMiddleware() {
    return this.upload.single('profilePhoto');
  }

  // Save profile photo to database and return URL
  async saveProfilePhoto(userId, userRole, filename) {
    try {
      const profilePhotoUrl = `/uploads/profiles/${userRole === 'faculty' ? 'faculty' : 'students'}/${filename}`;

      if (userRole === 'faculty') {
        await Faculty.update(
          { profilePicture: profilePhotoUrl },
          { where: { Faculty_ID: userId } }
        );
      } else {
        await Student.update(
          { profilePicture: profilePhotoUrl },
          { where: { id: userId } }
        );
      }

      return profilePhotoUrl;
    } catch (error) {
      console.error('Error saving profile photo to database:', error);
      throw error;
    }
  }

  // Delete old profile photo when uploading new one
  async deleteOldProfilePhoto(userId, userRole) {
    try {
      let oldPhotoUrl = null;

      if (userRole === 'faculty') {
        const faculty = await Faculty.findOne({
          where: { Faculty_ID: userId },
          attributes: ['profilePicture']
        });
        oldPhotoUrl = faculty?.profilePicture;
      } else {
        const student = await Student.findOne({
          where: { id: userId },
          attributes: ['profilePicture']
        });
        oldPhotoUrl = student?.profilePicture;
      }

      if (oldPhotoUrl && oldPhotoUrl !== '/uploads/profiles/default-avatar.png') {
        const oldPhotoPath = path.join(__dirname, '..', oldPhotoUrl);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
          console.log(`🗑️ Deleted old profile photo: ${oldPhotoPath}`);
        }
      }
    } catch (error) {
      console.error('Error deleting old profile photo:', error);
      // Don't throw error, just log it as this is cleanup
    }
  }

  // Get profile photo URL
  async getProfilePhotoUrl(userId, userRole) {
    try {
      let photoUrl = null;

      if (userRole === 'faculty') {
        const faculty = await Faculty.findOne({
          where: { Faculty_ID: userId },
          attributes: ['profilePicture']
        });
        photoUrl = faculty?.profilePicture;
      } else {
        const student = await Student.findOne({
          where: { id: userId },
          attributes: ['profilePicture']
        });
        photoUrl = student?.profilePicture;
      }

      return photoUrl || '/uploads/profiles/default-avatar.png';
    } catch (error) {
      console.error('Error getting profile photo URL:', error);
      return '/uploads/profiles/default-avatar.png';
    }
  }

  // Validate image file
  validateImageFile(file) {
    const errors = [];

    // Check file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      errors.push('File size must be less than 5MB');
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      errors.push('File type must be JPEG, PNG, GIF, or WebP');
    }

    // Check file extension
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      errors.push('Invalid file extension');
    }

    return errors;
  }

  // Create default avatar if doesn't exist
  createDefaultAvatar() {
    const defaultAvatarPath = path.join(this.uploadDir, 'default-avatar.png');
    
    if (!fs.existsSync(defaultAvatarPath)) {
      // Create a simple default avatar (you can replace this with actual default image)
      console.log('📷 Default avatar not found. You should add a default-avatar.png file to:', defaultAvatarPath);
      console.log('💡 For now, the system will use a placeholder URL');
    }
  }

  // Get file stats and metadata
  getFileMetadata(filepath) {
    try {
      if (!fs.existsSync(filepath)) {
        return null;
      }

      const stats = fs.statSync(filepath);
      return {
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        isFile: stats.isFile()
      };
    } catch (error) {
      console.error('Error getting file metadata:', error);
      return null;
    }
  }

  // Clean up orphaned files (files not referenced in database)
  async cleanupOrphanedFiles() {
    try {
      console.log('🧹 Starting cleanup of orphaned profile photos...');
      
      const studentDir = path.join(this.uploadDir, 'students');
      const facultyDir = path.join(this.uploadDir, 'faculty');
      
      let cleanedCount = 0;

      // Cleanup student photos
      if (fs.existsSync(studentDir)) {
        const studentFiles = fs.readdirSync(studentDir);
        const studentsInDB = await Student.findAll({
          attributes: ['id', 'profilePicture'],
          where: { profilePicture: { [require('sequelize').Op.not]: null } }
        });

        const referencedFiles = studentsInDB.map(s => path.basename(s.profilePicture));
        
        studentFiles.forEach(file => {
          if (!referencedFiles.includes(file) && file !== 'default-avatar.png') {
            fs.unlinkSync(path.join(studentDir, file));
            cleanedCount++;
          }
        });
      }

      // Cleanup faculty photos
      if (fs.existsSync(facultyDir)) {
        const facultyFiles = fs.readdirSync(facultyDir);
        const facultyInDB = await Faculty.findAll({
          attributes: ['Faculty_ID', 'profilePicture'],
          where: { profilePicture: { [require('sequelize').Op.not]: null } }
        });

        const referencedFiles = facultyInDB.map(f => path.basename(f.profilePicture));
        
        facultyFiles.forEach(file => {
          if (!referencedFiles.includes(file) && file !== 'default-avatar.png') {
            fs.unlinkSync(path.join(facultyDir, file));
            cleanedCount++;
          }
        });
      }

      console.log(`✅ Cleanup complete. Removed ${cleanedCount} orphaned files.`);
      return cleanedCount;
    } catch (error) {
      console.error('❌ Error during cleanup:', error);
      return 0;
    }
  }
}

module.exports = ProfilePhotoService;