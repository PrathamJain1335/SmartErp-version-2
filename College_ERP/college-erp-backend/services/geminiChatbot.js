const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiERPChatbot {
    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
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
            console.error('Error processing Gemini query:', error);
            return {
                success: false,
                response: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
                error: error.message
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
}

module.exports = GeminiERPChatbot;