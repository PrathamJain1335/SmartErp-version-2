const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Student } = require('../models');

class AIPortfolioService {
    constructor() {
        // Check if API key is available
        if (!process.env.GEMINI_API_KEY) {
            console.warn('⚠️ GEMINI_API_KEY not found. AI features will use fallback mode.');
            this.enabled = false;
            return;
        }
        
        try {
            this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            this.enabled = true;
            console.log('✅ AI Portfolio Service initialized with Gemini');
        } catch (error) {
            console.error('❌ Failed to initialize Gemini AI:', error.message);
            this.enabled = false;
        }
        
        // Portfolio generation system prompt
        this.systemPrompt = `You are an expert career counselor and portfolio designer. Your task is to generate comprehensive, professional portfolio content based on student academic and personal data.

IMPORTANT RULES:
1. Generate realistic and professional content that matches the student's actual academic level and profile
2. Create content that would impress recruiters and employers
3. Be specific and detailed in descriptions
4. Use industry-relevant keywords and terms
5. Make suggestions for improvement areas
6. Generate content that reflects the student's department and specialization
7. Create compelling project descriptions based on their coursework
8. Return data in valid JSON format only

Generate portfolio sections:
- Personal summary (professional, compelling, 2-3 sentences)
- Technical skills (based on department and CGPA level)
- Soft skills (leadership, communication, etc.)
- Project suggestions (based on department and academic year)
- Career objectives (aligned with department and interests)
- Achievements (academic and extracurricular based on data)
- Certifications recommendations
- Experience descriptions (if internships available)
- Professional development suggestions

Format the response as valid JSON with the following structure:
{
  "personalSummary": "string",
  "technicalSkills": [{"name": "string", "level": number, "category": "string"}],
  "softSkills": [{"name": "string", "level": number}],
  "projects": [{"title": "string", "description": "string", "technologies": ["string"], "impact": "string"}],
  "careerObjective": "string",
  "achievements": [{"title": "string", "category": "string", "description": "string"}],
  "certificationSuggestions": ["string"],
  "professionalDevelopment": ["string"],
  "strengthsAnalysis": "string",
  "improvementAreas": ["string"]
}`;
    }

