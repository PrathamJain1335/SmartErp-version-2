import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { authAPI } from './services/api';
import Header from './AdminPortal/Header';
import Shell from './AdminPortal/Shell';
import Sidebar from './AdminPortal/Sidebar';
import Dashboard from './AdminPortal/Dashboard';
import FacultyList from './AdminPortal/FacultyList';
import FacultyAttendance from './AdminPortal/FacultyAttendance';
import CommunicationHub from './AdminPortal/CommunicationHub';
import Reports from './AdminPortal/Reports';
import ManageNotifications from './AdminPortal/ManageNotifications';
import FacultyProfile from './AdminPortal/FacultyProfile';
import StudentDetails from './AdminPortal/StudentDetails';
import Examination from './AdminPortal/Examination';
import Library from './AdminPortal/Library';
import FeeManagement from './AdminPortal/FeeManagement';
import Curriculum from './AdminPortal/Curriculum';
import ERPChatbot from './components/ERPChatbot';
import ChatbotToggle from './components/ChatbotToggle';
import { createNavigationHandler } from './utils/chatbotNavigation';

const initialData = {
  profile: {
    name: "Dr. Admin User",
    email: "admin@jecrc.ac.in",
    photo: "/image.png",
    role: "Administrator",
    department: "Administration",
    phone: "+91 9876543210",
    address: "JECRC University, Jaipur, Rajasthan"
  },
  notifications: [
    {
      id: 1,
      title: "New Faculty Onboarding",
      message: "Dr. John Smith has joined the Computer Science department",
      timestamp: "2025-01-13 10:30 AM",
      type: "info",
      read: false
    },
    {
      id: 2,
      title: "System Maintenance",
      message: "Scheduled maintenance on Sunday 2 AM - 4 AM",
      timestamp: "2025-01-12 2:00 PM",
      type: "warning",
      read: false
    },
    {
      id: 3,
      title: "Exam Results Published",
      message: "Mid-semester exam results are now available",
      timestamp: "2025-01-11 9:15 AM",
      type: "success",
      read: true
    }
  ],
  faculty: [
    {
      id: 1,
      name: "Dr. Priya Sharma",
      email: "priya.sharma@jecrc.ac.in",
      department: "Computer Science",
      subjects: ["Data Structures", "Algorithms"],
      phone: "+91 9876543211",
      status: "Active"
    },
    {
      id: 2,
      name: "Prof. Rajesh Kumar",
      email: "rajesh.kumar@jecrc.ac.in",
      department: "Mathematics",
      subjects: ["Calculus", "Linear Algebra"],
      phone: "+91 9876543212",
      status: "Active"
    }
  ],
  students: [
    {
      id: 1,
      name: "Amit Sharma",
      email: "amit.sharma@student.jecrc.ac.in",
      rollNo: "21CSE001",
      course: "B.Tech CSE",
      semester: 3,
      phone: "+91 9876543213",
      status: "Active"
    },
    {
      id: 2,
      name: "Priya Gupta",
      email: "priya.gupta@student.jecrc.ac.in",
      rollNo: "21CSE002",
      course: "B.Tech CSE",
      semester: 3,
      phone: "+91 9876543214",
      status: "Active"
    }
  ],
  courses: [
    {
      id: 1,
      name: "Data Structures and Algorithms",
      code: "CSE301",
      credits: 4,
      department: "Computer Science",
      faculty: "Dr. Priya Sharma"
    },
    {
      id: 2,
      name: "Database Management Systems",
      code: "CSE302",
      credits: 3,
      department: "Computer Science",
      faculty: "Prof. Arun Sharma"
    }
  ],
  reports: []
};

// Enhanced auth check for admin
const isAdminAuthenticated = () => {
  const currentUser = authAPI.getCurrentUser();
  return currentUser.isAuthenticated && currentUser.role === 'admin';
};

const AdminProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = () => {
      try {
        if (isAdminAuthenticated()) {
          setAuthenticated(true);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Verifying admin access...</p>
        </div>
      </div>
    );
  }
  
  return authenticated ? children : null;
};

