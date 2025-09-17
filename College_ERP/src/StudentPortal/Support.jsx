import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Headphones, 
  BookOpen, 
  FileText, 
  Star, 
  Send, 
  Search, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  User, 
  Phone, 
  Mail, 
  Calendar,
  Paperclip,
  Download,
  Filter,
  Eye,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Bot
} from 'lucide-react';

// Sample data for demo
const sampleTickets = [
  {
    id: 'TKT-001',
    title: 'Login Issues with Student Portal',
    category: 'Technical',
    status: 'Open',
    priority: 'High',
    createdAt: '2025-01-13 10:30 AM',
    description: 'Unable to access student portal after password reset',
    assignedTo: 'Technical Support Team',
    responses: [
      {
        id: 1,
        sender: 'Support Agent',
        message: 'We have received your ticket. Our technical team is looking into this issue.',
        timestamp: '2025-01-13 11:00 AM',
        isAgent: true
      }
    ]
  },
  {
    id: 'TKT-002',
    title: 'Grade Discrepancy in Mathematics Course',
    category: 'Academic',
    status: 'In Progress',
    priority: 'Medium',
    createdAt: '2025-01-12 2:15 PM',
    description: 'The grade shown for Mathematics-III does not match my actual performance',
    assignedTo: 'Academic Affairs',
    responses: [
      {
        id: 1,
        sender: 'Academic Officer',
        message: 'We are reviewing your academic records. Please allow 2-3 business days.',
        timestamp: '2025-01-12 4:30 PM',
        isAgent: true
      }
    ]
  },
  {
    id: 'TKT-003',
    title: 'Library Card Activation Request',
    category: 'Library',
    status: 'Resolved',
    priority: 'Low',
    createdAt: '2025-01-10 9:00 AM',
    description: 'Need to activate my library card for accessing digital resources',
    assignedTo: 'Library Services',
    responses: [
      {
        id: 1,
        sender: 'Librarian',
        message: 'Your library card has been activated successfully. You can now access all digital resources.',
        timestamp: '2025-01-10 10:30 AM',
        isAgent: true
      }
    ]
  }
];

const sampleFAQs = [
  {
    id: 1,
    question: 'How do I reset my student portal password?',
    answer: 'You can reset your password by clicking on the "Forgot Password" link on the login page. Enter your registered email address and follow the instructions sent to your email.',
    category: 'Account & Login',
    views: 1250,
    helpful: 45
  },
  {
    id: 2,
    question: 'How can I view my examination timetable?',
    answer: 'Go to the Examination section from the sidebar menu. Your personalized exam schedule will be displayed with dates, times, and room numbers.',
    category: 'Academic',
    views: 890,
    helpful: 38
  },
  {
    id: 3,
    question: 'Where can I download my transcript?',
    answer: 'Navigate to the Profile section and click on "Academic Documents". You can download your official transcript, mark sheets, and certificates from there.',
    category: 'Documents',
    views: 650,
    helpful: 42
  },
  {
    id: 4,
    question: 'How do I pay my semester fees online?',
    answer: 'Go to the Fees section from the main menu. Click on "Pay Now" next to your pending fees. You can pay using net banking, UPI, or debit/credit cards.',
    category: 'Financial',
    views: 1100,
    helpful: 50
  },
  {
    id: 5,
    question: 'How can I book library resources?',
    answer: 'Access the Library section and use the search feature to find books or resources. Click on "Reserve" to book items. You will receive a notification when available.',
    category: 'Library',
    views: 420,
    helpful: 28
  }
];

const sampleChatHistory = [
  { id: 1, sender: 'bot', message: 'Hello! I\'m here to help you with any questions about JECRC University. How can I assist you today?', timestamp: '10:30 AM', isBot: true },
  { id: 2, sender: 'user', message: 'I need help with course registration', timestamp: '10:31 AM', isBot: false },
  { id: 3, sender: 'bot', message: 'I\'d be happy to help with course registration! The registration for the next semester opens on January 15th. You can register through the Academics section of your portal.', timestamp: '10:31 AM', isBot: true },
  { id: 4, sender: 'user', message: 'What documents do I need?', timestamp: '10:32 AM', isBot: false },
  { id: 5, sender: 'bot', message: 'For course registration, you typically need:\n• Previous semester marksheet\n• Fee receipt\n• Academic advisor approval\n\nWould you like me to connect you with an academic counselor?', timestamp: '10:32 AM', isBot: true },
];

