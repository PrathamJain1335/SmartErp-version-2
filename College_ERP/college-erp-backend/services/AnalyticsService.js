const { Op } = require('sequelize');

class AnalyticsService {
  constructor() {
    console.log('📈 Analytics Service initialized');
  }

  // Calculate attendance statistics with AI insights
  async getAttendanceAnalytics(studentId = null, dateRange = null) {
    try {
      const db = require('../models');
      
      const whereClause = {};
      if (studentId) whereClause.studentId = studentId;
      if (dateRange) {
        whereClause.date = {
          [Op.between]: [dateRange.startDate, dateRange.endDate]
        };
      }

      const attendanceRecords = await db.Attendance.findAll({
        where: whereClause,
        include: [
          { 
            model: db.Student, 
            attributes: ['id', 'Full_Name', 'Department', 'Section', 'Semester'],
            include: [{ model: db.User, attributes: ['firstName', 'lastName'] }]
          },
          { 
            model: db.Course, 
            attributes: ['id', 'courseName', 'courseCode'] 
          }
        ],
        order: [['date', 'DESC']]
      });

      // Calculate basic statistics
      const totalRecords = attendanceRecords.length;
      const presentCount = attendanceRecords.filter(r => r.status === 'present').length;
      const absentCount = attendanceRecords.filter(r => r.status === 'absent').length;
      const lateCount = attendanceRecords.filter(r => r.status === 'late').length;
      
      const attendancePercentage = totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0;

      // Group by student for individual analytics
      const studentStats = {};
      attendanceRecords.forEach(record => {
        const studentId = record.studentId;
        if (!studentStats[studentId]) {
          studentStats[studentId] = {
            student: record.Student,
            total: 0,
            present: 0,
            absent: 0,
            late: 0
          };
        }
        
        studentStats[studentId].total++;
        if (record.status === 'present') studentStats[studentId].present++;
        if (record.status === 'absent') studentStats[studentId].absent++;
        if (record.status === 'late') studentStats[studentId].late++;
      });

      // Calculate individual percentages and identify at-risk students
      const atRiskStudents = [];
      Object.keys(studentStats).forEach(id => {
        const stats = studentStats[id];
        stats.percentage = (stats.present / stats.total) * 100;
        
        if (stats.percentage < 75) {
          atRiskStudents.push({
            ...stats,
            riskLevel: stats.percentage < 50 ? 'high' : 'medium'
          });
        }
      });

      // Weekly trend analysis
      const weeklyTrends = this.calculateWeeklyTrends(attendanceRecords);

      return {
        overview: {
          totalRecords,
          presentCount,
          absentCount,
          lateCount,
          attendancePercentage: Math.round(attendancePercentage * 100) / 100
        },
        studentStats: Object.values(studentStats),
        atRiskStudents,
        weeklyTrends,
        timestamp: new Date()
      };

    } catch (error) {
      console.error('Attendance analytics error:', error);
      throw new Error('Failed to calculate attendance analytics');
    }
  }

  // Calculate academic performance analytics
  async getAcademicAnalytics(filters = {}) {
    try {
      const db = require('../models');
      
      const whereClause = {};
      if (filters.studentId) whereClause.studentId = filters.studentId;
      if (filters.semester) whereClause.semester = filters.semester;
      if (filters.department) {
        whereClause['$Student.Department$'] = filters.department;
      }

      const grades = await db.Grade.findAll({
        where: whereClause,
        include: [
          { 
            model: db.Student,
            attributes: ['id', 'Full_Name', 'Department', 'Section', 'Semester'],
            include: [{ model: db.User, attributes: ['firstName', 'lastName'] }]
          },
          { 
            model: db.Subject,
            attributes: ['id', 'name', 'code', 'credits']
          }
        ]
      });

      // Calculate grade distributions
      const gradeDistribution = {};
      const studentPerformance = {};
      
      grades.forEach(grade => {
        // Grade distribution
        const gradeValue = grade.grade;
        gradeDistribution[gradeValue] = (gradeDistribution[gradeValue] || 0) + 1;
        
        // Student performance
        const studentId = grade.studentId;
        if (!studentPerformance[studentId]) {
          studentPerformance[studentId] = {
            student: grade.Student,
            grades: [],
            totalMarks: 0,
            totalMaxMarks: 0,
            subjects: 0
          };
        }
        
        studentPerformance[studentId].grades.push(grade);
        studentPerformance[studentId].totalMarks += parseFloat(grade.marks || 0);
        studentPerformance[studentId].totalMaxMarks += parseFloat(grade.maxMarks || 0);
        studentPerformance[studentId].subjects++;
      });

      // Calculate CGPAs and identify at-risk students
      const academicRiskStudents = [];
      Object.keys(studentPerformance).forEach(id => {
        const perf = studentPerformance[id];
        perf.percentage = (perf.totalMarks / perf.totalMaxMarks) * 100;
        perf.cgpa = this.calculateCGPA(perf.percentage);
        
        if (perf.cgpa < 6.0) {
          academicRiskStudents.push({
            ...perf,
            riskLevel: perf.cgpa < 4.0 ? 'high' : 'medium'
          });
        }
      });

      // Subject-wise performance
      const subjectPerformance = this.calculateSubjectPerformance(grades);

      return {
        gradeDistribution,
        studentPerformance: Object.values(studentPerformance),
        academicRiskStudents,
        subjectPerformance,
        averageCGPA: this.calculateAverageCGPA(Object.values(studentPerformance)),
        timestamp: new Date()
      };

    } catch (error) {
      console.error('Academic analytics error:', error);
      throw new Error('Failed to calculate academic analytics');
    }
  }

  // Calculate faculty performance analytics
  async getFacultyAnalytics(facultyId = null) {
    try {
      const db = require('../models');
      
      const whereClause = {};
      if (facultyId) whereClause.facultyId = facultyId;

      const facultyData = await db.Faculty.findAll({
        where: facultyId ? { id: facultyId } : {},
        include: [
          { model: db.User, attributes: ['firstName', 'lastName', 'email'] },
          { model: db.FacultyAttendance },
          { model: db.Attendance, as: 'ClassesTaken' }
        ]
      });

      const analytics = facultyData.map(faculty => {
        // Calculate faculty attendance
        const attendanceRecords = faculty.FacultyAttendances || [];
        const totalDays = attendanceRecords.length;
        const presentDays = attendanceRecords.filter(r => r.status === 'present').length;
        const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

        // Calculate classes taken
        const classesTaken = faculty.ClassesTaken ? faculty.ClassesTaken.length : 0;

        return {
          faculty: {
            id: faculty.id,
            name: `${faculty.User.firstName} ${faculty.User.lastName}`,
            email: faculty.User.email,
            department: faculty.department,
            designation: faculty.designation
          },
          attendance: {
            totalDays,
            presentDays,
            attendancePercentage: Math.round(attendancePercentage * 100) / 100
          },
          performance: {
            classesTaken,
            assignedSections: faculty.assignedSections ? faculty.assignedSections.length : 0,
            subjects: faculty.subjects ? faculty.subjects.length : 0
          }
        };
      });

      return {
        facultyAnalytics: analytics,
        timestamp: new Date()
      };

    } catch (error) {
      console.error('Faculty analytics error:', error);
      throw new Error('Failed to calculate faculty analytics');
    }
  }

  // Generate placement analytics
  async getPlacementAnalytics(filters = {}) {
    try {
      const db = require('../models');
      
      const students = await db.Student.findAll({
        where: filters.department ? { Department: filters.department } : {},
        include: [
          { model: db.User, attributes: ['firstName', 'lastName'] }
        ]
      });

      // Simulated placement data analysis
      const placementStats = students.map(student => {
        const cgpa = parseFloat(student['Attendance_%'] || 0) / 10; // Simulated CGPA calculation
        const placementProbability = this.calculatePlacementProbability(cgpa, student);
        
        return {
          student: {
            id: student.id,
            name: `${student.User.firstName} ${student.User.lastName}`,
            department: student.Department,
            semester: student.Semester
          },
          cgpa,
          placementProbability,
          tier: this.getPlacementTier(placementProbability),
          skills: this.getSkillsAnalysis(student), // This would be enhanced with real skill data
          recommendations: this.getPlacementRecommendations(placementProbability, student)
        };
      });

      // Department-wise statistics
      const departmentStats = this.groupByDepartment(placementStats);

      return {
        placementStats,
        departmentStats,
        averagePlacementRate: placementStats.reduce((sum, s) => sum + s.placementProbability, 0) / placementStats.length,
        timestamp: new Date()
      };

    } catch (error) {
      console.error('Placement analytics error:', error);
      throw new Error('Failed to calculate placement analytics');
    }
  }

  // Helper method to calculate weekly trends
  calculateWeeklyTrends(attendanceRecords) {
    const weeklyData = {};
    
    attendanceRecords.forEach(record => {
      const week = this.getWeekNumber(new Date(record.date));
      if (!weeklyData[week]) {
        weeklyData[week] = { total: 0, present: 0 };
      }
      
      weeklyData[week].total++;
      if (record.status === 'present') {
        weeklyData[week].present++;
      }
    });

    return Object.keys(weeklyData).map(week => ({
      week: parseInt(week),
      attendancePercentage: (weeklyData[week].present / weeklyData[week].total) * 100
    })).sort((a, b) => a.week - b.week);
  }

