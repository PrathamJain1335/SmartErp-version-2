import React, { useState, useEffect, useMemo } from 'react';
import {
  Users, Search, Filter, Download, Upload, Mail, Phone, MapPin,
  Calendar, Clock, CheckCircle, XCircle, AlertCircle, Star,
  BarChart3, TrendingUp, TrendingDown, Eye, Edit, Trash2,
  MessageSquare, Bell, Award, BookOpen, FileText, Activity,
  User, UserCheck, UserX, Target, Zap, Heart, Brain,
  ChevronDown, ChevronRight, Plus, MoreVertical, Settings
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Cell, Legend, AreaChart, Area,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const FacultyStudents = ({ data = [] }) => {
  const [activeView, setActiveView] = useState('overview');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterPerformance, setFilterPerformance] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [attendanceMode, setAttendanceMode] = useState(false);
  const [presentMap, setPresentMap] = useState({});

  // Enhanced student data
  const [students, setStudents] = useState([
    {
      id: 1,
      rollNo: 'CSE001',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@student.jecrc.edu',
      phone: '+91 98765 43210',
      course: 'CS301',
      courseName: 'Machine Learning',
      semester: 'VI',
      section: 'A',
      profileImage: './user.png',
      performance: {
        currentGrade: 'A',
        gpa: 8.7,
        attendance: 92,
        assignments: { submitted: 7, total: 8 },
        lastActivity: '2 hours ago'
      },
      analytics: {
        strengths: ['Problem Solving', 'Programming'],
        weaknesses: ['Theory', 'Documentation'],
        trend: 'improving',
        engagement: 85
      },
      personal: {
        dateOfBirth: '2002-05-15',
        address: '123 Student Colony, Jaipur',
        parentContact: '+91 98765 43211',
        bloodGroup: 'B+'
      },
      status: 'active',
      risk: 'low'
    },
    {
      id: 2,
      rollNo: 'CSE002',
      name: 'Priya Patel',
      email: 'priya.patel@student.jecrc.edu',
      phone: '+91 98765 43220',
      course: 'CS301',
      courseName: 'Machine Learning',
      semester: 'VI',
      section: 'A',
      profileImage: '/user.png',
      performance: {
        currentGrade: 'A+',
        gpa: 9.2,
        attendance: 96,
        assignments: { submitted: 8, total: 8 },
        lastActivity: '1 hour ago'
      },
      analytics: {
        strengths: ['Research', 'Analysis', 'Theory'],
        weaknesses: ['Time Management'],
        trend: 'stable',
        engagement: 94
      },
      personal: {
        dateOfBirth: '2002-08-22',
        address: '456 University Road, Jaipur',
        parentContact: '+91 98765 43221',
        bloodGroup: 'O+'
      },
      status: 'active',
      risk: 'low'
    },
    {
      id: 3,
      rollNo: 'CSE003',
      name: 'Rohit Kumar',
      email: 'rohit.kumar@student.jecrc.edu',
      phone: '+91 98765 43230',
      course: 'CS401',
      courseName: 'Data Science',
      semester: 'VIII',
      section: 'B',
      profileImage: '/user.png',
      performance: {
        currentGrade: 'B+',
        gpa: 7.8,
        attendance: 78,
        assignments: { submitted: 4, total: 6 },
        lastActivity: '1 day ago'
      },
      analytics: {
        strengths: ['Practical Work'],
        weaknesses: ['Attendance', 'Theory', 'Assignments'],
        trend: 'declining',
        engagement: 65
      },
      personal: {
        dateOfBirth: '2000-12-10',
        address: '789 Campus Area, Jaipur',
        parentContact: '+91 98765 43231',
        bloodGroup: 'A+'
      },
      status: 'active',
      risk: 'medium'
    },
    {
      id: 4,
      rollNo: 'CSE004',
      name: 'Sneha Gupta',
      email: 'sneha.gupta@student.jecrc.edu',
      phone: '+91 98765 43240',
      course: 'CS501',
      courseName: 'Advanced AI',
      semester: 'X',
      section: 'A',
      profileImage: '/user.png',
      performance: {
        currentGrade: 'A+',
        gpa: 9.5,
        attendance: 98,
        assignments: { submitted: 10, total: 10 },
        lastActivity: '30 minutes ago'
      },
      analytics: {
        strengths: ['Research', 'Innovation', 'Leadership'],
        weaknesses: [],
        trend: 'excellent',
        engagement: 98
      },
      personal: {
        dateOfBirth: '2001-03-18',
        address: '321 Scholar Street, Jaipur',
        parentContact: '+91 98765 43241',
        bloodGroup: 'AB+'
      },
      status: 'active',
      risk: 'low'
    },
    {
      id: 5,
      rollNo: 'CSE005',
      name: 'Arjun Singh',
      email: 'arjun.singh@student.jecrc.edu',
      phone: '+91 98765 43250',
      course: 'CS201',
      courseName: 'Database Systems',
      semester: 'IV',
      section: 'C',
      profileImage: '/user.png',
      performance: {
        currentGrade: 'C+',
        gpa: 6.2,
        attendance: 65,
        assignments: { submitted: 2, total: 5 },
        lastActivity: '3 days ago'
      },
      analytics: {
        strengths: ['Creativity'],
        weaknesses: ['Attendance', 'Consistency', 'Study Habits'],
        trend: 'needs attention',
        engagement: 45
      },
      personal: {
        dateOfBirth: '2003-07-25',
        address: '654 Hostel Block, Jaipur',
        parentContact: '+91 98765 43251',
        bloodGroup: 'B-'
      },
      status: 'active',
      risk: 'high'
    }
  ]);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.rollNo.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCourse = filterCourse === 'all' || student.course === filterCourse;
      const matchesPerformance = filterPerformance === 'all' || 
        (filterPerformance === 'excellent' && student.performance.gpa >= 8.5) ||
        (filterPerformance === 'good' && student.performance.gpa >= 7 && student.performance.gpa < 8.5) ||
        (filterPerformance === 'average' && student.performance.gpa >= 5.5 && student.performance.gpa < 7) ||
        (filterPerformance === 'poor' && student.performance.gpa < 5.5);
      
      return matchesSearch && matchesCourse && matchesPerformance;
    });
  }, [students, searchTerm, filterCourse, filterPerformance]);

  // Analytics
  const analytics = useMemo(() => {
    const totalStudents = students.length;
    const avgGPA = students.reduce((sum, s) => sum + s.performance.gpa, 0) / totalStudents;
    const avgAttendance = students.reduce((sum, s) => sum + s.performance.attendance, 0) / totalStudents;
    const atRisk = students.filter(s => s.risk === 'high').length;
    
    return {
      totalStudents,
      avgGPA: avgGPA.toFixed(2),
      avgAttendance: Math.round(avgAttendance),
      atRisk,
      activeStudents: students.filter(s => s.status === 'active').length
    };
  }, [students]);

  // Chart data
  const performanceData = [
    { name: 'Excellent (8.5+)', value: students.filter(s => s.performance.gpa >= 8.5).length, color: '#22c55e' },
    { name: 'Good (7-8.5)', value: students.filter(s => s.performance.gpa >= 7 && s.performance.gpa < 8.5).length, color: '#3b82f6' },
    { name: 'Average (5.5-7)', value: students.filter(s => s.performance.gpa >= 5.5 && s.performance.gpa < 7).length, color: '#f59e0b' },
    { name: 'Poor (<5.5)', value: students.filter(s => s.performance.gpa < 5.5).length, color: '#ef4444' }
  ];

  const attendanceTrend = [
    { month: 'Jan', attendance: 88 },
    { month: 'Feb', attendance: 92 },
    { month: 'Mar', attendance: 87 },
    { month: 'Apr', attendance: 91 },
    { month: 'May', attendance: 89 },
    { month: 'Jun', attendance: 94 }
  ];

  const engagementData = students.map(student => ({
    name: student.name.split(' ')[0],
    engagement: student.analytics.engagement,
    attendance: student.performance.attendance,
    gpa: student.performance.gpa * 10 // Scale for visualization
  }));

  // Attendance functions
  const togglePresent = (studentId) => {
    setPresentMap(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const markAllPresent = () => {
    const newMap = {};
    filteredStudents.forEach(student => {
      newMap[student.id] = true;
    });
    setPresentMap(newMap);
  };

  const saveAttendance = () => {
    // Save attendance logic here
    console.log('Saving attendance for date:', selectedDate, presentMap);
    alert('Attendance saved successfully!');
    setAttendanceMode(false);
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, color }) => (
    <div className="faculty-card p-6 hover:shadow-lg transition-all duration-200">
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

  const StudentCard = ({ student, onClick }) => {
    const riskColor = {
      low: '#22c55e',
      medium: '#f59e0b', 
      high: '#ef4444'
    };

    return (
      <div 
        className="faculty-card p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
        onClick={() => onClick(student)}
        style={{ borderLeft: `4px solid ${riskColor[student.risk]}` }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <img 
              src={student.profileImage} 
              alt={student.name}
              className="w-16 h-16 rounded-full border-2" 
              style={{ borderColor: riskColor[student.risk] }}
            />
            <div>
              <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{student.name}</h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{student.rollNo} • {student.courseName}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  student.risk === 'low' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  student.risk === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {student.risk} risk
                </span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {student.performance.lastActivity}
                </span>
              </div>
            </div>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 hover:bg-opacity-10 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
              <MoreVertical size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="font-bold text-lg" style={{ color: riskColor[student.risk] }}>{student.performance.gpa}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>GPA</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg" style={{ color: riskColor[student.risk] }}>{student.performance.attendance}%</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Attendance</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg" style={{ color: riskColor[student.risk] }}>
              {student.performance.assignments.submitted}/{student.performance.assignments.total}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Assignments</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg" style={{ color: riskColor[student.risk] }}>{student.analytics.engagement}%</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Engagement</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <button className="flex-1 px-3 py-2 text-xs rounded-md text-white" style={{ backgroundColor: riskColor[student.risk] }}>
            <MessageSquare size={12} className="inline mr-1" />
            Message
          </button>
          <button className="flex-1 px-3 py-2 text-xs rounded-md border border-gray-300 dark:border-gray-600" style={{ color: 'var(--text)' }}>
            <Eye size={12} className="inline mr-1" />
            View Profile
          </button>
        </div>
      </div>
    );
  };

  const StudentDetailModal = ({ student, onClose }) => {
    if (!student) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="faculty-card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img 
                  src={student.profileImage} 
                  alt={student.name}
                  className="w-20 h-20 rounded-full border-2 border-red-200"
                />
                <div>
                  <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{student.name}</h2>
                  <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>{student.rollNo} • {student.courseName}</p>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Semester {student.semester} • Section {student.section}</p>
                </div>
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
            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
                <div className="flex items-center gap-3">
                  <Target size={20} style={{ color: 'var(--faculty-primary)' }} />
                  <div>
                    <div className="font-bold text-lg">{student.performance.gpa}</div>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Current GPA</div>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
                <div className="flex items-center gap-3">
                  <Activity size={20} style={{ color: 'var(--faculty-primary)' }} />
                  <div>
                    <div className="font-bold text-lg">{student.performance.attendance}%</div>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Attendance</div>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
                <div className="flex items-center gap-3">
                  <FileText size={20} style={{ color: 'var(--faculty-primary)' }} />
                  <div>
                    <div className="font-bold text-lg">{student.performance.assignments.submitted}/{student.performance.assignments.total}</div>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Assignments</div>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
                <div className="flex items-center gap-3">
                  <Heart size={20} style={{ color: 'var(--faculty-primary)' }} />
                  <div>
                    <div className="font-bold text-lg">{student.analytics.engagement}%</div>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Engagement</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact & Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
                <h4 className="font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail size={16} style={{ color: 'var(--text-muted)' }} />
                    <span>{student.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} style={{ color: 'var(--text-muted)' }} />
                    <span>{student.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} style={{ color: 'var(--text-muted)' }} />
                    <span>{student.personal.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} style={{ color: 'var(--text-muted)' }} />
                    <span>Parent: {student.personal.parentContact}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
                <h4 className="font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Academic Analysis</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Strengths:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {student.analytics.strengths.map((strength, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded">
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Areas for Improvement:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {student.analytics.weaknesses.map((weakness, index) => (
                        <span key={index} className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs rounded">
                          {weakness}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Trend:</span>
                    <span className={`ml-2 px-2 py-1 text-xs rounded ${
                      student.analytics.trend === 'improving' || student.analytics.trend === 'excellent' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      student.analytics.trend === 'stable' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {student.analytics.trend}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-white" style={{ backgroundColor: 'var(--faculty-primary)' }}>
                <MessageSquare size={16} />
                Send Message
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600" style={{ color: 'var(--text)' }}>
                <Phone size={16} />
                Call Parent
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600" style={{ color: 'var(--text)' }}>
                <FileText size={16} />
                View Assignments
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600" style={{ color: 'var(--text)' }}>
                <BarChart3 size={16} />
                Detailed Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AttendanceView = () => (
    <div className="space-y-6">
      {/* Controls */}
      <div className="faculty-card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Mark Attendance</h3>
          <div className="flex items-center gap-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
              style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
            />
            <button
              onClick={markAllPresent}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
              style={{ color: 'var(--text)' }}
            >
              Mark All Present
            </button>
            <button
              onClick={saveAttendance}
              className="px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: 'var(--faculty-primary)' }}
            >
              Save Attendance
            </button>
          </div>
        </div>

        {/* Student List */}
        <div className="space-y-2">
          {filteredStudents.map((student) => (
            <div key={student.id} className="flex items-center gap-4 p-4 rounded-lg hover:bg-opacity-50" style={{ backgroundColor: 'var(--hover)' }}>
              <input
                type="checkbox"
                checked={!!presentMap[student.id]}
                onChange={() => togglePresent(student.id)}
                className="w-5 h-5 text-red-600"
              />
              <img src={student.profileImage} alt={student.name} className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{student.name}</p>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{student.rollNo}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{student.performance.attendance}%</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Avg Attendance</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="faculty-portal min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>My Students</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Monitor and manage student performance</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-500"
              style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
            />
          </div>
          
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
          >
            <option value="all">All Courses</option>
            <option value="CS301">CS301 - ML</option>
            <option value="CS401">CS401 - Data Science</option>
            <option value="CS501">CS501 - Advanced AI</option>
          </select>
          
          <button 
            onClick={() => setAttendanceMode(!attendanceMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${attendanceMode ? 'text-white' : 'border border-gray-300 dark:border-gray-600'}`}
            style={{ 
              backgroundColor: attendanceMode ? 'var(--faculty-primary)' : 'transparent',
              color: attendanceMode ? 'white' : 'var(--text)'
            }}
          >
            <UserCheck size={18} />
            <span>Attendance</span>
          </button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <StatCard
          icon={Users}
          title="Total Students"
          value={analytics.totalStudents}
          subtitle="Across all courses"
          color="var(--chart-red)"
          trend={5}
        />
        <StatCard
          icon={Target}
          title="Average GPA"
          value={analytics.avgGPA}
          subtitle="Overall performance"
          color="var(--chart-secondary)"
          trend={3}
        />
        <StatCard
          icon={Activity}
          title="Avg Attendance"
          value={`${analytics.avgAttendance}%`}
          subtitle="Class attendance"
          color="var(--chart-tertiary)"
          trend={-2}
        />
        <StatCard
          icon={AlertCircle}
          title="At Risk"
          value={analytics.atRisk}
          subtitle="Need attention"
          color="#ef4444"
          trend={-8}
        />
        <StatCard
          icon={CheckCircle}
          title="Active Students"
          value={analytics.activeStudents}
          subtitle="Currently enrolled"
          color="#22c55e"
          trend={2}
        />
      </div>

      {/* Charts Row */}
      {!attendanceMode && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Distribution */}
          <div className="faculty-card p-6">
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Performance Distribution
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text)'
                    }} 
                  />
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Attendance Trend */}
          <div className="faculty-card p-6">
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Attendance Trend
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceTrend}>
                  <defs>
                    <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-red)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--chart-red)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                  <XAxis dataKey="month" stroke="var(--text-muted)" />
                  <YAxis stroke="var(--text-muted)" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--card)', 
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text)'
                    }} 
                  />
                  <Area type="monotone" dataKey="attendance" stroke="var(--chart-red)" fillOpacity={1} fill="url(#attendanceGradient)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Students Section */}
      {attendanceMode ? (
        <AttendanceView />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Students ({filteredStudents.length})
            </h2>
            <div className="flex items-center gap-2">
              <select
                value={filterPerformance}
                onChange={(e) => setFilterPerformance(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm"
                style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
              >
                <option value="all">All Performance</option>
                <option value="excellent">Excellent (8.5+)</option>
                <option value="good">Good (7-8.5)</option>
                <option value="average">Average (5.5-7)</option>
                <option value="poor">Poor (&lt;5.5)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onClick={setSelectedStudent}
              />
            ))}
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <StudentDetailModal 
          student={selectedStudent} 
          onClose={() => setSelectedStudent(null)} 
        />
      )}
    </div>
  );
};

export default FacultyStudents;
