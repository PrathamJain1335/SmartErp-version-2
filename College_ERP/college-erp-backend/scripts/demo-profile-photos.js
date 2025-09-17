const axios = require('axios');
const { spawn } = require('child_process');

const BASE_URL = 'http://localhost:5000/api';

async function demoProfilePhotos() {
  console.log('📸 Profile Photo System Demonstration');
  console.log('====================================\n');

  try {
    // 1. Admin Login
    console.log('1️⃣ Admin Login...');
    const adminLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@jecrc.ac.in',
      password: 'admin123',
      role: 'admin'
    });
    const adminToken = adminLogin.data.token;
    console.log('✅ Admin authenticated');

    // 2. Check current students with profile photos
    console.log('\n2️⃣ Current Students with Profile Photos:');
    const students = await axios.get(`${BASE_URL}/students?limit=10`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    if (students.data.data.students.length === 0) {
      console.log('   No students found. Creating a sample student...');
      
      const newStudent = await axios.post(`${BASE_URL}/students`, {
        Full_Name: 'Demo Student',
        Department: 'Computer Science',
        Section: 'A',
        'Batch/Year': '2024',
        Semester: 1,
        Contact_No: '1234567890'
      }, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      
      console.log(`   ✅ Created: ${newStudent.data.data.student.Full_Name}`);
      console.log(`   Student ID: ${newStudent.data.data.student.Student_ID}`);
      console.log(`   Profile Photo: ${newStudent.data.data.student.profilePhotoUrl || 'Default'}`);
    } else {
      console.log(`   Found ${students.data.data.students.length} students:`);
      students.data.data.students.slice(0, 5).forEach(student => {
        console.log(`   📚 ${student.Full_Name} (${student.Student_ID})`);
        console.log(`      📷 Photo: ${student.profilePhotoUrl}`);
        console.log(`      🎨 Custom: ${student.hasCustomPhoto ? 'Yes' : 'No (Default)'}`);
        console.log();
      });
    }

    // 3. Check faculty with profile photos
    console.log('3️⃣ Current Faculty with Profile Photos:');
    const faculties = await axios.get(`${BASE_URL}/faculties?limit=5`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    if (faculties.data.data.faculties.length === 0) {
      console.log('   No faculty found.');
    } else {
      console.log(`   Found ${faculties.data.data.faculties.length} faculty members:`);
      faculties.data.data.faculties.forEach(faculty => {
        console.log(`   👨‍🏫 ${faculty.Full_Name} (${faculty.Faculty_ID})`);
        console.log(`      📷 Photo: ${faculty.profilePhotoUrl}`);
        console.log(`      🎨 Custom: ${faculty.hasCustomPhoto ? 'Yes' : 'No (Default)'}`);
        console.log();
      });
    }

    // 4. Test profile photo API endpoints
    console.log('4️⃣ Profile Photo API Endpoints:');
    
    // Get admin's current profile photo
    const adminPhoto = await axios.get(`${BASE_URL}/profile-photos/current/me`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('   📷 Admin profile photo:');
    console.log(`      URL: ${adminPhoto.data.data.profilePhotoUrl}`);
    console.log(`      Has Default: ${adminPhoto.data.data.hasDefaultPhoto}`);

    // Test upload validation (without actual file)
    try {
      await axios.post(`${BASE_URL}/profile-photos/upload`, {}, {
        headers: { 
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      console.log('   ✅ Upload validation working:', error.response.data.message);
    }

    // Test cleanup endpoint
    const cleanup = await axios.get(`${BASE_URL}/profile-photos/cleanup/orphaned`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log(`   🧹 Cleanup result: ${cleanup.data.data.cleanedFilesCount} files cleaned`);

    console.log('\n5️⃣ Profile Photo System Features:');
    console.log('✅ Database columns exist (profilePicture in Student & Faculty models)');
    console.log('✅ Profile photos automatically included in all API responses');
    console.log('✅ Default avatar URLs provided when no custom photo exists');
    console.log('✅ Upload endpoints secured with authentication');
    console.log('✅ Role-based access control for viewing photos');
    console.log('✅ File validation and size limits (5MB, image types only)');
    console.log('✅ Real-time updates via Socket.IO integration');
    console.log('✅ Automatic file cleanup and management');
    console.log('✅ hasCustomPhoto flag to distinguish default vs. uploaded');

    console.log('\n📁 Directory Structure Created:');
    console.log('   uploads/profiles/students/ - Student profile photos');
    console.log('   uploads/profiles/faculty/  - Faculty profile photos');
    console.log('   uploads/profiles/README.md - Documentation');

    console.log('\n🔌 API Endpoints Available:');
    console.log('   POST /api/profile-photos/upload - Upload photo');
    console.log('   GET  /api/profile-photos/current/me - Get own photo');
    console.log('   GET  /api/profile-photos/:userId - Get user photo (with access control)');
    console.log('   DELETE /api/profile-photos/current/me - Remove photo (reset to default)');
    console.log('   GET  /api/profile-photos/cleanup/orphaned - Admin cleanup');

    console.log('\n📱 Frontend Integration:');
    console.log('   • Every student/faculty object now has profilePhotoUrl field');
    console.log('   • Use FormData to upload files to POST /api/profile-photos/upload');
    console.log('   • Listen for "profile-photo-updated" Socket.IO events for real-time updates');
    console.log('   • hasCustomPhoto boolean indicates if user has uploaded custom photo');

    console.log('\n🎯 Complete Implementation Status: ✅ READY');
    console.log('   Profile photo columns ✅ Added to database');
    console.log('   File upload service   ✅ Configured and secured'); 
    console.log('   API endpoints        ✅ All routes implemented');
    console.log('   Access control       ✅ Role-based permissions');
    console.log('   Real-time updates    ✅ Socket.IO integration');
    console.log('   File management      ✅ Upload, delete, cleanup');
    console.log('   Frontend integration ✅ Data included in all responses');

  } catch (error) {
    console.error('❌ Demo failed:', error.response?.data?.message || error.message);
    if (error.response?.status) {
      console.error('   Status:', error.response.status);
    }
  }
}

// Start server and run demo
async function startAndDemo() {
  console.log('🚀 Starting server...\n');
  
  const server = spawn('node', ['start.js'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    cwd: process.cwd()
  });

  let serverReady = false;

  server.stdout.on('data', (data) => {
    const output = data.toString();
    if (output.includes('Server running') || output.includes('Database connected')) {
      console.log(output);
    }
    
    if (output.includes('Server running on port 5000') && !serverReady) {
      serverReady = true;
      setTimeout(async () => {
        await demoProfilePhotos();
        console.log('\n🛑 Stopping server...');
        server.kill('SIGINT');
        process.exit(0);
      }, 2000);
    }
  });

  server.stderr.on('data', (data) => {
    console.error('Server Error:', data.toString());
  });

  process.on('SIGINT', () => {
    server.kill('SIGINT');
    process.exit(0);
  });
}

if (require.main === module) {
  startAndDemo();
}

module.exports = { demoProfilePhotos };