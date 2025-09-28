// Static Data Service - Provides hardcoded data instead of fetching from backend
// Only login and chatbot will use actual backend, all other data is static

class StaticDataService {
  constructor() {
    this.cache = new Map();
  }

  // Static student profiles based on login credentials
  getStaticProfiles() {
    return {
      'JECRC-CSE-21-001': {
        id: 'JECRC-CSE-21-001',
        name: 'Suresh Shah',
        fullName: 'Suresh Shah',
        rollNumber: 'JECRC-CSE-21-001',
        rollNo: 'JECRC-CSE-21-001',
        email: 'suresh.shah.21.1@jecrc.ac.in',
        enrollmentNo: 'JECRC2021CSE001',
        department: 'Computer Science Engineering',
        departmentCode: 'CSE',
        currentSemester: 5,
        semester: 5,
        section: 'A',
        cgpa: 8.5,
        attendancePercentage: 87,
        photo: './default-avatar.png',
        program: 'B.Tech CSE',
        isActive: true
      },
      'suresh.shah.21.1@jecrc.ac.in': {
        id: 'JECRC-CSE-21-001',
        name: 'Suresh Shah',
        fullName: 'Suresh Shah',
        rollNumber: 'JECRC-CSE-21-001',
        rollNo: 'JECRC-CSE-21-001',
        email: 'suresh.shah.21.1@jecrc.ac.in',
        enrollmentNo: 'JECRC2021CSE001',
        department: 'Computer Science Engineering',
        departmentCode: 'CSE',
        currentSemester: 5,
        semester: 5,
        section: 'A',
        cgpa: 8.5,
        attendancePercentage: 87,
        photo: './default-avatar.png',
        program: 'B.Tech CSE',
        isActive: true
      },
      'kavya.sharma1': {
        id: 'kavya.sharma1',
        name: 'Dr. Kavya Sharma',
        fullName: 'Dr. Kavya Sharma',
        email: 'kavya.sharma1@jecrc.ac.in',
        department: 'Computer Science Department',
        departmentCode: 'CSE',
        designation: 'Associate Professor',
        employeeId: 'JECRC-FAC-001',
        photo: './default-avatar.png',
        isActive: true
      },
      'admin': {
        id: 'admin-001',
        name: 'System Administrator',
        fullName: 'System Administrator',
        email: 'admin@jecrc.ac.in',
        department: 'Administration',
        departmentCode: 'ADMIN',
        photo: './default-avatar.png',
        isActive: true
      }
    };
  }

  // Static courses data
  getStaticCourses() {
    return [
      {
        id: 'CS201',
        courseId: 'CS201',
        courseName: 'Data Structures & Algorithms',
        title: 'Data Structures & Algorithms',
        courseCode: 'CS201',
        code: 'CS201',
        instructor: 'Dr. Sharma',
        facultyName: 'Dr. Sharma',
        schedule: 'Mon, Wed, Fri 10:30-11:30 AM',
        enrolled: true,
        credits: 4,
        room: 'Room 201',
        semester: 5
      },
      {
        id: 'CS202',
        courseId: 'CS202',
        courseName: 'Database Management Systems',
        title: 'Database Management Systems',
        courseCode: 'CS202',
        code: 'CS202',
        instructor: 'Dr. Patel',
        facultyName: 'Dr. Patel',
        schedule: 'Tue, Thu 2:00-4:00 PM',
        enrolled: true,
        credits: 4,
        room: 'Lab B',
        semester: 5
      },
      {
        id: 'CS203',
        courseId: 'CS203',
        courseName: 'Computer Networks',
        title: 'Computer Networks',
        courseCode: 'CS203',
        code: 'CS203',
        instructor: 'Prof. Kumar',
        facultyName: 'Prof. Kumar',
        schedule: 'Mon 11:00 AM-12:00 PM',
        enrolled: true,
        credits: 3,
        room: 'Room 305',
        semester: 5
      },
      {
        id: 'CS204',
        courseId: 'CS204',
        courseName: 'Software Engineering',
        title: 'Software Engineering',
        courseCode: 'CS204',
        code: 'CS204',
        instructor: 'Dr. Singh',
        facultyName: 'Dr. Singh',
        schedule: 'Wed 9:00-10:00 AM',
        enrolled: true,
        credits: 4,
        room: 'Room 401',
        semester: 5
      },
      {
        id: 'CS205',
        courseId: 'CS205',
        courseName: 'Machine Learning',
        title: 'Machine Learning',
        courseCode: 'CS205',
        code: 'CS205',
        instructor: 'Dr. Agarwal',
        facultyName: 'Dr. Agarwal',
        schedule: 'Fri 3:00-4:00 PM',
        enrolled: true,
        credits: 3,
        room: 'Lab C',
        semester: 5
      }
    ];
  }

