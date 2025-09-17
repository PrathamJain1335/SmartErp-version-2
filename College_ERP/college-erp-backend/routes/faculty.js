const express = require('express');
const { Faculty } = require('../models');
const authMiddleware = require('../utils/auth');

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

module.exports = router;