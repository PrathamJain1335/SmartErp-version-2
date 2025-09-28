// Demo Setup Script for Document Approval Workflow
// Run this in the browser console to set up demo data

console.log('🚀 Setting up Document Approval Demo...');

// Clear any existing demo data first
localStorage.removeItem('demo_documents');
localStorage.removeItem('demo_notifications');

// Set up demo user profiles for testing
const demoUsers = {
  student: {
    id: 'JECRC-CSE-21-001',
    name: 'Suresh Shah',
    fullName: 'Suresh Shah',
    email: 'suresh.shah.cse25001@jecrc.edu',
    role: 'student',
    rollNo: 'JECRC-CSE-21-001',
    department: 'Computer Science Engineering',
    currentSemester: 6
  },
  faculty: {
    id: 'FAC001',
    name: 'Dr. Kavya Sharma',
    fullName: 'Dr. Kavya Sharma',
    email: 'kavya@jecrc.edu',
    role: 'faculty',
    department: 'Computer Science Department'
  }
};

// Function to set up authentication for demo
function setupDemoAuth(userType = 'student') {
  const user = demoUsers[userType];
  
  localStorage.setItem('userProfile', JSON.stringify(user));
  localStorage.setItem('userRole', user.role);
  localStorage.setItem('userId', user.id);
  localStorage.setItem('authToken', 'demo_token_' + user.role);
  
  console.log(`✅ Demo authentication set up for ${user.name} (${user.role})`);
  return user;
}

// Initialize the mock document service with demo data
function initializeDemoDocuments() {
  const demoDocuments = [
    {
      id: 'DOC001',
      title: 'Semester Registration Form',
      description: 'Registration form for 6th semester',
      fileName: 'semester_registration.pdf',
      fileSize: 245760, // 240KB
      category: 'academic',
      uploadedBy: demoUsers.student,
      assignedTo: demoUsers.faculty,
      status: 'pending',
      priority: 'medium',
      uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      comments: '',
      approvedAt: null,
      approvedBy: null
    },
    {
      id: 'DOC002',
      title: 'Academic Transcript',
      description: 'Official academic transcript for job application',
      fileName: 'academic_transcript.pdf',
      fileSize: 512000, // 500KB
      category: 'certificates',
      uploadedBy: demoUsers.student,
      assignedTo: demoUsers.faculty,
      status: 'approved',
      priority: 'high',
      uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      comments: 'Document verified and approved.',
      approvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      approvedBy: demoUsers.faculty
    }
  ];
  
  localStorage.setItem('demo_documents', JSON.stringify(demoDocuments));
  localStorage.setItem('demo_notifications', JSON.stringify([]));
  
  console.log(`✅ Demo documents initialized (${demoDocuments.length} documents)`);
  return demoDocuments;
}

// Quick setup functions
window.setupStudentDemo = () => {
  setupDemoAuth('student');
  initializeDemoDocuments();
  console.log('👨‍🎓 Student demo ready! You can now:');
  console.log('   - Upload new documents');
  console.log('   - View pending approvals');
  console.log('   - See approved documents');
  if (typeof window !== 'undefined') {
    alert('Student demo setup complete! Refresh the page to see changes.');
  }
};

window.setupFacultyDemo = () => {
  setupDemoAuth('faculty');
  initializeDemoDocuments();
  console.log('👨‍🏫 Faculty demo ready! You can now:');
  console.log('   - View pending document approvals');
  console.log('   - Approve or reject documents');
  console.log('   - See approval history');
  if (typeof window !== 'undefined') {
    alert('Faculty demo setup complete! Refresh the page to see changes.');
  }
};

// Function to reset demo data
window.resetDemo = () => {
  localStorage.removeItem('demo_documents');
  localStorage.removeItem('demo_notifications');
  localStorage.removeItem('userProfile');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
  localStorage.removeItem('authToken');
  console.log('🔄 Demo data reset complete!');
  if (typeof window !== 'undefined') {
    alert('Demo data reset complete! Refresh the page.');
  }
};

// Auto-setup based on current context
console.log('📋 Available Demo Functions:');
console.log('   - setupStudentDemo()  : Set up student account and demo documents');
console.log('   - setupFacultyDemo() : Set up faculty account and demo documents');
console.log('   - resetDemo()        : Clear all demo data');

// Check if there's already demo data
const existingDocs = localStorage.getItem('demo_documents');
const existingProfile = localStorage.getItem('userProfile');

if (!existingDocs) {
  console.log('');
  console.log('💡 Tip: Run setupStudentDemo() to get started with the student portal');
  console.log('    or setupFacultyDemo() to test the faculty approval interface');
} else {
  const profile = JSON.parse(existingProfile || '{}');
  console.log('');
  console.log(`✅ Demo already set up for ${profile.name || 'user'} (${profile.role || 'unknown role'})`);
  console.log('   Run resetDemo() to start fresh');
}

export { setupStudentDemo, setupFacultyDemo, resetDemo };