# API Testing Examples

This file contains example API calls to test the College ERP Backend functionality.

## Authentication

### Login (Student)
```bash
curl -X POST http://localhost:5173/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "student123",
    "role": "student"
  }'
```

### Login (Faculty)
```bash
curl -X POST http://localhost:5173/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "faculty@example.com",
    "password": "faculty123",
    "role": "faculty"
  }'
```

### Login (Admin)
```bash
curl -X POST http://localhost:5173/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@jecrc.ac.in",
    "password": "admin123",
    "role": "admin"
  }'
```

## Student APIs

### Get Student Profile
```bash
curl -X GET http://localhost:5173/api/students/details \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get AI Study Recommendations
```bash
curl -X GET http://localhost:5173/api/students/ai/study-recommendations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Performance Prediction
```bash
curl -X GET http://localhost:5173/api/students/ai/performance-prediction \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Generate Study Plan
```bash
curl -X POST http://localhost:5173/api/students/ai/study-plan \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "examDate": "2025-12-15",
    "subjects": ["Mathematics", "Physics", "Computer Science"],
    "dailyHours": 4,
    "learningStyle": "visual"
  }'
```

### Generate Quiz
```bash
curl -X POST http://localhost:5173/api/students/ai/generate-quiz \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "subject": "Computer Science",
    "topics": ["Data Structures", "Algorithms"],
    "difficulty": "medium",
    "count": 5
  }'
```

## Faculty APIs

### Get Faculty Profile
```bash
curl -X GET http://localhost:5173/api/faculties/details \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Assigned Students
```bash
curl -X GET http://localhost:5173/api/faculties/students \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Teaching Insights
```bash
curl -X GET http://localhost:5173/api/faculties/ai/teaching-insights \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Grade Assignment with AI
```bash
curl -X POST http://localhost:5173/api/faculties/ai/grade-assignment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "assignmentText": "This is a sample assignment submission about data structures...",
    "rubric": "Clarity: 25%, Correctness: 50%, Creativity: 25%",
    "studentId": "STU001"
  }'
```

### Get Student Performance Analysis
```bash
curl -X GET http://localhost:5173/api/faculties/ai/student-performance/STU001 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Class Analytics
```bash
curl -X GET http://localhost:5173/api/faculties/analytics/class-performance \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Admin APIs

### Get Dashboard Statistics
```bash
curl -X GET http://localhost:5173/api/admin/dashboard/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get All Students (with filters)
```bash
curl -X GET "http://localhost:5173/api/admin/students?department=Computer Science&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get All Faculty
```bash
curl -X GET http://localhost:5173/api/admin/faculty \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get AI Institutional Analytics
```bash
curl -X GET http://localhost:5173/api/admin/ai/institutional-analytics \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Performance Reports
```bash
curl -X GET "http://localhost:5173/api/admin/reports/performance?department=Computer Science" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create New Student
```bash
curl -X POST http://localhost:5173/api/admin/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "Student_ID": "STU999",
    "Full_Name": "John Doe",
    "Email_ID": "john.doe@example.com",
    "Department": "Computer Science",
    "Semester": 1,
    "password": "hashed_password"
  }'
```

### Update Student
```bash
curl -X PUT http://localhost:5173/api/admin/students/STU999 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "Full_Name": "John Smith",
    "Semester": 2
  }'
```

### Get System Health
```bash
curl -X GET http://localhost:5173/api/admin/system/health \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## AI Chatbot APIs

### Chat with AI Assistant
```bash
curl -X POST http://localhost:5173/api/chatbot/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "message": "What are my upcoming assignments?"
  }'
```

### Get Chat History
```bash
curl -X GET http://localhost:5173/api/chatbot/history \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Chat Suggestions
```bash
curl -X GET http://localhost:5173/api/chatbot/suggestions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Contextual Help
```bash
curl -X POST http://localhost:5173/api/chatbot/contextual-help \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "context": "assignments",
    "activity": "viewing assignment list"
  }'
```

### Clear Chat History
```bash
curl -X DELETE http://localhost:5173/api/chatbot/history \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Utility Endpoints

### Health Check
```bash
curl -X GET http://localhost:5173/api/test
```

### Server Status
```bash
curl -X GET http://localhost:5173/api/admin/system/health \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## File Upload Example (Assignment Submission)

```bash
curl -X POST http://localhost:5173/api/students/assignments/submit \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "assignmentId=1" \
  -F "file=@/path/to/your/assignment.pdf"
```

## Testing with Postman

Import this collection into Postman:

```json
{
  "info": {
    "name": "College ERP API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Login Student",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"student@example.com\",\n  \"password\": \"student123\",\n  \"role\": \"student\"\n}"
            },
            "url": "{{baseUrl}}/api/auth/login"
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5173"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

## Environment Variables for Testing

Create a test environment file `.env.test`:

```env
PORT=5174
DB_HOST=localhost
DB_USER=postgres
DB_PASS=testpassword
DB_NAME=erp_test
DB_PORT=5432
JWT_SECRET=test_jwt_secret
OPENAI_API_KEY=your_test_openai_key
EMAIL_USER=test@gmail.com
EMAIL_PASS=testpassword
```

## Common Response Formats

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
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

### Validation Error
```json
{
  "errors": [
    {
      "type": "field",
      "msg": "Invalid value",
      "path": "email",
      "location": "body"
    }
  ]
}
```

## Notes

1. Replace `YOUR_JWT_TOKEN` with the actual token received from login
2. Replace `STU001` with actual student IDs from your database
3. Ensure PostgreSQL is running and accessible
4. Make sure OpenAI API key is valid and has sufficient credits
5. All file uploads should be PDF format and under 4MB
6. Rate limiting is applied - avoid making too many requests quickly