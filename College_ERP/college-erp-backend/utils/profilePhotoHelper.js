const path = require('path');

/**
 * Helper utility to include profile photo URLs in API responses
 */
class ProfilePhotoHelper {
  
  /**
   * Add profile photo URL to student object
   * @param {Object} student - Student object from database
   * @returns {Object} Student object with profilePhotoUrl field
   */
  static addStudentProfilePhoto(student) {
    if (!student) return student;
    
    const studentObj = student.toJSON ? student.toJSON() : student;
    
    // Add profilePhotoUrl field
    studentObj.profilePhotoUrl = student.profilePicture || '/uploads/profiles/default-avatar.png';
    
    // Add hasCustomPhoto boolean
    studentObj.hasCustomPhoto = !!(student.profilePicture && !student.profilePicture.includes('default-avatar.png'));
    
    return studentObj;
  }

  /**
   * Add profile photo URL to faculty object
   * @param {Object} faculty - Faculty object from database
   * @returns {Object} Faculty object with profilePhotoUrl field
   */
  static addFacultyProfilePhoto(faculty) {
    if (!faculty) return faculty;
    
    const facultyObj = faculty.toJSON ? faculty.toJSON() : faculty;
    
    // Add profilePhotoUrl field
    facultyObj.profilePhotoUrl = faculty.profilePicture || '/uploads/profiles/default-avatar.png';
    
    // Add hasCustomPhoto boolean
    facultyObj.hasCustomPhoto = !!(faculty.profilePicture && !faculty.profilePicture.includes('default-avatar.png'));
    
    return facultyObj;
  }

  /**
   * Add profile photos to array of students
   * @param {Array} students - Array of student objects
   * @returns {Array} Array of student objects with profile photos
   */
  static addStudentProfilePhotos(students) {
    if (!Array.isArray(students)) return students;
    
    return students.map(student => this.addStudentProfilePhoto(student));
  }

  /**
   * Add profile photos to array of faculty members
   * @param {Array} faculties - Array of faculty objects
   * @returns {Array} Array of faculty objects with profile photos
   */
  static addFacultyProfilePhotos(faculties) {
    if (!Array.isArray(faculties)) return faculties;
    
    return faculties.map(faculty => this.addFacultyProfilePhoto(faculty));
  }

  /**
   * Add profile photo to any user object (auto-detects type)
   * @param {Object} user - User object (student or faculty)
   * @param {string} userType - Optional: 'student' or 'faculty'
   * @returns {Object} User object with profile photo
   */
  static addProfilePhoto(user, userType = null) {
    if (!user) return user;
    
    // Auto-detect user type if not provided
    if (!userType) {
      if (user.Student_ID || user.Enrollment_No) {
        userType = 'student';
      } else if (user.Faculty_ID || user.employeeId) {
        userType = 'faculty';
      }
    }
    
    if (userType === 'student') {
      return this.addStudentProfilePhoto(user);
    } else if (userType === 'faculty') {
      return this.addFacultyProfilePhoto(user);
    }
    
    // Fallback: add generic profile photo
    const userObj = user.toJSON ? user.toJSON() : user;
    userObj.profilePhotoUrl = user.profilePicture || '/uploads/profiles/default-avatar.png';
    userObj.hasCustomPhoto = !!(user.profilePicture && !user.profilePicture.includes('default-avatar.png'));
    
    return userObj;
  }

  /**
   * Get profile photo URL for any user
   * @param {Object} user - User object
   * @param {string} userType - Optional: 'student' or 'faculty'
   * @returns {string} Profile photo URL
   */
  static getProfilePhotoUrl(user, userType = null) {
    if (!user) return '/uploads/profiles/default-avatar.png';
    
    return user.profilePicture || '/uploads/profiles/default-avatar.png';
  }

  /**
   * Check if user has a custom profile photo
   * @param {Object} user - User object
   * @returns {boolean} True if user has uploaded custom photo
   */
  static hasCustomPhoto(user) {
    if (!user || !user.profilePicture) return false;
    
    return !user.profilePicture.includes('default-avatar.png');
  }

  /**
   * Get profile photo filename from URL
   * @param {string} profilePhotoUrl - Profile photo URL
   * @returns {string} Filename or null
   */
  static getFilenameFromUrl(profilePhotoUrl) {
    if (!profilePhotoUrl) return null;
    
    return path.basename(profilePhotoUrl);
  }

  /**
   * Generate profile photo filename
   * @param {string} userId - User ID
   * @param {string} userRole - User role ('student' or 'faculty')
   * @param {string} extension - File extension (e.g., '.jpg')
   * @returns {string} Generated filename
   */
  static generateFilename(userId, userRole, extension) {
    const timestamp = Date.now();
    return `${userRole}_${userId}_${timestamp}${extension}`;
  }
}

module.exports = ProfilePhotoHelper;