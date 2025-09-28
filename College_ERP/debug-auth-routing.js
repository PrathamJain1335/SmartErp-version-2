// Comprehensive Authentication & Routing Debug Script
// Copy and paste this into your browser console

console.log('🔍 COMPREHENSIVE AUTH & ROUTING DEBUG');
console.log('=====================================');

// Step 1: Current Environment Info
console.log('📍 CURRENT ENVIRONMENT:');
console.log('  - Current URL:', window.location.href);
console.log('  - Pathname:', window.location.pathname);
console.log('  - Search:', window.location.search);
console.log('  - Hash:', window.location.hash);

// Step 2: Check localStorage state
console.log('');
console.log('💾 LOCALSTORAGE STATE:');
const authKeys = ['authToken', 'userRole', 'userId', 'userProfile'];
authKeys.forEach(key => {
  const value = localStorage.getItem(key);
  console.log(`  - ${key}:`, value ? value.substring(0, 50) + (value.length > 50 ? '...' : '') : 'NOT SET');
});

// Step 3: Check if we're in the right route context
console.log('');
console.log('🛣️  ROUTING CONTEXT:');
const isStudentRoute = window.location.pathname.includes('/student');
const isLoginRoute = window.location.pathname === '/';
const isFacultyRoute = window.location.pathname.includes('/faculty');
console.log('  - On student route:', isStudentRoute);
console.log('  - On login route:', isLoginRoute);
console.log('  - On faculty route:', isFacultyRoute);

// Step 4: Set up proper authentication based on current route
function setupAuthForCurrentRoute() {
  console.log('');
  console.log('🔧 SETTING UP AUTHENTICATION...');
  
  // Clear existing auth
  authKeys.forEach(key => localStorage.removeItem(key));
  
  let authData;
  
  if (isStudentRoute || (!isStudentRoute && !isFacultyRoute && !isLoginRoute)) {
    // Default to student if unclear or explicitly on student route
    authData = {
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
    console.log('✅ Setting up STUDENT authentication');
  } else if (isFacultyRoute) {
    authData = {
      authToken: 'demo-faculty-token-' + Date.now(),
      userRole: 'faculty',
      userId: 'FAC001',
      userProfile: {
        id: 'FAC001',
        name: 'Dr. Kavya Sharma',
        fullName: 'Dr. Kavya Sharma',
        email: 'kavya@jecrc.edu',
        role: 'faculty',
        department: 'Computer Science Department'
      }
    };
    console.log('✅ Setting up FACULTY authentication');
  } else {
    console.log('⚠️ Unknown route context, defaulting to student');
    return setupAuthForCurrentRoute(); // Recursively call with student default
  }
  
  // Set the auth data
  localStorage.setItem('authToken', authData.authToken);
  localStorage.setItem('userRole', authData.userRole);
  localStorage.setItem('userId', authData.userId);
  localStorage.setItem('userProfile', JSON.stringify(authData.userProfile));
  
  return authData;
}

// Step 5: Test the specific auth logic from Student.jsx
function testStudentAuthLogic() {
  console.log('');
  console.log('🧪 TESTING STUDENT AUTH LOGIC:');
  
  const demoToken = localStorage.getItem('authToken');
  const demoRole = localStorage.getItem('userRole');
  const demoUserId = localStorage.getItem('userId');
  
  console.log('  - demoToken exists:', !!demoToken);
  console.log('  - demoRole exists:', !!demoRole);
  console.log('  - demoRole === "student":', demoRole === 'student');
  console.log('  - demoUserId exists:', !!demoUserId);
  
  const wouldPassAuth = demoToken && demoRole && demoRole === 'student' && demoUserId;
  console.log('  - Would pass auth check:', wouldPassAuth);
  
  if (!wouldPassAuth) {
    console.log('❌ Auth logic would FAIL - this is why you get redirected!');
    console.log('Missing requirements:');
    if (!demoToken) console.log('    - Missing authToken');
    if (!demoRole) console.log('    - Missing userRole');
    if (demoRole !== 'student') console.log(`    - Wrong role: ${demoRole} (expected: student)`);
    if (!demoUserId) console.log('    - Missing userId');
  } else {
    console.log('✅ Auth logic should PASS');
  }
  
  return wouldPassAuth;
}

// Step 6: Fix the navigation if needed
function fixNavigation() {
  console.log('');
  console.log('🧭 NAVIGATION FIX:');
  
  const currentPath = window.location.pathname;
  
  if (currentPath === '/' && localStorage.getItem('userRole') === 'student') {
    console.log('  - Currently on login page but have student auth');
    console.log('  - Redirecting to student portal...');
    window.location.href = '/student';
    return;
  }
  
  if (currentPath === '/' && localStorage.getItem('userRole') === 'faculty') {
    console.log('  - Currently on login page but have faculty auth');
    console.log('  - Redirecting to faculty portal...');
    window.location.href = '/faculty';
    return;
  }
  
  if (!currentPath.includes('/student') && !currentPath.includes('/faculty') && currentPath !== '/') {
    console.log('  - On unknown route, redirecting to student portal...');
    window.location.href = '/student';
    return;
  }
  
  console.log('  - Navigation looks correct');
}

// Execute the debug sequence
console.log('');
console.log('🚀 EXECUTING DEBUG SEQUENCE...');

// Run setup
const authData = setupAuthForCurrentRoute();

// Test auth logic
const authWorks = testStudentAuthLogic();

// Handle navigation
fixNavigation();

// If we're still here and auth should work, reload the page
if (authWorks && window.location.pathname.includes('/student')) {
  console.log('');
  console.log('🔄 Auth should work now, reloading page in 3 seconds...');
  setTimeout(() => {
    window.location.reload();
  }, 3000);
} else if (authWorks) {
  console.log('');
  console.log('✅ Auth setup complete. Navigation should occur automatically.');
}

// Create helper functions
window.debugAuth = () => {
  testStudentAuthLogic();
};

window.forceStudentLogin = () => {
  console.log('🔧 Forcing student portal access...');
  localStorage.clear();
  
  const studentAuth = {
    authToken: 'force-student-' + Date.now(),
    userRole: 'student',
    userId: 'JECRC-CSE-21-001',
    userProfile: JSON.stringify({
      id: 'JECRC-CSE-21-001',
      name: 'Demo Student',
      role: 'student'
    })
  };
  
  Object.entries(studentAuth).forEach(([key, value]) => {
    localStorage.setItem(key, value);
  });
  
  window.location.href = '/student';
};

console.log('');
console.log('📋 Helper functions:');
console.log('  - debugAuth() : Re-run auth test');
console.log('  - forceStudentLogin() : Force student portal access');