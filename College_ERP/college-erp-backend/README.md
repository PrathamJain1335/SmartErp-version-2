# College ERP Backend - Enhanced with AI & Real-time Features 🚀

> **Version 2.0** - Now with AI-powered analytics, real-time notifications, and enhanced faculty management!

A comprehensive Enterprise Resource Planning (ERP) system for colleges with integrated AI features including chatbot, performance prediction, study recommendations, and institutional analytics.

## 🚀 Features

### Core ERP Features
- **Student Management**: Complete student lifecycle management
- **Faculty Management**: Faculty profiles, course assignments, and performance tracking
- **Assignment System**: Assignment submission and tracking
- **Attendance Management**: Real-time attendance tracking and reporting
- **Result Management**: Grade management and performance analytics
- **Course Management**: Course catalog and enrollment system

### AI-Powered Features
- **Smart Chatbot**: Role-based AI assistant for students, faculty, and admin
- **Study Recommendations**: Personalized study plans and recommendations
- **Performance Prediction**: AI-powered academic performance forecasting
- **Assignment Analysis**: Automated assignment grading assistance
- **Teaching Insights**: AI-generated teaching strategy recommendations
- **Institutional Analytics**: Comprehensive analytics for strategic decision making
- **Quiz Generation**: AI-generated quizzes and assessments

### System Features
- **Role-based Access Control**: Secure authentication for students, faculty, and admin
- **Real-time Notifications**: System-wide notification system
- **File Upload System**: Secure file handling for assignments and documents
- **API Rate Limiting**: Protection against API abuse
- **Comprehensive Logging**: System monitoring and audit trails
- **RESTful APIs**: Well-documented API endpoints

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **AI Integration**: OpenAI API (GPT-3.5-turbo)
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Email**: Nodemailer
- **Scheduling**: Node-cron
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express-validator

## 📋 Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- OpenAI API Key
- Gmail Account (for email notifications)

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   cd college-erp-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   PORT=5173
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASS=your_password
   DB_NAME=erp_data
   DB_PORT=5432
   JWT_SECRET=your_jwt_secret_key
   OPENAI_API_KEY=your_openai_api_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

4. **Database Setup**
   - Create PostgreSQL database named `erp_data`
   - Ensure your existing student and faculty tables are in place
   - Run database sync:
   ```bash
   npm run db:sync
   ```

5. **Start the server**
   ```bash
   # Production
   npm start
   
   # Development (with nodemon)
   npm run dev
   ```

## 📊 Database Schema

### Core Tables
- **student**: Student information and academic records
- **faculty**: Faculty profiles and assignments
- **assignments**: Assignment submissions and tracking
- **notifications**: System-wide notifications
- **ai_interactions**: AI feature usage tracking
- **system_logs**: Comprehensive system logging
- **courses**: Course catalog
- **enrollments**: Student-course enrollments
- **attendance_records**: Attendance tracking

### Key Relationships
- Students have many assignments, enrollments, attendance records
- Faculty have many courses and can mark attendance
- Courses belong to faculty and have many enrolled students

## 🔐 API Authentication

All protected endpoints require JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### User Roles
- **student**: Access to personal academic data and AI features
- **faculty**: Access to teaching tools and student analytics
- **admin**: Full system access and institutional analytics

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile

### Student APIs
- `GET /api/students/details` - Get student profile
- `GET /api/students/assignments` - Get assignments
- `POST /api/students/assignments/submit` - Submit assignment
- `GET /api/students/ai/study-recommendations` - Get AI study recommendations
- `GET /api/students/ai/performance-prediction` - Get performance prediction
- `POST /api/students/ai/study-plan` - Generate study plan
- `POST /api/students/ai/generate-quiz` - Generate quiz
- `POST /api/students/ai/analyze-assignment` - Analyze assignment

### Faculty APIs
- `GET /api/faculties/details` - Get faculty profile
- `GET /api/faculties/students` - Get assigned students
- `GET /api/faculties/ai/teaching-insights` - Get teaching insights
- `POST /api/faculties/ai/grade-assignment` - AI grading assistance
- `GET /api/faculties/ai/student-performance/:studentId` - Student analysis
- `POST /api/faculties/ai/generate-quiz` - Generate quiz
- `GET /api/faculties/analytics/class-performance` - Class analytics

