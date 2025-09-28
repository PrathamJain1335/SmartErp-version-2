const jwt = require('jsonwebtoken');

// JWT secret from backend .env file
const JWT_SECRET = 'Tokir';

function generateDemoJWT() {
  console.log('🔐 Generating Demo JWT Tokens...\n');
  
  // Demo user data (matching the demo login system)
  const demoUsers = {
    'suresh.shah.cse25001@jecrc.edu': {
      id: 'JECRC-CSE-21-001',
      role: 'student',
      email: 'suresh.shah.cse25001@jecrc.edu'
    },
    'kavya@jecrc.edu': {
      id: 'FAC001',
      role: 'faculty', 
      email: 'kavya@jecrc.edu'
    },
    'admin@jecrc.ac.in': {
      id: 'ADMIN001',
      role: 'admin',
      email: 'admin@jecrc.ac.in'
    }
  };
  
  console.log('Generated JWT tokens for demo users:\n');
  
  Object.entries(demoUsers).forEach(([email, userData]) => {
    const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '7d' });
    console.log(`${userData.role.toUpperCase()} (${email}):`);
    console.log(`${token}\n`);
  });
  
  console.log('💡 Usage in browser localStorage:');
  console.log('localStorage.setItem("authToken", "PASTE_TOKEN_HERE")');
  console.log('localStorage.setItem("userRole", "student|faculty|admin")');
  console.log('localStorage.setItem("userId", "USER_ID_HERE")');
}

generateDemoJWT();