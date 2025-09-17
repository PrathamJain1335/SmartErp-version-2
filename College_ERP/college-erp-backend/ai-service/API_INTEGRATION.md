# College ERP AI Service - API Integration Guide

## Overview

The College ERP AI Service provides two main functionalities:
1. **AI Chatbot** - Interactive assistant for college-related queries
2. **AI Portfolio Generator** - Automated student portfolio creation

The service runs on `http://localhost:8001` and provides RESTful APIs.

## Quick Start

### 1. Start the AI Service

```bash
cd ai-service
python start.py
```

The service will be available at:
- **API Base URL**: `http://localhost:8001`
- **API Documentation**: `http://localhost:8001/docs`
- **Health Check**: `http://localhost:8001/health`

### 2. Verify Service Status

```javascript
// Check if AI service is running
fetch('http://localhost:8001/health')
  .then(response => response.json())
  .then(data => {
    console.log('AI Service Status:', data);
    // Expected response:
    // {
    //   "status": "healthy",
    //   "chatbot_ready": true,
    //   "portfolio_generator_ready": true,
    //   "timestamp": "2025-09-15T12:36:53.123456"
    // }
  });
```

## API Endpoints

### 1. AI Chatbot APIs

#### POST `/chat` - Send Message to AI Chatbot

Send a message to the AI assistant and receive a response.

**Request:**
```javascript
const chatWithAI = async (message, userId = null, conversationId = null) => {
  const response = await fetch('http://localhost:8001/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: message,
      user_id: userId,
      conversation_id: conversationId
    })
  });
  
  return await response.json();
};

// Example usage
const result = await chatWithAI(
  "What are the library timings?", 
  "student_123"
);

// Response:
// {
//   "response": "Our library is open from 8 AM to 8 PM on weekdays and 9 AM to 5 PM on weekends...",
//   "conversation_id": "uuid-string",
//   "timestamp": "2025-09-15T12:36:53.123456"
// }
```

#### GET `/chat/conversations/{user_id}` - Get User's Conversation History

Retrieve all conversations for a specific user.

**Request:**
```javascript
const getUserConversations = async (userId) => {
  const response = await fetch(`http://localhost:8001/chat/conversations/${userId}`);
  return await response.json();
};

// Example usage
const conversations = await getUserConversations("student_123");

// Response:
// {
//   "conversations": [
//     {
//       "id": "conv-uuid-1",
//       "created_at": "2025-09-15T10:30:00",
//       "updated_at": "2025-09-15T10:35:00",
//       "message_count": 6,
//       "preview": "What are the library timings?"
//     }
//   ]
// }
```

#### DELETE `/chat/conversations/{conversation_id}` - Delete Conversation

Delete a specific conversation.

**Request:**
```javascript
const deleteConversation = async (conversationId) => {
  const response = await fetch(`http://localhost:8001/chat/conversations/${conversationId}`, {
    method: 'DELETE'
  });
  return await response.json();
};

// Example usage
const result = await deleteConversation("conv-uuid-1");

// Response:
// {
//   "success": true
// }
```

### 2. Portfolio Generator APIs

#### POST `/generate-portfolio` - Generate Student Portfolio

Generate an AI-enhanced portfolio for a student based on their academic records.

**Request:**
```javascript
const generatePortfolio = async (studentData, templateStyle = "professional") => {
  const response = await fetch('http://localhost:8001/generate-portfolio', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      student_record: {
        student_id: studentData.id,
        name: studentData.name,
        course: studentData.course,
        semester: studentData.semester,
        grades: studentData.grades,
        projects: studentData.projects || [],
        achievements: studentData.achievements || [],
        skills: studentData.skills || [],
        extracurricular: studentData.extracurricular || []
      },
      template_style: templateStyle
    })
  });
  
  return await response.json();
};

