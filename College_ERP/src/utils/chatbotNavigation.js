// Navigation utility for ERP Chatbot
export class ChatbotNavigationHandler {
  constructor(navigate, currentRole, setActiveTab) {
    this.navigate = navigate;
    this.currentRole = currentRole;
    this.setActiveTab = setActiveTab;
  }

  // Handle navigation based on the chatbot's response
  handleNavigation(navigationType) {
    console.log('Handling navigation:', navigationType, 'Current role:', this.currentRole);
    
    switch (navigationType) {
      case 'student_portal':
        if (this.currentRole !== 'student') {
          this.showNavigationMessage('Redirecting to Student Portal...');
          this.navigate('/student');
        } else {
          this.showNavigationMessage('You are already in the Student Portal');
        }
        break;

      case 'faculty_portal':
        if (this.currentRole !== 'faculty') {
          this.showNavigationMessage('Redirecting to Faculty Portal...');
          this.navigate('/faculty');
        } else {
          this.showNavigationMessage('You are already in the Faculty Portal');
        }
        break;

      case 'admin_portal':
        if (this.currentRole !== 'admin') {
          this.showNavigationMessage('Redirecting to Admin Portal...');
          this.navigate('/admin');
        } else {
          this.showNavigationMessage('You are already in the Admin Portal');
        }
        break;

      case 'dashboard':
        this.navigateToSection('dashboard');
        break;

      case 'attendance':
        this.navigateToSection('attendance');
        break;

      case 'grades':
        this.navigateToSection('grades');
        break;

      case 'profile':
        this.navigateToSection('profile');
        break;

      case 'courses':
        this.navigateToSection('courses');
        break;

      case 'schedule':
        this.navigateToSection('schedule');
        break;

      default:
        console.log('Unknown navigation type:', navigationType);
    }
  }

  // Navigate to specific section within current portal
  navigateToSection(section) {
    console.log('🔍 navigateToSection called with:', section);
    console.log('🔍 setActiveTab function available:', !!this.setActiveTab);
    
    if (this.setActiveTab) {
      // Map chatbot navigation types to actual tab names
      const tabMapping = {
        'dashboard': 'Dashboard',
        'attendance': 'Academics', // Attendance is part of academics
        'grades': 'Result', // Results section contains grades
        'profile': 'Profile',
        'courses': 'Academics', // Courses are in academics section
        'schedule': 'Academics', // Schedule might be in academics
        'assignments': 'Assignments',
        'examination': 'Examination',
        'fees': 'Fees',
        'library': 'Library',
        'career': 'Career',
        'portfolio': 'Portfolio',
        'notifications': 'NotificationPanel',
        'support': 'Support'
      };

      const tabName = tabMapping[section] || section;
      console.log('🔍 Mapped section:', section, '-> tab:', tabName);
      console.log('🔍 Calling setActiveTab with:', tabName);
      
      this.setActiveTab(tabName);
      this.showNavigationMessage(`Navigating to ${section} section...`);
    } else {
      console.log('❌ setActiveTab function not available!');
      this.showNavigationMessage(`Please look for the ${section} section in your portal menu.`);
    }
  }

  // Show navigation feedback to user
  showNavigationMessage(message) {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Fade in
    setTimeout(() => {
      notification.style.opacity = '1';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // Get current portal context for chatbot
  getCurrentContext() {
    return {
      portal: this.currentRole,
      canNavigateToStudentPortal: true,
      canNavigateToFacultyPortal: true,
      canNavigateToAdminPortal: this.currentRole === 'admin', // Only admin can access admin portal
    };
  }

  // Get available navigation options for current user
  getAvailableNavigation() {
    const baseOptions = [
      { id: 'dashboard', label: 'Dashboard', description: 'Go to main dashboard' },
      { id: 'profile', label: 'Profile', description: 'View and edit profile' }
    ];

    const roleSpecificOptions = {
      'student': [
        { id: 'attendance', label: 'Attendance', description: 'View attendance records' },
        { id: 'grades', label: 'Grades', description: 'Check academic performance' },
        { id: 'courses', label: 'Courses', description: 'View enrolled courses' },
        { id: 'schedule', label: 'Schedule', description: 'Check class schedule' }
      ],
      'faculty': [
        { id: 'attendance', label: 'Attendance Management', description: 'Manage student attendance' },
        { id: 'grades', label: 'Grade Management', description: 'Enter and manage grades' },
        { id: 'courses', label: 'Course Management', description: 'Manage courses and subjects' },
        { id: 'schedule', label: 'Schedule', description: 'View teaching schedule' }
      ],
      'admin': [
        { id: 'attendance', label: 'Attendance Reports', description: 'View attendance analytics' },
        { id: 'grades', label: 'Academic Reports', description: 'Generate academic reports' },
        { id: 'courses', label: 'Course Administration', description: 'Manage all courses' },
        { id: 'schedule', label: 'System Schedule', description: 'Manage system-wide schedules' }
      ]
    };

    return [...baseOptions, ...(roleSpecificOptions[this.currentRole] || [])];
  }
}

// Navigation helper functions
export const createNavigationHandler = (navigate, currentRole, setActiveTab) => {
  return new ChatbotNavigationHandler(navigate, currentRole, setActiveTab);
};

export const getNavigationInstructions = (navigationType, currentRole) => {
  const instructions = {
    'student_portal': 'To access the Student Portal, look for the "Student" option in your navigation menu or dashboard.',
    'faculty_portal': 'To access the Faculty Portal, look for the "Faculty" option in your navigation menu or dashboard.',
    'admin_portal': 'To access the Admin Portal, look for the "Admin" option in your navigation menu. Note: Admin access is required.',
    'dashboard': 'The dashboard is usually your main landing page after login. Look for "Dashboard" or "Home" in your menu.',
    'attendance': `For ${currentRole} users: Look for "Attendance" in your portal sidebar or main menu.`,
    'grades': `For ${currentRole} users: Look for "Grades", "Marks", or "Academic Performance" in your portal menu.`,
    'profile': 'Your profile can usually be accessed by clicking on your name or user icon, typically in the top-right corner.',
    'courses': `For ${currentRole} users: Look for "Courses", "Subjects", or "Academic" section in your portal menu.`,
    'schedule': `For ${currentRole} users: Look for "Schedule", "Timetable", or "Calendar" in your portal menu.`
  };

  return instructions[navigationType] || 'Please check your portal menu for the requested section.';
};