const axios = require('axios');

class PortfolioAIService {
  constructor() {
    this.xaiApiKey = process.env.XAI_API_KEY;
    this.enabled = !!this.xaiApiKey;
    
    if (!this.enabled) {
      console.warn('⚠️ Portfolio AI Service disabled - XAI_API_KEY not found');
    } else {
      console.log('🎯 Portfolio AI Service initialized with xAI Grok');
    }
  }

  // Make xAI API request
  async makeXAIRequest(prompt, systemPrompt, options = {}) {
    if (!this.enabled) {
      throw new Error('Portfolio AI Service is disabled - no XAI API key');
    }

    try {
      const response = await axios.post('https://api.x.ai/v1/chat/completions', {
        model: "grok-beta",
        messages: [
          { 
            role: "system", 
            content: systemPrompt || "You are Grok, an expert career counselor and portfolio generator."
          },
          { 
            role: "user", 
            content: prompt 
          }
        ],
        max_tokens: options.maxTokens || 1500,
        temperature: options.temperature || 0.7,
        stream: false
      }, {
        headers: {
          'Authorization': `Bearer ${this.xaiApiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      return response.data;
    } catch (error) {
      console.error('Portfolio AI API Error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Generate comprehensive AI portfolio
  async generateStudentPortfolio(studentData) {
    const systemPrompt = `You are Grok, an expert AI career advisor and portfolio generator specializing in creating professional student portfolios. 

    Create a comprehensive, professional portfolio based on real student data. The portfolio should be:
    1. Professional and industry-ready
    2. Tailored to the student's field and achievements
    3. Highlight strengths and address any gaps
    4. Include concrete examples and metrics
    5. Be compelling to recruiters and employers

    Focus on creating content that showcases the student's potential and readiness for the job market.`;

    const prompt = `Generate a comprehensive AI-powered portfolio for the following student:

STUDENT DATA:
${JSON.stringify(studentData, null, 2)}

Create a professional portfolio with the following sections:

1. PROFESSIONAL SUMMARY (3-4 lines highlighting key strengths)
2. TECHNICAL SKILLS (organized by proficiency level)
3. ACADEMIC ACHIEVEMENTS (with metrics and context)
4. PROJECT PORTFOLIO (suggested projects based on their field)
5. CERTIFICATIONS ROADMAP (recommended certifications)
6. CAREER OBJECTIVES (short and long-term goals)
7. STRENGTHS ANALYSIS (top 5 key strengths)
8. IMPROVEMENT AREAS (constructive feedback)
9. PORTFOLIO OPTIMIZATION TIPS (actionable advice)

Format as JSON with the following structure:
{
  "professionalSummary": "string",
  "technicalSkills": {
    "expert": ["skill1", "skill2"],
    "intermediate": ["skill3", "skill4"],
    "beginner": ["skill5", "skill6"]
  },
  "academicAchievements": [
    {
      "achievement": "string",
      "metric": "string",
      "context": "string"
    }
  ],
  "suggestedProjects": [
    {
      "title": "string",
      "description": "string",
      "technologies": ["tech1", "tech2"],
      "estimatedDuration": "string",
      "difficultyLevel": "beginner/intermediate/advanced"
    }
  ],
  "certificationRoadmap": [
    {
      "certification": "string",
      "provider": "string",
      "priority": "high/medium/low",
      "estimatedTime": "string",
      "justification": "string"
    }
  ],
  "careerObjectives": {
    "shortTerm": "string (6-12 months)",
    "longTerm": "string (2-5 years)"
  },
  "strengthsAnalysis": [
    {
      "strength": "string",
      "evidence": "string",
      "impact": "string"
    }
  ],
  "improvementAreas": [
    {
      "area": "string",
      "currentLevel": "string",
      "targetLevel": "string",
      "actionSteps": ["step1", "step2"]
    }
  ],
  "portfolioOptimizationTips": [
    {
      "category": "string",
      "tip": "string",
      "priority": "high/medium/low"
    }
  ]
}`;

    try {
      const response = await this.makeXAIRequest(prompt, systemPrompt, {
        maxTokens: 2000,
        temperature: 0.6
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Portfolio generation error:', error);
      
      // Fallback to mock data if xAI fails
      return this.generateMockPortfolio(studentData);
    }
  }

  // Generate AI-powered resume content
  async generateResumeContent(studentData, resumeType = 'technical') {
    const systemPrompt = `You are Grok, an expert resume writer specializing in ${resumeType} roles for students and recent graduates.

    Create a professional, ATS-friendly resume content that:
    1. Uses industry-standard formatting and keywords
    2. Quantifies achievements wherever possible
    3. Tailors content to ${resumeType} roles
    4. Follows current resume best practices
    5. Highlights the candidate's unique value proposition`;

    const prompt = `Generate professional resume content for a ${resumeType} role based on this student data:

${JSON.stringify(studentData, null, 2)}

Create resume sections with:
1. PROFESSIONAL SUMMARY (2-3 impactful lines)
2. TECHNICAL SKILLS (relevant to ${resumeType} roles)
3. EDUCATION (with relevant coursework and achievements)
4. EXPERIENCE (internships, projects, or relevant activities)
5. PROJECTS (with technologies and impact)
6. ACHIEVEMENTS (academic, technical, or leadership)
7. KEYWORDS (industry-relevant terms for ATS optimization)

Format as JSON:
{
  "professionalSummary": "string",
  "technicalSkills": ["skill1", "skill2", "skill3"],
  "education": {
    "degree": "string",
    "institution": "string",
    "gpa": "string",
    "relevantCoursework": ["course1", "course2"],
    "achievements": ["achievement1", "achievement2"]
  },
  "experience": [
    {
      "title": "string",
      "company": "string",
      "duration": "string",
      "responsibilities": ["responsibility1", "responsibility2"]
    }
  ],
  "projects": [
    {
      "name": "string",
      "technologies": ["tech1", "tech2"],
      "description": "string",
      "impact": "string"
    }
  ],
  "achievements": ["achievement1", "achievement2"],
  "atsKeywords": ["keyword1", "keyword2", "keyword3"]
}`;

    try {
      const response = await this.makeXAIRequest(prompt, systemPrompt, {
        maxTokens: 1500,
        temperature: 0.5
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Resume generation error:', error);
      return this.generateMockResume(studentData, resumeType);
    }
  }

  // Generate AI-powered cover letter
  async generateCoverLetter(studentData, jobDescription, companyName) {
    const systemPrompt = `You are Grok, an expert in crafting compelling cover letters that get results.

    Create a personalized, engaging cover letter that:
    1. Demonstrates genuine interest in the specific role and company
    2. Highlights relevant skills and experiences
    3. Shows personality while maintaining professionalism
    4. Uses storytelling to make the candidate memorable
    5. Includes a strong call-to-action`;

    const prompt = `Generate a compelling cover letter for this student:

STUDENT DATA:
${JSON.stringify(studentData, null, 2)}

JOB/COMPANY DETAILS:
Company: ${companyName || 'the company'}
Job Description: ${jobDescription || 'software development role'}

Create a cover letter with:
1. ENGAGING OPENING (hook the reader)
2. BODY PARAGRAPHS (connect experience to job requirements)
3. COMPANY CONNECTION (show research and genuine interest)
4. STRONG CLOSING (clear call-to-action)

Format as JSON:
{
  "opening": "string (2-3 sentences)",
  "bodyParagraphs": [
    {
      "focus": "string (what this paragraph emphasizes)",
      "content": "string (paragraph content)"
    }
  ],
  "companyConnection": "string (why this company/role)",
  "closing": "string (call-to-action)",
  "tone": "professional/enthusiastic/confident",
  "keyStrengths": ["strength1", "strength2", "strength3"]
}`;

    try {
      const response = await this.makeXAIRequest(prompt, systemPrompt, {
        maxTokens: 1200,
        temperature: 0.7
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Cover letter generation error:', error);
      return this.generateMockCoverLetter(studentData, jobDescription, companyName);
    }
  }

  // Generate LinkedIn profile optimization
  async generateLinkedInProfile(studentData) {
    const systemPrompt = `You are Grok, a LinkedIn optimization expert who helps students create compelling professional profiles.

    Create LinkedIn content that:
    1. Uses LinkedIn's algorithm-friendly formatting
    2. Incorporates relevant industry keywords
    3. Tells a compelling professional story
    4. Encourages engagement and connections
    5. Positions the student for their target roles`;

    const prompt = `Optimize LinkedIn profile content for this student:

${JSON.stringify(studentData, null, 2)}

Generate LinkedIn sections:
1. HEADLINE (compelling, keyword-rich)
2. ABOUT SECTION (engaging summary with call-to-action)
3. EXPERIENCE DESCRIPTIONS (achievement-focused)
4. SKILLS TO HIGHLIGHT (top 10 most relevant)
5. RECOMMENDED CONTENT STRATEGY (posting ideas)
6. CONNECTION STRATEGY (who to connect with)
7. PROFILE OPTIMIZATION TIPS (specific actionables)

Format as JSON:
{
  "headline": "string",
  "aboutSection": "string",
  "experienceTemplates": [
    {
      "role": "string",
      "description": "string",
      "keywordsUsed": ["keyword1", "keyword2"]
    }
  ],
  "topSkills": ["skill1", "skill2", "skill3"],
  "contentStrategy": [
    {
      "contentType": "string",
      "topic": "string",
      "frequency": "string",
      "example": "string"
    }
  ],
  "connectionStrategy": {
    "targetAudience": ["audience1", "audience2"],
    "connectionMessage": "string",
    "networkingTips": ["tip1", "tip2"]
  },
  "optimizationTips": [
    {
      "area": "string",
      "action": "string",
      "impact": "string"
    }
  ]
}`;

    try {
      const response = await this.makeXAIRequest(prompt, systemPrompt, {
        maxTokens: 1800,
        temperature: 0.6
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('LinkedIn profile generation error:', error);
      return this.generateMockLinkedIn(studentData);
    }
  }

  // Analyze portfolio strength
  async analyzePortfolioStrength(portfolioData) {
    const systemPrompt = `You are Grok, an expert in evaluating student portfolios and career readiness.

    Provide honest, constructive analysis that helps students improve their competitiveness in the job market.`;

    const prompt = `Analyze this student portfolio for job market readiness:

${JSON.stringify(portfolioData, null, 2)}

Provide comprehensive analysis with:
1. OVERALL STRENGTH SCORE (1-100 with justification)
2. CATEGORY BREAKDOWN (technical, experience, presentation, etc.)
3. COMPETITIVE ANALYSIS (how they compare to peers)
4. MARKET READINESS (which roles they're ready for)
5. GAP ANALYSIS (what's missing for target roles)
6. 90-DAY IMPROVEMENT PLAN (specific, actionable steps)
7. LONG-TERM STRATEGY (6-12 month roadmap)

Format as JSON:
{
  "overallScore": number,
  "scoreJustification": "string",
  "categoryBreakdown": {
    "technical": {"score": number, "feedback": "string"},
    "experience": {"score": number, "feedback": "string"},
    "presentation": {"score": number, "feedback": "string"},
    "achievements": {"score": number, "feedback": "string"}
  },
  "competitiveAnalysis": {
    "percentile": number,
    "comparison": "string",
    "differentiators": ["diff1", "diff2"]
  },
  "marketReadiness": {
    "readyFor": ["role1", "role2"],
    "notReadyFor": ["role1", "role2"],
    "timeline": "string"
  },
  "gapAnalysis": [
    {
      "gap": "string",
      "impact": "high/medium/low",
      "solution": "string"
    }
  ],
  "improvementPlan": {
    "next30Days": ["action1", "action2"],
    "next60Days": ["action1", "action2"],
    "next90Days": ["action1", "action2"]
  },
  "longTermStrategy": "string"
}`;

    try {
      const response = await this.makeXAIRequest(prompt, systemPrompt, {
        maxTokens: 1500,
        temperature: 0.4
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Portfolio analysis error:', error);
      return this.generateMockAnalysis(portfolioData);
    }
  }

  // Mock portfolio generation (fallback when xAI is unavailable)
  generateMockPortfolio(studentData) {
    return {
      professionalSummary: `Motivated ${studentData.Department || 'Computer Science'} student with strong academic performance (${studentData['Attendance_%'] || 85}% attendance) and passion for technology. Skilled in problem-solving and eager to apply theoretical knowledge in real-world projects.`,
      
      technicalSkills: {
        expert: ["Programming Fundamentals", "Academic Research"],
        intermediate: ["Web Development", "Database Management", "Software Testing"],
        beginner: ["Cloud Computing", "DevOps", "Machine Learning"]
      },
      
      academicAchievements: [
        {
          achievement: "Academic Performance",
          metric: `${studentData.Grade || 'B+'} grade with ${studentData['Attendance_%'] || 85}% attendance`,
          context: `Consistent performance in ${studentData.Department || 'Computer Science'} coursework`
        }
      ],
      
      suggestedProjects: [
        {
          title: "Student Management System",
          description: "Web-based application for managing student records and academic data",
          technologies: ["HTML/CSS", "JavaScript", "Database"],
          estimatedDuration: "4-6 weeks",
          difficultyLevel: "intermediate"
        },
        {
          title: "Personal Portfolio Website",
          description: "Professional portfolio showcasing skills and projects",
          technologies: ["React", "CSS", "Responsive Design"],
          estimatedDuration: "2-3 weeks",
          difficultyLevel: "beginner"
        }
      ],
      
      certificationRoadmap: [
        {
          certification: "Full Stack Web Development",
          provider: "freeCodeCamp",
          priority: "high",
          estimatedTime: "3-4 months",
          justification: "Essential for web development roles"
        }
      ],
      
      careerObjectives: {
        shortTerm: "Secure an internship in software development to gain practical experience",
        longTerm: "Become a full-stack developer at a leading technology company"
      },
      
      strengthsAnalysis: [
        {
          strength: "Academic Consistency",
          evidence: `Maintained ${studentData['Attendance_%'] || 85}% attendance`,
          impact: "Shows reliability and commitment"
        }
      ],
      
      improvementAreas: [
        {
          area: "Practical Project Experience",
          currentLevel: "Limited",
          targetLevel: "Moderate",
          actionSteps: ["Complete 2-3 personal projects", "Contribute to open source"]
        }
      ],
      
      portfolioOptimizationTips: [
        {
          category: "Technical Skills",
          tip: "Create GitHub repositories to showcase coding abilities",
          priority: "high"
        }
      ]
    };
  }

  // Mock resume generation (fallback)
  generateMockResume(studentData, resumeType) {
    return {
      professionalSummary: `Dedicated ${studentData.Department || 'Computer Science'} student with strong analytical skills and passion for ${resumeType} development.`,
      technicalSkills: ["Java", "Python", "SQL", "HTML/CSS", "JavaScript"],
      education: {
        degree: `Bachelor's in ${studentData.Department || 'Computer Science'}`,
        institution: "JECRC University",
        gpa: studentData.Grade || "B+",
        relevantCoursework: ["Data Structures", "Algorithms", "Database Systems"],
        achievements: ["Consistent Academic Performance"]
      },
      experience: [
        {
          title: "Academic Projects",
          company: "University Projects",
          duration: "Ongoing",
          responsibilities: ["Developed coursework projects", "Collaborated in team assignments"]
        }
      ],
      projects: [
        {
          name: "Academic Portfolio",
          technologies: ["Web Technologies"],
          description: "Collection of academic projects and assignments",
          impact: "Demonstrated learning progression"
        }
      ],
      achievements: ["Strong Academic Record", "Consistent Attendance"],
      atsKeywords: [resumeType, "programming", "software development", "teamwork", "problem-solving"]
    };
  }

  // Mock cover letter (fallback)
  generateMockCoverLetter(studentData, jobDescription, companyName) {
    return {
      opening: `I am excited to apply for the position at ${companyName || 'your company'} as I believe my academic background in ${studentData.Department || 'Computer Science'} aligns well with your requirements.`,
      bodyParagraphs: [
        {
          focus: "Academic Background",
          content: `During my studies, I have maintained strong academic performance with consistent attendance and engagement in coursework.`
        },
        {
          focus: "Skills and Potential",
          content: `I am eager to apply my theoretical knowledge in a practical setting and contribute to your team's success.`
        }
      ],
      companyConnection: `I am particularly interested in ${companyName || 'your company'} because of the opportunity to grow and learn in a professional environment.`,
      closing: `I would welcome the opportunity to discuss how I can contribute to your team. Thank you for your consideration.`,
      tone: "professional",
      keyStrengths: ["Academic Excellence", "Enthusiasm to Learn", "Strong Foundation"]
    };
  }

  // Mock LinkedIn profile (fallback)
  generateMockLinkedIn(studentData) {
    return {
      headline: `${studentData.Department || 'Computer Science'} Student | Future Technology Professional`,
      aboutSection: `Passionate ${studentData.Department || 'Computer Science'} student with strong academic foundation and eagerness to contribute to the technology industry.`,
      experienceTemplates: [
        {
          role: "Student",
          description: "Developing technical skills through coursework and projects",
          keywordsUsed: ["programming", "software development"]
        }
      ],
      topSkills: ["Programming", "Problem Solving", "Team Collaboration"],
      contentStrategy: [
        {
          contentType: "Educational",
          topic: "Learning Journey",
          frequency: "Weekly",
          example: "Sharing insights from coursework and projects"
        }
      ],
      connectionStrategy: {
        targetAudience: ["Industry Professionals", "Alumni", "Recruiters"],
        connectionMessage: "Hello! I'm a student interested in connecting with professionals in the tech industry.",
        networkingTips: ["Engage with industry content", "Join relevant groups"]
      },
      optimizationTips: [
        {
          area: "Profile Photo",
          action: "Use professional headshot",
          impact: "Increases profile views"
        }
      ]
    };
  }

  // Mock portfolio analysis (fallback)
  generateMockAnalysis(portfolioData) {
    return {
      overallScore: 65,
      scoreJustification: "Good foundation with room for improvement in practical experience and professional presentation",
      categoryBreakdown: {
        technical: {score: 60, feedback: "Solid theoretical foundation, needs more practical application"},
        experience: {score: 45, feedback: "Limited professional experience, focus on internships and projects"},
        presentation: {score: 70, feedback: "Good academic presentation, enhance professional polish"},
        achievements: {score: 65, feedback: "Strong academic record, add technical achievements"}
      },
      competitiveAnalysis: {
        percentile: 60,
        comparison: "Above average for current academic level",
        differentiators: ["Strong academic performance", "Consistent attendance"]
      },
      marketReadiness: {
        readyFor: ["Entry-level internships", "Training programs"],
        notReadyFor: ["Senior developer roles", "Leadership positions"],
        timeline: "Ready for junior roles in 6-12 months with focused improvement"
      },
      gapAnalysis: [
        {
          gap: "Limited project portfolio",
          impact: "high",
          solution: "Complete 2-3 substantial projects and showcase on GitHub"
        }
      ],
      improvementPlan: {
        next30Days: ["Create GitHub profile", "Start first project"],
        next60Days: ["Complete first project", "Begin second project"],
        next90Days: ["Launch portfolio website", "Apply for internships"]
      },
      longTermStrategy: "Focus on building practical experience through projects and internships while maintaining academic excellence"
    };
  }
}

module.exports = PortfolioAIService;