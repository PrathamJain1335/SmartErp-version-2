class MockAIService {
  constructor(apiKey) {
    this.enabled = true; // Always enabled for demo
    console.log('🤖 Mock AI Service initialized (OpenAI quota exceeded - using demo responses)');
  }

  // Check if AI service is enabled
  isEnabled() {
    return this.enabled;
  }

  // Mock chatbot responses with realistic ERP data
  async getChatbotResponse(message, userContext = {}) {
    const { userId, role, context } = userContext;
    const lowerMessage = message.toLowerCase();
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Role-specific responses
    if (role === 'admin') {
      if (lowerMessage.includes('fee') || lowerMessage.includes('payment')) {
        return `📊 **Fee Summary Analysis**

**Overall Fee Collection Status:**
- Total Expected: ₹2,45,60,000
- Collected: ₹2,01,20,000 (82%)
- Pending: ₹44,40,000 (18%)

**Department-wise Breakdown:**
- Computer Science: 92% collected
- Electronics: 85% collected  
- Mechanical: 78% collected
- Civil: 75% collected

**Recent Trends:**
- 15% increase in online payments this month
- 23 students have pending fees > ₹50,000
- Average collection time: 12 days

**Recommendations:**
1. Send automated reminders to pending fee students
2. Offer installment plans for high-pending cases
3. Implement early payment discounts`;
      }
      
      if (lowerMessage.includes('attendance') || lowerMessage.includes('present')) {
        return `📈 **Attendance Overview - Today**

**Overall Attendance:** 87.3%
- Computer Science: 91.2%
- Electronics: 85.6%
- Mechanical: 84.1%
- Civil: 88.7%

**Alerts:**
- 45 students below 75% attendance threshold
- Section CSE-3B has lowest attendance (76.2%)
- 12 faculty members marked late today

**AI Insights:**
- Attendance drops by 15% on Fridays
- Morning sessions have 8% better attendance
- Rainy days show 12% decrease in attendance

**Actions Needed:**
1. Contact parents of low-attendance students
2. Review CSE-3B schedule for issues
3. Consider attendance incentive programs`;
      }
      
      if (lowerMessage.includes('performance') || lowerMessage.includes('grade') || lowerMessage.includes('academic')) {
        return `🎓 **Academic Performance Summary**

**Overall Institution Performance:**
- Average CGPA: 7.23/10
- Students above 8.0 CGPA: 34%
- At-risk students (<6.0): 8%

**Department Rankings:**
1. Computer Science: 7.8 avg CGPA
2. Electronics: 7.4 avg CGPA
3. Civil: 7.1 avg CGPA
4. Mechanical: 6.9 avg CGPA

**Recent Trends:**
- 12% improvement in practical scores
- Mid-sem performance up 8% from last semester
- Programming subjects showing excellent results

**AI Predictions:**
- 15 students at risk of semester failure
- 87 students likely to achieve honors
- Expected placement rate: 76%

**Recommendations:**
1. Provide additional tutoring for at-risk students
2. Implement peer mentoring programs
3. Focus on weak subject areas in Mechanical Dept`;
      }
      
      if (lowerMessage.includes('faculty')) {
        return `👩‍🏫 **Faculty Performance Dashboard**

**Faculty Statistics:**
- Total Faculty: 156
- Average Rating: 4.2/5.0
- Research Publications: 23 this month

**Top Performers:**
- Dr. Priya Sharma (CSE): 4.8/5.0 student rating
- Prof. Raj Kumar (ECE): 4.7/5.0 student rating
- Dr. Anita Singh (ME): 4.6/5.0 student rating

**Areas for Attention:**
- 8 faculty with ratings below 3.5
- 12% increase in student complaints
- 3 departments need additional faculty

**AI Insights:**
- Interactive teaching methods boost ratings by 23%
- Faculty with research activity have higher satisfaction
- Optimal class size: 35-45 students

**Action Items:**
1. Conduct training sessions for low-rated faculty
2. Implement teaching methodology workshops
3. Hire 5 additional faculty members`;
      }
    }
    
    // Student-specific responses
    if (role === 'student') {
      if (lowerMessage.includes('attendance') || lowerMessage.includes('present')) {
        return `📊 **Your Attendance Summary**

**Current Status:** 78.5% (Below 75% minimum)
**Classes Attended:** 157/200
**Classes Missed:** 43

**Subject-wise Breakdown:**
- Data Structures: 85% ✅
- DBMS: 72% ⚠️
- Computer Networks: 67% ❌
- Software Engineering: 81% ✅

**Recent Trend:** Declining (-5% this month)

**⚠️ Alert:** You need 92% attendance in remaining classes to meet 75% requirement.

**Next Steps:**
1. Attend all remaining classes
2. Submit medical certificates for valid absences
3. Meet with academic advisor this week

*Maintaining 75% attendance is mandatory for semester examination eligibility.*`;
      }
      
      if (lowerMessage.includes('grade') || lowerMessage.includes('performance')) {
        return `🎓 **Your Academic Performance**

**Current CGPA:** 7.2/10
**Semester GPA:** 6.8/10

**Subject Performance:**
- Data Structures: A- (8.5/10) 🎉
- DBMS: B+ (7.5/10) ✅
- Computer Networks: C+ (6.0/10) ⚠️
- Software Engineering: B (7.0/10) ✅

**Trend Analysis:** Slight improvement from last semester (+0.3 GPA)

**Strengths:**
- Strong practical skills
- Good in programming subjects
- Regular assignment submissions

**Areas to Focus:**
- Theory subjects need more attention
- Improve exam preparation strategy
- Practice more numerical problems

**Recommendations:**
1. Join study group for Computer Networks
2. Schedule meeting with CN faculty
3. Use library resources more effectively`;
      }
    }
    
    // Faculty-specific responses
    if (role === 'faculty') {
      if (lowerMessage.includes('class') || lowerMessage.includes('student')) {
        return `📚 **Your Class Performance Overview**

**Classes Assigned:** 
- Data Structures (CSE-3A): 45 students
- Algorithm Design (CSE-3B): 42 students
- Research Methodology (CSE-4A): 38 students

**Class Performance:**
- Average attendance: 83.2%
- Average assignment score: 76.8%
- Student satisfaction rating: 4.3/5.0

**Students Needing Attention:**
- 8 students with <75% attendance
- 5 students failing in assignments
- 3 students requested additional help

**Recent Feedback:**
- "Explains concepts very clearly"
- "Need more practical examples"
- "Assignments are challenging but helpful"

**Recommendations:**
1. Schedule remedial classes for weak students
2. Add more real-world examples in lectures
3. Provide additional practice problems`;
      }
    }
    
    // General responses for unmatched queries
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      const roleSpecificHelp = {
        admin: [
          "📊 Generate performance and attendance reports",
          "💰 Track fee collection and financial analytics", 
          "👥 Monitor faculty and student statistics",
          "📈 Provide predictive analytics and insights",
          "🔔 Set up automated notifications and alerts"
        ],
        student: [
          "📊 Check your attendance and academic performance",
          "📚 View assignment due dates and grades", 
          "💰 Check fee payment status and dues",
          "📅 Get your class schedule and exam timetable",
          "📈 Track your academic progress trends"
        ],
        faculty: [
          "👥 View your class attendance and performance",
          "📝 Track student assignment submissions",
          "📊 Generate class performance reports", 
          "📅 Manage your teaching schedule",
          "💬 Get student feedback summaries"
        ]
      };
      
      const capabilities = roleSpecificHelp[role] || roleSpecificHelp.student;
      return `🤖 **ERP Assistant - ${role.toUpperCase()} Portal**

I can help you with:

${capabilities.map(item => `• ${item}`).join('\n')}

**How to use:**
- Ask specific questions about your data
- Request reports and analytics
- Get insights and recommendations
- Check status of various ERP modules

**Examples:**
- "Show my attendance summary"
- "What's the fee collection status?"
- "Which students need attention?"
- "Generate this month's performance report"

Just ask me anything related to the College ERP system!`;
    }
    
    // Default response for unrecognized queries
    return `🤖 I understand you're asking about "${message}". 

As your ERP assistant, I can help with:
- Academic performance analysis
- Attendance tracking and reports  
- Fee management and collection status
- Faculty and student analytics
- Predictive insights and recommendations

Please ask me something specific about:
📊 Reports & Analytics  |  👥 Student/Faculty Data  |  💰 Fee Management  |  📈 Performance Trends

*Example: "Show attendance report" or "What's my academic performance?"*`;
  }

  // Mock attendance analysis
  async analyzeAttendancePatterns(studentId) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      trend: "declining",
      riskLevel: "medium", 
      currentPercentage: 78.5,
      predictedPercentage: 72.0,
      patterns: [
        "High absence rate on Fridays (45%)",
        "Tendency for consecutive absences (max: 4 days)",
        "Better attendance in morning sessions"
      ],
      recommendations: [
        "Attend all remaining classes to improve percentage",
        "Submit medical certificates for valid absences", 
        "Join study groups to stay motivated",
        "Set phone reminders for class schedules"
      ],
      interventions: [
        "Schedule meeting with academic advisor",
        "Enable parent notification for absences",
        "Provide attendance tracking mobile app"
      ]
    };
  }

  // Mock academic performance prediction
  async predictAcademicPerformance(studentId) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      currentCGPA: 7.2,
      predictedCGPA: 7.0,
      riskLevel: "low",
      subjectPredictions: [
        { subject: "Data Structures", currentGrade: "B+", predictedGrade: "A-", confidence: 85 },
        { subject: "DBMS", currentGrade: "B", predictedGrade: "B+", confidence: 78 },
        { subject: "Computer Networks", currentGrade: "C+", predictedGrade: "B-", confidence: 70 },
        { subject: "Software Engineering", currentGrade: "B", predictedGrade: "B+", confidence: 82 }
      ],
      riskFactors: [
        "Attendance below 75% in Computer Networks",
        "Weak performance in theory-based subjects"
      ],
      recommendations: [
        "Focus more on Computer Networks theory",
        "Practice numerical problems regularly",
        "Join peer study groups for theory subjects",
        "Improve attendance to meet minimum requirements"
      ],
      confidenceScore: 78
    };
  }

  // Mock placement probability analysis
  async analyzePlacementProbability(studentData) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      placementProbability: 73,
      tier: "medium",
      suitableRoles: ["Software Developer", "System Analyst", "Technical Support Engineer"],
      suitableCompanies: ["Service-based IT companies", "Product startups", "Government IT roles"],
      skillGaps: [
        { skill: "Advanced Programming", currentLevel: "medium", requiredLevel: "high", priority: "high" },
        { skill: "System Design", currentLevel: "low", requiredLevel: "high", priority: "critical" },
        { skill: "Communication Skills", currentLevel: "medium", requiredLevel: "high", priority: "medium" }
      ],
      recommendations: [
        "Complete advanced programming certification",
        "Practice system design problems",
        "Join technical interview preparation bootcamp",
        "Improve soft skills through presentations"
      ],
      timelineMonths: 6,
      confidenceScore: 78
    };
  }

  // Mock report summary generation
  async generateReportSummary(reportData, reportType) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return `📊 **${reportType.toUpperCase()} REPORT SUMMARY**

**KEY FINDINGS:**
• Overall performance trending positively with 15% improvement over last quarter
• Attendance rates stabilized at 87.3% institution-wide
• Fee collection efficiency improved to 82% with digital payment adoption

**CRITICAL INSIGHTS:**
• Computer Science department leading in academic performance (7.8 avg CGPA)
• 23 students identified as at-risk requiring immediate intervention
• Faculty satisfaction scores up 12% following recent training programs

**ACTION REQUIRED:**
• Implement remedial programs for underperforming students
• Address infrastructure needs in Mechanical Engineering department  
• Continue digital transformation initiatives for better efficiency

**PREDICTED OUTCOMES:**
• Expected 8% improvement in overall results by semester end
• Placement rate projected to reach 76% based on current trends
• Fee collection likely to achieve 95% with proposed strategies

*This AI-generated summary is based on real-time ERP data analysis.*`;
  }

  // Mock personalized recommendations
  async generatePersonalizedRecommendations(userRole, userData, context) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const recommendations = {
      admin: [
        "Schedule quarterly faculty performance reviews to maintain teaching standards",
        "Implement automated fee reminder system to improve collection rates",
        "Launch student mentorship program to reduce dropout risk by 15%",
        "Upgrade laboratory equipment in Mechanical Engineering for better practical scores",
        "Deploy mobile attendance app to increase attendance tracking accuracy"
      ],
      faculty: [
        "Conduct weekly doubt-clearing sessions for students scoring below average",
        "Use interactive teaching methods to improve student engagement by 20%",
        "Submit research paper draft to increase departmental publication count", 
        "Attend upcoming pedagogy workshop on modern teaching techniques",
        "Implement project-based learning for better practical understanding"
      ],
      student: [
        "Attend at least 95% of remaining classes to meet minimum attendance requirement",
        "Join Computer Networks study group to improve theoretical understanding",
        "Complete pending assignments before next week's deadline",
        "Schedule meeting with placement officer to discuss career preparation",
        "Practice coding problems daily to strengthen programming skills"
      ]
    };
    
    return recommendations[userRole] || recommendations.student;
  }

  // Mock ERP relevance check
  async isERPRelated(query) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const erpKeywords = [
      'student', 'faculty', 'attendance', 'grades', 'fee', 'course', 'exam', 'assignment',
      'library', 'placement', 'performance', 'report', 'analytics', 'notification',
      'schedule', 'timetable', 'department', 'semester', 'cgpa', 'marks', 'result'
    ];
    
    return erpKeywords.some(keyword => 
      query.toLowerCase().includes(keyword)
    );
  }
}

module.exports = MockAIService;