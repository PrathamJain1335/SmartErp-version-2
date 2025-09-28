// seeders/jecrcUniversitySeeder.js - JECRC University Database Seeder
const bcrypt = require('bcryptjs');
const { 
  sequelize, 
  Department, 
  Section, 
  Subject, 
  Student, 
  Faculty, 
  FacultySubjectAssignment,
  setupAssociations 
} = require('../models/newModels');

// JECRC University Departments and their details
const DEPARTMENTS = [
  { code: 'CSE', name: 'Computer Science & Engineering', desc: 'Software development, algorithms, and computing systems' },
  { code: 'IT', name: 'Information Technology', desc: 'Information systems, networking, and database management' },
  { code: 'ECE', name: 'Electronics & Communication Engineering', desc: 'Electronics, communication systems, and signal processing' },
  { code: 'ME', name: 'Mechanical Engineering', desc: 'Manufacturing, thermal systems, and mechanical design' },
  { code: 'CE', name: 'Civil Engineering', desc: 'Construction, infrastructure, and structural engineering' },
  { code: 'EE', name: 'Electrical Engineering', desc: 'Power systems, control systems, and electrical machines' }
];

// Subject templates for each department and semester
const SUBJECT_TEMPLATES = {
  CSE: {
    1: ['Engineering Mathematics-I', 'Physics', 'Chemistry', 'Programming Fundamentals', 'Engineering Graphics'],
    2: ['Engineering Mathematics-II', 'Data Structures', 'Digital Logic Design', 'Object Oriented Programming', 'Environmental Science'],
    3: ['Engineering Mathematics-III', 'Database Management Systems', 'Computer Organization', 'Operating Systems', 'Software Engineering'],
    4: ['Algorithms', 'Computer Networks', 'Theory of Computation', 'Microprocessors', 'Web Technologies'],
    5: ['Machine Learning', 'Compiler Design', 'Distributed Systems', 'Information Security', 'Mobile Computing'],
    6: ['Artificial Intelligence', 'Cloud Computing', 'Big Data Analytics', 'IoT Systems', 'Project Work-I'],
    7: ['Deep Learning', 'Blockchain Technology', 'DevOps', 'Software Testing', 'Project Work-II'],
    8: ['Industry Training', 'Major Project', 'Advanced Topics in AI', 'Entrepreneurship', 'Thesis']
  },
  IT: {
    1: ['Engineering Mathematics-I', 'Physics', 'Chemistry', 'IT Fundamentals', 'Engineering Graphics'],
    2: ['Engineering Mathematics-II', 'Data Structures', 'Digital Systems', 'Programming in Java', 'Environmental Science'],
    3: ['Engineering Mathematics-III', 'Database Systems', 'Computer Networks', 'Operating Systems', 'Software Engineering'],
    4: ['System Analysis & Design', 'Web Development', 'Network Security', 'Mobile App Development', 'Data Mining'],
    5: ['Information Systems', 'Enterprise Systems', 'Cloud Technologies', 'Cyber Security', 'Business Intelligence'],
    6: ['IT Service Management', 'E-Commerce', 'Digital Forensics', 'IoT Applications', 'Project Work-I'],
    7: ['Advanced Networking', 'IT Governance', 'Data Analytics', 'Emerging Technologies', 'Project Work-II'],
    8: ['Industry Training', 'Major Project', 'Advanced Security', 'IT Strategy', 'Thesis']
  },
  ECE: {
    1: ['Engineering Mathematics-I', 'Physics', 'Chemistry', 'Basic Electronics', 'Engineering Graphics'],
    2: ['Engineering Mathematics-II', 'Circuit Analysis', 'Electronic Devices', 'Digital Electronics', 'Environmental Science'],
    3: ['Engineering Mathematics-III', 'Signals & Systems', 'Analog Electronics', 'Microprocessors', 'Communication Systems'],
    4: ['Digital Signal Processing', 'VLSI Design', 'Electromagnetic Theory', 'Control Systems', 'Antenna Theory'],
    5: ['Embedded Systems', 'Wireless Communication', 'Digital Image Processing', 'Optical Communication', 'Power Electronics'],
    6: ['Mobile Communication', 'Satellite Communication', 'FPGA Design', 'Robotics', 'Project Work-I'],
    7: ['Advanced Communication', '5G Technologies', 'IoT Systems', 'AI in Electronics', 'Project Work-II'],
    8: ['Industry Training', 'Major Project', 'Emerging Technologies', 'Research Methodology', 'Thesis']
  }
  // Add more departments as needed
};

