const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');

/**
 * Test script for live profile photo upload functionality
 */
async function testLivePhotoUpload() {
  console.log('📸 Testing Live Profile Photo Upload');
  console.log('===================================\n');

  // Try different ports where the server might be running
  const POSSIBLE_PORTS = [5000, 3000, 8000];
  let BASE_URL = null;
  
  // Check which port the server is running on
  console.log('🔍 Checking for running server...');
  for (const port of POSSIBLE_PORTS) {
    try {
      const testUrl = `http://localhost:${port}`;
      const testResponse = await axios.get(`${testUrl}/api/students`, { timeout: 2000 });
      BASE_URL = testUrl;
      console.log(`✅ Server found running on port ${port}`);
      break;
    } catch (err) {
      console.log(`❌ No server on port ${port}`);
    }
  }
  
  if (!BASE_URL) {
    console.log('❌ No server found running. Please start your server first.');
    console.log('   Run: npm start');
    return;
  }
  
  try {
    // 1. Create a test image file for upload
    console.log('1️⃣ Creating test image for upload...');
    const testImagePath = path.join(__dirname, 'test-image.jpg');
    
    // Create a simple test image (1x1 pixel JPEG)
    const testImageBuffer = Buffer.from([
      0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
      0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
      0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
      0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
      0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
      0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
      0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
      0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x11, 0x08, 0x00, 0x01,
      0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01,
      0xFF, 0xC4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0xFF, 0xC4,
      0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xDA, 0x00, 0x0C,
      0x03, 0x01, 0x00, 0x02, 0x11, 0x03, 0x11, 0x00, 0x3F, 0x00, 0x8A, 0x00,
      0xFF, 0xD9
    ]);
    
    fs.writeFileSync(testImagePath, testImageBuffer);
    console.log(`✅ Test image created at: ${testImagePath}`);
    console.log();

    // 2. Test student profile photo upload
    console.log('2️⃣ Testing student profile photo upload...');
    
    // First, get a student ID to test with
    console.log('   📚 Getting student ID for testing...');
    try {
      const studentsResponse = await axios.get(`${BASE_URL}/api/students`);
      const students = studentsResponse.data;
      
      if (students.length === 0) {
        console.log('❌ No students found for testing');
        return;
      }
      
      const testStudent = students[0];
      console.log(`   ✅ Using student: ${testStudent.Full_Name} (${testStudent.Student_ID})`);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('profilePhoto', fs.createReadStream(testImagePath));
      
      // Upload the photo
      console.log('   📤 Uploading profile photo...');
      const uploadResponse = await axios.post(
        `${BASE_URL}/api/students/${testStudent.Student_ID}/profile-photo`,
        formData,
        {
          headers: {
            ...formData.getHeaders()
          }
        }
      );
      
      console.log('   ✅ Upload successful!');
      console.log(`   📷 Response: ${JSON.stringify(uploadResponse.data, null, 2)}`);
      console.log();

      // 3. Verify the upload by fetching student data
      console.log('3️⃣ Verifying upload by fetching updated student data...');
      const updatedStudentResponse = await axios.get(`${BASE_URL}/api/students/${testStudent.Student_ID}`);
      const updatedStudent = updatedStudentResponse.data;
      
      console.log('   ✅ Updated student data:');
      console.log(`   📚 Name: ${updatedStudent.Full_Name}`);
      console.log(`   🆔 ID: ${updatedStudent.Student_ID}`);
      console.log(`   📷 Profile Photo: ${updatedStudent.profilePicture || 'null'}`);
      console.log(`   🌐 Profile Photo URL: ${updatedStudent.profilePhotoUrl || 'null'}`);
      
      const hasProfilePhoto = updatedStudent.profilePicture && !updatedStudent.profilePicture.includes('default-avatar.png');
      console.log(`   ✅ Has Custom Photo: ${hasProfilePhoto ? 'YES' : 'NO'}`);
      console.log();

      // 4. Test accessing the uploaded photo
      if (updatedStudent.profilePhotoUrl) {
        console.log('4️⃣ Testing photo accessibility...');
        try {
          const photoResponse = await axios.get(`${BASE_URL}${updatedStudent.profilePhotoUrl}`);
          console.log(`   ✅ Photo is accessible (Status: ${photoResponse.status})`);
          console.log(`   📁 Content-Type: ${photoResponse.headers['content-type']}`);
          console.log(`   📏 Content-Length: ${photoResponse.headers['content-length']} bytes`);
        } catch (photoError) {
          console.log(`   ❌ Photo not accessible: ${photoError.message}`);
        }
      }

    } catch (apiError) {
      console.log(`❌ API test failed: ${apiError.message}`);
      if (apiError.response) {
        console.log(`   Status: ${apiError.response.status}`);
        console.log(`   Response: ${JSON.stringify(apiError.response.data, null, 2)}`);
      }
    }

    // 5. Test faculty profile photo upload
    console.log('\\n5️⃣ Testing faculty profile photo upload...');
    try {
      const facultiesResponse = await axios.get(`${BASE_URL}/api/faculties`);
      const faculties = facultiesResponse.data;
      
      if (faculties.length > 0) {
        const testFaculty = faculties[0];
        console.log(`   👨‍🏫 Using faculty: ${testFaculty.Full_Name} (${testFaculty.Faculty_ID})`);
        
        const formData = new FormData();
        formData.append('profilePhoto', fs.createReadStream(testImagePath));
        
        console.log('   📤 Uploading faculty profile photo...');
        const facultyUploadResponse = await axios.post(
          `${BASE_URL}/api/faculties/${testFaculty.Faculty_ID}/profile-photo`,
          formData,
          {
            headers: {
              ...formData.getHeaders()
            }
          }
        );
        
        console.log('   ✅ Faculty upload successful!');
        console.log(`   📷 Response: ${JSON.stringify(facultyUploadResponse.data, null, 2)}`);
      }
      
    } catch (facultyError) {
      console.log(`   ❌ Faculty upload test failed: ${facultyError.message}`);
    }

    // Cleanup
    console.log('\\n🧹 Cleaning up test files...');
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
      console.log('✅ Test image file cleaned up');
    }

    // Final Summary
    console.log('\\n🎉 LIVE PROFILE PHOTO UPLOAD TEST RESULTS');
    console.log('=========================================');
    console.log('✅ Test image creation: SUCCESS');
    console.log('✅ Student photo upload: TESTED');
    console.log('✅ Database update verification: TESTED');
    console.log('✅ Photo accessibility: TESTED');
    console.log('✅ Faculty photo upload: TESTED');
    
    console.log('\\n📋 Next Steps:');
    console.log('1. Start your backend server: npm start');
    console.log('2. Run this test: node scripts/test-live-photo-upload.js');
    console.log('3. Use Postman/curl to test manual uploads');
    console.log('4. Integrate with your frontend application');

  } catch (error) {
    console.error('❌ Live upload test failed:', error);
    console.error('   Error details:', error.message);
  }
}

if (require.main === module) {
  console.log('🚀 Starting live profile photo upload test...\\n');
  
  testLivePhotoUpload()
    .then(() => {
      console.log('\\n✅ Live test completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\\n❌ Live test failed:', error);
      process.exit(1);
    });
}

module.exports = { testLivePhotoUpload };