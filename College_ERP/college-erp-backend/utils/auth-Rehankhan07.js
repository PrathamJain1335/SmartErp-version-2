// utils/auth.js
const jwt = require('jsonwebtoken');
const { Student, Faculty } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user;
    if (decoded.role === 'student') {
      user = await Student.findByPk(decoded.id);
    } else if (decoded.role === 'faculty') {
      user = await Faculty.findByPk(decoded.id);
    } else if (decoded.role === 'admin') {
      user = { role: 'admin' };
    }
    if (!user) return res.status(401).json({ error: 'Invalid token' });
    
    // Handle different user types
    if (decoded.role === 'admin') {
      req.user = { role: 'admin' };
    } else {
      req.user = { ...user.dataValues, role: decoded.role };
    }
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token invalid' });
  }
};

module.exports = authMiddleware;