// Faculty designations and their hierarchies
const FACULTY_DESIGNATIONS = [
  'Professor', 'Associate Professor', 'Assistant Professor', 'Senior Lecturer', 'Lecturer'
];

// Generate realistic Indian names
const FIRST_NAMES = {
  male: ['Arjun', 'Rohit', 'Vikram', 'Rajesh', 'Suresh', 'Amit', 'Ankit', 'Deepak', 'Gaurav', 'Harsh', 'Kiran', 'Manish', 'Nitin', 'Pawan', 'Rahul', 'Sachin', 'Tarun', 'Varun', 'Yash', 'Ashish'],
  female: ['Priya', 'Anjali', 'Kavya', 'Meera', 'Neha', 'Pooja', 'Rina', 'Shreya', 'Sunita', 'Tanvi', 'Divya', 'Jyoti', 'Nisha', 'Pallavi', 'Rashmi', 'Sonia', 'Usha', 'Vandana', 'Yamini', 'Zara']
};

const LAST_NAMES = ['Sharma', 'Gupta', 'Singh', 'Verma', 'Kumar', 'Agarwal', 'Jain', 'Patel', 'Shah', 'Mehta', 'Joshi', 'Malhotra', 'Saxena', 'Aggarwal', 'Bansal', 'Goyal', 'Mittal', 'Arora', 'Khanna', 'Chopra'];

const RAJASTHAN_CITIES = ['Jaipur', 'Udaipur', 'Jodhpur', 'Kota', 'Ajmer', 'Bikaner', 'Alwar', 'Bhilwara', 'Sikar', 'Pali'];

function getRandomName(gender) {
  const firstNames = FIRST_NAMES[gender] || FIRST_NAMES.male;
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return { firstName, lastName };
}

function getRandomEmail(firstName, lastName, domain = 'jecrc.ac.in') {
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
}

function getRandomPhone() {
  return `9${Math.floor(Math.random() * 900000000) + 100000000}`;
}

function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateRollNo(deptCode, admissionYear, serialNo) {
  return `JECRC-${deptCode}-${admissionYear}-${serialNo.toString().padStart(3, '0')}`;
}

function generateEmployeeId(deptCode, serialNo) {
  return `${deptCode}-FAC-${serialNo.toString().padStart(3, '0')}`;
}

