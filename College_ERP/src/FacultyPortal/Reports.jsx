import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Award,
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
  Star,
  BookOpen,
  Brain,
  Zap,
  Activity,
  Download,
  Search,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import './theme.css';

// Enhanced student data with comprehensive analytics
const studentsData = [
  // [Data remains unchanged, as provided]
  {
    rollNo: 'CSE001',
    name: 'Aarav Sharma',
    section: 'CS301-A',
    semester: 'VI',
    email: 'aarav@jecrc.edu',
    phone: '+91 98765 43210',
    profileImage: './user.png',
    performance: {
      currentGPA: 8.7,
      semesterGPA: [7.8, 8.1, 8.3, 8.5, 8.6, 8.7],
      attendance: 92,
      monthlyAttendance: [88, 90, 94, 92, 95, 92],
      assignments: { submitted: 28, total: 30, avgScore: 85 },
      exams: {
        midterm: 85,
        finals: 88,
        quizzes: [18, 16, 19, 17, 20],
      },
      skills: {
        technical: 85,
        communication: 78,
        problemSolving: 92,
        teamwork: 88,
        creativity: 75,
        leadership: 70,
      },
    },
    courses: {
      'Machine Learning': { grade: 'A', marks: 87, attendance: 95 },
      'Data Science': { grade: 'A', marks: 85, attendance: 90 },
      'Advanced AI': { grade: 'A+', marks: 92, attendance: 88 },
      'Database Systems': { grade: 'B+', marks: 78, attendance: 94 },
    },
    activities: [
      { date: '2025-09-01', activity: 'Submitted ML Assignment', type: 'assignment' },
      { date: '2025-09-05', activity: 'Attended AI Workshop', type: 'workshop' },
      { date: '2025-09-10', activity: 'Quiz - Database Systems', type: 'quiz' },
      { date: '2025-09-12', activity: 'Project Presentation', type: 'presentation' },
    ],
    risk: 'low',
    trend: 'improving',
  },
  // [Other student data remains unchanged]
  {
    rollNo: 'CSE002',
    name: 'Priya Patel',
    section: 'CS301-A',
    semester: 'VI',
    email: 'priya@jecrc.edu',
    phone: '+91 98765 43220',
    profileImage: 'https://via.placeholder.com/100x100?text=PP',
    performance: {
      currentGPA: 9.2,
      semesterGPA: [8.5, 8.8, 9.0, 9.1, 9.2, 9.2],
      attendance: 96,
      monthlyAttendance: [95, 96, 97, 96, 98, 96],
      assignments: { submitted: 30, total: 30, avgScore: 92 },
      exams: {
        midterm: 92,
        finals: 95,
        quizzes: [19, 18, 20, 19, 20],
      },
      skills: {
        technical: 95,
        communication: 88,
        problemSolving: 90,
        teamwork: 92,
        creativity: 85,
        leadership: 88,
      },
    },
    courses: {
      'Machine Learning': { grade: 'A+', marks: 95, attendance: 98 },
      'Data Science': { grade: 'A+', marks: 92, attendance: 96 },
      'Advanced AI': { grade: 'A+', marks: 90, attendance: 95 },
      'Database Systems': { grade: 'A', marks: 88, attendance: 97 },
    },
    activities: [
      { date: '2025-09-02', activity: 'Research Paper Submission', type: 'research' },
      { date: '2025-09-06', activity: 'Led Study Group', type: 'leadership' },
      { date: '2025-09-11', activity: 'Won Coding Competition', type: 'achievement' },
      { date: '2025-09-13', activity: 'Mentor Session', type: 'mentoring' },
    ],
    risk: 'low',
    trend: 'stable',
  },
  {
    rollNo: 'CSE003',
    name: 'Rohit Kumar',
    section: 'CS401-A',
    semester: 'VIII',
    email: 'rohit@jecrc.edu',
    phone: '+91 98765 43230',
    profileImage: 'https://via.placeholder.com/100x100?text=RK',
    performance: {
      currentGPA: 7.8,
      semesterGPA: [8.2, 8.0, 7.9, 7.8, 7.8, 7.8],
      attendance: 78,
      monthlyAttendance: [82, 76, 80, 78, 75, 78],
      assignments: { submitted: 22, total: 28, avgScore: 72 },
      exams: {
        midterm: 75,
        finals: 78,
        quizzes: [14, 15, 16, 13, 17],
      },
      skills: {
        technical: 75,
        communication: 65,
        problemSolving: 70,
        teamwork: 72,
        creativity: 68,
        leadership: 60,
      },
    },
    courses: {
      'Machine Learning': { grade: 'B+', marks: 78, attendance: 80 },
      'Data Science': { grade: 'B', marks: 75, attendance: 75 },
      'Advanced AI': { grade: 'B+', marks: 80, attendance: 78 },
      'Database Systems': { grade: 'A', marks: 85, attendance: 82 },
    },
    activities: [
      { date: '2025-09-03', activity: 'Late Assignment Submission', type: 'assignment' },
      { date: '2025-09-07', activity: 'Missed Class - AI', type: 'absence' },
      { date: '2025-09-09', activity: 'Extra Help Session', type: 'support' },
      { date: '2025-09-14', activity: 'Improvement Plan Meeting', type: 'meeting' },
    ],
    risk: 'medium',
    trend: 'declining',
  },
  {
    rollNo: 'CSE004',
    name: 'Sneha Gupta',
    section: 'CS501-A',
    semester: 'X',
    email: 'sneha@jecrc.edu',
    phone: '+91 98765 43240',
    profileImage: 'https://via.placeholder.com/100x100?text=SG',
    performance: {
      currentGPA: 9.5,
      semesterGPA: [9.0, 9.2, 9.3, 9.4, 9.5, 9.5],
      attendance: 98,
      monthlyAttendance: [97, 98, 99, 98, 100, 98],
      assignments: { submitted: 32, total: 32, avgScore: 95 },
      exams: {
        midterm: 95,
        finals: 98,
        quizzes: [20, 19, 20, 20, 19],
      },
      skills: {
        technical: 98,
        communication: 92,
        problemSolving: 95,
        teamwork: 88,
        creativity: 90,
        leadership: 95,
      },
    },
    courses: {
      'Machine Learning': { grade: 'A+', marks: 98, attendance: 100 },
      'Data Science': { grade: 'A+', marks: 96, attendance: 98 },
      'Advanced AI': { grade: 'A+', marks: 95, attendance: 97 },
      'Database Systems': { grade: 'A+', marks: 92, attendance: 98 },
    },
    activities: [
      { date: '2025-09-01', activity: 'Published Research Paper', type: 'research' },
      { date: '2025-09-04', activity: 'Guest Lecture Delivered', type: 'teaching' },
      { date: '2025-09-08', activity: 'International Conference', type: 'conference' },
      { date: '2025-09-15', activity: 'Innovation Award', type: 'achievement' },
    ],
    risk: 'low',
    trend: 'excellent',
  },
];

