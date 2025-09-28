// models/newModels.js - Comprehensive JECRC University ERP Database Models
const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// Department Model
const Department = sequelize.define('Department', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  departmentCode: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  departmentName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  hodFacultyId: {
    type: DataTypes.STRING,
    allowNull: true, // Can be null initially
  },
  description: DataTypes.TEXT,
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  establishedDate: DataTypes.DATE,
  totalStudents: { type: DataTypes.INTEGER, defaultValue: 0 },
  totalFaculty: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: 'departments', timestamps: true });

// Section Model
const Section = sequelize.define('Section', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  sectionCode: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  sectionName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  departmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'departments', key: 'id' }
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 8 }
  },
  academicYear: {
    type: DataTypes.STRING,
    allowNull: false, // e.g., "2023-24"
  },
  classAdvisorId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  maxStudents: { type: DataTypes.INTEGER, defaultValue: 60 },
  currentStudents: { type: DataTypes.INTEGER, defaultValue: 0 },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'sections', timestamps: true });

// Subject Model
const Subject = sequelize.define('Subject', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  subjectCode: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  subjectName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  departmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'departments', key: 'id' }
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 8 }
  },
  credits: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 3
  },
  subjectType: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'theory' // theory, practical, lab, project
  },
  isElective: { type: DataTypes.BOOLEAN, defaultValue: false },
  syllabus: DataTypes.TEXT,
  prerequisites: DataTypes.STRING,
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'subjects', timestamps: true });

// Enhanced Student Model with Roll_No as unique identifier
const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  rollNo: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [6, 20] // JECRC format: like JECRC-CSE-21-001
    }
  },
  enrollmentNo: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  fullName: {
    type: DataTypes.VIRTUAL,
    get() {
      return `${this.firstName} ${this.lastName}`;
    }
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  phone: DataTypes.STRING,
  gender: {
    type: DataTypes.STRING,
    validate: { isIn: [['Male', 'Female', 'Other']] }
  },
  dateOfBirth: DataTypes.DATE,
  address: DataTypes.TEXT,
  city: DataTypes.STRING,
  state: { type: DataTypes.STRING, defaultValue: 'Rajasthan' },
  pinCode: DataTypes.STRING,
  departmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'departments', key: 'id' }
  },
  sectionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'sections', key: 'id' }
  },
  currentSemester: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 8 }
  },
  admissionYear: DataTypes.STRING, // e.g., "2021"
  expectedGraduationYear: DataTypes.STRING, // e.g., "2025"
  program: DataTypes.STRING, // B.Tech, M.Tech, etc.
  // Guardian Information
  fatherName: DataTypes.STRING,
  motherName: DataTypes.STRING,
  guardianPhone: DataTypes.STRING,
  guardianEmail: DataTypes.STRING,
  guardianOccupation: DataTypes.STRING,
  // Academic Information
  cgpa: { type: DataTypes.DECIMAL(4, 2), defaultValue: 0.00 },
  totalCredits: { type: DataTypes.INTEGER, defaultValue: 0 },
  backlogCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  academicStatus: {
    type: DataTypes.STRING,
    defaultValue: 'active' // active, probation, suspended, graduated
  },
  // Financial Information
  totalFeesDue: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
  feesStatus: {
    type: DataTypes.STRING,
    defaultValue: 'pending' // paid, pending, overdue
  },
  // Profile and Authentication
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [6, 100] }
  },
  profilePicture: DataTypes.STRING,
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  lastLogin: DataTypes.DATE,
  // Additional Information
  bloodGroup: DataTypes.STRING,
  emergencyContact: DataTypes.STRING,
  hostelResident: { type: DataTypes.BOOLEAN, defaultValue: false },
  transportUser: { type: DataTypes.BOOLEAN, defaultValue: false },
  // AI and Analytics
  riskScore: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0.0 },
  attendancePercentage: { type: DataTypes.DECIMAL(5, 2), defaultValue: 100.0 },
  // Portfolio and Career
  skills: DataTypes.JSON,
  projects: DataTypes.JSON,
  achievements: DataTypes.JSON,
  certifications: DataTypes.JSON,
  extracurricular: DataTypes.JSON,
  internships: DataTypes.JSON,
  careerGoals: DataTypes.TEXT,
  linkedinProfile: DataTypes.STRING,
  githubProfile: DataTypes.STRING,
  portfolioData: DataTypes.JSON,
  portfolioLastGenerated: DataTypes.DATE,
}, { tableName: 'students', timestamps: true });

