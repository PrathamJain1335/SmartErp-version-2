const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const NotificationService = require('../services/NotificationService');
const { ChatHistory } = require('../models');
const rateLimit = require('express-rate-limit');
const GeminiERPChatbot = require('../services/geminiChatbot');

// Initialize the chatbot instance
const chatbot = new GeminiERPChatbot();

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
      userRole,
      message,
      isUserMessage: true,
      context: context ? (typeof context === 'object' ? JSON.stringify(context) : context) : null
    });

    // Get AI response using Gemini
    const aiResult = await chatbot.processQuery(message, {
      userId,
      role: userRole,
      context
    });

    if (!aiResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to get AI response',
        error: aiResult.error
      });
    }

    // Save AI response to chat history
    await ChatHistory.create({
      userId,
      userRole,
      message: aiResult.response,
      isUserMessage: false,
      context: context ? (typeof context === 'object' ? JSON.stringify(context) : context) : null
    });

    // Send real-time notification if this is an important query
    if (aiResult.response.includes('urgent') || aiResult.response.includes('alert') || aiResult.response.includes('warning')) {
      const notificationService = req.app.get('notificationService');
      await notificationService.sendToUser(userId, {
        type: 'ai_alert',
        title: 'AI Alert',
        message: 'Important information from your ERP assistant',
        priority: 'high'
      });
    }

    res.json({
      success: true,
      data: {
        response: aiResult.response,
        isNavigation: aiResult.isNavigation || false,
        navigationType: aiResult.navigationType || null,
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

    // Get suggestions from Gemini chatbot service
    const suggestions = chatbot.getHelpfulSuggestions(userRole);

    // Add context-specific suggestions
    let contextSuggestions = [];
    if (context === 'attendance') {
      contextSuggestions = [
        "Check attendance records",
        "Open attendance portal",
        "View attendance reports"
      ];
    } else if (context === 'grades') {
      contextSuggestions = [
        "View grade reports",
        "Open grades section",
        "Check academic performance"
      ];
    } else if (context === 'navigation') {
      contextSuggestions = [
        "Open student portal",
        "Navigate to faculty portal",
        "Access admin dashboard"
      ];
    }

    const allSuggestions = [...suggestions, ...contextSuggestions];

    res.json({
      success: true,
      data: {
        suggestions: allSuggestions,
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
    // Check Gemini service status
    const isEnabled = process.env.GEMINI_API_KEY ? true : false;
    
    res.json({
      success: true,
      data: {
        aiEnabled: isEnabled,
        provider: 'Google Gemini',
        useRealAI: isEnabled,
        apiKeyConfigured: !!process.env.GEMINI_API_KEY,
        lastUpdate: new Date().toISOString(),
        features: {
          chatbot: true,
          erpQueries: true,
          navigation: true,
          filtering: true
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
 * @route POST /api/chatbot/retry-xai
 * @desc Retry xAI connection (useful when credits are added)
 * @access Private (Admin only)
 */
router.post('/retry-xai', authenticateToken, async (req, res) => {
  try {
    const userRole = req.user.role;
    
    // Only admin can retry xAI connection
    if (userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can retry xAI connection'
      });
    }
    
    const aiService = req.app.get('aiService');
    if (!aiService || !aiService.switchToXAI) {
      return res.status(400).json({
        success: false,
        message: 'AI service does not support xAI switching'
      });
    }
    
    const success = await aiService.switchToXAI();
    const status = aiService.getStatus();
    
    res.json({
      success: true,
      message: success ? 
        'Successfully switched to xAI Grok' : 
        'xAI still not available, using mock service',
      data: {
        useRealAI: status.useRealAI,
        provider: status.provider,
        lastXAITest: status.lastXAITest
      }
    });
    
  } catch (error) {
    console.error('xAI retry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retry xAI connection',
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
      const notificationService = req.app.get('notificationService');
      await notificationService.sendToRole('admin', {
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

/**
 * @route POST /api/chatbot/public-chat
 * @desc Send message to ERP chatbot (public access, no auth required)
 * @access Public
 */
router.post('/public-chat', chatbotLimit, async (req, res) => {
  try {
    const { message, context } = req.body;

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

    // Use default context for public access
    const publicContext = {
      userId: 'public-user',
      role: context?.userRole || 'student', // Default to student role
      context: context
    };

    // Get AI response using Gemini
    const aiResult = await chatbot.processQuery(message, publicContext);

    if (!aiResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to get AI response',
        error: aiResult.error
      });
    }

    res.json({
      success: true,
      data: {
        response: aiResult.response,
        isNavigation: aiResult.isNavigation || false,
        navigationType: aiResult.navigationType || null,
        timestamp: new Date().toISOString(),
        context: context || null
      }
    });

  } catch (error) {
    console.error('Public chatbot error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process your message. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route GET /api/chatbot/public-suggestions
 * @desc Get chatbot suggestions (public access, no auth required)
 * @access Public
 */
router.get('/public-suggestions', async (req, res) => {
  try {
    const { role = 'student', context } = req.query;

    // Get suggestions from Gemini chatbot service
    const suggestions = chatbot.getHelpfulSuggestions(role);

    // Add context-specific suggestions
    let contextSuggestions = [];
    if (context === 'attendance') {
      contextSuggestions = [
        "How do I check attendance?",
        "Open attendance portal",
        "View attendance reports"
      ];
    } else if (context === 'grades') {
      contextSuggestions = [
        "How do I view grades?",
        "Open grades section",
        "Check academic performance"
      ];
    } else if (context === 'navigation') {
      contextSuggestions = [
        "How do I open student portal?",
        "Navigate to faculty portal",
        "Access admin dashboard"
      ];
    }

    const allSuggestions = [...suggestions, ...contextSuggestions];

    res.json({
      success: true,
      data: {
        suggestions: allSuggestions,
        context: context || 'general',
        role: role
      }
    });

  } catch (error) {
    console.error('Public suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get suggestions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route GET /api/chatbot/health
 * @desc Health check endpoint for chatbot service
 * @access Public
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'Gemini ERP Chatbot is running',
    timestamp: new Date().toISOString(),
    provider: 'Google Gemini',
    apiConfigured: !!process.env.GEMINI_API_KEY
  });
});

module.exports = router;
