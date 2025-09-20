const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

/**
 * @route GET /api/notifications
 * @desc Get notifications for current user
 * @access Private
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { userId, limit = 10, read } = req.query;
    const targetUserId = userId || req.user.id;
    
    // Students can only view their own notifications
    if (req.user.role === 'student' && targetUserId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only view your own notifications'
      });
    }
    
    // Mock notifications for demo (replace with actual database query)
    const mockNotifications = [
      {
        id: 1,
        type: 'assignment',
        title: 'New Assignment: Data Structures Lab',
        message: 'A new assignment has been posted for Data Structures Lab. Due date: March 25, 2025',
        priority: 'medium',
        read: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        category: 'academic'
      },
      {
        id: 2,
        type: 'attendance',
        title: 'Attendance Alert',
        message: 'Your attendance for Mathematics is below 75%. Please ensure regular attendance.',
        priority: 'high',
        read: false,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        category: 'warning'
      },
      {
        id: 3,
        type: 'exam',
        title: 'Mid-Semester Examination Schedule',
        message: 'Mid-semester examinations will commence from March 30, 2025. Check your timetable.',
        priority: 'high',
        read: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        category: 'exam'
      },
      {
        id: 4,
        type: 'general',
        title: 'Fee Reminder',
        message: 'Your semester fee payment is due by March 20, 2025. Please pay to avoid late fees.',
        priority: 'medium',
        read: false,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        category: 'finance'
      },
      {
        id: 5,
        type: 'announcement',
        title: 'College Event: Tech Fest 2025',
        message: 'Register for Tech Fest 2025 - Innovation Summit. Registration closes March 22, 2025.',
        priority: 'low',
        read: true,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        category: 'event'
      }
    ];
    
    // Filter by read status if specified
    let filteredNotifications = mockNotifications;
    if (read !== undefined) {
      const isRead = read === 'true';
      filteredNotifications = mockNotifications.filter(n => n.read === isRead);
    }
    
    // Apply limit
    const limitedNotifications = filteredNotifications.slice(0, parseInt(limit));
    
    res.json({
      success: true,
      data: {
        notifications: limitedNotifications,
        total: filteredNotifications.length,
        unreadCount: mockNotifications.filter(n => !n.read).length
      }
    });
    
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
});

/**
 * @route PUT /api/notifications/:id/read
 * @desc Mark notification as read
 * @access Private
 */
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock implementation - in real app, update database
    res.json({
      success: true,
      message: 'Notification marked as read',
      data: { id: parseInt(id), read: true }
    });
    
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message
    });
  }
});

module.exports = router;