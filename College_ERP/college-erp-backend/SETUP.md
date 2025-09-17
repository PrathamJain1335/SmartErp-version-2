# College ERP Backend - Setup Guide

## 🚀 Enhanced Features Overview

This enhanced backend now includes:

- ✅ **OpenAI Integration** - Real AI-powered features using your API key
- ✅ **Real-time Notifications** - Socket.IO for cross-portal communication
- ✅ **Faculty Attendance Management** - Complete attendance system for faculty
- ✅ **AI Analytics** - Predictive analytics for student performance
- ✅ **Cross-portal Data Sync** - Real-time updates across admin, faculty, and student portals
- ✅ **ERP-Specific Chatbot** - AI assistant that only answers ERP-related questions
- ✅ **Role-based Access Control** - Faculty can only see their assigned sections

## 📋 Prerequisites

1. Node.js (v16 or higher)
2. PostgreSQL database
3. OpenAI API Key (required for AI features)
4. Your existing database setup

## 🔧 Installation Steps

### 1. Install Dependencies

```bash
cd college-erp-backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `college-erp-backend` directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=college_erp
DB_USER=your_db_username
DB_PASSWORD=your_db_password

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5177

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRE=7d

# OpenAI Configuration (REQUIRED for AI features)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# Real-time Features
SOCKET_CORS_ORIGIN=http://localhost:5177
```

**IMPORTANT**: Replace `OPENAI_API_KEY` with your actual OpenAI API key.

### 3. Database Setup

The enhanced models will be automatically synced when you start the server:

```bash
# Start the server (it will sync database models automatically)
npm run server
```

Or manually sync the database:

```bash
npm run db:sync
```

### 4. Start the Enhanced Server

```bash
# Development mode with auto-reload
npm run dev

# Or production mode
npm run server
```

## 🤖 AI Features Setup

### OpenAI API Key Configuration

1. **Get your OpenAI API Key**:
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy the key (starts with `sk-`)

2. **Add to Environment**:
   ```env
   OPENAI_API_KEY=sk-your-actual-key-here
   ```

3. **Verify AI Features**:
   - Visit `http://localhost:5000/api/health`
   - Check that `aiEnabled: true` in the response

## 🔄 Real-time Features

The server now includes Socket.IO for real-time communication:

- **Attendance Updates**: Real-time sync across all portals
- **Grade Updates**: Instant notifications to students
- **Faculty Attendance**: Live updates to admin portal
- **AI Alerts**: Immediate risk notifications
- **System Announcements**: Broadcast to all users

## 🏗️ New API Endpoints

### Attendance Management
- `GET /api/attendance` - Get attendance records with AI analytics
- `POST /api/attendance/mark` - Mark attendance with real-time updates
- `GET /api/attendance/analytics` - AI-powered attendance analytics
- `GET /api/attendance/predictions/:studentId` - AI attendance predictions

### Faculty Attendance
- `GET /api/attendance/faculty` - Faculty attendance records
- `POST /api/attendance/faculty/mark` - Mark faculty attendance

### AI-Powered Analytics
- All existing endpoints now include AI insights
- Real-time data processing
- Predictive analytics integration

## 🔐 Role-Based Access Control

Faculty users now have restricted access based on their assigned sections:

```javascript
// Faculty can only see students from their assigned sections
const facultySections = faculty.assignedSections; // Array of section IDs
// Students filtered automatically based on faculty.assignedSections
```

## 📱 Frontend Integration

Update your frontend to connect to the real-time features:

```javascript
// In your frontend components
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

// Join portal-specific room
socket.emit('join-portal', {
  userId: currentUser.id,
  role: currentUser.role,
  sections: currentUser.assignedSections, // For faculty
  department: currentUser.department
});

// Listen for real-time updates
socket.on('attendance-updated', (data) => {
  // Handle attendance updates
});

socket.on('new-notification', (notification) => {
  // Handle notifications
});

socket.on('ai-alert', (alert) => {
  // Handle AI alerts
});
```

## 🧪 Testing the System

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "OK",
  "features": {
    "aiEnabled": true,
    "realTimeEnabled": true,
    "databaseConnected": true
  }
}
```

### 2. Test AI Features
```bash
# Test chatbot (requires authentication)
curl -X POST http://localhost:5000/api/chatbot/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"message": "What is my attendance percentage?"}'
```

### 3. Test Real-time Features
- Open multiple browser tabs with different portals
- Mark attendance in faculty portal
- Observe real-time updates in admin and student portals

## 🚨 Troubleshooting

### AI Features Not Working
1. Verify OpenAI API key is correct
2. Check internet connection
3. Ensure you have OpenAI credits
4. Check server logs for OpenAI errors

### Real-time Features Not Working
1. Verify FRONTEND_URL in .env
2. Check CORS configuration
3. Ensure Socket.IO client is properly connected
4. Check browser console for connection errors

### Database Issues
1. Verify database credentials
2. Ensure PostgreSQL is running
3. Check database permissions
4. Run `npm run db:sync` to sync models

## 📊 Monitoring

The enhanced backend includes comprehensive logging:

```bash
# View server logs
tail -f logs/app.log

# Monitor real-time connections
# Check server console for Socket.IO connection logs
```

## 🔄 Data Migration

If you have existing data, the enhanced models will automatically add new columns:

- `Student` table: Added AI analytics fields
- `Faculty` table: Added attendance tracking fields
- New tables: `FacultyAttendance`, `AIAnalytics`, `Notifications`

## 🎯 Next Steps

1. **Configure your OpenAI API key**
2. **Start the enhanced server**
3. **Update frontend to use real-time features**
4. **Test all AI functionalities**
5. **Monitor system performance**

Your College ERP system is now powered by real AI features and real-time communication! 🚀

For support, check the server logs and ensure all environment variables are properly configured.