// Example usage
const studentData = {
  id: "CS2021001",
  name: "John Doe",
  course: "Computer Science",
  semester: 6,
  grades: {
    "Data Structures": "A",
    "Database Systems": "A-",
    "Web Development": "A+",
    "Machine Learning": "B+"
  },
  projects: [
    {
      title: "E-commerce Website",
      description: "Full-stack web application using React and Node.js",
      technologies: ["React", "Node.js", "MongoDB", "Express"]
    },
    {
      title: "Machine Learning Classifier",
      description: "Image classification using CNN",
      technologies: ["Python", "TensorFlow", "OpenCV"]
    }
  ],
  achievements: [
    "Dean's List - Fall 2023",
    "Best Project Award - Web Development Course",
    "Hackathon Winner - TechFest 2023"
  ],
  skills: [
    "JavaScript", "Python", "React", "Node.js", 
    "MongoDB", "Machine Learning", "Git", "AWS"
  ],
  extracurricular: [
    {
      activity: "Computer Science Society",
      role: "Vice President",
      duration: "2023-2024"
    }
  ]
};

const portfolio = await generatePortfolio(studentData, "professional");

// Response:
// {
//   "portfolio_html": "<!DOCTYPE html><html>...",
//   "summary": "John Doe is a dedicated Computer Science student...",
//   "highlights": [
//     "Skilled in JavaScript, Python, React",
//     "Completed 2 technical projects",
//     "Earned 3 notable achievements",
//     "Excellent academic performance",
//     "Currently in Computer Science - Semester 6"
//   ]
// }
```

#### GET `/portfolio/templates` - Get Available Templates

Get list of available portfolio templates.

**Request:**
```javascript
const getTemplates = async () => {
  const response = await fetch('http://localhost:8001/portfolio/templates');
  return await response.json();
};

// Example usage
const templates = await getTemplates();

// Response:
// {
//   "templates": [
//     {
//       "id": "professional",
//       "name": "Professional",
//       "description": "Clean, business-oriented layout"
//     },
//     {
//       "id": "creative",
//       "name": "Creative", 
//       "description": "Colorful, artistic design"
//     },
//     {
//       "id": "academic",
//       "name": "Academic",
//       "description": "Scholarly, research-focused layout"
//     },
//     {
//       "id": "modern",
//       "name": "Modern",
//       "description": "Contemporary, minimalist design"
//     }
//   ]
// }
```

## Frontend Integration Examples

### React Integration

#### 1. AI Chatbot Component

```jsx
import React, { useState, useEffect } from 'react';

const AIChatbot = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          user_id: userId,
          conversation_id: conversationId
        })
      });

      const data = await response.json();
      
      if (!conversationId) {
        setConversationId(data.conversation_id);
      }

      const aiMessage = { role: 'assistant', content: data.response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
        {loading && <div className="message loading">AI is typing...</div>}
      </div>
      
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask me anything about college..."
        />
        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
};

export default AIChatbot;
```

#### 2. Portfolio Generator Component

```jsx
import React, { useState } from 'react';

