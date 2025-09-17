const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const AIService = require('../services/AIService');
const NotificationService = require('../services/NotificationService');
const { ChatHistory } = require('../models');
const rateLimit = require('express-rate-limit');

// Rate limiting for chatbot (more restrictive)
const chatbotLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 messages per minute per user
  message: { error: 'Too many chat requests. Please wait a moment.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @route POST /api/chatbot/chat
 * @desc Send message to ERP-specific AI chatbot
 * @access Private (All authenticated users)
 */
router.post('/chat', authenticateToken, chatbotLimit, async (req, res) => {
  try {
    const { message, context } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    if (message.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Message too long. Please keep it under 1000 characters.'
      });
    }

    // Save user message to chat history
    await ChatHistory.create({
      userId,
      message,
      isUserMessage: true,
      context: context || null
    });

    // Get AI response
    const aiResponse = await AIService.getChatbotResponse(message, {
      userId,
      role: userRole,
      context
    });

    // Save AI response to chat history
    await ChatHistory.create({
      userId,
      message: aiResponse,
      isUserMessage: false,
      context: context || null
    });

    // Send real-time notification if this is an important query
    if (aiResponse.includes('urgent') || aiResponse.includes('alert') || aiResponse.includes('warning')) {
      await NotificationService.sendToUser(userId, {
        type: 'ai_alert',
        title: 'AI Alert',
        message: 'Important information from your ERP assistant',
        priority: 'high'
      });
    }

    res.json({
      success: true,
      data: {
        response: aiResponse,
        timestamp: new Date().toISOString(),
        context: context || null
      }
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process your message. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route GET /api/chatbot/history
 * @desc Get chat history for current user
 * @access Private (All authenticated users)
 */
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 50, offset = 0, context } = req.query;

    const whereClause = { userId };
    if (context) {
      whereClause.context = context;
    }

    const chatHistory = await ChatHistory.findAll({
      where: whereClause,
      order: [['createdAt', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: ['id', 'message', 'isUserMessage', 'context', 'createdAt']
    });

    const totalCount = await ChatHistory.count({
      where: whereClause
    });

    res.json({
      success: true,
      data: {
        conversations: chatHistory,
        pagination: {
          total: totalCount,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: (parseInt(offset) + parseInt(limit)) < totalCount
        }
      }
    });

  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve chat history',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route DELETE /api/chatbot/history
 * @desc Clear chat history for current user
 * @access Private (All authenticated users)
 */
router.delete('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { context } = req.query;

    const whereClause = { userId };
    if (context) {
      whereClause.context = context;
    }

    await ChatHistory.destroy({
      where: whereClause
    });

    res.json({
      success: true,
      message: 'Chat history cleared successfully'
    });

  } catch (error) {
    console.error('Clear chat history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear chat history',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route GET /api/chatbot/suggestions
 * @desc Get context-aware suggestion prompts for the chatbot
 * @access Private (All authenticated users)
 */
router.get('/suggestions', authenticateToken, async (req, res) => {
  try {
    const userRole = req.user.role;
    const { context } = req.query;

    let suggestions = [];

    // Role-based suggestions
    if (userRole === 'admin') {
      suggestions = [
        "Show me today's attendance summary",
        "What are the AI insights for this week?",
        "Which students are at risk academically?",
        "Generate performance report for all departments",
        "Show faculty attendance trends"
      ];
    } else if (userRole === 'faculty') {
      suggestions = [
        "What's the attendance rate for my classes?",
        "Show my students' performance analytics",
        "Which students need attention in my subjects?",
        "How can I improve student engagement?",
        "Generate my class performance report"
      ];
    } else if (userRole === 'student') {
      suggestions = [
        "What's my current attendance percentage?",
        "Show my academic performance trends",
        "What subjects do I need to focus on?",
        "When is my next assignment due?",
        "How can I improve my grades?"
      ];
    }

    // Context-specific suggestions
    if (context === 'attendance') {
      suggestions.push(
        "Explain my attendance patterns",
        "What happens if my attendance drops?",
        "Show attendance comparison with classmates"
      );
    } else if (context === 'academics') {
      suggestions.push(
        "Analyze my grade trends",
        "What are my strongest subjects?",
        "Predict my semester performance"
      );
    }

    res.json({
      success: true,
      data: {
        suggestions,
        context: context || 'general',
        role: userRole
      }
    });

  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get suggestions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route GET /api/chatbot/status
 * @desc Get chatbot AI service status
 * @access Private (All authenticated users)
 */
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const aiStatus = await AIService.getServiceStatus();
    
    res.json({
      success: true,
      data: {
        aiEnabled: aiStatus.enabled,
        model: aiStatus.model,
        lastUpdate: aiStatus.lastUpdate,
        responseTime: aiStatus.averageResponseTime,
        features: {
          chatbot: true,
          analytics: aiStatus.analyticsEnabled,
          predictions: aiStatus.predictionsEnabled
        }
      }
    });

  } catch (error) {
    console.error('Chatbot status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get chatbot status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route POST /api/chatbot/feedback
 * @desc Submit feedback for AI responses
 * @access Private (All authenticated users)
 */
router.post('/feedback', authenticateToken, async (req, res) => {
  try {
    const { chatId, rating, feedback } = req.body;
    const userId = req.user.id;

    if (!chatId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Chat ID and rating are required'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Update chat history with feedback
    const updated = await ChatHistory.update(
      { 
        feedback: {
          rating,
          comment: feedback || null,
          submittedAt: new Date()
        }
      },
      {
        where: {
          id: chatId,
          userId,
          isUserMessage: false
        }
      }
    );

    if (updated[0] === 0) {
      return res.status(404).json({
        success: false,
        message: 'Chat message not found'
      });
    }

    // Send notification to admins for low ratings
    if (rating <= 2) {
      await NotificationService.sendToRole('admin', {
        type: 'feedback',
        title: 'Low AI Response Rating',
        message: `User provided low rating (${rating}/5) for AI response`,
        priority: 'medium'
      });
    }

    res.json({
      success: true,
      message: 'Feedback submitted successfully'
    });

  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;