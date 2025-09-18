const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Student } = require('../models');

class AIPortfolioService {
    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
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
            // Fetch student data from database
            const student = await Student.findOne({
                where: { Student_ID: studentId },
                attributes: { exclude: ['password'] }
            });

            if (!student) {
                throw new Error('Student not found');
            }

            // Prepare student context for AI
            const studentContext = this.prepareStudentContext(student);
            
            // Generate AI content
            const aiContent = await this.generateAIContent(studentContext);
            
            // Combine AI content with student data
            const portfolioData = this.createPortfolioData(student, aiContent);
            
            return {
                success: true,
                data: portfolioData,
                generatedAt: new Date().toISOString()
            };

        } catch (error) {
            console.error('Error generating AI portfolio:', error);
            return {
                success: false,
                error: error.message,
                data: this.getFallbackPortfolio(studentId)
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

Generate compelling, professional content that would help this student stand out to recruiters.`;

        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        try {
            // Extract JSON from the response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            } else {
                throw new Error('No valid JSON found in AI response');
            }
        } catch (parseError) {
            console.error('Error parsing AI response:', parseError);
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
                department: "Computer Science Engineering",
                rollNumber: studentId
            },
            summary: "Dedicated engineering student with strong academic foundation and passion for technology.",
            skills: {
                technical: this.getDefaultTechnicalSkills('Computer Science'),
                soft: this.getDefaultSoftSkills()
            },
            projects: this.generateDefaultProjects('Computer Science', 7.0),
            achievements: [
                { title: "Academic Progress", category: "Academic", description: "Consistent academic performance" }
            ],
            metadata: {
                generatedAt: new Date().toISOString(),
                aiGenerated: false,
                fallback: true
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
}

module.exports = AIPortfolioService;