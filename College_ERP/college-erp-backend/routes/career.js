const express = require('express');
const { Student } = require('../models');
const authMiddleware = require('../utils/auth');
const axios = require('axios');

const router = express.Router();

// Make xAI API request
async function makeXAIRequest(prompt) {
  if (!process.env.XAI_API_KEY) {
    throw new Error('XAI_API_KEY environment variable is not set.');
  }
  
  const response = await axios.post('https://api.x.ai/v1/chat/completions', {
    model: "grok-beta",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 500,
    temperature: 0.7
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    timeout: 30000
  });
  
  return response.data;
}

// Get career advice
router.get('/career-advice', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findByPk(req.user.Student_ID);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    const prompt = `As Grok, give career advice for a ${student.Program} student with interests in ${student.Subjects_Assigned?.split(',')[0]}. Output: paragraph with a list of roles.`;
    const response = await makeXAIRequest(prompt);
    res.json({ advice: response.choices[0].message.content });
  } catch (err) {
    console.error(err);
    if (err.response?.status === 403) {
      res.status(503).json({ error: 'xAI service temporarily unavailable. Please add credits to your xAI account.' });
    } else {
      res.status(500).json({ error: 'Career advice failed' });
    }
  }
});

module.exports = router;