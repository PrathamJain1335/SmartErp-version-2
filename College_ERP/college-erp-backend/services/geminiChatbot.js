const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiERPChatbot {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        this.enabled = false;
        this.model = null;
        
        if (this.apiKey) {
            try {
                this.genAI = new GoogleGenerativeAI(this.apiKey);
                // Use the confirmed working model first, then fallbacks
                this.modelNames = [
                    "models/gemini-2.5-flash-preview-05-20", // Confirmed working!
                    "models/gemini-2.5-flash",
                    "models/gemini-2.0-flash", 
                    "models/gemini-flash-latest",
                    "gemini-1.5-flash", 
                    "gemini-1.5-pro", 
                    "gemini-pro"
                ];
            } catch (error) {
                console.warn('⚠️ Failed to initialize Gemini for chatbot:', error.message);
            }
        }
        
        // ERP-specific system prompt
        this.systemPrompt = `You are an ERP (Enterprise Resource Planning) Assistant for a College Management System. 

IMPORTANT RULES:
1. ONLY respond to queries related to ERP, college management, education administration, student management, faculty management, academic processes, or college operations.
2. If a query is NOT related to ERP or college management, respond with: "I can only help with ERP and college management related queries. Please ask about student management, faculty operations, academic processes, or other college administration topics."
3. You can help with navigation by providing specific instructions for accessing different portals and sections.
4. Always be helpful, professional, and specific to the college ERP context.
5. You can provide information about: Student Portal, Faculty Portal, Admin Portal, attendance, grades, courses, departments, schedules, reports, user management, etc.

NAVIGATION CAPABILITIES:
- When users ask to open or navigate to specific sections, provide clear instructions
- You can guide users to: Student Portal, Faculty Portal, Admin Portal, specific tabs within portals
- Always confirm what section they want to access and provide step-by-step guidance

Remember: You are specifically designed for this College ERP system and should not assist with unrelated topics.`;

        // ERP-related keywords for filtering
        this.erpKeywords = [
            'student', 'faculty', 'admin', 'portal', 'grade', 'attendance', 'course', 'department',
            'schedule', 'timetable', 'exam', 'semester', 'academic', 'college', 'university',
            'enrollment', 'registration', 'transcript', 'report', 'dashboard', 'profile',
            'login', 'password', 'user', 'management', 'erp', 'system', 'navigate', 'open',
            'access', 'tab', 'section', 'menu', 'assignment', 'marks', 'result', 'notification',
            'fee', 'payment', 'hostel', 'library', 'staff', 'teacher', 'principal', 'dean'
        ];

        // Navigation mappings
        this.navigationMap = {
            'student portal': 'Navigate to Student Portal: Click on the "Student Portal" tab or button from the main navigation menu.',
            'faculty portal': 'Navigate to Faculty Portal: Click on the "Faculty Portal" tab or button from the main navigation menu.',
            'admin portal': 'Navigate to Admin Portal: Click on the "Admin Portal" tab or button from the main navigation menu.',
            'dashboard': 'Navigate to Dashboard: This is usually the main landing page after login in each portal.',
            'attendance': 'Navigate to Attendance: Look for "Attendance" in the sidebar menu of your respective portal.',
            'grades': 'Navigate to Grades/Marks: Look for "Grades", "Marks", or "Results" section in your portal.',
            'profile': 'Navigate to Profile: Look for "Profile", "My Profile", or user icon in the top navigation.',
            'courses': 'Navigate to Courses: Look for "Courses", "Subjects", or "Academic" section in your portal.',
            'schedule': 'Navigate to Schedule: Look for "Schedule", "Timetable", or "Calendar" in your portal menu.'
        };
    }
    
    // Test and initialize a working model
    async initializeWorkingModel() {
        if (this.enabled || !this.genAI) return this.enabled;
        
        for (const modelName of this.modelNames) {
            try {
                const testModel = this.genAI.getGenerativeModel({ model: modelName });
                const result = await testModel.generateContent("Test");
                await result.response;
                
                this.model = testModel;
                this.enabled = true;
                console.log(`✅ Gemini chatbot model ${modelName} is working!`);
                return true;
                
            } catch (error) {
                console.log(`❌ Chatbot model ${modelName} failed`);
            }
        }
        
        console.warn('⚠️ Gemini chatbot using fallback responses');
        return false;
    }

    // Check if query is ERP-related
    isERPRelated(query) {
        const lowerQuery = query.toLowerCase();
        return this.erpKeywords.some(keyword => lowerQuery.includes(keyword));
    }

    // Get navigation instructions
    getNavigationInstructions(query) {
        const lowerQuery = query.toLowerCase();
        for (const [key, instruction] of Object.entries(this.navigationMap)) {
            if (lowerQuery.includes(key)) {
                return instruction;
            }
        }
        return null;
    }

    // Process user query
    async processQuery(userQuery, userContext = {}) {
        try {
            // Check if query is ERP-related
            if (!this.isERPRelated(userQuery)) {
                return {
                    success: true,
                    response: "I can only help with ERP and college management related queries. Please ask about student management, faculty operations, academic processes, or other college administration topics.",
                    isNavigation: false
                };
            }

            // Check for navigation requests
            const navigationInstruction = this.getNavigationInstructions(userQuery);
            if (navigationInstruction) {
                return {
                    success: true,
                    response: navigationInstruction,
                    isNavigation: true,
                    navigationType: this.extractNavigationType(userQuery)
                };
            }
            
            // Try to initialize working model if not done yet
            if (!this.enabled && this.genAI) {
                await this.initializeWorkingModel();
            }
            
            // Use AI response if available, otherwise use fallback
            if (this.enabled && this.model) {
                try {
                    // Construct the full prompt
                    const contextInfo = userContext.role ? `User Role: ${userContext.role}` : '';
                    const fullPrompt = `${this.systemPrompt}

${contextInfo}

User Query: ${userQuery}

Please provide a helpful, ERP-focused response.`;

                    // Generate response using Gemini
                    const result = await this.model.generateContent(fullPrompt);
                    const response = await result.response;
                    const text = response.text();

                    return {
                        success: true,
                        response: text,
                        isNavigation: false
                    };
                } catch (error) {
                    console.error('Gemini API error, using fallback:', error.message.substring(0, 100));
                    this.enabled = false; // Disable for future requests
                }
            }
            
            // Fallback response when AI is not available
            return {
                success: true,
                response: this.getFallbackResponse(userQuery, userContext),
                isNavigation: false
            };

        } catch (error) {
            console.error('Error processing query:', error);
            return {
                success: true,
                response: this.getFallbackResponse(userQuery, userContext),
                isNavigation: false
            };
        }
    }

    // Extract navigation type from query
    extractNavigationType(query) {
        const lowerQuery = query.toLowerCase();
        if (lowerQuery.includes('student portal')) return 'student_portal';
        if (lowerQuery.includes('faculty portal')) return 'faculty_portal';
        if (lowerQuery.includes('admin portal')) return 'admin_portal';
        if (lowerQuery.includes('dashboard')) return 'dashboard';
        if (lowerQuery.includes('attendance')) return 'attendance';
        if (lowerQuery.includes('grades') || lowerQuery.includes('marks')) return 'grades';
        if (lowerQuery.includes('profile')) return 'profile';
        if (lowerQuery.includes('courses') || lowerQuery.includes('subjects')) return 'courses';
        if (lowerQuery.includes('schedule') || lowerQuery.includes('timetable')) return 'schedule';
        return 'general';
    }

    // Get helpful suggestions
    getHelpfulSuggestions(userRole = 'student') {
        const suggestions = {
            student: [
                "Check my attendance",
                "View my grades",
                "Open student portal",
                "See my schedule",
                "Update my profile"
            ],
            faculty: [
                "Open faculty portal",
                "Manage student attendance",
                "Enter grades",
                "View my schedule",
                "Access course management"
            ],
            admin: [
                "Open admin portal",
                "Manage users",
                "Generate reports",
                "System dashboard",
                "Manage departments"
            ]
        };

        return suggestions[userRole.toLowerCase()] || suggestions.student;
    }
    
    // Fallback responses when Gemini API is not available
    getFallbackResponse(query, userContext = {}) {
        const { role = 'student' } = userContext;
        const lowerQuery = query.toLowerCase();
        
        // Role-specific responses
        if (role === 'student') {
            if (lowerQuery.includes('attendance')) {
                return "You can check your attendance records in the Student Portal under the Attendance section. This shows your attendance percentage, recent records, and detailed subject-wise attendance.";
            }
            if (lowerQuery.includes('grade') || lowerQuery.includes('result')) {
                return "Your grades and academic results are available in the Grades & Results section of your Student Portal. You can view semester-wise performance, CGPA, and detailed subject marks there.";
            }
            if (lowerQuery.includes('fee') || lowerQuery.includes('payment')) {
                return "For fee-related information, please visit the Fee Management section in your Student Portal. You can view fee structure, make online payments, download receipts, and track payment history.";
            }
            if (lowerQuery.includes('assignment')) {
                return "Your assignments are available in the Assignment Portal. You can view pending assignments, submit your work, check submission status, and download assignment files.";
            }
        } else if (role === 'faculty') {
            if (lowerQuery.includes('attendance')) {
                return "You can manage student attendance in the Faculty Portal under Attendance Management. Mark attendance, generate reports, and track student attendance patterns.";
            }
            if (lowerQuery.includes('grade') || lowerQuery.includes('grading')) {
                return "Access the Grades & Evaluation section in your Faculty Portal to enter student grades, generate report cards, and monitor academic performance.";
            }
        }
        
        // General responses based on query content
        if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
            const roleText = role === 'student' ? 'student-focused features like attendance tracking, grade viewing, and assignment management' : 
                            role === 'faculty' ? 'faculty tools for attendance management, grading, and student evaluation' : 
                            'administrative functions and system management';
            return `Hello! I'm your ERP Assistant. I can help you navigate the system and use ${roleText}. What would you like to do today?`;
        }
        
        if (lowerQuery.includes('help')) {
            return "I can assist you with:\n• Navigating different portals and sections\n• Understanding ERP features\n• Accessing attendance records\n• Viewing grades and academic information\n• Managing assignments and submissions\n• Fee-related queries\n\nWhat specific area do you need help with?";
        }
        
        // Default response
        return `I'm here to help with your ERP system queries! I can guide you through various sections like attendance, grades, assignments, and more. Please let me know what you'd like to do or which section you'd like to access.\n\n*Note: Enhanced AI responses are temporarily unavailable, but I can still provide helpful guidance.*`;
    }
}

module.exports = GeminiERPChatbot;