const PortfolioGenerator = ({ studentData }) => {
  const [template, setTemplate] = useState('professional');
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    // Load available templates
    fetch('http://localhost:8001/portfolio/templates')
      .then(res => res.json())
      .then(data => setTemplates(data.templates));
  }, []);

  const generatePortfolio = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8001/generate-portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_record: studentData,
          template_style: template
        })
      });

      const data = await response.json();
      setPortfolio(data);
    } catch (error) {
      console.error('Error generating portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPortfolio = () => {
    if (!portfolio) return;
    
    const blob = new Blob([portfolio.portfolio_html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${studentData.name}_Portfolio.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="portfolio-generator">
      <h2>Generate Portfolio</h2>
      
      <div className="template-selector">
        <label>Template Style:</label>
        <select value={template} onChange={(e) => setTemplate(e.target.value)}>
          {templates.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      <button onClick={generatePortfolio} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Portfolio'}
      </button>

      {portfolio && (
        <div className="portfolio-result">
          <h3>Portfolio Generated!</h3>
          <p>{portfolio.summary}</p>
          
          <div className="highlights">
            <h4>Highlights:</h4>
            <ul>
              {portfolio.highlights.map((highlight, idx) => (
                <li key={idx}>{highlight}</li>
              ))}
            </ul>
          </div>

          <div className="actions">
            <button onClick={downloadPortfolio}>Download Portfolio</button>
            <button onClick={() => window.open('data:text/html,' + encodeURIComponent(portfolio.portfolio_html))}>
              Preview Portfolio
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioGenerator;
```

### Integration with Your Existing Backend

#### 1. Add AI Service Routes to Your Node.js Backend

```javascript
// routes/ai.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

const AI_SERVICE_URL = 'http://localhost:8001';

// Proxy route for chatbot
router.post('/chat', async (req, res) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/chat`, {
      message: req.body.message,
      user_id: req.user?.id, // From your auth middleware
      conversation_id: req.body.conversation_id
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

// Proxy route for portfolio generation
router.post('/generate-portfolio/:studentId', async (req, res) => {
  try {
    // Fetch student data from your database
    const student = await Student.findById(req.params.studentId)
      .populate('grades projects achievements');
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Format student data for AI service
    const studentData = {
      student_id: student.id,
      name: `${student.firstName} ${student.lastName}`,
      course: student.course,
      semester: student.semester,
      grades: student.grades.reduce((acc, grade) => {
        acc[grade.subject] = grade.grade;
        return acc;
      }, {}),
      projects: student.projects.map(p => ({
        title: p.title,
        description: p.description,
        technologies: p.technologies
      })),
      achievements: student.achievements.map(a => a.title),
      skills: student.skills || [],
      extracurricular: student.extracurricular || []
    };

    const response = await axios.post(`${AI_SERVICE_URL}/generate-portfolio`, {
      student_record: studentData,
      template_style: req.body.template_style || 'professional'
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Portfolio Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate portfolio' });
  }
});

module.exports = router;
```

#### 2. Add to Your Main App

```javascript
// server.js or app.js
const aiRoutes = require('./routes/ai');
app.use('/api/ai', aiRoutes);
```

## Environment Configuration

Create a `.env` file in the ai-service directory:

```env
# AI Service Configuration
API_HOST=0.0.0.0
API_PORT=8001
LOG_LEVEL=info

# Model Configuration
CHATBOT_MODEL=microsoft/DialoGPT-medium
PORTFOLIO_MODEL=gpt2

# Performance Settings
MAX_CONVERSATION_HISTORY=50
MODEL_CACHE_DIR=./models
```

## Error Handling

The AI service includes comprehensive error handling. Common error responses:

```javascript
// Service unavailable
{
  "detail": "AI models are still initializing. Please try again in a few minutes."
}

// Invalid request
{
  "detail": "Missing required field: message"
}

// Service error
{
  "detail": "Error generating AI response: Connection timeout"
}
```

## Performance Notes

1. **First Request Delay**: The first API call may take 30-60 seconds as models are downloaded and initialized.

2. **Memory Usage**: The service uses approximately 2-4 GB of RAM when running with both models.

3. **Response Times**: 
   - Chatbot: 2-5 seconds per response
   - Portfolio Generation: 10-30 seconds depending on content complexity

4. **Model Caching**: Models are cached locally after first download to improve startup times.

## Security Considerations

1. **CORS**: The service is configured for local development. Update CORS settings for production.

2. **Rate Limiting**: Consider adding rate limiting in production.

3. **Input Validation**: All inputs are sanitized, but additional validation may be needed for production use.

## Troubleshooting

### Common Issues

1. **"Module not found" error**: Run `pip install -r requirements.txt`

2. **Port already in use**: Change the port in `start.py` or stop the conflicting service

3. **Model download fails**: Check internet connection and disk space (models require ~2GB)

4. **CORS errors**: Ensure your frontend URL is in the allowed origins list in `main.py`

### Logs

The service logs are available in the console. For production, configure proper logging:

```python
import logging
logging.basicConfig(level=logging.INFO)
```

## Next Steps

1. **Production Deployment**: Consider using Docker for containerized deployment
2. **Model Upgrades**: Upgrade to larger models for better AI responses
3. **Database Integration**: Add persistent storage for conversations and portfolios
4. **User Authentication**: Integrate with your existing auth system
5. **Monitoring**: Add health checks and monitoring for production use

For additional support or questions, refer to the FastAPI documentation at `http://localhost:8001/docs` when the service is running.