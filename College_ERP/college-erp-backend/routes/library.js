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

// Get books (with borrow history)
router.get('/books', authMiddleware, async (req, res) => {
  try {
    // Dummy borrow history (add real table later if needed)
    const books = [{ title: 'Python Basics', dueDate: '2025-09-20' }];
    res.json({ books });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Study recommender
router.get('/recommend', authMiddleware, async (req, res) => {
  try {
    initializeOpenAI();
    const student = await Student.findByPk(req.user.Student_ID);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    const prompt = `Recommend study materials for a ${student.Program} student with interests in ${student.Subjects_Assigned?.split(',')[0]}. Output: List of books and topics.`;
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });
    res.json({ recommendations: response.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Recommendation failed' });
  }
});

module.exports = router;