const FacultyAnalytics = () => {
  const [selectedStudent, setSelectedStudent] = useState(studentsData[0]);
  const [activeView, setActiveView] = useState('overview');
  const [selectedTimeframe, setSelectedTimeframe] = useState('current');
  const [compareMode, setCompareMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [comparedStudent, setComparedStudent] = useState(null);

  // Filtered students for selection
  const filteredStudents = useMemo(() => {
    return studentsData.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Dynamic analytics based on selected student
  const analytics = useMemo(() => {
    if (!selectedStudent) return {};
    const student = selectedStudent;
    const courseCount = Object.keys(student.courses).length || 1; // Avoid division by zero
    const avgCourseScore =
      Object.values(student.courses).reduce((sum, course) => sum + course.marks, 0) / courseCount;

    return {
      academicPerformance: {
        gpa: student.performance.currentGPA,
        gpaChange:
          student.performance.semesterGPA.length > 1
            ? ((student.performance.semesterGPA.slice(-1)[0] - student.performance.semesterGPA.slice(-2)[0]) * 100).toFixed(1)
            : 0,
        avgScore: avgCourseScore.toFixed(1),
        rank: Math.ceil(Math.random() * 10), // Simulated rank
      },
      attendance: {
        overall: student.performance.attendance,
        trend:
          student.performance.monthlyAttendance.length > 1
            ? student.performance.monthlyAttendance.slice(-1)[0] - student.performance.monthlyAttendance.slice(-2)[0]
            : 0,
        consistency: Math.min(...student.performance.monthlyAttendance) || 0,
      },
      assignments: {
        completion: Math.round(
          (student.performance.assignments.submitted / student.performance.assignments.total) * 100
        ),
        avgScore: student.performance.assignments.avgScore,
        submitted: student.performance.assignments.submitted,
        total: student.performance.assignments.total,
      },
      engagement: {
        level: student.risk === 'low' ? 'High' : student.risk === 'medium' ? 'Medium' : 'Low',
        activities: student.activities.length,
        lastActivity: student.activities.slice(-1)[0]?.date || 'N/A',
      },
    };
  }, [selectedStudent]);

  // Chart data preparations
  const gpaProgressData = selectedStudent
    ? selectedStudent.performance.semesterGPA.map((gpa, index) => ({
        semester: `Sem ${index + 1}`,
        gpa: gpa,
        target: 8.5,
      }))
    : [];

  const attendanceProgressData = selectedStudent
    ? selectedStudent.performance.monthlyAttendance.map((attendance, index) => ({
        month: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'][index] || `Month ${index + 1}`,
        attendance: attendance,
        target: 85,
      }))
    : [];

  const skillsRadarData = selectedStudent
    ? Object.entries(selectedStudent.performance.skills).map(([skill, value]) => ({
        skill: skill.charAt(0).toUpperCase() + skill.slice(1),
        value: value,
        fullMark: 100,
      }))
    : [];

  const coursesPerformanceData = selectedStudent
    ? Object.entries(selectedStudent.courses).map(([course, data]) => ({
        course: course.length > 15 ? course.substring(0, 15) + '...' : course,
        marks: data.marks,
        attendance: data.attendance,
      }))
    : [];

  // Compare mode data
  const compareData = useMemo(() => {
    if (!compareMode || !comparedStudent) return null;
    return {
      gpa: [
        { name: selectedStudent.name, gpa: selectedStudent.performance.currentGPA },
        { name: comparedStudent.name, gpa: comparedStudent.performance.currentGPA },
      ],
      attendance: [
        { name: selectedStudent.name, attendance: selectedStudent.performance.attendance },
        { name: comparedStudent.name, attendance: comparedStudent.performance.attendance },
      ],
    };
  }, [compareMode, selectedStudent, comparedStudent]);

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, color, description }) => (
    <div className="faculty-card p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl bg-opacity-10" style={{ backgroundColor: color }}>
          <Icon size={24} style={{ color }} />
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-500' : 'text-gray-500'
            }`}
          >
            {trend > 0 ? <TrendingUp size={16} /> : trend < 0 ? <TrendingDown size={16} /> : null}
            {trend !== 0 && `${Math.abs(trend)}${typeof trend === 'string' ? '' : '%'}`}
          </div>
        )}
      </div>
      <div>
        <div className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          {value}
        </div>
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          {title}
        </p>
        {subtitle && (
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {subtitle}
          </p>
        )}
        {description && (
          <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
            {description}
          </p>
        )}
      </div>
    </div>
  );

  const StudentSelector = () => (
    <div className="faculty-card p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex-1">
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            Select Student for Analytics
          </label>
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search by name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-500"
              style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
            />
          </div>
        </div>

        <div className="lg:w-80">
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            Student
          </label>
          <select
            value={selectedStudent?.rollNo || ''}
            onChange={(e) => setSelectedStudent(studentsData.find((s) => s.rollNo === e.target.value))}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
          >
            {filteredStudents.map((student) => (
              <option key={student.rollNo} value={student.rollNo}>
                {student.rollNo} - {student.name}
              </option>
            ))}
          </select>
        </div>

        {compareMode && (
          <div className="lg:w-80">
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              Compare With
            </label>
            <select
              value={comparedStudent?.rollNo || ''}
              onChange={(e) =>
                setComparedStudent(studentsData.find((s) => s.rollNo === e.target.value))
              }
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
              style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
            >
              <option value="">Select Student</option>
              {filteredStudents
                .filter((s) => s.rollNo !== selectedStudent?.rollNo)
                .map((student) => (
                  <option key={student.rollNo} value={student.rollNo}>
                    {student.rollNo} - {student.name}
                  </option>
                ))}
            </select>
          </div>
        )}

        <div className="lg:w-48">
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            Timeframe
          </label>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
          >
            <option value="current">Current Semester</option>
            <option value="previous">Previous Semester</option>
            <option value="yearly">Full Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {selectedStudent && (
        <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
          <div className="flex items-center gap-4">
            <img
              src={selectedStudent.profileImage}
              alt={selectedStudent.name}
              className="w-16 h-16 rounded-full border-2 border-red-200"
            />
            <div className="flex-1">
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                {selectedStudent.name}
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {selectedStudent.rollNo} • {selectedStudent.section} • Semester{' '}
                {selectedStudent.semester}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold" style={{ color: 'var(--faculty-primary)' }}>
                {selectedStudent.performance.currentGPA}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Current GPA
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="faculty-portal min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Student Analytics
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Comprehensive student performance insights and trends
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setCompareMode(!compareMode);
              if (!compareMode) setComparedStudent(null); // Reset compared student when exiting compare mode
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              compareMode ? 'text-white' : 'border border-gray-300 dark:border-gray-600'
            }`}
            style={{
              backgroundColor: compareMode ? 'var(--faculty-primary)' : 'transparent',
              color: compareMode ? 'white' : 'var(--text)',
            }}
          >
            <BarChart3 size={18} />
            Compare Mode
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
            style={{ color: 'var(--text)' }}
          >
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>

      {/* Student Selector */}
      <StudentSelector />

      {selectedStudent && (
        <>
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              icon={Target}
              title="Current GPA"
              value={analytics.academicPerformance?.gpa || 0}
              subtitle="Academic Performance"
              trend={parseFloat(analytics.academicPerformance?.gpaChange) || 0}
              color="var(--chart-color-1)"
              description={`Rank: ${analytics.academicPerformance?.rank || '-'} in class`}
            />
            <StatCard
              icon={Activity}
              title="Attendance"
              value={`${analytics.attendance?.overall || 0}%`}
              subtitle="Overall Attendance"
              trend={analytics.attendance?.trend || 0}
              color="var(--chart-color-2)"
              description={`Consistency: ${analytics.attendance?.consistency || 0}% min`}
            />
            <StatCard
              icon={FileText}
              title="Assignment Score"
              value={`${analytics.assignments?.avgScore || 0}%`}
              subtitle={`${analytics.assignments?.submitted || 0}/${analytics.assignments?.total || 0} completed`}
              trend={
                (analytics.assignments?.completion || 0) > 80
                  ? 5
                  : (analytics.assignments?.completion || 0) > 60
                  ? 0
                  : -5
              }
              color="var(--chart-color-3)"
              description={`Completion: ${analytics.assignments?.completion || 0}%`}
            />
            <StatCard
              icon={Zap}
              title="Engagement"
              value={analytics.engagement?.level || 'N/A'}
              subtitle="Student Engagement Level"
              color="var(--chart-color-4)"
              description={`${analytics.engagement?.activities || 0} recent activities`}
            />
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
            {['overview', 'performance', 'skills', 'activities'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveView(tab)}
                className={`px-4 py-2 font-medium capitalize transition-colors ${
                  activeView === tab
                    ? 'border-b-2 border-red-500 text-red-600'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Content based on active view */}
          {activeView === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* GPA Progress */}
              <div className="faculty-card p-6">
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  GPA Progress
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={gpaProgressData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                      <XAxis dataKey="semester" stroke="var(--text-muted)" />
                      <YAxis domain={[6, 10]} stroke="var(--text-muted)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--card)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          color: 'var(--text)',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="gpa"
                        stroke="var(--chart-color-1)"
                        strokeWidth={3}
                        dot={{ fill: 'var(--chart-color-1)', strokeWidth: 2, r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="target"
                        stroke="var(--chart-color-2)"
                        strokeDasharray="5 5"
                        strokeWidth={2}
                      />
                    </LineChart>
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
                    <AreaChart data={attendanceProgressData}>
                      <defs>
                        <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--chart-color-2)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--chart-color-2)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                      <XAxis dataKey="month" stroke="var(--text-muted)" />
                      <YAxis domain={[60, 100]} stroke="var(--text-muted)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--card)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          color: 'var(--text)',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="attendance"
                        stroke="var(--chart-color-2)"
                        fillOpacity={1}
                        fill="url(#attendanceGradient)"
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeView === 'performance' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Course Performance */}
              <div className="faculty-card p-6">
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Course Performance
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={coursesPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                      <XAxis
                        dataKey="course"
                        stroke="var(--text-muted)"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis stroke="var(--text-muted)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--card)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          color: 'var(--text)',
                        }}
                      />
                      <Bar dataKey="marks" fill="var(--chart-color-1)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Grade Distribution */}
              <div className="faculty-card p-6">
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Grade Distribution
                </h3>
                <div className="space-y-4">
                  {Object.entries(selectedStudent.courses).map(([course, data], index) => (
                    <div key={course} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{course}</span>
                        <span
                          className="font-bold"
                          style={{ color: `var(--chart-color-${(index % 5) + 1})` }}
                        >
                          {data.grade} ({data.marks}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${data.marks}%`,
                            backgroundColor: `var(--chart-color-${(index % 5) + 1})`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeView === 'skills' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Skills Radar */}
              <div className="faculty-card p-6">
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Skills Assessment
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={skillsRadarData}
                        dataKey="value"
                        nameKey="skill"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {skillsRadarData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={`var(--chart-color-${(index % 6) + 1})`}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--card)',
                          border: '1px solid var(--border)',
                          borderRadius: '8px',
                          color: 'var(--text)',
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Skills Breakdown */}
              <div className="faculty-card p-6">
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Skills Breakdown
                </h3>
                <div className="space-y-4">
                  {Object.entries(selectedStudent.performance.skills).map(([skill, value], index) => (
                    <div key={skill} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium capitalize">
                          {skill.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span
                          className="font-bold"
                          style={{ color: `var(--chart-color-${(index % 6) + 1})` }}
                        >
                          {value}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className="h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${value}%`,
                            backgroundColor: `var(--chart-color-${(index % 6) + 1})`,
                          }}
                        />
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {value >= 90
                          ? 'Excellent'
                          : value >= 80
                          ? 'Good'
                          : value >= 70
                          ? 'Average'
                          : 'Needs Improvement'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeView === 'activities' && (
            <div className="space-y-6">
              <div className="faculty-card p-6">
                <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                  Recent Activities
                </h3>

                <div className="space-y-4">
                  {selectedStudent.activities.map((activity, index) => {
                    const getActivityColor = (type) => {
                      const colors = {
                        assignment: 'var(--chart-color-1)',
                        quiz: 'var(--chart-color-2)',
                        workshop: 'var(--chart-color-3)',
                        presentation: 'var(--chart-color-4)',
                        research: 'var(--chart-color-5)',
                        achievement: 'var(--chart-color-6)',
                      };
                      return colors[type] || 'var(--chart-color-1)';
                    };

                    return (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 rounded-lg"
                        style={{ backgroundColor: 'var(--hover)' }}
                      >
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: getActivityColor(activity.type) }}
                        />
                        <div className="flex-1">
                          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                            {activity.activity}
                          </p>
                          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                            {activity.date} • {activity.type}
                          </p>
                        </div>
                        <div
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: getActivityColor(activity.type) + '20',
                            color: getActivityColor(activity.type),
                          }}
                        >
                          {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FacultyAnalytics;