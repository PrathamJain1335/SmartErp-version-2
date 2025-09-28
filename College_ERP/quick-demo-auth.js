// Quick Demo Authentication Script
// Copy and paste this into your browser console to set up demo authentication

console.log('🔐 Setting up Demo Authentication...');

// Function to set up demo authentication
function setupDemoAuth(role = 'student') {
  const users = {
    student: {
      token: 'demo-token-student-' + Date.now(),
      role: 'student',
      userId: 'JECRC-CSE-21-001',
      userProfile: {
        id: 'JECRC-CSE-21-001',
        name: 'Suresh Shah',
        fullName: 'Suresh Shah',
        email: 'suresh.shah.cse25001@jecrc.edu',
        role: 'student',
        rollNo: 'JECRC-CSE-21-001',
        department: 'Computer Science Engineering',
        currentSemester: 6
      }
    },
    faculty: {
      token: 'demo-token-faculty-' + Date.now(),
      role: 'faculty', 
      userId: 'FAC001',
      userProfile: {
        id: 'FAC001',
        name: 'Dr. Kavya Sharma',
        fullName: 'Dr. Kavya Sharma',
        email: 'kavya@jecrc.edu',
        role: 'faculty',
        department: 'Computer Science Department'
      }
    }
  };

  const userData = users[role];
  
  // Clear any existing auth data
  localStorage.removeItem('authToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
  localStorage.removeItem('userProfile');

  // Set new demo auth data
  localStorage.setItem('authToken', userData.token);
  localStorage.setItem('userRole', userData.role);
  localStorage.setItem('userId', userData.userId);
  localStorage.setItem('userProfile', JSON.stringify(userData.userProfile));

  console.log(`✅ Demo authentication set up for ${userData.userProfile.name} (${role})`);
  console.log('🔄 Refreshing page in 2 seconds...');
  
  setTimeout(() => {
    window.location.reload();
  }, 2000);
}

// Initialize demo documents if they don't exist
function initDemoDocuments() {
  if (!localStorage.getItem('demo_documents')) {
    const demoDocuments = [
      {
        id: 'DOC001',
        title: 'Semester Registration Form',
        description: 'Registration form for 6th semester',
        fileName: 'semester_registration.pdf',
        fileSize: 245760,
        category: 'academic',
        uploadedBy: {
          id: 'JECRC-CSE-21-001',
          name: 'Suresh Shah',
          email: 'suresh.shah.cse25001@jecrc.edu'
        },
        assignedTo: {
          id: 'FAC001',
          name: 'Dr. Kavya Sharma',
          email: 'kavya@jecrc.edu'
        },
        status: 'pending',
        priority: 'medium',
        uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        comments: '',
        approvedAt: null,
        approvedBy: null
      }
    ];
    localStorage.setItem('demo_documents', JSON.stringify(demoDocuments));
    localStorage.setItem('demo_notifications', JSON.stringify([]));
    console.log('✅ Demo documents initialized');
  }
}

// Quick setup functions
window.loginAsStudent = () => {
  initDemoDocuments();
  setupDemoAuth('student');
};

window.loginAsFaculty = () => {
  initDemoDocuments();
  setupDemoAuth('faculty');
};

window.clearAuth = () => {
  localStorage.clear();
  console.log('🧹 All localStorage data cleared');
  setTimeout(() => {
    window.location.reload();
  }, 1000);
};

// Auto-setup check
const currentAuth = localStorage.getItem('authToken');
if (!currentAuth) {
  console.log('');
  console.log('🎯 No authentication found. Quick setup options:');
  console.log('   • loginAsStudent()  - Set up as student user');
  console.log('   • loginAsFaculty()  - Set up as faculty user');
  console.log('   • clearAuth()       - Clear all data and start fresh');
  console.log('');
  console.log('💡 Run loginAsStudent() to access assignments section');
} else {
  const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
  console.log(`✅ Already authenticated as ${profile.name || 'user'} (${profile.role || 'unknown'})`);
  console.log('   Run clearAuth() to reset and try different user');
}