### Admin APIs
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/students` - Get all students (with filters)
- `GET /api/admin/faculty` - Get all faculty (with filters)
- `GET /api/admin/ai/institutional-analytics` - AI institutional insights
- `GET /api/admin/reports/performance` - Performance reports
- `POST /api/admin/students` - Create student
- `POST /api/admin/faculty` - Create faculty
- `PUT /api/admin/students/:id` - Update student
- `PUT /api/admin/faculty/:id` - Update faculty
- `GET /api/admin/system/health` - System health check

### AI Chatbot APIs
- `POST /api/chatbot/chat` - Chat with AI assistant
- `GET /api/chatbot/history` - Get conversation history
- `DELETE /api/chatbot/history` - Clear chat history
- `GET /api/chatbot/suggestions` - Get quick response suggestions
- `POST /api/chatbot/contextual-help` - Get contextual help
- `GET /api/chatbot/stats` - Chat statistics (admin only)

## 🤖 AI Features Integration

### OpenAI Integration
The system uses OpenAI's GPT-3.5-turbo model for:
- Natural language conversations
- Study recommendations generation
- Performance analysis and predictions
- Assignment evaluation
- Teaching insights
- Institutional analytics

### AI Service Features
1. **Chat Response Generation**: Role-based conversational AI
2. **Study Recommendations**: Personalized academic guidance
3. **Assignment Analysis**: Automated feedback and scoring
4. **Performance Prediction**: Academic outcome forecasting
5. **Teaching Insights**: Data-driven teaching recommendations
6. **Institutional Analytics**: Strategic institutional insights
7. **Quiz Generation**: Automated assessment creation

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Granular permissions by user type
- **Rate Limiting**: API abuse protection
- **Input Validation**: Comprehensive request validation
- **Helmet Security**: HTTP headers security
- **CORS Configuration**: Cross-origin request handling
- **File Upload Security**: Safe file handling with restrictions

## 📊 Monitoring & Logging

- **System Logs**: Comprehensive request/response logging
- **AI Interaction Tracking**: Usage analytics for AI features
- **Performance Monitoring**: Response time and error tracking
- **Health Checks**: System status monitoring

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Docker (Optional)
```dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Run tests (configure test framework)
npm test

# Health check endpoint
GET /api/test
```

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5173 |
| DB_HOST | Database host | localhost |
| DB_USER | Database user | postgres |
| DB_PASS | Database password | your_password |
| DB_NAME | Database name | erp_data |
| DB_PORT | Database port | 5432 |
| JWT_SECRET | JWT signing secret | your_secret_key |
| OPENAI_API_KEY | OpenAI API key | sk-... |
| EMAIL_USER | SMTP email user | user@gmail.com |
| EMAIL_PASS | SMTP email password | app_password |

## 🤝 API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": { ... }
}
```

## 📈 Performance Optimization

- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: Efficient database connection management
- **Caching Strategy**: Memory-based caching for frequent data
- **Rate Limiting**: API performance protection
- **Pagination**: Large dataset handling

## 🔧 Maintenance

### Regular Tasks
- Monitor system logs
- Update AI model parameters
- Database backup and maintenance
- Security updates
- Performance monitoring

### Backup Strategy
- Regular database backups
- Environment configuration backups
- File upload backups

## 🆘 Troubleshooting

### Common Issues
1. **Database Connection**: Verify PostgreSQL is running and credentials are correct
2. **OpenAI API**: Check API key validity and rate limits
3. **File Uploads**: Ensure upload directory permissions
4. **Authentication**: Verify JWT secret configuration

### Debug Mode
Set `NODE_ENV=development` for detailed error messages and logging.

## 📞 Support

For technical support or questions:
- Check the logs in `/logs` directory
- Review environment configuration
- Test API endpoints with provided examples
- Monitor system health at `/api/admin/system/health`

## 🔄 Version History

- **v1.0.0**: Initial release with core ERP features
- **v1.1.0**: Added AI integration and chatbot
- **v1.2.0**: Enhanced analytics and reporting
- **v1.3.0**: Improved security and performance

## 📋 TODO

- [ ] Implement Redis for caching
- [ ] Add comprehensive unit tests
- [ ] Set up CI/CD pipeline
- [ ] Add API documentation with Swagger
- [ ] Implement real-time notifications with WebSockets
- [ ] Add multi-language support
- [ ] Implement advanced analytics dashboard

---

**Note**: This system is designed to work with your existing frontend and database structure. Ensure all environment variables are properly configured before starting the server.