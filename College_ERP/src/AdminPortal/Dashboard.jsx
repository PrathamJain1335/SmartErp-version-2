import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard, Users, BookOpen, GraduationCap, FileText,
  ClipboardList, Library, Receipt, MessageSquare, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle, Activity, Brain, Zap, Eye, Download,
  Filter, Search, Bell, Star, Heart, ArrowUpRight, ArrowDownRight,
  MoreHorizontal, Sparkles, Target, Award, Calendar, Clock,
  BarChart3, PieChart, LineChart, Settings, Shield, Cpu
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

const ModernAdminDashboard = ({ data = {} }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  const [activeAIFeature, setActiveAIFeature] = useState('insights');
  const [isAnimating, setIsAnimating] = useState(false);
  const [userType, setUserType] = useState('student');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiRecommendations, setAIRecommendations] = useState([]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // AI-powered metrics calculation
  const aiMetrics = useMemo(() => {
    return {
      students: {
        total: 2847,
        active: 2654,
        newThisMonth: 143,
        trend: +12.5,
        avgPerformance: 85.4,
        atRisk: 89,
        graduated: 421
      },
      faculty: {
        total: 186,
        active: 173,
        newHires: 8,
        trend: +6.2,
        avgWorkload: 78.3,
        satisfaction: 92.1,
        onLeave: 13
      },
      courses: {
        total: 95,
        active: 87,
        completion: 89.7,
        trend: +4.1,
        mostPopular: 'Data Science',
        avgRating: 4.6,
        newCourses: 5
      },
      operations: {
        systemUptime: 99.97,
        avgResponseTime: 0.8,
        totalTransactions: 15643,
        errorRate: 0.02,
        securityAlerts: 2,
        backupsCompleted: 100
      }
    };
  }, []);

  // AI-generated insights
  useEffect(() => {
    const insights = [
      {
        id: 1,
        type: 'warning',
        title: 'Student Performance Alert',
        message: 'AI detected 15% decline in average grades for Computer Science courses this month.',
        recommendation: 'Consider scheduling additional tutoring sessions or reviewing course materials.',
        priority: 'high',
        confidence: 94
      },
      {
        id: 2,
        type: 'success',
        title: 'Faculty Optimization Success',
        message: 'AI-optimized schedules resulted in 23% improvement in faculty satisfaction.',
        recommendation: 'Apply similar optimization to remaining departments.',
        priority: 'medium',
        confidence: 87
      },
      {
        id: 3,
        type: 'info',
        title: 'Resource Allocation Insight',
        message: 'Predicted 18% increase in library usage during exam season.',
        recommendation: 'Extend library hours and increase staffing for next month.',
        priority: 'medium',
        confidence: 91
      },
      {
        id: 4,
        type: 'opportunity',
        title: 'Course Demand Prediction',
        message: 'AI forecasts high demand for AI/ML courses next semester.',
        recommendation: 'Consider adding 2-3 additional sections and hiring specialized faculty.',
        priority: 'low',
        confidence: 83
      }
    ];
    setAIRecommendations(insights);
  }, []);

  // Chart data for AI analytics
  const studentEnrollmentData = [
    { month: 'Jan', enrolled: 2456, graduated: 0, dropouts: 12 },
    { month: 'Feb', enrolled: 2489, graduated: 0, dropouts: 8 },
    { month: 'Mar', enrolled: 2502, graduated: 0, dropouts: 15 },
    { month: 'Apr', enrolled: 2534, graduated: 0, dropouts: 11 },
    { month: 'May', enrolled: 2587, graduated: 421, dropouts: 9 },
    { month: 'Jun', enrolled: 2623, graduated: 0, dropouts: 7 },
    { month: 'Jul', enrolled: 2678, graduated: 0, dropouts: 13 },
    { month: 'Aug', enrolled: 2734, graduated: 0, dropouts: 6 },
    { month: 'Sep', enrolled: 2847, graduated: 0, dropouts: 14 }
  ];

  const departmentPerformanceData = [
    { department: 'Computer Science', students: 645, avgGPA: 3.7, satisfaction: 89, color: '#dc2626' },
    { department: 'Engineering', students: 523, avgGPA: 3.6, satisfaction: 87, color: '#2563eb' },
    { department: 'Business', students: 467, avgGPA: 3.5, satisfaction: 91, color: '#10b981' },
    { department: 'Arts & Sciences', students: 389, avgGPA: 3.8, satisfaction: 93, color: '#f59e0b' },
    { department: 'Medicine', students: 298, avgGPA: 3.9, satisfaction: 95, color: '#7c3aed' },
    { department: 'Law', students: 234, avgGPA: 3.6, satisfaction: 88, color: '#db2777' }
  ];

  const systemPerformanceData = [
    { name: 'CPU Usage', value: 67, color: '#dc2626' },
    { name: 'Memory Usage', value: 73, color: '#f59e0b' },
    { name: 'Storage Usage', value: 45, color: '#10b981' },
    { name: 'Network Usage', value: 38, color: '#2563eb' }
  ];

  const aiPredictionsData = [
    { metric: 'Student Retention', current: 94.2, predicted: 95.8, improvement: +1.6 },
    { metric: 'Faculty Satisfaction', current: 92.1, predicted: 94.5, improvement: +2.4 },
    { metric: 'Course Completion', current: 89.7, predicted: 92.1, improvement: +2.4 },
    { metric: 'Resource Efficiency', current: 78.3, predicted: 82.7, improvement: +4.4 },
    { metric: 'Student Performance', current: 85.4, predicted: 87.9, improvement: +2.5 }
  ];

  // Component helper functions
  const MetricCard = ({ title, value, subtitle, trend, icon: Icon, color, description, isAI = false }) => (
    <div className={`bg-white p-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
      isAnimating ? 'animate-pulse' : ''
    } border-l-4`} style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl" style={{ backgroundColor: color + '20' }}>
          <Icon size={24} style={{ color }} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-bold ${
            trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-500' : 'text-gray-500'
          }`}>
            {trend > 0 ? <ArrowUpRight size={16} /> : trend < 0 ? <ArrowDownRight size={16} /> : null}
            {trend !== 0 && `${Math.abs(trend)}%`}
          </div>
        )}
      </div>
      <div>
        <div className="text-3xl font-bold mb-2 text-gray-900">{value}</div>
        <p className="text-sm font-semibold text-gray-700 mb-1">{title}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        {description && <p className="text-xs text-gray-600 mt-2">{description}</p>}
        {/* {isAI && (
          <div className="flex items-center gap-1 mt-2">
            <Brain size={12} className="text-purple-600" />
            <span className="text-xs font-medium text-purple-600">AI Powered</span>
          </div>
        )} */}
      </div>
    </div>
  );

  const AIInsightCard = ({ insight }) => {
    const typeColors = {
      warning: { bg: '#fef3cd', border: '#f59e0b', icon: AlertTriangle },
      success: { bg: '#d1fae5', border: '#10b981', icon: CheckCircle },
      info: { bg: '#dbeafe', border: '#3b82f6', icon: Brain },
      opportunity: { bg: '#f3e8ff', border: '#8b5cf6', icon: Target }
    };
    
    const config = typeColors[insight.type];
    const IconComponent = config.icon;
    
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 transition-all duration-300 hover:shadow-xl" 
           style={{ borderLeftColor: config.border }}>
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg" style={{ backgroundColor: config.bg }}>
            <IconComponent size={20} style={{ color: config.border }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-gray-900">{insight.title}</h4>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Brain size={12} className="text-purple-600" />
                  <span className="text-xs font-medium text-purple-600">{insight.confidence}%</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  insight.priority === 'high' ? 'bg-red-100 text-red-700' :
                  insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {insight.priority.toUpperCase()}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">{insight.message}</p>
            <div className="p-3 rounded-lg" style={{ backgroundColor: config.bg }}>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={14} style={{ color: config.border }} />
                <span className="text-xs font-semibold" style={{ color: config.border }}>AI Recommendation</span>
              </div>
              <p className="text-xs text-gray-700">{insight.recommendation}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* AI-Powered Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-8 rounded-2xl shadow-2xl mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {/* <Brain size={32} className="text-white" /> */}
                <h1 className="text-4xl font-bold">Admin Dashboard</h1>
              </div>
              <p className="text-red-100 text-lg">Intelligent insights and automated management for JECRC University</p>
            </div>
            <div className="flex items-center gap-4">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white backdrop-blur-sm"
              >
                <option value="today">Today</option>
                <option value="thisWeek">This Week</option>
                <option value="thisMonth">This Month</option>
                <option value="thisYear">This Year</option>
              </select>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                <Activity size={16} />
                <span className="text-sm font-medium">Live Monitoring</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      {/* AI Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Students"
          value={aiMetrics.students.total.toLocaleString()}
          subtitle={`${aiMetrics.students.active} active • ${aiMetrics.students.atRisk} at risk`}
          trend={aiMetrics.students.trend}
          icon={GraduationCap}
          color="#dc2626"
          description="AI monitoring student engagement patterns"
          isAI={true}
        />
        <MetricCard
          title="Faculty Members"
          value={aiMetrics.faculty.total}
          subtitle={`${aiMetrics.faculty.active} active • ${aiMetrics.faculty.onLeave} on leave`}
          trend={aiMetrics.faculty.trend}
          icon={Users}
          color="#2563eb"
          description={`Satisfaction: ${aiMetrics.faculty.satisfaction}%`}
          isAI={true}
        />
        <MetricCard
          title="Active Courses"
          value={aiMetrics.courses.active}
          subtitle={`${aiMetrics.courses.total} total • ${aiMetrics.courses.completion}% completion`}
          trend={aiMetrics.courses.trend}
          icon={BookOpen}
          color="#10b981"
          description={`Avg Rating: ${aiMetrics.courses.avgRating}/5.0`}
          isAI={true}
        />
        <MetricCard
          title="System Health"
          value={`${aiMetrics.operations.systemUptime}%`}
          subtitle={`${aiMetrics.operations.avgResponseTime}s avg response • ${aiMetrics.operations.securityAlerts} alerts`}
          trend={0}
          icon={Shield}
          color="#7c3aed"
          description="AI-powered system monitoring"
          isAI={true}
        />
      </div>

      {/* AI Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Student Enrollment Trends */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Student Enrollment Trends</h3>
            <div className="flex items-center gap-2">
              <Brain size={16} className="text-purple-600" />
              <span className="text-sm font-medium text-purple-600">AI Analyzed</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={studentEnrollmentData}>
                <defs>
                  <linearGradient id="enrollmentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: '#111827'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="enrolled"
                  stroke="#dc2626"
                  fillOpacity={1}
                  fill="url(#enrollmentGradient)"
                  strokeWidth={3}
                />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Performance */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Department Performance</h3>
            <div className="flex items-center gap-2">
              <Target size={16} className="text-green-600" />
              <span className="text-sm font-medium text-green-600">Real-time</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBar data={departmentPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="department" stroke="#6b7280" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: '#111827'
                  }}
                />
                <RechartsBar dataKey="students" radius={[4, 4, 0, 0]}>
                  {departmentPerformanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </RechartsBar>
                <Legend />
              </RechartsBar>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Predictions & System Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* AI Predictions */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">AI Performance Predictions</h3>
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-yellow-600" />
              <span className="text-sm font-medium text-yellow-600">Next Month</span>
            </div>
          </div>
          <div className="space-y-4">
            {aiPredictionsData.map((prediction, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{prediction.metric}</h4>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="text-sm text-gray-600">
                      Current: <span className="font-medium">{prediction.current}%</span>
                    </div>
                    <div className="text-sm text-blue-600">
                      Predicted: <span className="font-medium">{prediction.predicted}%</span>
                    </div>
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                  prediction.improvement > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {prediction.improvement > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  <span className="text-sm font-medium">{prediction.improvement > 0 ? '+' : ''}{prediction.improvement}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Performance */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">System Performance</h3>
            <div className="flex items-center gap-2">
              <Cpu size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Live Monitoring</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={systemPerformanceData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  label={({ value }) => `${value}%`}
                >
                  {systemPerformanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: '#111827'
                  }}
                />
                <Legend />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Insights & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* AI Insights */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Brain size={24} className="text-purple-600" />
            <h3 className="text-2xl font-bold text-gray-900">AI-Generated Insights</h3>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
              Real-time Analysis
            </span>
          </div>
          {aiRecommendations.map((insight) => (
            <AIInsightCard key={insight.id} insight={insight} />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
          
          {/* AI-Powered User Creation */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={16} className="text-yellow-600" />
              <h4 className="text-lg font-semibold text-gray-900">Smart User Creation</h4>
            </div>
            <div className="flex gap-3 mb-4">
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  userType === 'student' 
                    ? 'bg-red-500 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setUserType('student')}
              >
                Student
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  userType === 'faculty' 
                    ? 'bg-red-500 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setUserType('faculty')}
              >
                Faculty
              </button>
            </div>
            <form className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                />
                <Brain size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
              </div>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder={userType === 'student' ? 'Student ID' : 'Faculty ID'}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
              >
                <div className="flex items-center justify-center gap-2">
                  <Sparkles size={16} />
                  AI Create {userType === 'student' ? 'Student' : 'Faculty'}
                </div>
              </button>
            </form>
          </div>

          {/* Quick Action Buttons */}
          <div className="space-y-3">
            <button className="w-full bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-left group border-l-4 border-blue-500">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <FileText size={20} className="text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Generate Reports</div>
                  <div className="text-sm text-gray-500">AI-powered analytics reports</div>
                </div>
              </div>
            </button>
            
            <button className="w-full bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-left group border-l-4 border-green-500">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <MessageSquare size={20} className="text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Communication Hub</div>
                  <div className="text-sm text-gray-500">Send smart notifications</div>
                </div>
              </div>
            </button>
            
            <button className="w-full bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-left group border-l-4 border-purple-500">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <Settings size={20} className="text-purple-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">AI Configuration</div>
                  <div className="text-sm text-gray-500">Optimize system settings</div>
                </div>
              </div>
            </button>
            
            <button className="w-full bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-left group border-l-4 border-yellow-500">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors">
                  <Shield size={20} className="text-yellow-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Security Center</div>
                  <div className="text-sm text-gray-500">Monitor system security</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Live Activity Feed</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live Updates</span>
            </div>
            <button className="text-red-500 text-sm font-medium hover:underline">View All</button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Student Activities */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Student Activities</h4>
            <div className="space-y-3">
              {[
                { user: 'Alice Johnson', action: 'Enrolled in AI Course', time: '2 min ago', type: 'enrollment' },
                { user: 'Bob Smith', action: 'Submitted Assignment', time: '5 min ago', type: 'assignment' },
                { user: 'Carol Davis', action: 'Payment Completed', time: '8 min ago', type: 'payment' },
                { user: 'David Wilson', action: 'Library Book Issued', time: '12 min ago', type: 'library' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'enrollment' ? 'bg-blue-500' :
                    activity.type === 'assignment' ? 'bg-green-500' :
                    activity.type === 'payment' ? 'bg-yellow-500' : 'bg-purple-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                    <p className="text-xs text-gray-600">{activity.action}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Faculty Activities */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Faculty Activities</h4>
            <div className="space-y-3">
              {[
                { user: 'Prof. Anderson', action: 'Created New Course', time: '3 min ago', type: 'course' },
                { user: 'Dr. Martinez', action: 'Updated Grades', time: '7 min ago', type: 'grading' },
                { user: 'Prof. Chen', action: 'Scheduled Exam', time: '10 min ago', type: 'exam' },
                { user: 'Dr. Patel', action: 'Meeting Scheduled', time: '15 min ago', type: 'meeting' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'course' ? 'bg-red-500' :
                    activity.type === 'grading' ? 'bg-green-500' :
                    activity.type === 'exam' ? 'bg-orange-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                    <p className="text-xs text-gray-600">{activity.action}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* System Activities */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">System Activities</h4>
            <div className="space-y-3">
              {[
                { event: 'Database Backup', status: 'Completed', time: '1 min ago', type: 'success' },
                { event: 'AI Model Update', status: 'In Progress', time: '4 min ago', type: 'progress' },
                { event: 'Security Scan', status: 'Completed', time: '9 min ago', type: 'success' },
                { event: 'System Maintenance', status: 'Scheduled', time: '20 min ago', type: 'scheduled' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'progress' ? 'bg-yellow-500 animate-pulse' :
                    activity.type === 'scheduled' ? 'bg-blue-500' : 'bg-gray-400'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.event}</p>
                    <p className="text-xs text-gray-600">{activity.status}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernAdminDashboard;
