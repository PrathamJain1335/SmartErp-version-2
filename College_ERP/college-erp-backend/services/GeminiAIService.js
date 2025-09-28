const { GoogleGenerativeAI } = require("@google/generative-ai");

class GeminiAIService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.enabled = false;
    this.model = null;
    
    if (!apiKey) {
      console.warn('⚠️ Gemini API key not provided. Using fallback responses.');
      return;
    }
    
    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      // Use the confirmed working model first, then fallbacks
      this.modelNames = [
        "models/gemini-2.5-flash-preview-05-20", // Working model!
        "models/gemini-2.5-flash",
        "models/gemini-2.5-pro",
        "models/gemini-2.0-flash",
        "models/gemini-flash-latest",
        "models/gemini-pro-latest",
        "gemini-1.5-flash",
        "gemini-1.5-pro"
      ];
      
      // We'll test the model when first used
      console.log('🤖 Gemini AI Service initialized (will test on first use)');
    } catch (error) {
      console.warn('⚠️ Failed to initialize Gemini AI:', error.message);
    }
    
    // ERP-specific context and knowledge base
    this.erpContext = `
You are an AI assistant specifically designed for a College ERP (Enterprise Resource Planning) system. 
You have access to and can help with the following areas:

STUDENT MANAGEMENT:
- Attendance tracking and analysis
- Academic performance monitoring
- Grade predictions and trends
- Course enrollment and scheduling
- Fee management and payment tracking
- Disciplinary records and behavioral analysis

FACULTY MANAGEMENT:
- Faculty attendance and performance
- Course assignments and scheduling
- Student evaluation and grading
- Research and publication tracking
- Leave management

ADMINISTRATIVE FUNCTIONS:
- Reports and analytics generation
- Notification management
- Resource allocation
- Academic calendar management
- Examination scheduling

ANALYTICS & PREDICTIONS:
- Attendance pattern analysis
- Academic risk assessment
- Placement probability analysis
- Performance trend predictions
- Resource utilization optimization

IMPORTANT GUIDELINES:
1. Only provide information and assistance related to the College ERP system
2. Do not answer questions outside the ERP domain
3. Always base responses on the provided data context
4. Provide actionable insights and recommendations
5. Maintain student and faculty privacy
6. Be professional and educational in tone
7. Be helpful and conversational while maintaining professionalism

If asked about topics unrelated to the ERP system, politely redirect the conversation back to ERP-related matters.
`;

  }
  
  // Test and initialize a working model
  async initializeWorkingModel() {
    if (this.enabled || !this.genAI) return this.enabled;
    
    for (const modelName of this.modelNames) {
      try {
        console.log(`🔍 Testing Gemini model: ${modelName}`);
        const testModel = this.genAI.getGenerativeModel({ model: modelName });
        
        // Test with a simple prompt
        const result = await testModel.generateContent("Hello");
        await result.response;
        
        this.model = testModel;
        this.enabled = true;
        console.log(`✅ Gemini model ${modelName} is working!`);
        return true;
        
      } catch (error) {
        console.log(`❌ Model ${modelName} failed: ${error.message.substring(0, 100)}`);
      }
    }
    
    console.warn('⚠️ No working Gemini models found. Using fallback responses.');
    return false;
  }

  // Check if AI service is enabled
  isEnabled() {
    return this.enabled;
  }

  // ERP-specific chatbot responses with real data using Gemini
  async getChatbotResponse(message, userContext = {}) {
    const { userId, role, context } = userContext;
    
    // Try to initialize working model if not done yet
    if (!this.enabled && this.genAI) {
      await this.initializeWorkingModel();
    }
    
    // Use fallback responses if Gemini is not available
    if (!this.enabled) {
      return this.getFallbackResponse(message, userContext);
    }

    try {
      // Get real user data based on role
      const realUserData = await this.getRealUserData(userId, role);
      
      const enhancedSystemPrompt = `${this.erpContext}

You are responding to a ${role} with the following REAL data from the ERP system:
${JSON.stringify(realUserData, null, 2)}

IMPORTANT INSTRUCTIONS:
1. Use the REAL data provided above in your responses
2. Provide specific, actionable information based on actual records
3. If asked about attendance, grades, or other metrics, reference the actual numbers
4. Only answer ERP-related questions
5. Be conversational but professional
6. If the user asks about data not provided, explain what data is available

User Role: ${role}
Query Context: ${context || 'general'}

User Question: ${message}`;

      const result = await this.model.generateContent(enhancedSystemPrompt);
      const response = await result.response;
      return response.text();

    } catch (error) {
      console.error('Gemini API Error:', error);
      // Disable service and use fallbacks for future requests
      this.enabled = false;
      return this.getFallbackResponse(message, userContext);
    }
  }
  
  // Fallback responses when Gemini API is not available
  getFallbackResponse(message, userContext = {}) {
    const { role = 'user', context } = userContext;
    const lowerMessage = message.toLowerCase();
    
    // Role-specific responses
    if (role === 'student') {
      if (lowerMessage.includes('attendance')) {
        return "I can help you check your attendance records. Your current attendance information is available in the Student Portal under the Attendance section. Would you like me to guide you there?";
      }
      if (lowerMessage.includes('grade') || lowerMessage.includes('result')) {
        return "You can view your grades and results in the Grades & Results section of the Student Portal. This includes your semester-wise performance and CGPA calculations.";
      }
      if (lowerMessage.includes('fee') || lowerMessage.includes('payment')) {
        return "For fee-related queries, please check the Fee Management section in your Student Portal. You can view fee structure, make payments, and download receipts there.";
      }
      if (lowerMessage.includes('assignment')) {
        return "Your assignments are available in the Assignment Portal. You can view pending assignments, submit your work, and check submission status there.";
      }
    } else if (role === 'faculty') {
      if (lowerMessage.includes('student') && lowerMessage.includes('attendance')) {
        return "You can view and manage student attendance in the Faculty Portal. Access the Attendance Management section to mark attendance and generate reports.";
      }
      if (lowerMessage.includes('grade') || lowerMessage.includes('grading')) {
        return "Grade management is available in the Faculty Portal under Grades & Evaluation. You can enter grades, generate report cards, and track student performance.";
      }
    } else if (role === 'admin') {
      if (lowerMessage.includes('report') || lowerMessage.includes('analytics')) {
        return "Administrative reports and analytics are available in the Admin Dashboard. You can generate various reports including attendance, performance, and system usage statistics.";
      }
    }
    
    // General ERP responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return `Hello! I'm your ERP Assistant. I can help you with ${role === 'student' ? 'student-related queries like attendance, grades, fees, and assignments' : role === 'faculty' ? 'faculty tasks like attendance management, grading, and student evaluation' : 'administrative tasks and system management'}. How can I assist you today?`;
    }
    
    if (lowerMessage.includes('help')) {
      return `I can assist you with various ERP functions including:\n• Navigation and feature guidance\n• Attendance and academic records\n• Fee management and payments\n• Assignment submissions\n• Report generation\n\nWhat specific area would you like help with?`;
    }
    
    if (lowerMessage.includes('navigate') || lowerMessage.includes('portal')) {
      return `I can help you navigate the ERP system. The main sections available are:\n• Dashboard (overview)\n• Attendance Management\n• Grades & Results\n• Fee Management\n• Assignment Portal\n• Reports & Analytics\n\nWhich section would you like to access?`;
    }
    
    // Default fallback
    return `I'm here to help with your ERP system queries! I can assist with attendance, grades, fees, assignments, and general navigation. Please let me know what specific information you need, and I'll guide you to the right section.\n\n*Note: AI-powered responses are temporarily unavailable, but I can still help you navigate the system.*`;
  }
  
  // Get real user data for chatbot context
  async getRealUserData(userId, role) {
    try {
      const { Student, Faculty, Attendance, Course, Enrollment } = require('../models');
      const { Op } = require('sequelize');
      
      if (role === 'student') {
        // Try to find student by primary key (id) or by Student_ID (roll number)
        let student = null;
        
        // First try by primary key if userId is numeric
        if (!isNaN(userId)) {
          student = await Student.findByPk(parseInt(userId), {
            attributes: ['id', 'Student_ID', 'Full_Name', 'Department', 'Section', 'Semester', 
                        'Total_Classes', 'Attended_Classes', 'Attendance_%', 'Internal_Marks', 
                        'Practical_Marks', 'Mid_Sem_Marks', 'End_Sem_Marks', 'Grade'],
            include: [
              {
                model: Enrollment,
                where: { status: 'active' },
                required: false,
                include: [{
                  model: Course,
                  attributes: ['courseName', 'courseCode', 'credits']
                }]
              }
            ]
          });
        }
        
        // If not found or userId is not numeric, try by Student_ID (roll number)
        if (!student) {
          student = await Student.findOne({
            where: { Student_ID: userId },
            attributes: ['id', 'Student_ID', 'Full_Name', 'Department', 'Section', 'Semester', 
                        'Total_Classes', 'Attended_Classes', 'Attendance_%', 'Internal_Marks', 
                        'Practical_Marks', 'Mid_Sem_Marks', 'End_Sem_Marks', 'Grade'],
            include: [
              {
                model: Enrollment,
                where: { status: 'active' },
                required: false,
                include: [{
                  model: Course,
                  attributes: ['courseName', 'courseCode', 'credits']
                }]
              }
            ]
          });
        }
        
        if (!student) return { error: 'Student not found' };
        
        // Get recent attendance (last 30 days) using the actual database ID
        const recentAttendance = await Attendance.findAll({
          where: {
            studentId: student.id, // Use the database ID, not the roll number
            date: {
              [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          },
          limit: 10,
          order: [['date', 'DESC']]
        });
        
        return {
          profile: {
            id: student.Student_ID,
            name: student.Full_Name,
            department: student.Department,
            section: student.Section,
            semester: student.Semester
          },
          academic: {
            totalClasses: student.Total_Classes,
            attendedClasses: student.Attended_Classes,
            attendancePercentage: student['Attendance_%'],
            internalMarks: student.Internal_Marks,
            practicalMarks: student.Practical_Marks,
            midSemMarks: student.Mid_Sem_Marks,
            endSemMarks: student.End_Sem_Marks,
            currentGrade: student.Grade
          },
          courses: student.Enrollments?.map(e => ({
            name: e.Course?.courseName,
            code: e.Course?.courseCode,
            credits: e.Course?.credits
          })) || [],
          recentAttendance: recentAttendance.map(a => ({
            date: a.date,
            status: a.status
          }))
        };
      } else if (role === 'faculty') {
        // Faculty model uses Faculty_ID as primary key in the old models
        const faculty = await Faculty.findOne({
          where: { Faculty_ID: userId },
          attributes: ['Faculty_ID', 'Full_Name', 'Department', 'Designation', 
                      'assignedSections', 'assignedDepartments', 'Subjects_Assigned'],
          include: [
            {
              model: Course,
              attributes: ['courseName', 'courseCode', 'credits']
            }
          ]
        });
        
        if (!faculty) return { error: 'Faculty not found' };
        
        // Get assigned students count
        let assignedStudentsCount = 0;
        if (faculty.assignedSections?.length > 0) {
          assignedStudentsCount = await Student.count({
            where: {
              Section: {
                [Op.in]: faculty.assignedSections
              }
            }
          });
        }
        
        return {
          profile: {
            id: faculty.Faculty_ID,
            name: faculty.Full_Name,
            department: faculty.Department,
            designation: faculty.Designation
          },
          assignments: {
            sections: faculty.assignedSections || [],
            departments: faculty.assignedDepartments || [],
            subjects: faculty.Subjects_Assigned,
            studentCount: assignedStudentsCount
          },
          courses: faculty.Courses?.map(c => ({
            name: c.courseName,
            code: c.courseCode,
            credits: c.credits
          })) || []
        };
      }
      
      return { error: 'User type not supported' };
    } catch (error) {
      console.error('Error getting real user data:', error);
      return { error: 'Data retrieval failed' };
    }
  }

  // Analyze student attendance patterns with real database data using Gemini
  async analyzeAttendancePatterns(studentId) {
    if (!this.enabled) return null;

    try {
      const { Student, Attendance, Course } = require('../models');
      const { Op } = require('sequelize');
      
      // Get student details - handle both numeric ID and Student_ID
      let student = null;
      if (!isNaN(studentId)) {
        student = await Student.findByPk(parseInt(studentId), {
          attributes: ['id', 'Student_ID', 'Full_Name', 'Department', 'Section', 'Semester']
        });
      }
      if (!student) {
        student = await Student.findOne({
          where: { Student_ID: studentId },
          attributes: ['id', 'Student_ID', 'Full_Name', 'Department', 'Section', 'Semester']
        });
      }
      
      if (!student) {
        throw new Error('Student not found');
      }
      
      // Get attendance records for the last 3 months
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      
      const attendanceRecords = await Attendance.findAll({
        where: {
          studentId: student.id, // Use the database ID, not the roll number
          date: {
            [Op.gte]: threeMonthsAgo
          }
        },
        include: [{
          model: Course,
          attributes: ['courseName', 'courseCode']
        }],
        order: [['date', 'ASC']]
      });
      
      // Calculate attendance statistics
      const totalClasses = attendanceRecords.length;
      const presentClasses = attendanceRecords.filter(record => record.status === 'present').length;
      const currentPercentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;
      
      // Get recent trends (last 4 weeks vs previous 4 weeks)
      const fourWeeksAgo = new Date();
      fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
      const eightWeeksAgo = new Date();
      eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);
      
      const recentRecords = attendanceRecords.filter(record => 
        new Date(record.date) >= fourWeeksAgo
      );
      const previousRecords = attendanceRecords.filter(record => 
        new Date(record.date) >= eightWeeksAgo && new Date(record.date) < fourWeeksAgo
      );
      
      const recentPercentage = recentRecords.length > 0 ? 
        (recentRecords.filter(r => r.status === 'present').length / recentRecords.length) * 100 : 0;
      const previousPercentage = previousRecords.length > 0 ? 
        (previousRecords.filter(r => r.status === 'present').length / previousRecords.length) * 100 : 0;
      
      // Prepare data for AI analysis
      const analysisData = {
        student: {
          id: student.Student_ID,
          name: student.Full_Name,
          department: student.Department,
          section: student.Section,
          semester: student.Semester
        },
        attendance: {
          totalClasses,
          presentClasses,
          currentPercentage: parseFloat(currentPercentage.toFixed(2)),
          recentPercentage: parseFloat(recentPercentage.toFixed(2)),
          previousPercentage: parseFloat(previousPercentage.toFixed(2)),
          trend: recentPercentage > previousPercentage ? 'improving' : 
                recentPercentage < previousPercentage ? 'declining' : 'stable'
        },
        patterns: this.identifyAttendancePatterns(attendanceRecords)
      };

      const prompt = `Analyze the following REAL student attendance data:
      
${JSON.stringify(analysisData, null, 2)}

Based on this actual data, provide:
1. Attendance trends and patterns
2. Risk assessment (low/medium/high)
3. Specific recommendations for improvement
4. Predicted attendance for next month
5. Intervention strategies if needed

Format as JSON with the following structure:
{
  "trend": "improving/declining/stable",
  "riskLevel": "low/medium/high",
  "currentPercentage": number,
  "predictedPercentage": number,
  "patterns": ["pattern1", "pattern2"],
  "recommendations": ["rec1", "rec2"],
  "interventions": ["intervention1", "intervention2"]
}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return JSON.parse(response.text());

    } catch (error) {
      console.error('Attendance analysis error:', error);
      return null;
    }
  }

  // Helper method to identify attendance patterns
  identifyAttendancePatterns(attendanceRecords) {
    const patterns = [];
    
    // Day-of-week pattern analysis
    const dayCounts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    const dayAbsent = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    
    attendanceRecords.forEach(record => {
      const dayOfWeek = new Date(record.date).getDay();
      dayCounts[dayOfWeek]++;
      if (record.status !== 'present') {
        dayAbsent[dayOfWeek]++;
      }
    });
    
    // Find days with high absence rates
    Object.keys(dayAbsent).forEach(day => {
      if (dayCounts[day] > 0) {
        const absentRate = (dayAbsent[day] / dayCounts[day]) * 100;
        if (absentRate > 30) {
          const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          patterns.push(`High absence rate on ${dayNames[day]}s (${absentRate.toFixed(1)}%)`);
        }
      }
    });
    
    // Consecutive absence pattern
    let consecutiveAbsences = 0;
    let maxConsecutive = 0;
    
    attendanceRecords.forEach(record => {
      if (record.status !== 'present') {
        consecutiveAbsences++;
        maxConsecutive = Math.max(maxConsecutive, consecutiveAbsences);
      } else {
        consecutiveAbsences = 0;
      }
    });
    
    if (maxConsecutive >= 3) {
      patterns.push(`Tendency for consecutive absences (max: ${maxConsecutive} days)`);
    }
    
    return patterns.length > 0 ? patterns : ['No significant patterns detected'];
  }

  // Predict academic performance with real data using Gemini
  async predictAcademicPerformance(studentId) {
    if (!this.enabled) return null;

    try {
      const { Student, Enrollment, Course, Attendance } = require('../models');
      const { Op } = require('sequelize');
      
      // Get student with academic data - handle both numeric ID and Student_ID
      let student = null;
      const studentQuery = {
        include: [
          {
            model: Enrollment,
            where: { status: 'active' },
            required: false,
            include: [{
              model: Course,
              attributes: ['courseName', 'courseCode', 'credits', 'semester']
            }]
          },
          {
            model: Attendance,
            where: {
              date: {
                [Op.gte]: new Date(new Date().getFullYear(), 0, 1) // This year
              }
            },
            required: false,
            include: [{
              model: Course,
              attributes: ['courseName', 'courseCode']
            }]
          }
        ]
      };
      
      if (!isNaN(studentId)) {
        student = await Student.findByPk(parseInt(studentId), studentQuery);
      }
      if (!student) {
        student = await Student.findOne({ 
          where: { Student_ID: studentId },
          ...studentQuery 
        });
      }
      
      if (!student) {
        throw new Error('Student not found');
      }
      
      // Calculate current academic metrics
      const academicData = {
        student: {
          id: student.Student_ID,
          name: student.Full_Name,
          semester: student.Semester,
          department: student.Department
        },
        currentGrades: {
          internal: student.Internal_Marks || 0,
          practical: student.Practical_Marks || 0,
          midSem: student.Mid_Sem_Marks || 0,
          endSem: student.End_Sem_Marks || 0,
          currentGrade: student.Grade || 'N/A'
        },
        attendance: {
          totalClasses: student.Total_Classes || 0,
          attendedClasses: student.Attended_Classes || 0,
          percentage: student['Attendance_%'] || 0
        },
        enrolledCourses: student.Enrollments?.map(enrollment => ({
          course: enrollment.Course?.courseName || 'Unknown',
          code: enrollment.Course?.courseCode || 'N/A',
          credits: enrollment.Course?.credits || 0,
          currentGrade: enrollment.finalGrade || 'In Progress',
          finalMarks: enrollment.finalMarks || null
        })) || [],
        attendanceHistory: student.Attendances?.length || 0
      };
      
      const prompt = `Analyze the following REAL student academic data and predict performance:
      
${JSON.stringify(academicData, null, 2)}

Based on this actual academic data, provide:
1. Current performance assessment
2. Predicted final grades for each subject
3. Overall CGPA prediction
4. Risk factors identification
5. Improvement strategies

Format as JSON with the following structure:
{
  "currentCGPA": number,
  "predictedCGPA": number,
  "riskLevel": "low/medium/high",
  "subjectPredictions": [
    {"subject": "name", "currentGrade": "A", "predictedGrade": "A", "confidence": 85}
  ],
  "riskFactors": ["factor1", "factor2"],
  "recommendations": ["rec1", "rec2"],
  "confidenceScore": number
}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return JSON.parse(response.text());

    } catch (error) {
      console.error('Academic prediction error:', error);
      return null;
    }
  }

  // Analyze placement probability using Gemini
  async analyzePlacementProbability(studentData) {
    if (!this.enabled) return null;

    try {
      const prompt = `Analyze student data for placement probability:
      
${JSON.stringify(studentData, null, 2)}

Please provide:
1. Overall placement probability percentage
2. Suitable company types and roles
3. Skill gaps analysis
4. Improvement recommendations
5. Timeline for placement readiness

Format as JSON:
{
  "placementProbability": number,
  "tier": "top-tier/high/medium/low",
  "suitableRoles": ["role1", "role2"],
  "suitableCompanies": ["type1", "type2"],
  "skillGaps": [
    {"skill": "name", "currentLevel": "low/medium/high", "requiredLevel": "high", "priority": "critical/high/medium"}
  ],
  "recommendations": ["rec1", "rec2"],
  "timelineMonths": number,
  "confidenceScore": number
}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return JSON.parse(response.text());

    } catch (error) {
      console.error('Placement analysis error:', error);
      return null;
    }
  }

  // Generate behavior analysis using Gemini
  async analyzeBehaviorPattern(disciplinaryData) {
    if (!this.enabled) return null;

    try {
      const prompt = `Analyze student behavioral data:
      
${JSON.stringify(disciplinaryData, null, 2)}

Please provide:
1. Behavior pattern analysis
2. Risk assessment
3. Intervention recommendations
4. Predicted incidents in next 30 days
5. Success factors

Format as JSON:
{
  "behaviorScore": number,
  "riskLevel": "low/medium/high",
  "patterns": ["pattern1", "pattern2"],
  "predictedIncidents": number,
  "timeframe": "next 30 days",
  "interventions": [
    {"type": "counseling/mentoring/support", "effectiveness": number, "priority": "high/medium/low"}
  ],
  "recommendations": ["rec1", "rec2"],
  "confidenceScore": number
}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return JSON.parse(response.text());

    } catch (error) {
      console.error('Behavior analysis error:', error);
      return null;
    }
  }

  // Generate intelligent report summaries using Gemini
  async generateReportSummary(reportData, reportType) {
    if (!this.enabled) return null;

    try {
      const prompt = `Generate an executive summary for the following ${reportType} report data:
      
${JSON.stringify(reportData, null, 2)}

Please provide:
1. Key findings and insights
2. Trends and patterns
3. Critical issues requiring attention
4. Actionable recommendations
5. Predicted outcomes

Keep the summary professional, concise, and actionable.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();

    } catch (error) {
      console.error('Report summary error:', error);
      return null;
    }
  }

  // Generate personalized recommendations using Gemini
  async generatePersonalizedRecommendations(userRole, userData, context) {
    if (!this.enabled) return [];

    try {
      const prompt = `Generate personalized recommendations for a ${userRole} in the College ERP system:
      
User Data: ${JSON.stringify(userData, null, 2)}
Context: ${context}

Please provide 3-5 specific, actionable recommendations based on the data and role.
Format as JSON array: ["recommendation1", "recommendation2", ...]`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return JSON.parse(response.text());

    } catch (error) {
      console.error('Recommendations error:', error);
      return [];
    }
  }

  // Check if query is ERP-related using Gemini
  async isERPRelated(query) {
    if (!this.enabled) return true; // Default to true if AI is disabled

    try {
      const prompt = `Determine if the following query is related to a College ERP system:
      
Query: "${query}"

Consider these ERP areas: student management, faculty management, attendance, grades, fees, courses, examinations, library, placement, analytics, reports, notifications.

Respond with only "true" or "false".`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().toLowerCase().includes('true');

    } catch (error) {
      console.error('ERP relevance check error:', error);
      return true; // Default to true on error
    }
  }
}

module.exports = GeminiAIService;