import React, { useState, useEffect } from 'react';
import ModernFacultyDashboard from './ModernDashboard';
import FacultyProfile from './FacultyProfile';
import FacultyCourses from './Courses';
import FacultyStudents from './Students';
import FacultyAssignments from './Assignments';
import FacultyApprovals from './Approvals';
import FacultyExamination from './FacultyExamination';
import FacultyEvaluation from './FacultyEvaluation';
import FacultyTimetable from './FacultyTimetable';
import FacultyAnalytics from './FacultyAnalytics';
import './theme.css';
import {
  Home, User, BookOpen, Users, FileText, CheckSquare, GraduationCap,
  ClipboardList, Calendar, BarChart3, Settings, LogOut, Bell, Sun, Moon, Menu, X, Search
} from 'lucide-react';

const FacultyPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [facultyData, setFacultyData] = useState({
    students: [
      { id: 1, name: 'John Doe', lastSeen: new Date().toISOString() },
      { id: 2, name: 'Jane Smith', lastSeen: new Date().toISOString() },
      { id: 3, name: 'Bob Johnson', lastSeen: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() }
    ],
    courses: [
      { id: 1, name: 'Physics 101', status: 'active' },
      { id: 2, name: 'Chemistry 102', status: 'active' },
      { id: 3, name: 'Math 103', status: 'inactive' }
    ],
    assignments: [
      { id: 1, title: 'Physics Lab Report', status: 'pending' },
      { id: 2, title: 'Chemistry Quiz', status: 'graded' },
      { id: 3, title: 'Math Problem Set', status: 'pending' }
    ],
    approvals: [
      { id: 1, type: 'Grade Change', status: 'pending' },
      { id: 2, type: 'Course Registration', status: 'approved' },
      { id: 3, type: 'Assignment Extension', status: 'pending' }
    ]
  });

  // Theme toggle effect
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'examinations', label: 'Examinations', icon: GraduationCap },
    { id: 'evaluations', label: 'Evaluations', icon: ClipboardList },
    { id: 'timetable', label: 'Timetable', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'approvals', label: 'Approvals', icon: CheckSquare }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ModernFacultyDashboard data={facultyData} />;
      case 'profile':
        return <FacultyProfile />;
      case 'courses':
        return <FacultyCourses data={facultyData.courses} />;
      case 'students':
        return <FacultyStudents data={facultyData.students} />;
      case 'assignments':
        return <FacultyAssignments data={facultyData.assignments} />;
      case 'examinations':
        return <FacultyExamination />;
      case 'evaluations':
        return <FacultyEvaluation />;
      case 'timetable':
        return <FacultyTimetable />;
      case 'analytics':
        return <FacultyAnalytics />;
      case 'approvals':
        return <FacultyApprovals data={facultyData.approvals} />;
      default:
        return <ModernFacultyDashboard data={facultyData} />;
    }
  };

  return (
    <div className="faculty-portal min-h-screen flex" data-theme={isDarkMode ? 'dark' : 'light'}>
      {/* Sidebar */}
      <div className={`faculty-sidebar ${isSidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 flex-shrink-0 relative z-30`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <div>
                <h2 className="text-xl font-bold" style={{ color: 'var(--faculty-primary)' }}>Faculty Portal</h2>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>JECRC University</p>
              </div>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-opacity-20 transition-colors"
              style={{ backgroundColor: 'var(--hover)' }}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === item.id
                      ? 'faculty-card-red text-white'
                      : 'hover:bg-opacity-10'
                  }`}
                  style={{
                    backgroundColor: activeTab === item.id ? 'var(--faculty-primary)' : 'transparent'
                  }}
                  title={!isSidebarOpen ? item.label : ''}
                >
                  <item.icon size={20} />
                  {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Settings and Theme Toggle */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-opacity-10 transition-colors"
              style={{ backgroundColor: 'var(--hover)' }}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              {isSidebarOpen && <span className="font-medium">
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </span>}
            </button>
            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-opacity-10 transition-colors"
              style={{ backgroundColor: 'var(--hover)' }}
            >
              <LogOut size={20} />
              {isSidebarOpen && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="faculty-card border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {navigationItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  style={{ 
                    backgroundColor: 'var(--card)',
                    color: 'var(--text)'
                  }}
                />
              </div>

              {/* Notifications */}
              <button className="relative p-3 rounded-lg hover:bg-opacity-10" style={{ backgroundColor: 'var(--hover)' }}>
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Profile */}
              <div className="flex items-center gap-3">
                <img
                  src="https://via.placeholder.com/40x40?text=FP"
                  alt="Faculty Profile"
                  className="w-10 h-10 rounded-full border-2 border-red-200"
                />
                <div className="text-sm">
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Dr. Sarah Johnson</p>
                  <p style={{ color: 'var(--text-muted)' }}>Computer Science</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto" style={{ backgroundColor: 'var(--background)' }}>
          {renderContent()}
        </main>
      </div>

      {/* Mobile Overlay */}
      {!isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default FacultyPortal;