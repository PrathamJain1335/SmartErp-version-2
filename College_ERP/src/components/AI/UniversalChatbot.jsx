import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, MessageSquare, X, Minimize2, Maximize2, HelpCircle } from 'lucide-react';

const UniversalChatbot = ({ portal = 'student', isOpen, onToggle }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Portal-specific configuration
  const portalConfig = {
    student: {
      name: 'Student Assistant',
      greeting: "Hi! I'm your Student Assistant. I can help you with academics, fees, attendance, library services, and more. What would you like to know?",
      color: 'red',
      quickActions: [
        { id: 'attendance', label: 'My Attendance', response: 'attendance_info' },
        { id: 'fees', label: 'Fee Status', response: 'fee_status' },
        { id: 'results', label: 'Exam Results', response: 'exam_results' },
        { id: 'library', label: 'Library Books', response: 'library_books' }
      ]
    },
    faculty: {
      name: 'Faculty Assistant',
      greeting: "Hello! I'm your Faculty Assistant. I can help you with class schedules, student management, grade entry, and administrative tasks. How may I assist you?",
      color: 'green',
      quickActions: [
        { id: 'schedule', label: 'My Schedule', response: 'faculty_schedule' },
        { id: 'students', label: 'My Students', response: 'student_list' },
        { id: 'attendance', label: 'Mark Attendance', response: 'mark_attendance' },
        { id: 'grades', label: 'Grade Entry', response: 'grade_entry' }
      ]
    },
    admin: {
      name: 'Admin Assistant',
      greeting: "Welcome! I'm your Admin Assistant. I can help you with student management, faculty oversight, system analytics, and administrative operations. What do you need help with?",
      color: 'purple',
      quickActions: [
        { id: 'analytics', label: 'System Analytics', response: 'system_analytics' },
        { id: 'students', label: 'Student Management', response: 'student_management' },
        { id: 'faculty', label: 'Faculty Management', response: 'faculty_management' },
        { id: 'reports', label: 'Generate Reports', response: 'generate_reports' }
      ]
    }
  };

  const config = portalConfig[portal];

  // Initialize with greeting message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 1,
        type: 'bot',
        content: config.greeting,
        timestamp: new Date().toLocaleTimeString(),
        suggestions: config.quickActions.map(action => action.label)
      }]);
    }
  }, [isOpen, config.greeting, messages.length]);

  // AI Response Generator - Updated to use backend API
  const generateAIResponse = async (userMessage) => {
    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      
      // Call the chatbot API backend
      const response = await fetch(`${API_BASE_URL}/chatbot/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMessage,
          context: portal
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          return {
            content: data.data.response,
            suggestions: getSuggestionsForResponse(data.data.response),
            isNavigation: data.data.isNavigation,
            navigationType: data.data.navigationType
          };
        } else {
          throw new Error(data.message || 'API request failed');
        }
      } else {
        // API unavailable - show error instead of fallback
        throw new Error('ERP services are currently unavailable. Please try again later.');
      }
    } catch (error) {
      console.error('AI Service error:', error);
      // Return error message instead of fallback
      return {
        content: 'Sorry, I\'m unable to connect to the ERP services right now. Please check your connection and try again, or contact support if the issue persists.',
        suggestions: ['Contact support', 'Try again later']
      };
    }
  };

  // Generate suggestions based on AI response
  const getSuggestionsForResponse = (response) => {
    const responseLower = response.toLowerCase();
    
    if (responseLower.includes('library')) {
      return ['Library timings', 'Book catalog', 'Renew books'];
    }
    if (responseLower.includes('fee') || responseLower.includes('payment')) {
      return ['Pay fees', 'Fee structure', 'Payment history'];
    }
    if (responseLower.includes('exam') || responseLower.includes('result')) {
      return ['Exam schedule', 'Results', 'Grade report'];
    }
    if (responseLower.includes('admission')) {
      return ['Admission process', 'Documents required', 'Admission status'];
    }
    
    return config.quickActions.map(action => action.label).slice(0, 3);
  };

  // Minimal local response generator - only for basic interactions
  const generateLocalResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Only basic greetings and help - no data responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return {
        content: `Hello! I'm your ${config.name}. I need to connect to ERP services to provide you with real-time information. Please ensure you're properly logged in and connected.`,
        suggestions: ['Contact support if you need help']
      };
    }

    if (message.includes('help') || message.includes('support')) {
      return {
        content: `I can help you with ${portal} portal tasks, but I need to be connected to the ERP backend services. Please check your connection or contact support.`,
        suggestions: ['Contact support', 'Check connection']
      };
    }

    if (message.includes('thank you') || message.includes('thanks')) {
      return {
        content: "You're welcome! Please note that I need to be connected to ERP services to provide specific information.",
        suggestions: ['Contact support']
      };
    }

    // Default response - no demo data
    return {
      content: `I'm unable to process your query "${userMessage}" without connecting to the ERP backend services. Please ensure you're logged in and the system is available, or contact support for assistance.`,
      suggestions: ['Contact support', 'Try again later']
    };
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message = inputMessage) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const aiResponse = await generateAIResponse(message);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: aiResponse.content,
        timestamp: new Date().toLocaleTimeString(),
        suggestions: aiResponse.suggestions
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toLocaleTimeString(),
        suggestions: ['Try again', 'Contact support']
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action) => {
    handleSendMessage(action.label);
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const colorClasses = {
    red: {
      bg: 'bg-red-600',
      hover: 'hover:bg-red-700',
      text: 'text-red-600',
      border: 'border-red-500'
    },
    green: {
      bg: 'bg-green-600',
      hover: 'hover:bg-green-700',
      text: 'text-green-600',
      border: 'border-green-500'
    },
    purple: {
      bg: 'bg-purple-600',
      hover: 'hover:bg-purple-700',
      text: 'text-purple-600',
      border: 'border-purple-500'
    }
  };

  const colors = colorClasses[config.color];

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
        style={{ backgroundColor: 'var(--accent)' }}
        title="Open AI Assistant"
      >
        <MessageSquare className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-8 right-6 w-96 rounded-xl shadow-2xl border overflow-hidden z-50 transition-all duration-300 ${isMinimized ? 'h-20' : 'h-[600px]'}`} style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
      {/* Header */}
      <div className="text-white p-4" style={{ backgroundColor: 'var(--accent)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{config.name}</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs opacity-90">Online</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-white/20 rounded"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </button>
            <button
              onClick={onToggle}
              className="p-1 hover:bg-white/20 rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Quick Actions */}
          <div className="p-3 border-b" style={{ backgroundColor: 'var(--hover)', borderColor: 'var(--border)' }}>
            <div className="flex gap-2 overflow-x-auto">
              {config.quickActions.map((action, index) => (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action)}
                  className="text-xs text-white px-3 py-1 rounded-full whitespace-nowrap hover:opacity-90 transition-opacity" style={{ backgroundColor: 'var(--accent)' }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Container */}
          <div className="h-80 overflow-y-auto p-4 space-y-3" style={{ backgroundColor: 'var(--bg)' }}>
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] flex gap-2 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: message.type === 'user' ? 'var(--accent)' : 'var(--muted)' }}>
                    {message.type === 'user' ? (
                      <User className="h-3 w-3 text-white" />
                    ) : (
                      <Bot className="h-3 w-3 text-white" />
                    )}
                  </div>

                  <div className="rounded-lg p-3" style={message.type === 'user' ? 
                    { backgroundColor: 'var(--accent)', color: 'white' } :
                    { backgroundColor: 'var(--card)', color: 'var(--text)' }
                  }>
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs mt-1" style={{ color: message.type === 'user' ? 'rgba(255,255,255,0.7)' : 'var(--muted)' }}>
                      {message.timestamp}
                    </div>

                    {/* Suggestions */}
                    {message.suggestions && message.type === 'bot' && (
                      <div className="mt-2 space-y-1">
                        {message.suggestions.slice(0, 3).map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="block w-full text-left text-xs border rounded px-2 py-1 transition-colors" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--muted)' }}>
                    <Bot className="h-3 w-3 text-white" />
                  </div>
                  <div className="rounded-lg p-3" style={{ backgroundColor: 'var(--card)' }}>
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs" style={{ color: 'var(--muted)' }}>Typing...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                disabled={isTyping}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isTyping}
                className="px-3 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors" style={{ backgroundColor: 'var(--accent)' }}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UniversalChatbot;