import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ERPChatbot = ({ 
  isOpen, 
  onClose, 
  userRole = 'student',
  onNavigate = null // Function to handle navigation requests 
}) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      // Load suggestions when chatbot opens
      loadSuggestions();
      
      // Add welcome message
      const welcomeMessage = {
        id: Date.now(),
        text: `Hello! I'm your ERP Assistant. I can help you with college management tasks, navigate different portals, and answer questions about student, faculty, and administrative operations. How can I assist you today?`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, userRole]);

  const loadSuggestions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5001/api/chatbot/suggestions`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      if (response.data.success) {
        setSuggestions(response.data.data.suggestions);
      }
    } catch (error) {
      console.error('Failed to load suggestions:', error);
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
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5001/api/chatbot/chat',
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
      const errorMessage = {
        id: Date.now() + 1,
        text: error.response?.data?.message || 'Sorry, I encountered an error. Please try again.',
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
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <h3 className="font-semibold">ERP Assistant</h3>
          <span className="text-xs bg-blue-700 px-2 py-1 rounded-full">{userRole}</span>
        </div>
        <div className="flex gap-2">
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