// Enhanced Faculty Model
const Faculty = sequelize.define('Faculty', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  employeeId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { notEmpty: true }
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  fullName: {
    type: DataTypes.VIRTUAL,
    get() {
      return `${this.firstName} ${this.lastName}`;
    }
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  phone: DataTypes.STRING,
  gender: {
    type: DataTypes.STRING,
    validate: { isIn: [['Male', 'Female', 'Other']] }
  },
  dateOfBirth: DataTypes.DATE,
  address: DataTypes.TEXT,
  city: DataTypes.STRING,
  state: { type: DataTypes.STRING, defaultValue: 'Rajasthan' },
  pinCode: DataTypes.STRING,
  // Professional Information
  departmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'departments', key: 'id' }
  },
  designation: DataTypes.STRING, // Professor, Associate Professor, Assistant Professor, etc.
  qualification: DataTypes.STRING, // PhD, M.Tech, etc.
  specialization: DataTypes.STRING,
  experience: DataTypes.INTEGER, // years of experience
  joiningDate: DataTypes.DATE,
  // Contact and Office
  officeRoom: DataTypes.STRING,
  officeHours: DataTypes.STRING,
  extensionNumber: DataTypes.STRING,
  // Academic Responsibilities
  isHOD: { type: DataTypes.BOOLEAN, defaultValue: false },
  isClassAdvisor: { type: DataTypes.BOOLEAN, defaultValue: false },
  advisorOfSection: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'sections', key: 'id' }
  },
  // Teaching Load
  maxWeeklyHours: { type: DataTypes.INTEGER, defaultValue: 20 },
  currentWeeklyHours: { type: DataTypes.INTEGER, defaultValue: 0 },
  // Research and Publications
  researchAreas: DataTypes.JSON,
  publications: DataTypes.JSON,
  projects: DataTypes.JSON,
  // Performance Metrics
  teachingRating: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0.0 },
  studentFeedbackScore: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0.0 },
  attendancePercentage: { type: DataTypes.DECIMAL(5, 2), defaultValue: 100.0 },
  // Profile and Authentication
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [6, 100] }
  },
  profilePicture: DataTypes.STRING,
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  lastLogin: DataTypes.DATE,
  // Additional Information
  emergencyContact: DataTypes.STRING,
  bloodGroup: DataTypes.STRING,
  // AI and Analytics
  performanceData: DataTypes.JSON,
}, { tableName: 'faculty', timestamps: true });

// Faculty-Subject Assignment Model
const FacultySubjectAssignment = sequelize.define('FacultySubjectAssignment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  facultyId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: { model: 'faculty', key: 'id' }
  },
  subjectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'subjects', key: 'id' }
  },
  sectionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'sections', key: 'id' }
  },
  academicYear: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  weeklyHours: { type: DataTypes.INTEGER, defaultValue: 3 },
  roomNumber: DataTypes.STRING,
  timeSlot: DataTypes.STRING,
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'faculty_subject_assignments', timestamps: true });

// Document Management Model
const Document = sequelize.define('Document', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  originalName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  mimeType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'other'
  },
  description: DataTypes.TEXT,
  // Ownership - polymorphic relationship
  uploadedBy: {
    type: DataTypes.STRING,
    allowNull: false, // Can be student roll number or faculty ID
  },
  uploaderType: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isIn: [['student', 'faculty', 'admin']] }
  },
  // Access Control
  isPublic: { type: DataTypes.BOOLEAN, defaultValue: false },
  sharedWith: DataTypes.JSON, // Array of user IDs who have access
  // Additional Metadata
  tags: DataTypes.JSON, // Array of tags for better searchability
  subject: DataTypes.STRING, // Related to which subject/course
  academicYear: DataTypes.STRING,
  semester: DataTypes.INTEGER,
  // Document Status
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  verifiedBy: DataTypes.STRING,
  verificationDate: DataTypes.DATE,
  // File Processing
  thumbnailPath: DataTypes.STRING, // For images/PDFs
  extractedText: DataTypes.TEXT, // OCR or text extraction for search
  // Versioning
  versionNumber: { type: DataTypes.INTEGER, defaultValue: 1 },
  parentDocumentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'documents', key: 'id' }
  },
}, { tableName: 'documents', timestamps: true });

