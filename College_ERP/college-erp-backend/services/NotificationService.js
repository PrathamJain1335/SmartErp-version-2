class NotificationService {
  constructor(io) {
    this.io = io;
    console.log('📢 Notification Service initialized');
  }

  // Send notification to specific user
  async sendToUser(userId, notification) {
    try {
      this.io.to(`user-${userId}`).emit('new-notification', {
        ...notification,
        timestamp: new Date(),
        id: this.generateNotificationId()
      });

      console.log(`📬 Notification sent to user ${userId}:`, notification.title);
      return true;
    } catch (error) {
      console.error('Error sending user notification:', error);
      return false;
    }
  }

  // Send notification to all users of a specific role
  async sendToRole(role, notification) {
    try {
      this.io.to(`${role}-portal`).emit('new-notification', {
        ...notification,
        timestamp: new Date(),
        id: this.generateNotificationId()
      });

      console.log(`📢 Notification sent to ${role} portal:`, notification.title);
      return true;
    } catch (error) {
      console.error('Error sending role notification:', error);
      return false;
    }
  }

  // Send notification to multiple users
  async sendToUsers(userIds, notification) {
    try {
      const notificationWithId = {
        ...notification,
        timestamp: new Date(),
        id: this.generateNotificationId()
      };

      userIds.forEach(userId => {
        this.io.to(`user-${userId}`).emit('new-notification', notificationWithId);
      });

      console.log(`📬 Notification sent to ${userIds.length} users:`, notification.title);
      return true;
    } catch (error) {
      console.error('Error sending bulk notifications:', error);
      return false;
    }
  }

  // Send notification to specific section students
  async sendToSection(section, notification) {
    try {
      this.io.to(`section-${section}`).emit('new-notification', {
        ...notification,
        timestamp: new Date(),
        id: this.generateNotificationId()
      });

      console.log(`📚 Notification sent to section ${section}:`, notification.title);
      return true;
    } catch (error) {
      console.error('Error sending section notification:', error);
      return false;
    }
  }

  // Send notification to specific department
  async sendToDepartment(department, notification) {
    try {
      this.io.to(`dept-${department}`).emit('new-notification', {
        ...notification,
        timestamp: new Date(),
        id: this.generateNotificationId()
      });

      console.log(`🏢 Notification sent to department ${department}:`, notification.title);
      return true;
    } catch (error) {
      console.error('Error sending department notification:', error);
      return false;
    }
  }

  // Send attendance update notification
  async sendAttendanceUpdate(data) {
    try {
      // Notify admin portal
      this.io.to('admin-portal').emit('attendance-updated', {
        ...data,
        timestamp: new Date()
      });

      // Notify faculty portal
      this.io.to('faculty-portal').emit('attendance-updated', {
        ...data,
        timestamp: new Date()
      });

      // Notify specific section
      if (data.section) {
        this.io.to(`section-${data.section}`).emit('attendance-updated', {
          ...data,
          timestamp: new Date()
        });
      }

      // Notify specific student
      if (data.studentId) {
        this.io.to(`user-${data.studentId}`).emit('attendance-updated', {
          ...data,
          timestamp: new Date()
        });
      }

      console.log('📊 Attendance update broadcasted');
      return true;
    } catch (error) {
      console.error('Error sending attendance update:', error);
      return false;
    }
  }

  // Send grade update notification
  async sendGradeUpdate(data) {
    try {
      // Notify admin portal
      this.io.to('admin-portal').emit('grades-updated', {
        ...data,
        timestamp: new Date()
      });

      // Notify specific student
      if (data.studentId) {
        this.io.to(`user-${data.studentId}`).emit('grades-updated', {
          ...data,
          timestamp: new Date()
        });

        // Send notification to student
        await this.sendToUser(data.studentId, {
          title: 'Grade Updated',
          message: `Your grade for ${data.subject} has been updated to ${data.grade}`,
          type: 'info',
          priority: 'medium',
          data: {
            subject: data.subject,
            grade: data.grade,
            marks: data.marks
          }
        });
      }

      console.log('📈 Grade update broadcasted');
      return true;
    } catch (error) {
      console.error('Error sending grade update:', error);
      return false;
    }
  }

  // Send faculty attendance update
  async sendFacultyAttendanceUpdate(data) {
    try {
      // Notify admin portal
      this.io.to('admin-portal').emit('faculty-attendance-updated', {
        ...data,
        timestamp: new Date()
      });

      // Notify specific faculty member
      if (data.facultyId) {
        this.io.to(`user-${data.facultyId}`).emit('faculty-attendance-updated', {
          ...data,
          timestamp: new Date()
        });
      }

      console.log('👨‍🏫 Faculty attendance update broadcasted');
      return true;
    } catch (error) {
      console.error('Error sending faculty attendance update:', error);
      return false;
    }
  }

  // Send AI alert notification
  async sendAIAlert(data) {
    try {
      const notification = {
        title: `AI Alert: ${data.type}`,
        message: data.message,
        type: 'ai_alert',
        priority: data.priority || 'medium',
        data: data.details,
        timestamp: new Date(),
        id: this.generateNotificationId()
      };

      // Send to admin portal
      this.io.to('admin-portal').emit('ai-alert', notification);

      // Send to relevant faculty if student-specific
      if (data.studentId && data.facultyIds) {
        data.facultyIds.forEach(facultyId => {
          this.io.to(`user-${facultyId}`).emit('ai-alert', notification);
        });
      }

      // Send to specific user if applicable
      if (data.userId) {
        this.io.to(`user-${data.userId}`).emit('ai-alert', notification);
      }

      console.log('🤖 AI alert broadcasted:', data.type);
      return true;
    } catch (error) {
      console.error('Error sending AI alert:', error);
      return false;
    }
  }

  // Send system announcement
  async sendSystemAnnouncement(announcement) {
    try {
      const notification = {
        ...announcement,
        type: 'announcement',
        timestamp: new Date(),
        id: this.generateNotificationId()
      };

      // Broadcast to all connected users
      this.io.emit('system-announcement', notification);

      console.log('📣 System announcement broadcasted:', announcement.title);
      return true;
    } catch (error) {
      console.error('Error sending system announcement:', error);
      return false;
    }
  }

  // Send real-time data update
  async sendDataUpdate(updateType, data) {
    try {
      const update = {
        type: updateType,
        data: data,
        timestamp: new Date()
      };

      // Broadcast to relevant portals based on update type
      switch (updateType) {
        case 'student_data':
          this.io.to('admin-portal').emit('data-updated', update);
          this.io.to('faculty-portal').emit('data-updated', update);
          if (data.studentId) {
            this.io.to(`user-${data.studentId}`).emit('data-updated', update);
          }
          break;

        case 'faculty_data':
          this.io.to('admin-portal').emit('data-updated', update);
          if (data.facultyId) {
            this.io.to(`user-${data.facultyId}`).emit('data-updated', update);
          }
          break;

        case 'system_data':
          this.io.emit('data-updated', update);
          break;

        default:
          this.io.to('admin-portal').emit('data-updated', update);
      }

      console.log(`🔄 Data update broadcasted: ${updateType}`);
      return true;
    } catch (error) {
      console.error('Error sending data update:', error);
      return false;
    }
  }

  // Send emergency notification
  async sendEmergencyNotification(notification) {
    try {
      const emergencyNotification = {
        ...notification,
        type: 'emergency',
        priority: 'urgent',
        timestamp: new Date(),
        id: this.generateNotificationId()
      };

      // Broadcast to all connected users
      this.io.emit('emergency-notification', emergencyNotification);

      console.log('🚨 Emergency notification broadcasted:', notification.title);
      return true;
    } catch (error) {
      console.error('Error sending emergency notification:', error);
      return false;
    }
  }

  // Send typing indicator for chatbot
  async sendTypingIndicator(userId, isTyping) {
    try {
      this.io.to(`user-${userId}`).emit('chatbot-typing', { isTyping });
      return true;
    } catch (error) {
      console.error('Error sending typing indicator:', error);
      return false;
    }
  }

  // Send connection status update
  async sendConnectionStatus(userId, status) {
    try {
      this.io.to(`user-${userId}`).emit('connection-status', { 
        status,
        timestamp: new Date()
      });
      return true;
    } catch (error) {
      console.error('Error sending connection status:', error);
      return false;
    }
  }

  // Generate unique notification ID
  generateNotificationId() {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get notification statistics
  getStats() {
    const sockets = this.io.sockets.sockets;
    const connectedUsers = sockets.size;
    
    const roomStats = {};
    sockets.forEach(socket => {
      socket.rooms.forEach(room => {
        if (room !== socket.id) {
          roomStats[room] = (roomStats[room] || 0) + 1;
        }
      });
    });

    return {
      connectedUsers,
      roomStats,
      timestamp: new Date()
    };
  }

  // Send notification with retry logic
  async sendWithRetry(method, data, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await method(data);
        if (result) return true;
      } catch (error) {
        console.error(`Notification attempt ${attempt} failed:`, error);
        if (attempt === maxRetries) {
          console.error('Max retry attempts reached for notification');
          return false;
        }
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
    return false;
  }
}

module.exports = NotificationService;