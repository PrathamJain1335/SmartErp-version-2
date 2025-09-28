const express = require('express');
const router = express.Router();
const { Student, Faculty, Course, Enrollment } = require('../models');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { facultyStudentAccessControl } = require('../middleware/facultyAccessControl');
const NotificationService = require('../services/NotificationService');
const DataSyncService = require('../services/DataSyncService');
const { Op } = require('sequelize');

/**
 * @route GET /api/grades/student/:studentId
 * @desc Get student grades
 * @access Private (Admin, Faculty with access, Student themselves)
 */
router.get('/student/:studentId', 
  authenticateToken,
  facultyStudentAccessControl,
  async (req, res) => {
    try {
      const { studentId } = req.params;
      const { semester } = req.query;
      
      // Students can only view their own grades
      if (req.user.role === 'student' && req.user.id !== studentId) {
        return res.status(403).json({
          success: false,
          message: 'You can only view your own grades'
        });
      }
      
      // Faculty access control check
      if (req.user.role === 'faculty' && req.canAccessStudent) {
        const canAccess = await req.canAccessStudent(studentId);
        if (!canAccess) {
          return res.status(403).json({
            success: false,
            message: 'Access denied. You can only view students from your assigned sections.'
          });
        }
      }
      
      // For demo purposes, generate mock data specific to this student
      const { generateStudentSpecificData } = require('../utils/mockDataGenerator');
      const mockData = generateStudentSpecificData(studentId, studentId);
      
      // Use mock grades data
      const courseGrades = mockData.grades;
      
      // Calculate totals
      const totalCredits = courseGrades.reduce((sum, grade) => sum + grade.credits, 0);
      const gradePoints = { 'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'F': 0.0 };
      const weightedGradePoints = courseGrades.reduce((sum, grade) => {
        return sum + (gradePoints[grade.grade] || 0) * grade.credits;
      }, 0);
      
      const cgpa = totalCredits > 0 ? (weightedGradePoints / totalCredits).toFixed(2) : 0;
      
      res.json({
        success: true,
        data: {
          student: {
            id: studentId,
            name: `Student ${studentId}`,
            department: 'Computer Science Engineering',
            section: 'A',
            currentSemester: 5
          },
          currentGrades: {
            internal: 75,
            practical: 80,
            midSem: 78,
            endSem: 82,
            overallGrade: 'B'
          },
          courseGrades,
          summary: {
            totalCredits,
            cgpa: parseFloat(cgpa),
            completedCourses: courseGrades.length,
            activeCourses: courseGrades.length
          }
        }
      });
      
    } catch (error) {
      console.error('Get student grades error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch student grades',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route PUT /api/grades/student/:studentId
 * @desc Update student grades
 * @access Private (Admin, Faculty with access)
 */
router.put('/student/:studentId', 
  authenticateToken,
  authorizeRoles(['admin', 'faculty']),
  facultyStudentAccessControl,
  async (req, res) => {
    try {
      const { studentId } = req.params;
      const { 
        internalMarks, 
        practicalMarks, 
        midSemMarks, 
        endSemMarks, 
        courseGrades = [],
        semester 
      } = req.body;
      
      // Faculty access control check
      if (req.user.role === 'faculty' && req.canAccessStudent) {
        const canAccess = await req.canAccessStudent(studentId);
        if (!canAccess) {
          return res.status(403).json({
            success: false,
            message: 'Access denied. You can only update grades for students from your assigned sections.'
          });
        }
      }
      
      const student = await Student.findByPk(studentId);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }
      
      // Update main grade fields
      const updateData = {};
      if (internalMarks !== undefined) updateData.Internal_Marks = internalMarks;
      if (practicalMarks !== undefined) updateData.Practical_Marks = practicalMarks;
      if (midSemMarks !== undefined) updateData.Mid_Sem_Marks = midSemMarks;
      if (endSemMarks !== undefined) updateData.End_Sem_Marks = endSemMarks;
      
      // Calculate overall grade if we have end semester marks
      if (endSemMarks !== undefined) {
        const total = (internalMarks || 0) + (practicalMarks || 0) + (midSemMarks || 0) + endSemMarks;
        const percentage = total / 4; // Assuming each component is out of 100
        
        let grade = 'F';
        if (percentage >= 90) grade = 'A';
        else if (percentage >= 80) grade = 'B';
        else if (percentage >= 70) grade = 'C';
        else if (percentage >= 60) grade = 'D';
        
        updateData.Grade = grade;
      }
      
      await student.update(updateData);
      
      // Update course-specific grades
      for (const courseGrade of courseGrades) {
        const { courseId, finalMarks, grade } = courseGrade;
        
        await Enrollment.update(
          {
            finalMarks: finalMarks,
            finalGrade: grade,
            status: grade && grade !== 'F' ? 'completed' : 'active'
          },
          {
            where: {
              studentId: studentId,
              courseId: courseId
            }
          }
        );
      }
      
      // Send real-time notification
      const dataSyncService = req.app.get('dataSyncService');
      if (dataSyncService) {
        dataSyncService.syncGradeUpdate({
          studentId,
          courseId: courseGrades[0]?.courseId,
          subject: courseGrades[0]?.courseName,
          marks: endSemMarks || internalMarks,
          grade: updateData.Grade,
          facultyId: req.user.role === 'faculty' ? req.user.id : null,
          section: student.Section,
          department: student.Department
        });
      }
      
      // Send notification to student
      const notificationService = req.app.get('notificationService');
      if (notificationService) {
        await notificationService.sendToUser(studentId, {
          type: 'success',
          title: 'Grades Updated',
          message: `Your grades have been updated${semester ? ` for semester ${semester}` : ''}.`,
          priority: 'medium'
        });
      }
      
      res.json({
        success: true,
        message: 'Grades updated successfully',
        data: {
          updatedFields: Object.keys(updateData),
          coursesUpdated: courseGrades.length
        }
      });
      
    } catch (error) {
      console.error('Update student grades error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update student grades',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route GET /api/grades/class/:sectionId
 * @desc Get class-wise grade summary
 * @access Private (Admin, Faculty with access)
 */
router.get('/class/:sectionId', 
  authenticateToken,
  authorizeRoles(['admin', 'faculty']),
  facultyStudentAccessControl,
  async (req, res) => {
    try {
      const { sectionId } = req.params;
      const { semester } = req.query;
      
      // Faculty access control check
      if (req.user.role === 'faculty' && req.facultyAccess) {
        if (!req.facultyAccess.sections.includes(sectionId)) {
          return res.status(403).json({
            success: false,
            message: 'Access denied. You can only view grades for your assigned sections.'
          });
        }
      }
      
      let whereClause = { Section: sectionId };
      if (semester) {
        whereClause.Semester = parseInt(semester);
      }
      
      const students = await Student.findAll({
        where: whereClause,
        attributes: ['id', 'Student_ID', 'Full_Name', 'Internal_Marks', 'Practical_Marks', 
                    'Mid_Sem_Marks', 'End_Sem_Marks', 'Grade', 'Attendance_%'],
        include: [
          {
            model: Enrollment,
            where: { status: 'active' },
            required: false,
            include: [
              {
                model: Course,
                attributes: ['courseName', 'courseCode', 'credits']
              }
            ]
          }
        ],
        order: [['Full_Name', 'ASC']]
      });
      
      // Calculate class statistics
      const totalStudents = students.length;
      const gradeDistribution = {};
      const attendanceStats = [];
      
      let totalInternal = 0, totalPractical = 0, totalMidSem = 0, totalEndSem = 0;
      let validInternalCount = 0, validPracticalCount = 0, validMidSemCount = 0, validEndSemCount = 0;
      
      students.forEach(student => {
        // Grade distribution
        const grade = student.Grade || 'N/A';
        gradeDistribution[grade] = (gradeDistribution[grade] || 0) + 1;
        
        // Attendance stats
        const attendance = student['Attendance_%'] || 0;
        attendanceStats.push(attendance);
        
        // Average calculations
        if (student.Internal_Marks) {
          totalInternal += student.Internal_Marks;
          validInternalCount++;
        }
        if (student.Practical_Marks) {
          totalPractical += student.Practical_Marks;
          validPracticalCount++;
        }
        if (student.Mid_Sem_Marks) {
          totalMidSem += student.Mid_Sem_Marks;
          validMidSemCount++;
        }
        if (student.End_Sem_Marks) {
          totalEndSem += student.End_Sem_Marks;
          validEndSemCount++;
        }
      });
      
      const averages = {
        internal: validInternalCount > 0 ? (totalInternal / validInternalCount).toFixed(2) : 0,
        practical: validPracticalCount > 0 ? (totalPractical / validPracticalCount).toFixed(2) : 0,
        midSem: validMidSemCount > 0 ? (totalMidSem / validMidSemCount).toFixed(2) : 0,
        endSem: validEndSemCount > 0 ? (totalEndSem / validEndSemCount).toFixed(2) : 0
      };
      
      const avgAttendance = attendanceStats.length > 0 ?
        (attendanceStats.reduce((sum, att) => sum + att, 0) / attendanceStats.length).toFixed(2) : 0;
      
      // Performance analysis
      const highPerformers = students.filter(s => ['A', 'B'].includes(s.Grade)).length;
      const lowPerformers = students.filter(s => ['D', 'F'].includes(s.Grade)).length;
      const atRiskStudents = students.filter(s => 
        s['Attendance_%'] < 75 || s.Grade === 'F' || s.End_Sem_Marks < 40
      );
      
      res.json({
        success: true,
        data: {
          section: {
            id: sectionId,
            semester: semester || 'All'
          },
          overview: {
            totalStudents,
            highPerformers,
            lowPerformers,
            atRiskCount: atRiskStudents.length
          },
          statistics: {
            gradeDistribution,
            averages,
            avgAttendance: parseFloat(avgAttendance)
          },
          students: students.map(student => ({
            id: student.Student_ID,
            name: student.Full_Name,
            grades: {
              internal: student.Internal_Marks,
              practical: student.Practical_Marks,
              midSem: student.Mid_Sem_Marks,
              endSem: student.End_Sem_Marks,
              overall: student.Grade
            },
            attendance: student['Attendance_%'],
            courses: student.Enrollments?.map(e => ({
              name: e.Course?.courseName,
              code: e.Course?.courseCode,
              credits: e.Course?.credits
            })) || []
          })),
          atRiskStudents: atRiskStudents.map(student => ({
            id: student.Student_ID,
            name: student.Full_Name,
            reasons: [
              ...(student['Attendance_%'] < 75 ? ['Low Attendance'] : []),
              ...(student.Grade === 'F' ? ['Failing Grade'] : []),
              ...(student.End_Sem_Marks < 40 ? ['Poor End Semester Performance'] : [])
            ]
          }))
        }
      });
      
    } catch (error) {
      console.error('Get class grades error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch class grades',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

/**
 * @route GET /api/grades/analytics/department/:department
 * @desc Get department-wise grade analytics
 * @access Private (Admin only)
 */
router.get('/analytics/department/:department', 
  authenticateToken,
  authorizeRoles(['admin']),
  async (req, res) => {
    try {
      const { department } = req.params;
      const { semester, year } = req.query;
      
      let whereClause = { Department: department };
      if (semester) whereClause.Semester = parseInt(semester);
      
      const students = await Student.findAll({
        where: whereClause,
        attributes: ['Section', 'Grade', 'Internal_Marks', 'Practical_Marks', 
                    'Mid_Sem_Marks', 'End_Sem_Marks', 'Attendance_%'],
        include: [
          {
            model: Enrollment,
            include: [
              {
                model: Course,
                attributes: ['courseName', 'credits']
              }
            ]
          }
        ]
      });
      
      // Section-wise analysis
      const sectionAnalysis = {};
      students.forEach(student => {
        const section = student.Section;
        if (!sectionAnalysis[section]) {
          sectionAnalysis[section] = {
            students: 0,
            gradeDistribution: {},
            totalMarks: { internal: 0, practical: 0, midSem: 0, endSem: 0 },
            validCounts: { internal: 0, practical: 0, midSem: 0, endSem: 0 },
            attendanceSum: 0
          };
        }
        
        const sectionData = sectionAnalysis[section];
        sectionData.students++;
        
        // Grade distribution
        const grade = student.Grade || 'N/A';
        sectionData.gradeDistribution[grade] = (sectionData.gradeDistribution[grade] || 0) + 1;
        
        // Marks aggregation
        if (student.Internal_Marks) {
          sectionData.totalMarks.internal += student.Internal_Marks;
          sectionData.validCounts.internal++;
        }
        if (student.Practical_Marks) {
          sectionData.totalMarks.practical += student.Practical_Marks;
          sectionData.validCounts.practical++;
        }
        if (student.Mid_Sem_Marks) {
          sectionData.totalMarks.midSem += student.Mid_Sem_Marks;
          sectionData.validCounts.midSem++;
        }
        if (student.End_Sem_Marks) {
          sectionData.totalMarks.endSem += student.End_Sem_Marks;
          sectionData.validCounts.endSem++;
        }
        
        sectionData.attendanceSum += student['Attendance_%'] || 0;
      });
      
      // Calculate averages
      Object.keys(sectionAnalysis).forEach(section => {
        const data = sectionAnalysis[section];
        data.averages = {
          internal: data.validCounts.internal > 0 ? 
            (data.totalMarks.internal / data.validCounts.internal).toFixed(2) : 0,
          practical: data.validCounts.practical > 0 ? 
            (data.totalMarks.practical / data.validCounts.practical).toFixed(2) : 0,
          midSem: data.validCounts.midSem > 0 ? 
            (data.totalMarks.midSem / data.validCounts.midSem).toFixed(2) : 0,
          endSem: data.validCounts.endSem > 0 ? 
            (data.totalMarks.endSem / data.validCounts.endSem).toFixed(2) : 0,
          attendance: (data.attendanceSum / data.students).toFixed(2)
        };
      });
      
      // Department totals
      const totalStudents = students.length;
      const overallGradeDistribution = {};
      students.forEach(student => {
        const grade = student.Grade || 'N/A';
        overallGradeDistribution[grade] = (overallGradeDistribution[grade] || 0) + 1;
      });
      
      res.json({
        success: true,
        data: {
          department,
          semester: semester || 'All',
          overview: {
            totalStudents,
            totalSections: Object.keys(sectionAnalysis).length,
            gradeDistribution: overallGradeDistribution
          },
          sectionAnalysis,
          trends: {
            // Could add historical comparison here
            passRate: totalStudents > 0 ? 
              (((overallGradeDistribution['A'] || 0) + 
                (overallGradeDistribution['B'] || 0) + 
                (overallGradeDistribution['C'] || 0) + 
                (overallGradeDistribution['D'] || 0)) / totalStudents * 100).toFixed(2) : 0,
            excellenceRate: totalStudents > 0 ? 
              (((overallGradeDistribution['A'] || 0) + 
                (overallGradeDistribution['B'] || 0)) / totalStudents * 100).toFixed(2) : 0
          }
        }
      });
      
    } catch (error) {
      console.error('Get department grade analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch department analytics',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

module.exports = router;