// Student-Section Enrollment (for handling transfers and multiple sections)
const StudentSectionEnrollment = sequelize.define('StudentSectionEnrollment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'students', key: 'id' }
  },
  sectionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'sections', key: 'id' }
  },
  academicYear: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  enrollmentDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  transferReason: DataTypes.STRING, // If transferred from another section
}, { tableName: 'student_section_enrollments', timestamps: true });

// Enhanced Attendance Model
const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'students', key: 'id' }
  },
  subjectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'subjects', key: 'id' }
  },
  facultyId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: { model: 'faculty', key: 'id' }
  },
  sectionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'sections', key: 'id' }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  timeSlot: DataTypes.STRING, // Morning, Afternoon, etc.
  period: DataTypes.INTEGER, // 1st period, 2nd period, etc.
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'present',
    validate: { isIn: [['present', 'absent', 'late', 'excused']] }
  },
  markedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  location: DataTypes.STRING, // Classroom/Lab location
  remarks: DataTypes.STRING,
  // Biometric/Digital verification
  verificationMethod: {
    type: DataTypes.STRING,
    defaultValue: 'manual', // manual, biometric, qr_code, geolocation
  },
  geolocation: DataTypes.JSON, // lat, lng for geo-based attendance
}, { tableName: 'attendance_records', timestamps: true });

// Faculty Attendance Model
const FacultyAttendance = sequelize.define('FacultyAttendance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  facultyId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: { model: 'faculty', key: 'id' }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  checkIn: DataTypes.TIME,
  checkOut: DataTypes.TIME,
  status: {
    type: DataTypes.STRING,
    defaultValue: 'present',
    validate: { isIn: [['present', 'absent', 'late', 'half_day', 'on_leave']] }
  },
  workingHours: DataTypes.DECIMAL(4, 2),
  location: DataTypes.STRING,
  remarks: DataTypes.TEXT,
  markedBy: DataTypes.STRING, // Admin who marked (if manual)
  isAutoMarked: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'faculty_attendance', timestamps: true });

// Assignment Model
const Assignment = sequelize.define('Assignment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: DataTypes.TEXT,
  subjectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'subjects', key: 'id' }
  },
  facultyId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: { model: 'faculty', key: 'id' }
  },
  sectionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'sections', key: 'id' }
  },
  assignmentType: {
    type: DataTypes.STRING,
    defaultValue: 'individual', // individual, group, project
  },
  maxMarks: { type: DataTypes.INTEGER, defaultValue: 100 },
  dueDate: DataTypes.DATE,
  submissionFormat: DataTypes.STRING, // pdf, doc, code, etc.
  instructions: DataTypes.TEXT,
  attachmentPath: DataTypes.STRING,
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'assignments', timestamps: true });

// Assignment Submission Model
const AssignmentSubmission = sequelize.define('AssignmentSubmission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  assignmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'assignments', key: 'id' }
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'students', key: 'id' }
  },
  submissionDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  filePath: DataTypes.STRING,
  originalFileName: DataTypes.STRING,
  fileSize: DataTypes.INTEGER,
  submissionText: DataTypes.TEXT, // For text-based submissions
  isLateSubmission: { type: DataTypes.BOOLEAN, defaultValue: false },
  marks: DataTypes.DECIMAL(5, 2),
  feedback: DataTypes.TEXT,
  gradedBy: {
    type: DataTypes.STRING,
    references: { model: 'faculty', key: 'id' }
  },
  gradedAt: DataTypes.DATE,
  status: {
    type: DataTypes.STRING,
    defaultValue: 'submitted', // submitted, graded, returned
  },
}, { tableName: 'assignment_submissions', timestamps: true });

