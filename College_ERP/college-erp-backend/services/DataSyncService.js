class DataSyncService {
  constructor(io) {
    this.io = io;
    this.syncEvents = {
      ATTENDANCE_UPDATE: 'attendance-updated',
      GRADE_UPDATE: 'grades-updated',
      STUDENT_UPDATE: 'student-updated',
      FACULTY_UPDATE: 'faculty-updated',
      NOTIFICATION_NEW: 'new-notification',
      FACULTY_ATTENDANCE_UPDATE: 'faculty-attendance-updated',
      SECTION_ASSIGNMENT_UPDATE: 'section-assignment-updated',
      AI_ANALYSIS_UPDATE: 'ai-analysis-updated',
      PROFILE_UPDATE: 'profile-updated'
    };
  }

  /**
   * Sync attendance updates across all relevant portals
   */
  syncAttendanceUpdate(attendanceData) {
    try {
      const { studentId, courseId, date, status, markedBy, section, department } = attendanceData;
      
      const updatePayload = {
        studentId,
        courseId,
        date,
        status,
        markedBy,
        section,
        department,
        timestamp: new Date().toISOString()
      };

      // Send to admin portal (all attendance updates)
      this.io.to('admin-portal').emit(this.syncEvents.ATTENDANCE_UPDATE, updatePayload);

      // Send to faculty portal (all faculty can see updates)
      this.io.to('faculty-portal').emit(this.syncEvents.ATTENDANCE_UPDATE, updatePayload);

      // Send to specific student
      this.io.to(`user-${studentId}`).emit(this.syncEvents.ATTENDANCE_UPDATE, updatePayload);

      // Send to section-specific room (for faculty assigned to that section)
      if (section) {
        this.io.to(`section-${section}`).emit(this.syncEvents.ATTENDANCE_UPDATE, updatePayload);
      }

      // Send to department-specific room
      if (department) {
        this.io.to(`dept-${department}`).emit(this.syncEvents.ATTENDANCE_UPDATE, updatePayload);
      }

      console.log(`✅ Attendance update synced for student ${studentId}`);
    } catch (error) {
      console.error('❌ Failed to sync attendance update:', error);
    }
  }

  /**
   * Sync grade updates across portals
   */
  syncGradeUpdate(gradeData) {
    try {
      const { studentId, courseId, subject, marks, grade, facultyId, section, department } = gradeData;
      
      const updatePayload = {
        studentId,
        courseId,
        subject,
        marks,
        grade,
        facultyId,
        section,
        department,
        timestamp: new Date().toISOString()
      };

      // Send to admin portal
      this.io.to('admin-portal').emit(this.syncEvents.GRADE_UPDATE, updatePayload);

      // Send to specific student
      this.io.to(`user-${studentId}`).emit(this.syncEvents.GRADE_UPDATE, updatePayload);

      // Send to faculty who updated the grade
      if (facultyId) {
        this.io.to(`user-${facultyId}`).emit(this.syncEvents.GRADE_UPDATE, updatePayload);
      }

      // Send to section and department rooms
      if (section) {
        this.io.to(`section-${section}`).emit(this.syncEvents.GRADE_UPDATE, updatePayload);
      }
      
      if (department) {
        this.io.to(`dept-${department}`).emit(this.syncEvents.GRADE_UPDATE, updatePayload);
      }

      console.log(`✅ Grade update synced for student ${studentId}`);
    } catch (error) {
      console.error('❌ Failed to sync grade update:', error);
    }
  }

  /**
   * Sync student profile updates
   */
  syncStudentUpdate(studentData) {
    try {
      const { studentId, changes, updatedBy, section, department } = studentData;
      
      const updatePayload = {
        studentId,
        changes,
        updatedBy,
        section,
        department,
        timestamp: new Date().toISOString()
      };

      // Send to admin portal
      this.io.to('admin-portal').emit(this.syncEvents.STUDENT_UPDATE, updatePayload);

      // Send to specific student
      this.io.to(`user-${studentId}`).emit(this.syncEvents.STUDENT_UPDATE, updatePayload);

      // Send to faculty assigned to student's section/department
      if (section) {
        this.io.to(`section-${section}`).emit(this.syncEvents.STUDENT_UPDATE, updatePayload);
      }
      
      if (department) {
        this.io.to(`dept-${department}`).emit(this.syncEvents.STUDENT_UPDATE, updatePayload);
      }

      console.log(`✅ Student update synced for ${studentId}`);
    } catch (error) {
      console.error('❌ Failed to sync student update:', error);
    }
  }

  /**
   * Sync faculty profile updates
   */
  syncFacultyUpdate(facultyData) {
    try {
      const { facultyId, changes, updatedBy, assignedSections, department } = facultyData;
      
      const updatePayload = {
        facultyId,
        changes,
        updatedBy,
        assignedSections,
        department,
        timestamp: new Date().toISOString()
      };

      // Send to admin portal
      this.io.to('admin-portal').emit(this.syncEvents.FACULTY_UPDATE, updatePayload);

      // Send to specific faculty
      this.io.to(`user-${facultyId}`).emit(this.syncEvents.FACULTY_UPDATE, updatePayload);

      // Send to faculty portal (all faculty can see updates)
      this.io.to('faculty-portal').emit(this.syncEvents.FACULTY_UPDATE, updatePayload);

      // If section assignments changed, notify students in those sections
      if (assignedSections && assignedSections.length > 0) {
        assignedSections.forEach(section => {
          this.io.to(`section-${section}`).emit(this.syncEvents.FACULTY_UPDATE, updatePayload);
        });
      }

      console.log(`✅ Faculty update synced for ${facultyId}`);
    } catch (error) {
      console.error('❌ Failed to sync faculty update:', error);
    }
  }

  /**
   * Sync faculty attendance updates
   */
  syncFacultyAttendanceUpdate(attendanceData) {
    try {
      const { facultyId, date, status, workingHours, markedBy, department } = attendanceData;
      
      const updatePayload = {
        facultyId,
        date,
        status,
        workingHours,
        markedBy,
        department,
        timestamp: new Date().toISOString()
      };

      // Send to admin portal
      this.io.to('admin-portal').emit(this.syncEvents.FACULTY_ATTENDANCE_UPDATE, updatePayload);

      // Send to specific faculty
      this.io.to(`user-${facultyId}`).emit(this.syncEvents.FACULTY_ATTENDANCE_UPDATE, updatePayload);

      // Send to department room
      if (department) {
        this.io.to(`dept-${department}`).emit(this.syncEvents.FACULTY_ATTENDANCE_UPDATE, updatePayload);
      }

      console.log(`✅ Faculty attendance update synced for ${facultyId}`);
    } catch (error) {
      console.error('❌ Failed to sync faculty attendance update:', error);
    }
  }

  /**
   * Sync section assignment changes
   */
  syncSectionAssignmentUpdate(assignmentData) {
    try {
      const { facultyId, assignedSections, assignedDepartments, classAdvisorOf, updatedBy } = assignmentData;
      
      const updatePayload = {
        facultyId,
        assignedSections,
        assignedDepartments,
        classAdvisorOf,
        updatedBy,
        timestamp: new Date().toISOString()
      };

      // Send to admin portal
      this.io.to('admin-portal').emit(this.syncEvents.SECTION_ASSIGNMENT_UPDATE, updatePayload);

      // Send to specific faculty
      this.io.to(`user-${facultyId}`).emit(this.syncEvents.SECTION_ASSIGNMENT_UPDATE, updatePayload);

      // Send to all faculty (they might need to know about changes)
      this.io.to('faculty-portal').emit(this.syncEvents.SECTION_ASSIGNMENT_UPDATE, updatePayload);

      // Notify students in newly assigned sections
      if (assignedSections && assignedSections.length > 0) {
        assignedSections.forEach(section => {
          this.io.to(`section-${section}`).emit(this.syncEvents.SECTION_ASSIGNMENT_UPDATE, updatePayload);
        });
      }

      console.log(`✅ Section assignment update synced for faculty ${facultyId}`);
    } catch (error) {
      console.error('❌ Failed to sync section assignment update:', error);
    }
  }

  /**
   * Sync AI analysis updates
   */
  syncAIAnalysisUpdate(analysisData) {
    try {
      const { studentId, facultyId, analysisType, predictions, recommendations, confidenceScore } = analysisData;
      
      const updatePayload = {
        studentId,
        facultyId,
        analysisType,
        predictions,
        recommendations,
        confidenceScore,
        timestamp: new Date().toISOString()
      };

      // Send to admin portal
      this.io.to('admin-portal').emit(this.syncEvents.AI_ANALYSIS_UPDATE, updatePayload);

      // Send to specific student if student-specific analysis
      if (studentId) {
        this.io.to(`user-${studentId}`).emit(this.syncEvents.AI_ANALYSIS_UPDATE, updatePayload);
      }

      // Send to specific faculty if faculty-specific analysis
      if (facultyId) {
        this.io.to(`user-${facultyId}`).emit(this.syncEvents.AI_ANALYSIS_UPDATE, updatePayload);
      }

      console.log(`✅ AI analysis update synced for ${analysisType}`);
    } catch (error) {
      console.error('❌ Failed to sync AI analysis update:', error);
    }
  }

  /**
   * Sync general notifications across portals
   */
  syncNotification(notificationData) {
    try {
      const { targetRole, targetUsers, targetSections, targetDepartments, notification } = notificationData;
      
      const updatePayload = {
        ...notification,
        timestamp: new Date().toISOString()
      };

      // Send to specific role
      if (targetRole) {
        if (targetRole === 'all') {
          this.io.emit(this.syncEvents.NOTIFICATION_NEW, updatePayload);
        } else {
          this.io.to(`${targetRole}-portal`).emit(this.syncEvents.NOTIFICATION_NEW, updatePayload);
        }
      }

      // Send to specific users
      if (targetUsers && targetUsers.length > 0) {
        targetUsers.forEach(userId => {
          this.io.to(`user-${userId}`).emit(this.syncEvents.NOTIFICATION_NEW, updatePayload);
        });
      }

      // Send to specific sections
      if (targetSections && targetSections.length > 0) {
        targetSections.forEach(section => {
          this.io.to(`section-${section}`).emit(this.syncEvents.NOTIFICATION_NEW, updatePayload);
        });
      }

      // Send to specific departments
      if (targetDepartments && targetDepartments.length > 0) {
        targetDepartments.forEach(department => {
          this.io.to(`dept-${department}`).emit(this.syncEvents.NOTIFICATION_NEW, updatePayload);
        });
      }

      console.log(`✅ Notification synced to ${targetRole || 'specific targets'}`);
    } catch (error) {
      console.error('❌ Failed to sync notification:', error);
    }
  }

  /**
   * Sync profile updates (generic)
   */
  syncProfileUpdate(profileData) {
    try {
      const { userId, userType, changes, updatedBy } = profileData;
      
      const updatePayload = {
        userId,
        userType,
        changes,
        updatedBy,
        timestamp: new Date().toISOString()
      };

      // Send to admin portal
      this.io.to('admin-portal').emit(this.syncEvents.PROFILE_UPDATE, updatePayload);

      // Send to specific user
      this.io.to(`user-${userId}`).emit(this.syncEvents.PROFILE_UPDATE, updatePayload);

      // Send to appropriate portal
      if (userType === 'student') {
        this.io.to('student-portal').emit(this.syncEvents.PROFILE_UPDATE, updatePayload);
      } else if (userType === 'faculty') {
        this.io.to('faculty-portal').emit(this.syncEvents.PROFILE_UPDATE, updatePayload);
      }

      console.log(`✅ Profile update synced for ${userType} ${userId}`);
    } catch (error) {
      console.error('❌ Failed to sync profile update:', error);
    }
  }

  /**
   * Get sync event types (for reference)
   */
  getSyncEvents() {
    return this.syncEvents;
  }

  /**
   * Send custom sync event
   */
  customSync(eventName, data, targets) {
    try {
      const updatePayload = {
        ...data,
        timestamp: new Date().toISOString()
      };

      if (targets.rooms) {
        targets.rooms.forEach(room => {
          this.io.to(room).emit(eventName, updatePayload);
        });
      }

      if (targets.users) {
        targets.users.forEach(userId => {
          this.io.to(`user-${userId}`).emit(eventName, updatePayload);
        });
      }

      if (targets.broadcast) {
        this.io.emit(eventName, updatePayload);
      }

      console.log(`✅ Custom sync event '${eventName}' sent`);
    } catch (error) {
      console.error(`❌ Failed to send custom sync event '${eventName}':`, error);
    }
  }

  /**
   * Batch sync multiple updates
   */
  batchSync(updates) {
    try {
      updates.forEach(update => {
        const { type, data } = update;
        
        switch (type) {
          case 'attendance':
            this.syncAttendanceUpdate(data);
            break;
          case 'grade':
            this.syncGradeUpdate(data);
            break;
          case 'student':
            this.syncStudentUpdate(data);
            break;
          case 'faculty':
            this.syncFacultyUpdate(data);
            break;
          case 'facultyAttendance':
            this.syncFacultyAttendanceUpdate(data);
            break;
          case 'notification':
            this.syncNotification(data);
            break;
          case 'aiAnalysis':
            this.syncAIAnalysisUpdate(data);
            break;
          default:
            console.warn(`⚠️ Unknown sync type: ${type}`);
        }
      });

      console.log(`✅ Batch sync completed for ${updates.length} updates`);
    } catch (error) {
      console.error('❌ Failed to batch sync updates:', error);
    }
  }
}

module.exports = DataSyncService;