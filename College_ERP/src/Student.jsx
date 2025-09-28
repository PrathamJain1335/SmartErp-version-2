import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "./services/api";
import { staticDataService } from "./services/staticDataService";
import Dashboard from "./StudentPortal/Dashboard";
import Header from "./StudentPortal/Header";
import Shell from "./StudentPortal/Shell";
import Sidebar from "./StudentPortal/Sidebar";
import Main from "./StudentPortal/Main";
import ERPChatbot from "./components/ERPChatbot";
import ChatbotToggle from "./components/ChatbotToggle";
import { createNavigationHandler } from "./utils/chatbotNavigation";
import NotificationPanel from "./StudentPortal/NotificationPanel";
import Profile from "./StudentPortal/Profile";
import Courses from "./StudentPortal/Course";
import Result from "./StudentPortal/Result";
import Attendance from "./StudentPortal/Attendance";
import Assignments from "./StudentPortal/Assignment";
import Examination from "./StudentPortal/Examination";
import Certificates from "./StudentPortal/Certificates";
import Career from "./StudentPortal/Career";
import Reports from "./StudentPortal/Reports";
import Library from "./StudentPortal/Library";
import Academics from "./StudentPortal/Academics";
import Fees from "./StudentPortal/Fees";
import Internal from "./StudentPortal/InternalMarks";
import Support from "./StudentPortal/Support";
import Portfolio from "./StudentPortal/Portfolio";
import DigitalPortfolio from "./StudentPortal/components/DigitalPortfolio";
import DocumentUpload from "./StudentPortal/components/DocumentUpload.jsx";
import "./theme.css";

// Fallback component for missing or non-exported sections
const Placeholder = () => (
  <div className="p-6 text-[var(--text)] dark:text-[var(--text)] bg-[var(--bg)] dark:bg-[var(--bg)]">
    <h2 className="text-xl font-semibold">Under Construction</h2>
    <p className="text-[var(--muted)] dark:text-[var(--muted)]">This section is not yet implemented.</p>
  </div>
);

// Initial empty data structure while loading
const getInitialData = () => ({
  profile: { 
    name: 'Loading...', 
    rollNumber: 'N/A', 
    email: 'N/A', 
    photo: './default-avatar.png',
    department: 'N/A',
    semester: 'N/A',
    section: 'N/A',
    cgpa: 0
  },
  courses: [],
  results: [],
  attendance: [],
  assignments: [],
  exams: [],
  notifications: [],
});

