import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard, Users, BookOpen, GraduationCap, FileText,
  ClipboardList, Library, Receipt, MessageSquare, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle, Activity, Brain, Zap, Eye, Download,
  Filter, Search, Bell, Star, Heart, ArrowUpRight, ArrowDownRight,
  MoreHorizontal, Sparkles, Target, Award, Calendar, Clock,
  BarChart3, PieChart, LineChart, Settings, Shield, Cpu, Loader
} from 'lucide-react';
import {
  LineChart as RechartsLine,
  BarChart as RechartsBar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { studentsAPI, facultyAPI, analyticsAPI, aiAPI, notificationsAPI } from '../services/api';

const ModernAdminDashboard = () => {
  // State for real data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState({
    students: [],
    faculty: [],
    stats: null,
    analytics: null,
    notifications: []
  });
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [activeAIFeature, setActiveAIFeature] = useState('insights');
  const [aiRecommendations, setAIRecommendations] = useState([]);

  // Load dashboard data from API
  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      // Load data in parallel
      const [
        studentsResponse,
        facultyResponse,
        statsResponse,
        analyticsResponse,
        notificationsResponse,
        aiInsightsResponse
      ] = await Promise.allSettled([
        studentsAPI.getAll({ limit: 10 }),
        facultyAPI.getAll({ limit: 10 }),
        analyticsAPI.getDashboardStats('admin'),
        analyticsAPI.getAttendanceAnalytics({ period: selectedPeriod }),
        notificationsAPI.getAll({ limit: 5 }),
        aiAPI.generateRecommendations('dashboard', { period: selectedPeriod })
      ]);

      // Process successful responses
      const newData = {
        students: studentsResponse.status === 'fulfilled' ? studentsResponse.value.data?.students || [] : [],
        faculty: facultyResponse.status === 'fulfilled' ? facultyResponse.value.data?.faculties || [] : [],
        stats: statsResponse.status === 'fulfilled' ? statsResponse.value.data || null : null,
        analytics: analyticsResponse.status === 'fulfilled' ? analyticsResponse.value.data || null : null,
        notifications: notificationsResponse.status === 'fulfilled' ? notificationsResponse.value.data || [] : []
      };

      // Process AI recommendations
      if (aiInsightsResponse.status === 'fulfilled') {
        setAIRecommendations(aiInsightsResponse.value.data || []);
      }

      setDashboardData(newData);

    } catch (err) {
      console.error('Dashboard data loading error:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics from real data
  const metrics = useMemo(() => {
    const { students, faculty, stats } = dashboardData;

    // Calculate student metrics
    const totalStudents = stats?.totalStudents || students.length;
    const activeStudents = stats?.activeStudents || students.filter(s => s.accountStatus === 'active').length;
    const studentTrend = stats?.studentTrend || 0;

    // Calculate faculty metrics
    const totalFaculty = stats?.totalFaculty || faculty.length;
    const activeFaculty = stats?.activeFaculty || faculty.filter(f => f.accountStatus === 'active').length;
    const facultyTrend = stats?.facultyTrend || 0;

    // Calculate other metrics from stats API or defaults
    return {
      students: {
        total: totalStudents,
        active: activeStudents,
        newThisMonth: stats?.newStudents || 0,
        trend: studentTrend,
        avgPerformance: stats?.avgStudentPerformance || 0,
        atRisk: stats?.studentsAtRisk || 0,
        graduated: stats?.graduatedStudents || 0
      },
      faculty: {
        total: totalFaculty,
        active: activeFaculty,
        newHires: stats?.newFaculty || 0,
        trend: facultyTrend,
        avgWorkload: stats?.avgFacultyWorkload || 0,
        satisfaction: stats?.facultySatisfaction || 0,
        onLeave: stats?.facultyOnLeave || 0
      },
      courses: {
        total: stats?.totalCourses || 0,
        active: stats?.activeCourses || 0,
        completion: stats?.courseCompletion || 0,
        trend: stats?.courseTrend || 0,
        mostPopular: stats?.mostPopularCourse || 'N/A',
        avgRating: stats?.avgCourseRating || 0,
        newCourses: stats?.newCourses || 0
      },
      system: {
        uptime: stats?.systemUptime || 100,
        responseTime: stats?.avgResponseTime || 0,
        totalTransactions: stats?.totalTransactions || 0,
        errorRate: stats?.errorRate || 0,
        securityAlerts: stats?.securityAlerts || 0
      }
    };
  }, [dashboardData]);

  // Chart data from real analytics
  const chartData = useMemo(() => {
    if (!dashboardData.analytics) {
      return {
        enrollment: [],
        performance: [],
        systemUsage: []
      };
    }

    return {
      enrollment: dashboardData.analytics.enrollmentTrend || [],
      performance: dashboardData.analytics.departmentPerformance || [],
      systemUsage: dashboardData.analytics.systemUsage || []
    };
  }, [dashboardData.analytics]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Loading Dashboard...</h2>
          <p className="text-gray-500 mt-2">Fetching real-time data from server</p>
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

  // Metric Card Component
  const MetricCard = ({ title, value, subtitle, trend, icon: Icon, color, description, isAI = false }) => (
    <div className={`bg-white p-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl border-l-4`} 
         style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl" style={{ backgroundColor: color + '20' }}>
          <Icon size={24} style={{ color }} />
        </div>
        {trend !== undefined && trend !== 0 && (
          <div className={`flex items-center gap-1 text-sm font-bold ${
            trend > 0 ? 'text-green-600' : 'text-red-500'
          }`}>
            {trend > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {`${Math.abs(trend)}%`}
          </div>
        )}
      </div>
      <div>
        <div className="text-3xl font-bold mb-2 text-gray-900">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <p className="text-sm font-semibold text-gray-700 mb-1">{title}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        {description && <p className="text-xs text-gray-600 mt-2">{description}</p>}
        {isAI && (
          <div className="flex items-center gap-1 mt-2">
            <Brain size={12} className="text-purple-600" />
            <span className="text-xs font-medium text-purple-600">AI Powered</span>
          </div>
        )}
      </div>
    </div>
  );

  // AI Insights Component
  const AIInsightsPanel = () => (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-purple-600 rounded-lg">
          <Brain className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">AI Insights & Recommendations</h3>
          <p className="text-sm text-gray-600">Real-time intelligence from your data</p>
        </div>
      </div>
      
      {aiRecommendations.length > 0 ? (
        <div className="space-y-4">
          {aiRecommendations.slice(0, 3).map((insight, index) => (
            <div key={insight.id || index} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  insight.priority === 'high' ? 'bg-red-100' :
                  insight.priority === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                }`}>
                  {insight.type === 'warning' ? <AlertTriangle size={16} className="text-red-600" /> :
                   insight.type === 'success' ? <CheckCircle size={16} className="text-green-600" /> :
                   <Zap size={16} className="text-blue-600" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{insight.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{insight.message}</p>
                  {insight.recommendation && (
                    <p className="text-sm font-medium text-purple-700">
                      💡 {insight.recommendation}
                    </p>
                  )}
                  {insight.confidence && (
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">
                        Confidence: {insight.confidence}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Brain className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>AI insights will appear here as data becomes available</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Real-time insights and system overview</p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="today">Today</option>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
              <option value="thisYear">This Year</option>
            </select>
            <button
              onClick={loadDashboardData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Activity size={16} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Students"
          value={metrics.students.total}
          subtitle={`${metrics.students.active} active`}
          trend={metrics.students.trend}
          icon={Users}
          color="#2563eb"
          description={`${metrics.students.newThisMonth} new this month`}
          isAI={true}
        />
        <MetricCard
          title="Faculty Members"
          value={metrics.faculty.total}
          subtitle={`${metrics.faculty.active} active`}
          trend={metrics.faculty.trend}
          icon={GraduationCap}
          color="#10b981"
          description={`${metrics.faculty.newHires} new hires`}
        />
        <MetricCard
          title="Active Courses"
          value={metrics.courses.active}
          subtitle={`${metrics.courses.total} total`}
          trend={metrics.courses.trend}
          icon={BookOpen}
          color="#f59e0b"
          description={`${metrics.courses.completion}% completion rate`}
        />
        <MetricCard
          title="System Uptime"
          value={`${metrics.system.uptime}%`}
          subtitle="Last 30 days"
          trend={metrics.system.uptime > 99 ? 1 : -1}
          icon={Activity}
          color="#8b5cf6"
          description={`${metrics.system.responseTime}s avg response time`}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Student Performance"
          value={`${metrics.students.avgPerformance}%`}
          subtitle="Average Grade"
          trend={metrics.students.avgPerformance > 80 ? 2 : -2}
          icon={Target}
          color="#dc2626"
          description={`${metrics.students.atRisk} students need attention`}
          isAI={true}
        />
        <MetricCard
          title="Faculty Satisfaction"
          value={`${metrics.faculty.satisfaction}%`}
          subtitle="Overall Rating"
          trend={metrics.faculty.satisfaction > 90 ? 3 : -1}
          icon={Heart}
          color="#059669"
          description={`${metrics.faculty.onLeave} currently on leave`}
        />
        <MetricCard
          title="Course Rating"
          value={`${metrics.courses.avgRating}/5.0`}
          subtitle="Student Feedback"
          trend={metrics.courses.avgRating > 4 ? 2 : -1}
          icon={Star}
          color="#7c3aed"
          description={`"${metrics.courses.mostPopular}" most popular`}
        />
      </div>

      {/* Charts and AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Enrollment Trends Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Enrollment Trends</h3>
            <LineChart className="h-5 w-5 text-blue-600" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLine data={chartData.enrollment}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="enrolled"
                  stroke="#2563eb"
                  fill="#2563eb"
                  fillOpacity={0.3}
                />
              </RechartsLine>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights Panel */}
        <AIInsightsPanel />
      </div>

      {/* Recent Activity & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Students */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Students</h3>
            <Eye className="h-5 w-5 text-blue-600" />
          </div>
          <div className="space-y-4">
            {dashboardData.students.slice(0, 5).map((student, index) => (
              <div key={student.id || index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{student.Full_Name}</h4>
                  <p className="text-sm text-gray-600">{student.Student_ID} • {student.Department}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    student.accountStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {student.accountStatus || 'Active'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Notifications */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">System Notifications</h3>
            <Bell className="h-5 w-5 text-blue-600" />
          </div>
          <div className="space-y-4">
            {dashboardData.notifications.length > 0 ? dashboardData.notifications.map((notification, index) => (
              <div key={notification.id || index} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg">
                <div className={`h-3 w-3 rounded-full mt-2 ${
                  notification.priority === 'high' ? 'bg-red-500' :
                  notification.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {notification.createdAt ? new Date(notification.createdAt).toLocaleDateString() : 'Today'}
                  </p>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No notifications at this time</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernAdminDashboard;