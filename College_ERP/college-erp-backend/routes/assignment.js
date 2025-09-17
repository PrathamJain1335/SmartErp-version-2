// routes/assignment.js
const express = require('express');
const { Assignment } = require('../models');
const authMiddleware = require('../utils/auth');

const router = express.Router();

// Get assignments (for student)
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'student') return res.status(403).json({ error: 'Unauthorized' });
    const assignments = await Assignment.findAll({ where: { studentId: req.user.id } });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;