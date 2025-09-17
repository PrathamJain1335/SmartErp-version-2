// models/index.js
const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Student_ID: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensure unique student IDs
    validate: {
      notEmpty: true,
      len: [6, 20] // Student ID should be between 6-20 characters
    }
  },
  Full_Name: DataTypes.STRING,
  Gender: DataTypes.STRING,
  Date_of_Birth: DataTypes.DATE,
  Contact_No: DataTypes.STRING,
  Email_ID: {
    type: DataTypes.STRING,
    unique: true, // Ensure unique email addresses
    allowNull: false,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  Address: DataTypes.STRING,
  City: DataTypes.STRING,
  State: DataTypes.STRING,
  PIN: DataTypes.STRING,
  'Parent/Guardian_Name': DataTypes.STRING,
  Parent_Contact_No: DataTypes.STRING,
  Enrollment_No: {
    type: DataTypes.STRING,
    unique: true, // Ensure unique enrollment numbers
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  Roll_No: {
    type: DataTypes.STRING,
    unique: true, // Ensure unique roll numbers
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  Department: DataTypes.STRING,
  Program: DataTypes.STRING,
  'Batch/Year': DataTypes.STRING,
  Section: DataTypes.STRING,
  Semester: DataTypes.INTEGER,
  Subjects_Assigned: DataTypes.STRING,
  Total_Classes: DataTypes.INTEGER,
  Attended_Classes: DataTypes.INTEGER,
  'Attendance_%': DataTypes.DECIMAL(5, 2),
  Internal_Marks: DataTypes.DECIMAL(5, 2),
  Practical_Marks: DataTypes.DECIMAL(5, 2),
  Mid_Sem_Marks: DataTypes.DECIMAL(5, 2),
  End_Sem_Marks: DataTypes.DECIMAL(5, 2),
  Grade: DataTypes.STRING,
  Result_Status: DataTypes.STRING,
  Semester_Fee: DataTypes.DECIMAL(10, 2),
  Hostel_Fee: DataTypes.DECIMAL(10, 2),
  Other_Fees: DataTypes.DECIMAL(10, 2),
  Total_Due: DataTypes.DECIMAL(10, 2),
  Paid_Status: DataTypes.STRING,
  Request_Type: DataTypes.STRING,
  Date_Requested: DataTypes.DATE,
  Faculty_Assigned: DataTypes.STRING,
  Request_Status: DataTypes.STRING,
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100] // Minimum 6 characters for password
    }
  },
  role: { type: DataTypes.STRING, defaultValue: 'student' },
  // Additional fields for enhanced functionality
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  profilePicture: DataTypes.STRING,
  lastLogin: DataTypes.DATE,
  accountStatus: { type: DataTypes.STRING, defaultValue: 'active' }, // active, suspended, graduated
  bloodGroup: DataTypes.STRING,
  guardianOccupation: DataTypes.STRING,
  emergencyContact: DataTypes.STRING,
  admissionDate: DataTypes.DATE,
  expectedGraduationDate: DataTypes.DATE,
  // AI Analytics fields
  riskScore: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0.0 }, // 0-1 risk assessment
  attendancePattern: DataTypes.JSON, // Store attendance patterns for AI
  academicPerformanceData: DataTypes.JSON, // Performance analytics data
  lastAIAnalysis: DataTypes.DATE,
}, { tableName: 'student', timestamps: false });

const Faculty = sequelize.define('Faculty', {
  Faculty_ID: { 
    type: DataTypes.STRING, 
    primaryKey: true,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [4, 20]
    }
  },
  Full_Name: DataTypes.STRING,
  Gender: DataTypes.STRING,
  Date_of_Birth: DataTypes.DATE,
  Contact_No: DataTypes.STRING,
  Email_ID: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  Address: DataTypes.STRING,
  'City/State/PIN': DataTypes.STRING,
  Qualification: DataTypes.STRING,
  Designation: DataTypes.STRING,
  Department: DataTypes.STRING,
  Subjects_Assigned: DataTypes.STRING,
  'Class/Section': DataTypes.STRING,
  Weekly_Lectures_Assigned: DataTypes.INTEGER,
  Course_Syllabus_URL: DataTypes.STRING,
  Lesson_Plan_URL: DataTypes.STRING,
  Day: DataTypes.STRING,
  Time_Slot: DataTypes.STRING,
  Subject_Code: DataTypes.STRING,
  Room_No: DataTypes.STRING,
  Exam_Duty: DataTypes.STRING,
  Marks_Entry_Status: DataTypes.STRING,
  Student_Request_ID: DataTypes.STRING,
  Request_Status: DataTypes.STRING,
  'Course_Completion(%)': DataTypes.DECIMAL(5,2),
  Student_Performance_Report: DataTypes.STRING,
  Attendance_Report: DataTypes.STRING,
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100]
    }
  },
  role: { type: DataTypes.STRING, defaultValue: 'faculty' },
  // Section and access control fields
  assignedSections: {
    type: DataTypes.JSON, // Array of section IDs faculty can access
    defaultValue: []
  },
  assignedDepartments: {
    type: DataTypes.JSON, // Array of departments faculty belongs to
    defaultValue: []
  },
  classAdvisorOf: DataTypes.STRING, // Section they are class advisor of
  // Additional fields for enhanced functionality
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  profilePicture: DataTypes.STRING,
  lastLogin: DataTypes.DATE,
  employeeId: {
    type: DataTypes.STRING,
    unique: true
  },
  joiningDate: DataTypes.DATE,
  officeRoom: DataTypes.STRING,
  officeHours: DataTypes.STRING,
  researchInterests: DataTypes.TEXT,
  publications: DataTypes.JSON,
  // Faculty performance tracking
  teachingRating: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0.0 },
  studentFeedbackScore: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0.0 },
  attendancePercentage: { type: DataTypes.DECIMAL(5, 2), defaultValue: 100.0 },
}, { tableName: 'faculty', timestamps: false });

