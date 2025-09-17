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

// Get fees
router.get('/', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findByPk(req.user.Student_ID);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    const fees = {
      semesterFee: student.Semester_Fee,
      hostelFee: student.Hostel_Fee,
      otherFees: student.Other_Fees,
      totalDue: student.Total_Due,
      paidStatus: student.Paid_Status,
    };
    res.json(fees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Fee defaulter prediction
router.get('/defaulter-prediction', authMiddleware, async (req, res) => {
  try {
    initializeOpenAI();
    const student = await Student.findByPk(req.user.Student_ID);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    const prompt = `Predict if this student is a fee defaulter based on paid status: ${student.Paid_Status}, total due: ${student.Total_Due}, attendance: ${student.Attendance_Percent}%. Output: Yes/No with reason.`;
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });
    res.json({ prediction: response.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Prediction failed' });
  }
});

// Fee payment simulation
router.post('/pay', authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;
    const student = await Student.findByPk(req.user.Student_ID);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    if (amount > student.Total_Due) return res.status(400).json({ error: 'Amount exceeds due' });
    const newTotalDue = student.Total_Due - amount;
    await student.update({ Total_Due: newTotalDue, Paid_Status: newTotalDue > 0 ? 'Partial' : 'Paid' });
    res.json({ message: 'Payment successful', newTotalDue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Payment failed' });
  }
});

module.exports = router;