    /**
     * Generate AI-powered portfolio for a student
     * @param {string} studentId - Student ID to generate portfolio for
     * @returns {Object} Generated portfolio data
     */
    async generatePortfolio(studentId) {
        try {
            // Check if AI is enabled
            if (!this.enabled) {
                console.log('🔄 AI disabled, using fallback portfolio');
                return {
                    success: true,
                    data: this.getFallbackPortfolio(studentId),
                    aiGenerated: false,
                    fallback: true,
                    generatedAt: new Date().toISOString()
                };
            }

            // Fetch student data from database
            const student = await Student.findOne({
                where: { Student_ID: studentId },
                attributes: { exclude: ['password'] }
            });

            if (!student) {
                console.log('⚠️ Student not found, using fallback');
                return {
                    success: true,
                    data: this.getFallbackPortfolio(studentId),
                    aiGenerated: false,
                    fallback: true,
                    generatedAt: new Date().toISOString()
                };
            }

            // Prepare student context for AI
            const studentContext = this.prepareStudentContext(student);
            
            // Generate AI content with timeout
            const aiContent = await Promise.race([
                this.generateAIContent(studentContext),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('AI generation timeout')), 30000)
                )
            ]);
            
            // Combine AI content with student data
            const portfolioData = this.createPortfolioData(student, aiContent);
            
            return {
                success: true,
                data: portfolioData,
                aiGenerated: true,
                generatedAt: new Date().toISOString()
            };

        } catch (error) {
            console.error('Error generating AI portfolio:', error);
            return {
                success: true, // Still return success with fallback
                data: this.getFallbackPortfolio(studentId),
                aiGenerated: false,
                fallback: true,
                error: error.message,
                generatedAt: new Date().toISOString()
            };
        }
    }

    /**
     * Prepare student context for AI processing
     */
    prepareStudentContext(student) {
        const currentDate = new Date();
        const admissionYear = student.admissionDate ? new Date(student.admissionDate).getFullYear() : 2021;
        const currentYear = currentDate.getFullYear();
        const academicYear = currentYear - admissionYear + 1;

        return {
            personalInfo: {
                name: student.Full_Name || 'Student',
                email: student.Email_ID,
                department: student.Department || 'Computer Science',
                program: student.Program || 'B.Tech',
                rollNo: student.Student_ID,
                semester: student.Semester || Math.min(academicYear * 2, 8),
                academicYear: academicYear
            },
            academics: {
                cgpa: this.calculateCGPA(student),
                attendance: student['Attendance_%'] || 85,
                internalMarks: student.Internal_Marks || 0,
                midSemMarks: student.Mid_Sem_Marks || 0,
                endSemMarks: student.End_Sem_Marks || 0,
                grade: student.Grade || 'B+',
                resultStatus: student.Result_Status || 'Pass'
            },
            profile: {
                bloodGroup: student.bloodGroup,
                city: student.City,
                state: student.State,
                contactNo: student.Contact_No,
                guardianName: student['Parent/Guardian_Name'],
                emergencyContact: student.emergencyContact
            },
            extracurricular: this.extractExtracurricular(student),
            riskScore: student.riskScore || 0.2,
            lastAnalysis: student.lastAIAnalysis
        };
    }

    /**
     * Generate AI content using Gemini
     */
    async generateAIContent(studentContext) {
        if (!this.enabled || !this.model) {
            return this.getFallbackAIContent(studentContext);
        }

        const prompt = `${this.systemPrompt}

Student Profile Data:
Name: ${studentContext.personalInfo.name}
Department: ${studentContext.personalInfo.department}
Program: ${studentContext.personalInfo.program}
Current Semester: ${studentContext.personalInfo.semester}
Academic Year: ${studentContext.personalInfo.academicYear}
CGPA: ${studentContext.academics.cgpa}
Attendance: ${studentContext.academics.attendance}%
Grade: ${studentContext.academics.grade}
City: ${studentContext.profile.city}, ${studentContext.profile.state}

Based on this student profile, generate a comprehensive portfolio content that:
1. Matches their academic level (${studentContext.personalInfo.academicYear} year student)
2. Reflects their department (${studentContext.personalInfo.department})
3. Is appropriate for their CGPA level (${studentContext.academics.cgpa})
4. Includes realistic project suggestions for their level
5. Provides career guidance specific to their field

Generate compelling, professional content that would help this student stand out to recruiters.

IMPORTANT: Return ONLY valid JSON. No additional text or explanations.`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Clean and extract JSON from the response
            let cleanedText = text.trim();
            
            // Remove markdown code blocks if present
            cleanedText = cleanedText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
            
            // Extract JSON object
            const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const jsonString = jsonMatch[0];
                const parsed = JSON.parse(jsonString);
                
                // Validate required fields
                if (parsed.personalSummary && parsed.technicalSkills && parsed.projects) {
                    return parsed;
                } else {
                    throw new Error('Incomplete AI response structure');
                }
            } else {
                throw new Error('No valid JSON found in AI response');
            }
        } catch (error) {
            console.error('Error generating AI content:', error.message);
            return this.getFallbackAIContent(studentContext);
        }
    }

    /**
     * Create final portfolio data combining student info with AI content
     */
    createPortfolioData(student, aiContent) {
        const currentDate = new Date();
        const admissionYear = student.admissionDate ? new Date(student.admissionDate).getFullYear() : 2021;
        const expectedGraduation = admissionYear + 4;

        return {
            personalInfo: {
                name: student.Full_Name || 'Student Name',
                title: `${student.Department || 'Computer Science'} Student & ${this.getDepartmentRole(student.Department)}`,
                email: student.Email_ID,
                phone: student.Contact_No || '+91-XXXXXXXXXX',
                location: `${student.City || 'City'}, ${student.State || 'State'}`,
                rollNumber: student.Student_ID,
                department: student.Department || 'Computer Science Engineering',
                program: student.Program || 'B.Tech',
                semester: student.Semester || 1,
                expectedGraduation: expectedGraduation,
                profileImage: student.profilePicture || '/default-profile.jpg'
            },
            summary: aiContent.personalSummary || `Passionate ${student.Department || 'Computer Science'} student with strong academic foundation and growing expertise in modern technologies.`,
            
            education: [{
                degree: `${student.Program || 'B.Tech'} ${student.Department || 'Computer Science Engineering'}`,
                institution: "JECRC University",
                year: `${admissionYear}-${expectedGraduation}`,
                cgpa: this.calculateCGPA(student).toString(),
                achievements: this.generateAcademicAchievements(student, aiContent.achievements || [])
            }],

            skills: {
                technical: aiContent.technicalSkills || this.getDefaultTechnicalSkills(student.Department),
                soft: aiContent.softSkills || this.getDefaultSoftSkills()
            },

            projects: aiContent.projects || this.generateDefaultProjects(student.Department, this.calculateCGPA(student)),
            
            achievements: aiContent.achievements || this.generateDefaultAchievements(student),
            
            certifications: aiContent.certificationSuggestions || this.getDefaultCertifications(student.Department),
            
            careerObjective: aiContent.careerObjective || `Seeking opportunities in ${student.Department || 'technology'} field to apply academic knowledge and contribute to innovative solutions.`,
            
            analytics: {
                strengthsAnalysis: aiContent.strengthsAnalysis || "Strong academic foundation with consistent performance",
                improvementAreas: aiContent.improvementAreas || ["Industry experience", "Professional networking"],
                riskScore: student.riskScore || 0.2,
                attendancePercentage: student['Attendance_%'] || 85,
                academicPerformance: this.calculateCGPA(student)
            },
            
            professionalDevelopment: aiContent.professionalDevelopment || [
                "Industry internships",
                "Open source contributions",
                "Technical workshops and seminars"
            ],

            metadata: {
                generatedAt: new Date().toISOString(),
                aiGenerated: true,
                dataSource: 'JECRC ERP System',
                version: '1.0'
            }
        };
    }

    /**
     * Calculate CGPA from available marks
     */
    calculateCGPA(student) {
        const internal = parseFloat(student.Internal_Marks) || 0;
        const midSem = parseFloat(student.Mid_Sem_Marks) || 0;
        const endSem = parseFloat(student.End_Sem_Marks) || 0;
        
        if (internal === 0 && midSem === 0 && endSem === 0) {
            // If no marks available, generate based on attendance and risk score
            const attendance = parseFloat(student['Attendance_%']) || 85;
            const riskScore = parseFloat(student.riskScore) || 0.2;
            
            // Base CGPA calculation
            let baseCGPA = 6.0 + (attendance - 75) * 0.04; // Higher attendance = better CGPA
            baseCGPA = baseCGPA - (riskScore * 2); // Lower risk = better CGPA
            
            return Math.max(5.0, Math.min(10.0, parseFloat(baseCGPA.toFixed(2))));
        }
        
        // Calculate CGPA from marks (assuming 100-based marking)
        const totalMarks = internal + midSem + endSem;
        const maxMarks = 300; // Assuming max 100 for each component
        const percentage = (totalMarks / maxMarks) * 100;
        
        // Convert percentage to 10-point CGPA scale
        let cgpa = (percentage / 10);
        return Math.max(5.0, Math.min(10.0, parseFloat(cgpa.toFixed(2))));
    }

    /**
     * Get department-specific role
     */
    getDepartmentRole(department) {
        const roles = {
            'Computer Science': 'Technology Enthusiast',
            'Information Technology': 'IT Professional',
            'Electronics': 'Electronics Engineer',
            'Mechanical': 'Mechanical Engineer',
            'Civil': 'Civil Engineer',
            'Electrical': 'Electrical Engineer',
            'Chemical': 'Chemical Engineer'
        };
        return roles[department] || 'Engineering Student';
    }

    /**
     * Generate academic achievements based on performance
     */
    generateAcademicAchievements(student, aiAchievements) {
        const achievements = [];
        const cgpa = this.calculateCGPA(student);
        const attendance = parseFloat(student['Attendance_%']) || 85;

        if (cgpa >= 8.5) achievements.push("Dean's List");
        if (cgpa >= 9.0) achievements.push("Top 5% of Class");
        if (attendance >= 95) achievements.push("Perfect Attendance Award");
        if (cgpa >= 8.0 && attendance >= 90) achievements.push("Academic Excellence Award");

        // Add AI-generated achievements
        if (aiAchievements && aiAchievements.length > 0) {
            achievements.push(...aiAchievements.map(a => a.title || a));
        }

        return achievements.length > 0 ? achievements : ["Consistent Academic Performance"];
    }

    /**
     * Get default technical skills based on department
     */
    getDefaultTechnicalSkills(department) {
        const skillSets = {
            'Computer Science': [
                { name: "Programming Languages", level: 85, category: "Development" },
                { name: "Data Structures", level: 80, category: "Programming" },
                { name: "Database Management", level: 75, category: "Backend" },
                { name: "Web Development", level: 70, category: "Frontend" },
                { name: "Software Engineering", level: 78, category: "Development" }
            ],
            'Information Technology': [
                { name: "Network Administration", level: 82, category: "Networking" },
                { name: "System Administration", level: 78, category: "Systems" },
                { name: "Cybersecurity", level: 75, category: "Security" },
                { name: "Cloud Computing", level: 70, category: "Cloud" },
                { name: "Database Management", level: 80, category: "Database" }
            ]
        };
        
        return skillSets[department] || skillSets['Computer Science'];
    }

    /**
     * Get default soft skills
     */
    getDefaultSoftSkills() {
        return [
            { name: "Communication", level: 85 },
            { name: "Problem Solving", level: 88 },
            { name: "Teamwork", level: 82 },
            { name: "Leadership", level: 78 },
            { name: "Adaptability", level: 80 }
        ];
    }

    /**
     * Generate default projects based on department and academic level
     */
    generateDefaultProjects(department, cgpa) {
        const projectSets = {
            'Computer Science': [
                {
                    title: "Student Management System",
                    description: "Comprehensive web application for managing student records with modern UI/UX",
                    technologies: ["React.js", "Node.js", "MongoDB", "Express.js"],
                    impact: `Academic project demonstrating full-stack development skills`
                },
                {
                    title: "Algorithm Visualization Tool",
                    description: "Interactive web application to visualize sorting and searching algorithms",
                    technologies: ["JavaScript", "HTML5", "CSS3", "D3.js"],
                    impact: "Educational tool for algorithm learning"
                }
            ]
        };

        return projectSets[department] || projectSets['Computer Science'];
    }

    /**
     * Generate default achievements
     */
    generateDefaultAchievements(student) {
        const cgpa = this.calculateCGPA(student);
        const achievements = [];

        if (cgpa >= 8.0) {
            achievements.push({ title: "Academic Excellence Award", category: "Academic", description: "Recognition for outstanding academic performance" });
        }
        
        achievements.push(
            { title: "Active Participation in Technical Events", category: "Extracurricular", description: "Regular participation in college technical activities" },
            { title: "Consistent Academic Performance", category: "Academic", description: "Maintained steady academic progress throughout the program" }
        );

        return achievements;
    }

    /**
     * Get default certifications based on department
     */
    getDefaultCertifications(department) {
        const certificationSets = {
            'Computer Science': [
                "Oracle Java Certification",
                "AWS Certified Developer",
                "Google Cloud Platform Fundamentals",
                "Microsoft Azure Fundamentals"
            ],
            'Information Technology': [
                "CompTIA Network+",
                "Cisco CCNA",
                "Microsoft Azure Administrator",
                "AWS Solutions Architect"
            ]
        };
        
        return certificationSets[department] || certificationSets['Computer Science'];
    }

    /**
     * Extract extracurricular activities from student data
     */
    extractExtracurricular(student) {
        // This could be enhanced to parse actual extracurricular data
        return [
            "Technical Club Member",
            "College Event Participant",
            "Academic Society Member"
        ];
    }

    /**
     * Fallback portfolio data when AI generation fails
     */
    getFallbackPortfolio(studentId) {
        return {
            personalInfo: {
                name: "Student",
                title: "Engineering Student",
                email: "student@jecrc.ac.in",
                phone: "+91-XXXXXXXXXX",
                location: "Jaipur, Rajasthan",
                rollNumber: studentId,
                department: "Computer Science Engineering",
                program: "B.Tech",
                semester: 1,
                expectedGraduation: 2025,
                profileImage: "/default-profile.jpg"
            },
            summary: "Dedicated engineering student with strong academic foundation and passion for technology. Committed to continuous learning and applying technical skills to solve real-world problems.",
            education: [{
                degree: "B.Tech Computer Science Engineering",
                institution: "JECRC University",
                year: "2021-2025",
                cgpa: "7.5",
                achievements: ["Consistent Academic Performance", "Active in Technical Activities"]
            }],
            experience: [{
                title: "Academic Projects",
                company: "JECRC University",
                duration: "2021-2025",
                description: "Completed various academic projects demonstrating technical skills and problem-solving abilities",
                technologies: ["Programming Languages", "Web Development", "Database Management"]
            }],
            skills: {
                technical: this.getDefaultTechnicalSkills('Computer Science'),
                soft: this.getDefaultSoftSkills()
            },
            projects: this.generateDefaultProjects('Computer Science', 7.0),
            achievements: [
                { title: "Academic Progress", category: "Academic", description: "Consistent academic performance" },
                { title: "Technical Project Completion", category: "Project", description: "Successfully completed multiple technical projects" }
            ],
            certifications: this.getDefaultCertifications('Computer Science'),
            careerObjective: "Seeking opportunities to apply academic knowledge in technology field and contribute to innovative solutions.",
            analytics: {
                strengthsAnalysis: "Strong academic foundation with consistent performance",
                improvementAreas: ["Industry experience", "Professional networking"],
                riskScore: 0.2,
                attendancePercentage: 85,
                academicPerformance: 7.5
            },
            professionalDevelopment: [
                "Industry internships and practical experience",
                "Advanced technical certifications",
                "Open source project contributions"
            ],
            metadata: {
                generatedAt: new Date().toISOString(),
                aiGenerated: false,
                fallback: true,
                dataSource: 'Fallback System',
                version: '1.0'
            }
        };
    }

    /**
     * Fallback AI content when Gemini API fails
     */
    getFallbackAIContent(studentContext) {
        return {
            personalSummary: `Motivated ${studentContext.personalInfo.department} student with strong academic foundation and enthusiasm for learning new technologies.`,
            technicalSkills: this.getDefaultTechnicalSkills(studentContext.personalInfo.department),
            softSkills: this.getDefaultSoftSkills(),
            projects: this.generateDefaultProjects(studentContext.personalInfo.department, studentContext.academics.cgpa),
            careerObjective: `Seeking opportunities to apply academic knowledge in ${studentContext.personalInfo.department} field and contribute to innovative projects.`,
            achievements: this.generateDefaultAchievements({...studentContext.academics, Department: studentContext.personalInfo.department}),
            certificationSuggestions: this.getDefaultCertifications(studentContext.personalInfo.department),
            professionalDevelopment: [
                "Industry internships and practical experience",
                "Advanced technical certifications",
                "Open source project contributions"
            ],
            strengthsAnalysis: "Strong academic foundation with consistent performance and good technical understanding",
            improvementAreas: ["Industry experience", "Professional networking", "Advanced project work"]
        };
    }

    /**
     * Generate career guidance using AI
     */
    async generateCareerGuidance(studentId) {
        try {
            // Fetch student data
            const student = await Student.findOne({
                where: { Student_ID: studentId },
                attributes: { exclude: ['password'] }
            });

            if (!student) {
                return {
                    success: false,
                    error: 'Student not found',
                    data: null
                };
            }

            if (!this.enabled) {
                return {
                    success: true,
                    data: this.getFallbackCareerGuidance(student),
                    aiGenerated: false,
                    generatedAt: new Date().toISOString()
                };
            }

            // Prepare student context
            const studentContext = this.prepareStudentContext(student);
            
            // Generate AI career guidance
            const prompt = `You are a career counselor for JECRC University. Based on the student profile, provide comprehensive career guidance.

Student Profile:
Name: ${studentContext.personalInfo.name}
Department: ${studentContext.personalInfo.department}
CGPA: ${studentContext.academics.cgpa}
Attendance: ${studentContext.academics.attendance}%
Semester: ${studentContext.personalInfo.semester}

Generate career guidance including placement analysis, recommendations, and industry insights.

Return only valid JSON:
{
  "placementProbability": 85,
  "careerPaths": ["Software Developer", "Data Scientist"],
  "skillGaps": ["Advanced algorithms", "System design"],
  "recommendations": ["Build portfolio projects"],
  "industryInsights": "Industry analysis here",
  "preparationTips": ["Practice coding", "Improve communication"]
}`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Parse AI response
            let cleanedText = text.trim().replace(/```json\s*/g, '').replace(/```\s*/g, '');
            const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
            
            if (jsonMatch) {
                const careerGuidance = JSON.parse(jsonMatch[0]);
                return {
                    success: true,
                    data: careerGuidance,
                    aiGenerated: true,
                    generatedAt: new Date().toISOString()
                };
            } else {
                throw new Error('Invalid AI response format');
            }

        } catch (error) {
            console.error('Error generating career guidance:', error.message);
            return {
                success: true,
                data: this.getFallbackCareerGuidance(student),
                aiGenerated: false,
                error: error.message,
                generatedAt: new Date().toISOString()
            };
        }
    }

    /**
     * Get fallback career guidance
     */
    getFallbackCareerGuidance(student) {
        const department = student?.Department || 'Computer Science';
        const cgpa = this.calculateCGPA(student || {}) || 7.0;
        
        return {
            placementProbability: Math.min(95, Math.max(60, cgpa * 10 + 15)),
            careerPaths: this.getCareerPathsForDepartment(department),
            skillGaps: this.getSkillGapsForDepartment(department),
            recommendations: [
                "Focus on building a strong portfolio with practical projects",
                "Improve communication and soft skills through practice",
                "Stay updated with latest industry trends and technologies",
                "Participate in coding competitions and hackathons",
                "Build a professional network through LinkedIn and industry events"
            ],
            industryInsights: `The ${department} industry is experiencing rapid growth with high demand for skilled professionals. Companies are looking for candidates with both technical expertise and problem-solving abilities.`,
            preparationTips: [
                "Practice coding problems on platforms like LeetCode and HackerRank",
                "Prepare for behavioral interviews with STAR method",
                "Research target companies and their technical stacks",
                "Create a compelling resume highlighting projects and achievements",
                "Practice mock interviews with peers or mentors"
            ]
        };
    }

    /**
     * Get career paths for department
     */
    getCareerPathsForDepartment(department) {
        const careerPaths = {
            'Computer Science': [
                'Software Developer',
                'Data Scientist',
                'Machine Learning Engineer',
                'Full Stack Developer',
                'DevOps Engineer',
                'Product Manager'
            ],
            'Information Technology': [
                'System Administrator',
                'Network Engineer',
                'Cybersecurity Analyst',
                'IT Consultant',
                'Cloud Architect',
                'Database Administrator'
            ]
        };
        
        return careerPaths[department] || careerPaths['Computer Science'];
    }

    /**
     * Get skill gaps for department
     */
    getSkillGapsForDepartment(department) {
        const skillGaps = {
            'Computer Science': [
                'Advanced algorithms and data structures',
                'System design and architecture',
                'Cloud computing platforms',
                'Modern JavaScript frameworks',
                'Database optimization'
            ],
            'Information Technology': [
                'Network security protocols',
                'Cloud infrastructure management',
                'Automation and scripting',
                'Virtualization technologies',
                'IT service management'
            ]
        };
        
        return skillGaps[department] || skillGaps['Computer Science'];
    }
}

module.exports = AIPortfolioService;
