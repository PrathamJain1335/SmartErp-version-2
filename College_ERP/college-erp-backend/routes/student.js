const express = require('express');
const { Student, Assignment } = require('../models');
const authMiddleware = require('../utils/auth');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');

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
    const user = await Student.findOne({ where: { Student_ID: req.user.Student_ID } });
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
    // If validation fails, and a file was uploaded, remove it.
    if (req.file) {
      const fs = require('fs');
      fs.unlinkSync(req.file.path);
    }
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { assignmentId } = req.body;
    const student = await Student.findByPk(req.user.Student_ID);
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
      studentId: req.user.Student_ID,
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
    const assignments = await Assignment.findAll({ where: { studentId: req.user.Student_ID } });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
