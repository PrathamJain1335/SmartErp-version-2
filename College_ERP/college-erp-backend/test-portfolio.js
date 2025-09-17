require('dotenv').config();
const PortfolioAIService = require('./services/PortfolioAIService');

async function testPortfolioService() {
    console.log('Testing Portfolio AI Service...');
    
    const portfolioAI = new PortfolioAIService();
    console.log('Service enabled:', portfolioAI.enabled);
    
    // Test data for a student
    const mockStudentData = {
        profile: {
            id: "CSE25004",
            name: "Test Student",
            department: "Computer Science",
            semester: 5,
            program: "B.Tech"
        },
        academic: {
            attendancePercentage: 85,
            internalMarks: 78,
            practicalMarks: 82,
            currentGrade: "B+",
            totalClasses: 120,
            attendedClasses: 102
        },
        courses: [
            { name: "Data Structures", code: "CS301", credits: 4 },
            { name: "Database Systems", code: "CS302", credits: 3 }
        ],
        subjects: ["Programming", "Algorithms", "Database"]
    };
    
    try {
        console.log('\n1. Testing Portfolio Generation...');
        const portfolio = await portfolioAI.generateStudentPortfolio(mockStudentData);
        console.log('✅ Portfolio generated successfully');
        console.log('Professional Summary:', portfolio.professionalSummary.substring(0, 100) + '...');
        console.log('Technical Skills - Expert:', portfolio.technicalSkills.expert);
        console.log('Suggested Projects Count:', portfolio.suggestedProjects.length);
        
        console.log('\n2. Testing Resume Generation...');
        const resume = await portfolioAI.generateResumeContent(mockStudentData, 'technical');
        console.log('✅ Resume generated successfully');
        console.log('Professional Summary:', resume.professionalSummary.substring(0, 100) + '...');
        console.log('Technical Skills:', resume.technicalSkills.slice(0, 3));
        
        console.log('\n3. Testing Cover Letter Generation...');
        const coverLetter = await portfolioAI.generateCoverLetter(
            mockStudentData, 
            'Software Developer position focusing on full-stack development',
            'Tech Company Inc'
        );
        console.log('✅ Cover Letter generated successfully');
        console.log('Opening:', coverLetter.opening.substring(0, 100) + '...');
        console.log('Tone:', coverLetter.tone);
        
        console.log('\n4. Testing LinkedIn Profile Generation...');
        const linkedin = await portfolioAI.generateLinkedInProfile(mockStudentData);
        console.log('✅ LinkedIn Profile generated successfully');
        console.log('Headline:', linkedin.headline);
        console.log('Top Skills:', linkedin.topSkills.slice(0, 3));
        
        console.log('\n5. Testing Portfolio Analysis...');
        const analysis = await portfolioAI.analyzePortfolioStrength(mockStudentData);
        console.log('✅ Portfolio Analysis completed successfully');
        console.log('Overall Score:', analysis.overallScore);
        console.log('Risk Level:', analysis.marketReadiness.timeline);
        
        console.log('\n🎉 All Portfolio AI features are working!');
        
    } catch (error) {
        console.error('❌ Portfolio service test failed:', error.message);
        console.error('Stack:', error.stack);
    }
}

testPortfolioService();