import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Clock, Mail, MessageSquare, Smartphone, Settings, Plus, X, CheckCircle, AlertTriangle } from 'lucide-react';

const PersonalizedFeeReminders = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [reminders, setReminders] = useState([
    {
      id: 1,
      title: 'Semester 3 Tuition Fee',
      amount: 87500,
      dueDate: '2024-09-30',
      reminderDays: [7, 3, 1],
      priority: 'high',
      status: 'upcoming',
      category: 'tuition'
    },
    {
      id: 2,
      title: 'Hostel Fee',
      amount: 50000,
      dueDate: '2024-09-30',
      reminderDays: [7, 3],
      priority: 'medium',
      status: 'upcoming',
      category: 'hostel'
    },
    {
      id: 3,
      title: 'Library Fine',
      amount: 500,
      dueDate: '2024-09-15',
      reminderDays: [3, 1],
      priority: 'low',
      status: 'overdue',
      category: 'fine'
    }
  ]);

  const [notificationSettings, setNotificationSettings] = useState({
    sms: true,
    email: true,
    whatsapp: false,
    inApp: true,
    reminderTimes: ['09:00', '18:00']
  });

  const [newReminder, setNewReminder] = useState({
    title: '',
    amount: '',
    dueDate: '',
    reminderDays: [7, 3, 1],
    priority: 'medium',
    category: 'tuition'
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Get days in month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days = [];
    
    // Add empty cells for previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  // Check if date has reminders
  const hasReminder = (day) => {
    if (!day) return false;
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return reminders.some(reminder => reminder.dueDate === dateStr);
  };

  // Get reminder for specific date
  const getReminderForDate = (day) => {
    if (!day) return null;
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return reminders.find(reminder => reminder.dueDate === dateStr);
  };

  // Get upcoming reminders
  const getUpcomingReminders = () => {
    const today = new Date();
    const upcoming = reminders.filter(reminder => {
      const dueDate = new Date(reminder.dueDate);
      const diffTime = dueDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 30;
    });
    return upcoming.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  };

  // Add new reminder
  const addReminder = () => {
    if (newReminder.title && newReminder.amount && newReminder.dueDate) {
      const reminder = {
        ...newReminder,
        id: Date.now(),
        amount: parseInt(newReminder.amount),
        status: 'upcoming'
      };
      setReminders([...reminders, reminder]);
      setNewReminder({
        title: '',
        amount: '',
        dueDate: '',
        reminderDays: [7, 3, 1],
        priority: 'medium',
        category: 'tuition'
      });
      setShowAddModal(false);
    }
  };

  // Delete reminder
  const deleteReminder = (id) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  // Navigate calendar
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = getDaysInMonth(currentDate);
  const upcomingReminders = getUpcomingReminders();

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-3 rounded-full">
              <Bell className="h-8 w-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Personalized Fee Reminders</h1>
              <p className="text-gray-600">Never miss a deadline with smart reminders</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Reminder
            </button>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </div>
        </div>

        {/* Fee Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="h-6 w-6" />
              <span className="text-sm font-medium">Total Fees Pending</span>
            </div>
            <div className="text-3xl font-bold">₹{reminders.reduce((acc, r) => acc + r.amount, 0).toLocaleString()}</div>
            <div className="text-sm opacity-90 mt-2">{reminders.length} upcoming payments</div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-6 w-6" />
              <span className="text-sm font-medium">Next Payment</span>
            </div>
            <div className="text-2xl font-bold">
              {upcomingReminders.length > 0 ? upcomingReminders[0].dueDate : 'No upcoming'}
            </div>
            <div className="text-sm opacity-90 mt-2">
              {upcomingReminders.length > 0 ? `₹${upcomingReminders[0].amount.toLocaleString()}` : 'payments'}
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="h-6 w-6" />
              <span className="text-sm font-medium">Last Payment Made</span>
            </div>
            <div className="text-2xl font-bold">₹50,000</div>
            <div className="text-sm opacity-90 mt-2">Aug 20, 2024</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar View */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex gap-2">
              <button onClick={previousMonth} className="p-2 hover:bg-gray-100 rounded-lg">
                ←
              </button>
              <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg">
                →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const reminder = getReminderForDate(day);
              const hasRem = hasReminder(day);
              
              return (
                <div
                  key={index}
                  className={`p-2 min-h-[40px] text-center cursor-pointer rounded-lg transition-colors ${
                    day 
                      ? hasRem 
                        ? reminder?.status === 'overdue'
                          ? 'bg-red-100 text-red-800 hover:bg-red-200'
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                        : 'hover:bg-gray-100'
                      : ''
                  }`}
                  onClick={() => setSelectedDate(day)}
                >
                  {day && (
                    <div>
                      <div className="text-sm">{day}</div>
                      {hasRem && (
                        <div className="w-2 h-2 bg-orange-500 rounded-full mx-auto mt-1"></div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {selectedDate && getReminderForDate(selectedDate) && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="font-medium text-blue-900">
                {getReminderForDate(selectedDate).title}
              </div>
              <div className="text-blue-700">
                ₹{getReminderForDate(selectedDate).amount.toLocaleString()}
              </div>
            </div>
          )}
        </div>

        {/* Upcoming Reminders */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Upcoming Deadlines
          </h2>

          <div className="space-y-4">
            {upcomingReminders.map(reminder => {
              const dueDate = new Date(reminder.dueDate);
              const today = new Date();
              const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
              
              return (
                <div
                  key={reminder.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    reminder.status === 'overdue' 
                      ? 'border-red-500 bg-red-50'
                      : daysLeft <= 3
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-blue-500 bg-blue-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{reminder.title}</h3>
                      <p className="text-sm text-gray-600">₹{reminder.amount.toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      Due: {reminder.dueDate}
                    </div>
                    <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                      reminder.status === 'overdue'
                        ? 'bg-red-100 text-red-800'
                        : daysLeft <= 3
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {reminder.status === 'overdue' 
                        ? `${Math.abs(daysLeft)} days overdue`
                        : daysLeft === 0 
                        ? 'Due today'
                        : `${daysLeft} days left`
                      }
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-1">
                      {notificationSettings.sms && <Smartphone className="h-4 w-4 text-green-600" />}
                      {notificationSettings.email && <Mail className="h-4 w-4 text-blue-600" />}
                      {notificationSettings.whatsapp && <MessageSquare className="h-4 w-4 text-green-600" />}
                    </div>
                    <div className="text-xs text-gray-500">
                      Reminders: {reminder.reminderDays.join(', ')} days before
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Notification Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-700 mb-4">Notification Channels</h3>
            <div className="space-y-3">
              {[
                { key: 'sms', label: 'SMS', icon: Smartphone },
                { key: 'email', label: 'Email', icon: Mail },
                { key: 'whatsapp', label: 'WhatsApp', icon: MessageSquare }
              ].map(({ key, label, icon: Icon }) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-gray-600" />
                    <span>{label}</span>
                  </div>
                  <button
                    onClick={() => setNotificationSettings({
                      ...notificationSettings,
                      [key]: !notificationSettings[key]
                    })}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      notificationSettings[key] ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      notificationSettings[key] ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700 mb-4">Reminder Times</h3>
            <div className="space-y-3">
              {notificationSettings.reminderTimes.map((time, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => {
                      const newTimes = [...notificationSettings.reminderTimes];
                      newTimes[index] = e.target.value;
                      setNotificationSettings({
                        ...notificationSettings,
                        reminderTimes: newTimes
                      });
                    }}
                    className="px-3 py-1 border border-gray-300 rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Reminder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Add New Reminder</h3>
              <button onClick={() => setShowAddModal(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  value={newReminder.amount}
                  onChange={(e) => setNewReminder({...newReminder, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={newReminder.dueDate}
                  onChange={(e) => setNewReminder({...newReminder, dueDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={newReminder.priority}
                  onChange={(e) => setNewReminder({...newReminder, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addReminder}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalizedFeeReminders;