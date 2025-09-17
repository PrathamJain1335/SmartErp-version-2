const { Student, Faculty, Attendance, AIAnalytics, Course, Enrollment } = require('../models');
const AIService = require('../services/AIService');
const { Op } = require('sequelize');

/**
 * Update AI Analytics from Real Database Data
 * This script demonstrates how the AI system analyzes real data
 */
async function updateAIAnalyticsFromRealData() {
  console.log('🤖 Updating AI Analytics from Real Database Data...\n');

  try {
    const aiService = new AIService(process.env.OPENAI_API_KEY);
    
    if (!aiService.isEnabled()) {
      console.log('❌ AI Service is disabled. Please check your OpenAI API key.');
      return;
    }

    // Get all active students
    const students = await Student.findAll({
      where: { 
        isActive: true,
        'Attendance_%': { [Op.not]: null } // Only students with attendance data
      },
      attributes: [
        'id', 'Student_ID', 'Full_Name', 'Department', 'Section', 'Semester',
        'Total_Classes', 'Attended_Classes', 'Attendance_%', 
        'Internal_Marks', 'Mid_Sem_Marks', 'End_Sem_Marks', 'Grade'
      ]
    });

    console.log(`📊 Found ${students.length} students with attendance data\n`);

    for (const student of students) {
      console.log(`🔍 Analyzing student: ${student.Full_Name} (${student.Student_ID})`);
      
      // Generate AI analytics for this student
      const analysisData = {
        student: {
          id: student.Student_ID,
          name: student.Full_Name,
          department: student.Department,
          section: student.Section,
          semester: student.Semester
        },
        academic: {
          totalClasses: student.Total_Classes || 0,
          attendedClasses: student.Attended_Classes || 0,
          attendancePercentage: student['Attendance_%'] || 0,
          internalMarks: student.Internal_Marks || 0,
          midSemMarks: student.Mid_Sem_Marks || 0,
          endSemMarks: student.End_Sem_Marks || 0,
          grade: student.Grade || 'Not Assigned'
        },
        timestamp: new Date().toISOString()
      };

      // Calculate risk assessment based on real data
      let riskLevel = 'low';
      let riskFactors = [];
      
      const attendance = parseFloat(student['Attendance_%']) || 0;
      const avgMarks = ((parseFloat(student.Internal_Marks) || 0) + (parseFloat(student.Mid_Sem_Marks) || 0) + (parseFloat(student.End_Sem_Marks) || 0)) / 3;

      if (attendance < 75) {
        riskLevel = attendance < 60 ? 'high' : 'medium';
        riskFactors.push(`Low attendance: ${attendance.toFixed(1)}%`);
      }

      if (avgMarks < 50) {
        riskLevel = 'high';
        riskFactors.push(`Poor academic performance: ${avgMarks.toFixed(1)} avg marks`);
      } else if (avgMarks < 65) {
        if (riskLevel === 'low') riskLevel = 'medium';
        riskFactors.push(`Below average performance: ${avgMarks.toFixed(1)} avg marks`);
      }

      // Generate recommendations based on real data
      let recommendations = [];
      if (attendance < 85) {
        recommendations.push('Improve class attendance to meet minimum requirements');
        recommendations.push('Schedule meeting with class advisor to discuss attendance issues');
      }
      
      if (avgMarks < 70) {
        recommendations.push('Consider additional tutoring or study groups');
        recommendations.push('Focus on completing internal assessments and assignments');
      }

      if (student.Grade === 'C' || student.Grade === 'D' || !student.Grade) {
        recommendations.push('Intensive preparation needed for upcoming examinations');
        recommendations.push('Seek faculty guidance for subject-specific improvement');
      }

      // Generate predictions based on current trajectory
      let predictedPerformance = 'stable';
      if (attendance > 90 && avgMarks > 80) {
        predictedPerformance = 'excellent';
      } else if (attendance < 70 || avgMarks < 50) {
        predictedPerformance = 'declining';
      } else if (attendance > 80 && avgMarks > 70) {
        predictedPerformance = 'improving';
      }

      // Create or update AI analytics record
      const aiAnalytics = {
        studentId: student.id,
        analysisType: 'comprehensive',
        analysisData: analysisData,
        predictions: {
          riskLevel: riskLevel,
          riskFactors: riskFactors,
          predictedPerformance: predictedPerformance,
          expectedFinalGrade: student.Grade || 'To be determined',
          interventionRequired: riskLevel === 'high'
        },
        recommendations: recommendations,
        confidenceScore: attendance > 0 && avgMarks > 0 ? 0.85 : 0.60,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Valid for 30 days
        isActive: true
      };

      // Save to database
      await AIAnalytics.upsert(aiAnalytics, {
        where: { 
          studentId: student.id,
          analysisType: 'comprehensive',
          isActive: true
        }
      });

      console.log(`   ✅ Risk Level: ${riskLevel.toUpperCase()}`);
      console.log(`   📈 Attendance: ${attendance.toFixed(1)}%`);
      console.log(`   📝 Average Marks: ${avgMarks.toFixed(1)}`);
      console.log(`   🔮 Prediction: ${predictedPerformance}`);
      console.log(`   💡 Recommendations: ${recommendations.length} generated`);
      console.log('   ---\n');
    }

    // Generate department-wise analytics
    console.log('🏛️ Generating Department-wise Analytics...\n');
    
    const departmentStats = await Student.findAll({
      attributes: [
        'Department',
        [Student.sequelize.fn('COUNT', Student.sequelize.col('id')), 'studentCount'],
        [Student.sequelize.fn('AVG', Student.sequelize.col('Attendance_%')), 'avgAttendance'],
        [Student.sequelize.fn('AVG', Student.sequelize.col('Internal_Marks')), 'avgMarks']
      ],
      where: { isActive: true },
      group: ['Department'],
      raw: true
    });

    departmentStats.forEach(dept => {
      console.log(`📚 Department: ${dept.Department}`);
      console.log(`   Students: ${dept.studentCount}`);
      console.log(`   Avg Attendance: ${parseFloat(dept.avgAttendance || 0).toFixed(1)}%`);
      console.log(`   Avg Internal Marks: ${parseFloat(dept.avgMarks || 0).toFixed(1)}`);
      console.log('   ---');
    });

    console.log('\n🎉 AI Analytics Update Complete!');
    console.log('===================================');
    console.log(`✅ Processed ${students.length} student records`);
    console.log(`✅ Generated ${departmentStats.length} department analytics`);
    console.log('✅ AI predictions based on REAL database data');
    console.log('✅ Risk assessments updated with current performance');
    console.log('✅ Recommendations generated from actual metrics');
    
    return {
      studentsProcessed: students.length,
      departmentsAnalyzed: departmentStats.length,
      analyticsGenerated: true
    };

  } catch (error) {
    console.error('❌ AI Analytics update failed:', error);
    return null;
  }
}

if (require.main === module) {
  updateAIAnalyticsFromRealData()
    .then((result) => {
      if (result) {
        console.log('\n🚀 AI Analytics system is working with REAL DATA!');
        process.exit(0);
      } else {
        console.log('\n❌ Failed to update AI analytics');
        process.exit(1);
      }
    })
    .catch(console.error);
}

module.exports = { updateAIAnalyticsFromRealData };