async function seedDatabase() {
  try {
    console.log('🚀 Starting JECRC University Database Seeding...');
    
    // Setup associations
    setupAssociations();
    
    // Sync database with force: true to recreate tables
    console.log('📊 Syncing database...');
    await sequelize.sync({ force: true });
    
    // 1. Create Departments
    console.log('🏢 Creating departments...');
    const departments = [];
    for (const dept of DEPARTMENTS) {
      const department = await Department.create({
        departmentCode: dept.code,
        departmentName: dept.name,
        description: dept.desc,
        establishedDate: new Date('2010-07-01'),
        isActive: true
      });
      departments.push(department);
      console.log(`   ✅ Created department: ${dept.name}`);
    }

    // 2. Create Subjects for each department and semester
    console.log('📚 Creating subjects...');
    const subjects = {};
    for (const department of departments) {
      subjects[department.departmentCode] = {};
      const subjectTemplates = SUBJECT_TEMPLATES[department.departmentCode] || SUBJECT_TEMPLATES.CSE;
      
      for (let semester = 1; semester <= 8; semester++) {
        subjects[department.departmentCode][semester] = [];
        const semesterSubjects = subjectTemplates[semester] || [];
        
        for (let index = 0; index < semesterSubjects.length; index++) {
          const subjectName = semesterSubjects[index];
          const subject = await Subject.create({
            subjectCode: `${department.departmentCode}${semester}${(index + 1).toString().padStart(2, '0')}`,
            subjectName: subjectName,
            departmentId: department.id,
            semester: semester,
            credits: Math.random() > 0.3 ? 3 : 4, // Most subjects are 3 credits, some are 4
            subjectType: subjectName.includes('Lab') || subjectName.includes('Project') ? 'practical' : 'theory',
            isElective: semester > 6 && Math.random() > 0.5,
            isActive: true
          });
          subjects[department.departmentCode][semester].push(subject);
        }
      }
      console.log(`   ✅ Created subjects for ${department.departmentName}`);
    }

    // 3. Create Sections (10 sections as requested)
    console.log('🎓 Creating sections...');
    const sections = [];
    let sectionCounter = 1;
    
    for (const department of departments.slice(0, 3)) { // Focus on first 3 departments for sections
      for (let sem = 1; sem <= 8; sem += 2) { // Create sections for odd semesters primarily
        if (sectionCounter > 10) break;
        
        const section = await Section.create({
          sectionCode: `${department.departmentCode}-${String.fromCharCode(64 + sectionCounter)}`,
          sectionName: `Section ${String.fromCharCode(64 + sectionCounter)}`,
          departmentId: department.id,
          semester: sem,
          academicYear: '2023-24',
          maxStudents: 60,
          currentStudents: 0,
          isActive: true
        });
        sections.push(section);
        console.log(`   ✅ Created section: ${section.sectionCode}`);
        sectionCounter++;
      }
    }

    // 4. Create Faculty (50 faculty members as requested)
    console.log('👨‍🏫 Creating faculty members...');
    const faculties = [];
    let facultyCounter = 1;
    
    for (const department of departments) {
      const facultyPerDept = Math.ceil(50 / departments.length);
      
      for (let i = 0; i < facultyPerDept && facultyCounter <= 50; i++) {
        const gender = Math.random() > 0.3 ? 'male' : 'female'; // 70% male, 30% female
        const { firstName, lastName } = getRandomName(gender);
        const email = getRandomEmail(firstName, lastName + facultyCounter, 'jecrc.ac.in');
        const employeeId = generateEmployeeId(department.departmentCode, facultyCounter);
        
        const faculty = await Faculty.create({
          id: `FAC-${facultyCounter.toString().padStart(4, '0')}`,
          employeeId: employeeId,
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: getRandomPhone(),
          gender: gender === 'male' ? 'Male' : 'Female',
          dateOfBirth: getRandomDate(new Date('1970-01-01'), new Date('1990-12-31')),
          address: `${Math.floor(Math.random() * 999) + 1}, ${RAJASTHAN_CITIES[Math.floor(Math.random() * RAJASTHAN_CITIES.length)]} Colony`,
          city: RAJASTHAN_CITIES[Math.floor(Math.random() * RAJASTHAN_CITIES.length)],
          state: 'Rajasthan',
          pinCode: `${Math.floor(Math.random() * 900000) + 100000}`,
          departmentId: department.id,
          designation: FACULTY_DESIGNATIONS[Math.floor(Math.random() * FACULTY_DESIGNATIONS.length)],
          qualification: Math.random() > 0.3 ? 'PhD' : 'M.Tech',
          specialization: `${department.departmentName} Specialization`,
          experience: Math.floor(Math.random() * 20) + 3, // 3-23 years experience
          joiningDate: getRandomDate(new Date('2015-01-01'), new Date('2023-12-31')),
          officeRoom: `${department.departmentCode}-${Math.floor(Math.random() * 50) + 101}`,
          officeHours: '10:00 AM - 4:00 PM',
          extensionNumber: `${Math.floor(Math.random() * 9000) + 1000}`,
          isHOD: i === 0, // First faculty in each department is HOD
          maxWeeklyHours: 20,
          currentWeeklyHours: Math.floor(Math.random() * 15) + 8, // 8-22 hours
          teachingRating: (Math.random() * 2 + 3).toFixed(2), // 3.0-5.0 rating
          studentFeedbackScore: (Math.random() * 2 + 3).toFixed(2),
          attendancePercentage: (Math.random() * 10 + 90).toFixed(2), // 90-100%
          password: await bcrypt.hash('faculty123', 10),
          isActive: true,
          bloodGroup: ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'][Math.floor(Math.random() * 8)],
          emergencyContact: getRandomPhone()
        });
        
        faculties.push(faculty);
        facultyCounter++;
      }
      console.log(`   ✅ Created faculty for ${department.departmentName}`);
    }

    // Update departments with HOD information
    console.log('🔄 Updating departments with HOD information...');
    for (const department of departments) {
      const hod = faculties.find(f => f.departmentId === department.id && f.isHOD);
      if (hod) {
        await department.update({ 
          hodFacultyId: hod.id,
          totalFaculty: faculties.filter(f => f.departmentId === department.id).length
        });
      }
    }

    // 5. Create Students (500 students as requested)
    console.log('👨‍🎓 Creating students...');
    const students = [];
    let studentCounter = 1;
    
    // Distribute students across sections
    const studentsPerSection = Math.ceil(500 / sections.length);
    
    for (const section of sections) {
      const department = departments.find(d => d.id === section.departmentId);
      const currentStudentCount = Math.min(studentsPerSection, 500 - students.length);
      
      for (let i = 0; i < currentStudentCount; i++) {
        if (studentCounter > 500) break;
        
        const gender = Math.random() > 0.4 ? 'male' : 'female'; // 60% male, 40% female
        const { firstName, lastName } = getRandomName(gender);
        const admissionYear = '21'; // 2021 admission batch
        const rollNo = generateRollNo(department.departmentCode, admissionYear, studentCounter);
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${admissionYear}.${studentCounter}@jecrc.ac.in`;
        
        const student = await Student.create({
          rollNo: rollNo,
          enrollmentNo: `JECRC21${department.departmentCode}${studentCounter.toString().padStart(4, '0')}`,
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: getRandomPhone(),
          gender: gender === 'male' ? 'Male' : 'Female',
          dateOfBirth: getRandomDate(new Date('2000-01-01'), new Date('2005-12-31')),
          address: `${Math.floor(Math.random() * 999) + 1}, ${RAJASTHAN_CITIES[Math.floor(Math.random() * RAJASTHAN_CITIES.length)]} Colony`,
          city: RAJASTHAN_CITIES[Math.floor(Math.random() * RAJASTHAN_CITIES.length)],
          state: 'Rajasthan',
          pinCode: `${Math.floor(Math.random() * 900000) + 100000}`,
          departmentId: department.id,
          sectionId: section.id,
          currentSemester: section.semester,
          admissionYear: '2021',
          expectedGraduationYear: '2025',
          program: 'B.Tech',
          fatherName: getRandomName('male').firstName + ' ' + lastName,
          motherName: getRandomName('female').firstName + ' ' + lastName,
          guardianPhone: getRandomPhone(),
          guardianEmail: getRandomEmail(getRandomName('male').firstName, lastName, 'gmail.com'),
          guardianOccupation: ['Engineer', 'Teacher', 'Doctor', 'Businessman', 'Government Officer'][Math.floor(Math.random() * 5)],
          cgpa: (Math.random() * 4 + 6).toFixed(2), // 6.0-10.0 CGPA
          totalCredits: (section.semester - 1) * 20 + Math.floor(Math.random() * 20), // Roughly 20 credits per semester
          backlogCount: Math.random() > 0.8 ? Math.floor(Math.random() * 3) : 0, // 20% chance of backlogs
          academicStatus: 'active',
          totalFeesDue: Math.random() > 0.7 ? Math.floor(Math.random() * 50000) : 0, // 30% have pending fees
          feesStatus: Math.random() > 0.3 ? 'paid' : 'pending',
          password: await bcrypt.hash('student123', 10),
          isActive: true,
          bloodGroup: ['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'][Math.floor(Math.random() * 8)],
          emergencyContact: getRandomPhone(),
          hostelResident: Math.random() > 0.6, // 40% hostel residents
          transportUser: Math.random() > 0.5, // 50% use transport
          attendancePercentage: (Math.random() * 30 + 70).toFixed(2), // 70-100% attendance
          skills: ['Programming', 'Problem Solving', 'Communication'].slice(0, Math.floor(Math.random() * 3) + 1),
          // Add some realistic portfolio data for random students
          ...(Math.random() > 0.7 && {
            projects: [
              {
                title: 'Web Development Project',
                description: 'Built a responsive website using React and Node.js',
                technologies: ['React', 'Node.js', 'MongoDB'],
                status: 'completed'
              }
            ],
            achievements: [
              {
                title: 'Coding Competition Winner',
                description: 'Won first prize in college coding competition',
                date: '2023-10-15'
              }
            ]
          })
        });
        
        students.push(student);
        studentCounter++;
      }
      
      // Update section's current student count
      await section.update({ currentStudents: currentStudentCount });
      console.log(`   ✅ Created ${currentStudentCount} students for section ${section.sectionCode}`);
    }

    // Update departments with total student count
    for (const department of departments) {
      const deptStudentCount = students.filter(s => s.departmentId === department.id).length;
      await department.update({ totalStudents: deptStudentCount });
    }

    // 6. Assign Class Advisors to Sections
    console.log('🔗 Assigning class advisors to sections...');
    for (const section of sections) {
      const deptFaculties = faculties.filter(f => f.departmentId === section.departmentId);
      if (deptFaculties.length > 0) {
        const advisor = deptFaculties[Math.floor(Math.random() * deptFaculties.length)];
        await section.update({ classAdvisorId: advisor.id });
        await advisor.update({ isClassAdvisor: true, advisorOfSection: section.id });
        console.log(`   ✅ Assigned ${advisor.firstName} ${advisor.lastName} as advisor for ${section.sectionCode}`);
      }
    }

    // 7. Create Faculty-Subject Assignments (Subject-Teacher Mapping)
    console.log('📋 Creating faculty-subject assignments...');
    let assignmentCount = 0;
    
    for (const section of sections) {
      const department = departments.find(d => d.id === section.departmentId);
      const sectionSubjects = subjects[department.departmentCode]?.[section.semester] || [];
      const deptFaculties = faculties.filter(f => f.departmentId === section.departmentId);
      
      for (const subject of sectionSubjects) {
        // Assign a random faculty from the same department
        if (deptFaculties.length > 0) {
          const assignedFaculty = deptFaculties[Math.floor(Math.random() * deptFaculties.length)];
          
          await FacultySubjectAssignment.create({
            facultyId: assignedFaculty.id,
            subjectId: subject.id,
            sectionId: section.id,
            academicYear: '2023-24',
            semester: section.semester,
            weeklyHours: subject.credits,
            roomNumber: `${department.departmentCode}-${Math.floor(Math.random() * 20) + 101}`,
            timeSlot: ['09:00-10:00', '10:00-11:00', '11:30-12:30', '12:30-13:30', '14:30-15:30'][Math.floor(Math.random() * 5)],
            isActive: true
          });
          assignmentCount++;
        }
      }
    }
    console.log(`   ✅ Created ${assignmentCount} faculty-subject assignments`);

    // Summary
    console.log('\n🎉 JECRC University Database Seeding Completed Successfully!');
    console.log('📊 Summary:');
    console.log(`   🏢 Departments: ${departments.length}`);
    console.log(`   📚 Subjects: ${Object.values(subjects).reduce((total, dept) => total + Object.values(dept).reduce((deptTotal, sem) => deptTotal + sem.length, 0), 0)}`);
    console.log(`   🎓 Sections: ${sections.length}`);
    console.log(`   👨‍🏫 Faculty: ${faculties.length}`);
    console.log(`   👨‍🎓 Students: ${students.length}`);
    console.log(`   📋 Faculty-Subject Assignments: ${assignmentCount}`);
    console.log('');
    console.log('🔑 Login Credentials:');
    console.log('   Faculty: Use any faculty email with password "faculty123"');
    console.log('   Student: Use any student email with password "student123"');
    console.log('   Roll No: Students can also login with their roll numbers');
    console.log('');
    console.log('✨ Database is ready for use!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run the seeder
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('🎯 Seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };