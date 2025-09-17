const express = require('express');
const QRCode = require('qrcode');
const { Student } = require('../models');
const authMiddleware = require('../utils/auth');

const router = express.Router();

// Get timetable
router.get('/timetable', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findByPk(req.user.Student_ID);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    const subjects = student.Subjects_Assigned?.split(',') || [];
    const timetable = subjects.map((subject, index) => ({
      day: ['Monday', 'Wednesday', 'Friday'][index % 3] || 'Monday',
      time: '10:00-12:00',
      subject,
    }));
    res.json({ timetable });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get hall ticket with QR
router.get('/hallticket', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findByPk(req.user.Student_ID);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    const qrData = `StudentID:${student.Student_ID}-Exam:2025-${student.Semester}`;
    const qrCode = await QRCode.toDataURL(qrData);
    res.json({ hallTicket: { qrCode, studentId: student.Student_ID, examDate: '2025-09-15', semester: student.Semester } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;