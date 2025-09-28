// Browser Console Script to Set Proper Authentication Tokens
// Copy and paste this into your browser's developer console

console.log('🔐 Setting up proper authentication tokens...');

// Valid JWT tokens generated with the backend's JWT_SECRET
const validTokens = {
  student: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkpFQ1JDLUNTRS0yMS0wMDEiLCJyb2xlIjoic3R1ZGVudCIsImVtYWlsIjoic3VyZXNoLnNoYWguY3NlMjUwMDFAamVjcmMuZWR1IiwiaWF0IjoxNzU5MDU2Mzc0LCJleHAiOjE3NTk2NjExNzR9.FDyUbAh88p10YUFqhovTp5jYqFaCJlcw-Fnh_uaM_PQ',
    role: 'student',
    userId: 'JECRC-CSE-21-001',
    user: {
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
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkZBQzAwMSIsInJvbGUiOiJmYWN1bHR5IiwiZW1haWwiOiJrYXZ5YUBqZWNyYy5lZHUiLCJpYXQiOjE3NTkwNTYzNzQsImV4cCI6MTc1OTY2MTE3NH0.3Uckzlip89trFE4exJ7_4fYYWZ8tN-rnQl_C1VMIhhs',
    role: 'faculty',
    userId: 'FAC001',
    user: {
      id: 'FAC001',
      name: 'Dr. Kavya Sharma',
      fullName: 'Dr. Kavya Sharma',
      email: 'kavya@jecrc.edu',
      role: 'faculty',
      department: 'Computer Science Department'
    }
  },
  admin: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkFETUlOMDAxIiwicm9sZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBqZWNyYy5hYy5pbiIsImlhdCI6MTc1OTA1NjM3NCwiZXhwIjoxNzU5NjYxMTc0fQ.NRvL_Eq64nTJfcQIS696LW19vjP4ObV7Bh1E_N3ENz0',
    role: 'admin',
    userId: 'ADMIN001',
    user: {
      id: 'ADMIN001',
      name: 'Admin User',
      fullName: 'Admin User',
      email: 'admin@jecrc.ac.in',
      role: 'admin'
    }
  }
};

// Function to set authentication for a specific role
function setAuthFor(role) {
  const authData = validTokens[role];
  if (!authData) {
    console.error('❌ Invalid role:', role);
    return false;
  }
  
  // Clear existing auth data
  localStorage.clear();
  
  // Set new auth data using AuthManager keys
  localStorage.setItem('authToken', authData.token);
  localStorage.setItem('userRole', authData.role);
  localStorage.setItem('userId', authData.userId);
  localStorage.setItem('userProfile', JSON.stringify(authData.user));
  
  console.log(`✅ Authentication set for ${role.toUpperCase()}:`);
  console.log(`   - Name: ${authData.user.name}`);
  console.log(`   - Email: ${authData.user.email}`);
  console.log(`   - Token: ${authData.token.substring(0, 50)}...`);
  
  // Reload the page to apply changes
  console.log('🔄 Reloading page to apply authentication...');
  setTimeout(() => window.location.reload(), 1000);
  
  return true;
}

// Quick setup functions
window.loginAsStudent = () => setAuthFor('student');
window.loginAsFaculty = () => setAuthFor('faculty'); 
window.loginAsAdmin = () => setAuthFor('admin');

console.log('🎯 Quick Login Functions Available:');
console.log('   - loginAsStudent()   - Login as Suresh Shah (student)');
console.log('   - loginAsFaculty()   - Login as Dr. Kavya Sharma (faculty)');
console.log('   - loginAsAdmin()     - Login as Admin User');
console.log('');
console.log('Example: Run loginAsStudent() to test document upload');
console.log('Then run loginAsFaculty() to test document approval');

// Auto-setup for student if no specific role requested
if (!localStorage.getItem('authToken')) {
  console.log('🚀 No authentication found, setting up student login...');
  setAuthFor('student');
}