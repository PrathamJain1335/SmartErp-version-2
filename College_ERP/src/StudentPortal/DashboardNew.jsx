import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen, Calendar, Clock, FileText, GraduationCap, User,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Bell,
  Activity, Target, Award, Star, BarChart3, PieChart, Loader,
  RefreshCw, Upload, Download, Eye, ChevronRight, X, CheckCircle2
} from 'lucide-react';
import {
  LineChart, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPie, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import {
  studentsAPI, attendanceAPI, assignmentsAPI, gradesAPI, examsAPI,
  coursesAPI, notificationsAPI, timetableAPI, authAPI
} from '../services/api';
import ProfilePhotoUpload from '../components/ProfilePhotoUpload';

const StudentDashboardNew = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    profile: null,
    attendance: [],
    assignments: [],
    grades: [],
    exams: [],
    courses: [],
    notifications: [],
    timetable: []
  });

  // UI state
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      // Get current user info
      const user = authAPI.getCurrentUser();
      if (!user.isAuthenticated || user.role !== 'student') {
        throw new Error('Please login as a student to access this dashboard');
      }

      setCurrentUser(user);

      // Load student-specific data in parallel
      const [
        profileResponse,
        attendanceResponse,
        assignmentsResponse,
        gradesResponse,
        examsResponse,
        coursesResponse,
        notificationsResponse,
        timetableResponse
      ] = await Promise.allSettled([
        studentsAPI.getById(user.userId),
        attendanceAPI.getStudentAttendance(user.userId),
        assignmentsAPI.getAll({ studentId: user.userId }),
        gradesAPI.getStudentGrades(user.userId),
        examsAPI.getAll({ studentId: user.userId }),
        coursesAPI.getAll({ studentId: user.userId }),
        notificationsAPI.getAll({ userId: user.userId, limit: 10 }),
        timetableAPI.getStudentTimetable(user.userId)
      ]);

      // Process successful responses
      const newData = {
        profile: profileResponse.status === 'fulfilled' ? profileResponse.value.data?.student : null,
        attendance: attendanceResponse.status === 'fulfilled' ? attendanceResponse.value.data || [] : [],
        assignments: assignmentsResponse.status === 'fulfilled' ? assignmentsResponse.value.data || [] : [],
        grades: gradesResponse.status === 'fulfilled' ? gradesResponse.value.data || [] : [],
        exams: examsResponse.status === 'fulfilled' ? examsResponse.value.data || [] : [],
        courses: coursesResponse.status === 'fulfilled' ? coursesResponse.value.data || [] : [],
        notifications: notificationsResponse.status === 'fulfilled' ? notificationsResponse.value.data || [] : [],
        timetable: timetableResponse.status === 'fulfilled' ? timetableResponse.value.data || [] : []
      };

      setDashboardData(newData);

    } catch (err) {
      console.error('Dashboard loading error:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics from real data
  const metrics = useMemo(() => {
    const { attendance, assignments, grades, exams } = dashboardData;

    // Attendance metrics
    const totalClasses = attendance.length;
    const attendedClasses = attendance.filter(a => a.status === 'present').length;
    const attendancePercentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;

    // Assignment metrics
    const pendingAssignments = assignments.filter(a => a.status === 'pending').length;
    const completedAssignments = assignments.filter(a => a.status === 'submitted').length;

    // Grade metrics
    const averageGrade = grades.length > 0 
      ? grades.reduce((sum, g) => sum + (g.marks || 0), 0) / grades.length 
      : 0;

    // Upcoming exams
    const upcomingExams = exams.filter(e => new Date(e.date) > new Date()).length;

    return {
      attendance: {
        percentage: attendancePercentage,
        present: attendedClasses,
        total: totalClasses
      },
      assignments: {
        pending: pendingAssignments,
        completed: completedAssignments,
        total: assignments.length
      },
      grades: {
        average: averageGrade.toFixed(1),
        total: grades.length
      },
      exams: {
        upcoming: upcomingExams,
        total: exams.length
      }
    };
  }, [dashboardData]);

  // Chart data for attendance trend
  const attendanceChartData = useMemo(() => {
    const { attendance } = dashboardData;
    
    // Group attendance by week
    const weeklyData = attendance.reduce((acc, record) => {
      const week = new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!acc[week]) {
        acc[week] = { week, present: 0, absent: 0 };
      }
      if (record.status === 'present') {
        acc[week].present++;
      } else {
        acc[week].absent++;
      }
      return acc;
    }, {});

    return Object.values(weeklyData).slice(-7); // Last 7 weeks
  }, [dashboardData.attendance]);

  // Grade distribution data
  const gradeDistributionData = useMemo(() => {
    const { grades } = dashboardData;
    
    const distribution = grades.reduce((acc, grade) => {
      const subject = grade.subject || 'Unknown';
      acc.push({
        subject: subject.substring(0, 15) + (subject.length > 15 ? '...' : ''),
        marks: grade.marks || 0,
        maxMarks: grade.maxMarks || 100
      });
      return acc;
    }, []);

    return distribution.slice(0, 6); // Show top 6 subjects
  }, [dashboardData.grades]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Loading Dashboard...</h2>
          <p className="text-gray-500 mt-2">Fetching your academic data</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Unable to Load Dashboard</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Welcome Section
  const WelcomeSection = () => (
    <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-8 rounded-xl mb-8 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {dashboardData.profile?.Full_Name?.split(' ')[0] || 'Student'}!
          </h1>
          <p className="text-blue-100 text-lg">
            You have {metrics.assignments.pending} pending assignments and {metrics.exams.upcoming} upcoming exams
          </p>
        </div>
        <div className="flex items-center gap-4">
          {dashboardData.profile && (
            <div className="text-right">
              <div className="h-16 w-16 rounded-full overflow-hidden bg-white/20 border-2 border-white/30">
                {dashboardData.profile.profilePhotoUrl ? (
                  <img
                    src={`http://localhost:5000${dashboardData.profile.profilePhotoUrl}`}
                    alt={dashboardData.profile.Full_Name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Metric Card Component
  const MetricCard = ({ title, value, subtitle, icon: Icon, color, trend }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-lg" style={{ backgroundColor: color + '20' }}>
          <Icon size={24} style={{ color }} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend > 0 ? 'text-green-600' : 'text-red-500'
          }`}>
            {trend > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
        <p className="text-sm font-medium text-gray-700">{title}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );

  // Assignment Modal
  const AssignmentModal = ({ assignment, onClose }) => {
    if (!assignment) return null;

    const handleSubmit = async (assignmentId, file) => {
      try {
        const formData = new FormData();
        formData.append('submission', file);
        await assignmentsAPI.submit(assignmentId, formData);
        loadDashboardData(); // Refresh data
        onClose();
      } catch (err) {
        console.error('Assignment submission failed:', err);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">{assignment.title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Assignment Details</h3>
              <p className="text-gray-600 mb-4">{assignment.description || 'No description available'}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Subject:</span>
                  <p className="text-gray-900">{assignment.subject || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Due Date:</span>
                  <p className="text-gray-900">{new Date(assignment.dueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    assignment.status === 'submitted' ? 'bg-green-100 text-green-800' :
                    assignment.status === 'graded' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {assignment.status?.charAt(0).toUpperCase() + assignment.status?.slice(1)}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Max Marks:</span>
                  <p className="text-gray-900">{assignment.maxMarks || 'N/A'}</p>
                </div>
              </div>
            </div>

            {assignment.status === 'pending' && (
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Submit Assignment</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Upload your assignment file</p>
                  <input
                    type="file"
                    className="hidden"
                    id={`assignment-upload-${assignment.id}`}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) handleSubmit(assignment.id, file);
                    }}
                  />
                  <label
                    htmlFor={`assignment-upload-${assignment.id}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                  >
                    Choose File
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600">
            {dashboardData.profile?.Student_ID} • {dashboardData.profile?.Department}
          </p>
        </div>
        <button
          onClick={loadDashboardData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Welcome Section */}
      <WelcomeSection />

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Overall Attendance"
          value={`${metrics.attendance.percentage}%`}
          subtitle={`${metrics.attendance.present} of ${metrics.attendance.total} classes`}
          icon={BarChart3}
          color="#10b981"
          trend={metrics.attendance.percentage > 75 ? 5 : -3}
        />
        <MetricCard
          title="Pending Assignments"
          value={metrics.assignments.pending}
          subtitle={`${metrics.assignments.completed} completed`}
          icon={FileText}
          color="#f59e0b"
        />
        <MetricCard
          title="Average Grade"
          value={metrics.grades.average}
          subtitle={`Based on ${metrics.grades.total} subjects`}
          icon={Target}
          color="#8b5cf6"
          trend={metrics.grades.average > 75 ? 8 : -2}
        />
        <MetricCard
          title="Upcoming Exams"
          value={metrics.exams.upcoming}
          subtitle={`${metrics.exams.total} total exams`}
          icon={Calendar}
          color="#ef4444"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Attendance Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Attendance Trend</h3>
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="present"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="absent"
                  stackId="1"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade Performance */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Grade Performance</h3>
            <PieChart className="h-5 w-5 text-purple-600" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="marks" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Assignments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Assignments</h3>
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="p-6">
            {dashboardData.assignments.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.assignments.slice(0, 5).map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedAssignment(assignment);
                      setShowAssignmentModal(true);
                    }}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                      <p className="text-sm text-gray-600">{assignment.subject || 'Unknown Subject'}</p>
                      <p className="text-xs text-gray-500">
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        assignment.status === 'submitted' ? 'bg-green-100 text-green-800' :
                        assignment.status === 'graded' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {assignment.status?.charAt(0).toUpperCase() + assignment.status?.slice(1)}
                      </span>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No assignments found</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="p-6">
            {dashboardData.notifications.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.notifications.slice(0, 5).map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedNotification(notification);
                      setShowNotificationModal(true);
                    }}
                  >
                    <div className={`p-2 rounded-lg ${
                      notification.priority === 'high' ? 'bg-red-100' :
                      notification.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                    }`}>
                      <Bell size={16} className={
                        notification.priority === 'high' ? 'text-red-600' :
                        notification.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                      } />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{notification.title}</h4>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No notifications</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Photo Section */}
      {dashboardData.profile && (
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Photo</h3>
          <ProfilePhotoUpload
            currentUser={dashboardData.profile}
            onPhotoUpdate={(newPhotoUrl) => {
              setDashboardData(prev => ({
                ...prev,
                profile: {
                  ...prev.profile,
                  profilePhotoUrl: newPhotoUrl
                }
              }));
            }}
          />
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignmentModal && (
        <AssignmentModal
          assignment={selectedAssignment}
          onClose={() => {
            setShowAssignmentModal(false);
            setSelectedAssignment(null);
          }}
        />
      )}

      {/* Notification Modal */}
      {showNotificationModal && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">{selectedNotification.title}</h2>
              <button
                onClick={() => {
                  setShowNotificationModal(false);
                  setSelectedNotification(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">{selectedNotification.message}</p>
              <div className="text-sm text-gray-500">
                {new Date(selectedNotification.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboardNew;