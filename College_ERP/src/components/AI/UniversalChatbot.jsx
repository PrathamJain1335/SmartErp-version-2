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
        // Fallback to local responses if AI service is unavailable
        console.warn('AI API unavailable, using fallback responses');
        return generateLocalResponse(userMessage);
      }
    } catch (error) {
      console.error('AI Service error:', error);
      // Fallback to local responses
      return generateLocalResponse(userMessage);
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

  // Local fallback response generator
  const generateLocalResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Universal responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return {
        content: `Hello! I'm your ${config.name}. ${config.greeting}`,
        suggestions: config.quickActions.map(action => action.label)
      };
    }

    if (message.includes('help') || message.includes('support')) {
      return {
        content: `I'm here to help! I can assist you with:\n\n${config.quickActions.map(action => `• ${action.label}`).join('\n')}\n\nJust ask me anything or click on the quick action buttons!`,
        suggestions: ['Contact support', 'User guide', 'FAQs']
      };
    }

    if (message.includes('thank you') || message.includes('thanks')) {
      return {
        content: "You're welcome! I'm always here to help. Is there anything else you'd like to know?",
        suggestions: config.quickActions.map(action => action.label).slice(0, 2)
      };
    }

    // Student portal responses
    if (portal === 'student') {
      if (message.includes('attendance') || message.includes('present') || message.includes('absent')) {
        return {
          content: `📊 **Your Attendance Summary:**\n\n• Overall Attendance: **85.2%**\n• Classes Attended: 142/167\n• Subject-wise:\n  - Mathematics: 88% (22/25)\n  - Physics: 84% (21/25)\n  - Chemistry: 83% (20/24)\n  - Programming: 89% (24/27)\n\n⚠️ **Note**: Minimum 75% attendance required. You're doing great!`,
          suggestions: ['View detailed attendance', 'Apply for leave', 'Attendance shortage subjects']
        };
      }

      if (message.includes('fee') || message.includes('payment') || message.includes('due')) {
        return {
          content: `💰 **Your Fee Status:**\n\n• Total Fees: ₹1,75,000\n• Paid Amount: ₹1,25,000\n• Pending: ₹50,000\n• Next Due Date: **September 30, 2024**\n\n✅ Payment Status: 71% completed\n\n🔄 Available payment methods: Online Banking, UPI, Credit Card`,
          suggestions: ['Pay now', 'Payment history', 'Fee structure', 'Scholarships']
        };
      }

      if (message.includes('result') || message.includes('exam') || message.includes('grade')) {
        return {
          content: `🎓 **Latest Exam Results:**\n\n**Semester 2 Results:**\n• Mathematics: A (9.2/10)\n• Physics: B+ (8.7/10)\n• Chemistry: A- (8.9/10)\n• Programming: A+ (9.8/10)\n\n📊 **SGPA**: 9.15\n📊 **CGPA**: 8.85\n\n🏆 **Rank**: 15th in class`,
          suggestions: ['Download marksheet', 'Semester history', 'Grade improvement', 'Merit certificate']
        };
      }

      if (message.includes('library') || message.includes('book')) {
        return {
          content: `📚 **Your Library Status:**\n\n**Currently Issued Books:**\n• "Introduction to Algorithms" - Due: Oct 5\n• "Database Management Systems" - Due: Oct 12\n• "Computer Networks" - Due: Sep 28 ⚠️\n\n**Available Services:**\n• Digital Library Access\n• Study Room Booking\n• Inter-library Loan\n\n💡 **Tip**: Renew books online to avoid fines!`,
          suggestions: ['Renew books', 'Search catalog', 'Book reservations', 'Library timings']
        };
      }
    }

    // Faculty portal responses
    if (portal === 'faculty') {
      if (message.includes('schedule') || message.includes('class') || message.includes('timetable')) {
        return {
          content: `📅 **Your Today's Schedule:**\n\n**9:00 AM - 10:00 AM**\n• Subject: Data Structures\n• Class: CSE 2nd Year (Section A)\n• Room: CS-101\n\n**11:00 AM - 12:00 PM**\n• Subject: Computer Networks\n• Class: CSE 3rd Year (Section B)\n• Room: CS-205\n\n**2:00 PM - 3:00 PM**\n• Subject: Database Systems\n• Class: CSE 2nd Year (Section A)\n• Room: CS-102`,
          suggestions: ['View weekly schedule', 'Reschedule class', 'Book lab', 'Class materials']
        };
      }

      if (message.includes('student') || message.includes('attendance') || message.includes('mark')) {
        return {
          content: `👥 **Student Management:**\n\n**CSE 2nd Year - Section A (45 students)**\n• Present today: 42 students\n• Attendance rate: 93.3%\n• Pending assignments: 8 students\n\n**Quick Actions:**\n• Mark today's attendance\n• View student profiles\n• Grade assignments\n• Send announcements`,
          suggestions: ['Mark attendance', 'View student list', 'Grade assignments', 'Student analytics']
        };
      }
    }

    // Admin portal responses
    if (portal === 'admin') {
      if (message.includes('analytics') || message.includes('report') || message.includes('statistics')) {
        return {
          content: `📊 **System Analytics Dashboard:**\n\n**Student Metrics:**\n• Total Active Students: 2,450\n• Average Attendance: 87.2%\n• Fee Collection: 94% completed\n\n**Faculty Metrics:**\n• Total Faculty: 145\n• Classes Conducted: 1,250 this month\n• Research Papers: 23 published\n\n**System Health:**\n• Server Uptime: 99.8%\n• Daily Active Users: 1,890\n• Recent Issues: 2 resolved`,
          suggestions: ['Detailed reports', 'Export data', 'System alerts', 'Performance metrics']
        };
      }

      if (message.includes('student management') || message.includes('admission')) {
        return {
          content: `👨‍🎓 **Student Management Overview:**\n\n**Recent Activities:**\n• New Admissions: 15 pending approval\n• Fee Defaulters: 23 students\n• Scholarship Applications: 45 under review\n\n**Department-wise Distribution:**\n• CSE: 890 students\n• ECE: 654 students\n• ME: 520 students\n• CE: 386 students\n\n**Actions Required:**\n• Review pending admissions\n• Process scholarship applications`,
          suggestions: ['Student database', 'Admission approvals', 'Fee management', 'Generate ID cards']
        };
      }
    }

    // Default response
    return {
      content: `I understand you're asking about "${userMessage}". I'm designed to help with ${portal} portal related queries. Here are some things I can help you with:\n\n${config.quickActions.map(action => `• ${action.label}`).join('\n')}\n\nCould you please be more specific about what you need help with?`,
      suggestions: config.quickActions.map(action => action.label).slice(0, 3)
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