const supportCategories = [
  { id: 'technical', name: 'Technical Support', icon: '💻', color: 'var(--info)' },
  { id: 'academic', name: 'Academic Affairs', icon: '📚', color: 'var(--success)' },
  { id: 'library', name: 'Library Services', icon: '📖', color: 'var(--warning)' },
  { id: 'financial', name: 'Financial Aid', icon: '💰', color: 'var(--secondary)' },
  { id: 'hostel', name: 'Hostel & Accommodation', icon: '🏠', color: 'var(--accent)' },
  { id: 'general', name: 'General Inquiry', icon: '❓', color: 'var(--muted)' }
];

const supportTeam = [
  {
    id: 1,
    name: 'Dr. Rajesh Sharma',
    role: 'Academic Support Head',
    email: 'rajesh.sharma@jecrc.ac.in',
    phone: '+91 9876543210',
    photo: '/image.png',
    available: true,
    specialization: 'Academic Affairs, Course Registration'
  },
  {
    id: 2,
    name: 'Ms. Priya Gupta',
    role: 'Technical Support Manager',
    email: 'priya.gupta@jecrc.ac.in',
    phone: '+91 9876543211',
    photo: '/image.png',
    available: true,
    specialization: 'Portal Issues, System Support'
  },
  {
    id: 3,
    name: 'Mr. Amit Kumar',
    role: 'Library Services Coordinator',
    email: 'amit.kumar@jecrc.ac.in',
    phone: '+91 9876543212',
    photo: '/image.png',
    available: false,
    specialization: 'Library Resources, Digital Access'
  }
];