const Assignment = sequelize.define('Assignment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  studentId: { 
    type: DataTypes.INTEGER, 
    references: { model: Student, key: 'id' } 
  },
  subject: DataTypes.STRING,
  assignmentNo: DataTypes.INTEGER,
  dueDate: DataTypes.DATE,
  pdfUrl: DataTypes.STRING,
  submitted: DataTypes.BOOLEAN,
  submissionDate: DataTypes.DATE,
  filePath: DataTypes.STRING,
}, { tableName: 'assignments', timestamps: false });

Student.hasMany(Assignment, { foreignKey: 'studentId' });
Assignment.belongsTo(Student, { foreignKey: 'studentId' });

// Additional models for enhanced ERP functionality
const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: DataTypes.STRING,
  message: DataTypes.TEXT,
  type: { type: DataTypes.STRING, defaultValue: 'info' }, // info, warning, success, error
  targetRole: DataTypes.STRING, // student, faculty, admin, all
  targetId: DataTypes.STRING, // specific user ID or null for all
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  expiresAt: DataTypes.DATE
}, { tableName: 'notifications', timestamps: true });

const AIInteraction = sequelize.define('AIInteraction', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: DataTypes.STRING,
  userRole: DataTypes.STRING,
  interactionType: DataTypes.STRING, // chat, recommendation, analysis, etc.
  inputData: DataTypes.JSON,
  outputData: DataTypes.JSON,
  feedback: DataTypes.INTEGER, // 1-5 rating
  processingTime: DataTypes.INTEGER, // milliseconds
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'ai_interactions', timestamps: true });

const SystemLog = sequelize.define('SystemLog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  level: DataTypes.STRING, // info, warn, error, debug
  message: DataTypes.TEXT,
  userId: DataTypes.STRING,
  userRole: DataTypes.STRING,
  endpoint: DataTypes.STRING,
  method: DataTypes.STRING,
  statusCode: DataTypes.INTEGER,
  responseTime: DataTypes.INTEGER,
  ipAddress: DataTypes.STRING,
  userAgent: DataTypes.TEXT,
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'system_logs', timestamps: true });

const Course = sequelize.define('Course', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  courseCode: { type: DataTypes.STRING, unique: true },
  courseName: DataTypes.STRING,
  department: DataTypes.STRING,
  credits: DataTypes.INTEGER,
  semester: DataTypes.INTEGER,
  facultyId: { type: DataTypes.STRING, references: { model: Faculty, key: 'Faculty_ID' } },
  syllabus: DataTypes.TEXT,
  prerequisites: DataTypes.STRING,
  maxStudents: DataTypes.INTEGER,
  currentEnrollment: { type: DataTypes.INTEGER, defaultValue: 0 },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'courses', timestamps: true });

const Enrollment = sequelize.define('Enrollment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  studentId: { 
    type: DataTypes.INTEGER, 
    references: { model: Student, key: 'id' } 
  },
  courseId: { type: DataTypes.INTEGER, references: { model: Course, key: 'id' } },
  enrollmentDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  status: { type: DataTypes.STRING, defaultValue: 'active' }, // active, dropped, completed
  finalGrade: DataTypes.STRING,
  finalMarks: DataTypes.DECIMAL(5, 2)
}, { tableName: 'enrollments', timestamps: true });

const Attendance = sequelize.define('Attendance', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  studentId: { 
    type: DataTypes.INTEGER, 
    references: { model: Student, key: 'id' } 
  },
  courseId: { type: DataTypes.INTEGER, references: { model: Course, key: 'id' } },
  date: DataTypes.DATEONLY,
  status: DataTypes.STRING, // present, absent, late
  markedBy: { type: DataTypes.STRING, references: { model: Faculty, key: 'Faculty_ID' } },
  remarks: DataTypes.STRING
}, { tableName: 'attendance_records', timestamps: true });

