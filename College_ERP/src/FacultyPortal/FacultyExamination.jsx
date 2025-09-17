import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  FileText,
  Users,
  BookOpen,
  Upload,
  Download,
  CheckCircle,
  AlertCircle,
  XCircle,
  Edit,
  Trash2,
  Plus,
  Filter,
  BarChart3,
  PieChart,
  TrendingUp,
  Search,
  Bell,
  Settings,
  Eye,
  Share2,
  Copy,
  Save,
  RefreshCw,
  Zap,
  Target,
  Award,
  User,
  GraduationCap,
  ClipboardList,
  MessageSquare,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import './theme.css';

// Enhanced sample data
const sections = [
  { id: 'CS301-A', name: 'CS301-A', course: 'Machine Learning', students: 35, semester: 'VI' },
  { id: 'CS301-B', name: 'CS301-B', course: 'Machine Learning', students: 32, semester: 'VI' },
  { id: 'CS401-A', name: 'CS401-A', course: 'Data Science', students: 28, semester: 'VIII' },
  { id: 'CS501-A', name: 'CS501-A', course: 'Advanced AI', students: 25, semester: 'X' },
];

const subjects = [
  { id: 'ML', name: 'Machine Learning', code: 'CS301', credits: 4, type: 'Core' },
  { id: 'DS', name: 'Data Science', code: 'CS401', credits: 4, type: 'Core' },
  { id: 'AI', name: 'Advanced AI', code: 'CS501', credits: 4, type: 'Elective' },
  { id: 'DL', name: 'Deep Learning', code: 'CS502', credits: 3, type: 'Elective' },
];

const studentData = {
  'CS301-A': [
    { id: 1, rollNo: 'CSE001', name: 'Aarav Sharma', email: 'aarav@jecrc.edu' },
    { id: 2, rollNo: 'CSE002', name: 'Priya Patel', email: 'priya@jecrc.edu' },
    { id: 3, rollNo: 'CSE003', name: 'Rohit Kumar', email: 'rohit@jecrc.edu' },
    { id: 4, rollNo: 'CSE004', name: 'Sneha Gupta', email: 'sneha@jecrc.edu' },
  ],
  'CS301-B': [
    { id: 5, rollNo: 'CSE005', name: 'Arjun Singh', email: 'arjun@jecrc.edu' },
    { id: 6, rollNo: 'CSE006', name: 'Kavya Reddy', email: 'kavya@jecrc.edu' },
    { id: 7, rollNo: 'CSE007', name: 'Vikram Joshi', email: 'vikram@jecrc.edu' },
  ],
  'CS401-A': [
    { id: 8, rollNo: 'CSE008', name: 'Ananya Das', email: 'ananya@jecrc.edu' },
    { id: 9, rollNo: 'CSE009', name: 'Karan Mehta', email: 'karan@jecrc.edu' },
  ],
  'CS501-A': [
    { id: 10, rollNo: 'CSE010', name: 'Disha Agarwal', email: 'disha@jecrc.edu' },
    { id: 11, rollNo: 'CSE011', name: 'Harsh Pandey', email: 'harsh@jecrc.edu' },
  ],
};

// Enhanced exam data
const initialExams = [
  {
    id: '1',
    title: 'Mid-Term Examination',
    type: 'Mid-Term',
    section: 'CS301-A',
    subject: 'Machine Learning',
    date: '2025-09-15',
    time: '10:00 AM',
    duration: '3 hours',
    totalMarks: 100,
    room: 'Room 101',
    invigilator: 'Dr. Sarah Johnson',
    paper: null,
    grades: {
      'CSE001': { marks: 85, grade: 'A', status: 'Pass' },
      'CSE002': { marks: 92, grade: 'A+', status: 'Pass' },
      'CSE003': { marks: 78, grade: 'B+', status: 'Pass' },
      'CSE004': { marks: 95, grade: 'A+', status: 'Pass' },
    },
    status: 'Completed',
    instructions: 'Bring calculator and rough sheets. No mobile phones allowed.',
    questionPattern: { mcq: 20, shortAnswer: 30, longAnswer: 50 },
  },
  {
    id: '2',
    title: 'Final Examination',
    type: 'Final',
    section: 'CS301-A',
    subject: 'Machine Learning',
    date: '2025-12-20',
    time: '2:00 PM',
    duration: '3 hours',
    totalMarks: 100,
    room: 'Room 102',
    invigilator: 'Dr. Sarah Johnson',
    paper: 'ml_final_2025.pdf',
    grades: {},
    status: 'Scheduled',
    instructions: 'Comprehensive exam covering all topics. Reference sheets provided.',
    questionPattern: { mcq: 30, shortAnswer: 40, longAnswer: 30 },
  },
  {
    id: '3',
    title: 'Quiz - Neural Networks',
    type: 'Quiz',
    section: 'CS501-A',
    subject: 'Advanced AI',
    date: '2025-09-25',
    time: '11:00 AM',
    duration: '1 hour',
    totalMarks: 50,
    room: 'Room 201',
    invigilator: 'Dr. Sarah Johnson',
    paper: null,
    grades: {},
    status: 'Upcoming',
    instructions: 'Online quiz via LMS. Ensure stable internet connection.',
    questionPattern: { mcq: 40, shortAnswer: 10, longAnswer: 0 },
  },
];

