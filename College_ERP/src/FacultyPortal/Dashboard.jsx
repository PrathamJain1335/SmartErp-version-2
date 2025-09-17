import React, { useState, useEffect, useMemo } from 'react';
import {
  Users, BookOpen, FileText, Clock, TrendingUp, TrendingDown,
  Calendar, Award, AlertTriangle, CheckCircle, Activity, 
  BarChart3, PieChart, LineChart, Target, Brain, Zap,
  Eye, Download, Filter, Search, Bell, Star, Heart,
  ArrowUpRight, ArrowDownRight, MoreHorizontal, Sparkles,
  GraduationCap, ClipboardList, MessageSquare, Settings, ChevronRight
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

const ModernFacultyDashboard = ({ data = {} }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('thisWeek');
  const [activeMetric, setActiveMetric] = useState('students');
  const [isAnimating, setIsAnimating] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Enhanced metrics calculation
  const metrics = useMemo(() => {
    const students = data.students || [];
    const courses = data.courses || [];
    const assignments = data.assignments || [];
    const approvals = data.approvals || [];

    return {
      students: {
        total: students.length,
        active: students.filter(s => s.lastSeen && new Date() - new Date(s.lastSeen) < 7 * 24 * 60 * 60 * 1000).length,
        trend: +12.5,
        avgGrade: 85.4,
        attendance: 92.3
      },
      courses: {
        total: courses.length,
        active: courses.filter(c => c.status === 'active').length,
        trend: +8.2,
        completion: 78.5,
        satisfaction: 94.2
      },
      assignments: {
        total: assignments.length,
        pending: assignments.filter(a => a.status === 'pending').length,
        graded: assignments.filter(a => a.status === 'graded').length,
        trend: -5.1,
        avgScore: 82.7
      },
      approvals: {
        total: approvals.length,
        pending: approvals.filter(a => a.status === 'pending').length,
        approved: approvals.filter(a => a.status === 'approved').length,
        trend: +15.3,
        urgentCount: 3
      }
    };
  }, [data]);

  // Chart data
  const attendanceData = [
    { name: 'Mon', attendance: 95, engagement: 88 },
    { name: 'Tue', attendance: 92, engagement: 85 },
    { name: 'Wed', attendance: 96, engagement: 90 },
    { name: 'Thu', attendance: 89, engagement: 82 },
    { name: 'Fri', attendance: 94, engagement: 87 },
    { name: 'Sat', attendance: 88, engagement: 84 }
  ];

  const performanceData = [
    { subject: 'Math', A: 45, B: 30, C: 15, D: 8, F: 2 },
    { subject: 'Physics', A: 38, B: 35, C: 18, D: 7, F: 2 },
    { subject: 'Chemistry', A: 42, B: 28, C: 20, D: 8, F: 2 },
    { subject: 'Biology', A: 47, B: 32, C: 12, D: 7, F: 2 }
  ];

  const engagementData = [
    { name: 'Participation', value: 85, fullMark: 100 },
    { name: 'Assignments', value: 78, fullMark: 100 },
    { name: 'Attendance', value: 92, fullMark: 100 },
    { name: 'Interaction', value: 88, fullMark: 100 },
    { name: 'Performance', value: 83, fullMark: 100 }
  ];

  // TESTING: Simplified pie data to ensure charts work
  const pieData = [
    { name: 'Excellent', value: 35 },
    { name: 'Good', value: 40 },
    { name: 'Average', value: 20 },
    { name: 'Below Average', value: 5 }
  ];

  // Define colors array for pie chart
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  const MetricCard = ({ title, value, subtitle, trend, icon: Icon, color, isActive, onClick }) => (
    <div 
      className={`faculty-card faculty-card-red cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
        isActive ? 'ring-2 ring-red-500 ring-opacity-50 shadow-lg' : ''
      } ${isAnimating ? 'animate-scale-in' : ''}`}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
      }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div 
            className={`p-3 rounded-xl bg-opacity-10 transition-all duration-300 group-hover:bg-opacity-20`} 
            style={{ backgroundColor: color }}
          >
            <Icon 
              size={24} 
              style={{ color }} 
              className="transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <div className={`flex items-center gap-1 text-sm font-medium transition-all duration-300 ${
            trend > 0 ? 'text-green-600' : 'text-red-500'
          } hover:scale-105`}>
            {trend > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {Math.abs(trend)}%
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-sm text-gray-600 dark:text-gray-400 mb-1 transition-colors duration-300">
            {title}
          </h3>
          <div 
            className="text-3xl font-bold mb-1 transition-all duration-300" 
            style={{ color: 'var(--text-primary)' }}
          >
            {value}
          </div>
          <p className="text-sm transition-colors duration-300" style={{ color: 'var(--text-muted)' }}>
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );

  const SmartInsightCard = ({ title, insight, recommendation, priority = 'medium' }) => {
    const priorityColors = {
      high: '#ef4444',
      medium: '#f59e0b', 
      low: '#10b981'
    };

    return (
      <div className="faculty-card p-4 border-l-4" style={{ borderLeftColor: priorityColors[priority] }}>
        <div className="flex items-start gap-3">
          <Brain size={20} style={{ color: priorityColors[priority] }} />
          <div className="flex-1">
            <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h4>
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>{insight}</p>
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={14} style={{ color: 'var(--faculty-primary)' }} />
                <span className="text-xs font-semibold" style={{ color: 'var(--faculty-primary)' }}>AI Recommendation</span>
              </div>
              <p className="text-xs" style={{ color: 'var(--text)' }}>{recommendation}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const QuickActionButton = ({ icon: Icon, label, onClick, variant = 'default' }) => (
    <button
      onClick={onClick}
      className={`faculty-card p-4 flex items-center gap-3 text-left hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] hover:translate-y-1 active:scale-[0.98] ${
        variant === 'primary' ? 'faculty-card-red' : ''
      }`}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <div 
        className={`p-2 rounded-lg transition-all duration-300 hover:scale-110`} 
        style={{ 
          backgroundColor: variant === 'primary' ? 'var(--faculty-primary)' : 'var(--hover)'
        }}
      >
        <Icon 
          size={18} 
          style={{ color: variant === 'primary' ? 'white' : 'var(--text-secondary)' }} 
          className="transition-transform duration-300"
        />
      </div>
      <div>
        <div 
          className="font-medium transition-colors duration-300 hover:opacity-80" 
          style={{ color: 'var(--text-primary)' }}
        >
          {label}
        </div>
      </div>
    </button>
  );

  return (
    <div className="faculty-portal min-h-screen p-6 space-y-6">
      {/* Header Section */}
      <div className="faculty-card-red p-6 relative overflow-hidden" style={{ background: 'var(--gradient-red)' }}>
        <div className="relative z-10">
          <div className="flex items-center justify-between text-white">
            <div>
              <h1 className="text-3xl font-bold mb-2">Faculty Dashboard</h1>
              <p className="opacity-90">Welcome back! Here's your teaching overview</p>
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
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Students"
          value={metrics.students.total}
          subtitle={`${metrics.students.active} active students`}
          trend={metrics.students.trend}
          icon={Users}
          color="var(--chart-red)"
          isActive={activeMetric === 'students'}
          onClick={() => setActiveMetric('students')}
        />
        <MetricCard
          title="Active Courses"
          value={metrics.courses.active}
          subtitle={`${metrics.courses.total} total courses`}
          trend={metrics.courses.trend}
          icon={BookOpen}
          color="var(--chart-secondary)"
          isActive={activeMetric === 'courses'}
          onClick={() => setActiveMetric('courses')}
        />
        <MetricCard
          title="Assignments"
          value={metrics.assignments.pending}
          subtitle={`${metrics.assignments.graded} graded`}
          trend={metrics.assignments.trend}
          icon={FileText}
          color="var(--chart-tertiary)"
          isActive={activeMetric === 'assignments'}
          onClick={() => setActiveMetric('assignments')}
        />
        <MetricCard
          title="Approvals"
          value={metrics.approvals.pending}
          subtitle={`${metrics.approvals.urgentCount} urgent`}
          trend={metrics.approvals.trend}
          icon={Clock}
          color="var(--chart-quaternary)"
          isActive={activeMetric === 'approvals'}
          onClick={() => setActiveMetric('approvals')}
        />
      </div>

      {/* Charts and Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance & Engagement Chart */}
        <div className="faculty-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Weekly Attendance & Engagement
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--chart-red)' }}></div>
                <span style={{ color: 'var(--text-muted)' }}>Attendance</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--chart-secondary)' }}></div>
                <span style={{ color: 'var(--text-muted)' }}>Engagement</span>
              </div>
            </div>
          </div>
          <div className="h-64 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceData}>
                <defs>
                  <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: '#111827'
                  }} 
                />
                <Area type="monotone" dataKey="attendance" stroke="#dc2626" fillOpacity={1} fill="url(#attendanceGradient)" strokeWidth={3} />
                <Area type="monotone" dataKey="engagement" stroke="#10b981" fillOpacity={1} fill="url(#engagementGradient)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Distribution */}
        <div className="faculty-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Student Performance Distribution
            </h3>
            <button className="p-2 rounded-lg hover:bg-opacity-10" style={{ backgroundColor: 'var(--hover)' }}>
              <MoreHorizontal size={20} style={{ color: 'var(--text-muted)' }} />
            </button>
          </div>
          <div className="h-64 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={40}
                  label={({ value }) => `${value}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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

      {/* Smart Insights and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Insights */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Brain size={24} style={{ color: 'var(--faculty-primary)' }} />
            <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Smart Insights</h3>
            <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs font-medium rounded-full">
              AI Powered
            </span>
          </div>
          
          <SmartInsightCard
            title="Attendance Alert"
            insight="Student attendance in Physics has dropped 8% this week compared to last week."
            recommendation="Consider sending personalized reminders or scheduling a brief check-in with frequently absent students."
            priority="high"
          />
          
          <SmartInsightCard
            title="Assignment Pattern"
            insight="Students are consistently scoring lower on theoretical questions compared to practical problems."
            recommendation="Try incorporating more real-world examples in theoretical concepts and consider flipped classroom techniques."
            priority="medium"
          />
          
          <SmartInsightCard
            title="Engagement Opportunity"
            insight="Thursday classes show 15% lower engagement compared to other weekdays."
            recommendation="Consider adding interactive elements or group activities on Thursdays to boost engagement."
            priority="low"
          />
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Quick Actions</h3>
          
          <QuickActionButton
            icon={FileText}
            label="Create Assignment"
            onClick={() => console.log('Create assignment')}
            variant="primary"
          />
          
          <QuickActionButton
            icon={Users}
            label="View Students"
            onClick={() => console.log('View students')}
          />
          
          <QuickActionButton
            icon={BarChart3}
            label="Generate Report"
            onClick={() => console.log('Generate report')}
          />
          
          <QuickActionButton
            icon={MessageSquare}
            label="Send Announcement"
            onClick={() => console.log('Send announcement')}
          />
          
          <QuickActionButton
            icon={Calendar}
            label="Schedule Class"
            onClick={() => console.log('Schedule class')}
          />
          
          <QuickActionButton
            icon={Award}
            label="Grade Assignments"
            onClick={() => console.log('Grade assignments')}
          />
        </div>
      </div>

      {/* Student Engagement Radar */}
      <div className="faculty-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Student Engagement Analysis
          </h3>
          <div className="flex items-center gap-2">
            <Activity size={20} style={{ color: 'var(--faculty-primary)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--faculty-primary)' }}>Live Data</span>
          </div>
        </div>
        <div className="h-64 lg:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={engagementData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} />
              <Radar
                name="Engagement"
                dataKey="value"
                stroke="#dc2626"
                fill="#dc2626"
                fillOpacity={0.3}
                strokeWidth={3}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  color: '#111827'
                }} 
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities Feed */}
      <div className="faculty-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Recent Activities</h3>
          <button className="text-sm font-medium" style={{ color: 'var(--faculty-primary)' }}>
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {[
            { type: 'assignment', title: 'Physics Assignment #3 submitted', time: '5 minutes ago', count: '12 submissions' },
            { type: 'grade', title: 'Chemistry Quiz graded', time: '1 hour ago', count: '28 students' },
            { type: 'attendance', title: 'Attendance marked for Biology', time: '2 hours ago', count: '100% present' },
            { type: 'message', title: 'New message from student', time: '3 hours ago', count: '2 unread' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-4 rounded-lg hover:bg-opacity-50" style={{ backgroundColor: 'var(--hover)' }}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--faculty-primary)' }}></div>
              <div className="flex-1">
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{activity.title}</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{activity.time} • {activity.count}</p>
              </div>
              <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModernFacultyDashboard;