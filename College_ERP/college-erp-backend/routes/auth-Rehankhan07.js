const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Student, Faculty } = require('../models');
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../utils/auth'); // Add this line

const router = express.Router();

// Register (for demo, but since data exists, use only if needed)
router.post('/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['student', 'faculty']),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { email, password, role, ...otherFields } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    let user;
    if (role === 'student') {
      user = await Student.create({ ...otherFields, Email_ID: email, password: hashedPassword, role });
    } else if (role === 'faculty') {
      user = await Faculty.create({ ...otherFields, Email_ID: email, password: hashedPassword, role });
    }
    const token = jwt.sign({ id: user.Student_ID || user.Faculty_ID, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty(),
  body('role').isIn(['student', 'faculty', 'admin']),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { email, password, role } = req.body;

    // Demo mode: empty email and password
    if (!email && !password && role === 'student') {
      const demoStudent = await Student.findOne({ where: { Student_ID: '25BCON0001' } }); // Default demo student
      if (demoStudent) {
        const token = jwt.sign({ id: demoStudent.id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token, role: 'student' });
      }
      return res.status(401).json({ error: 'Demo mode unavailable' });
    }

    let user;
    if (role === 'student') {
      user = await Student.findOne({ where: { Email_ID: email } });
    } else if (role === 'faculty') {
      user = await Faculty.findOne({ where: { Email_ID: email } });
    } else if (role === 'admin') {
      if (email === 'admin@jecrc.ac.in' && password === 'admin123') {
        const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token, role: 'admin' });
      }
    }
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(401).json({ error: 'Invalid credentials' });

    // Use appropriate ID field for each role
    const userId = role === 'student' ? user.id : user.Faculty_ID;
    const token = jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Profile endpoint
router.get('/profile', authMiddleware, (req, res) => {
  res.json(req.user);
});

module.exports = router;