const FacultyExamination = () => {
  const [exams, setExams] = useState(initialExams);
  const [activeView, setActiveView] = useState('overview');
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);

  // Filtered exams
  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      const matchesSearch =
        exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSection = selectedSection === 'all' || exam.section === selectedSection;
      const matchesSubject = selectedSubject === 'all' || exam.subject === selectedSubject;

      return matchesSearch && matchesSection && matchesSubject;
    });
  }, [exams, searchTerm, selectedSection, selectedSubject]);

  // Analytics and Grade Data
  const { analytics, allGrades } = useMemo(() => {
    const total = exams.length;
    const completed = exams.filter((e) => e.status === 'Completed').length;
    const upcoming = exams.filter((e) => e.status === 'Upcoming').length;
    const scheduled = exams.filter((e) => e.status === 'Scheduled').length;

    // Grade analysis from completed exams
    const allGrades = [];
    exams.forEach((exam) => {
      if (exam.status === 'Completed') {
        Object.values(exam.grades).forEach((grade) => {
          if (grade.marks !== undefined && grade.marks !== null) {
            allGrades.push(grade.marks);
          }
        });
      }
    });

    const avgMarks =
      allGrades.length > 0
        ? (allGrades.reduce((sum, mark) => sum + mark, 0) / allGrades.length).toFixed(2)
        : 0;
    const passRate =
      allGrades.length > 0
        ? (
            (allGrades.filter((mark) => mark >= 40).length / allGrades.length) *
            100
          ).toFixed(2)
        : 0; // Assuming 40 is pass mark

    const analyticsData = {
      totalExams: total,
      completedExams: completed,
      upcomingExams: upcoming,
      scheduledExams: scheduled,
      averageMarks: avgMarks,
      totalStudentsGraded: allGrades.length,
      passRate: passRate,
    };

    return {
      analytics: analyticsData,
      allGrades: allGrades,
    };
  }, [exams]);

  // Chart data
  const examStatusData = [
    { name: 'Completed', value: analytics.completedExams, color: 'var(--chart-color-3)' },
    { name: 'Upcoming', value: analytics.upcomingExams, color: 'var(--chart-color-2)' },
    { name: 'Scheduled', value: analytics.scheduledExams, color: 'var(--chart-color-4)' },
  ];

  const gradeDistributionData = [
    { name: 'A+', value: allGrades.filter((m) => m >= 90).length, color: 'var(--chart-color-3)' },
    { name: 'A', value: allGrades.filter((m) => m >= 80 && m < 90).length, color: 'var(--chart-color-2)' },
    { name: 'B+', value: allGrades.filter((m) => m >= 70 && m < 80).length, color: 'var(--chart-color-4)' },
    { name: 'B', value: allGrades.filter((m) => m >= 60 && m < 70).length, color: 'var(--chart-color-5)' },
    { name: 'C', value: allGrades.filter((m) => m >= 50 && m < 60).length, color: 'var(--chart-color-1)' },
  ].filter((item) => item.value > 0); // Filter out zero values

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, color }) => (
    <div className="faculty-card p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl bg-opacity-10" style={{ backgroundColor: color }}>
          <Icon size={24} style={{ color }} />
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              trend > 0 ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {trend > 0 ? <TrendingUp size={16} /> : <TrendingUp size={16} className="rotate-180" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <div className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          {value}
        </div>
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          {title}
        </p>
        {subtitle && (
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );

  const ExamCard = ({ exam, onView, onEdit, onGrade }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'Completed':
          return 'var(--chart-color-3)';
        case 'Upcoming':
          return 'var(--chart-color-2)';
        case 'Scheduled':
          return 'var(--chart-color-4)';
        default:
          return 'var(--chart-color-1)';
      }
    };

    return (
      <div className="faculty-card p-6 hover:shadow-lg transition-all duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {exam.title}
              </h3>
              <span
                className="px-3 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: getStatusColor(exam.status) }}
              >
                {exam.status}
              </span>
            </div>
            <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
              {exam.subject} • {exam.section}
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={16} style={{ color: 'var(--text-muted)' }} />
                <span>{exam.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock size={16} style={{ color: 'var(--text-muted)' }} />
                <span>{exam.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users size={16} style={{ color: 'var(--text-muted)' }} />
                <span>{exam.room}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target size={16} style={{ color: 'var(--text-muted)' }} />
                <span>{exam.totalMarks} marks</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onView(exam)}
              className="p-2 hover:bg-opacity-10 rounded-lg"
              style={{ backgroundColor: 'var(--hover)' }}
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => onEdit(exam)}
              className="p-2 hover:bg-opacity-10 rounded-lg"
              style={{ backgroundColor: 'var(--hover)' }}
            >
              <Edit size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {exam.paper ? (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <FileText size={16} />
                <span>Paper uploaded</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                <Upload size={16} />
                <span>No paper</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {exam.status === 'Completed' && (
              <button
                onClick={() => onGrade(exam)}
                className="px-4 py-2 text-sm rounded-lg text-white"
                style={{ backgroundColor: 'var(--faculty-primary)' }}
              >
                View Grades
              </button>
            )}
            {exam.status !== 'Completed' && (
              <button
                onClick={() => onGrade(exam)}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600"
                style={{ color: 'var(--text)' }}
              >
                Grade Students
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Modal for creating a new exam
  const CreateExamModal = ({ onClose }) => {
    const [newExam, setNewExam] = useState({
      title: '',
      type: 'Mid-Term',
      section: sections[0]?.id || 'CS301-A',
      subject: subjects[0]?.name || 'Machine Learning',
      date: '',
      time: '',
      duration: '3 hours',
      totalMarks: 100,
      room: 'Room 101',
      invigilator: 'Dr. Sarah Johnson',
      paper: null,
      status: 'Scheduled',
      instructions: '',
      questionPattern: { mcq: 20, shortAnswer: 30, longAnswer: 50 },
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
      const newErrors = {};
      
      if (!newExam.title.trim()) {
        newErrors.title = 'Title is required';
      }
      if (!newExam.date) {
        newErrors.date = 'Date is required';
      }
      if (!newExam.time) {
        newErrors.time = 'Time is required';
      }
      if (newExam.totalMarks <= 0) {
        newErrors.totalMarks = 'Total marks must be greater than 0';
      }
      if (!newExam.room.trim()) {
        newErrors.room = 'Room is required';
      }
      
      return newErrors;
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const formErrors = validateForm();
      
      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
      }
      
      const newExamWithId = {
        ...newExam,
        id: Date.now().toString(), // Better ID generation
        grades: {},
        createdAt: new Date().toISOString(),
      };
      
      setExams(prevExams => [...prevExams, newExamWithId]);
      onClose();
    };

    const handleInputChange = (field, value) => {
      setNewExam(prevExam => ({ ...prevExam, [field]: value }));
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors(prevErrors => ({ ...prevErrors, [field]: '' }));
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div 
          className="p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto"
          style={{ backgroundColor: 'var(--card)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Create New Exam
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              type="button"
            >
              <XCircle size={20} style={{ color: 'var(--text-muted)' }} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Exam Title"
                value={newExam.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full p-2 border rounded ${
                  errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>
            
            <select
              value={newExam.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full p-2 border rounded border-gray-300 dark:border-gray-600"
              style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
            >
              <option value="Mid-Term">Mid-Term</option>
              <option value="Final">Final</option>
              <option value="Quiz">Quiz</option>
            </select>
            
            <select
              value={newExam.section}
              onChange={(e) => handleInputChange('section', e.target.value)}
              className="w-full p-2 border rounded border-gray-300 dark:border-gray-600"
              style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
            >
              {sections.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.name}
                </option>
              ))}
            </select>
            
            <select
              value={newExam.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              className="w-full p-2 border rounded border-gray-300 dark:border-gray-600"
              style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
            >
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.name}>
                  {sub.name}
                </option>
              ))}
            </select>
            
            <div>
              <input
                type="date"
                value={newExam.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={`w-full p-2 border rounded ${
                  errors.date ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>
            
            <div>
              <input
                type="time"
                value={newExam.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className={`w-full p-2 border rounded ${
                  errors.time ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
              />
              {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <input
                  type="number"
                  placeholder="Total Marks"
                  value={newExam.totalMarks}
                  onChange={(e) => handleInputChange('totalMarks', parseInt(e.target.value) || 0)}
                  className={`w-full p-2 border rounded ${
                    errors.totalMarks ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
                  min="1"
                />
                {errors.totalMarks && <p className="text-red-500 text-sm mt-1">{errors.totalMarks}</p>}
              </div>
              
              <div>
                <input
                  type="text"
                  placeholder="Room"
                  value={newExam.room}
                  onChange={(e) => handleInputChange('room', e.target.value)}
                  className={`w-full p-2 border rounded ${
                    errors.room ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
                />
                {errors.room && <p className="text-red-500 text-sm mt-1">{errors.room}</p>}
              </div>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Create
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    );
  };

  // Modal for grading
  const GradeModal = ({ exam, onClose }) => {
    const [grades, setGrades] = useState(exam.grades || {});
    const [loading, setLoading] = useState(false);
    const students = studentData[exam.section] || [];

    const handleGradeChange = (rollNo, field, value) => {
      const numericValue = field === 'marks' ? Math.max(0, Math.min(parseInt(value) || 0, exam.totalMarks)) : value;
      
      setGrades(prevGrades => ({
        ...prevGrades,
        [rollNo]: {
          ...prevGrades[rollNo],
          [field]: numericValue,
          grade: field === 'marks' ? calculateGrade(numericValue) : prevGrades[rollNo]?.grade || 'F',
          status: field === 'marks' ? (numericValue >= 40 ? 'Pass' : 'Fail') : prevGrades[rollNo]?.status || 'Fail',
        },
      }));
    };

    const calculateGrade = (marks) => {
      if (marks >= 90) return 'A+';
      if (marks >= 80) return 'A';
      if (marks >= 70) return 'B+';
      if (marks >= 60) return 'B';
      if (marks >= 50) return 'C';
      return 'F';
    };

    const handleSave = async () => {
      setLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setExams(prevExams =>
          prevExams.map((e) => 
            e.id === exam.id 
              ? { 
                  ...e, 
                  grades: { ...grades }, 
                  status: Object.keys(grades).length > 0 ? 'Completed' : e.status,
                  lastUpdated: new Date().toISOString()
                } 
              : e
          )
        );
        onClose();
      } catch (error) {
        console.error('Failed to save grades:', error);
      } finally {
        setLoading(false);
      }
    };

    const getGradeColor = (grade) => {
      switch (grade) {
        case 'A+': case 'A': return 'text-green-600 bg-green-100';
        case 'B+': case 'B': return 'text-blue-600 bg-blue-100';
        case 'C': return 'text-yellow-600 bg-yellow-100';
        default: return 'text-red-600 bg-red-100';
      }
    };

    const getStatusColor = (status) => {
      return status === 'Pass' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div 
          className="p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          style={{ backgroundColor: 'var(--card)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Grade Students - {exam.title}
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {exam.subject} • {exam.section} • Total Marks: {exam.totalMarks}
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50"
              type="button"
            >
              <XCircle size={20} style={{ color: 'var(--text-muted)' }} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2">Roll No</th>
                  <th className="text-left py-2">Student</th>
                  <th className="text-left py-2">Marks</th>
                  <th className="text-left py-2">Grade</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.rollNo} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2">{student.rollNo}</td>
                    <td className="py-2">{student.name}</td>
                    <td className="py-2">
                      <input
                        type="number"
                        value={grades[student.rollNo]?.marks || ''}
                        onChange={(e) =>
                          handleGradeChange(student.rollNo, 'marks', e.target.value)
                        }
                        className="w-20 p-1 border rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
                        min="0"
                        max={exam.totalMarks}
                        placeholder="0"
                      />
                    </td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        getGradeColor(grades[student.rollNo]?.grade || 'F')
                      }`}>
                        {grades[student.rollNo]?.grade || 'F'}
                      </span>
                    </td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        getStatusColor(grades[student.rollNo]?.status || 'Fail')
                      }`}>
                        {grades[student.rollNo]?.status || 'Fail'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className={`px-4 py-2 text-white rounded transition-colors ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <RefreshCw size={16} className="animate-spin" />
                  Saving...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save size={16} />
                  Save Grades
                </div>
              )}
            </button>
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
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
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Examination Management
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Manage exams, grades, and student assessments
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white"
            style={{ backgroundColor: 'var(--faculty-primary)' }}
          >
            <Plus size={18} />
            Create Exam
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <StatCard
          icon={FileText}
          title="Total Exams"
          value={analytics.totalExams}
          subtitle="All examinations"
          color="var(--chart-color-1)"
          trend={5}
        />
        <StatCard
          icon={CheckCircle}
          title="Completed"
          value={analytics.completedExams}
          subtitle="Exams finished"
          color="var(--chart-color-3)"
          trend={2}
        />
        <StatCard
          icon={Clock}
          title="Upcoming"
          value={analytics.upcomingExams}
          subtitle="Scheduled exams"
          color="var(--chart-color-2)"
          trend={-1}
        />
        <StatCard
          icon={Target}
          title="Average Marks"
          value={`${analytics.averageMarks}%`}
          subtitle="Overall performance"
          color="var(--chart-color-4)"
          trend={3}
        />
        <StatCard
          icon={Users}
          title="Students Graded"
          value={analytics.totalStudentsGraded}
          subtitle="Assessments completed"
          color="var(--chart-color-5)"
          trend={8}
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {['overview', 'exams', 'grades', 'analytics'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveView(tab)}
            className={`px-4 py-2 font-medium capitalize transition-colors ${
              activeView === tab
                ? 'border-b-2 border-red-500 text-red-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            placeholder="Search exams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-red-500"
            style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
          />
        </div>

        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
          style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
        >
          <option value="all">All Sections</option>
          {sections.map((section) => (
            <option key={section.id} value={section.id}>
              {section.name}
            </option>
          ))}
        </select>

        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
          style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
        >
          <option value="all">All Subjects</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.name}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>

      {/* Content based on active view */}
      {activeView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Exam Status Chart */}
          <div className="faculty-card p-6">
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Exam Status Distribution
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={examStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {examStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text)',
                    }}
                  />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Grade Distribution Chart */}
          <div className="faculty-card p-6">
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Grade Distribution
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                  <XAxis dataKey="name" stroke="var(--text-muted)" />
                  <YAxis stroke="var(--text-muted)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text)',
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {gradeDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeView === 'exams' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Examinations ({filteredExams.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredExams.map((exam) => (
              <ExamCard
                key={exam.id}
                exam={exam}
                onView={() => setSelectedExam(exam)}
                onEdit={() => setSelectedExam(exam)}
                onGrade={() => {
                  setSelectedExam(exam);
                  setShowGradeModal(true);
                }}
              />
            ))}
          </div>

          {filteredExams.length === 0 && (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
              <p className="text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                No exams found
              </p>
              <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      )}

      {activeView === 'grades' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Grade Management
          </h2>

          <div className="grid grid-cols-1 gap-6">
            {exams.filter((e) => e.status === 'Completed').map((exam) => (
              <div key={exam.id} className="faculty-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                      {exam.title}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {exam.subject} • {exam.section} • {exam.date}
                    </p>
                  </div>
                  <button
                    className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600"
                    style={{ color: 'var(--text)' }}
                  >
                    <Download size={16} className="inline mr-2" />
                    Export Grades
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-2">Roll No</th>
                        <th className="text-left py-2">Student</th>
                        <th className="text-left py-2">Marks</th>
                        <th className="text-left py-2">Grade</th>
                        <th className="text-left py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(exam.grades).map(([rollNo, gradeData]) => (
                        <tr key={rollNo} className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-2">{rollNo}</td>
                          <td className="py-2">
                            {studentData[exam.section]?.find((s) => s.rollNo === rollNo)?.name ||
                              'Unknown'}
                          </td>
                          <td className="py-2">{gradeData.marks}/{exam.totalMarks}</td>
                          <td className="py-2">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                              {gradeData.grade}
                            </span>
                          </td>
                          <td className="py-2">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                              {gradeData.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeView === 'analytics' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Examination Analytics
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Performance Overview */}
            <div className="faculty-card p-6">
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Performance Overview
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Exams Conducted:</span>
                  <span className="font-bold">{analytics.completedExams}</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Marks:</span>
                  <span className="font-bold">{analytics.averageMarks}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Students Assessed:</span>
                  <span className="font-bold">{analytics.totalStudentsGraded}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pass Rate:</span>
                  <span className="font-bold text-green-600">{analytics.passRate}%</span>
                </div>
              </div>
            </div>

            {/* Upcoming Exams */}
            <div className="faculty-card p-6">
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Upcoming Schedule
              </h3>
              <div className="space-y-3">
                {exams
                  .filter((e) => e.status === 'Upcoming' || e.status === 'Scheduled')
                  .slice(0, 3)
                  .map((exam) => (
                    <div
                      key={exam.id}
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: 'var(--hover)' }}
                    >
                      <div className="font-medium">{exam.title}</div>
                      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        {exam.date} • {exam.time}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="faculty-card p-6">
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Quick Statistics
              </h3>
              <div className="space-y-3">
                <div
                  className="text-center p-3 rounded-lg"
                  style={{ backgroundColor: 'var(--hover)' }}
                >
                  <div className="text-2xl font-bold" style={{ color: 'var(--chart-color-3)' }}>
                    95%
                  </div>
                  <div className="text-sm">Attendance Rate</div>
                </div>
                <div
                  className="text-center p-3 rounded-lg"
                  style={{ backgroundColor: 'var(--hover)' }}
                >
                  <div className="text-2xl font-bold" style={{ color: 'var(--chart-color-2)' }}>
                    8.7
                  </div>
                  <div className="text-sm">Average CGPA</div>
                </div>
                <div
                  className="text-center p-3 rounded-lg"
                  style={{ backgroundColor: 'var(--hover)' }}
                >
                  <div className="text-2xl font-bold" style={{ color: 'var(--chart-color-4)' }}>
                    98%
                  </div>
                  <div className="text-sm">Submission Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && <CreateExamModal onClose={() => setShowCreateModal(false)} />}
      {showGradeModal && selectedExam && (
        <GradeModal exam={selectedExam} onClose={() => setShowGradeModal(false)} />
      )}
    </div>
  );
};

export default FacultyExamination;