import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen, Users, Clock, Calendar, Plus, Edit, Trash2, Eye, Search,
  Filter, Download, Upload, Share2, Star, TrendingUp, TrendingDown,
  BarChart3, PieChart, Activity, Award, AlertCircle, CheckCircle,
  FileText, Video, Image, Link, MessageSquare, Settings, MoreVertical,
  Copy, ExternalLink, Zap, Target, Brain, Heart, BookmarkPlus,
  ChevronDown, ChevronRight, MapPin, Globe, Wifi
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart as RechartsPie, Cell, Legend,
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const FacultyCourses = ({ data = [] }) => {
  const [activeView, setActiveView] = useState('grid');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Sample courses data with enhanced details
  const [courses, setCourses] = useState([
    {
      id: 1,
      code: 'CS301',
      name: 'Machine Learning',
      description: 'Introduction to machine learning algorithms, supervised and unsupervised learning, neural networks, and practical applications.',
      semester: 'VI',
      credits: 4,
      status: 'active',
      students: 45,
      maxStudents: 50,
      schedule: {
        days: ['Monday', 'Wednesday', 'Friday'],
        time: '10:00 AM - 11:00 AM',
        room: 'Lab-302',
        building: 'Computer Science Block'
      },
      syllabus: {
        totalTopics: 12,
        completedTopics: 8,
        currentTopic: 'Deep Learning Fundamentals'
      },
      performance: {
        attendance: 89,
        avgGrade: 85.4,
        passRate: 92,
        satisfaction: 4.6
      },
      assignments: {
        total: 8,
        pending: 2,
        graded: 6,
        avgScore: 82.3
      },
      resources: {
        lectures: 24,
        materials: 15,
        videos: 8,
        quizzes: 6
      },
      announcements: 3,
      lastActivity: '2 hours ago',
      color: '#ef4444',
      category: 'Core'
    },
    {
      id: 2,
      code: 'CS401',
      name: 'Data Science',
      description: 'Comprehensive course on data analysis, statistical modeling, data visualization, and big data technologies.',
      semester: 'VIII',
      credits: 3,
      status: 'active',
      students: 38,
      maxStudents: 45,
      schedule: {
        days: ['Tuesday', 'Thursday'],
        time: '2:00 PM - 3:30 PM',
        room: 'Room-201',
        building: 'Computer Science Block'
      },
      syllabus: {
        totalTopics: 10,
        completedTopics: 6,
        currentTopic: 'Data Visualization with Python'
      },
      performance: {
        attendance: 92,
        avgGrade: 87.2,
        passRate: 95,
        satisfaction: 4.8
      },
      assignments: {
        total: 6,
        pending: 1,
        graded: 5,
        avgScore: 86.7
      },
      resources: {
        lectures: 20,
        materials: 12,
        videos: 10,
        quizzes: 4
      },
      announcements: 1,
      lastActivity: '1 day ago',
      color: '#3b82f6',
      category: 'Elective'
    },
    {
      id: 3,
      code: 'CS501',
      name: 'Advanced AI',
      description: 'Advanced topics in artificial intelligence including expert systems, natural language processing, and computer vision.',
      semester: 'X',
      credits: 4,
      status: 'active',
      students: 22,
      maxStudents: 25,
      schedule: {
        days: ['Monday', 'Thursday'],
        time: '11:00 AM - 12:30 PM',
        room: 'AI Lab',
        building: 'Research Block'
      },
      syllabus: {
        totalTopics: 15,
        completedTopics: 10,
        currentTopic: 'Computer Vision Applications'
      },
      performance: {
        attendance: 94,
        avgGrade: 88.9,
        passRate: 100,
        satisfaction: 4.9
      },
      assignments: {
        total: 10,
        pending: 3,
        graded: 7,
        avgScore: 89.1
      },
      resources: {
        lectures: 30,
        materials: 18,
        videos: 15,
        quizzes: 8
      },
      announcements: 2,
      lastActivity: '3 hours ago',
      color: '#10b981',
      category: 'Research'
    },
    {
      id: 4,
      code: 'CS201',
      name: 'Database Systems',
      description: 'Fundamentals of database design, SQL, normalization, and database administration.',
      semester: 'IV',
      credits: 3,
      status: 'completed',
      students: 52,
      maxStudents: 55,
      schedule: {
        days: ['Tuesday', 'Friday'],
        time: '9:00 AM - 10:30 AM',
        room: 'Room-105',
        building: 'Main Building'
      },
      syllabus: {
        totalTopics: 8,
        completedTopics: 8,
        currentTopic: 'Course Completed'
      },
      performance: {
        attendance: 88,
        avgGrade: 83.5,
        passRate: 96,
        satisfaction: 4.4
      },
      assignments: {
        total: 5,
        pending: 0,
        graded: 5,
        avgScore: 81.2
      },
      resources: {
        lectures: 16,
        materials: 10,
        videos: 6,
        quizzes: 3
      },
      announcements: 0,
      lastActivity: '2 weeks ago',
      color: '#6b7280',
      category: 'Core'
    }
  ]);

  // Filtered courses based on search and filter
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || course.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [courses, searchTerm, filterStatus]);

  // Analytics data
  const courseAnalytics = useMemo(() => {
    const totalStudents = courses.reduce((sum, course) => sum + course.students, 0);
    const avgAttendance = courses.reduce((sum, course) => sum + course.performance.attendance, 0) / courses.length;
    const avgSatisfaction = courses.reduce((sum, course) => sum + course.performance.satisfaction, 0) / courses.length;
    
    return {
      totalCourses: courses.length,
      activeCourses: courses.filter(c => c.status === 'active').length,
      totalStudents,
      avgAttendance: Math.round(avgAttendance),
      avgSatisfaction: avgSatisfaction.toFixed(1)
    };
  }, [courses]);

  // Chart data
  const attendanceData = courses.map(course => ({
    name: course.code,
    attendance: course.performance.attendance,
    satisfaction: course.performance.satisfaction * 20 // Scale to 100
  }));

  const enrollmentData = [
    { name: 'Jan', enrolled: 120 },
    { name: 'Feb', enrolled: 135 },
    { name: 'Mar', enrolled: 142 },
    { name: 'Apr', enrolled: 158 },
    { name: 'May', enrolled: 147 },
    { name: 'Jun', enrolled: 163 }
  ];

  const gradeDistribution = [
    { name: 'A (90-100)', value: 25, color: '#22c55e' },
    { name: 'B (80-89)', value: 35, color: '#3b82f6' },
    { name: 'C (70-79)', value: 25, color: '#f59e0b' },
    { name: 'D (60-69)', value: 12, color: '#ef4444' },
    { name: 'F (<60)', value: 3, color: '#6b7280' }
  ];

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, color, onClick }) => (
    <div 
      className="faculty-card p-6 cursor-pointer hover:shadow-lg transition-all duration-200"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl bg-opacity-10" style={{ backgroundColor: color }}>
          <Icon size={24} style={{ color }} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {trend > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <div className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{value}</div>
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{title}</p>
        {subtitle && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
      </div>
    </div>
  );

  const CourseCard = ({ course, onClick }) => (
    <div 
      className="faculty-card p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
      onClick={() => onClick(course)}
      style={{ borderTop: `4px solid ${course.color}` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-bold px-2 py-1 rounded" style={{ backgroundColor: course.color, color: 'white' }}>
              {course.code}
            </span>
            <span className={`text-xs px-2 py-1 rounded ${
              course.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              course.status === 'completed' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200' :
              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            }`}>
              {course.status}
            </span>
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{course.name}</h3>
          <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
            {course.description.substring(0, 100)}...
          </p>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 hover:bg-opacity-10 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {/* Student Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={16} style={{ color: 'var(--text-muted)' }} />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {course.students}/{course.maxStudents} students
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Star size={16} style={{ color: '#fbbf24' }} />
            <span className="text-sm font-medium">{course.performance.satisfaction}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
            <span>Syllabus Progress</span>
            <span>{Math.round((course.syllabus.completedTopics / course.syllabus.totalTopics) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(course.syllabus.completedTopics / course.syllabus.totalTopics) * 100}%`,
                backgroundColor: course.color
              }}
            ></div>
          </div>
        </div>

        {/* Schedule */}
        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
          <Clock size={14} />
          <span>{course.schedule.time} • {course.schedule.days.join(', ')}</span>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="font-bold text-lg" style={{ color: course.color }}>{course.performance.attendance}%</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Attendance</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg" style={{ color: course.color }}>{course.performance.avgGrade}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Avg Grade</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg" style={{ color: course.color }}>{course.assignments.pending}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Pending</div>
          </div>
        </div>
      </div>
    </div>
  );

  const CourseDetailModal = ({ course, onClose }) => {
    if (!course) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="faculty-card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg font-bold px-3 py-1 rounded" style={{ backgroundColor: course.color, color: 'white' }}>
                    {course.code}
                  </span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    course.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                  }`}>
                    {course.status}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{course.name}</h2>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{course.description}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-opacity-10 rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--hover)' }}
              >
                ×
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-white" style={{ backgroundColor: course.color }}>
                <Eye size={16} />
                View Materials
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600" style={{ color: 'var(--text)' }}>
                <Users size={16} />
                Manage Students
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600" style={{ color: 'var(--text)' }}>
                <FileText size={16} />
                Assignments
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600" style={{ color: 'var(--text)' }}>
                <BarChart3 size={16} />
                Analytics
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
                <div className="flex items-center gap-3">
                  <Users size={20} style={{ color: course.color }} />
                  <div>
                    <div className="font-bold text-lg">{course.students}</div>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Students</div>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
                <div className="flex items-center gap-3">
                  <Activity size={20} style={{ color: course.color }} />
                  <div>
                    <div className="font-bold text-lg">{course.performance.attendance}%</div>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Attendance</div>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
                <div className="flex items-center gap-3">
                  <Star size={20} style={{ color: '#fbbf24' }} />
                  <div>
                    <div className="font-bold text-lg">{course.performance.satisfaction}</div>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Rating</div>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
                <div className="flex items-center gap-3">
                  <Target size={20} style={{ color: course.color }} />
                  <div>
                    <div className="font-bold text-lg">{course.performance.passRate}%</div>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Pass Rate</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
                <h4 className="font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Schedule</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} style={{ color: 'var(--text-muted)' }} />
                    <span>{course.schedule.days.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} style={{ color: 'var(--text-muted)' }} />
                    <span>{course.schedule.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} style={{ color: 'var(--text-muted)' }} />
                    <span>{course.schedule.room}, {course.schedule.building}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
                <h4 className="font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Course Info</h4>
                <div className="space-y-2 text-sm">
                  <div>Semester: <span className="font-medium">{course.semester}</span></div>
                  <div>Credits: <span className="font-medium">{course.credits}</span></div>
                  <div>Category: <span className="font-medium">{course.category}</span></div>
                  <div>Last Activity: <span className="font-medium">{course.lastActivity}</span></div>
                </div>
              </div>
            </div>

            {/* Syllabus Progress */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold" style={{ color: 'var(--text-primary)' }}>Syllabus Progress</h4>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {course.syllabus.completedTopics} of {course.syllabus.totalTopics} topics completed
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                <div 
                  className="h-3 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(course.syllabus.completedTopics / course.syllabus.totalTopics) * 100}%`,
                    backgroundColor: course.color
                  }}
                ></div>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Currently teaching: <strong>{course.syllabus.currentTopic}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="faculty-portal min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>My Courses</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Manage and track all your courses</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-500"
              style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
          >
            <option value="all">All Courses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="draft">Draft</option>
          </select>
          
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white"
            style={{ backgroundColor: 'var(--faculty-primary)' }}
          >
            <Plus size={18} />
            <span>Create Course</span>
          </button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <StatCard
          icon={BookOpen}
          title="Total Courses"
          value={courseAnalytics.totalCourses}
          subtitle="All courses"
          color="var(--chart-red)"
          trend={8}
        />
        <StatCard
          icon={Activity}
          title="Active Courses"
          value={courseAnalytics.activeCourses}
          subtitle="Currently teaching"
          color="var(--chart-secondary)"
          trend={12}
        />
        <StatCard
          icon={Users}
          title="Total Students"
          value={courseAnalytics.totalStudents}
          subtitle="Enrolled students"
          color="var(--chart-tertiary)"
          trend={5}
        />
        <StatCard
          icon={TrendingUp}
          title="Avg Attendance"
          value={`${courseAnalytics.avgAttendance}%`}
          subtitle="Course average"
          color="var(--chart-quaternary)"
          trend={3}
        />
        <StatCard
          icon={Star}
          title="Satisfaction"
          value={courseAnalytics.avgSatisfaction}
          subtitle="Student rating"
          color="#fbbf24"
          trend={7}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance & Satisfaction Chart */}
        <div className="faculty-card p-6">
          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Course Performance
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text)'
                  }} 
                />
                <Bar dataKey="attendance" fill="var(--chart-red)" radius={4} />
                <Bar dataKey="satisfaction" fill="var(--chart-secondary)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="faculty-card p-6">
          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Overall Grade Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie data={gradeDistribution}>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text)'
                  }} 
                />
                {gradeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <Legend />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Courses ({filteredCourses.length})
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('grid')}
              className={`p-2 rounded-lg ${activeView === 'grid' ? 'text-white' : ''}`}
              style={{ backgroundColor: activeView === 'grid' ? 'var(--faculty-primary)' : 'var(--hover)' }}
            >
              <BarChart3 size={18} />
            </button>
            <button
              onClick={() => setActiveView('list')}
              className={`p-2 rounded-lg ${activeView === 'list' ? 'text-white' : ''}`}
              style={{ backgroundColor: activeView === 'list' ? 'var(--faculty-primary)' : 'var(--hover)' }}
            >
              <FileText size={18} />
            </button>
          </div>
        </div>

        {activeView === 'grid' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={setSelectedCourse}
              />
            ))}
          </div>
        ) : (
          <div className="faculty-card">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-12 gap-4 font-medium text-sm" style={{ color: 'var(--text-secondary)' }}>
                <div className="col-span-3">Course</div>
                <div className="col-span-2">Students</div>
                <div className="col-span-2">Progress</div>
                <div className="col-span-2">Performance</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1">Actions</div>
              </div>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCourses.map((course) => (
                <div key={course.id} className="p-4 hover:bg-opacity-50" style={{ backgroundColor: 'var(--hover)' }}>
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-3">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: course.color }}></div>
                        <div>
                          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{course.name}</p>
                          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{course.code}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <p className="font-medium">{course.students}/{course.maxStudents}</p>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>enrolled</p>
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full"
                            style={{ 
                              width: `${(course.syllabus.completedTopics / course.syllabus.totalTopics) * 100}%`,
                              backgroundColor: course.color
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">
                          {Math.round((course.syllabus.completedTopics / course.syllabus.totalTopics) * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-sm">
                        <div>Attendance: {course.performance.attendance}%</div>
                        <div>Grade: {course.performance.avgGrade}</div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        course.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        course.status === 'completed' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {course.status}
                      </span>
                    </div>
                    <div className="col-span-1">
                      <button
                        onClick={() => setSelectedCourse(course)}
                        className="p-1 hover:bg-opacity-10 rounded"
                        style={{ backgroundColor: 'var(--hover)' }}
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <CourseDetailModal 
          course={selectedCourse} 
          onClose={() => setSelectedCourse(null)} 
        />
      )}
    </div>
  );
};

export default FacultyCourses;
