// src/FacultyPortal/Faculty.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "./services/api";
import Header from "./FacultyPortal/Header";
import Shell from "./FacultyPortal/Shell";
import Sidebar from "./FacultyPortal/Sidebar";
import Main from "./FacultyPortal/Main";
import ERPChatbot from "./components/ERPChatbot";
import ChatbotToggle from "./components/ChatbotToggle";
import { createNavigationHandler } from "./utils/chatbotNavigation";
import { applyTheme, initializeTheme, fixHardcodedStyles } from "./utils/themeUtils";

// Example profile and dashboard data. Adjust as needed, or pass as props/context
const initialData = {
  profile: {
    name: "Dr. Priya Sharma",
    designation: "Assistant Professor",
    email: "priya@jecrc.ac.in",
    facultyId: "FAC101",
    photo: "", // Use user's photo URL or leave blank for fallback
  },
  students: [
    { id: "s1", roll: "STU-001", name: "Aarav Sharma" },
    { id: "s2", roll: "STU-002", name: "Diya Patel" },
    { id: "s3", roll: "STU-003", name: "Rohan Gupta" },
  ],
  courses: [
    {
      id: "c1",
      title: "Mathematics I",
      description: "Mathematics basics",
      syllabus: ["Algebra", "Calculus"],
      lessons: ["Intro", "Limits"],
    },
    {
      id: "c2",
      title: "Physics",
      description: "Mechanics",
      syllabus: ["Kinematics", "Dynamics"],
      lessons: ["Vectors", "Newton"],
    },
  ],
  assignedCells: [
    { row: 0, col: 1, label: "Mathematics I\nCS101", color: "#cbe4ff", section: "CS101" },
    { row: 1, col: 2, label: "Physics\nCS102", color: "#ffecd0", section: "CS102" },
    { row: 2, col: 3, label: "Programming\nCS101", color: "#ffd2e8", section: "CS101" },
    { row: 3, col: 4, label: "Electronics\nEE201", color: "#d2ffd7", section: "EE201" },
    { row: 4, col: 5, label: "Engg Graphics\nME202", color: "#f1fdd6", section: "ME202" },
  ],
  fullTimeSlots: [
    "8:00 - 8:50",
    "8:50 - 9:40",
    "9:40 - 10:30",
    "10:30 - 11:20",
    "11:20 - 12:10",
    "12:10 - 13:00",
    "13:00 - 13:50",
  ],
  evaluations: [{ id: "e1", title: "Midterm", course: "Mathematics I", uploaded: false }],
  approvals: [
    { id: "ap1", type: "Certificate", section: "CS101-A", student: "Aarav Sharma", status: "pending" },
  ],
  assignments: [
    { id: "as1", title: "Assignment 1: Intro to C++", deadline: "2025-09-10", marks: 20 },
  ],
  exams: [{ id: "ex1", title: "End Sem", date: "2025-12-15" }],
  reports: [],
  notifications: [{ id: 1, title: "Internship approval pending", timestamp: "Today, 10:30 AM", seen: false }],
};

export default function Faculty() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const [pinned, setPinned] = useState(() =>
    JSON.parse(localStorage.getItem("sidebarPinned") || "true")
  );
  const [sidebarExpanded, setSidebarExpanded] = useState(pinned);
  const [activePage, setActivePage] = useState("Dashboard");
  const [data, setData] = useState(initialData);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  
  // Main dashboard handlers as before
  const handlers = {
    toggleTheme: () => {
      const newTheme = theme === "dark" ? "light" : "dark";
      setTheme(newTheme);
      localStorage.setItem("theme", newTheme);
      applyTheme(newTheme);
    },
    theme,
    approve: (id) =>
      setData((d) => ({
        ...d,
        approvals: d.approvals.map((a) =>
          a.id === id ? { ...a, status: "approved" } : a
        ),
      })),
    reject: (id) =>
      setData((d) => ({
        ...d,
        approvals: d.approvals.map((a) =>
          a.id === id ? { ...a, status: "rejected" } : a
        ),
      })),
    createAssignment: (assignment) =>
      setData((d) => ({ ...d, assignments: [assignment, ...d.assignments] })),
    updateProfile: (prof) => setData((d) => ({ ...d, profile: prof })),
    saveMarks: (payload) => {
      console.log("Saved marks (mock):", payload);
    },
    logout: () => {
      authAPI.logout();
      navigate('/');
    }
  };

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = authAPI.getCurrentUser();
        if (!currentUser.isAuthenticated || currentUser.role !== 'faculty') {
          navigate('/');
          return;
        }
        
        // Update profile data with actual user info
        if (currentUser.profile) {
          setData(prev => ({
            ...prev,
            profile: {
              ...prev.profile,
              name: currentUser.profile.name || prev.profile.name,
              email: currentUser.profile.email || prev.profile.email,
              facultyId: currentUser.profile.id || prev.profile.facultyId
            }
          }));
        }
        
        setAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  useEffect(() => {
    localStorage.setItem("theme", theme);
    applyTheme(theme);
  }, [theme]);
  useEffect(() => {
    localStorage.setItem("sidebarPinned", JSON.stringify(pinned));
  }, [pinned]);
  useEffect(() => {
    localStorage.setItem("activePage", activePage);
  }, [activePage]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#081028] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Verifying authentication...</p>
        </div>
      </div>
    );
  }
  
  // Don't render portal if not authenticated
  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen transition-colors" style={{ background: 'var(--bg)' }}>
      {/* <Header
        activePage={activePage}
        theme={theme}
        toggleTheme={handlers.toggleTheme}
        notifications={data.notifications}
        user={{ name: data.profile.name, photo: data.profile.photo }}
        onLogout={() => window.location.href = "/"} // replace with better logic as needed
        onProfile={() => setActivePage("Profile")}
      /> */}
      <Shell
        sidebar={
          <Sidebar
            activeSection={activePage}
            setActiveSection={setActivePage}
            pinned={pinned}
            setPinned={setPinned}
            onExpandChange={setSidebarExpanded}
          />
        }
        main={<Main activePage={activePage} data={data} handlers={handlers} />}
        sidebarExpanded={sidebarExpanded}
      />
      <ERPChatbot
        isOpen={chatbotOpen}
        onClose={() => setChatbotOpen(false)}
        userRole="faculty"
        onNavigate={(navigationType) => {
          const navigationHandler = createNavigationHandler(navigate, 'faculty', setActivePage);
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
