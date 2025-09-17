const express = require('express');
const { Student, Assignment } = require('../models');
const authMiddleware = require('../utils/auth');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const AIService = require('../utils/aiService');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generate a unique filename with the original extension
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

const router = express.Router();

// Get student details
router.get('/details', authMiddleware, async (req, res) => {
  try {
    const user = await Student.findOne({ where: { Student_ID: req.user.Student_ID } }); // ✅ fixed
    if (!user) return res.status(404).json({ error: 'Student not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit assignment
router.post('/assignments/submit', authMiddleware, upload.single('file'), [
  body('assignmentId').isString(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.file) {
      const fs = require('fs');
      fs.unlinkSync(req.file.path);
    }
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { assignmentId } = req.body;
    const student = await Student.findOne({ where: { Student_ID: req.user.Student_ID } }); // ✅ fixed
    if (!student) {
        if (req.file) {
            const fs = require('fs');
            fs.unlinkSync(req.file.path);
        }
        return res.status(404).json({ error: 'Student not found' });
    }

    const subject = student.Subjects_Assigned?.split(',')[0];
    if (!subject) {
        if (req.file) {
            const fs = require('fs');
            fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ error: 'Student has no assigned subjects' });
    }

    await Assignment.create({
      studentId: student.id, // ✅ use surrogate PK
      subject,
      assignmentNo: parseInt(assignmentId),
      filePath: req.file?.path || '',
      submitted: true,
      submissionDate: new Date(),
    });

    res.json({ message: 'Assignment submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get assignments
router.get('/assignments', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findOne({ where: { Student_ID: req.user.Student_ID } }); // ✅ fixed
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const assignments = await Assignment.findAll({ where: { studentId: student.id } }); // ✅ use surrogate PK
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// AI-powered study recommendations
router.get('/ai/study-recommendations', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findOne({ where: { Student_ID: req.user.Student_ID } }); // ✅ fixed
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const studentData = {
      subjects: student.Subjects_Assigned || '',
      currentGrades: {
        internal: student.Internal_Marks || 0,
        practical: student.Practical_Marks || 0,
        midSem: student.Mid_Sem_Marks || 0,
        endSem: student.End_Sem_Marks || 0
      },
      attendancePercent: student['Attendance_%'] || 0,
      weakAreas: student.Grade === 'F' ? 'Academic performance needs improvement' : 'General improvement areas'
    };

    const recommendations = await AIService.generateStudyRecommendations(studentData);
    res.json({ recommendations });
  } catch (error) {
    console.error('Study recommendations error:', error);
    res.status(500).json({ error: 'Failed to generate study recommendations' });
  }
});

// AI performance prediction
router.get('/ai/performance-prediction', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findOne({ where: { Student_ID: req.user.Student_ID } }); // ✅ fixed
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const studentHistory = {
      pastGrades: {
        internal: student.Internal_Marks || 0,
        practical: student.Practical_Marks || 0,
        midSem: student.Mid_Sem_Marks || 0,
        endSem: student.End_Sem_Marks || 0
      },
      attendanceHistory: [student['Attendance_%'] || 0],
      assignmentScores: [85, 92, 78], // Mock data
      studyHours: 25
    };

    const prediction = await AIService.predictPerformance(studentHistory);
    res.json({ prediction });
  } catch (error) {
    console.error('Performance prediction error:', error);
    res.status(500).json({ error: 'Failed to generate performance prediction' });
  }
});

// AI study plan generator
router.post('/ai/study-plan', authMiddleware, [
  body('examDate').isISO8601(),
  body('subjects').isArray(),
  body('dailyHours').isNumeric(),
  body('learningStyle').isString()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const student = await Student.findOne({ where: { Student_ID: req.user.Student_ID } }); // ✅ fixed
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const { examDate, subjects, dailyHours, learningStyle } = req.body;
    
    const studentProfile = {
      strengths: student.Grade === 'A' ? 'Strong academic performance' : 'Developing academic skills',
      weakAreas: student.Grade === 'F' ? 'Multiple subjects need attention' : student['Attendance_%'] < 75 ? 'Attendance and study consistency' : 'Minor improvements needed',
      dailyHours,
      learningStyle
    };

    const studyPlan = await AIService.generateStudyPlan(studentProfile, examDate, subjects);
    res.json({ studyPlan });
  } catch (error) {
    console.error('Study plan generation error:', error);
    res.status(500).json({ error: 'Failed to generate study plan' });
  }
});

// AI quiz generator
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
    
    res.json({ quiz });
  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({ error: 'Failed to generate quiz' });
  }
});

// AI assignment analysis
router.post('/ai/analyze-assignment', authMiddleware, [
  body('assignmentText').isString().isLength({ min: 10 }),
  body('rubric').optional().isString()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { assignmentText, rubric } = req.body;
    const analysis = await AIService.analyzeAssignment(assignmentText, rubric);
    
    res.json({ analysis });
  } catch (error) {
    console.error('Assignment analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze assignment' });
  }
});

module.exports = router;
