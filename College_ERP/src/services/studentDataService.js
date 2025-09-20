// Student Data Service - Fetches real student data from backend
import { authAPI, studentsAPI, attendanceAPI, assignmentsAPI, gradesAPI, coursesAPI } from './api';

class StudentDataService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
  }

  // Get cached data if still valid
  getCachedData(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  // Set cache data
  setCachedData(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Get current user's profile from backend
  async getCurrentUserProfile() {
    try {
      const cached = this.getCachedData('userProfile');
      if (cached) return cached;

      const response = await authAPI.getProfile();
      if (response.success && response.user) {
        this.setCachedData('userProfile', response.user);
        return response.user;
      }
      throw new Error('Failed to fetch user profile');
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Fallback to localStorage data
      const currentUser = authAPI.getCurrentUser();
      const profile = currentUser.profile;
      
      // If we have a profile in localStorage, return it
      if (profile && profile.name) {
        return profile;
      }
      
      // Last resort fallback
      throw new Error('No user profile available');
    }
  }

  // Get student's attendance data
  async getStudentAttendance(studentId) {
    try {
      const cached = this.getCachedData(`attendance_${studentId}`);
      if (cached) return cached;

      const response = await attendanceAPI.getStudentAttendance(studentId);
      if (response.success) {
        this.setCachedData(`attendance_${studentId}`, response.data);
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching attendance:', error);
      return [];
    }
  }

  // Get student's assignments
  async getStudentAssignments(studentId) {
    try {
      const cached = this.getCachedData(`assignments_${studentId}`);
      if (cached) return cached;

      const response = await assignmentsAPI.getAll({ studentId });
      if (response.success) {
        this.setCachedData(`assignments_${studentId}`, response.data);
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching assignments:', error);
      return [];
    }
  }

  // Get student's courses
  async getStudentCourses(studentId) {
    try {
      const cached = this.getCachedData(`courses_${studentId}`);
      if (cached) return cached;

      const response = await coursesAPI.getAll({ studentId });
      if (response.success) {
        this.setCachedData(`courses_${studentId}`, response.data);
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
  }

  // Get student's grades/results
  async getStudentResults(studentId) {
    try {
      const cached = this.getCachedData(`results_${studentId}`);
      if (cached) return cached;

      const response = await gradesAPI.getStudentGrades(studentId);
      if (response.success) {
        this.setCachedData(`results_${studentId}`, response.data);
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching results:', error);
      return [];
    }
  }

  // Get complete student dashboard data
  async getStudentDashboardData() {
    try {
      const currentUser = authAPI.getCurrentUser();
      if (!currentUser.isAuthenticated || !currentUser.userId) {
        throw new Error('User not authenticated');
      }

      const studentId = currentUser.userId;
      
      // Get user profile first
      const profile = await this.getCurrentUserProfile();
      
      // Parallel fetch other data
      const [attendance, assignments, courses, results] = await Promise.allSettled([
        this.getStudentAttendance(studentId),
        this.getStudentAssignments(studentId),
        this.getStudentCourses(studentId),
        this.getStudentResults(studentId)
      ]);

      // Process the results
      const attendanceData = attendance.status === 'fulfilled' ? attendance.value : [];
      const assignmentsData = assignments.status === 'fulfilled' ? assignments.value : [];
      const coursesData = courses.status === 'fulfilled' ? courses.value : [];
      const resultsData = results.status === 'fulfilled' ? results.value : [];

      return {
        profile: {
          name: profile?.fullName || profile?.name || currentUser.profile?.name || currentUser.profile?.fullName || 'Student',
          rollNumber: profile?.rollNo || profile?.rollNumber || profile?.id || currentUser.userId || 'N/A',
          email: profile?.email || currentUser.profile?.email || 'N/A',
          enrollmentNo: profile?.enrollmentNo || currentUser.profile?.enrollmentNo || 'N/A',
          department: profile?.department || profile?.departmentCode || currentUser.profile?.department || 'N/A',
          semester: profile?.currentSemester || profile?.semester || currentUser.profile?.currentSemester || 'N/A',
          section: profile?.section || currentUser.profile?.section || 'N/A',
          cgpa: profile?.cgpa || currentUser.profile?.cgpa || 0,
          photo: profile?.profilePicture || profile?.photo || './default-avatar.png'
        },
        courses: coursesData.map(course => ({
          id: course.id || course.courseId,
          title: course.courseName || course.title,
          code: course.courseCode || course.code,
          instructor: course.instructor || course.facultyName || 'TBD',
          schedule: course.schedule || 'TBD',
          enrolled: course.enrolled !== undefined ? course.enrolled : true,
          credits: course.credits || 0
        })),
        results: resultsData.map(result => ({
          id: result.id,
          course: result.courseName || result.course,
          grade: result.grade,
          semester: result.semester,
          marks: result.marks,
          totalMarks: result.totalMarks
        })),
        attendance: attendanceData.map(att => ({
          id: att.id,
          course: att.courseName || att.course,
          date: att.date,
          present: att.present,
          status: att.status
        })),
        assignments: assignmentsData.map(assignment => ({
          id: assignment.id,
          course: assignment.courseName || assignment.course,
          title: assignment.title,
          dueDate: assignment.dueDate,
          submitted: assignment.submitted || false,
          submissionDate: assignment.submissionDate,
          marks: assignment.marks,
          totalMarks: assignment.totalMarks,
          status: assignment.status
        })),
        notifications: [
          { id: 1, title: "Welcome to ERP System", timestamp: "Today", seen: false },
          { id: 2, title: "Profile updated successfully", timestamp: "Yesterday", seen: true }
        ]
      };

    } catch (error) {
      console.error('Error fetching student dashboard data:', error);
      
      // Fallback to current user data with minimal info
      const currentUser = authAPI.getCurrentUser();
      return {
        profile: {
          name: currentUser.profile?.name || currentUser.profile?.fullName || 'Student',
          rollNumber: currentUser.userId || 'N/A',
          email: currentUser.profile?.email || 'N/A',
          enrollmentNo: currentUser.profile?.enrollmentNo || 'N/A',
          department: currentUser.profile?.department || 'N/A',
          semester: currentUser.profile?.currentSemester || 'N/A',
          section: currentUser.profile?.section || 'N/A',
          cgpa: currentUser.profile?.cgpa || 0,
          photo: './default-avatar.png'
        },
        courses: [],
        results: [],
        attendance: [],
        assignments: [],
        notifications: [
          { id: 1, title: "Welcome to ERP System", timestamp: "Today", seen: false }
        ]
      };
    }
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Clear specific cache entry
  clearCacheEntry(key) {
    this.cache.delete(key);
  }
}

// Export singleton instance
export const studentDataService = new StudentDataService();
export default studentDataService;