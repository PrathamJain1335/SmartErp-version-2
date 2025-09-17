const axios = require('axios');

class XAIService {
  constructor(apiKey) {
    if (!apiKey) {
      console.warn('⚠️ xAI API key not provided. AI features will be disabled.');
      this.enabled = false;
      return;
    }
    
    this.apiKey = apiKey;
    this.baseURL = 'https://api.x.ai/v1';
    this.enabled = true;
    
    // ERP-specific context and knowledge base
    this.erpContext = `
You are Grok, an AI assistant specifically designed for a College ERP (Enterprise Resource Planning) system. 
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
7. Use your wit and humor appropriately while maintaining professionalism

If asked about topics unrelated to the ERP system, politely redirect the conversation back to ERP-related matters.
`;

    console.log('🤖 xAI Service initialized with Grok integration');
  }

  // Check if AI service is enabled
  isEnabled() {
    return this.enabled;
  }

  // Make HTTP request to xAI API
  async makeRequest(endpoint, data) {
    try {
      const response = await axios.post(`${this.baseURL}${endpoint}`, data, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      });
      return response.data;
    } catch (error) {
      console.error('xAI API Error:', error.response?.data || error.message);
      throw error;
    }
  }

  // ERP-specific chatbot responses with real data using Grok
  async getChatbotResponse(message, userContext = {}) {
    if (!this.enabled) {
      return "AI features are currently disabled. Please contact your system administrator.";
    }

    try {
      const { userId, role, context } = userContext;
      
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
5. Be conversational but professional, with a touch of Grok's wit when appropriate
6. If the user asks about data not provided, explain what data is available

User Role: ${role}
Query Context: ${context || 'general'}`;

      const completion = await this.makeRequest('/chat/completions', {
        model: "grok-beta",
        messages: [
          {
            role: "system",
            content: enhancedSystemPrompt
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 600,
        temperature: 0.7,
        stream: false
      });

      return completion.choices[0].message.content;

    } catch (error) {
      console.error('xAI API Error:', error);
      if (error.response?.status === 401) {
        return "Authentication failed with xAI API. Please check your API key configuration.";
      } else if (error.response?.status === 429) {
        return "xAI API rate limit exceeded. Please try again in a moment.";
      } else if (error.code === 'ECONNABORTED') {
        return "Request timed out. The AI service is taking longer than expected.";
      }
      return "I'm having trouble accessing your ERP data right now. Please try again later or contact support.";
    }
  }
  
  // Get real user data for chatbot context
  async getRealUserData(userId, role) {
    try {
      const { Student, Faculty, Attendance, Course, Enrollment } = require('../models');
      const { Op } = require('sequelize');
      
      if (role === 'student') {
        const student = await Student.findByPk(userId, {
          attributes: ['Student_ID', 'Full_Name', 'Department', 'Section', 'Semester', 
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
        
        if (!student) return { error: 'Student not found' };
        
        // Get recent attendance (last 30 days)
        const recentAttendance = await Attendance.findAll({
          where: {
            studentId: userId,
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
        const faculty = await Faculty.findByPk(userId, {
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

  // Analyze student attendance patterns with real database data using Grok
  async analyzeAttendancePatterns(studentId) {
    if (!this.enabled) return null;

    try {
      const { Student, Attendance, Course } = require('../models');
      const { Op } = require('sequelize');
      
      // Get student details
      const student = await Student.findByPk(studentId, {
        attributes: ['id', 'Student_ID', 'Full_Name', 'Department', 'Section', 'Semester']
      });
      
      if (!student) {
        throw new Error('Student not found');
      }
      
      // Get attendance records for the last 3 months
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      
      const attendanceRecords = await Attendance.findAll({
        where: {
          studentId: studentId,
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

      const prompt = `Analyze the following REAL student attendance data using your analytical capabilities:
      
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

      const completion = await this.makeRequest('/chat/completions', {
        model: "grok-beta",
        messages: [
          { role: "system", content: "You are Grok, an expert education data analyst specializing in attendance pattern analysis." },
          { role: "user", content: prompt }
        ],
        max_tokens: 800,
        temperature: 0.3
      });

      return JSON.parse(completion.choices[0].message.content);

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

  // Predict academic performance with real data using Grok
  async predictAcademicPerformance(studentId) {
    if (!this.enabled) return null;

    try {
      const { Student, Enrollment, Course, Attendance } = require('../models');
      const { Op } = require('sequelize');
      
      // Get student with academic data
      const student = await Student.findByPk(studentId, {
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
      });
      
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
      
      const prompt = `Analyze the following REAL student academic data and predict performance using your analytical capabilities:
      
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

      const completion = await this.makeRequest('/chat/completions', {
        model: "grok-beta",
        messages: [
          { role: "system", content: "You are Grok, an expert educational analyst specializing in academic performance prediction." },
          { role: "user", content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.3
      });

      return JSON.parse(completion.choices[0].message.content);

    } catch (error) {
      console.error('Academic prediction error:', error);
      return null;
    }
  }

  // Analyze placement probability using Grok
  async analyzePlacementProbability(studentData) {
    if (!this.enabled) return null;

    try {
      const prompt = `Analyze student data for placement probability using your analytical capabilities:
      
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

      const completion = await this.makeRequest('/chat/completions', {
        model: "grok-beta",
        messages: [
          { role: "system", content: "You are Grok, an expert career counselor and placement analyst." },
          { role: "user", content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.3
      });

      return JSON.parse(completion.choices[0].message.content);

    } catch (error) {
      console.error('Placement analysis error:', error);
      return null;
    }
  }

  // Generate behavior analysis using Grok
  async analyzeBehaviorPattern(disciplinaryData) {
    if (!this.enabled) return null;

    try {
      const prompt = `Analyze student behavioral data using your analytical capabilities:
      
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

      const completion = await this.makeRequest('/chat/completions', {
        model: "grok-beta",
        messages: [
          { role: "system", content: "You are Grok, an expert behavioral analyst specializing in student conduct assessment." },
          { role: "user", content: prompt }
        ],
        max_tokens: 800,
        temperature: 0.3
      });

      return JSON.parse(completion.choices[0].message.content);

    } catch (error) {
      console.error('Behavior analysis error:', error);
      return null;
    }
  }

  // Generate intelligent report summaries using Grok
  async generateReportSummary(reportData, reportType) {
    if (!this.enabled) return null;

    try {
      const prompt = `Generate an executive summary for the following ${reportType} report data using your analytical wit:
      
${JSON.stringify(reportData, null, 2)}

Please provide:
1. Key findings and insights
2. Trends and patterns
3. Critical issues requiring attention
4. Actionable recommendations
5. Predicted outcomes

Keep the summary professional, concise, and actionable, with a touch of Grok's analytical insight.`;

      const completion = await this.makeRequest('/chat/completions', {
        model: "grok-beta",
        messages: [
          { role: "system", content: "You are Grok, an expert data analyst specializing in educational institution reporting." },
          { role: "user", content: prompt }
        ],
        max_tokens: 600,
        temperature: 0.4
      });

      return completion.choices[0].message.content;

    } catch (error) {
      console.error('Report summary error:', error);
      return null;
    }
  }

  // Generate personalized recommendations using Grok
  async generatePersonalizedRecommendations(userRole, userData, context) {
    if (!this.enabled) return [];

    try {
      const prompt = `Generate personalized recommendations for a ${userRole} in the College ERP system using your analytical capabilities:
      
User Data: ${JSON.stringify(userData, null, 2)}
Context: ${context}

Please provide 3-5 specific, actionable recommendations based on the data and role.
Format as JSON array: ["recommendation1", "recommendation2", ...]`;

      const completion = await this.makeRequest('/chat/completions', {
        model: "grok-beta",
        messages: [
          { role: "system", content: "You are Grok, an expert educational advisor providing personalized recommendations." },
          { role: "user", content: prompt }
        ],
        max_tokens: 400,
        temperature: 0.5
      });

      return JSON.parse(completion.choices[0].message.content);

    } catch (error) {
      console.error('Recommendations error:', error);
      return [];
    }
  }

  // Check if query is ERP-related using Grok
  async isERPRelated(query) {
    if (!this.enabled) return true; // Default to true if AI is disabled

    try {
      const prompt = `Determine if the following query is related to a College ERP system:
      
Query: "${query}"

Consider these ERP areas: student management, faculty management, attendance, grades, fees, courses, examinations, library, placement, analytics, reports, notifications.

Respond with only "true" or "false".`;

      const completion = await this.makeRequest('/chat/completions', {
        model: "grok-beta",
        messages: [
          { role: "system", content: "You are Grok, a classification system that determines if queries are related to College ERP systems." },
          { role: "user", content: prompt }
        ],
        max_tokens: 10,
        temperature: 0.1
      });

      return completion.choices[0].message.content.toLowerCase().includes('true');

    } catch (error) {
      console.error('ERP relevance check error:', error);
      return true; // Default to true on error
    }
  }
}

module.exports = XAIService;