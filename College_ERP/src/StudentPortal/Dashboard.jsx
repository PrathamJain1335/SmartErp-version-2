import React, { useState, useEffect } from "react";
import { Doughnut, Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
} from "chart.js";
import {
  AccessTime as AccessTimeIcon,
  Announcement as AnnouncementIcon,
  Assignment as AssignmentIcon,
  Event as EventIcon,
  LibraryBooks as LibraryBooksIcon,
  Work as WorkIcon,
  Grade as GradeIcon,
  Link as LinkIcon,
  Cloud as CloudIcon,
  Upload as UploadIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  TrendingUp,
  Schedule,
  School,
  Psychology,
  EmojiEvents,
  NotificationsActive,
  CalendarToday,
  MenuBook,
  BarChart,
  Timeline,
  FlashOn,
  Star,
  Insights,
  AutoGraph,
} from "@mui/icons-material";

// Import theme CSS
import '../theme.css';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler
);

export default function Dashboard({ data, handlers }) {
  const { profile, courses, attendance, assignments, exams, results, notifications } = data || {};
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedMetric, setSelectedMetric] = useState('overview');
  const [greetingMessage, setGreetingMessage] = useState('');
  const [weatherData, setWeatherData] = useState({ temp: 24, condition: 'Sunny' });
  const [isDataLoading, setIsDataLoading] = useState(false);

  // Detect if we're still loading data (when profile name is 'Loading...')
  const isLoading = !profile || profile.name === 'Loading...';
  
  // Show refresh button when data is loaded
  const canRefresh = profile && profile.name !== 'Loading...' && handlers?.refreshData;
  
  // Log the current profile data for debugging
  console.log('📊 Dashboard profile data:', profile);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Set dynamic greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreetingMessage('Good Morning');
    else if (hour < 17) setGreetingMessage('Good Afternoon');
    else setGreetingMessage('Good Evening');
  }, []);

  // Enhanced subjects data with trends and insights
  const subjects = [
    { 
      id: "sub1", 
      name: "Data Structures & Algorithms", 
      code: "CS201",
      attendance: 92, 
      grade: "A",
      trend: '+5%',
      nextClass: "Today, 10:30 AM",
      professor: "Dr. Sharma",
      room: "Room 201",
      status: "excellent"
    },
    { 
      id: "sub2", 
      name: "Database Management Systems", 
      code: "CS202",
      attendance: 88, 
      grade: "A-",
      trend: '+2%',
      nextClass: "Tomorrow, 2:00 PM",
      professor: "Dr. Patel",
      room: "Lab B",
      status: "good"
    },
    { 
      id: "sub3", 
      name: "Computer Networks", 
      code: "CS203",
      attendance: 76, 
      grade: "B+",
      trend: '-3%',
      nextClass: "Monday, 11:00 AM",
      professor: "Prof. Kumar",
      room: "Room 305",
      status: "warning"
    },
    { 
      id: "sub4", 
      name: "Software Engineering", 
      code: "CS204",
      attendance: 95, 
      grade: "A+",
      trend: '+7%',
      nextClass: "Wednesday, 9:00 AM",
      professor: "Dr. Singh",
      room: "Room 401",
      status: "excellent"
    },
    { 
      id: "sub5", 
      name: "Machine Learning", 
      code: "CS205",
      attendance: 82, 
      grade: "B+",
      trend: '0%',
      nextClass: "Friday, 3:00 PM",
      professor: "Dr. Agarwal",
      room: "Lab C",
      status: "good"
    },
  ];

  // Enhanced schedule with more details (moved up to avoid reference error)
  const todaySchedule = [
    {
      id: 1,
      subject: "Data Structures",
      code: "CS201",
      time: "10:30 AM - 11:30 AM",
      professor: "Dr. Sharma",
      room: "Room 201",
      type: "Lecture",
      status: "upcoming",
      duration: "1 hour"
    },
    {
      id: 2,
      subject: "Database Systems Lab",
      code: "CS202L",
      time: "2:00 PM - 4:00 PM",
      professor: "Dr. Patel",
      room: "Lab B",
      type: "Lab",
      status: "ongoing",
      duration: "2 hours"
    },
    {
      id: 3,
      subject: "Software Engineering",
      code: "CS204",
      time: "4:30 PM - 5:30 PM",
      professor: "Dr. Singh",
      room: "Room 401",
      type: "Tutorial",
      status: "upcoming",
      duration: "1 hour"
    },
  ];

  // Calculate overall metrics safely
  const totalClasses = attendance?.length || 0;
  const attendedClasses = attendance?.filter ? attendance.filter((a) => a.present).length : 0;
  const attendancePercentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;
  const overallGPA = profile?.cgpa || 0;
  const semesterRank = 12; // This should come from backend later
  
  // Safe data for display
  const safeAssignments = assignments || [];
  const safeSubjects = subjects || [];
  const safeCourses = courses || [];
  const safeTodaySchedule = todaySchedule || [];

  // Enhanced chart data for modern visualizations
  const attendanceChartData = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [attendancePercentage, 100 - attendancePercentage],
        backgroundColor: ['#10b981', '#f87171'],
        borderWidth: 0,
        borderRadius: 8,
      },
    ],
  };

  // Performance trend data
  const performanceData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'GPA Trend',
        data: [8.2, 8.4, 8.1, 8.6, 8.8, 8.6],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3b82f6',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
      },
      {
        label: 'Attendance %',
        data: [85, 88, 82, 90, 87, 87],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10b981',
        pointBorderWidth: 2,
        pointHoverRadius: 6,
      },
    ],
  };

  // Subject-wise performance data
  const subjectPerformanceData = {
    labels: subjects.map(s => s.code),
    datasets: [
      {
        label: 'Attendance %',
        data: subjects.map(s => s.attendance),
        backgroundColor: subjects.map(s => 
          s.status === 'excellent' ? '#10b981' :
          s.status === 'good' ? '#3b82f6' : '#f59e0b'
        ),
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // State for modals
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // State for upload files
  const [selectedFiles, setSelectedFiles] = useState({});

  const handleFileChange = (e, assignmentId) => {
    const file = e.target.files[0];
    if (file && file.size <= 4 * 1024 * 1024) { // 4 MB limit
      setSelectedFiles((prev) => ({ ...prev, [assignmentId]: file }));
      console.log(`Uploaded file for assignment ${assignmentId}: ${file.name}`);
      // Integrate with handlers if needed, e.g., handlers.submitAssignment(assignmentId);
    } else {
      alert("File size exceeds 4 MB limit.");
    }
  };

  const handleAnnouncementClick = (notif) => {
    setSelectedAnnouncement(notif);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedAnnouncement(null);
  };

  // Sample schedule with statuses
  const schedule = [
    { id: "class1", subject: "Lecture 01: Advanced Mathematics", time: "8:00 AM - 8:50 AM | Room 201", status: "Ongoing" },
    { id: "class2", subject: "Lecture 02: Physics II", time: "8:50 AM - 9:40 AM | Room 305", status: "Upcoming" },
    { id: "class3", subject: "Lecture 03: Chemistry Fundamentals", time: "9:40 AM - 10:30 AM | Lab A", status: "Upcoming" },
    { id: "class4", subject: "Lecture 04: Data Structures", time: "10:30 AM - 11:20 AM | Room 402", status: "No Class" },
    { id: "class5", subject: "Lecture 05: Algorithms", time: "11:20 AM - 12:05 PM | Room 201", status: "Cancelled" },
    { id: "class6", subject: "Lecture 06: Computer Networks", time: "12:05 PM - 12:50 PM | Room 305", status: "Upcoming" },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "Ongoing":
        return <CheckCircleIcon className="text-green-600" />;
      case "Upcoming":
        return <HourglassEmptyIcon className="text-blue-600" />;
      case "Cancelled":
        return <CancelIcon className="text-red-600" />;
      case "No Class":
        return <CancelIcon className="text-gray-600" />;
      default:
        return null;
    }
  };

  // Sample assignments with subjects and numbers
  const sampleAssignments = [
    { id: "as1", subject: "Computer Organization Design ", number: 3, title: "Mathematics Assignment 3", dueDate: "2025-09-11", submitted: false },
    { id: "as2", subject: "Data Structure and Algorithm", number: 1, title: "Physics Lab Report", dueDate: "2025-09-14", submitted: false },
    { id: "as3", subject: "Computer Networks", number: 2, title: "Chemistry Problem Set", dueDate: "2025-09-16", submitted: false },
    { id: "as4", subject: "Operating System", number: 4, title: "DS Coding Challenge", dueDate: "2025-09-18", submitted: false },
    { id: "as5", subject: "Software Engineering and Project Management", number: 5, title: "Algorithm Analysis", dueDate: "2025-09-20", submitted: false },
  ];

  // Enhanced assignments with priority and status
  const enhancedAssignments = [
    { 
      id: "as1", 
      subject: "Data Structures", 
      title: "Binary Trees Implementation", 
      dueDate: "2025-09-25", 
      priority: "high",
      status: "pending",
      progress: 60,
      professor: "Dr. Sharma",
      marks: 25
    },
    { 
      id: "as2", 
      subject: "Database Systems", 
      title: "SQL Query Optimization", 
      dueDate: "2025-09-28", 
      priority: "medium",
      status: "in-progress",
      progress: 30,
      professor: "Dr. Patel",
      marks: 20
    },
    { 
      id: "as3", 
      subject: "Machine Learning", 
      title: "Linear Regression Model", 
      dueDate: "2025-10-02", 
      priority: "medium",
      status: "pending",
      progress: 0,
      professor: "Dr. Agarwal",
      marks: 30
    },
  ];

  // (todaySchedule moved up above to avoid reference error)

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return '#10b981';
      case 'good': return '#3b82f6';
      case 'warning': return '#f59e0b';
      case 'danger': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Header with theme colors */}
      <div className="sticky top-0 z-50 border-b" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/image.png" alt="JECRC University" className="w-12 h-12 rounded-xl shadow-lg" />
              <div>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                  Student Portal
                </h1>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>
                  {greetingMessage}, {profile?.name?.split(' ')[0] || 'Student'}!
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {canRefresh && (
                <button 
                  onClick={handlers.refreshData}
                  disabled={isDataLoading}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 hover:shadow-md" 
                  style={{ 
                    backgroundColor: 'var(--hover)', 
                    borderColor: 'var(--border)',
                    color: 'var(--text)'
                  }}
                  title="Refresh data"
                >
                  <AutoGraph className={`w-4 h-4 ${isDataLoading ? 'animate-spin' : ''}`} style={{ color: 'var(--accent)' }} />
                  <span className="text-xs hidden sm:inline">Refresh</span>
                </button>
              )}
              
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl" style={{ backgroundColor: 'var(--soft)' }}>
                <CloudIcon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                <span className="font-semibold" style={{ color: 'var(--text)' }}>{weatherData.temp}°C</span>
                <span className="text-sm" style={{ color: 'var(--muted)' }}>{weatherData.condition}</span>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ backgroundColor: 'var(--hover)' }}>
                <CalendarToday className="w-4 h-4" style={{ color: 'var(--muted)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="p-6 space-y-6">
        
        {/* Stats Cards with theme colors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Academic Performance Card */}
          <div className="p-6 rounded-xl border transition-all duration-200 hover:shadow-lg" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--soft)' }}>
                <School className="w-6 h-6" style={{ color: 'var(--accent)' }} />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{overallGPA}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>Current GPA</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--muted)' }}>Class Rank</span>
                <span className="font-semibold" style={{ color: 'var(--text)' }}>#{semesterRank}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" style={{ color: 'var(--success)' }} />
                <span className="text-xs" style={{ color: 'var(--success)' }}>+0.2 from last semester</span>
              </div>
            </div>
          </div>

          {/* Attendance Card */}
          <div className="p-6 rounded-xl border transition-all duration-200 hover:shadow-lg" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--soft)' }}>
                <BarChart className="w-6 h-6" style={{ color: 'var(--accent)' }} />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{attendancePercentage}%</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>Attendance</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--muted)' }}>Classes Attended</span>
                <span className="font-semibold" style={{ color: 'var(--text)' }}>{attendedClasses}/{totalClasses}</span>
              </div>
              <div className="flex items-center gap-1">
                <FlashOn className="w-4 h-4" style={{ color: attendancePercentage > 75 ? 'var(--success)' : 'var(--warning)' }} />
                <span className="text-xs" style={{ color: attendancePercentage > 75 ? 'var(--success)' : 'var(--warning)' }}>Above 75% threshold</span>
              </div>
            </div>
          </div>

          {/* Assignments Card */}
          <div className="p-6 rounded-xl border transition-all duration-200 hover:shadow-lg" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--soft)' }}>
                <AssignmentIcon className="w-6 h-6" style={{ color: 'var(--accent)' }} />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{safeAssignments.length}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>Active Tasks</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--muted)' }}>Due This Week</span>
                <span className="font-semibold" style={{ color: 'var(--text)' }}>2</span>
              </div>
              <div className="flex items-center gap-1">
                <Psychology className="w-4 h-4" style={{ color: 'var(--warning)' }} />
                <span className="text-xs" style={{ color: 'var(--warning)' }}>1 high priority</span>
              </div>
            </div>
          </div>

          {/* Achievements Card */}
          <div className="p-6 rounded-xl border transition-all duration-200 hover:shadow-lg" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--soft)' }}>
                <EmojiEvents className="w-6 h-6" style={{ color: 'var(--accent)' }} />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold" style={{ color: 'var(--text)' }}>7</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>Achievements</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--muted)' }}>This Semester</span>
                <span className="font-semibold" style={{ color: 'var(--text)' }}>3 new</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" style={{ color: 'var(--warning)' }} />
                <span className="text-xs" style={{ color: 'var(--muted)' }}>Dean's List candidate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Performance Analytics */}
            <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--soft)' }}>
                    <AutoGraph className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: 'var(--text)' }}>Performance Analytics</h3>
                    <p className="text-sm" style={{ color: 'var(--muted)' }}>6-week trend analysis</p>
                  </div>
                </div>
              </div>
              
              <div className="h-80">
                <Line 
                  data={performanceData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top',
                        labels: {
                          usePointStyle: true,
                          padding: 20,
                          font: { size: 12, weight: 'semibold' }
                        }
                      }
                    },
                    scales: {
                      x: {
                        grid: { display: false },
                        ticks: { color: '#64748b', font: { size: 11 } }
                      },
                      y: {
                        grid: { color: 'rgba(148, 163, 184, 0.1)', drawBorder: false },
                        ticks: { color: '#64748b', font: { size: 11 } }
                      }
                    }
                  }} 
                />
              </div>
            </div>

            {/* Assignments List */}
            <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--soft)' }}>
                  <AssignmentIcon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--text)' }}>Recent Assignments</h3>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>Track your submissions</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 rounded" style={{ backgroundColor: 'var(--hover)' }}></div>
                      <div className="h-4 rounded" style={{ backgroundColor: 'var(--hover)' }}></div>
                      <div className="h-4 rounded" style={{ backgroundColor: 'var(--hover)' }}></div>
                    </div>
                    <p className="text-sm mt-4" style={{ color: 'var(--muted)' }}>Loading assignments...</p>
                  </div>
                ) : safeAssignments.length === 0 ? (
                  <div className="text-center py-8">
                    <AssignmentIcon className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--muted)' }} />
                    <p className="text-sm" style={{ color: 'var(--muted)' }}>No assignments found</p>
                  </div>
                ) : (
                  safeAssignments.map((assignment) => (
                    <div key={assignment.id} className="p-4 rounded-lg border-l-4 border transition-all duration-200 hover:shadow-md" 
                         style={{ backgroundColor: 'var(--hover)', borderLeftColor: getPriorityColor(assignment.priority || 'medium') }}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold" style={{ color: 'var(--text)' }}>{assignment.title || 'Untitled Assignment'}</h4>
                            <span className="text-xs px-2 py-0.5 rounded-full" 
                                  style={{ backgroundColor: getPriorityColor(assignment.priority || 'medium') + '20', color: getPriorityColor(assignment.priority || 'medium') }}>
                              {assignment.priority || 'medium'}
                            </span>
                          </div>
                          <p className="text-sm mb-1" style={{ color: 'var(--muted)' }}>{assignment.course || assignment.subject || 'N/A'}</p>
                          <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--muted)' }}>
                            <span>📅 Due: {assignment.dueDate || 'N/A'}</span>
                            <span>👨‍🏫 {assignment.professor || assignment.instructor || 'TBD'}</span>
                            <span>🏆 {assignment.totalMarks || assignment.marks || 'N/A'} marks</span>
                          </div>
                          {assignment.progress !== undefined && (
                            <div className="mt-2">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="h-2 rounded-full" 
                                     style={{ width: `${assignment.progress}%`, backgroundColor: 'var(--accent)' }}></div>
                              </div>
                              <span className="text-xs" style={{ color: 'var(--muted)' }}>{assignment.progress}% completed</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Announcements */}
            <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--soft)' }}>
                  <AnnouncementIcon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--text)' }}>Recent Announcements</h3>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>Important updates</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--hover)', borderColor: 'var(--border)' }}>
                  <h4 className="font-semibold mb-1" style={{ color: 'var(--text)' }}>Mid-term Examinations</h4>
                  <p className="text-sm mb-2" style={{ color: 'var(--muted)' }}>Mid-term exams will begin from Oct 15, 2025. Please check your individual timetables.</p>
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>📅 Posted: Sep 10, 2025</span>
                </div>
                <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--hover)', borderColor: 'var(--border)' }}>
                  <h4 className="font-semibold mb-1" style={{ color: 'var(--text)' }}>Library Extended Hours</h4>
                  <p className="text-sm mb-2" style={{ color: 'var(--muted)' }}>Library will be open 24/7 during examination period from Oct 10-25.</p>
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>📅 Posted: Sep 8, 2025</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* Today's Schedule */}
            <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--soft)' }}>
                  <Schedule className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--text)' }}>Today's Schedule</h3>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>
                    {currentTime.toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-16 rounded" style={{ backgroundColor: 'var(--hover)' }}></div>
                    <div className="h-16 rounded" style={{ backgroundColor: 'var(--hover)' }}></div>
                    <div className="h-16 rounded" style={{ backgroundColor: 'var(--hover)' }}></div>
                  </div>
                ) : safeTodaySchedule.length === 0 && safeCourses.length === 0 ? (
                  <div className="text-center py-8">
                    <Schedule className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--muted)' }} />
                    <p className="text-sm" style={{ color: 'var(--muted)' }}>No classes scheduled for today</p>
                  </div>
                ) : (
                  // Show courses if no specific schedule available
                  (safeTodaySchedule.length > 0 ? safeTodaySchedule : safeCourses.slice(0, 3)).map((item, index) => (
                    <div key={item.id || index} className="p-4 rounded-xl border-l-4 transition-all duration-200" 
                         style={{ 
                           backgroundColor: 'var(--hover)', 
                           borderLeftColor: item.status === 'ongoing' ? 'var(--success)' : 
                                          item.status === 'upcoming' ? 'var(--accent)' : 'var(--muted)' 
                         }}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold truncate" style={{ color: 'var(--text)' }}>
                              {item.subject || item.title || 'Course'}
                            </h4>
                            <span className="text-xs px-2 py-0.5 rounded-full" 
                                  style={{ backgroundColor: 'var(--soft)', color: 'var(--muted)' }}>
                              {item.code || 'N/A'}
                            </span>
                          </div>
                          <p className="text-sm mb-1" style={{ color: 'var(--muted)' }}>
                            {item.time || item.schedule || 'Time TBD'}
                          </p>
                          <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--muted)' }}>
                            <span>👨‍🏫 {item.professor || item.instructor || 'TBD'}</span>
                            <span>📍 {item.room || 'Room TBD'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Subject Performance */}
            <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--soft)' }}>
                  <MenuBook className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--text)' }}>Subject Performance</h3>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>Your current grades</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {subjects.slice(0, 5).map((subject) => (
                  <div key={subject.id} className="flex items-center justify-between p-3 rounded-lg" 
                       style={{ backgroundColor: 'var(--hover)' }}>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm" style={{ color: 'var(--text)' }}>{subject.code}</h4>
                      <p className="text-xs" style={{ color: 'var(--muted)' }}>{subject.attendance}% attendance</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold" style={{ color: getStatusColor(subject.status) }}>{subject.grade}</div>
                      <div className="text-xs" style={{ color: 'var(--muted)' }}>{subject.trend}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--soft)' }}>
                  <FlashOn className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--text)' }}>Quick Actions</h3>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>Frequently used features</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 text-left rounded-lg border transition-all duration-200 hover:shadow-md" 
                        style={{ backgroundColor: 'var(--hover)', borderColor: 'var(--border)' }}>
                  <AssignmentIcon className="w-8 h-8 mb-2" style={{ color: 'var(--accent)' }} />
                  <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>Submit Assignment</div>
                </button>
                
                <button className="p-3 text-left rounded-lg border transition-all duration-200 hover:shadow-md" 
                        style={{ backgroundColor: 'var(--hover)', borderColor: 'var(--border)' }}>
                  <BarChart className="w-8 h-8 mb-2" style={{ color: 'var(--accent)' }} />
                  <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>Check Attendance</div>
                </button>
                
                <button className="p-3 text-left rounded-lg border transition-all duration-200 hover:shadow-md" 
                        style={{ backgroundColor: 'var(--hover)', borderColor: 'var(--border)' }}>
                  <GradeIcon className="w-8 h-8 mb-2" style={{ color: 'var(--accent)' }} />
                  <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>View Grades</div>
                </button>
                
                <button className="p-3 text-left rounded-lg border transition-all duration-200 hover:shadow-md" 
                        style={{ backgroundColor: 'var(--hover)', borderColor: 'var(--border)' }}>
                  <LibraryBooksIcon className="w-8 h-8 mb-2" style={{ color: 'var(--accent)' }} />
                  <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>Library</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}