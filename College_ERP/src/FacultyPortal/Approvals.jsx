import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle, XCircle, Clock, AlertCircle, Eye, Search, Filter,
  Users, FileText, Calendar, MessageSquare, Download, Upload,
  TrendingUp, TrendingDown, BarChart3, Star, Award, Target,
  Send, Bell, AlertTriangle, Info, CheckSquare, X, Plus,
  MoreVertical, Settings, Zap, BookOpen, GraduationCap, User
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Cell, Legend, AreaChart, Area
} from 'recharts';

const FacultyApprovals = ({ data = [] }) => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Enhanced approvals data
  const [approvals, setApprovals] = useState([
    {
      id: 1,
      type: 'Grade Change',
      title: 'Grade Change Request - CS301 Final Exam',
      description: 'Student requesting grade change from B+ to A- due to calculation error in final exam.',
      studentId: 'CSE001',
      studentName: 'Aarav Sharma',
      course: 'CS301',
      courseName: 'Machine Learning',
      semester: 'VI',
      status: 'pending',
      priority: 'medium',
      requestDate: '2024-09-10',
      dueDate: '2024-09-17',
      submittedBy: 'student',
      documents: ['grade_appeal_form.pdf', 'exam_paper_scan.pdf'],
      currentGrade: 'B+',
      requestedGrade: 'A-',
      reason: 'Calculation error in question 4, should have received 8/10 instead of 6/10',
      facultyNotes: '',
      lastActivity: '2 hours ago',
      reviewedBy: null,
      approvalHistory: [
        { action: 'submitted', date: '2024-09-10', by: 'Aarav Sharma', notes: 'Initial submission' }
      ]
    },
    {
      id: 2,
      type: 'Assignment Extension',
      title: 'Assignment Extension - Data Science Project',
      description: 'Request for 5-day extension on data visualization project due to medical emergency.',
      studentId: 'CSE002',
      studentName: 'Priya Patel',
      course: 'CS401',
      courseName: 'Data Science',
      semester: 'VIII',
      status: 'pending',
      priority: 'high',
      requestDate: '2024-09-12',
      dueDate: '2024-09-14',
      submittedBy: 'student',
      documents: ['medical_certificate.pdf', 'extension_request.pdf'],
      originalDueDate: '2024-09-15',
      requestedDueDate: '2024-09-20',
      reason: 'Hospitalized due to dengue fever, unable to complete project work',
      facultyNotes: '',
      lastActivity: '4 hours ago',
      reviewedBy: null,
      approvalHistory: [
        { action: 'submitted', date: '2024-09-12', by: 'Priya Patel', notes: 'Extension request with medical docs' }
      ]
    },
    {
      id: 3,
      type: 'Course Registration',
      title: 'Late Course Registration - Advanced AI',
      description: 'Late registration request for CS501 Advanced AI course after registration deadline.',
      studentId: 'CSE003',
      studentName: 'Rohit Kumar',
      course: 'CS501',
      courseName: 'Advanced AI',
      semester: 'X',
      status: 'approved',
      priority: 'low',
      requestDate: '2024-09-05',
      dueDate: '2024-09-12',
      submittedBy: 'advisor',
      documents: ['prerequisite_completion.pdf', 'academic_advisor_approval.pdf'],
      reason: 'Student completed prerequisites late, advisor recommends approval',
      facultyNotes: 'Student has strong academic record, prerequisites recently completed with A grades.',
      lastActivity: '2 days ago',
      reviewedBy: 'Dr. Sarah Johnson',
      reviewDate: '2024-09-11',
      approvalHistory: [
        { action: 'submitted', date: '2024-09-05', by: 'Academic Advisor', notes: 'Late registration request' },
        { action: 'reviewed', date: '2024-09-11', by: 'Dr. Sarah Johnson', notes: 'Approved due to exceptional circumstances' }
      ]
    },
    {
      id: 4,
      type: 'Makeup Exam',
      title: 'Makeup Exam Request - Database Systems',
      description: 'Request for makeup exam due to family emergency during scheduled exam.',
      studentId: 'CSE004',
      studentName: 'Sneha Gupta',
      course: 'CS201',
      courseName: 'Database Systems',
      semester: 'IV',
      status: 'rejected',
      priority: 'medium',
      requestDate: '2024-09-08',
      dueDate: '2024-09-15',
      submittedBy: 'student',
      documents: ['emergency_documentation.pdf'],
      reason: 'Family emergency, could not attend scheduled exam',
      facultyNotes: 'Request submitted after deadline. No prior communication about emergency.',
      lastActivity: '1 day ago',
      reviewedBy: 'Dr. Sarah Johnson',
      reviewDate: '2024-09-12',
      rejectionReason: 'Request submitted too late, no prior communication',
      approvalHistory: [
        { action: 'submitted', date: '2024-09-08', by: 'Sneha Gupta', notes: 'Makeup exam request' },
        { action: 'rejected', date: '2024-09-12', by: 'Dr. Sarah Johnson', notes: 'Late submission, policy violation' }
      ]
    },
    {
      id: 5,
      type: 'Grade Change',
      title: 'Grade Correction - Programming Assignment',
      description: 'Faculty-initiated grade correction for incorrectly calculated assignment score.',
      studentId: 'CSE005',
      studentName: 'Arjun Singh',
      course: 'CS301',
      courseName: 'Machine Learning',
      semester: 'VI',
      status: 'pending',
      priority: 'high',
      requestDate: '2024-09-13',
      dueDate: '2024-09-20',
      submittedBy: 'faculty',
      documents: ['grade_calculation_error.pdf', 'corrected_rubric.pdf'],
      currentGrade: 'C+',
      requestedGrade: 'B+',
      reason: 'Error in automated grading system, manual review shows higher score',
      facultyNotes: 'Grading system bug affected multiple students, correction needed',
      lastActivity: '6 hours ago',
      reviewedBy: null,
      approvalHistory: [
        { action: 'submitted', date: '2024-09-13', by: 'Dr. Sarah Johnson', notes: 'Faculty-initiated correction' }
      ]
    },
    {
      id: 6,
      type: 'Special Consideration',
      title: 'Attendance Waiver - Medical Condition',
      description: 'Request for attendance requirement waiver due to chronic medical condition.',
      studentId: 'CSE006',
      studentName: 'Ananya Das',
      course: 'CS401',
      courseName: 'Data Science',
      semester: 'VIII',
      status: 'under_review',
      priority: 'high',
      requestDate: '2024-09-11',
      dueDate: '2024-09-18',
      submittedBy: 'student',
      documents: ['medical_certificate.pdf', 'doctor_recommendation.pdf', 'attendance_record.pdf'],
      reason: 'Chronic condition affecting regular attendance, seeking alternative assessment',
      facultyNotes: 'Under review with academic committee',
      lastActivity: '1 hour ago',
      reviewedBy: 'Academic Committee',
      approvalHistory: [
        { action: 'submitted', date: '2024-09-11', by: 'Ananya Das', notes: 'Medical waiver request' },
        { action: 'forwarded', date: '2024-09-12', by: 'Dr. Sarah Johnson', notes: 'Sent to academic committee' }
      ]
    }
  ]);

  // Filtered approvals
  const filteredApprovals = useMemo(() => {
    return approvals.filter(approval => {
      const matchesSearch = approval.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           approval.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           approval.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || approval.type.toLowerCase().replace(' ', '_') === filterType;
      const matchesPriority = filterPriority === 'all' || approval.priority === filterPriority;
      const matchesTab = activeTab === 'all' || 
        (activeTab === 'pending' && approval.status === 'pending') ||
        (activeTab === 'approved' && approval.status === 'approved') ||
        (activeTab === 'rejected' && approval.status === 'rejected') ||
        (activeTab === 'under_review' && approval.status === 'under_review');
      
      return matchesSearch && matchesType && matchesPriority && matchesTab;
    });
  }, [approvals, searchTerm, filterType, filterPriority, activeTab]);

  // Analytics
  const analytics = useMemo(() => {
    const totalApprovals = approvals.length;
    const pendingApprovals = approvals.filter(a => a.status === 'pending').length;
    const approvedApprovals = approvals.filter(a => a.status === 'approved').length;
    const rejectedApprovals = approvals.filter(a => a.status === 'rejected').length;
    const underReviewApprovals = approvals.filter(a => a.status === 'under_review').length;
    const urgentApprovals = approvals.filter(a => a.priority === 'high' && a.status === 'pending').length;
    
    return {
      totalApprovals,
      pendingApprovals,
      approvedApprovals,
      rejectedApprovals,
      underReviewApprovals,
      urgentApprovals
    };
  }, [approvals]);

  // Chart data
  const statusData = [
    { name: 'Pending', value: analytics.pendingApprovals, color: '#f59e0b' },
    { name: 'Approved', value: analytics.approvedApprovals, color: '#22c55e' },
    { name: 'Rejected', value: analytics.rejectedApprovals, color: '#ef4444' },
    { name: 'Under Review', value: analytics.underReviewApprovals, color: '#3b82f6' }
  ];

  const typeData = [
    { name: 'Grade Change', count: approvals.filter(a => a.type === 'Grade Change').length },
    { name: 'Assignment Extension', count: approvals.filter(a => a.type === 'Assignment Extension').length },
    { name: 'Course Registration', count: approvals.filter(a => a.type === 'Course Registration').length },
    { name: 'Makeup Exam', count: approvals.filter(a => a.type === 'Makeup Exam').length },
    { name: 'Special Consideration', count: approvals.filter(a => a.type === 'Special Consideration').length }
  ];

  const handleApproval = (id, action, notes = '') => {
    setApprovals(prev => prev.map(approval => {
      if (approval.id === id) {
        const updatedHistory = [...approval.approvalHistory, {
          action,
          date: new Date().toISOString().split('T')[0],
          by: 'Dr. Sarah Johnson',
          notes
        }];
        return {
          ...approval,
          status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'under_review',
          reviewedBy: 'Dr. Sarah Johnson',
          reviewDate: new Date().toISOString().split('T')[0],
          facultyNotes: notes,
          approvalHistory: updatedHistory,
          lastActivity: 'just now'
        };
      }
      return approval;
    }));
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, color, onClick }) => (
    <div 
      className="faculty-card p-6 hover:shadow-lg transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl bg-opacity-10" style={{ backgroundColor: color }}>
          <Icon size={24} style={{ color }} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {trend > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <div className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{value}</div>
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{title}</p>
        {subtitle && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
      </div>
    </div>
  );

  const ApprovalCard = ({ approval, onClick }) => {
    const priorityColors = {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#22c55e'
    };

    const statusColors = {
      pending: '#f59e0b',
      approved: '#22c55e',
      rejected: '#ef4444',
      under_review: '#3b82f6'
    };

    return (
      <div 
        className="faculty-card p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
        onClick={() => onClick(approval)}
        style={{ borderLeft: `4px solid ${priorityColors[approval.priority]}` }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-bold px-2 py-1 rounded" style={{ backgroundColor: statusColors[approval.status], color: 'white' }}>
                {approval.type}
              </span>
              <span className={`text-xs px-2 py-1 rounded ${
                approval.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                approval.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                approval.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              }`}>
                {approval.status.replace('_', ' ')}
              </span>
              <span className={`text-xs px-2 py-1 rounded ${
                approval.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                approval.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}>
                {approval.priority} priority
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{approval.title}</h3>
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
              {approval.description.substring(0, 120)}...
            </p>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 hover:bg-opacity-10 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
              <MoreVertical size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {/* Student Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User size={16} style={{ color: 'var(--text-muted)' }} />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {approval.studentName} ({approval.studentId})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} style={{ color: 'var(--text-muted)' }} />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Due: {new Date(approval.dueDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Course Info */}
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            <BookOpen size={14} />
            <span>{approval.courseName} ({approval.course})</span>
          </div>

          {/* Quick Actions */}
          {approval.status === 'pending' && (
            <div className="flex gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleApproval(approval.id, 'approve', 'Approved via quick action');
                }}
                className="flex-1 px-3 py-2 text-xs rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                <CheckCircle size={12} className="inline mr-1" />
                Approve
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleApproval(approval.id, 'reject', 'Rejected via quick action');
                }}
                className="flex-1 px-3 py-2 text-xs rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <XCircle size={12} className="inline mr-1" />
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const ApprovalDetailModal = ({ approval, onClose }) => {
    if (!approval) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="faculty-card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg font-bold px-3 py-1 rounded" style={{ backgroundColor: '#ef4444', color: 'white' }}>
                    {approval.type}
                  </span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    approval.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    approval.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    approval.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {approval.status.replace('_', ' ')}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{approval.title}</h2>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{approval.description}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-opacity-10 rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--hover)' }}
              >
                ×
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Student & Course Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
                <h4 className="font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Student Information</h4>
                <div className="space-y-2 text-sm">
                  <div>Name: <span className="font-medium">{approval.studentName}</span></div>
                  <div>ID: <span className="font-medium">{approval.studentId}</span></div>
                  <div>Course: <span className="font-medium">{approval.courseName}</span></div>
                  <div>Semester: <span className="font-medium">{approval.semester}</span></div>
                </div>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
                <h4 className="font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Request Details</h4>
                <div className="space-y-2 text-sm">
                  <div>Submitted: <span className="font-medium">{new Date(approval.requestDate).toLocaleDateString()}</span></div>
                  <div>Due Date: <span className="font-medium">{new Date(approval.dueDate).toLocaleDateString()}</span></div>
                  <div>Priority: <span className="font-medium capitalize">{approval.priority}</span></div>
                  <div>Submitted By: <span className="font-medium capitalize">{approval.submittedBy}</span></div>
                </div>
              </div>
            </div>

            {/* Request Details */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
              <h4 className="font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Reason for Request</h4>
              <p className="text-sm" style={{ color: 'var(--text)' }}>{approval.reason}</p>
            </div>

            {/* Documents */}
            {approval.documents && approval.documents.length > 0 && (
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
                <h4 className="font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Supporting Documents</h4>
                <div className="space-y-2">
                  {approval.documents.map((doc, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <FileText size={16} style={{ color: 'var(--text-muted)' }} />
                      <span className="text-sm" style={{ color: 'var(--text)' }}>{doc}</span>
                      <button className="ml-auto text-xs px-2 py-1 rounded" style={{ backgroundColor: 'var(--faculty-primary)', color: 'white' }}>
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Faculty Notes */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
              <h4 className="font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Faculty Notes</h4>
              <textarea
                value={approval.facultyNotes}
                onChange={(e) => {
                  setApprovals(prev => prev.map(a => 
                    a.id === approval.id ? { ...a, facultyNotes: e.target.value } : a
                  ));
                }}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
                rows={4}
                placeholder="Add your notes here..."
              />
            </div>

            {/* Approval History */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
              <h4 className="font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Approval History</h4>
              <div className="space-y-3">
                {approval.approvalHistory.map((entry, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded border border-gray-200 dark:border-gray-600">
                    <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--faculty-primary)' }}></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm capitalize" style={{ color: 'var(--text-primary)' }}>{entry.action}</span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(entry.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>By {entry.by}</p>
                      {entry.notes && <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{entry.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            {approval.status === 'pending' && (
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    handleApproval(approval.id, 'approve', approval.facultyNotes || 'Approved after review');
                    onClose();
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle size={16} />
                  Approve Request
                </button>
                <button 
                  onClick={() => {
                    handleApproval(approval.id, 'reject', approval.facultyNotes || 'Rejected after review');
                    onClose();
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700"
                >
                  <XCircle size={16} />
                  Reject Request
                </button>
                <button 
                  onClick={() => {
                    handleApproval(approval.id, 'under_review', approval.facultyNotes || 'Forwarded for additional review');
                    onClose();
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
                  style={{ color: 'var(--text)' }}
                >
                  <Eye size={16} />
                  Forward for Review
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const TabButton = ({ id, label, count, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'text-white' 
          : 'hover:bg-opacity-10'
      }`}
      style={{
        backgroundColor: isActive ? 'var(--faculty-primary)' : 'transparent'
      }}
    >
      <span className="font-medium">{label}</span>
      <span className={`text-xs px-2 py-1 rounded-full ${
        isActive ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'
      }`}>
        {count}
      </span>
    </button>
  );

  return (
    <div className="faculty-portal min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Approvals</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Manage student requests and academic approvals</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search approvals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-500"
              style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
          >
            <option value="all">All Types</option>
            <option value="grade_change">Grade Change</option>
            <option value="assignment_extension">Assignment Extension</option>
            <option value="course_registration">Course Registration</option>
            <option value="makeup_exam">Makeup Exam</option>
            <option value="special_consideration">Special Consideration</option>
          </select>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <StatCard
          icon={FileText}
          title="Total Requests"
          value={analytics.totalApprovals}
          subtitle="All time"
          color="var(--chart-red)"
          trend={8}
        />
        <StatCard
          icon={Clock}
          title="Pending"
          value={analytics.pendingApprovals}
          subtitle="Awaiting action"
          color="#f59e0b"
          trend={-5}
          onClick={() => setActiveTab('pending')}
        />
        <StatCard
          icon={CheckCircle}
          title="Approved"
          value={analytics.approvedApprovals}
          subtitle="Completed"
          color="#22c55e"
          trend={12}
          onClick={() => setActiveTab('approved')}
        />
        <StatCard
          icon={XCircle}
          title="Rejected"
          value={analytics.rejectedApprovals}
          subtitle="Declined"
          color="#ef4444"
          trend={3}
          onClick={() => setActiveTab('rejected')}
        />
        <StatCard
          icon={Eye}
          title="Under Review"
          value={analytics.underReviewApprovals}
          subtitle="In progress"
          color="#3b82f6"
          trend={-2}
          onClick={() => setActiveTab('under_review')}
        />
        <StatCard
          icon={AlertTriangle}
          title="Urgent"
          value={analytics.urgentApprovals}
          subtitle="High priority"
          color="#ef4444"
          trend={15}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="faculty-card p-6">
          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Approval Status Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text)'
                  }} 
                />
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Request Types */}
        <div className="faculty-card p-6">
          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Request Types Overview
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text)'
                  }} 
                />
                <Bar dataKey="count" fill="var(--chart-red)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="faculty-card p-4">
        <div className="flex flex-wrap gap-2">
          <TabButton
            id="pending"
            label="Pending"
            count={analytics.pendingApprovals}
            isActive={activeTab === 'pending'}
            onClick={setActiveTab}
          />
          <TabButton
            id="under_review"
            label="Under Review"
            count={analytics.underReviewApprovals}
            isActive={activeTab === 'under_review'}
            onClick={setActiveTab}
          />
          <TabButton
            id="approved"
            label="Approved"
            count={analytics.approvedApprovals}
            isActive={activeTab === 'approved'}
            onClick={setActiveTab}
          />
          <TabButton
            id="rejected"
            label="Rejected"
            count={analytics.rejectedApprovals}
            isActive={activeTab === 'rejected'}
            onClick={setActiveTab}
          />
        </div>
      </div>

      {/* Approvals Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {activeTab.replace('_', ' ').charAt(0).toUpperCase() + activeTab.slice(1)} Requests ({filteredApprovals.length})
          </h2>
          <div className="flex items-center gap-2">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm"
              style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredApprovals.map((approval) => (
            <ApprovalCard
              key={approval.id}
              approval={approval}
              onClick={setSelectedApproval}
            />
          ))}
        </div>

        {filteredApprovals.length === 0 && (
          <div className="faculty-card p-12 text-center">
            <FileText size={48} className="mx-auto mb-4 opacity-50" style={{ color: 'var(--text-muted)' }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>No approvals found</h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>

      {/* Approval Detail Modal */}
      {selectedApproval && (
        <ApprovalDetailModal 
          approval={selectedApproval} 
          onClose={() => setSelectedApproval(null)} 
        />
      )}
    </div>
  );
};

export default FacultyApprovals;
