// Test script to verify AI portfolio generation for different students
const AIPortfolioService = require('./college-erp-backend/services/AIPortfolioService');

async function testPortfolioGeneration() {
    console.log('🧪 Testing AI Portfolio Generation for Different Students\n');
    
    const portfolioService = new AIPortfolioService();
    
    // Test with different student IDs
    const testStudents = [
        'CSE-25-001',
        'CSE-25-004', 
        'ECE-24-012',
        'ME-23-045'
    ];
    
    const results = {};
    
    for (const studentId of testStudents) {
        console.log(`\n🔍 Testing portfolio generation for student: ${studentId}`);
        
        try {
            const portfolioResult = await portfolioService.generatePortfolio(studentId);
            
            if (portfolioResult.success) {
                console.log(`✅ Portfolio generated successfully for ${studentId}`);
                console.log(`   - Name: ${portfolioResult.data.personalInfo?.name || 'N/A'}`);
                console.log(`   - Department: ${portfolioResult.data.personalInfo?.department || 'N/A'}`);
                console.log(`   - CGPA: ${portfolioResult.data.analytics?.academicPerformance || 'N/A'}`);
                console.log(`   - Skills Count: ${portfolioResult.data.skills?.technical?.length || 0}`);
                console.log(`   - Projects Count: ${portfolioResult.data.projects?.length || 0}`);
                console.log(`   - AI Generated: ${portfolioResult.data.metadata?.aiGenerated || false}`);
                
                results[studentId] = {
                    success: true,
                    data: portfolioResult.data
                };
            } else {
                console.log(`❌ Portfolio generation failed for ${studentId}: ${portfolioResult.error}`);
                console.log(`   - Using fallback data: ${portfolioResult.data.metadata?.fallback || false}`);
                
                results[studentId] = {
                    success: false,
                    error: portfolioResult.error,
                    fallbackData: portfolioResult.data
                };
            }
        } catch (error) {
            console.error(`💥 Error testing ${studentId}:`, error.message);
            results[studentId] = {
                success: false,
                error: error.message
            };
        }
        
        // Add delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log('\n📊 Test Results Summary:');
    console.log('========================');
    
    let successCount = 0;
    let failureCount = 0;
    
    for (const [studentId, result] of Object.entries(results)) {
        if (result.success) {
            successCount++;
            console.log(`✅ ${studentId}: SUCCESS (AI: ${result.data.metadata?.aiGenerated})`);
        } else {
            failureCount++;
            console.log(`❌ ${studentId}: FAILED (${result.error})`);
        }
    }
    
    console.log(`\nTotal Tests: ${testStudents.length}`);
    console.log(`Successful: ${successCount}`);
    console.log(`Failed: ${failureCount}`);
    
    // Verify uniqueness
    console.log('\n🔍 Checking Portfolio Uniqueness:');
    const successfulPortfolios = Object.values(results).filter(r => r.success);
    
    if (successfulPortfolios.length >= 2) {
        const portfolio1 = successfulPortfolios[0].data;
        const portfolio2 = successfulPortfolios[1].data;
        
        const unique = (
            portfolio1.personalInfo?.name !== portfolio2.personalInfo?.name ||
            portfolio1.personalInfo?.department !== portfolio2.personalInfo?.department ||
            portfolio1.analytics?.academicPerformance !== portfolio2.analytics?.academicPerformance
        );
        
        console.log(`Portfolio Uniqueness: ${unique ? '✅ UNIQUE' : '❌ DUPLICATE'}`);
    } else {
        console.log('❌ Not enough successful portfolios to check uniqueness');
    }
    
    console.log('\n🎯 Test Complete!');
    return results;
}

// Run the test
if (require.main === module) {
    testPortfolioGeneration()
        .then(() => {
            console.log('Test completed successfully');
            process.exit(0);
        })
        .catch(error => {
            console.error('Test failed:', error);
            process.exit(1);
        });
}

module.exports = testPortfolioGeneration;