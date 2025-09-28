# JECRC University ERP - Login Credentials Reference

## 🚀 Server Status
✅ Backend server is running on `http://localhost:5000`
✅ Authentication API is working correctly
✅ Database is seeded with test data

## 👨‍🎓 Student Login Credentials
All students use password: `student123`

### Login Methods:
1. **Email Format**: `firstName.lastName.year.semester@jecrc.ac.in`
2. **Roll Number Format**: `JECRC-[DEPT]-[YEAR]-[NUMBER]`

### Sample Student Credentials:
| Name | Email | Roll Number | Password |
|------|-------|-------------|----------|
| Suresh Shah | suresh.shah.21.1@jecrc.ac.in | JECRC-CSE-21-001 | student123 |
| Priya Agarwal | priya.agarwal.21.2@jecrc.ac.in | JECRC-CSE-21-002 | student123 |
| Rahul Sharma | rahul.sharma.21.3@jecrc.ac.in | JECRC-CSE-21-003 | student123 |

### Departments Available:
- CSE (Computer Science Engineering)
- ECE (Electronics & Communication Engineering)
- ME (Mechanical Engineering)
- CE (Civil Engineering)
- EE (Electrical Engineering)

## 👩‍🏫 Faculty Login Credentials
All faculty use password: `faculty123`

### Login Method:
**Email Format**: `firstName.lastName[number]@jecrc.ac.in`

### Sample Faculty Credentials:
| Name | Email | Employee ID | Password |
|------|-------|-------------|----------|
| Kavya Sharma | kavya.sharma1@jecrc.ac.in | CSE-FAC-001 | faculty123 |
| Amit Patel | amit.patel2@jecrc.ac.in | CSE-FAC-002 | faculty123 |
| Sneha Gupta | sneha.gupta3@jecrc.ac.in | ECE-FAC-003 | faculty123 |

## 🔧 API Testing

### Login Endpoint
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "identifier": "email@jecrc.ac.in OR rollNumber",
  "password": "student123 OR faculty123",
  "role": "student OR faculty"
}
```

### Successful Response Format:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "JWT_TOKEN_HERE",
  "user": {
    "name": "User Name",
    "email": "user@jecrc.ac.in",
    "rollNo": "JECRC-CSE-21-001", // for students
    "employeeId": "CSE-FAC-001",   // for faculty
    "department": "JECRC University",
    "designation": "Student/Faculty Designation"
  }
}
```

### Error Response Examples:
- **401**: Invalid credentials
- **400**: Missing required fields
- **500**: Server error

## 📊 Database Stats
- **Students**: 500 records across all departments
- **Faculty**: 50 records across all departments
- **Departments**: 5 departments with subjects and sections
- **Authentication**: Secure password hashing with bcrypt

## 🛠 Quick Test Commands
```bash
# Test student login with email
node scripts/testLoginAPI.js

# Test error handling
node scripts/testLoginErrors.js

# Get student credentials list
node scripts/getStudentCredentials.js

# Get faculty credentials list
node scripts/getFacultyCredentials.js
```

## 💡 Notes
- All passwords are securely hashed in the database
- JWT tokens are generated for authenticated sessions
- Both email and roll number login work for students
- Faculty can only login with email
- Server includes CORS support for frontend integration
- Socket.IO is enabled for real-time features