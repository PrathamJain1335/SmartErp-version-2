import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText, Plus, Search, Filter, Download, Upload, Edit, Trash2,
  Clock, Calendar, Users, CheckCircle, XCircle, AlertCircle,
  Eye, BarChart3, TrendingUp, TrendingDown, Star, Award,
  MessageSquare, Send, Paperclip, Copy, ExternalLink,
  MoreVertical, Settings, Target, Zap, BookOpen, GraduationCap
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Cell, Legend, AreaChart, Area
} from 'recharts';

const FacultyAssignments = ({ data = [] }) => {
  const [activeView, setActiveView] = useState('overview');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCourse, setFilterCourse] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [gradingAssignment, setGradingAssignment] = useState(null);

  // Enhanced assignments data
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: 'Machine Learning Project - Neural Networks',
      description: 'Implement a neural network from scratch using Python. Include data preprocessing, model training, and evaluation.',
      course: 'CS301',
      courseName: 'Machine Learning',
      type: 'project',
      totalMarks: 100,
      createdDate: '2024-09-01',
      dueDate: '2024-09-20',
      status: 'active',
      submissions: {
        total: 45,
        submitted: 38,
        pending: 7,
        graded: 30,
        avgScore: 82.5
      },
      analytics: {
        difficulty: 'Hard',
        estimatedTime: '15 hours',
        lateSubmissions: 5,
        topScore: 98,
        plagiarismDetected: 2
      },
      attachments: ['ml_project_guidelines.pdf', 'dataset.csv'],
      rubric: {
        implementation: 40,
        documentation: 20,
        testing: 20,
        presentation: 20
      },
      priority: 'high'
    },
    {
      id: 2,
      title: 'Data Visualization Assignment',
      description: 'Create interactive visualizations using D3.js or similar tools. Focus on storytelling with data.',
      course: 'CS401',
      courseName: 'Data Science',
      type: 'assignment',
      totalMarks: 75,
      createdDate: '2024-09-05',
      dueDate: '2024-09-15',
      status: 'active',
      submissions: {
        total: 38,
        submitted: 35,
        pending: 3,
        graded: 35,
        avgScore: 88.2
      },
      analytics: {
        difficulty: 'Medium',
        estimatedTime: '8 hours',
        lateSubmissions: 2,
        topScore: 95,
        plagiarismDetected: 0
      },
      attachments: ['visualization_examples.pdf'],
      rubric: {
        creativity: 25,
        technical: 30,
        clarity: 20
      },
      priority: 'medium'
    },
    {
      id: 3,
      title: 'AI Ethics Research Paper',
      description: 'Write a comprehensive research paper on ethical considerations in artificial intelligence.',
      course: 'CS501',
      courseName: 'Advanced AI',
      type: 'research',
      totalMarks: 50,
      createdDate: '2024-08-20',
      dueDate: '2024-09-10',
      status: 'completed',
      submissions: {
        total: 22,
        submitted: 22,
        pending: 0,
        graded: 22,
        avgScore: 85.7
      },
      analytics: {
        difficulty: 'Hard',
        estimatedTime: '20 hours',
        lateSubmissions: 1,
        topScore: 96,
        plagiarismDetected: 0
      },
      attachments: ['ethics_guidelines.pdf', 'reference_papers.zip'],
      rubric: {
        research: 40,
        analysis: 30,
        writing: 30
      },
      priority: 'high'
    },
    {
      id: 4,
      title: 'Database Design Lab',
      description: 'Design and implement a complete database system for a e-commerce application.',
      course: 'CS201',
      courseName: 'Database Systems',
      type: 'lab',
      totalMarks: 80,
      createdDate: '2024-09-08',
      dueDate: '2024-09-25',
      status: 'draft',
      submissions: {
        total: 52,
        submitted: 0,
        pending: 52,
        graded: 0,
        avgScore: 0
      },
      analytics: {
        difficulty: 'Medium',
        estimatedTime: '12 hours',
        lateSubmissions: 0,
        topScore: 0,
        plagiarismDetected: 0
      },
      attachments: ['database_requirements.pdf'],
      rubric: {
        design: 35,
        implementation: 35,
        documentation: 30
      },
      priority: 'medium'
    }
  ]);

  // Sample student submissions for grading
  const [studentSubmissions] = useState([
    {
      id: 1,
      studentId: 'CSE001',
      studentName: 'Aarav Sharma',
      assignmentId: 1,
      submittedDate: '2024-09-18',
      status: 'submitted',
      score: null,
      feedback: '',
      files: ['neural_network_project.py', 'report.pdf'],
      plagiarismScore: 12,
      submissionTime: '2 days early'
    },
    {
      id: 2,
      studentId: 'CSE002',
      studentName: 'Priya Patel',
      assignmentId: 1,
      submittedDate: '2024-09-19',
      status: 'graded',
      score: 92,
      feedback: 'Excellent implementation with good documentation.',
      files: ['nn_implementation.py', 'analysis.pdf'],
      plagiarismScore: 8,
      submissionTime: '1 day early'
    },
    {
      id: 3,
      studentId: 'CSE003',
      studentName: 'Rohit Kumar',
      assignmentId: 1,
      submittedDate: null,
      status: 'pending',
      score: null,
      feedback: '',
      files: [],
      plagiarismScore: 0,
      submissionTime: 'Not submitted'
    }
  ]);

  // Filtered assignments
  const filteredAssignments = useMemo(() => {
    return assignments.filter(assignment => {
      const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           assignment.courseName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
      const matchesCourse = filterCourse === 'all' || assignment.course === filterCourse;
      
      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [assignments, searchTerm, filterStatus, filterCourse]);

  // Analytics
  const analytics = useMemo(() => {
    const totalAssignments = assignments.length;
    const activeAssignments = assignments.filter(a => a.status === 'active').length;
    const totalSubmissions = assignments.reduce((sum, a) => sum + a.submissions.submitted, 0);
    const avgScore = assignments.reduce((sum, a) => sum + a.submissions.avgScore, 0) / totalAssignments;
    const pendingGrading = assignments.reduce((sum, a) => sum + (a.submissions.submitted - a.submissions.graded), 0);
    
    return {
      totalAssignments,
      activeAssignments,
      totalSubmissions,
      avgScore: avgScore.toFixed(1),
      pendingGrading
    };
  }, [assignments]);

  // Chart data
  const submissionData = assignments.map(assignment => ({
    name: assignment.course,
    submitted: assignment.submissions.submitted,
    pending: assignment.submissions.pending,
    total: assignment.submissions.total
  }));

  const gradeDistribution = [
    { range: '90-100', count: 28, color: '#22c55e' },
    { range: '80-89', count: 45, color: '#3b82f6' },
    { range: '70-79', count: 32, color: '#f59e0b' },
    { range: '60-69', count: 15, color: '#ef4444' },
    { range: '<60', count: 8, color: '#6b7280' }
  ];

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, color }) => (
    <div className="faculty-card p-6 hover:shadow-lg transition-all duration-200">
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

  const AssignmentCard = ({ assignment, onClick }) => {
    const priorityColors = {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#22c55e'
    };

    const statusColors = {
      active: '#3b82f6',
      completed: '#22c55e',
      draft: '#6b7280'
    };

    return (
      <div 
        className="faculty-card p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
        onClick={() => onClick(assignment)}
        style={{ borderTop: `4px solid ${priorityColors[assignment.priority]}` }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-bold px-2 py-1 rounded" style={{ backgroundColor: assignment.course === 'CS301' ? '#ef4444' : assignment.course === 'CS401' ? '#3b82f6' : assignment.course === 'CS501' ? '#10b981' : '#6b7280', color: 'white' }}>
                {assignment.course}
              </span>
              <span className={`text-xs px-2 py-1 rounded ${
                assignment.status === 'active' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                assignment.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
              }`}>
                {assignment.status}
              </span>
              <span className={`text-xs px-2 py-1 rounded ${
                assignment.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                assignment.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}>
                {assignment.priority} priority
              </span>
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{assignment.title}</h3>
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
              {assignment.description.substring(0, 120)}...
            </p>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 hover:bg-opacity-10 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
              <MoreVertical size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {/* Due Date */}
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            <Clock size={14} />
            <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
            <span className="ml-2">• {assignment.totalMarks} marks</span>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
              <span>Submissions</span>
              <span>{assignment.submissions.submitted}/{assignment.submissions.total}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(assignment.submissions.submitted / assignment.submissions.total) * 100}%`,
                  backgroundColor: priorityColors[assignment.priority]
                }}
              ></div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="font-bold text-lg" style={{ color: priorityColors[assignment.priority] }}>{assignment.submissions.submitted}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Submitted</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg" style={{ color: priorityColors[assignment.priority] }}>{assignment.submissions.graded}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Graded</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg" style={{ color: priorityColors[assignment.priority] }}>{assignment.submissions.avgScore}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Avg Score</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg" style={{ color: priorityColors[assignment.priority] }}>{assignment.analytics.lateSubmissions}</div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Late</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AssignmentDetailModal = ({ assignment, onClose }) => {
    if (!assignment) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="faculty-card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg font-bold px-3 py-1 rounded" style={{ backgroundColor: '#ef4444', color: 'white' }}>
                    {assignment.course}
                  </span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    assignment.status === 'active' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {assignment.status}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{assignment.title}</h2>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{assignment.description}</p>
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
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-white" style={{ backgroundColor: 'var(--faculty-primary)' }}>
                <Eye size={16} />
                Grade Submissions
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600" style={{ color: 'var(--text)' }}>
                <Download size={16} />
                Download All
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600" style={{ color: 'var(--text)' }}>
                <BarChart3 size={16} />
                Analytics
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600" style={{ color: 'var(--text)' }}>
                <MessageSquare size={16} />
                Send Reminder
              </button>
            </div>

            {/* Assignment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
                <h4 className="font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Assignment Details</h4>
                <div className="space-y-2 text-sm">
                  <div>Course: <span className="font-medium">{assignment.courseName}</span></div>
                  <div>Type: <span className="font-medium capitalize">{assignment.type}</span></div>
                  <div>Total Marks: <span className="font-medium">{assignment.totalMarks}</span></div>
                  <div>Created: <span className="font-medium">{new Date(assignment.createdDate).toLocaleDateString()}</span></div>
                  <div>Due Date: <span className="font-medium">{new Date(assignment.dueDate).toLocaleDateString()}</span></div>
                  <div>Difficulty: <span className="font-medium">{assignment.analytics.difficulty}</span></div>
                  <div>Est. Time: <span className="font-medium">{assignment.analytics.estimatedTime}</span></div>
                </div>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
                <h4 className="font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Submission Stats</h4>
                <div className="space-y-2 text-sm">
                  <div>Total Students: <span className="font-medium">{assignment.submissions.total}</span></div>
                  <div>Submitted: <span className="font-medium text-green-600">{assignment.submissions.submitted}</span></div>
                  <div>Pending: <span className="font-medium text-red-600">{assignment.submissions.pending}</span></div>
                  <div>Graded: <span className="font-medium text-blue-600">{assignment.submissions.graded}</span></div>
                  <div>Average Score: <span className="font-medium">{assignment.submissions.avgScore}%</span></div>
                  <div>Top Score: <span className="font-medium">{assignment.analytics.topScore}%</span></div>
                  <div>Late Submissions: <span className="font-medium text-yellow-600">{assignment.analytics.lateSubmissions}</span></div>
                </div>
              </div>
            </div>

            {/* Rubric */}
            {assignment.rubric && (
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
                <h4 className="font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Grading Rubric</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(assignment.rubric).map(([criteria, marks]) => (
                    <div key={criteria} className="text-center">
                      <div className="font-bold text-lg" style={{ color: 'var(--faculty-primary)' }}>{marks}</div>
                      <div className="text-xs capitalize" style={{ color: 'var(--text-muted)' }}>{criteria}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attachments */}
            {assignment.attachments && assignment.attachments.length > 0 && (
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
                <h4 className="font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Attachments</h4>
                <div className="space-y-2">
                  {assignment.attachments.map((file, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Paperclip size={16} style={{ color: 'var(--text-muted)' }} />
                      <span className="text-sm" style={{ color: 'var(--text)' }}>{file}</span>
                      <button className="ml-auto text-xs px-2 py-1 rounded" style={{ backgroundColor: 'var(--faculty-primary)', color: 'white' }}>
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const GradingInterface = ({ assignment, students, onClose }) => {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [score, setScore] = useState('');
    const [feedback, setFeedback] = useState('');

    if (!assignment) return null;

    const assignmentSubmissions = studentSubmissions.filter(s => s.assignmentId === assignment.id);

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="faculty-card max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Grade Assignment</h2>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{assignment.title}</p>
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

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Student List */}
              <div className="lg:col-span-1">
                <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Submissions</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {assignmentSubmissions.map((submission) => (
                    <div 
                      key={submission.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedStudent?.id === submission.id ? 'ring-2 ring-red-500' : ''
                      }`}
                      style={{ backgroundColor: 'var(--hover)' }}
                      onClick={() => setSelectedStudent(submission)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{submission.studentName}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{submission.studentId}</p>
                        </div>
                        <div className="text-right">
                          {submission.status === 'graded' ? (
                            <span className="text-sm font-bold text-green-600">{submission.score}/100</span>
                          ) : submission.status === 'submitted' ? (
                            <CheckCircle size={16} className="text-blue-500" />
                          ) : (
                            <XCircle size={16} className="text-red-500" />
                          )}
                        </div>
                      </div>
                      {submission.submittedDate && (
                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                          {submission.submissionTime}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Grading Interface */}
              <div className="lg:col-span-2">
                {selectedStudent ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                        Grading: {selectedStudent.studentName}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Plagiarism: {selectedStudent.plagiarismScore}%</span>
                        {selectedStudent.plagiarismScore > 20 && <AlertCircle size={16} className="text-red-500" />}
                      </div>
                    </div>

                    {/* Files */}
                    <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
                      <h4 className="font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Submitted Files</h4>
                      <div className="space-y-2">
                        {selectedStudent.files.map((file, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <FileText size={16} style={{ color: 'var(--text-muted)' }} />
                            <span className="text-sm" style={{ color: 'var(--text)' }}>{file}</span>
                            <button className="ml-auto text-xs px-2 py-1 rounded" style={{ backgroundColor: 'var(--faculty-primary)', color: 'white' }}>
                              View
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Scoring */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Score (out of {assignment.totalMarks})</label>
                        <input
                          type="number"
                          max={assignment.totalMarks}
                          value={selectedStudent.score || score}
                          onChange={(e) => setScore(e.target.value)}
                          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600"
                          style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
                          placeholder="Enter score"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Grade</label>
                        <select className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600" style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}>
                          <option>A+</option>
                          <option>A</option>
                          <option>B+</option>
                          <option>B</option>
                          <option>C+</option>
                          <option>C</option>
                          <option>D</option>
                          <option>F</option>
                        </select>
                      </div>
                    </div>

                    {/* Feedback */}
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Feedback</label>
                      <textarea
                        value={selectedStudent.feedback || feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        rows={4}
                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600"
                        style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
                        placeholder="Provide detailed feedback to the student..."
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button className="px-4 py-2 rounded-lg text-white" style={{ backgroundColor: 'var(--faculty-primary)' }}>
                        Save Grade
                      </button>
                      <button className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600" style={{ color: 'var(--text)' }}>
                        Save as Draft
                      </button>
                      <button className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600" style={{ color: 'var(--text)' }}>
                        Send Feedback
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64" style={{ color: 'var(--text-muted)' }}>
                    <div className="text-center">
                      <FileText size={48} className="mx-auto mb-4 opacity-50" />
                      <p>Select a student submission to start grading</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="faculty-portal min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Assignments</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Create, manage and grade assignments</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-500"
              style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="draft">Draft</option>
          </select>
          
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white"
            style={{ backgroundColor: 'var(--faculty-primary)' }}
          >
            <Plus size={18} />
            <span>Create Assignment</span>
          </button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <StatCard
          icon={FileText}
          title="Total Assignments"
          value={analytics.totalAssignments}
          subtitle="All assignments"
          color="var(--chart-red)"
          trend={12}
        />
        <StatCard
          icon={Clock}
          title="Active"
          value={analytics.activeAssignments}
          subtitle="Currently active"
          color="var(--chart-secondary)"
          trend={8}
        />
        <StatCard
          icon={CheckCircle}
          title="Submissions"
          value={analytics.totalSubmissions}
          subtitle="Total received"
          color="var(--chart-tertiary)"
          trend={15}
        />
        <StatCard
          icon={Target}
          title="Avg Score"
          value={`${analytics.avgScore}%`}
          subtitle="Overall average"
          color="var(--chart-quaternary)"
          trend={5}
        />
        <StatCard
          icon={AlertCircle}
          title="Pending Grading"
          value={analytics.pendingGrading}
          subtitle="Need attention"
          color="#ef4444"
          trend={-10}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submission Stats */}
        <div className="faculty-card p-6">
          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Submission Statistics
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={submissionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--card)', 
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text)'
                  }} 
                />
                <Bar dataKey="submitted" fill="var(--chart-red)" radius={4} />
                <Bar dataKey="pending" fill="var(--chart-secondary)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="faculty-card p-6">
          <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Grade Distribution
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
                {gradeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Assignments Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Assignments ({filteredAssignments.length})
          </h2>
          <div className="flex items-center gap-2">
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm"
              style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
            >
              <option value="all">All Courses</option>
              <option value="CS301">CS301 - Machine Learning</option>
              <option value="CS401">CS401 - Data Science</option>
              <option value="CS501">CS501 - Advanced AI</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onClick={setSelectedAssignment}
            />
          ))}
        </div>
      </div>

      {/* Assignment Detail Modal */}
      {selectedAssignment && (
        <AssignmentDetailModal 
          assignment={selectedAssignment} 
          onClose={() => setSelectedAssignment(null)} 
        />
      )}

      {/* Grading Modal */}
      {showGradeModal && gradingAssignment && (
        <GradingInterface 
          assignment={gradingAssignment} 
          students={studentSubmissions}
          onClose={() => {
            setShowGradeModal(false);
            setGradingAssignment(null);
          }} 
        />
      )}
    </div>
  );
};

export default FacultyAssignments;
