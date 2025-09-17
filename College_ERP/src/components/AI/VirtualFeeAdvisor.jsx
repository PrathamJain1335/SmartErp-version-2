import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Clock, DollarSign, Calendar, AlertCircle, CheckCircle, HelpCircle, Lightbulb, Phone, Mail } from 'lucide-react';

const VirtualFeeAdvisor = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your Virtual Fee Advisor. I'm here to help you with all fee-related queries. You can ask me about payment deadlines, fee structures, scholarships, payment methods, and more. How can I assist you today?",
      timestamp: new Date().toLocaleTimeString(),
      suggestions: [
        "What is my next due date?",
        "How to avoid late fees?",
        "Available payment methods",
        "Scholarship opportunities"
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [quickActions, setQuickActions] = useState([
    { id: 'due_date', label: 'Next Due Date', icon: Calendar, color: 'bg-blue-500' },
    { id: 'payment_methods', label: 'Payment Options', icon: DollarSign, color: 'bg-green-500' },
    { id: 'late_fees', label: 'Late Fee Info', icon: AlertCircle, color: 'bg-red-500' },
    { id: 'scholarships', label: 'Scholarships', icon: HelpCircle, color: 'bg-purple-500' }
  ]);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Student fee data for context
  const studentData = {
    name: 'Sophia Clark',
    rollNumber: '20B03001',
    totalFees: 175000,
    paidAmount: 125000,
    pendingAmount: 50000,
    nextDueDate: '2024-09-30',
    lastPayment: {
      amount: 50000,
      date: '2024-08-20',
      method: 'Online Banking'
    },
    paymentMethods: ['Online Banking', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking'],
    scholarships: [
      { name: 'Merit Scholarship', eligibility: '75%', amount: 25000 },
      { name: 'Need-based Aid', eligibility: '60%', amount: 15000 }
    ]
  };

  // AI Response Generator
  const generateAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Fee-related responses
    if (message.includes('due date') || message.includes('deadline') || message.includes('when')) {
      return {
        content: `Your next fee payment is due on **${studentData.nextDueDate}**. The pending amount is ₹${studentData.pendingAmount.toLocaleString()}. I recommend paying at least 7 days before the deadline to avoid any late fees.`,
        suggestions: ["How to pay online?", "Set payment reminder", "Check late fee policy"]
      };
    }
    
    if (message.includes('late fee') || message.includes('penalty')) {
      return {
        content: `Here's what you need to know about late fees:\n\n• **Late Fee**: ₹500 per day after due date\n• **Grace Period**: 3 days from due date\n• **Maximum Late Fee**: ₹5,000 per semester\n\nTo avoid late fees, I suggest setting up automatic reminders or using auto-pay options.`,
        suggestions: ["Setup auto-pay", "Payment reminder settings", "Check current dues"]
      };
    }
    
    if (message.includes('payment') && (message.includes('method') || message.includes('option') || message.includes('way'))) {
      return {
        content: `You have multiple payment options available:\n\n🏦 **Online Banking** - Most popular, instant confirmation\n📱 **UPI** - Quick and secure (Google Pay, PhonePe, Paytm)\n💳 **Credit Card** - Earn reward points\n💳 **Debit Card** - Direct bank deduction\n🌐 **Net Banking** - Traditional secure method\n\nFor payments above ₹50,000, I recommend Online Banking or Net Banking for better transaction limits.`,
        suggestions: ["Payment charges info", "Transaction limits", "Payment security tips"]
      };
    }
    
    if (message.includes('scholarship') || message.includes('financial aid')) {
      return {
        content: `Great news! You're eligible for scholarships:\n\n🏆 **Merit Scholarship**\n• Eligibility: 75%\n• Potential Amount: ₹25,000\n• Based on your CGPA of 8.2\n\n💰 **Need-based Aid**\n• Eligibility: 60%\n• Potential Amount: ₹15,000\n• Based on family income criteria\n\nTotal potential aid: ₹40,000! Would you like help applying for these?`,
        suggestions: ["Apply for scholarships", "Eligibility requirements", "Application deadlines"]
      };
    }
    
    if (message.includes('balance') || message.includes('pending') || message.includes('remaining')) {
      return {
        content: `Here's your current fee status:\n\n💰 **Total Fees**: ₹${studentData.totalFees.toLocaleString()}\n✅ **Paid Amount**: ₹${studentData.paidAmount.toLocaleString()}\n⏳ **Pending**: ₹${studentData.pendingAmount.toLocaleString()}\n\nYou've completed ${((studentData.paidAmount / studentData.totalFees) * 100).toFixed(1)}% of your fee payments. Great progress!`,
        suggestions: ["Pay pending amount", "Payment plan options", "Fee breakdown"]
      };
    }
    
    if (message.includes('installment') || message.includes('emi') || message.includes('split')) {
      return {
        content: `Yes! You can split your pending amount into installments:\n\n📅 **2 Installments**\n• ₹25,000 each\n• Due dates: Sep 30 & Oct 30\n• Processing fee: ₹200\n\n📅 **3 Installments**\n• ₹16,667 each\n• Monthly payments\n• Processing fee: ₹500\n\nInstallment plans help you manage cash flow better. Which option interests you?`,
        suggestions: ["Setup installment plan", "Installment terms", "Processing fees"]
      };
    }
    
    if (message.includes('receipt') || message.includes('proof') || message.includes('document')) {
      return {
        content: `You can get your payment receipts easily:\n\n📄 **Download Options**:\n• Individual payment receipts\n• Consolidated fee statement\n• Academic year summary\n\n📧 **Auto-email**: Receipts sent automatically after each payment\n\n💾 **Access**: Available in your fee portal under 'Receipt History'\n\nYour last payment receipt: ₹${studentData.lastPayment.amount.toLocaleString()} on ${studentData.lastPayment.date}`,
        suggestions: ["Download receipts", "Email receipt copy", "Fee statement"]
      };
    }
    
    if (message.includes('contact') || message.includes('help') || message.includes('support')) {
      return {
        content: `Need additional help? Here are your support options:\n\n📞 **Fee Helpline**: +91-141-2400-456\n• Available: 9 AM - 6 PM (Mon-Sat)\n\n📧 **Email Support**: fees@jecrcu.edu.in\n• Response time: Within 24 hours\n\n🏢 **Visit Office**: Accounts Department, Ground Floor\n• Walk-in hours: 10 AM - 5 PM\n\nI'm also here 24/7 for instant assistance!`,
        suggestions: ["Call fee office", "Email query", "Office location"]
      };
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return {
        content: `Hello ${studentData.name}! Welcome back to your Fee Advisor. I can help you with:\n\n• Payment due dates and amounts\n• Fee structure and breakdown\n• Payment methods and options\n• Scholarship information\n• Late fee policies\n• Receipt downloads\n\nWhat would you like to know about your fees today?`,
        suggestions: ["Check due dates", "Payment options", "Fee breakdown", "Scholarship info"]
      };
    }
    
    // Default response
    return {
      content: `I understand you're asking about "${userMessage}". While I try to help with all fee-related queries, I might need more context. Could you please rephrase your question or try one of these common topics?\n\n• Payment due dates\n• Fee amounts and breakdown\n• Payment methods\n• Late fees and penalties\n• Scholarships and financial aid\n• Receipts and documents`,
      suggestions: ["Next due date", "Payment methods", "Late fee info", "Contact support"]
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

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = generateAIResponse(message);
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: aiResponse.content,
        timestamp: new Date().toLocaleTimeString(),
        suggestions: aiResponse.suggestions
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action) => {
    switch (action.id) {
      case 'due_date':
        handleSendMessage("What is my next due date?");
        break;
      case 'payment_methods':
        handleSendMessage("What are the available payment methods?");
        break;
      case 'late_fees':
        handleSendMessage("Tell me about late fees");
        break;
      case 'scholarships':
        handleSendMessage("What scholarships am I eligible for?");
        break;
      default:
        break;
    }
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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <Bot className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Virtual Fee Advisor</h1>
              <p className="text-blue-100">Your personal AI assistant for fee-related queries</p>
            </div>
            <div className="ml-auto">
              <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                Online
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex gap-3 overflow-x-auto">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action)}
                className={`flex items-center gap-2 ${action.color} text-white px-4 py-2 rounded-full whitespace-nowrap hover:opacity-90 transition-opacity`}
              >
                <action.icon className="h-4 w-4" />
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Messages Container */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md xl:max-w-lg flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' ? 'bg-blue-500' : 'bg-gray-600'
                }`}>
                  {message.type === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>

                {/* Message Content */}
                <div className={`rounded-xl p-4 ${
                  message.type === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp}
                  </div>

                  {/* Suggestions */}
                  {message.suggestions && message.type === 'bot' && (
                    <div className="mt-3 space-y-2">
                      <div className="text-xs font-medium text-gray-600 mb-2">Quick replies:</div>
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="block w-full text-left text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors"
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
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-500">AI is typing...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-white">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your fees..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isTyping}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isTyping}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="px-6 py-3 bg-gray-50 text-center">
          <p className="text-xs text-gray-500">
            💡 Tip: I can help with payments, due dates, scholarships, and more! Available 24/7.
          </p>
        </div>
      </div>

      {/* Additional Help Card */}
      <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          Need More Help?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Phone className="h-5 w-5 text-blue-600" />
            <div>
              <div className="font-medium text-blue-900">Call Support</div>
              <div className="text-sm text-blue-700">+91-141-2400-456</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <Mail className="h-5 w-5 text-green-600" />
            <div>
              <div className="font-medium text-green-900">Email Support</div>
              <div className="text-sm text-green-700">fees@jecrcu.edu.in</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <Clock className="h-5 w-5 text-purple-600" />
            <div>
              <div className="font-medium text-purple-900">Office Hours</div>
              <div className="text-sm text-purple-700">9 AM - 6 PM</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualFeeAdvisor;