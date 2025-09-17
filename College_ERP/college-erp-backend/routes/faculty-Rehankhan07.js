const express = require('express');
const { Faculty, Student } = require('../models');
const authMiddleware = require('../utils/auth');
const { body, validationResult } = require('express-validator');
const AIService = require('../utils/aiService');

const router = express.Router();

// Get faculty details
router.get('/details', authMiddleware, async (req, res) => {
  try {
    const user = await Faculty.findOne({ where: { Faculty_ID: req.user.Faculty_ID } });
    if (!user) return res.status(404).json({ error: 'Faculty not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get students assigned to faculty
router.get('/students', authMiddleware, async (req, res) => {
  try {
    const faculty = await Faculty.findByPk(req.user.Faculty_ID);
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });
    
    // Get students from the same department
    const students = await Student.findAll({ 
      where: { Department: faculty.Department },
      attributes: ['Student_ID', 'Full_Name', 'Email_ID', 'Department', 'Semester', 'Attendance_%', 'Grade', 'Internal_Marks', 'Practical_Marks']
    });
    
    res.json(students);
  } catch (err) {
    console.error('Get students error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// AI Teaching Insights
router.get('/ai/teaching-insights', authMiddleware, async (req, res) => {
  try {
    const faculty = await Faculty.findByPk(req.user.Faculty_ID);
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });

    const students = await Student.findAll({ 
      where: { Department: faculty.Department },
      attributes: ['Student_ID', 'Full_Name', 'Internal_Marks', 'Practical_Marks', 'Mid_Sem_Marks', 'Grade', 'Attendance_%']
    });

    const classData = {
      subject: faculty.Subjects_Assigned?.split(',')[0] || 'General Subject',
      studentPerformances: students.map(s => ({
        studentId: s.Student_ID,
        name: s.Full_Name,
        avgScore: ((s.Internal_Marks || 0) + (s.Practical_Marks || 0) + (s.Mid_Sem_Marks || 0)) / 3,
        attendance: s['Attendance_%'] || 0,
        grade: s.Grade || 'N/A'
      })),
      commonMistakes: 'Students struggling with complex problem-solving and practical applications',
      topicsCovered: faculty.Subjects_Assigned || 'Various topics'
    };

    const insights = await AIService.generateTeachingInsights(classData);
    res.json({ insights, classData });
  } catch (error) {
    console.error('Teaching insights error:', error);
    res.status(500).json({ error: 'Failed to generate teaching insights' });
  }
});

// AI Assignment Grading Assistant
router.post('/ai/grade-assignment', authMiddleware, [
  body('assignmentText').isString().isLength({ min: 10 }),
  body('rubric').optional().isString(),
  body('studentId').isString()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { assignmentText, rubric, studentId } = req.body;
    
    const student = await Student.findByPk(studentId);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const analysis = await AIService.analyzeAssignment(assignmentText, rubric);
    
    res.json({ 
      analysis,
      student: {
        id: student.Student_ID,
        name: student.Full_Name,
        department: student.Department
      }
    });
  } catch (error) {
    console.error('Assignment grading error:', error);
    res.status(500).json({ error: 'Failed to analyze assignment' });
  }
});

// AI Student Performance Analysis
router.get('/ai/student-performance/:studentId', authMiddleware, async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findByPk(studentId);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const studentHistory = {
      pastGrades: {
        internal: student.Internal_Marks || 0,
        practical: student.Practical_Marks || 0,
        midSem: student.Mid_Sem_Marks || 0,
        endSem: student.End_Sem_Marks || 0
      },
      attendanceHistory: [student['Attendance_%'] || 0],
      assignmentScores: [85, 92, 78], // Mock data - replace with actual scores
      studyHours: 25 // Mock data
    };

    const prediction = await AIService.predictPerformance(studentHistory);
    
    res.json({ 
      prediction,
      student: {
        id: student.Student_ID,
        name: student.Full_Name,
        currentGrade: student.Grade,
        attendance: student['Attendance_%']
      }
    });
  } catch (error) {
    console.error('Student performance analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze student performance' });
  }
});

// AI Quiz Generator for Faculty
router.post('/ai/generate-quiz', authMiddleware, [
  body('subject').isString(),
  body('topics').isArray(),
  body('difficulty').isIn(['easy', 'medium', 'hard']),
  body('count').isInt({ min: 1, max: 20 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { subject, topics, difficulty, count } = req.body;
    const quiz = await AIService.generateQuizQuestions(subject, topics, difficulty, count);
    
    res.json({ quiz, metadata: { subject, difficulty, count, createdAt: new Date() } });
  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
});

// Get class analytics
router.get('/analytics/class-performance', authMiddleware, async (req, res) => {
  try {
    const faculty = await Faculty.findByPk(req.user.Faculty_ID);
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });

    const students = await Student.findAll({ 
      where: { Department: faculty.Department },
      attributes: ['Student_ID', 'Full_Name', 'Internal_Marks', 'Practical_Marks', 'Mid_Sem_Marks', 'End_Sem_Marks', 'Grade', 'Attendance_%']
    });

    const analytics = {
      totalStudents: students.length,
      averageAttendance: students.reduce((sum, s) => sum + (s['Attendance_%'] || 0), 0) / students.length,
      gradeDistribution: {
        A: students.filter(s => s.Grade === 'A').length,
        B: students.filter(s => s.Grade === 'B').length,
        C: students.filter(s => s.Grade === 'C').length,
        D: students.filter(s => s.Grade === 'D').length,
        F: students.filter(s => s.Grade === 'F').length
      },
      performanceTrends: students.map(s => ({
        studentId: s.Student_ID,
        name: s.Full_Name,
        avgMarks: ((s.Internal_Marks || 0) + (s.Practical_Marks || 0) + (s.Mid_Sem_Marks || 0)) / 3,
        attendance: s['Attendance_%'] || 0
      })),
      lowPerformers: students.filter(s => (s['Attendance_%'] || 0) < 75 || s.Grade === 'F')
        .map(s => ({ id: s.Student_ID, name: s.Full_Name, attendance: s['Attendance_%'], grade: s.Grade }))
    };

    res.json(analytics);
  } catch (error) {
    console.error('Class analytics error:', error);
    res.status(500).json({ error: 'Failed to get class analytics' });
  }
});

module.exports = router;