  // Static attendance data
  getStaticAttendance() {
    const courses = this.getStaticCourses();
    const attendance = [];
    
    // Generate 30 days of attendance for each course
    courses.forEach(course => {
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        attendance.push({
          id: `att_${course.id}_${i}`,
          courseId: course.id,
          courseName: course.courseName,
          course: course.courseName,
          date: date.toISOString().split('T')[0],
          present: Math.random() > 0.2, // 80% attendance rate
          status: Math.random() > 0.2 ? 'Present' : 'Absent'
        });
      }
    });
    
    return attendance;
  }

  // Static assignments data
  getStaticAssignments() {
    return [
      {
        id: 'ASG001',
        courseId: 'CS201',
        courseName: 'Data Structures & Algorithms',
        course: 'Data Structures & Algorithms',
        title: 'Binary Trees Implementation',
        dueDate: '2025-09-25',
        submitted: false,
        submissionDate: null,
        marks: null,
        totalMarks: 25,
        status: 'pending',
        priority: 'high',
        progress: 60,
        instructor: 'Dr. Sharma',
        professor: 'Dr. Sharma',
        description: 'Implement binary search tree with insertion, deletion, and traversal operations'
      },
      {
        id: 'ASG002',
        courseId: 'CS202',
        courseName: 'Database Management Systems',
        course: 'Database Management Systems',
        title: 'SQL Query Optimization',
        dueDate: '2025-09-28',
        submitted: false,
        submissionDate: null,
        marks: null,
        totalMarks: 20,
        status: 'in-progress',
        priority: 'medium',
        progress: 30,
        instructor: 'Dr. Patel',
        professor: 'Dr. Patel',
        description: 'Optimize given SQL queries and provide performance analysis'
      },
      {
        id: 'ASG003',
        courseId: 'CS205',
        courseName: 'Machine Learning',
        course: 'Machine Learning',
        title: 'Linear Regression Model',
        dueDate: '2025-10-02',
        submitted: true,
        submissionDate: '2025-09-15',
        marks: 28,
        totalMarks: 30,
        status: 'completed',
        priority: 'medium',
        progress: 100,
        instructor: 'Dr. Agarwal',
        professor: 'Dr. Agarwal',
        description: 'Build and evaluate a linear regression model on given dataset'
      },
      {
        id: 'ASG004',
        courseId: 'CS204',
        courseName: 'Software Engineering',
        course: 'Software Engineering',
        title: 'Project Requirements Analysis',
        dueDate: '2025-10-05',
        submitted: false,
        submissionDate: null,
        marks: null,
        totalMarks: 15,
        status: 'pending',
        priority: 'low',
        progress: 0,
        instructor: 'Dr. Singh',
        professor: 'Dr. Singh',
        description: 'Analyze requirements for a software project and create SRS document'
      }
    ];
  }

  // Static results/grades data
  getStaticResults() {
    return [
      {
        id: 'RES001',
        courseId: 'CS201',
        courseName: 'Data Structures & Algorithms',
        course: 'Data Structures & Algorithms',
        semester: 4,
        grade: 'A',
        marks: 85,
        totalMarks: 100,
        gpa: 9.0,
        credits: 4
      },
      {
        id: 'RES002',
        courseId: 'CS202',
        courseName: 'Database Management Systems',
        course: 'Database Management Systems',
        semester: 4,
        grade: 'A-',
        marks: 82,
        totalMarks: 100,
        gpa: 8.5,
        credits: 4
      },
      {
        id: 'RES003',
        courseId: 'CS203',
        courseName: 'Computer Networks',
        course: 'Computer Networks',
        semester: 4,
        grade: 'B+',
        marks: 78,
        totalMarks: 100,
        gpa: 8.0,
        credits: 3
      },
      {
        id: 'RES004',
        courseId: 'CS204',
        courseName: 'Software Engineering',
        course: 'Software Engineering',
        semester: 4,
        grade: 'A+',
        marks: 92,
        totalMarks: 100,
        gpa: 9.5,
        credits: 4
      }
    ];
  }

  // Static notifications
  getStaticNotifications() {
    return [
      {
        id: 'NOT001',
        title: `Welcome ${this.getCurrentUserName()}!`,
        message: 'Welcome to JECRC University ERP System',
        timestamp: 'Today',
        date: new Date().toISOString(),
        seen: false,
        type: 'info',
        priority: 'normal'
      },
      {
        id: 'NOT002',
        title: 'Assignment Due Tomorrow',
        message: 'Binary Trees Implementation assignment is due tomorrow',
        timestamp: 'Today',
        date: new Date().toISOString(),
        seen: false,
        type: 'warning',
        priority: 'high'
      },
      {
        id: 'NOT003',
        title: 'Mid-term Examinations',
        message: 'Mid-term exams will begin from Oct 15, 2025',
        timestamp: '2 days ago',
        date: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
        seen: true,
        type: 'info',
        priority: 'normal'
      },
      {
        id: 'NOT004',
        title: 'Library Extended Hours',
        message: 'Library will be open 24/7 during examination period',
        timestamp: '3 days ago',
        date: new Date(Date.now() - 3*24*60*60*1000).toISOString(),
        seen: true,
        type: 'info',
        priority: 'low'
      }
    ];
  }

  // Get current user name from localStorage
  getCurrentUserName() {
    try {
      const userProfile = localStorage.getItem('userProfile');
      if (userProfile) {
        const profile = JSON.parse(userProfile);
        return profile.name || profile.fullName || 'Student';
      }
    } catch (error) {
      console.log('Error getting user name:', error);
    }
    return 'Student';
  }

  // Get current user ID from localStorage
  getCurrentUserId() {
    return localStorage.getItem('userId') || 'JECRC-CSE-21-001';
  }

  // Main method to get complete student dashboard data
  async getStudentDashboardData() {
    try {
      console.log('📊 StaticDataService: Loading static dashboard data...');
      
      const currentUserId = this.getCurrentUserId();
      const profiles = this.getStaticProfiles();
      const currentProfile = profiles[currentUserId] || profiles['JECRC-CSE-21-001'];

      const dashboardData = {
        profile: currentProfile,
        courses: this.getStaticCourses(),
        attendance: this.getStaticAttendance(),
        assignments: this.getStaticAssignments(),
        results: this.getStaticResults(),
        notifications: this.getStaticNotifications()
      };

      console.log('✅ StaticDataService: Static data loaded for:', currentProfile.name);
      return dashboardData;

    } catch (error) {
      console.error('❌ StaticDataService: Error loading static data:', error);
      
      // Fallback data
      return {
        profile: {
          name: this.getCurrentUserName(),
          rollNumber: this.getCurrentUserId(),
          email: 'student@jecrc.ac.in',
          department: 'Computer Science',
          semester: 5,
          section: 'A',
          cgpa: 8.5,
          photo: './default-avatar.png'
        },
        courses: [],
        attendance: [],
        assignments: [],
        results: [],
        notifications: []
      };
    }
  }

  // Clear cache (kept for compatibility)
  clearCache() {
    this.cache.clear();
  }
}

// Export singleton instance
export const staticDataService = new StaticDataService();
export default staticDataService;