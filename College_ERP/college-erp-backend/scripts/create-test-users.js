const bcrypt = require('bcryptjs');
const { Student, Faculty, sequelize } = require('../models');

async function createTestUsers() {
  try {
    // Sync database first
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully');

    // Create test student
    const studentPassword = await bcrypt.hash('demo123', 10);
    const studentData = {
      Student_ID: 'CSE25004',
      Full_Name: 'Alice Johnson',
      Gender: 'Female',
      Date_of_Birth: new Date('2000-05-15'),
      Contact_No: '9876543210',
      Email_ID: 'alice.johnson.cse25004@jecrc.edu',
      Address: '123 Student Street, Jaipur',
      City: 'Jaipur',
      State: 'Rajasthan',
      PIN: '302017',
      'Parent/Guardian_Name': 'Robert Johnson',
      Parent_Contact_No: '9876543211',
      Enrollment_No: 'JECRC2025004',
      Roll_No: '25CSE004',
      Department: 'Computer Science',
      Program: 'B.Tech CSE',
      'Batch/Year': '2025',
      Section: 'A',
      Semester: 1,
      Subjects_Assigned: 'Mathematics, Physics, Chemistry, Programming',
      Total_Classes: 100,
      Attended_Classes: 85,
      'Attendance_%': 85.0,
      Internal_Marks: 85.5,
      Practical_Marks: 90.0,
      Mid_Sem_Marks: 82.0,
      End_Sem_Marks: 88.5,
      Grade: 'A',
      Result_Status: 'Pass',
      Semester_Fee: 50000.00,
      Hostel_Fee: 25000.00,
      Other_Fees: 5000.00,
      Total_Due: 0.00,
      Paid_Status: 'Paid',
      password: studentPassword,
      role: 'student',
      isActive: true,
      accountStatus: 'active',
      admissionDate: new Date('2025-08-15'),
      expectedGraduationDate: new Date('2029-06-15')
    };

    // Create test faculty
    const facultyPassword = await bcrypt.hash('demo123', 10);
    const facultyData = {
      Faculty_ID: 'FAC001',
      Full_Name: 'Dr. Jane Smith',
      Gender: 'Female',
      Date_of_Birth: new Date('1980-03-20'),
      Contact_No: '9876543212',
      Email_ID: 'jane.smith@jecrc.edu',
      Address: '456 Faculty Lane, Jaipur',
      'City/State/PIN': 'Jaipur/Rajasthan/302018',
      Qualification: 'Ph.D. in Computer Science',
      Designation: 'Assistant Professor',
      Department: 'Computer Science',
      Subjects_Assigned: 'Data Structures, Algorithms, Database Management',
      'Class/Section': 'CSE-A, CSE-B',
      Weekly_Lectures_Assigned: 20,
      Course_Syllabus_URL: 'https://jecrc.edu/syllabus/cse',
      Lesson_Plan_URL: 'https://jecrc.edu/lessonplan/cse',
      Day: 'Monday, Wednesday, Friday',
      Time_Slot: '9:00-11:00',
      Subject_Code: 'CS201, CS301, CS401',
      Room_No: 'CSE-101',
      Exam_Duty: 'Internal Examiner',
      Marks_Entry_Status: 'Completed',
      'Course_Completion(%)': 75.5,
      password: facultyPassword,
      role: 'faculty',
      isActive: true,
      assignedSections: ['CSE-A', 'CSE-B'],
      assignedDepartments: ['Computer Science'],
      classAdvisorOf: 'CSE-A',
      employeeId: 'EMP001',
      joiningDate: new Date('2020-07-01'),
      officeRoom: 'CSE-Faculty-101',
      officeHours: '10:00 AM - 12:00 PM, 2:00 PM - 4:00 PM',
      researchInterests: 'Machine Learning, Data Mining, Artificial Intelligence',
      teachingRating: 4.5,
      studentFeedbackScore: 4.2,
      attendancePercentage: 95.0
    };

    // Check if users already exist
    const existingStudent = await Student.findOne({ where: { Email_ID: studentData.Email_ID } });
    const existingFaculty = await Faculty.findOne({ where: { Email_ID: facultyData.Email_ID } });

    if (!existingStudent) {
      await Student.create(studentData);
      console.log('✅ Test student created: alice.johnson.cse25004@jecrc.edu / demo123');
    } else {
      console.log('ℹ️  Test student already exists');
    }

    if (!existingFaculty) {
      await Faculty.create(facultyData);
      console.log('✅ Test faculty created: jane.smith@jecrc.edu / demo123');
    } else {
      console.log('ℹ️  Test faculty already exists');
    }

    console.log('\n🎯 Test Credentials Summary:');
    console.log('👨‍🎓 Student: alice.johnson.cse25004@jecrc.edu / demo123');
    console.log('👩‍🏫 Faculty: jane.smith@jecrc.edu / demo123');
    console.log('👑 Admin: admin@jecrc.ac.in / admin123');

    return {
      success: true,
      message: 'Test users created successfully'
    };

  } catch (error) {
    console.error('❌ Error creating test users:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run if called directly
if (require.main === module) {
  createTestUsers()
    .then((result) => {
      if (result.success) {
        console.log('\n✅ All test users ready!');
        process.exit(0);
      } else {
        console.error('\n❌ Failed to create test users');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('❌ Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = createTestUsers;