import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, AlertTriangle, Info, Calendar, Clock, User, BookOpen, DollarSign, GraduationCap, Settings, Filter, Search, Trash2, Check, X, ChevronRight } from 'lucide-react';

// Comprehensive notification data for Student Portal
const initialNotifications = [
  {
    id: 1,
    type: 'academic',
    priority: 'high',
    title: 'Assignment Due Tomorrow',
    message: 'Your Computer Networks assignment is due tomorrow at 11:59 PM. Make sure to submit it on time.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: 'Assignment',
    actionRequired: true,
    actionText: 'View Assignment',
    icon: BookOpen
  },
  {
    id: 2,
    type: 'fee',
    priority: 'urgent',
    title: 'Fee Payment Reminder',
    message: 'Your semester fee payment of ₹50,000 is due in 3 days. Please make the payment to avoid late fees.',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: 'Finance',
    actionRequired: true,
    actionText: 'Pay Now',
    icon: DollarSign
  },
  {
    id: 3,
    type: 'exam',
    priority: 'high',
    title: 'Mid-term Exam Schedule Released',
    message: 'The mid-term examination schedule for all subjects has been published. Check your exam dates.',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: 'Examination',
    actionRequired: true,
    actionText: 'View Schedule',
    icon: GraduationCap
  },
  {
    id: 4,
    type: 'library',
    priority: 'medium',
    title: 'Library Book Return Reminder',
    message: 'You have 2 books due for return by September 25th. Renew or return to avoid fines.',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: 'Library',
    actionRequired: true,
    actionText: 'View Books',
    icon: BookOpen
  },
  {
    id: 5,
    type: 'attendance',
    priority: 'medium',
    title: 'Attendance Alert',
    message: 'Your attendance in Mathematics is below 75%. Attend upcoming classes to maintain eligibility.',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: 'Attendance',
    actionRequired: false,
    actionText: 'View Attendance',
    icon: CheckCircle2
  },
  {
    id: 6,
    type: 'announcement',
    priority: 'low',
    title: 'Career Fair 2025',
    message: 'Join us for the annual career fair on October 15th. 50+ companies will be participating.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: 'Events',
    actionRequired: true,
    actionText: 'Register',
    icon: User
  },
  {
    id: 7,
    type: 'result',
    priority: 'medium',
    title: 'Semester Results Published',
    message: 'Your semester 2 results have been published. CGPA: 8.7. Check detailed marks breakdown.',
    timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    read: true,
    category: 'Results',
    actionRequired: true,
    actionText: 'View Results',
    icon: GraduationCap
  },
  {
    id: 8,
    type: 'system',
    priority: 'low',
    title: 'System Maintenance',
    message: 'The student portal will be under maintenance on Sunday 2-4 AM. Plan your activities accordingly.',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    read: false,
    category: 'System',
    actionRequired: false,
    actionText: null,
    icon: Settings
  }
];

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState('all'); // all, unread, priority, category
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState(new Set());

  // Get unique categories
  const categories = ['all', ...new Set(notifications.map(n => n.category))];

  // Filter notifications based on current filters
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = searchTerm === '' || 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
      (filter === 'unread' && !notification.read) ||
      (filter === 'priority' && notification.priority === 'urgent');
    
    const matchesCategory = selectedCategory === 'all' || 
      notification.category === selectedCategory;
    
    return matchesSearch && matchesFilter && matchesCategory;
  });

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Delete notification
  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setSelectedNotifications(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  // Bulk delete selected notifications
  const deleteSelected = () => {
    setNotifications(prev => prev.filter(n => !selectedNotifications.has(n.id)));
    setSelectedNotifications(new Set());
  };

  // Toggle notification selection
  const toggleSelection = (id) => {
    const newSet = new Set(selectedNotifications);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedNotifications(newSet);
  };

  // Select all filtered notifications
  const selectAll = () => {
    const allIds = new Set(filteredNotifications.map(n => n.id));
    setSelectedNotifications(allIds);
  };

  // Clear all selections
  const clearSelection = () => {
    setSelectedNotifications(new Set());
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'var(--danger)';
      case 'high': return 'var(--accent)';
      case 'medium': return '#F59E0B';
      case 'low': return 'var(--muted)';
      default: return 'var(--text)';
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffMs = now - notificationTime;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const urgentCount = notifications.filter(n => n.priority === 'urgent' && !n.read).length;

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="flex items-center mb-6">
        <img src="/image.png" alt="JECRC University Logo" className="w-20 h-8 mr-4" />
        <div>
          <h2 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>Notification Center</h2>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            {unreadCount} unread notifications
            {urgentCount > 0 && `, ${urgentCount} urgent`}
          </p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="rounded-lg shadow-md p-4 mb-6" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--muted)' }} />
            <input
              type="text"
              placeholder="Search notifications..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg"
              style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <select
              className="px-3 py-2 border rounded-lg text-sm"
              style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread Only</option>
              <option value="priority">Urgent Only</option>
            </select>

            <select
              className="px-3 py-2 border rounded-lg text-sm"
              style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>

            <button
              onClick={markAllAsRead}
              className="px-4 py-2 text-sm rounded-lg transition-colors text-white"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              Mark All Read
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedNotifications.size > 0 && (
          <div className="mt-4 p-3 rounded-lg flex items-center justify-between" style={{ backgroundColor: 'var(--soft)' }}>
            <span className="text-sm" style={{ color: 'var(--text)' }}>
              {selectedNotifications.size} notification{selectedNotifications.size > 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={deleteSelected}
                className="px-3 py-1 text-sm rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Delete Selected
              </button>
              <button
                onClick={clearSelection}
                className="px-3 py-1 text-sm rounded border transition-colors"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
            <Bell className="mx-auto h-12 w-12 mb-4" style={{ color: 'var(--muted)' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text)' }}>No notifications found</h3>
            <p style={{ color: 'var(--muted)' }}>Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                  !notification.read ? 'ring-2 ring-opacity-20' : ''
                }`}
                style={{ 
                  backgroundColor: 'var(--card)', 
                  borderColor: notification.read ? 'var(--border)' : getPriorityColor(notification.priority),
                  ...(selectedNotifications.has(notification.id) && {
                    backgroundColor: 'var(--soft)',
                    borderColor: 'var(--accent)'
                  })
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Selection Checkbox */}
                  <div className="flex items-center pt-1">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.has(notification.id)}
                      onChange={() => toggleSelection(notification.id)}
                      className="rounded"
                    />
                  </div>

                  {/* Icon */}
                  <div 
                    className="p-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: 'var(--soft)' }}
                  >
                    <Icon 
                      className="h-5 w-5" 
                      style={{ color: getPriorityColor(notification.priority) }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 
                        className={`text-sm font-medium ${!notification.read ? 'font-semibold' : ''}`}
                        style={{ color: 'var(--text)' }}
                      >
                        {notification.title}
                      </h3>
                      <span 
                        className="px-2 py-1 text-xs rounded-full"
                        style={{ 
                          backgroundColor: getPriorityColor(notification.priority),
                          color: 'white'
                        }}
                      >
                        {notification.priority}
                      </span>
                      <span 
                        className="px-2 py-1 text-xs rounded border"
                        style={{ 
                          borderColor: 'var(--border)', 
                          color: 'var(--muted)',
                          backgroundColor: 'var(--hover)'
                        }}
                      >
                        {notification.category}
                      </span>
                    </div>
                    
                    <p className="text-sm mb-3" style={{ color: 'var(--muted)' }}>
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-xs flex items-center gap-1" style={{ color: 'var(--muted)' }}>
                          <Clock className="h-3 w-3" />
                          {formatTime(notification.timestamp)}
                        </span>
                        
                        {notification.actionRequired && notification.actionText && (
                          <button 
                            className="text-xs font-medium hover:underline flex items-center gap-1"
                            style={{ color: 'var(--accent)' }}
                          >
                            {notification.actionText}
                            <ChevronRight className="h-3 w-3" />
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 rounded-full hover:bg-opacity-20 transition-colors"
                            style={{ backgroundColor: 'var(--accent)', color: 'white' }}
                            title="Mark as read"
                          >
                            <Check className="h-3 w-3" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 rounded-full hover:bg-red-100 text-red-500 transition-colors"
                          title="Delete notification"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Quick Actions Footer */}
      {filteredNotifications.length > 0 && (
        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
          <div className="flex items-center justify-between">
            <div className="text-sm" style={{ color: 'var(--muted)' }}>
              Showing {filteredNotifications.length} of {notifications.length} notifications
            </div>
            <div className="flex gap-2">
              <button
                onClick={selectAll}
                className="text-sm px-3 py-1 border rounded transition-colors"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                Select All
              </button>
              <button
                onClick={clearSelection}
                className="text-sm px-3 py-1 border rounded transition-colors"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
