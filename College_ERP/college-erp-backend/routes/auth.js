const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Student, Faculty } = require('../models');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');

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
    console.error('Registration error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
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
    let user;
    if (role === 'student') {
      user = await Student.findOne({ where: { Email_ID: email } });
    } else if (role === 'faculty') {
      user = await Faculty.findOne({ where: { Email_ID: email } });
    } else if (role === 'admin') {
      if (email === 'admin@jecrc.ac.in' && password === 'admin123') {
        const token = jwt.sign({ id: 'admin-001', role: 'admin', email: 'admin@jecrc.ac.in' }, process.env.JWT_SECRET, { expiresIn: '7d' });
        return res.json({ 
          success: true,
          token, 
          role: 'admin', 
          userId: 'admin-001',
          user: {
            id: 'admin-001',
            name: 'Administrator',
            email: 'admin@jecrc.ac.in',
            role: 'admin'
          }
        });
      }
    }
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or user not found' });
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(401).json({ success: false, message: 'Invalid password' });
    const userId = user.Student_ID || user.Faculty_ID;
    const token = jwt.sign({ id: userId, role, email: user.Email_ID }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      success: true,
      token, 
      role, 
      userId,
      user: {
        id: userId,
        name: user.Full_Name,
        email: user.Email_ID,
        role: role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

router.get('/profile', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

module.exports = router;