// Faculty Attendance Model
const FacultyAttendance = sequelize.define('FacultyAttendance', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  facultyId: { 
    type: DataTypes.STRING, 
    references: { model: Faculty, key: 'Faculty_ID' },
    allowNull: false
  },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  checkIn: DataTypes.TIME,
  checkOut: DataTypes.TIME,
  status: { 
    type: DataTypes.STRING, 
    defaultValue: 'present' 
  }, // present, absent, late, half_day, on_leave
  workingHours: DataTypes.DECIMAL(4, 2), // Calculated working hours
  markedBy: DataTypes.STRING, // Admin who marked (if manual)
  remarks: DataTypes.TEXT,
  location: DataTypes.STRING, // If location-based attendance
  isAutoMarked: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { tableName: 'faculty_attendance', timestamps: true });

// Chat History Model for AI Chatbot
const ChatHistory = sequelize.define('ChatHistory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.STRING, allowNull: false }, // Student_ID or Faculty_ID
  userRole: { type: DataTypes.STRING, allowNull: false }, // student, faculty, admin
  message: { type: DataTypes.TEXT, allowNull: false },
  isUserMessage: { type: DataTypes.BOOLEAN, allowNull: false }, // true for user, false for AI
  context: DataTypes.STRING, // Context of conversation (attendance, grades, etc.)
  aiModel: { type: DataTypes.STRING, defaultValue: 'gpt-3.5-turbo' },
  tokens: DataTypes.INTEGER, // Tokens used for AI response
  responseTime: DataTypes.INTEGER, // Response time in milliseconds
  feedback: DataTypes.JSON, // User feedback on AI response
  sessionId: DataTypes.STRING, // Group related messages
}, { tableName: 'chat_history', timestamps: true });

// AI Analytics Model
const AIAnalytics = sequelize.define('AIAnalytics', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  studentId: { 
    type: DataTypes.INTEGER, 
    references: { model: Student, key: 'id' },
    allowNull: true // Can be null for faculty or institutional analytics
  },
  facultyId: { 
    type: DataTypes.STRING, 
    references: { model: Faculty, key: 'Faculty_ID' },
    allowNull: true
  },
  analysisType: DataTypes.STRING, // attendance, academic, behavioral, placement
  analysisData: DataTypes.JSON, // Analysis results
  predictions: DataTypes.JSON, // AI predictions
  recommendations: DataTypes.JSON, // AI recommendations
  confidenceScore: DataTypes.DECIMAL(3, 2), // 0-1 confidence in predictions
  validUntil: DataTypes.DATE, // When analysis expires
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'ai_analytics', timestamps: true });

// Define associations
Student.hasMany(Assignment, { foreignKey: 'studentId' });
Assignment.belongsTo(Student, { foreignKey: 'studentId' });

Faculty.hasMany(Course, { foreignKey: 'facultyId' });
Course.belongsTo(Faculty, { foreignKey: 'facultyId' });

Student.belongsToMany(Course, { through: Enrollment, foreignKey: 'studentId' });
Course.belongsToMany(Student, { through: Enrollment, foreignKey: 'courseId' });

Student.hasMany(Attendance, { foreignKey: 'studentId' });
Attendance.belongsTo(Student, { foreignKey: 'studentId' });

Course.hasMany(Attendance, { foreignKey: 'courseId' });
Attendance.belongsTo(Course, { foreignKey: 'courseId' });

Faculty.hasMany(Attendance, { foreignKey: 'markedBy' });
Attendance.belongsTo(Faculty, { foreignKey: 'markedBy' });

// Faculty Attendance associations
Faculty.hasMany(FacultyAttendance, { foreignKey: 'facultyId' });
FacultyAttendance.belongsTo(Faculty, { foreignKey: 'facultyId' });

// AI Analytics associations
Student.hasMany(AIAnalytics, { foreignKey: 'studentId' });
AIAnalytics.belongsTo(Student, { foreignKey: 'studentId' });

Faculty.hasMany(AIAnalytics, { foreignKey: 'facultyId' });
AIAnalytics.belongsTo(Faculty, { foreignKey: 'facultyId' });

// Chat History associations (polymorphic - can belong to student or faculty)
// No direct associations as userId is polymorphic

module.exports = { 
  sequelize,
  Student, 
  Faculty, 
  Assignment, 
  Notification, 
  AIInteraction, 
  SystemLog, 
  Course, 
  Enrollment, 
  Attendance,
  FacultyAttendance,
  ChatHistory,
  AIAnalytics
};