  // Helper method to calculate CGPA
  calculateCGPA(percentage) {
    if (percentage >= 90) return 10.0;
    if (percentage >= 80) return 9.0;
    if (percentage >= 70) return 8.0;
    if (percentage >= 60) return 7.0;
    if (percentage >= 50) return 6.0;
    if (percentage >= 40) return 5.0;
    return 4.0;
  }

  // Helper method to calculate average CGPA
  calculateAverageCGPA(studentPerformances) {
    const totalCGPA = studentPerformances.reduce((sum, perf) => sum + (perf.cgpa || 0), 0);
    return totalCGPA / studentPerformances.length;
  }

  // Helper method to calculate subject performance
  calculateSubjectPerformance(grades) {
    const subjectStats = {};
    
    grades.forEach(grade => {
      const subjectId = grade.subjectId;
      const subject = grade.Subject;
      
      if (!subjectStats[subjectId]) {
        subjectStats[subjectId] = {
          subject,
          totalStudents: 0,
          averageMarks: 0,
          totalMarks: 0,
          passCount: 0
        };
      }
      
      subjectStats[subjectId].totalStudents++;
      subjectStats[subjectId].totalMarks += parseFloat(grade.marks || 0);
      if (parseFloat(grade.marks || 0) >= 40) {
        subjectStats[subjectId].passCount++;
      }
    });

    Object.keys(subjectStats).forEach(id => {
      const stats = subjectStats[id];
      stats.averageMarks = stats.totalMarks / stats.totalStudents;
      stats.passPercentage = (stats.passCount / stats.totalStudents) * 100;
    });

    return Object.values(subjectStats);
  }

  // Helper method to calculate placement probability
  calculatePlacementProbability(cgpa, student) {
    let probability = cgpa * 10; // Base probability from CGPA
    
    // Add factors based on department
    if (student.Department === 'Computer Science') probability += 10;
    if (student.Department === 'Electronics') probability += 5;
    
    // Add factors based on attendance
    const attendance = parseFloat(student['Attendance_%'] || 0);
    if (attendance > 85) probability += 10;
    else if (attendance < 75) probability -= 15;
    
    return Math.min(Math.max(probability, 0), 100);
  }

  // Helper method to get placement tier
  getPlacementTier(probability) {
    if (probability >= 85) return 'top-tier';
    if (probability >= 70) return 'high';
    if (probability >= 50) return 'medium';
    return 'low';
  }

  // Helper method for skills analysis
  getSkillsAnalysis(student) {
    // This would be enhanced with real skill assessment data
    return [
      { skill: 'Programming', level: 'medium', demand: 'high' },
      { skill: 'Communication', level: 'medium', demand: 'high' },
      { skill: 'Problem Solving', level: 'high', demand: 'high' }
    ];
  }

  // Helper method for placement recommendations
  getPlacementRecommendations(probability, student) {
    const recommendations = [];
    
    if (probability < 70) {
      recommendations.push('Focus on improving academic performance');
      recommendations.push('Enhance technical skills through projects');
    }
    
    if (parseFloat(student['Attendance_%'] || 0) < 80) {
      recommendations.push('Improve attendance consistency');
    }
    
    recommendations.push('Participate in placement training programs');
    
    return recommendations;
  }

  // Helper method to group by department
  groupByDepartment(data) {
    const departmentStats = {};
    
    data.forEach(item => {
      const dept = item.student.department;
      if (!departmentStats[dept]) {
        departmentStats[dept] = {
          department: dept,
          totalStudents: 0,
          averagePlacementRate: 0,
          totalPlacementProbability: 0
        };
      }
      
      departmentStats[dept].totalStudents++;
      departmentStats[dept].totalPlacementProbability += item.placementProbability;
    });

    Object.keys(departmentStats).forEach(dept => {
      const stats = departmentStats[dept];
      stats.averagePlacementRate = stats.totalPlacementProbability / stats.totalStudents;
    });

    return Object.values(departmentStats);
  }

  // Helper method to get week number
  getWeekNumber(date) {
    const firstJan = new Date(date.getFullYear(), 0, 1);
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayOfYear = ((today - firstJan + 86400000) / 86400000);
    return Math.ceil(dayOfYear / 7);
  }
}

module.exports = AnalyticsService;