const SectionRoutes = ({ activePage, data, handlers }) => (
  <Routes>
    <Route path="dashboard" element={<Dashboard data={data} handlers={handlers} />} />
    <Route path="faculty-list" element={<FacultyList data={data} handlers={handlers} />} />
    <Route path="faculty-attendance" element={<FacultyAttendance data={data} handlers={handlers} />} />
    <Route path="communication-hub" element={<CommunicationHub data={data} handlers={handlers} />} />
    <Route path="reports" element={<Reports data={data} handlers={handlers} />} />
    <Route path="manage-notifications" element={<ManageNotifications data={data} handlers={handlers} />} />
    <Route path="faculty-profile" element={<FacultyProfile data={data} handlers={handlers} />} />
    <Route path="student-details" element={<StudentDetails data={data} handlers={handlers} />} />
    <Route path="examination" element={<Examination data={data} handlers={handlers} />} />
    <Route path="library" element={<Library data={data} handlers={handlers} />} />
    <Route path="fee-management" element={<FeeManagement data={data} handlers={handlers} />} />
    <Route path="curriculum" element={<Curriculum data={data} handlers={handlers} />} />
    {/* Default fallback to dashboard */}
    <Route path="*" element={<Dashboard data={data} handlers={handlers} />} />
  </Routes>
);

const AdminContent = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [pinned, setPinned] = useState(() => JSON.parse(localStorage.getItem("sidebarPinned") || "true"));
  const [sidebarExpanded, setSidebarExpanded] = useState(pinned);
  const [activePage, setActivePage] = useState("Dashboard");
  const [data, setData] = useState(initialData);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const pathToPage = {
      '/admin/dashboard': 'Dashboard',
      '/admin/faculty-list': 'FacultyList',
      '/admin/faculty-attendance': 'FacultyAttendance',
      '/admin/communication-hub': 'CommunicationHub',
      '/admin/reports': 'Reports',
      '/admin/manage-notifications': 'ManageNotifications',
      '/admin/faculty-profile': 'FacultyProfile',
      '/admin/student-details': 'StudentDetails',
      '/admin/examination': 'Examination',
      '/admin/library': 'Library',
      '/admin/fee-management': 'FeeManagement',
      '/admin/curriculum': 'Curriculum',
    };
    const page = pathToPage[location.pathname] || 'Dashboard';
    setActivePage(page);
    localStorage.setItem("activePage", page);
  }, [location]);

  const handlers = {
    toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    theme,
    updateProfile: (prof) => setData((d) => ({ ...d, profile: prof })),
    saveReport: (report) => setData((d) => ({ ...d, reports: [...d.reports, report] })),
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("dark-root", theme === "dark");
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("sidebarPinned", JSON.stringify(pinned));
  }, [pinned]);

  return (
    <>
      <Shell
        sidebar={
          <Sidebar
            activeSection={activePage}
            setActiveSection={setActivePage}
            pinned={pinned}
            setPinned={setPinned}
            onExpandChange={setSidebarExpanded}
            basePath="/admin"
            sidebarExpanded={sidebarExpanded}
          />
        }
        header={
          <Header
            activePage={activePage}
            theme={theme}
            toggleTheme={handlers.toggleTheme}
            notifications={data?.notifications ?? []}
            user={{
              name: data?.profile?.name ?? "",
              photo: data?.profile?.photo ?? "",
            }}
            onLogout={() => {
              authAPI.logout();
              window.location.href = "/";
            }}
            onProfile={() => setActivePage("FacultyProfile")}
          />
        }
        main={<SectionRoutes activePage={activePage} data={data} handlers={handlers} />}
        sidebarExpanded={sidebarExpanded}
      />
      <ERPChatbot
        isOpen={chatbotOpen}
        onClose={() => setChatbotOpen(false)}
        userRole="admin"
        onNavigate={(navigationType) => {
          const navigationHandler = createNavigationHandler(navigate, 'admin', setActivePage);
          navigationHandler.handleNavigation(navigationType);
        }}
      />
      <ChatbotToggle
        onClick={() => setChatbotOpen(!chatbotOpen)}
        isOpen={chatbotOpen}
      />
    </>
  );
};

const Admin = () => {
  return (
    <AdminProtectedRoute>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/*" element={<AdminContent />} />
      </Routes>
    </AdminProtectedRoute>
  );
};

export default Admin;
