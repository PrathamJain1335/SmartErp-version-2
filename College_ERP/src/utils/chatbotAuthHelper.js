// ChatBot Authentication Helper
// This helps ensure users can access AI features even if main auth flow has issues

import authManager from './authManager';

class ChatbotAuthHelper {
  constructor() {
    this.demoUsers = {
      student: {
        token: `demo-student-${Date.now()}-chatbot-token`,
        role: 'student',
        userId: 'JECRC-CSE-21-001',
        user: {
          id: 'JECRC-CSE-21-001',
          name: 'Demo Student',
          fullName: 'Demo Student User',
          email: 'student.demo@jecrc.ac.in',
          role: 'student',
          department: 'Computer Science Engineering',
          rollNo: 'JECRC-CSE-21-001',
          semester: '5',
          section: 'A'
        }
      },
      faculty: {
        token: `demo-faculty-${Date.now()}-chatbot-token`,
        role: 'faculty',
        userId: 'FAC001',
        user: {
          id: 'FAC001',
          name: 'Dr. Demo Faculty',
          fullName: 'Dr. Demo Faculty Member',
          email: 'faculty.demo@jecrc.ac.in',
          role: 'faculty',
          department: 'Computer Science Department',
          designation: 'Assistant Professor',
          subjects: ['Data Structures', 'Algorithms']
        }
      },
      admin: {
        token: `demo-admin-${Date.now()}-chatbot-token`,
        role: 'admin',
        userId: 'ADMIN001',
        user: {
          id: 'ADMIN001',
          name: 'Admin User',
          fullName: 'System Administrator',
          email: 'admin.demo@jecrc.ac.in',
          role: 'admin',
          department: 'Administration',
          permissions: ['all']
        }
      }
    };
  }

  // Detect what kind of portal/context the user is in
  detectUserContext() {
    const path = window.location.pathname.toLowerCase();
    const title = document.title.toLowerCase();
    
    if (path.includes('student') || title.includes('student')) {
      return 'student';
    } else if (path.includes('faculty') || title.includes('faculty')) {
      return 'faculty';
    } else if (path.includes('admin') || title.includes('admin')) {
      return 'admin';
    }
    
    // Default to student if unclear
    return 'student';
  }

  // Check if user needs authentication for chatbot
  needsAuthentication() {
    return !authManager.isAuthenticated();
  }

  // Provide demo authentication for chatbot access
  provideDemoAuth() {
    if (authManager.isAuthenticated()) {
      console.log('✅ User already authenticated');
      return true;
    }

    const userType = this.detectUserContext();
    const demoAuthData = this.demoUsers[userType];
    
    console.log(`🔧 Providing demo authentication for ${userType}:`, {
      userId: demoAuthData.userId,
      role: demoAuthData.role,
      name: demoAuthData.user.name
    });
    
    authManager.setAuthData(demoAuthData);
    
    const isNowAuthenticated = authManager.isAuthenticated();
    console.log(`🎯 Authentication result: ${isNowAuthenticated}`);
    
    return isNowAuthenticated;
  }

  // Get current authentication status for display
  getAuthStatus() {
    if (!authManager.isAuthenticated()) {
      return {
        authenticated: false,
        message: '🔒 Not authenticated - click 🔧 to enable AI features'
      };
    }

    const userRole = authManager.getUserRole();
    const userId = authManager.getUserId();
    
    return {
      authenticated: true,
      message: `🔓 Authenticated as ${userRole} (${userId})`,
      role: userRole,
      userId: userId
    };
  }

  // Create fallback response when auth fails
  createAuthFailureResponse(originalMessage) {
    const userType = this.detectUserContext();
    
    return {
      text: `I'd love to help you with "${originalMessage}"! However, I need authentication to provide personalized ERP assistance. 

🔧 **Quick Fix**: Click the 🔧 button above to enable AI features.

For now, here's some general help:
• **Student Portal**: Access attendance, grades, assignments, and fees
• **Faculty Portal**: Manage classes, grade students, track attendance  
• **Admin Portal**: System management, reports, and user administration

What specific area would you like help with?`,
      requiresAuth: true
    };
  }
}

export default new ChatbotAuthHelper();