const Support = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [tickets, setTickets] = useState(sampleTickets);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [faqs, setFaqs] = useState(sampleFAQs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newTicket, setNewTicket] = useState({
    title: '',
    category: '',
    priority: 'Medium',
    description: '',
    attachments: []
  });
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState(sampleChatHistory);
  const [newMessage, setNewMessage] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [feedback, setFeedback] = useState({ rating: 0, comment: '', category: '' });
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (selectedCategory && faq.category === selectedCategory) ||
    (!selectedCategory)
  );

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    const ticketId = `TKT-${String(tickets.length + 1).padStart(3, '0')}`;
    const newTicketData = {
      id: ticketId,
      ...newTicket,
      status: 'Open',
      createdAt: new Date().toLocaleString(),
      assignedTo: 'Support Team',
      responses: []
    };
    setTickets([newTicketData, ...tickets]);
    setNewTicket({ title: '', category: '', priority: 'Medium', description: '', attachments: [] });
    setShowNewTicketForm(false);
    alert('Ticket created successfully! Ticket ID: ' + ticketId);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const userMessage = {
        id: chatMessages.length + 1,
        sender: 'user',
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isBot: false
      };
      
      setChatMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      
      // Simulate bot response
      setTimeout(() => {
        const botMessage = {
          id: chatMessages.length + 2,
          sender: 'bot',
          message: generateBotResponse(newMessage),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isBot: true
        };
        setChatMessages(prev => [...prev, botMessage]);
      }, 1000);
    }
  };

  const generateBotResponse = (userMessage) => {
    const responses = {
      'fee': 'You can pay your fees through the Fees section in your portal. We accept online payments via net banking, UPI, and cards.',
      'grade': 'Your grades are available in the Result section. If you notice any discrepancies, please raise a support ticket.',
      'library': 'Library services include book reservations, digital resource access, and study room bookings. Visit the Library section for more details.',
      'exam': 'Examination schedules and results are available in the Examination section. You can also download admit cards from there.',
      'assignment': 'Assignment submissions and deadlines are managed in the Assignments section of your portal.',
      'default': 'Thank you for your question! For specific issues, I recommend creating a support ticket so our team can assist you better. Is there anything else I can help you with?'
    };
    
    const lowerMessage = userMessage.toLowerCase();
    for (const [key, response] of Object.entries(responses)) {
      if (lowerMessage.includes(key) && key !== 'default') {
        return response;
      }
    }
    return responses.default;
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your feedback! We appreciate your input and will use it to improve our services.');
    setFeedback({ rating: 0, comment: '', category: '' });
    setShowFeedbackForm(false);
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      'Open': 'var(--danger)',
      'In Progress': 'var(--warning)', 
      'Resolved': 'var(--success)'
    };
    return (
      <span 
        className="px-2 py-1 rounded-full text-xs font-medium text-white"
        style={{ backgroundColor: colors[status] }}
      >
        {status}
      </span>
    );
  };

  const PriorityBadge = ({ priority }) => {
    const colors = {
      'Low': 'var(--success)',
      'Medium': 'var(--warning)',
      'High': 'var(--danger)'
    };
    return (
      <span 
        className="px-2 py-1 rounded text-xs font-medium text-white"
        style={{ backgroundColor: colors[priority] }}
      >
        {priority}
      </span>
    );
  };

  const StarRating = ({ rating, onRatingChange, interactive = false }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={20}
            className={`${interactive ? 'cursor-pointer' : ''} ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
            onClick={interactive ? () => onRatingChange(star) : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Header */}
      <div className="flex items-center mb-6">
        <img src="/image.png" alt="JECRC University Logo" className="w-20 h-8 mr-4" />
        <div>
          <h2 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>Support Center</h2>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Get help with your academic and technical queries</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-6 border-b" style={{ borderColor: 'var(--border)' }}>
        {[
          { id: 'overview', label: 'Overview', icon: <BookOpen size={16} /> },
          { id: 'tickets', label: 'My Tickets', icon: <FileText size={16} /> },
          { id: 'faq', label: 'FAQ', icon: <MessageCircle size={16} /> },
          { id: 'contact', label: 'Contact Support', icon: <Headphones size={16} /> },
          { id: 'feedback', label: 'Feedback', icon: <Star size={16} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors ${
              activeTab === tab.id ? 'border-b-2' : ''
            }`}
            style={{
              backgroundColor: activeTab === tab.id ? 'var(--soft)' : 'transparent',
              color: activeTab === tab.id ? 'var(--accent)' : 'var(--muted)',
              borderColor: activeTab === tab.id ? 'var(--accent)' : 'transparent'
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5" style={{ color: 'var(--accent)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>Open Tickets</span>
              </div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
                {tickets.filter(t => t.status === 'Open').length}
              </p>
            </div>
            
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5" style={{ color: 'var(--warning)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>In Progress</span>
              </div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
                {tickets.filter(t => t.status === 'In Progress').length}
              </p>
            </div>

            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5" style={{ color: 'var(--success)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>Resolved</span>
              </div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
                {tickets.filter(t => t.status === 'Resolved').length}
              </p>
            </div>

            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="h-5 w-5" style={{ color: 'var(--info)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>Avg Response</span>
              </div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>2.4 hrs</p>
            </div>
          </div>

          {/* Support Categories */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>Support Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {supportCategories.map(category => (
                <div key={category.id} className="p-4 rounded-lg cursor-pointer transition-transform hover:scale-105" style={{ backgroundColor: 'var(--card)' }}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{category.icon}</span>
                    <h4 className="font-medium" style={{ color: 'var(--text)' }}>{category.name}</h4>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>Get help with {category.name.toLowerCase()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setActiveTab('tickets')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors"
                style={{ backgroundColor: 'var(--accent)' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--secondary)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--accent)'}
              >
                <Plus size={16} />
                Create New Ticket
              </button>
              <button
                onClick={() => setChatOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--soft)', color: 'var(--text)' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--hover)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--soft)'}
              >
                <Bot size={16} />
                Live Chat Support
              </button>
              <button
                onClick={() => setActiveTab('faq')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--soft)', color: 'var(--text)' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--hover)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--soft)'}
              >
                <BookOpen size={16} />
                Browse FAQ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tickets Tab */}
      {activeTab === 'tickets' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>My Support Tickets</h3>
            <button
              onClick={() => setShowNewTicketForm(!showNewTicketForm)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              <Plus size={16} />
              New Ticket
            </button>
          </div>

          {/* New Ticket Form */}
          {showNewTicketForm && (
            <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
              <h4 className="text-lg font-medium mb-4" style={{ color: 'var(--text)' }}>Create New Ticket</h4>
              <form onSubmit={handleTicketSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newTicket.title}
                      onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                      style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                      placeholder="Brief description of your issue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                      Category *
                    </label>
                    <select
                      required
                      value={newTicket.category}
                      onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                      style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                    >
                      <option value="">Select Category</option>
                      <option value="Technical">Technical Support</option>
                      <option value="Academic">Academic Affairs</option>
                      <option value="Library">Library Services</option>
                      <option value="Financial">Financial Aid</option>
                      <option value="General">General Inquiry</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                    Priority
                  </label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                    style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                    Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                    style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                    placeholder="Please describe your issue in detail..."
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg text-white transition-colors"
                    style={{ backgroundColor: 'var(--accent)' }}
                  >
                    Create Ticket
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewTicketForm(false)}
                    className="px-4 py-2 rounded-lg transition-colors"
                    style={{ backgroundColor: 'var(--soft)', color: 'var(--text)' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tickets List */}
          <div className="space-y-4">
            {tickets.map(ticket => (
              <div
                key={ticket.id}
                className="p-4 rounded-lg cursor-pointer transition-colors"
                style={{ backgroundColor: 'var(--card)' }}
                onClick={() => setSelectedTicket(selectedTicket === ticket.id ? null : ticket.id)}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--soft)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--card)'}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium" style={{ color: 'var(--accent)' }}>{ticket.id}</span>
                      <StatusBadge status={ticket.status} />
                      <PriorityBadge priority={ticket.priority} />
                    </div>
                    <h4 className="font-medium mb-1" style={{ color: 'var(--text)' }}>{ticket.title}</h4>
                    <p className="text-sm mb-2" style={{ color: 'var(--muted)' }}>{ticket.description}</p>
                    <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--muted)' }}>
                      <span>Category: {ticket.category}</span>
                      <span>Created: {ticket.createdAt}</span>
                      <span>Assigned: {ticket.assignedTo}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    {selectedTicket === ticket.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                {/* Ticket Details */}
                {selectedTicket === ticket.id && (
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                    <h5 className="font-medium mb-3" style={{ color: 'var(--text)' }}>Conversation</h5>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {ticket.responses.map(response => (
                        <div
                          key={response.id}
                          className={`p-3 rounded-lg ${response.isAgent ? 'ml-8' : 'mr-8'}`}
                          style={{
                            backgroundColor: response.isAgent ? 'var(--soft)' : 'var(--accent)',
                            color: response.isAgent ? 'var(--text)' : 'white'
                          }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{response.sender}</span>
                            <span className="text-xs opacity-75">{response.timestamp}</span>
                          </div>
                          <p className="text-sm">{response.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--muted)' }} />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-lg"
                style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg"
              style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              <option value="">All Categories</option>
              <option value="Account & Login">Account & Login</option>
              <option value="Academic">Academic</option>
              <option value="Documents">Documents</option>
              <option value="Financial">Financial</option>
              <option value="Library">Library</option>
            </select>
          </div>

          <div className="space-y-4">
            {filteredFAQs.map(faq => (
              <div
                key={faq.id}
                className="p-4 rounded-lg"
                style={{ backgroundColor: 'var(--card)' }}
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  className="w-full flex justify-between items-start text-left"
                >
                  <div className="flex-1">
                    <h4 className="font-medium mb-2" style={{ color: 'var(--text)' }}>{faq.question}</h4>
                    <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--muted)' }}>
                      <span>{faq.category}</span>
                      <span className="flex items-center gap-1">
                        <Eye size={12} />
                        {faq.views} views
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp size={12} />
                        {faq.helpful} helpful
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    {expandedFAQ === faq.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>

                {expandedFAQ === faq.id && (
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                    <p className="mb-4" style={{ color: 'var(--text)' }}>{faq.answer}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm" style={{ color: 'var(--muted)' }}>Was this helpful?</span>
                      <button className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors" style={{ backgroundColor: 'var(--soft)', color: 'var(--text)' }}>
                        <ThumbsUp size={12} />
                        Yes
                      </button>
                      <button className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors" style={{ backgroundColor: 'var(--soft)', color: 'var(--text)' }}>
                        <ThumbsDown size={12} />
                        No
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Support Tab */}
      {activeTab === 'contact' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Support Team */}
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>Support Team</h3>
              <div className="space-y-4">
                {supportTeam.map(member => (
                  <div key={member.id} className="p-4 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
                    <div className="flex items-center gap-4">
                      <img 
                        src={member.photo} 
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium" style={{ color: 'var(--text)' }}>{member.name}</h4>
                          <div className={`w-2 h-2 rounded-full ${member.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        </div>
                        <p className="text-sm" style={{ color: 'var(--muted)' }}>{member.role}</p>
                        <p className="text-xs" style={{ color: 'var(--muted)' }}>{member.specialization}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button className="flex items-center gap-1 px-3 py-1 rounded text-xs text-white transition-colors" style={{ backgroundColor: 'var(--accent)' }}>
                        <Mail size={12} />
                        Email
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1 rounded text-xs text-white transition-colors" style={{ backgroundColor: 'var(--success)' }}>
                        <Phone size={12} />
                        Call
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>Contact Information</h3>
              <div className="p-4 rounded-lg space-y-4" style={{ backgroundColor: 'var(--card)' }}>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5" style={{ color: 'var(--accent)' }} />
                  <div>
                    <p className="font-medium" style={{ color: 'var(--text)' }}>Phone Support</p>
                    <p className="text-sm" style={{ color: 'var(--muted)' }}>+91 141-2773333</p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>Mon-Sat: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5" style={{ color: 'var(--accent)' }} />
                  <div>
                    <p className="font-medium" style={{ color: 'var(--text)' }}>Email Support</p>
                    <p className="text-sm" style={{ color: 'var(--muted)' }}>support@jecrc.ac.in</p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>Response within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5" style={{ color: 'var(--accent)' }} />
                  <div>
                    <p className="font-medium" style={{ color: 'var(--text)' }}>Office Hours</p>
                    <p className="text-sm" style={{ color: 'var(--muted)' }}>Monday - Saturday</p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Tab */}
      {activeTab === 'feedback' && (
        <div className="max-w-2xl mx-auto">
          <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>Share Your Feedback</h3>
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                  Overall Rating
                </label>
                <StarRating 
                  rating={feedback.rating} 
                  onRatingChange={(rating) => setFeedback({...feedback, rating})}
                  interactive={true}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                  Category
                </label>
                <select
                  value={feedback.category}
                  onChange={(e) => setFeedback({...feedback, category: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                >
                  <option value="">Select Category</option>
                  <option value="Support Quality">Support Quality</option>
                  <option value="Response Time">Response Time</option>
                  <option value="Portal Usability">Portal Usability</option>
                  <option value="General">General</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                  Comments
                </label>
                <textarea
                  rows={4}
                  value={feedback.comment}
                  onChange={(e) => setFeedback({...feedback, comment: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                  style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                  placeholder="Share your thoughts and suggestions..."
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg text-white transition-colors"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Live Chat Modal */}
      {chatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full max-w-lg h-96 rounded-lg shadow-xl flex flex-col" style={{ backgroundColor: 'var(--card)' }}>
            <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--border)' }}>
              <h4 className="font-medium" style={{ color: 'var(--text)' }}>Live Chat Support</h4>
              <button
                onClick={() => setChatOpen(false)}
                className="p-1 rounded transition-colors"
                style={{ backgroundColor: 'var(--hover)', color: 'var(--text)' }}
              >
                ✕
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {chatMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                      msg.isBot ? 'rounded-bl-none' : 'rounded-br-none'
                    }`}
                    style={{
                      backgroundColor: msg.isBot ? 'var(--soft)' : 'var(--accent)',
                      color: msg.isBot ? 'var(--text)' : 'white'
                    }}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    <p className="text-xs opacity-75 mt-1">{msg.timestamp}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border rounded-lg text-sm"
                  style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 rounded-lg text-white transition-colors"
                  style={{ backgroundColor: 'var(--accent)' }}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;