import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import authManager from '../utils/authManager';

const ERPChatbot = ({ 
  isOpen, 
  onClose, 
  userRole = 'student',
  onNavigate = null // Function to handle navigation requests 
}) => {
  // Authentication debugging helper using AuthManager
  const debugAuth = () => {
    return authManager.debug();
  };
  
  // Detect if user is in Student Portal but missing auth data
  const isInStudentPortal = () => {
    return window.location.pathname.includes('student') || 
           document.title.includes('Student') ||
           userRole === 'student';
  };
  
  // Fix authentication data if in Student Portal
  const fixStudentPortalAuth = () => {
    if (isInStudentPortal() && !authManager.isAuthenticated()) {
      console.log('🔧 Detected Student Portal access without auth data - fixing...');
      // Create minimal demo auth data for Student Portal
      const demoToken = 'demo-student-portal-' + Date.now();
      const studentData = {
        token: demoToken,
        role: 'student',
        userId: 'JECRC-CSE-21-001',
        user: {
          id: 'JECRC-CSE-21-001',
          name: 'Student User',
          fullName: 'Student User',
          email: 'student@jecrc.ac.in',
          role: 'student',
          department: 'Computer Science Engineering',
          rollNo: 'JECRC-CSE-21-001'
        }
      };
      
      authManager.setAuthData(studentData);
      console.log('✅ Student Portal auth data restored');
      return true;
    }
    return false;
  };
  
  // Fallback responses for when user is not authenticated
  const getFallbackResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Special handling if in Student Portal
    if (isInStudentPortal() && lowerMessage.includes('hello')) {
      return {
        text: 'Hello! I\'m your ERP Assistant in the Student Portal. I can help with student-specific queries about courses, grades, attendance, and fees. How can I assist you?',
        requiresAuth: false
      };
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return {
        text: 'Hello! I\'m the ERP Assistant. I can provide general information about our college management system. For personalized assistance and full features, please log in to your account.',
        requiresAuth: false
      };
    }
    
    if (lowerMessage.includes('student portal') || lowerMessage.includes('portal')) {
      return {
        text: 'The Student Portal provides access to academic records, fee payments, assignments, and more. Please log in with your student credentials to access your personalized portal.',
        requiresAuth: true
      };
    }
    
    if (lowerMessage.includes('fee') || lowerMessage.includes('payment')) {
      return {
        text: 'The Fee Management system allows students to view fee structure, make online payments, download receipts, and track payment history. Please log in to access your fee details.',
        requiresAuth: true
      };
    }
    
    if (lowerMessage.includes('attendance')) {
      return {
        text: 'The Attendance module tracks student presence, calculates attendance percentages, and provides detailed reports. Students can view their attendance records after logging in.',
        requiresAuth: true
      };
    }
    
    if (lowerMessage.includes('grade') || lowerMessage.includes('result') || lowerMessage.includes('mark')) {
      return {
        text: 'The Grades & Results section displays semester-wise performance, CGPA calculations, and academic progress. Login to view your academic results.',
        requiresAuth: true
      };
    }
    
    if (lowerMessage.includes('login') || lowerMessage.includes('log in')) {
      return {
        text: 'To log in, use your student ID or faculty ID along with your password. If you\'ve forgotten your credentials, contact the admin office for assistance.',
        requiresAuth: false
      };
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return {
        text: 'I can help with information about the ERP system features like student portal, fee management, attendance tracking, and grades. For technical support, contact the IT department.',
        requiresAuth: false
      };
    }
    
    if (lowerMessage.includes('features') || lowerMessage.includes('what can you do')) {
      return {
        text: 'Our ERP system includes: \u2022 Student Portal \u2022 Fee Management \u2022 Attendance Tracking \u2022 Grades & Results \u2022 Library Management \u2022 Assignment Submission \u2022 Faculty Portal \u2022 Admin Dashboard. Login for full access!',
        requiresAuth: false
      };
    }
    
    // Default response for unrecognized queries
    return {
      text: 'I\'m here to help with the ERP system! I can provide information about student portal, fees, attendance, grades, and more. Please log in for personalized assistance, or ask me about general ERP features.',
      requiresAuth: false
    };
  };
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [authState, setAuthState] = useState(authManager.isAuthenticated());
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Monitor auth state changes
  useEffect(() => {
    const checkAuthState = () => {
      let currentAuthState = authManager.isAuthenticated();
      
      // Auto-fix missing auth data if in Student Portal
      if (!currentAuthState && isInStudentPortal()) {
        const wasFixed = fixStudentPortalAuth();
        if (wasFixed) {
          currentAuthState = authManager.isAuthenticated();
          console.log('🔧 Auto-fixed auth data, new state:', currentAuthState);
        }
      }
      
      if (currentAuthState !== authState) {
        console.log('🔄 ERPChatbot: Auth state changed from', authState, 'to', currentAuthState);
        setAuthState(currentAuthState);
        
        // Refresh suggestions when auth state changes
        if (isOpen) {
          loadSuggestions();
        }
      }
    };
    
    // Check auth state periodically
    const authCheckInterval = setInterval(checkAuthState, 2000);
    
    // Also check immediately
    checkAuthState();
    
    return () => clearInterval(authCheckInterval);
  }, [authState, isOpen]);

  useEffect(() => {
    if (isOpen) {
      // Debug authentication state when chatbot opens
      console.log('🤖 ERPChatbot opened - debugging auth state');
      const authDebug = debugAuth();
      
      // Force refresh auth state check
      const isAuth = authManager.isAuthenticated();
      console.log('🔍 ERPChatbot auth check result:', isAuth);
      console.log('📊 Auth details:', {
        hasToken: !!authManager.getToken(),
        hasUserId: !!authManager.getUserId(),
        hasUserRole: !!authManager.getUserRole(),
        userRole: authManager.getUserRole()
      });
      
      // Load suggestions when chatbot opens
      loadSuggestions();
      
      // Add welcome message with more accurate auth status
      const authStatus = isAuth ? `🔓 Authenticated as ${authManager.getUserRole() || 'user'}` : '🔒 Guest mode';
      const welcomeMessage = {
        id: Date.now(),
        text: `Hello! I'm your ERP Assistant (${authStatus}). I can help you with college management tasks, navigate different portals, and answer questions about student, faculty, and administrative operations. How can I assist you today?`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, userRole]);

  const loadSuggestions = async () => {
    try {
      const token = authManager.getToken();
      
      console.log('🔑 Loading suggestions - Token found:', !!token);
      console.log('🔑 Authentication status:', authManager.isAuthenticated());
      
      if (!token) {
        console.warn('⚠️ No authentication token found for suggestions');
        // If no token, show general suggestions
        setSuggestions([
          "Tell me about the ERP system",
          "How do I access student portal?",
          "Show me available features",
          "Help with navigation"
        ]);
        return;
      }
      
      const response = await axios.get(
        `http://localhost:5000/api/chatbot/suggestions`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      if (response.data.success) {
        setSuggestions(response.data.data.suggestions);
      }
    } catch (error) {
      console.error('❌ Failed to load suggestions:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      // Handle authentication errors
      if (error.response?.status === 401) {
        console.warn('⚠️ Token appears to be invalid or expired');
        // Clear potentially invalid auth data
        authManager.clearAuth();
        setSuggestions([
          "Please log in to access personalized suggestions",
          "Tell me about the ERP system",
          "Help with navigation"
        ]);
      } else if (error.response?.status === 403) {
        setSuggestions([
          "Access denied - please check your permissions",
          "Contact administrator for assistance"
        ]);
      } else {
        // Fallback to general suggestions when server is unreachable
        setSuggestions([
          "Tell me about the ERP system",
          "How do I access student portal?",
          "Show me available features",
          "Help with navigation"
        ]);
      }
    }
  };

  const sendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const token = authManager.getToken();
      
      console.log('🔑 Sending message - Token found:', !!token);
      console.log('🔑 Authentication status:', authManager.isAuthenticated());
      
      if (!token || !authManager.isAuthenticated()) {
        console.warn('⚠️ User not authenticated for chat - using fallback mode');
        
        // Provide fallback responses for common queries
        const fallbackResponse = getFallbackResponse(messageText);
        
        const botMessage = {
          id: Date.now() + 1,
          text: fallbackResponse.text,
          isUser: false,
          timestamp: new Date(),
          isError: fallbackResponse.requiresAuth
        };
        setMessages(prev => [...prev, botMessage]);
        return;
      }
      
      const response = await axios.post(
        'http://localhost:5000/api/chatbot/chat',
        {
          message: messageText,
          context: { userRole }
        },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        const botMessage = {
          id: Date.now() + 1,
          text: response.data.data.response,
          isUser: false,
          timestamp: new Date(),
          isNavigation: response.data.data.isNavigation,
          navigationType: response.data.data.navigationType
        };

        setMessages(prev => [...prev, botMessage]);

        // Handle navigation if callback is provided and this is a navigation response
        if (response.data.data.isNavigation && response.data.data.navigationType && onNavigate) {
          console.log('🧩 Navigation detected from backend:');
          console.log('  - isNavigation:', response.data.data.isNavigation);
          console.log('  - navigationType:', response.data.data.navigationType);
          console.log('  - onNavigate function:', !!onNavigate);
          
          setTimeout(() => {
            console.log('🗺 Calling onNavigate with:', response.data.data.navigationType);
            onNavigate(response.data.data.navigationType);
          }, 1000); // Small delay to let user read the response
        } else {
          console.log('🔕 Navigation conditions not met:');
          console.log('  - isNavigation:', response.data.data.isNavigation);
          console.log('  - navigationType:', response.data.data.navigationType);
          console.log('  - onNavigate available:', !!onNavigate);
        }
      } else {
        throw new Error(response.data.message || 'Failed to get response');
      }
    } catch (error) {
      console.error('❌ Chat error:', error);
      
      let errorText = 'Sorry, I encountered an error. Please try again.';
      
      if (error.response?.status === 401) {
        console.warn('⚠️ Authentication failed during chat');
        // Clear potentially invalid auth data
        authManager.clearAuth();
        errorText = '🔒 Your session has expired. Please log in again to continue using the ERP assistant.';
      } else if (error.response?.status === 403) {
        errorText = '🚫 Access denied. Please check your permissions or contact an administrator.';
      } else if (error.response?.status === 429) {
        errorText = '⏱️ Too many requests. Please wait a moment before sending another message.';
      } else if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        errorText = '🚨 Unable to connect to the ERP server. Please check your connection or try again later.';
      } else if (error.response?.data?.message) {
        errorText = error.response.data.message;
      }
      
      const errorMessage = {
        id: Date.now() + 1,
        text: errorText,
        isUser: false,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  const clearChat = () => {
    setMessages([{
      id: Date.now(),
      text: `Hello! I'm your ERP Assistant. I can help you with college management tasks, navigate different portals, and answer questions about student, faculty, and administrative operations. How can I assist you today?`,
      isUser: false,
      timestamp: new Date()
    }]);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed ${isMinimized ? 'bottom-4 right-4 w-80 h-16' : 'bottom-4 right-4 w-96 h-[32rem]'} bg-white rounded-lg shadow-2xl border border-gray-200 z-50 transition-all duration-300 ease-in-out`}>
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full animate-pulse ${
            authState ? 'bg-green-400' : 'bg-yellow-400'
          }`}></div>
          <h3 className="font-semibold">ERP Assistant</h3>
          <span className="text-xs bg-blue-700 px-2 py-1 rounded-full">
            {authState ? (authManager.getUserRole() || userRole) : 'guest'}
          </span>
          {!authState && (
            <span className="text-xs bg-yellow-600 px-2 py-1 rounded-full">
              Limited Mode
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {/* Debug auth status button (only in development) */}
          <button
            onClick={() => {
              const authDebug = debugAuth();
              console.log('📊 Manual auth debug requested');
              setAuthState(authManager.isAuthenticated());
              const authMessage = {
                id: Date.now(),
                text: `📊 Debug: Auth Status = ${authManager.isAuthenticated()}, Token = ${!!authManager.getToken()}, Role = ${authManager.getUserRole()}, User ID = ${authManager.getUserId()}`,
                isUser: false,
                timestamp: new Date()
              };
              setMessages(prev => [...prev, authMessage]);
            }}
            className="hover:bg-blue-700 p-1 rounded transition-colors text-xs"
            title="Debug Auth Status"
          >
            📊
          </button>
          {/* Fix authentication button */}
          {!authState && isInStudentPortal() && (
            <button
              onClick={() => {
                console.log('🔧 Manual auth fix requested');
                const wasFixed = fixStudentPortalAuth();
                if (wasFixed) {
                  setAuthState(authManager.isAuthenticated());
                  loadSuggestions();
                  const fixMessage = {
                    id: Date.now(),
                    text: '✅ Authentication data restored! You can now access personalized ERP features.',
                    isUser: false,
                    timestamp: new Date()
                  };
                  setMessages(prev => [...prev, fixMessage]);
                }
              }}
              className="hover:bg-blue-700 p-1 rounded transition-colors text-xs bg-yellow-600"
              title="Fix Authentication"
            >
              🔧
            </button>
          )}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-blue-700 p-1 rounded transition-colors"
            title={isMinimized ? "Expand" : "Minimize"}
          >
            {isMinimized ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
          <button
            onClick={clearChat}
            className="hover:bg-blue-700 p-1 rounded transition-colors"
            title="Clear Chat"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="hover:bg-blue-700 p-1 rounded transition-colors"
            title="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.isUser
                      ? 'bg-blue-600 text-white'
                      : message.isError
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : message.isNavigation
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  {message.isNavigation && (
                    <div className="mt-2 text-xs text-green-600 font-medium">
                      🧭 Navigation instruction provided
                    </div>
                  )}
                  {message.isError && message.text.includes('log in') && (
                    <div className="mt-3">
                      <button 
                        onClick={() => window.location.href = '/'}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded transition-colors"
                      >
                        🔑 Go to Login
                      </button>
                    </div>
                  )}
                  <div className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 rounded-lg px-4 py-2 max-w-xs">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && messages.length <= 1 && (
            <div className="px-4 py-2 border-t border-gray-200 bg-white">
              <div className="text-xs text-gray-500 mb-2">Try asking:</div>
              <div className="flex flex-wrap gap-2">
                {suggestions.slice(0, 3).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded-full border border-blue-200 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
            <div className="flex gap-2">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about the ERP system..."
                className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="1"
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ERPChatbot;