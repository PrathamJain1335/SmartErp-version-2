const express = require('express');
const authMiddleware = require('../utils/auth');
const { Feedback } = require('../models');
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

// Submit feedback
router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const { rating, comments } = req.body;
    await Feedback.create({
      studentId: req.user.Student_ID,
      rating,
      comments,
    });
    res.json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Feedback submission failed' });
  }
});

// Get feedback summary
router.get('/summary', authMiddleware, async (req, res) => {
  try {
    initializeOpenAI();
    const allFeedback = await Feedback.findAll();
    const comments = allFeedback.map(f => f.comments).join('. ');
    
    const prompt = `Summarize the following student feedback comments and highlight key areas for improvement: ${comments}.`;
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });
    res.json({ summary: response.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Summary generation failed' });
  }
});

module.exports = router;