// Document Approval Model for workflow
const DocumentApproval = sequelize.define('DocumentApproval', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  documentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'documents', key: 'id' }
  },
  submittedBy: {
    type: DataTypes.STRING,
    allowNull: false, // Student roll number
  },
  submittedByType: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'student',
    validate: { isIn: [['student', 'faculty', 'admin']] }
  },
  assignedTo: {
    type: DataTypes.STRING,
    allowNull: false, // Faculty ID who needs to approve
  },
  assignedToType: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'faculty',
    validate: { isIn: [['faculty', 'admin']] }
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending',
    validate: { isIn: [['pending', 'approved', 'rejected', 'needs_revision']] }
  },
  submissionDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  reviewedDate: DataTypes.DATE,
  approverComments: DataTypes.TEXT,
  rejectionReason: DataTypes.TEXT,
  priority: {
    type: DataTypes.STRING,
    defaultValue: 'normal',
    validate: { isIn: [['low', 'normal', 'high', 'urgent']] }
  },
  category: DataTypes.STRING, // academic, certificate, personal, etc.
  dueDate: DataTypes.DATE, // If there's a deadline for review
  notificationSent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  // Metadata
  approvalMetadata: DataTypes.JSON, // Additional data like approval conditions
}, { tableName: 'document_approvals', timestamps: true });

module.exports = {
  sequelize,
  Department,
  Section,
  Subject,
  Student,
  Faculty,
  FacultySubjectAssignment,
  Document,
  DocumentApproval,
  StudentSectionEnrollment,
  Attendance,
  FacultyAttendance,
  Assignment,
  AssignmentSubmission,
  // Add associations after all models are defined
  setupAssociations: () => {
    // Prevent duplicate association setup
    if (Department.associations && Object.keys(Department.associations).length > 0) {
      console.log('Associations already set up, skipping...');
      return;
    }
    
    // Department associations
    Department.hasMany(Section, { foreignKey: 'departmentId', as: 'departmentSections' });
    Department.hasMany(Subject, { foreignKey: 'departmentId', as: 'departmentSubjects' });
    Department.hasMany(Student, { foreignKey: 'departmentId', as: 'departmentStudents' });
    Department.hasMany(Faculty, { foreignKey: 'departmentId', as: 'departmentFaculty' });

    // Section associations
    Section.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });
    Section.hasMany(Student, { foreignKey: 'sectionId', as: 'sectionStudents' });
    Section.belongsTo(Faculty, { foreignKey: 'classAdvisorId', as: 'classAdvisor' });

    // Subject associations
    Subject.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });

    // Student associations
    Student.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });
    Student.belongsTo(Section, { foreignKey: 'sectionId', as: 'section' });

    // Faculty associations
    Faculty.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });
    Faculty.hasOne(Section, { foreignKey: 'classAdvisorId', as: 'advisorSection' });

    // Faculty-Subject assignments
    FacultySubjectAssignment.belongsTo(Faculty, { foreignKey: 'facultyId', as: 'assignmentFaculty' });
    FacultySubjectAssignment.belongsTo(Subject, { foreignKey: 'subjectId', as: 'assignmentSubject' });
    FacultySubjectAssignment.belongsTo(Section, { foreignKey: 'sectionId', as: 'assignmentSection' });

    // Attendance associations
    Attendance.belongsTo(Student, { foreignKey: 'studentId', as: 'attendanceStudent' });
    Attendance.belongsTo(Subject, { foreignKey: 'subjectId', as: 'attendanceSubject' });
    Attendance.belongsTo(Faculty, { foreignKey: 'facultyId', as: 'attendanceFaculty' });
    Attendance.belongsTo(Section, { foreignKey: 'sectionId', as: 'attendanceSection' });

    // Faculty Attendance
    FacultyAttendance.belongsTo(Faculty, { foreignKey: 'facultyId', as: 'facultyAttendanceRecord' });

    // Assignment associations
    Assignment.belongsTo(Subject, { foreignKey: 'subjectId', as: 'assignmentSubject' });
    Assignment.belongsTo(Faculty, { foreignKey: 'facultyId', as: 'assignmentFaculty' });
    Assignment.belongsTo(Section, { foreignKey: 'sectionId', as: 'assignmentSection' });

    // Assignment Submission associations
    AssignmentSubmission.belongsTo(Assignment, { foreignKey: 'assignmentId', as: 'submissionAssignment' });
    AssignmentSubmission.belongsTo(Student, { foreignKey: 'studentId', as: 'submissionStudent' });
    AssignmentSubmission.belongsTo(Faculty, { foreignKey: 'gradedBy', as: 'submissionGrader' });

    // Document Approval associations
    DocumentApproval.belongsTo(Document, { foreignKey: 'documentId', as: 'approvalDocument' });
    Document.hasMany(DocumentApproval, { foreignKey: 'documentId', as: 'documentApprovals' });

    console.log('Database associations set up successfully');
  }
};