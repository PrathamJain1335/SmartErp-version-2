const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/database.js');

const env = process.env.NODE_ENV || 'development';
const sequelize = new Sequelize(config[env]);

// Test database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('✅ Database connection established successfully.');
  })
  .catch(err => {
    console.error('❌ Unable to connect to the database:', err);
  });

// Define Models
const db = {};

// User Model - Enhanced with AI features
db.User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'faculty', 'student'),
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profilePicture: {
    type: DataTypes.STRING
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastLogin: {
    type: DataTypes.DATE
  },
  aiPreferences: {
    type: DataTypes.JSON,
    defaultValue: {
      enablePredictions: true,
      notificationLevel: 'medium',
      analyticsVisibility: 'detailed'
    }
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['email'] },
    { fields: ['role'] }
  ]
});

// Student Model - Enhanced with AI analytics
db.Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    references: { model: 'Users', key: 'id' }
  },
  rollNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  section: {
    type: DataTypes.STRING,
    allowNull: false
  },
  batch: {
    type: DataTypes.STRING,
    allowNull: false
  },
  admissionDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  guardianName: {
    type: DataTypes.STRING
  },
  guardianContact: {
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.TEXT
  },
  cgpa: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.0
  },
  // AI Analytics Fields
  attendanceRisk: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'low'
  },
  academicRisk: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'low'
  },
  placementProbability: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.0
  },
  behaviorScore: {
    type: DataTypes.DECIMAL(3, 1),
    defaultValue: 5.0
  },
  aiInsights: {
    type: DataTypes.JSON,
    defaultValue: {
      strengths: [],
      improvements: [],
      predictions: {}
    }
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['rollNumber'] },
    { fields: ['department', 'semester', 'section'] },
    { fields: ['attendanceRisk'] },
    { fields: ['academicRisk'] }
  ]
});

// Faculty Model - Enhanced with section management
db.Faculty = sequelize.define('Faculty', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    references: { model: 'Users', key: 'id' }
  },
  employeeId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: false
  },
  specialization: {
    type: DataTypes.STRING
  },
  joiningDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  contact: {
    type: DataTypes.STRING
  },
  // Faculty sections access
  assignedSections: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  subjects: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  // Faculty attendance tracking
  totalWorkingDays: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  presentDays: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  attendancePercentage: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.0
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['employeeId'] },
    { fields: ['department'] }
  ]
});

// Attendance Model - Enhanced with AI analytics
db.Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  studentId: {
    type: DataTypes.INTEGER,
    references: { model: 'Students', key: 'id' }
  },
  subjectId: {
    type: DataTypes.INTEGER,
    references: { model: 'Subjects', key: 'id' }
  },
  facultyId: {
    type: DataTypes.INTEGER,
    references: { model: 'Faculty', key: 'id' }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('present', 'absent', 'late'),
    allowNull: false
  },
  markedBy: {
    type: DataTypes.INTEGER,
    references: { model: 'Faculty', key: 'id' }
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  // AI Pattern Recognition
  isPatternAnomaly: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  riskScore: {
    type: DataTypes.DECIMAL(3, 1),
    defaultValue: 0.0
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['studentId', 'date'] },
    { fields: ['subjectId', 'date'] },
    { fields: ['date'] },
    { fields: ['isPatternAnomaly'] }
  ]
});

// Faculty Attendance Model
db.FacultyAttendance = sequelize.define('FacultyAttendance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  facultyId: {
    type: DataTypes.INTEGER,
    references: { model: 'Faculty', key: 'id' },
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  checkInTime: {
    type: DataTypes.TIME
  },
  checkOutTime: {
    type: DataTypes.TIME
  },
  status: {
    type: DataTypes.ENUM('present', 'absent', 'leave', 'half_day'),
    allowNull: false
  },
  markedBy: {
    type: DataTypes.INTEGER,
    references: { model: 'Users', key: 'id' }
  },
  leaveType: {
    type: DataTypes.ENUM('sick', 'casual', 'earned', 'maternity', 'other')
  },
  remarks: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['facultyId', 'date'] },
    { fields: ['date'] },
    { fields: ['status'] }
  ]
});

// Subject Model
db.Subject = sequelize.define('Subject', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  credits: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  facultyId: {
    type: DataTypes.INTEGER,
    references: { model: 'Faculty', key: 'id' }
  }
}, {
  timestamps: true
});

