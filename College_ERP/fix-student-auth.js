// Immediate Fix for Student Portal Authentication
// Copy and paste this entire script into your browser console

console.log('🔧 FIXING Student Portal Authentication...');

// Step 1: Clear any existing problematic data
localStorage.removeItem('authToken');
localStorage.removeItem('userRole'); 
localStorage.removeItem('userId');
localStorage.removeItem('userProfile');

// Step 2: Set proper demo authentication data
const studentAuth = {
  authToken: 'demo-student-token-' + Date.now(),
  userRole: 'student',
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
};

// Step 3: Set each required localStorage item
localStorage.setItem('authToken', studentAuth.authToken);
localStorage.setItem('userRole', studentAuth.userRole);
localStorage.setItem('userId', studentAuth.userId);
localStorage.setItem('userProfile', JSON.stringify(studentAuth.userProfile));

// Step 4: Verify the data was set correctly
console.log('✅ Authentication data set:');
console.log('  - authToken:', localStorage.getItem('authToken'));
console.log('  - userRole:', localStorage.getItem('userRole'));
console.log('  - userId:', localStorage.getItem('userId'));
console.log('  - userProfile:', JSON.parse(localStorage.getItem('userProfile')));

// Step 5: Test the authentication check that was failing
const testAuth = () => {
  const demoToken = localStorage.getItem('authToken');
  const demoRole = localStorage.getItem('userRole');
  const demoUserId = localStorage.getItem('userId');
  
  console.log('🧪 Testing auth conditions:');
  console.log('  - Has token:', !!demoToken);
  console.log('  - Has role:', !!demoRole);
  console.log('  - Role is student:', demoRole === 'student');
  console.log('  - Has userId:', !!demoUserId);
  
  const shouldPass = demoToken && demoRole && demoRole === 'student' && demoUserId;
  console.log('  - Should pass auth check:', shouldPass);
  
  return shouldPass;
};

if (testAuth()) {
  console.log('🎉 SUCCESS! Authentication should now work.');
  console.log('🔄 Refreshing page in 2 seconds...');
  
  // Auto-refresh after 2 seconds
  setTimeout(() => {
    window.location.reload();
  }, 2000);
} else {
  console.log('❌ Authentication setup failed. Please try again.');
}

// Create global helper functions
window.checkStudentAuth = () => {
  console.log('📊 Current authentication status:');
  testAuth();
};

window.clearAuth = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userRole'); 
  localStorage.removeItem('userId');
  localStorage.removeItem('userProfile');
  console.log('🧹 Authentication cleared');
  setTimeout(() => window.location.reload(), 1000);
};

console.log('');
console.log('📋 Helper functions available:');
console.log('  - checkStudentAuth() : Check current auth status');
console.log('  - clearAuth()        : Clear all auth data');