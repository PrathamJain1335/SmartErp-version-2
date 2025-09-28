const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Student, Faculty, Department, Section } = require('../models/newModels');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const { Op } = require('sequelize');

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

// Login - Updated for new models with Roll No support
router.post('/login', [
  body('identifier').notEmpty().withMessage('Email or Roll Number is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('role').isIn(['student', 'faculty', 'admin']).withMessage('Valid role is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      message: 'Validation failed', 
      errors: errors.array() 
    });
  }
  
  try {
    const { identifier, password, role } = req.body; // identifier can be email or roll number
    let user = null;
    
    if (role === 'student') {
      // Try to find by email first, then by roll number
      user = await Student.findOne({ 
        where: { 
          [Op.or]: [
            { email: identifier },
            { rollNo: identifier }
          ],
          isActive: true
        }
      });
    } else if (role === 'faculty') {
      user = await Faculty.findOne({ 
        where: { 
          [Op.or]: [
            { email: identifier },
            { id: identifier }
          ],
          isActive: true
        }
      });
    } else if (role === 'admin') {
      // Admin login (hardcoded for now)
      if (identifier === 'admin@jecrc.ac.in' && password === 'admin123') {
        const token = jwt.sign({ 
          id: 'admin-001', 
          role: 'admin', 
          email: 'admin@jecrc.ac.in' 
        }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        return res.json({ 
          success: true,
          token, 
          role: 'admin', 
          userId: 'admin-001',
          user: {
            id: 'admin-001',
            name: 'System Administrator',
            email: 'admin@jecrc.ac.in',
            role: 'admin',
            department: 'Administration'
          }
        });
      }
    }
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found or inactive. Please check your credentials.' 
      });
    }
    
    // Verify password
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid password. Please try again.' 
      });
    }
    
    // Update last login
    await user.update({ lastLogin: new Date() });
    
    // Generate JWT token
    const userId = role === 'student' ? user.rollNo : user.id;
    const userEmail = user.email;
    
    const token = jwt.sign({ 
      id: userId, 
      role, 
      email: userEmail,
      rollNo: user.rollNo, // For students
      Faculty_ID: user.id  // For faculty
    }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    // Prepare user response
    const userResponse = {
      id: userId,
      name: `${user.firstName} ${user.lastName}`,
      fullName: `${user.firstName} ${user.lastName}`,
      email: userEmail,
      role: role,
      department: 'JECRC University',
      departmentCode: 'JECRC'
    };
    
    // Add role-specific fields
    if (role === 'student') {
      userResponse.rollNo = user.rollNo;
      userResponse.enrollmentNo = user.enrollmentNo;
      userResponse.currentSemester = user.currentSemester;
      userResponse.section = 'Section A';
      userResponse.program = user.program;
      userResponse.cgpa = user.cgpa;
      userResponse.attendancePercentage = user.attendancePercentage;
    } else if (role === 'faculty') {
      userResponse.employeeId = user.employeeId;
      userResponse.designation = user.designation;
      userResponse.isHOD = user.isHOD;
      userResponse.isClassAdvisor = user.isClassAdvisor;
      userResponse.officeRoom = user.officeRoom;
    }
    
    console.log(`✅ Login successful: ${role} - ${userResponse.name} (${userId})`);
    
    res.json({ 
      success: true,
      token, 
      role, 
      userId,
      user: userResponse
    });
    
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Login failed due to server error. Please try again.',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
});

// Get user profile with additional information
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const { role, id } = req.user;
    let user = null;
    
    if (role === 'student') {
      user = await Student.findOne({
        where: { rollNo: id, isActive: true },
        include: [
          {
            model: Department,
            as: 'department',
            attributes: ['departmentName', 'departmentCode']
          },
          {
            model: Section,
            as: 'section',
            attributes: ['sectionName', 'sectionCode', 'semester', 'academicYear']
          }
        ],
        attributes: { exclude: ['password'] }
      });
    } else if (role === 'faculty') {
      user = await Faculty.findOne({
        where: { id: id, isActive: true },
        include: [
          {
            model: Department,
            as: 'department',
            attributes: ['departmentName', 'departmentCode']
          }
        ],
        attributes: { exclude: ['password'] }
      });
    } else if (role === 'admin') {
      return res.json({
        success: true,
        user: {
          id: 'admin-001',
          name: 'System Administrator',
          email: 'admin@jecrc.ac.in',
          role: 'admin',
          department: 'Administration'
        }
      });
    }
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }
    
    res.json({
      success: true,
      user: user
    });
    
  } catch (error) {
    console.error('❌ Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;