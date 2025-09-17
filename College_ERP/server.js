const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const socketIo = require('socket.io');
const http = require('http');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const facultyRoutes = require('./routes/faculty');
const adminRoutes = require('./routes/admin');
const attendanceRoutes = require('./routes/attendance');
const notificationRoutes = require('./routes/notifications');
const aiRoutes = require('./routes/ai');
const reportsRoutes = require('./routes/reports');
const chatbotRoutes = require('./routes/chatbot');

// Import middleware
const authMiddleware = require('./middleware/auth');
const socketMiddleware = require('./middleware/socket');

// Import services
const NotificationService = require('./services/NotificationService');
const AIService = require('./services/AIService');

const app = express();
const server = http.createServer(app);

// Socket.IO setup with CORS
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5177",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());
app.use(morgan('combined'));
app.use(limiter);
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5177",
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static file serving
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '2.0.0'
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Join user to their role-specific room
  socket.on('join-portal', (data) => {
    const { userId, role, sections } = data;
    
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
    
    console.log(`User ${userId} joined ${role} portal`);
  });
  
  // Handle real-time updates
  socket.on('update-attendance', (data) => {
    // Broadcast to relevant portals
    io.to('admin-portal').emit('attendance-updated', data);
    io.to('faculty-portal').emit('attendance-updated', data);
    io.to(`section-${data.section}`).emit('attendance-updated', data);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);

// Initialize services
const notificationService = new NotificationService(io);
const aiService = new AIService(process.env.OPENAI_API_KEY);

// Make services available to routes
app.set('notificationService', notificationService);
app.set('aiService', aiService);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', authMiddleware, studentRoutes);
app.use('/api/faculty', authMiddleware, facultyRoutes);
app.use('/api/admin', authMiddleware, adminRoutes);
app.use('/api/attendance', authMiddleware, attendanceRoutes);
app.use('/api/notifications', authMiddleware, notificationRoutes);
app.use('/api/ai', authMiddleware, aiRoutes);
app.use('/api/reports', authMiddleware, reportsRoutes);
app.use('/api/chatbot', authMiddleware, chatbotRoutes);

// Error handling middleware
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
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist'
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🤖 AI Features: ${process.env.OPENAI_API_KEY ? 'Enabled' : 'Disabled'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5177'}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

module.exports = { app, io, server };