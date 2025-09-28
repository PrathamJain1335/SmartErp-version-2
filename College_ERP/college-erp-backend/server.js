const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const http = require('http');
const socketIo = require('socket.io');
const sequelize = require('./config/database');
const { setupAssociations } = require('./models/newModels');
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const facultyRoutes = require('./routes/faculty');
const adminRoutes = require('./routes/admin');
const chatbotRoutes = require('./routes/chatbot');
const assignmentRoutes = require('./routes/assignment');
const resultRoutes = require('./routes/result');
const examRoutes = require('./routes/exam');
const feeRoutes = require('./routes/fee');
const libraryRoutes = require('./routes/library');
const careerRoutes = require('./routes/career');
const feedbackRoutes = require('./routes/feedback');
const attendanceRoutes = require('./routes/attendance');
const studentsRoutes = require('./routes/students');
const facultiesRoutes = require('./routes/faculties');
const facultyAttendanceRoutes = require('./routes/facultyAttendance');
const gradesRoutes = require('./routes/grades');
const profilePhotoRoutes = require('./routes/profilePhotos');
const portfolioRoutes = require('./routes/portfolio');
const documentsRoutes = require('./routes/documents');
const assignmentsRoutes = require('./routes/assignments');
const coursesRoutes = require('./routes/courses');
const notificationsRoutes = require('./routes/notifications');
const timetableRoutes = require('./routes/timetable');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const QRCode = require('qrcode');
const { Sequelize } = require('sequelize');

// Import services
const NotificationService = require('./services/NotificationService');
const AIService = require('./services/HybridAIService'); // xAI Grok + Mock fallback
const AnalyticsService = require('./services/AnalyticsService');
const DataSyncService = require('./services/DataSyncService');

// Set up database associations immediately
setupAssociations();
console.log('🔗 Database associations configured at startup');

// Small delay to ensure associations are properly set up
setTimeout(() => {
  console.log('⚡ Associations setup complete, ready for routes');
}, 100);

// Load environment variables as the very first thing
require('dotenv').config();

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Socket.IO setup with CORS
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Enhanced Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());
app.use(cors({
  origin: (origin, callback) => {
    const allowed = new Set([
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'http://localhost:5174'
    ].filter(Boolean));
    if (!origin || allowed.has(origin)) return callback(null, true);
    return callback(null, true);
  },
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Enhanced rate limiting
const limiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased for real-time features
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// File Upload Setup
const upload = multer({
  storage: multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
  }),
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('PDF only'));
  },
});
app.use('/uploads', express.static('uploads'));

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);
  
  // Join user to their role-specific room
  socket.on('join-portal', (data) => {
    const { userId, role, sections, department } = data;
    
    // Join role-based room
    socket.join(`${role}-portal`);
    
    // Join user-specific room
    socket.join(`user-${userId}`);
    
    // For faculty, join section-specific rooms
    if (role === 'faculty' && sections) {
      sections.forEach(section => {
        socket.join(`section-${section}`);
      });
    }
    
    // Join department room
    if (department) {
      socket.join(`dept-${department}`);
    }
    
    console.log(`✅ User ${userId} joined ${role} portal`);
  });
  
  // Handle real-time updates
  socket.on('update-attendance', (data) => {
    // Broadcast to relevant portals
    io.to('admin-portal').emit('attendance-updated', data);
    io.to('faculty-portal').emit('attendance-updated', data);
    io.to(`section-${data.section}`).emit('attendance-updated', data);
  });
  
  socket.on('update-grades', (data) => {
    io.to('admin-portal').emit('grades-updated', data);
    io.to(`user-${data.studentId}`).emit('grades-updated', data);
  });
  
  socket.on('send-notification', (data) => {
    if (data.targetRole) {
      io.to(`${data.targetRole}-portal`).emit('new-notification', data);
    }
    if (data.targetUsers) {
      data.targetUsers.forEach(userId => {
        io.to(`user-${userId}`).emit('new-notification', data);
      });
    }
  });
  
  socket.on('faculty-attendance-update', (data) => {
    io.to('admin-portal').emit('faculty-attendance-updated', data);
    io.to(`user-${data.facultyId}`).emit('faculty-attendance-updated', data);
  });
  
  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);

// Initialize services
const notificationService = new NotificationService(io);
const aiService = new AIService(process.env.XAI_API_KEY);
const analyticsService = new AnalyticsService();
const dataSyncService = new DataSyncService(io);

// Make services available to routes
app.set('notificationService', notificationService);
app.set('aiService', aiService);
app.set('analyticsService', analyticsService);
app.set('dataSyncService', dataSyncService);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/faculties', facultyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/faculties', facultiesRoutes);
app.use('/api/faculty-attendance', facultyAttendanceRoutes);
app.use('/api/grades', gradesRoutes);
app.use('/api/profile-photos', profilePhotoRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/assignments', assignmentsRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/timetable', timetableRoutes);

// Test route
app.get('/api/test', (req, res) => res.json({ message: 'Backend Working!' }));

// Email setup for notifications
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Scheduled notifications (Daily at 9 AM IST, which is 3:30 AM UTC)
cron.schedule('30 3 * * *', () => {
  // Example: Fetch students with pending fees or assignments and send reminders
  // For demo, log it
  console.log('Sending scheduled reminders...');
  // transporter.sendMail({ to: 'student@email.com', subject: 'Reminder', text: 'Your fee is due!' });
}, { timezone: 'Asia/Kolkata' });

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '2.0.0',
    features: {
      aiEnabled: !!process.env.XAI_API_KEY,
      realTimeEnabled: true,
      databaseConnected: true
    }
  });
});

// Start server with Socket.IO
const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully!');
    
    // Setup new model associations
    setupAssociations();
    console.log('🔗 Model associations configured!');
    
    // Don't sync models - use the existing database structure
    console.log('📊 Using existing database structure!');
    
  } catch (err) {
    console.error('❌ Database connection failed:', err);
  }
  
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🤖 AI Features: ${process.env.XAI_API_KEY ? 'Enabled with xAI Grok' : 'Disabled'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`⚡ Socket.IO: Enabled`);
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      details: err.errors
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid token'
    });
  }
  
  if (err.name === 'SequelizeError') {
    return res.status(500).json({
      error: 'Database Error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Database operation failed'
    });
  }
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist'
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    sequelize.close().then(() => {
      console.log('✅ Database connection closed');
      process.exit(0);
    });
  });
});

module.exports = { app, io, server };
