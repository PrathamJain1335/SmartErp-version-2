import React, { useState, useEffect, useMemo } from 'react';
import {
  Users, BookOpen, FileText, Clock, TrendingUp, TrendingDown,
  Calendar, Award, AlertTriangle, CheckCircle, Activity, 
  BarChart3, PieChart, LineChart, Target, Brain, Zap,
  Eye, Download, Filter, Search, Bell, Star, Heart,
  ArrowUpRight, ArrowDownRight, MoreHorizontal, Sparkles,
  GraduationCap, ClipboardList, MessageSquare, Settings, 
  ChevronRight, Loader, RefreshCw, User, X, Edit
} from 'lucide-react';
import {
  LineChart as RechartsLine, BarChart as RechartsBar, PieChart as RechartsPie,
  Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, Area, AreaChart, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, Bar
} from 'recharts';
import {
  facultyAPI, studentsAPI, assignmentsAPI, attendanceAPI, gradesAPI,
  coursesAPI, notificationsAPI, analyticsAPI, authAPI
} from '../services/api';
import ProfilePhotoUpload from '../components/ProfilePhotoUpload';

const FacultyDashboardNew = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    profile: null,
    students: [],
    assignments: [],
    attendance: [],
    grades: [],
    courses: [],
    notifications: [],
    analytics: null
  });

  // UI state
  const [selectedPeriod, setSelectedPeriod] = useState('thisWeek');
  const [activeMetric, setActiveMetric] = useState('students');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      // Get current user info
      const user = authAPI.getCurrentUser();
      if (!user.isAuthenticated || user.role !== 'faculty') {
        throw new Error('Please login as faculty to access this dashboard');
      }

      setCurrentUser(user);

      // Load faculty-specific data in parallel
      const [
        profileResponse,
        studentsResponse,
        assignmentsResponse,
        attendanceResponse,
        gradesResponse,
        coursesResponse,
        notificationsResponse,
        analyticsResponse
      ] = await Promise.allSettled([
        facultyAPI.getById(user.userId),
        facultyAPI.getStudents(user.userId),
        assignmentsAPI.getAll({ facultyId: user.userId }),
        attendanceAPI.getFacultyAttendance(user.userId, { period: selectedPeriod }),
        gradesAPI.getClassGrades(user.userId),
        coursesAPI.getAll({ facultyId: user.userId }),
        notificationsAPI.getAll({ userId: user.userId, limit: 10 }),
        analyticsAPI.getFacultyPerformance(user.userId)
      ]);

      // Process successful responses
      const newData = {
        profile: profileResponse.status === 'fulfilled' ? profileResponse.value.data : null,
        students: studentsResponse.status === 'fulfilled' ? studentsResponse.value.data || [] : [],
        assignments: assignmentsResponse.status === 'fulfilled' ? assignmentsResponse.value.data || [] : [],
        attendance: attendanceResponse.status === 'fulfilled' ? attendanceResponse.value.data || [] : [],
        grades: gradesResponse.status === 'fulfilled' ? gradesResponse.value.data || [] : [],
        courses: coursesResponse.status === 'fulfilled' ? coursesResponse.value.data || [] : [],
        notifications: notificationsResponse.status === 'fulfilled' ? notificationsResponse.value.data || [] : [],
        analytics: analyticsResponse.status === 'fulfilled' ? analyticsResponse.value.data : null
      };

      setDashboardData(newData);

    } catch (err) {
      console.error('Faculty dashboard loading error:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics from real data
  const metrics = useMemo(() => {
    const { students, assignments, attendance, courses, analytics } = dashboardData;

    // Student metrics
    const totalStudents = students.length;
    const activeStudents = students.filter(s => 
      s.lastLoginDate && new Date() - new Date(s.lastLoginDate) < 7 * 24 * 60 * 60 * 1000
    ).length;

    // Assignment metrics
    const totalAssignments = assignments.length;
    const pendingGrading = assignments.filter(a => a.status === 'submitted' && !a.graded).length;
    const gradedAssignments = assignments.filter(a => a.graded).length;

    // Attendance metrics
    const avgAttendance = attendance.length > 0 
      ? attendance.reduce((sum, a) => sum + (a.attendanceRate || 0), 0) / attendance.length 
      : 0;

    // Course metrics
    const activeCourses = courses.filter(c => c.status === 'active').length;

    return {
      students: {
        total: totalStudents,
        active: activeStudents,
        trend: analytics?.studentGrowth || 0,
        avgPerformance: analytics?.avgStudentPerformance || 0,
        attendance: avgAttendance.toFixed(1)
      },
      assignments: {
        total: totalAssignments,
        pending: pendingGrading,
        graded: gradedAssignments,
        trend: analytics?.assignmentTrend || 0,
        avgScore: analytics?.avgAssignmentScore || 0
      },
      courses: {
        total: courses.length,
        active: activeCourses,
        trend: analytics?.courseEngagement || 0,
        completion: analytics?.courseCompletion || 0,
        satisfaction: analytics?.courseSatisfaction || 0
      },
      performance: {
        teaching: analytics?.teachingScore || 0,
        feedback: analytics?.studentFeedback || 0,
        engagement: analytics?.classEngagement || 0
      }
    };
  }, [dashboardData]);

  // Chart data processing
  const chartData = useMemo(() => {
    const { attendance, grades } = dashboardData;

    // Attendance trend data
    const attendanceData = attendance.slice(-7).map(record => ({
      date: new Date(record.date).toLocaleDateString('en-US', { weekday: 'short' }),
      attendance: record.attendanceRate || 0,
      engagement: record.engagementScore || 0
    }));

    // Grade distribution data
    const gradeDistribution = grades.reduce((acc, grade) => {
      const gradeLevel = grade.grade >= 90 ? 'A' :
                        grade.grade >= 80 ? 'B' :
                        grade.grade >= 70 ? 'C' :
                        grade.grade >= 60 ? 'D' : 'F';
      
      const existing = acc.find(item => item.name === gradeLevel);
      if (existing) {
        existing.value++;
      } else {
        acc.push({ name: gradeLevel, value: 1 });
      }
      return acc;
    }, []);

    return {
      attendance: attendanceData,
      grades: gradeDistribution
    };
  }, [dashboardData.attendance, dashboardData.grades]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Loading Faculty Dashboard...</h2>
          <p className="text-gray-500 mt-2">Fetching your teaching data</p>
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
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Welcome Section
  const WelcomeSection = () => (
    <div className="bg-gradient-to-r from-red-600 to-pink-700 text-white p-8 rounded-xl mb-8 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome, Prof. {dashboardData.profile?.Full_Name?.split(' ')[0] || 'Faculty'}!
          </h1>
          <p className="text-red-100 text-lg">
            You have {metrics.assignments.pending} assignments to grade and {metrics.students.total} students in your classes
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
  const MetricCard = ({ title, value, subtitle, icon: Icon, color, trend, isActive, onClick }) => (
    <div
      className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer ${
        isActive ? 'ring-2 ring-red-500 ring-opacity-50 shadow-lg' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-lg" style={{ backgroundColor: color + '20' }}>
          <Icon size={24} style={{ color }} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend > 0 ? 'text-green-600' : 'text-red-500'
          }`}>
            {trend > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
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

  // AI Insight Card Component
  const SmartInsightCard = ({ title, insight, recommendation, priority = 'medium' }) => {
    const priorityColors = {
      high: '#ef4444',
      medium: '#f59e0b', 
      low: '#10b981'
    };

    return (
      <div className="bg-white p-4 rounded-xl shadow-sm border-l-4" style={{ borderLeftColor: priorityColors[priority] }}>
        <div className="flex items-start gap-3">
          <Brain size={20} style={{ color: priorityColors[priority] }} />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
            <p className="text-sm text-gray-600 mb-3">{insight}</p>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={14} className="text-red-600" />
                <span className="text-xs font-semibold text-red-600">AI Recommendation</span>
              </div>
              <p className="text-xs text-gray-700">{recommendation}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Student Modal Component
  const StudentModal = ({ student, onClose }) => {
    if (!student) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200">
                {student.profilePhotoUrl ? (
                  <img src={`http://localhost:5000${student.profilePhotoUrl}`} alt={student.Full_Name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-red-100">
                    <User size={20} className="text-red-600" />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{student.Full_Name}</h2>
                <p className="text-gray-600">{student.Student_ID} • {student.Department}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Academic Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Attendance:</span>
                    <span className="font-medium">{student.attendance || 'N/A'}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Grade:</span>
                    <span className="font-medium">{student.averageGrade || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Assignments:</span>
                    <span className="font-medium">{student.completedAssignments || 0}/{student.totalAssignments || 0}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600 block">Email:</span>
                    <span className="font-medium">{student.Email_ID || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Phone:</span>
                    <span className="font-medium">{student.Phone_No || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Section:</span>
                    <span className="font-medium">{student.Section || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-4">
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                <Edit size={16} />
                Edit Grades
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <MessageSquare size={16} />
                Send Message
              </button>
            </div>
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
          <h1 className="text-2xl font-bold text-gray-900">Faculty Dashboard</h1>
          <p className="text-gray-600">
            {dashboardData.profile?.Faculty_ID} • {dashboardData.profile?.Department}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="today">Today</option>
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
          </select>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Welcome Section */}
      <WelcomeSection />

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Students"
          value={metrics.students.total}
          subtitle={`${metrics.students.active} active`}
          icon={Users}
          color="#ef4444"
          trend={metrics.students.trend}
          isActive={activeMetric === 'students'}
          onClick={() => setActiveMetric('students')}
        />
        <MetricCard
          title="Pending Grading"
          value={metrics.assignments.pending}
          subtitle={`${metrics.assignments.graded} completed`}
          icon={FileText}
          color="#f59e0b"
          trend={metrics.assignments.trend}
          isActive={activeMetric === 'assignments'}
          onClick={() => setActiveMetric('assignments')}
        />
        <MetricCard
          title="Active Courses"
          value={metrics.courses.active}
          subtitle={`${metrics.courses.total} total`}
          icon={BookOpen}
          color="#10b981"
          trend={metrics.courses.trend}
          isActive={activeMetric === 'courses'}
          onClick={() => setActiveMetric('courses')}
        />
        <MetricCard
          title="Avg Attendance"
          value={`${metrics.students.attendance}%`}
          subtitle="Class participation"
          icon={BarChart3}
          color="#8b5cf6"
          trend={5}
        />
      </div>

      {/* Charts and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Attendance Trends */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Attendance & Engagement</h3>
            <BarChart3 className="h-5 w-5 text-red-600" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.attendance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="attendance" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                <Area type="monotone" dataKey="engagement" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Grade Distribution</h3>
            <PieChart className="h-5 w-5 text-red-600" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={chartData.grades}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.grades.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Students and AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Students */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Your Students</h3>
              <Users className="h-5 w-5 text-red-600" />
            </div>
          </div>
          <div className="p-6">
            {dashboardData.students.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.students.slice(0, 5).map((student) => (
                  <div
                    key={student.Student_ID}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedStudent(student);
                      setShowStudentModal(true);
                    }}
                  >
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                      {student.profilePhotoUrl ? (
                        <img src={`http://localhost:5000${student.profilePhotoUrl}`} alt={student.Full_Name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-red-100">
                          <User size={16} className="text-red-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{student.Full_Name}</h4>
                      <p className="text-sm text-gray-600">{student.Student_ID} • Section {student.Section}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-900">{student.averageGrade || 'N/A'}</span>
                      <p className="text-xs text-gray-500">Avg Grade</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No students assigned</p>
              </div>
            )}
          </div>
        </div>

        {/* AI Insights */}
        <div className="space-y-6">
          <SmartInsightCard
            title="Student Engagement Alert"
            insight="Class participation has decreased by 15% this week in your Data Structures course."
            recommendation="Consider introducing interactive elements or group discussions to boost engagement."
            priority="high"
          />
          <SmartInsightCard
            title="Grading Opportunity"
            insight="7 assignments submitted yesterday are pending review. Early feedback improves student performance."
            recommendation="Schedule 2 hours today for grading to maintain quick feedback turnaround."
            priority="medium"
          />
          <SmartInsightCard
            title="Performance Insight"
            insight="Students in Section A are outperforming Section B by 12% on recent assessments."
            recommendation="Review teaching approach for Section B or provide additional practice materials."
            priority="low"
          />
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

      {/* Student Detail Modal */}
      {showStudentModal && (
        <StudentModal
          student={selectedStudent}
          onClose={() => {
            setShowStudentModal(false);
            setSelectedStudent(null);
          }}
        />
      )}
    </div>
  );
};

export default FacultyDashboardNew;