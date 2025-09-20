// scripts/testPersonalizedData.js - Test personalized data for different students
const fetch = require('node-fetch');

async function testPersonalizedData() {
  try {
    console.log('🧪 Testing Personalized Data for Different Students...\n');
    
    const students = [
      { id: 'JECRC-CSE-21-001', name: 'Suresh Shah' },
      { id: 'JECRC-CSE-21-002', name: 'Priya Agarwal' },  
      { id: 'JECRC-CSE-21-003', name: 'Rahul Sharma' }
    ];
    
    // First, get login tokens for these students
    const studentTokens = {};
    
    for (const student of students) {
      console.log(`🔐 Getting token for ${student.name} (${student.id})...`);
      
      const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: student.id,
          password: 'student123',
          role: 'student'
        })
      });
      
      if (loginResponse.ok) {
        const loginResult = await loginResponse.json();
        studentTokens[student.id] = loginResult.token;
        console.log(`   ✅ Token obtained for ${student.name}`);
      } else {
        console.log(`   ❌ Failed to get token for ${student.name}`);
      }
    }
    
    console.log('\n📊 Testing Attendance Data Personalization:\n');
    
    for (const student of students) {
      if (!studentTokens[student.id]) continue;
      
      console.log(`👨‍🎓 ${student.name} (${student.id}):`);
      
      try {
        const attendanceResponse = await fetch(`http://localhost:5000/api/attendance/student/${student.id}`, {
          headers: {
            'Authorization': `Bearer ${studentTokens[student.id]}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (attendanceResponse.ok) {
          const attendanceData = await attendanceResponse.json();
          const stats = attendanceData.data.statistics;
          console.log(`   📈 Attendance: ${stats.attendancePercentage}% (${stats.presentClasses}/${stats.totalClasses})`);
          console.log(`   📅 Recent records: ${attendanceData.data.records.slice(0, 3).map(r => r.status).join(', ')}`);
        } else {
          console.log(`   ❌ Failed to fetch attendance data`);
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }
    }
    
    console.log('\n📝 Testing Assignment Data Personalization:\n');
    
    for (const student of students) {
      if (!studentTokens[student.id]) continue;
      
      console.log(`👨‍🎓 ${student.name} (${student.id}):`);
      
      try {
        const assignmentResponse = await fetch(`http://localhost:5000/api/assignments/student/${student.id}`, {
          headers: {
            'Authorization': `Bearer ${studentTokens[student.id]}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (assignmentResponse.ok) {
          const assignmentData = await assignmentResponse.json();
          const stats = assignmentData.data.statistics;
          console.log(`   📋 Assignments: ${stats.total} total, ${stats.pending} pending, ${stats.submitted} submitted`);
          
          // Show first assignment status
          if (assignmentData.data.assignments.length > 0) {
            const firstAssignment = assignmentData.data.assignments[0];
            console.log(`   📄 First assignment: "${firstAssignment.title}" - Status: ${firstAssignment.status}`);
          }
        } else {
          console.log(`   ❌ Failed to fetch assignment data`);
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }
    }
    
    console.log('\n🎓 Testing Grades Data Personalization:\n');
    
    for (const student of students) {
      if (!studentTokens[student.id]) continue;
      
      console.log(`👨‍🎓 ${student.name} (${student.id}):`);
      
      try {
        const gradesResponse = await fetch(`http://localhost:5000/api/grades/student/${student.id}`, {
          headers: {
            'Authorization': `Bearer ${studentTokens[student.id]}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (gradesResponse.ok) {
          const gradesData = await gradesResponse.json();
          const summary = gradesData.data.summary;
          console.log(`   🏆 CGPA: ${summary.cgpa}, Total Credits: ${summary.totalCredits}`);
          
          // Show first few grades
          if (gradesData.data.courseGrades.length > 0) {
            const grades = gradesData.data.courseGrades.slice(0, 3);
            grades.forEach(grade => {
              console.log(`   📚 ${grade.subject}: ${grade.marks}/100 (${grade.grade})`);
            });
          }
        } else {
          console.log(`   ❌ Failed to fetch grades data`);
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }
    }
    
    console.log('\n🔔 Testing Notifications Data:\n');
    
    for (const student of students) {
      if (!studentTokens[student.id]) continue;
      
      console.log(`👨‍🎓 ${student.name} (${student.id}):`);
      
      try {
        const notificationsResponse = await fetch(`http://localhost:5000/api/notifications?userId=${student.id}&limit=3`, {
          headers: {
            'Authorization': `Bearer ${studentTokens[student.id]}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (notificationsResponse.ok) {
          const notificationsData = await notificationsResponse.json();
          console.log(`   🔔 Notifications: ${notificationsData.data.total} total, ${notificationsData.data.unreadCount} unread`);
          
          if (notificationsData.data.notifications.length > 0) {
            const firstNotification = notificationsData.data.notifications[0];
            console.log(`   📨 Latest: "${firstNotification.title}" (${firstNotification.priority})`);
          }
        } else {
          console.log(`   ❌ Failed to fetch notifications`);
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }
    }
    
    console.log('\n🎉 Personalization Test Complete!\n');
    console.log('💡 Each student should have different data patterns based on their ID');
    
  } catch (error) {
    console.error('❌ Test Failed:', error.message);
  }
}

testPersonalizedData();