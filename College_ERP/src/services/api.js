// Comprehensive API Configuration for College ERP Frontend-Backend Connection
import authManager from '../utils/authManager';

const API_BASE_URL = 'http://localhost:5000/api';

// Create a robust HTTP client
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get authentication token (delegated to AuthManager)
  getAuthToken() {
    return authManager.getToken();
  }

  // Set authentication token (delegated to AuthManager)
  setAuthToken(token) {
    return authManager.setToken(token);
  }

  // Remove authentication token (delegated to AuthManager)
  removeAuthToken() {
    authManager.clearAuth();
  }

  // Get current user info (delegated to AuthManager)
  getCurrentUser() {
    return authManager.getCurrentUser();
  }

  // Make HTTP request with authentication and error handling
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authentication token if available
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      
      // Handle authentication errors (delegated to AuthManager)
      if (response.status === 401) {
        authManager.handleAuthError({ response });
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Handle different content types
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request with query parameters
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(fullEndpoint, { method: 'GET' });
  }

  // POST request
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // POST request with FormData (for file uploads)
  async postFormData(endpoint, formData) {
    const token = this.getAuthToken();
    const config = {
      method: 'POST',
      body: formData,
      headers: {}
    };

    // Add authentication token if available (don't set Content-Type for FormData)
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  // PUT request
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Create singleton instance
const apiClient = new ApiClient();

// Demo login handler for when backend is unavailable
const handleDemoLogin = (credentials) => {
  console.log('🎨 Demo login handler called with:', { email: credentials.email, role: credentials.role });
  const { email, password, role } = credentials;
  
  // Demo credentials - matching the login form display
  const demoUsers = {
    'admin@jecrc.ac.in': { password: 'admin123', role: 'admin', name: 'Admin User' },
    'suresh.shah.21.1@jecrc.ac.in': { password: 'student123', role: 'student', name: 'Suresh Shah', rollNo: 'JECRC-CSE-21-001' },
    'JECRC-CSE-21-001': { password: 'student123', role: 'student', name: 'Suresh Shah', rollNo: 'JECRC-CSE-21-001', email: 'suresh.shah.21.1@jecrc.ac.in' },
    'kavya.sharma1@jecrc.ac.in': { password: 'faculty123', role: 'faculty', name: 'Dr. Kavya Sharma' }
  };
  
  const user = demoUsers[email];
  console.log('🔍 Demo user lookup for email:', email, 'found:', !!user);
  
  if (user && user.password === password && user.role === role) {
    console.log('✅ Demo login successful for:', user.name);
    const token = 'demo-token-' + Date.now();
    const userId = user.rollNo || email.split('@')[0];
    const userEmail = user.email || email;
    
    const response = {
      success: true,
      token,
      role: user.role,
      userId: userId,
      user: {
        id: userId,
        name: user.name,
        fullName: user.name,
        email: userEmail,
        role: user.role,
        rollNo: user.rollNo,
        department: user.role === 'student' ? 'Computer Science Engineering' : 'Computer Science Department',
        departmentCode: user.role === 'student' ? 'CSE' : 'CSE',
        currentSemester: user.role === 'student' ? 5 : undefined,
        section: user.role === 'student' ? 'A' : undefined,
        cgpa: user.role === 'student' ? 8.5 : undefined
      }
    };
    
    // Store authentication data using AuthManager
    authManager.setAuthData({
      token: token,
      role: user.role,
      userId: response.userId,
      user: response.user
    });
    
    console.log('📦 Demo login response prepared:', { userId, role: user.role, userName: user.name });
    return response;
  } else {
    console.log('❌ Demo login failed - invalid credentials or role mismatch');
    console.log('Available demo users:', Object.keys(demoUsers));
    throw new Error('Invalid credentials');
  }
};

// Authentication API
export const authAPI = {
  login: async (credentials) => {
    console.log('🚀 authAPI.login called with:', {
      email: credentials.email,
      role: credentials.role,
      password: credentials.password ? '[HIDDEN]' : 'NO PASSWORD'
    });
    
    try {
      console.log('🔑 Starting backend login attempt...');
      
      // Transform credentials to match backend expectations
      const loginData = {
        identifier: credentials.email,
        password: credentials.password,
        role: credentials.role
      };
      
      console.log('🎯 Attempting backend login...');
      const response = await apiClient.post('/auth/login', loginData);
      if (response.success && response.token) {
        // Store authentication data using AuthManager
        authManager.setAuthData({
          token: response.token,
          role: response.role,
          userId: response.userId,
          user: response.user
        });
        console.log('✅ Login successful:', response.user?.name);
        return response;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.log('❌ Backend login failed:', error.message);
      
      // Use demo fallback for any backend error (network, 500, connection refused, etc.)
      console.log('🔄 Backend error detected, using demo authentication');
      console.log('🎨 Demo login attempt with credentials:', credentials.email);
      return handleDemoLogin(credentials);
    }
  },

  register: async (userData) => {
    return apiClient.post('/auth/register', userData);
  },

  logout: () => {
    authManager.clearAuth();
  },

  getProfile: async () => {
    try {
      const response = await apiClient.get('/auth/profile');
      return response;
    } catch (error) {
      console.error('Profile fetch failed:', error);
      // Return current user from localStorage as fallback
      const currentUser = apiClient.getCurrentUser();
      return {
        success: true,
        user: currentUser.profile
      };
    }
  },

  getCurrentUser: () => {
    return authManager.getCurrentUser();
  }
};

// Profile Photo API
export const profilePhotoAPI = {
  // Upload profile photo
  upload: async (file) => {
    const formData = new FormData();
    formData.append('profilePhoto', file);
    return apiClient.postFormData('/profile-photos/upload', formData);
  },

  // Get current user's profile photo
  getCurrentPhoto: () => {
    return apiClient.get('/profile-photos/current/me');
  },

  // Get specific user's profile photo
  getUserPhoto: (userId) => {
    return apiClient.get(`/profile-photos/${userId}`);
  },

  // Delete current user's profile photo
  deletePhoto: () => {
    return apiClient.delete('/profile-photos/current/me');
  }
};

// Students API
export const studentsAPI = {
  getAll: (params = {}) => apiClient.get('/students', params),
  getById: (id) => apiClient.get(`/students/${id}`),
  create: (data) => apiClient.post('/students', data),
  update: (id, data) => apiClient.put(`/students/${id}`, data),
  delete: (id) => apiClient.delete(`/students/${id}`),
  search: (query) => apiClient.get('/students', { search: query }),
  getByDepartment: (dept) => apiClient.get('/students', { department: dept }),
  getBySection: (section) => apiClient.get('/students', { section: section }),
  updateProfile: (id, data) => apiClient.put(`/students/${id}/profile`, data)
};

// Faculty API
export const facultyAPI = {
  getAll: (params = {}) => apiClient.get('/faculties', params),
  getById: (id) => apiClient.get(`/faculties/${id}`),
  create: (data) => apiClient.post('/faculties', data),
  update: (id, data) => apiClient.put(`/faculties/${id}`, data),
  delete: (id) => apiClient.delete(`/faculties/${id}`),
  search: (query) => apiClient.get('/faculties', { search: query }),
  getByDepartment: (dept) => apiClient.get('/faculties', { department: dept }),
  updateProfile: (id, data) => apiClient.put(`/faculties/${id}/profile`, data),
  getStudents: (facultyId) => apiClient.get(`/faculties/${facultyId}/students`)
};

// Attendance API
export const attendanceAPI = {
  // Student attendance
  getStudentAttendance: (studentId, params = {}) => apiClient.get(`/attendance/student/${studentId}`, params),
  markAttendance: (data) => apiClient.post('/attendance', data),
  updateAttendance: (id, data) => apiClient.put(`/attendance/${id}`, data),
  
  // Faculty attendance
  getFacultyAttendance: (facultyId, params = {}) => apiClient.get(`/attendance/faculty/${facultyId}`, params),
  markFacultyAttendance: (data) => apiClient.post('/attendance/faculty', data),
  
  // Class attendance
  getClassAttendance: (classId, date) => apiClient.get(`/attendance/class/${classId}`, { date }),
  getAttendanceReport: (params) => apiClient.get('/attendance/report', params)
};

// Grades and Results API
export const gradesAPI = {
  getStudentGrades: (studentId) => apiClient.get(`/grades/student/${studentId}`),
  getClassGrades: (classId) => apiClient.get(`/grades/class/${classId}`),
  updateGrades: (data) => apiClient.post('/grades', data),
  getResults: (studentId, semester) => apiClient.get(`/results/${studentId}`, { semester }),
  publishResults: (classId, semester) => apiClient.post(`/results/publish`, { classId, semester })
};

// Assignments API
export const assignmentsAPI = {
  getAll: (params = {}) => apiClient.get('/assignments', params),
  getById: (id) => apiClient.get(`/assignments/${id}`),
  create: (data) => apiClient.post('/assignments', data),
  update: (id, data) => apiClient.put(`/assignments/${id}`, data),
  delete: (id) => apiClient.delete(`/assignments/${id}`),
  submit: (id, formData) => apiClient.postFormData(`/assignments/${id}/submit`, formData),
  getSubmissions: (id) => apiClient.get(`/assignments/${id}/submissions`),
  gradeSubmission: (submissionId, data) => apiClient.put(`/assignments/submissions/${submissionId}/grade`, data)
};

// Examinations API
export const examsAPI = {
  getAll: (params = {}) => apiClient.get('/exams', params),
  getById: (id) => apiClient.get(`/exams/${id}`),
  create: (data) => apiClient.post('/exams', data),
  update: (id, data) => apiClient.put(`/exams/${id}`, data),
  delete: (id) => apiClient.delete(`/exams/${id}`),
  getSchedule: (params) => apiClient.get('/exams/schedule', params),
  getResults: (examId) => apiClient.get(`/exams/${examId}/results`)
};

// Courses API
export const coursesAPI = {
  getAll: (params = {}) => apiClient.get('/courses', params),
  getById: (id) => apiClient.get(`/courses/${id}`),
  create: (data) => apiClient.post('/courses', data),
  update: (id, data) => apiClient.put(`/courses/${id}`, data),
  delete: (id) => apiClient.delete(`/courses/${id}`),
  getEnrollments: (id) => apiClient.get(`/courses/${id}/enrollments`),
  enrollStudent: (courseId, studentId) => apiClient.post(`/courses/${courseId}/enroll`, { studentId })
};

// Fees API
export const feesAPI = {
  getStudentFees: (studentId) => apiClient.get(`/fees/student/${studentId}`),
  getAllFees: (params = {}) => apiClient.get('/fees', params),
  createFeeRecord: (data) => apiClient.post('/fees', data),
  updateFeeRecord: (id, data) => apiClient.put(`/fees/${id}`, data),
  recordPayment: (data) => apiClient.post('/fees/payment', data),
  getPaymentHistory: (studentId) => apiClient.get(`/fees/payments/${studentId}`)
};

// Library API
export const libraryAPI = {
  getBooks: (params = {}) => apiClient.get('/library/books', params),
  getBookById: (id) => apiClient.get(`/library/books/${id}`),
  addBook: (data) => apiClient.post('/library/books', data),
  updateBook: (id, data) => apiClient.put(`/library/books/${id}`, data),
  deleteBook: (id) => apiClient.delete(`/library/books/${id}`),
  issueBook: (data) => apiClient.post('/library/issue', data),
  returnBook: (data) => apiClient.post('/library/return', data),
  getIssuedBooks: (studentId) => apiClient.get(`/library/issued/${studentId}`)
};

// Notifications API
export const notificationsAPI = {
  getAll: (params = {}) => apiClient.get('/notifications', params),
  getById: (id) => apiClient.get(`/notifications/${id}`),
  create: (data) => apiClient.post('/notifications', data),
  update: (id, data) => apiClient.put(`/notifications/${id}`, data),
  delete: (id) => apiClient.delete(`/notifications/${id}`),
  markAsRead: (id) => apiClient.put(`/notifications/${id}/read`),
  markAllAsRead: () => apiClient.put('/notifications/read-all')
};

// Analytics and Reports API
export const analyticsAPI = {
  getDashboardStats: (role) => apiClient.get(`/analytics/dashboard/${role}`),
  getAttendanceAnalytics: (params) => apiClient.get('/analytics/attendance', params),
  getGradeAnalytics: (params) => apiClient.get('/analytics/grades', params),
  getStudentPerformance: (studentId) => apiClient.get(`/analytics/student/${studentId}`),
  getFacultyPerformance: (facultyId) => apiClient.get(`/analytics/faculty/${facultyId}`),
  generateReport: (type, params) => apiClient.post(`/analytics/reports/${type}`, params)
};

// AI Services API
export const aiAPI = {
  getChatbotResponse: (message, context) => apiClient.post('/ai/chatbot', { message, context }),
  getStudentInsights: (studentId) => apiClient.get(`/ai/insights/student/${studentId}`),
  getFacultyInsights: (facultyId) => apiClient.get(`/ai/insights/faculty/${facultyId}`),
  generateRecommendations: (type, data) => apiClient.post(`/ai/recommendations/${type}`, data),
  analyzePerformance: (data) => apiClient.post('/ai/analyze-performance', data)
};

// Timetable API
export const timetableAPI = {
  getStudentTimetable: (studentId) => apiClient.get(`/timetable/student/${studentId}`),
  getFacultyTimetable: (facultyId) => apiClient.get(`/timetable/faculty/${facultyId}`),
  getClassTimetable: (classId) => apiClient.get(`/timetable/class/${classId}`),
  create: (data) => apiClient.post('/timetable', data),
  update: (id, data) => apiClient.put(`/timetable/${id}`, data),
  delete: (id) => apiClient.delete(`/timetable/${id}`)
};

// Career Services API
export const careerAPI = {
  getOpportunities: (params = {}) => apiClient.get('/career/opportunities', params),
  getById: (id) => apiClient.get(`/career/opportunities/${id}`),
  apply: (id, data) => apiClient.post(`/career/opportunities/${id}/apply`, data),
  getApplications: (studentId) => apiClient.get(`/career/applications/${studentId}`),
  getPlacementStats: () => apiClient.get('/career/placement-stats')
};

// Admin specific APIs
export const adminAPI = {
  // User management
  createUser: (userData) => apiClient.post('/admin/users', userData),
  updateUser: (id, userData) => apiClient.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => apiClient.delete(`/admin/users/${id}`),
  toggleUserStatus: (id) => apiClient.put(`/admin/users/${id}/toggle-status`),
  
  // System settings
  getSettings: () => apiClient.get('/admin/settings'),
  updateSettings: (settings) => apiClient.put('/admin/settings', settings),
  
  // Bulk operations
  bulkImportStudents: (formData) => apiClient.postFormData('/admin/bulk-import/students', formData),
  bulkImportFaculty: (formData) => apiClient.postFormData('/admin/bulk-import/faculty', formData),
  
  // System reports
  getSystemReports: () => apiClient.get('/admin/reports'),
  generateSystemReport: (type, params) => apiClient.post(`/admin/reports/${type}`, params)
};

// Export the client for custom requests
export default apiClient;