export default function Student() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [pinned, setPinned] = useState(() => JSON.parse(localStorage.getItem("sidebarPinned") || "true"));
  const [sidebarExpanded, setSidebarExpanded] = useState(pinned);
  const [activePage, setActivePage] = useState("Dashboard");
  const [data, setData] = useState(getInitialData());
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);

  const handlers = {
    toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    submitAssignment: (assignmentId) => setData((d) => ({
      ...d,
      assignments: d.assignments.map((a) => a.id === assignmentId ? { ...a, submitted: true } : a),
    })),
    updateProfile: (prof) => setData((d) => ({ ...d, profile: prof })),
    refreshData: () => fetchStudentData(),
    logout: () => {
      staticDataService.clearCache();
      authAPI.logout();
      navigate('/');
    }
  };

  // Fetch student data from backend
  const fetchStudentData = async () => {
    try {
      setDataLoading(true);
      console.log('🔄 Fetching student dashboard data...');
      
      // Get current user info
      const currentUser = authAPI.getCurrentUser();
      console.log('📋 Current user info:', {
        userId: currentUser.userId,
        role: currentUser.role,
        profile: currentUser.profile
      });
      
      // Get static data from service (no backend calls)
      const studentData = await staticDataService.getStudentDashboardData();
      console.log('✅ Static student data loaded successfully for:', studentData.profile.name);
      setData(studentData);
    } catch (error) {
      console.error('❌ Error loading static data:', error);
      
      // Use basic static fallback data
      console.log('🔄 Using basic static fallback data');
      
      const basicStaticData = {
        profile: {
          name: 'Suresh Shah',
          rollNumber: 'JECRC-CSE-21-001',
          email: 'suresh.shah.21.1@jecrc.ac.in',
          department: 'Computer Science Engineering',
          semester: 5,
          section: 'A',
          cgpa: 8.5,
          photo: './default-avatar.png'
        },
        courses: [
          { id: 'CS201', title: 'Data Structures & Algorithms', instructor: 'Dr. Sharma' },
          { id: 'CS202', title: 'Database Management Systems', instructor: 'Dr. Patel' }
        ],
        results: [
          { course: 'Data Structures', grade: 'A', marks: 85 },
          { course: 'Database Systems', grade: 'A-', marks: 82 }
        ],
        attendance: [
          { course: 'Data Structures', present: true, date: '2025-09-20' },
          { course: 'Database Systems', present: true, date: '2025-09-20' }
        ],
        assignments: [
          { title: 'Binary Trees Implementation', course: 'Data Structures', dueDate: '2025-09-25', submitted: false },
          { title: 'SQL Query Optimization', course: 'Database Systems', dueDate: '2025-09-28', submitted: false }
        ],
        notifications: [
          { id: 1, title: "Welcome to ERP System", timestamp: "Today", seen: false },
          { id: 2, title: "Welcome Suresh Shah!", timestamp: "Today", seen: false }
        ]
      };
      
      console.log('📊 Basic static fallback data loaded');
      setData(basicStaticData);
    } finally {
      setDataLoading(false);
    }
  };

  // Demo mode: Skip authentication check completely
  useEffect(() => {
    const setupDemoMode = async () => {
      try {
        console.log('🎮 Demo Mode: Skipping authentication, setting up demo user...');
        
        // Set up demo authentication data automatically
        const demoAuthData = {
          authToken: 'demo-student-token-' + Date.now(),
          userRole: 'student',
          userId: 'JECRC-CSE-21-001',
          userProfile: JSON.stringify({
            id: 'JECRC-CSE-21-001',
            name: 'Demo Student',
            fullName: 'Demo Student',
            email: 'demo.student@jecrc.edu',
            role: 'student',
            rollNo: 'JECRC-CSE-21-001',
            department: 'Computer Science Engineering',
            currentSemester: 6
          })
        };
        
        // Always set demo auth data
        localStorage.setItem('authToken', demoAuthData.authToken);
        localStorage.setItem('userRole', demoAuthData.userRole);
        localStorage.setItem('userId', demoAuthData.userId);
        localStorage.setItem('userProfile', demoAuthData.userProfile);
        
        console.log('✅ Demo authentication set up successfully');
        console.log('🚀 Demo Mode: Authentication bypassed, user is now authenticated');
        
        // Always set authenticated to true in demo mode
        setAuthenticated(true);
        
        // Try to fetch student data, but don't fail if it doesn't work
        try {
          await fetchStudentData();
          console.log('📊 Demo data loaded successfully');
        } catch (dataError) {
          console.warn('⚠️ Using fallback demo data:', dataError.message);
          // Set basic fallback data
          setData({
            profile: {
              name: 'Demo Student',
              rollNumber: 'JECRC-CSE-21-001',
              email: 'demo.student@jecrc.edu',
              department: 'Computer Science Engineering',
              semester: 6,
              section: 'A',
              cgpa: 8.5,
              photo: './default-avatar.png'
            },
            courses: [
              { id: 'CS201', title: 'Data Structures & Algorithms', instructor: 'Dr. Sharma' },
              { id: 'CS202', title: 'Database Management Systems', instructor: 'Dr. Patel' }
            ],
            assignments: [
              { title: 'Binary Trees Implementation', course: 'Data Structures', dueDate: '2025-09-25', submitted: false },
              { title: 'SQL Query Optimization', course: 'Database Systems', dueDate: '2025-09-28', submitted: false }
            ],
            notifications: [
              { id: 1, title: "Welcome to Demo Mode", timestamp: "Now", seen: false }
            ]
          });
        }
        
      } catch (error) {
        console.error('❌ Demo setup failed:', error);
        // Even if demo setup fails, still allow access
        setAuthenticated(true);
      } finally {
        setLoading(false);
      }
    };
    
    setupDemoMode();
  }, []);
  
  // Only refresh data manually or on first load - removed automatic refresh to prevent issues
  // useEffect(() => {
  //   if (authenticated && activePage === 'Dashboard' && !dataLoading) {
  //     fetchStudentData();
  //   }
  // }, [activePage, authenticated]);
  
  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark-root", theme === "dark");
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
  useEffect(() => {
    localStorage.setItem("sidebarPinned", JSON.stringify(pinned));
  }, [pinned]);
  useEffect(() => {
    localStorage.setItem("activePage", activePage);
  }, [activePage]);

  const pageComponents = {
    Dashboard,
    Profile,
    Courses,
    Result,
    Attendance,
    Assignments,
    Examination,
    Certificates,
    Career,
    Reports,
    Library,
    Academics,
    Fees,
    Internal,
    NotificationPanel,
    Support,
    Portfolio: DigitalPortfolio,
    Documents: DocumentUpload,
  };

  // Fallback to Placeholder if component is not a function or lacks default export
  const getComponent = (name) => {
    const Component = pageComponents[name] || Placeholder;
    return typeof Component === "function" ? Component : Placeholder;
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] dark:bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-[var(--text)] dark:text-[var(--text)]">Verifying authentication...</p>
        </div>
      </div>
    );
  }
  
  // Don't render portal if not authenticated
  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] dark:bg-[var(--bg)] transition-colors duration-300">
      <Header
        activePage={activePage}
        theme={theme}
        toggleTheme={handlers.toggleTheme}
        notifications={data.notifications}
        user={{ name: data.profile.name, id: data.profile.rollNumber }}
        onLogout={handlers.logout}
        onProfile={() => setActivePage("Profile")}
      />
      <Shell
        sidebar={
          <Sidebar
            pinned={pinned}
            setPinned={setPinned}
            onExpandChange={setSidebarExpanded}
            activePage={activePage}
            setActivePage={setActivePage}
          />
        }
        main={
          <Main
            activePage={activePage}
            data={data}
            handlers={handlers}
            pageComponents={pageComponents}
            getComponent={getComponent}
          />
        }
        sidebarExpanded={sidebarExpanded}
      />
      {/* ERP Chatbot with Navigation */}
      <ERPChatbot
        isOpen={chatbotOpen}
        onClose={() => setChatbotOpen(false)}
        userRole="student"
        onNavigate={(navigationType) => {
          const navigationHandler = createNavigationHandler(navigate, 'student', setActivePage);
          navigationHandler.handleNavigation(navigationType);
        }}
      />
      <ChatbotToggle
        onClick={() => setChatbotOpen(!chatbotOpen)}
        isOpen={chatbotOpen}
      />
    </div>
  );
}