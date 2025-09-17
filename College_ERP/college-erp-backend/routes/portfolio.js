const express = require('express');
const router = express.Router();
const { Student, Faculty, Attendance, Course, Enrollment } = require('../models');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const PortfolioAIService = require('../services/PortfolioAIService');
const { Op } = require('sequelize');

// Initialize Portfolio AI Service
const portfolioAI = new PortfolioAIService();

/**
 * @route GET /api/portfolio/generate/:studentId
 * @desc Generate AI-powered comprehensive portfolio for a student
 * @access Private (Student themselves, Faculty with access, Admin)
 */
router.get('/generate/:studentId', 
  authenticateToken, 
  async (req, res) => {
    try {
      const studentId = req.params.studentId;
      
      // Authorization check: student can only access their own, admin and faculty can access assigned students
      if (req.user.role === 'student' && req.user.id !== studentId) {
        return res.status(403).json({
          success: false,
          message: 'You can only generate your own portfolio'
        });
      }

      // Get comprehensive student data for portfolio generation
      const student = await Student.findByPk(studentId, {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: Attendance,
            limit: 50,
            order: [['date', 'DESC']],
            include: [{
              model: Course,
              attributes: ['courseName', 'courseCode', 'credits']
            }]
          },
          {
            model: Enrollment,
            where: { status: 'active' },
            required: false,
            include: [{
              model: Course,
              attributes: ['courseName', 'courseCode', 'credits', 'semester']
            }]
          }
        ]
      });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      // Calculate additional metrics for better AI analysis
      const attendancePercentage = student['Attendance_%'] || 0;
      const totalClasses = student.Total_Classes || 0;
      const attendedClasses = student.Attended_Classes || 0;
      
      // Get recent performance trends
      const recentAttendance = student.Attendances?.slice(0, 20) || [];
      const recentPerformance = recentAttendance.reduce((acc, att) => {
        if (att.status === 'present') acc.present++;
        else acc.absent++;
        return acc;
      }, { present: 0, absent: 0 });

      // Prepare comprehensive student data for AI
      const studentData = {
        profile: {
          id: student.Student_ID,
          name: student.Full_Name,
          email: student.Email_ID,
          department: student.Department,
          program: student.Program,
          section: student.Section,
          semester: student.Semester,
          batch: student['Batch/Year']
        },
        academic: {
          totalClasses,
          attendedClasses,
          attendancePercentage,
          internalMarks: student.Internal_Marks || 0,
          practicalMarks: student.Practical_Marks || 0,
          midSemMarks: student.Mid_Sem_Marks || 0,
          endSemMarks: student.End_Sem_Marks || 0,
          currentGrade: student.Grade || 'N/A',
          resultStatus: student.Result_Status
        },
        courses: student.Enrollments?.map(enrollment => ({
          name: enrollment.Course?.courseName,
          code: enrollment.Course?.courseCode,
          credits: enrollment.Course?.credits,
          semester: enrollment.Course?.semester,
          grade: enrollment.finalGrade || 'In Progress'
        })) || [],
        recentPerformance,
        subjects: student.Subjects_Assigned?.split(',') || [],
        personalInfo: {
          address: student.Address,
          city: student.City,
          state: student.State,
          contactNo: student.Contact_No,
          parentName: student['Parent/Guardian_Name'],
          parentContact: student.Parent_Contact_No
        },
        fees: {
          semesterFee: student.Semester_Fee,
          hostelFee: student.Hostel_Fee,
          otherFees: student.Other_Fees,
          totalDue: student.Total_Due,
          paidStatus: student.Paid_Status
        }
      };

      // Generate AI portfolio
      const portfolio = await portfolioAI.generateStudentPortfolio(studentData);

      res.json({
        success: true,
        data: {
          portfolio,
          generatedAt: new Date().toISOString(),
          studentInfo: {
            name: student.Full_Name,
            department: student.Department,
            semester: student.Semester
          }
        }
      });

    } catch (error) {
      console.error('Portfolio generation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate portfolio',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route POST /api/portfolio/resume/:studentId
 * @desc Generate AI-powered resume content for a student
 * @access Private (Student themselves, Faculty with access, Admin)
 */
router.post('/resume/:studentId', 
  authenticateToken, 
  async (req, res) => {
    try {
      const studentId = req.params.studentId;
      const { resumeType = 'technical', customizations = {} } = req.body;

      // Authorization check
      if (req.user.role === 'student' && req.user.id !== studentId) {
        return res.status(403).json({
          success: false,
          message: 'You can only generate your own resume'
        });
      }

      // Get student data
      const student = await Student.findByPk(studentId, {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: Enrollment,
            include: [{
              model: Course,
              attributes: ['courseName', 'courseCode', 'credits']
            }]
          }
        ]
      });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      // Prepare student data for resume generation
      const studentData = {
        ...student.toJSON(),
        customizations
      };

      // Generate AI resume
      const resumeContent = await portfolioAI.generateResumeContent(studentData, resumeType);

      res.json({
        success: true,
        data: {
          resumeContent,
          resumeType,
          generatedAt: new Date().toISOString(),
          studentInfo: {
            name: student.Full_Name,
            department: student.Department
          }
        }
      });

    } catch (error) {
      console.error('Resume generation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate resume',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route POST /api/portfolio/cover-letter/:studentId
 * @desc Generate AI-powered cover letter for a student
 * @access Private (Student themselves, Faculty with access, Admin)
 */
router.post('/cover-letter/:studentId', 
  authenticateToken, 
  async (req, res) => {
    try {
      const studentId = req.params.studentId;
      const { jobDescription, companyName, additionalInfo = {} } = req.body;

      // Authorization check
      if (req.user.role === 'student' && req.user.id !== studentId) {
        return res.status(403).json({
          success: false,
          message: 'You can only generate your own cover letter'
        });
      }

      if (!jobDescription || !companyName) {
        return res.status(400).json({
          success: false,
          message: 'Job description and company name are required'
        });
      }

      // Get student data
      const student = await Student.findByPk(studentId, {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: Enrollment,
            include: [{
              model: Course,
              attributes: ['courseName', 'courseCode']
            }]
          }
        ]
      });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      // Prepare student data
      const studentData = {
        ...student.toJSON(),
        ...additionalInfo
      };

      // Generate AI cover letter
      const coverLetter = await portfolioAI.generateCoverLetter(studentData, jobDescription, companyName);

      res.json({
        success: true,
        data: {
          coverLetter,
          jobDetails: {
            company: companyName,
            description: jobDescription
          },
          generatedAt: new Date().toISOString(),
          studentInfo: {
            name: student.Full_Name,
            department: student.Department
          }
        }
      });

    } catch (error) {
      console.error('Cover letter generation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate cover letter',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route GET /api/portfolio/linkedin/:studentId
 * @desc Generate AI-optimized LinkedIn profile content for a student
 * @access Private (Student themselves, Faculty with access, Admin)
 */
router.get('/linkedin/:studentId', 
  authenticateToken, 
  async (req, res) => {
    try {
      const studentId = req.params.studentId;

      // Authorization check
      if (req.user.role === 'student' && req.user.id !== studentId) {
        return res.status(403).json({
          success: false,
          message: 'You can only generate your own LinkedIn profile'
        });
      }

      // Get student data
      const student = await Student.findByPk(studentId, {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: Enrollment,
            include: [{
              model: Course,
              attributes: ['courseName', 'courseCode', 'credits']
            }]
          }
        ]
      });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      // Generate LinkedIn profile optimization
      const linkedinProfile = await portfolioAI.generateLinkedInProfile(student.toJSON());

      res.json({
        success: true,
        data: {
          linkedinProfile,
          generatedAt: new Date().toISOString(),
          studentInfo: {
            name: student.Full_Name,
            department: student.Department
          }
        }
      });

    } catch (error) {
      console.error('LinkedIn profile generation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate LinkedIn profile',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route POST /api/portfolio/analyze/:studentId
 * @desc Analyze portfolio strength and provide improvement recommendations
 * @access Private (Student themselves, Faculty with access, Admin)
 */
router.post('/analyze/:studentId', 
  authenticateToken, 
  async (req, res) => {
    try {
      const studentId = req.params.studentId;
      const { portfolioData, targetRole = 'software developer' } = req.body;

      // Authorization check
      if (req.user.role === 'student' && req.user.id !== studentId) {
        return res.status(403).json({
          success: false,
          message: 'You can only analyze your own portfolio'
        });
      }

      // Get student data if not provided in portfolioData
      let analysisData = portfolioData;
      
      if (!portfolioData) {
        const student = await Student.findByPk(studentId, {
          attributes: { exclude: ['password'] },
          include: [
            {
              model: Enrollment,
              include: [{
                model: Course,
                attributes: ['courseName', 'courseCode', 'credits']
              }]
            },
            {
              model: Attendance,
              limit: 30,
              order: [['date', 'DESC']]
            }
          ]
        });

        if (!student) {
          return res.status(404).json({
            success: false,
            message: 'Student not found'
          });
        }

        analysisData = student.toJSON();
      }

      // Add target role to analysis data
      analysisData.targetRole = targetRole;

      // Perform portfolio analysis
      const analysis = await portfolioAI.analyzePortfolioStrength(analysisData);

      res.json({
        success: true,
        data: {
          analysis,
          targetRole,
          analyzedAt: new Date().toISOString(),
          studentInfo: analysisData.Full_Name ? {
            name: analysisData.Full_Name,
            department: analysisData.Department
          } : null
        }
      });

    } catch (error) {
      console.error('Portfolio analysis error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to analyze portfolio',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route GET /api/portfolio/career-guidance/:studentId
 * @desc Get AI-powered career guidance and job market insights
 * @access Private (Student themselves, Faculty with access, Admin)
 */
router.get('/career-guidance/:studentId', 
  authenticateToken, 
  async (req, res) => {
    try {
      const studentId = req.params.studentId;
      
      // Authorization check
      if (req.user.role === 'student' && req.user.id !== studentId) {
        return res.status(403).json({
          success: false,
          message: 'You can only access your own career guidance'
        });
      }

      // Get comprehensive student data
      const student = await Student.findByPk(studentId, {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: Enrollment,
            include: [{
              model: Course,
              attributes: ['courseName', 'courseCode', 'credits']
            }]
          }
        ]
      });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      // Use the existing career guidance from HybridAIService
      const aiService = req.app.get('aiService');
      
      // Get placement probability analysis
      const placementAnalysis = await aiService.analyzePlacementProbability(student.toJSON());
      
      // Get personalized recommendations
      const recommendations = await aiService.generatePersonalizedRecommendations(
        'student', 
        student.toJSON(), 
        'career_guidance'
      );

      res.json({
        success: true,
        data: {
          placementAnalysis,
          recommendations,
          careerInsights: {
            department: student.Department,
            currentGrade: student.Grade,
            attendancePercentage: student['Attendance_%'],
            semester: student.Semester
          },
          generatedAt: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Career guidance error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get career guidance',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route GET /api/portfolio/service-status
 * @desc Check Portfolio AI service status and capabilities
 * @access Private (All authenticated users)
 */
router.get('/service-status', 
  authenticateToken, 
  async (req, res) => {
    try {
      res.json({
        success: true,
        data: {
          enabled: portfolioAI.enabled,
          provider: portfolioAI.enabled ? 'xAI Grok' : 'Disabled',
          features: {
            portfolioGeneration: true,
            resumeCreation: true,
            coverLetterGeneration: true,
            linkedinOptimization: true,
            portfolioAnalysis: true,
            careerGuidance: true
          },
          fallbackMode: !portfolioAI.enabled,
          lastChecked: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Portfolio service status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get service status'
      });
    }
  }
);

module.exports = router;