// Grades Model - Enhanced with AI predictions
db.Grade = sequelize.define('Grade', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  studentId: {
    type: DataTypes.INTEGER,
    references: { model: 'Students', key: 'id' }
  },
  subjectId: {
    type: DataTypes.INTEGER,
    references: { model: 'Subjects', key: 'id' }
  },
  examType: {
    type: DataTypes.ENUM('assignment', 'quiz', 'midterm', 'final', 'project'),
    allowNull: false
  },
  marks: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  maxMarks: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  grade: {
    type: DataTypes.STRING
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  // AI Predictions
  predictedGrade: {
    type: DataTypes.STRING
  },
  improvementSuggestions: {
    type: DataTypes.JSON,
    defaultValue: []
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['studentId', 'semester'] },
    { fields: ['subjectId'] }
  ]
});

// Notifications Model - Enhanced for cross-portal
db.Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('info', 'warning', 'success', 'error', 'ai_alert'),
    defaultValue: 'info'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  targetRole: {
    type: DataTypes.ENUM('all', 'admin', 'faculty', 'student'),
    defaultValue: 'all'
  },
  targetUsers: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isAIGenerated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  data: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  expiresAt: {
    type: DataTypes.DATE
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['targetRole'] },
    { fields: ['type'] },
    { fields: ['isAIGenerated'] }
  ]
});

// AI Analytics Model
db.AIAnalytics = sequelize.define('AIAnalytics', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.ENUM('attendance_prediction', 'grade_prediction', 'placement_analysis', 'behavior_analysis'),
    allowNull: false
  },
  studentId: {
    type: DataTypes.INTEGER,
    references: { model: 'Students', key: 'id' }
  },
  data: {
    type: DataTypes.JSON,
    allowNull: false
  },
  predictions: {
    type: DataTypes.JSON,
    allowNull: false
  },
  confidence: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'archived'),
    defaultValue: 'active'
  },
  validUntil: {
    type: DataTypes.DATE
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['type'] },
    { fields: ['studentId'] },
    { fields: ['status'] }
  ]
});

// Chatbot Conversations Model
db.ChatbotConversation = sequelize.define('ChatbotConversation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    references: { model: 'Users', key: 'id' }
  },
  sessionId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  messages: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  context: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  satisfaction: {
    type: DataTypes.INTEGER // 1-5 rating
  }
}, {
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['sessionId'] },
    { fields: ['isActive'] }
  ]
});

// Define Associations
db.User.hasOne(db.Student, { foreignKey: 'userId' });
db.Student.belongsTo(db.User, { foreignKey: 'userId' });

db.User.hasOne(db.Faculty, { foreignKey: 'userId' });
db.Faculty.belongsTo(db.User, { foreignKey: 'userId' });

db.Student.hasMany(db.Attendance, { foreignKey: 'studentId' });
db.Attendance.belongsTo(db.Student, { foreignKey: 'studentId' });

db.Faculty.hasMany(db.Attendance, { foreignKey: 'facultyId' });
db.Attendance.belongsTo(db.Faculty, { foreignKey: 'facultyId' });

db.Subject.hasMany(db.Attendance, { foreignKey: 'subjectId' });
db.Attendance.belongsTo(db.Subject, { foreignKey: 'subjectId' });

db.Faculty.hasMany(db.FacultyAttendance, { foreignKey: 'facultyId' });
db.FacultyAttendance.belongsTo(db.Faculty, { foreignKey: 'facultyId' });

db.Student.hasMany(db.Grade, { foreignKey: 'studentId' });
db.Grade.belongsTo(db.Student, { foreignKey: 'studentId' });

db.Subject.hasMany(db.Grade, { foreignKey: 'subjectId' });
db.Grade.belongsTo(db.Subject, { foreignKey: 'subjectId' });

db.Student.hasMany(db.AIAnalytics, { foreignKey: 'studentId' });
db.AIAnalytics.belongsTo(db.Student, { foreignKey: 'studentId' });

db.User.hasMany(db.ChatbotConversation, { foreignKey: 'userId' });
db.ChatbotConversation.belongsTo(db.User, { foreignKey: 'userId' });

// Export database and Sequelize instance
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;