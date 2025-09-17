import React, { useState, useMemo } from 'react';
import {
  Star,
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
  Calendar,
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
} from 'recharts';
import './theme.css';

// Enhanced sample data for evaluation
const evaluationTypes = [
  { id: 'quiz', name: 'Quiz', color: 'var(--chart-color-1)', weight: 10 },
  { id: 'assignment', name: 'Assignment', color: 'var(--chart-color-2)', weight: 20 },
  { id: 'project', name: 'Project', color: 'var(--chart-color-3)', weight: 25 },
  { id: 'presentation', name: 'Presentation', color: 'var(--chart-color-4)', weight: 15 },
  { id: 'participation', name: 'Participation', color: 'var(--chart-color-5)', weight: 10 },
  { id: 'midterm', name: 'Mid-Term', color: 'var(--chart-color-6)', weight: 20 },
];

const initialEvaluations = [
  {
    id: '1',
    title: 'Quiz 1 - Machine Learning Basics',
    type: 'quiz',
    section: 'CS301-A',
    subject: 'Machine Learning',
    date: '2025-09-10',
    maxMarks: 20,
    duration: '30 minutes',
    status: 'Completed',
    students: [
      { rollNo: 'CSE001', name: 'Aarav Sharma', marks: 18, grade: 'A+' },
      { rollNo: 'CSE002', name: 'Priya Patel', marks: 16, grade: 'A' },
      { rollNo: 'CSE003', name: 'Rohit Kumar', marks: 14, grade: 'B+' },
      { rollNo: 'CSE004', name: 'Sneha Gupta', marks: 19, grade: 'A+' },
    ],
    rubric: {
      concepts: 40,
      application: 30,
      accuracy: 30,
    },
    analytics: {
      average: 16.75,
      highest: 19,
      lowest: 14,
      passRate: 100,
    },
  },
  {
    id: '2',
    title: 'Assignment 1 - Neural Network Implementation',
    type: 'assignment',
    section: 'CS301-A',
    subject: 'Machine Learning',
    date: '2025-09-20',
    maxMarks: 50,
    duration: '1 week',
    status: 'In Progress',
    students: [
      { rollNo: 'CSE001', name: 'Aarav Sharma', marks: null, grade: null },
      { rollNo: 'CSE002', name: 'Priya Patel', marks: 45, grade: 'A' },
      { rollNo: 'CSE003', name: 'Rohit Kumar', marks: null, grade: null },
      { rollNo: 'CSE004', name: 'Sneha Gupta', marks: 48, grade: 'A+' },
    ],
    rubric: {
      implementation: 50,
      documentation: 20,
      testing: 20,
      creativity: 10,
    },
    analytics: {
      average: 46.5,
      highest: 48,
      lowest: 45,
      passRate: 100,
    },
  },
  {
    id: '3',
    title: 'Project - Data Science Application',
    type: 'project',
    section: 'CS401-A',
    subject: 'Data Science',
    date: '2025-12-01',
    maxMarks: 100,
    duration: '1 month',
    status: 'Scheduled',
    students: [],
    rubric: {
      proposal: 20,
      implementation: 40,
      presentation: 25,
      documentation: 15,
    },
    analytics: {
      average: 0,
      highest: 0,
      lowest: 0,
      passRate: 0,
    },
  },
];

const FacultyEvaluation = ({ initialEvaluations: propEvaluations, onSaveMarks, ...props }) => {
  const [evaluations, setEvaluations] = useState(propEvaluations || initialEvaluations);
  const [activeView, setActiveView] = useState('overview');
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRubricModal, setShowRubricModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);

  // Filtered evaluations
  const filteredEvaluations = useMemo(() => {
    return evaluations.filter((evaluation) => {
      const matchesSearch =
        evaluation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        evaluation.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSection = selectedSection === 'all' || evaluation.section === selectedSection;
      const matchesType = selectedType === 'all' || evaluation.type === selectedType;

      return matchesSearch && matchesSection && matchesType;
    });
  }, [evaluations, searchTerm, selectedSection, selectedType]);

  // Analytics
  const analytics = useMemo(() => {
    const total = evaluations.length;
    const completed = evaluations.filter((e) => e.status === 'Completed').length;
    const inProgress = evaluations.filter((e) => e.status === 'In Progress').length;
    const scheduled = evaluations.filter((e) => e.status === 'Scheduled').length;

    // Grade analysis from completed evaluations
    const allMarks = [];
    evaluations.forEach((evaluation) => {
      if (evaluation.status === 'Completed') {
        evaluation.students.forEach((student) => {
          if (student.marks) allMarks.push((student.marks / evaluation.maxMarks) * 100);
        });
      }
    });

    const avgPercentage =
      allMarks.length > 0
        ? (allMarks.reduce((sum, mark) => sum + mark, 0) / allMarks.length).toFixed(2)
        : 0;

    // Grade distribution data
    const gradeCounts = {
      'A+': allMarks.filter((m) => m >= 90).length,
      A: allMarks.filter((m) => m >= 80 && m < 90).length,
      'B+': allMarks.filter((m) => m >= 70 && m < 80).length,
      B: allMarks.filter((m) => m >= 60 && m < 70).length,
      C: allMarks.filter((m) => m >= 50 && m < 60).length,
    };
    const gradeDistributionData = Object.entries(gradeCounts)
      .filter(([, count]) => count > 0)
      .map(([name, value], index) => ({
        name,
        value,
        color: `var(--chart-color-${index + 1})`,
      }));

    return {
      totalEvaluations: total,
      completedEvaluations: completed,
      inProgressEvaluations: inProgress,
      scheduledEvaluations: scheduled,
      averagePercentage: avgPercentage,
      totalStudentsEvaluated: allMarks.length,
      gradeDistributionData,
    };
  }, [evaluations]);

  // Chart data
  const evaluationStatusData = [
    { name: 'Completed', value: analytics.completedEvaluations, color: 'var(--chart-color-3)' },
    { name: 'In Progress', value: analytics.inProgressEvaluations, color: 'var(--chart-color-4)' },
    { name: 'Scheduled', value: analytics.scheduledEvaluations, color: 'var(--chart-color-2)' },
  ];

  const evaluationTypeData = evaluationTypes.map((type) => ({
    name: type.name,
    count: evaluations.filter((e) => e.type === type.id).length,
    color: type.color,
  }));

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

  const EvaluationCard = ({ evaluation, onView, onEdit, onGrade }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'Completed':
          return 'var(--chart-color-3)';
        case 'In Progress':
          return 'var(--chart-color-4)';
        case 'Scheduled':
          return 'var(--chart-color-2)';
        default:
          return 'var(--chart-color-1)';
      }
    };

    const typeInfo = evaluationTypes.find((t) => t.id === evaluation.type);

    return (
      <div className="faculty-card p-6 hover:shadow-lg transition-all duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {evaluation.title}
              </h3>
              <span
                className="px-3 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: getStatusColor(evaluation.status) }}
              >
                {evaluation.status}
              </span>
            </div>
            <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
              {evaluation.subject} • {evaluation.section}
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={16} style={{ color: 'var(--text-muted)' }} />
                <span>{evaluation.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock size={16} style={{ color: 'var(--text-muted)' }} />
                <span>{evaluation.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target size={16} style={{ color: 'var(--text-muted)' }} />
                <span>{evaluation.maxMarks} marks</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star size={16} style={{ color: typeInfo?.color || 'var(--text-muted)' }} />
                <span>{typeInfo?.name || evaluation.type}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onView(evaluation)}
              className="p-2 hover:bg-opacity-10 rounded-lg"
              style={{ backgroundColor: 'var(--hover)' }}
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => onEdit(evaluation)}
              className="p-2 hover:bg-opacity-10 rounded-lg"
              style={{ backgroundColor: 'var(--hover)' }}
            >
              <Edit size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {evaluation.status === 'Completed' && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle size={16} />
                <span>Graded ({evaluation.students.length} students)</span>
              </div>
            )}
            {evaluation.status === 'In Progress' && (
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: 'var(--chart-color-4)' }}
              >
                <Clock size={16} />
                <span>
                  In progress ({evaluation.students.filter((s) => s.marks !== null).length}/
                  {evaluation.students.length})
                </span>
              </div>
            )}
            {evaluation.status === 'Scheduled' && (
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                <Calendar size={16} />
                <span>Scheduled</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedEvaluation(evaluation);
                setShowGradeModal(true);
              }}
              className="px-4 py-2 text-sm rounded-lg text-white"
              style={{ backgroundColor: 'var(--faculty-primary)' }}
            >
              {evaluation.status === 'Completed' ? 'View Grades' : 'Grade Students'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Modal for creating a new evaluation
  const CreateEvaluationModal = ({ onClose }) => {
    const [newEvaluation, setNewEvaluation] = useState({
      title: '',
      type: 'quiz',
      section: 'CS301-A',
      subject: 'Machine Learning',
      date: '',
      maxMarks: 20,
      duration: '30 minutes',
      status: 'Scheduled',
      students: [],
      rubric: {},
      analytics: { average: 0, highest: 0, lowest: 0, passRate: 0 },
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      setEvaluations([...evaluations, { ...newEvaluation, id: (evaluations.length + 1).toString() }]);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Create New Evaluation
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Evaluation Title"
              value={newEvaluation.title}
              onChange={(e) => setNewEvaluation({ ...newEvaluation, title: e.target.value })}
              className="w-full p-2 border rounded"
              style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
            />
            <select
              value={newEvaluation.type}
              onChange={(e) => setNewEvaluation({ ...newEvaluation, type: e.target.value })}
              className="w-full p-2 border rounded"
              style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
            >
              {evaluationTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            <select
              value={newEvaluation.section}
              onChange={(e) => setNewEvaluation({ ...newEvaluation, section: e.target.value })}
              className="w-full p-2 border rounded"
              style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
            >
              <option value="CS301-A">CS301-A</option>
              <option value="CS401-A">CS401-A</option>
              <option value="CS501-A">CS501-A</option>
            </select>
            <input
              type="date"
              value={newEvaluation.date}
              onChange={(e) => setNewEvaluation({ ...newEvaluation, date: e.target.value })}
              className="w-full p-2 border rounded"
              style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
            />
            <input
              type="number"
              placeholder="Max Marks"
              value={newEvaluation.maxMarks}
              onChange={(e) =>
                setNewEvaluation({ ...newEvaluation, maxMarks: parseInt(e.target.value) || 0 })
              }
              className="w-full p-2 border rounded"
              style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
            />
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

  // Modal for managing rubrics
  const RubricModal = ({ onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Manage Rubrics
          </h2>
          <div className="space-y-4">
            {evaluationTypes.map((type) => (
              <div key={type.id} className="p-4 border rounded" style={{ backgroundColor: 'var(--card)' }}>
                <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                  {type.name} (Weight: {type.weight}%)
                </h3>
                <p style={{ color: 'var(--text-muted)' }}>Edit criteria here...</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Modal for grading
  const GradeModal = ({ evaluation, onClose }) => {
    const [grades, setGrades] = useState(
      evaluation.students.reduce((acc, student) => ({ ...acc, [student.rollNo]: student }), {})
    );

    const handleGradeChange = (rollNo, value) => {
      const marks = parseInt(value) || 0;
      const grade = marks >= 90 ? 'A+' : marks >= 80 ? 'A' : marks >= 70 ? 'B+' : marks >= 60 ? 'B' : 'C';
      setGrades({
        ...grades,
        [rollNo]: { ...grades[rollNo], marks, grade },
      });
    };

    const handleSave = () => {
      setEvaluations(
        evaluations.map((e) =>
          e.id === evaluation.id
            ? {
                ...e,
                students: Object.values(grades).map((student) => ({
                  ...student,
                  marks: student.marks,
                  grade: student.marks >= 50 ? student.grade : 'F', // Assuming 50% pass
                })),
                status: 'Completed',
              }
            : e
        )
      );
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-2xl">
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Grade Students - {evaluation.title}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2">Roll No</th>
                  <th className="text-left py-2">Student</th>
                  <th className="text-left py-2">Marks</th>
                  <th className="text-left py-2">Grade</th>
                </tr>
              </thead>
              <tbody>
                {evaluation.students.map((student) => (
                  <tr key={student.rollNo} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2">{student.rollNo}</td>
                    <td className="py-2">{student.name}</td>
                    <td className="py-2">
                      <input
                        type="number"
                        value={grades[student.rollNo]?.marks || ''}
                        onChange={(e) => handleGradeChange(student.rollNo, e.target.value)}
                        className="w-20 p-1 border rounded"
                        style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
                        min="0"
                        max={evaluation.maxMarks}
                      />
                    </td>
                    <td className="py-2">{grades[student.rollNo]?.grade || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Save Grades
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
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
            Evaluation Management
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Manage continuous assessments and internal evaluations
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white"
            style={{ backgroundColor: 'var(--faculty-primary)' }}
          >
            <Plus size={18} />
            Create Evaluation
          </button>
          <button
            onClick={() => setShowRubricModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
            style={{ color: 'var(--text)' }}
          >
            <ClipboardList size={18} />
            Manage Rubrics
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <StatCard
          icon={ClipboardList}
          title="Total Evaluations"
          value={analytics.totalEvaluations}
          subtitle="All assessments"
          color="var(--chart-color-1)"
          trend={8}
        />
        <StatCard
          icon={CheckCircle}
          title="Completed"
          value={analytics.completedEvaluations}
          subtitle="Evaluations finished"
          color="var(--chart-color-3)"
          trend={5}
        />
        <StatCard
          icon={Clock}
          title="In Progress"
          value={analytics.inProgressEvaluations}
          subtitle="Currently grading"
          color="var(--chart-color-4)"
          trend={-2}
        />
        <StatCard
          icon={Target}
          title="Average Score"
          value={`${analytics.averagePercentage}%`}
          subtitle="Overall performance"
          color="var(--chart-color-2)"
          trend={4}
        />
        <StatCard
          icon={Users}
          title="Students Evaluated"
          value={analytics.totalStudentsEvaluated}
          subtitle="Assessments completed"
          color="var(--chart-color-5)"
          trend={12}
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {['overview', 'evaluations', 'rubrics', 'analytics'].map((tab) => (
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
            placeholder="Search evaluations..."
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
          <option value="CS301-A">CS301-A</option>
          <option value="CS401-A">CS401-A</option>
          <option value="CS501-A">CS501-A</option>
        </select>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
          style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}
        >
          <option value="all">All Types</option>
          {evaluationTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>

      {/* Content based on active view */}
      {activeView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Evaluation Status Chart */}
          <div className="faculty-card p-6">
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Evaluation Status
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={evaluationStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {evaluationStatusData.map((entry, index) => (
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

          {/* Evaluation Types Distribution */}
          <div className="faculty-card p-6">
            <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Evaluation Types
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={evaluationTypeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                  <XAxis
                    dataKey="name"
                    stroke="var(--text-muted)"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis stroke="var(--text-muted)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text)',
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {evaluationTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeView === 'evaluations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Evaluations ({filteredEvaluations.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredEvaluations.map((evaluation) => (
              <EvaluationCard
                key={evaluation.id}
                evaluation={evaluation}
                onView={() => setSelectedEvaluation(evaluation)}
                onEdit={() => setSelectedEvaluation(evaluation)}
                onGrade={() => {
                  setSelectedEvaluation(evaluation);
                  setShowGradeModal(true);
                }}
              />
            ))}
          </div>

          {filteredEvaluations.length === 0 && (
            <div className="text-center py-12">
              <ClipboardList
                size={48}
                className="mx-auto mb-4"
                style={{ color: 'var(--text-muted)' }}
              />
              <p className="text-lg mb-2" style={{ color: 'var(--text-primary)' }}>
                No evaluations found
              </p>
              <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      )}

      {activeView === 'rubrics' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Evaluation Rubrics
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {evaluationTypes.map((type) => (
              <div key={type.id} className="faculty-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: type.color + '20' }}>
                      <Star size={20} style={{ color: type.color }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                        {type.name}
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        Weight: {type.weight}%
                      </p>
                    </div>
                  </div>
                  <button
                    className="px-3 py-1 text-sm rounded-lg border border-gray-300 dark:border-gray-600"
                    style={{ color: 'var(--text)' }}
                  >
                    Edit Rubric
                  </button>
                </div>

                <div className="text-sm space-y-2">
                  <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Default Criteria:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>• Knowledge & Understanding</div>
                    <div>• Application & Analysis</div>
                    <div>• Communication</div>
                    <div>• Critical Thinking</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeView === 'analytics' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Evaluation Analytics
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Performance Summary */}
            <div className="faculty-card p-6">
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Performance Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Evaluations:</span>
                  <span className="font-bold">{analytics.totalEvaluations}</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Score:</span>
                  <span className="font-bold">{analytics.averagePercentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Students Assessed:</span>
                  <span className="font-bold">{analytics.totalStudentsEvaluated}</span>
                </div>
                <div className="flex justify-between">
                  <span>Completion Rate:</span>
                  <span className="font-bold text-green-600">85%</span>
                </div>
              </div>
            </div>

            {/* Grade Distribution */}
            <div className="faculty-card p-6">
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Grade Distribution
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.gradeDistributionData}>
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
                      {analytics.gradeDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Evaluation Timeline */}
            <div className="faculty-card p-6">
              <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Upcoming Evaluations
              </h3>
              <div className="space-y-3">
                {evaluations
                  .filter((e) => e.status !== 'Completed')
                  .slice(0, 4)
                  .map((evaluation) => (
                    <div
                      key={evaluation.id}
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: 'var(--hover)' }}
                    >
                      <div className="font-medium">{evaluation.title}</div>
                      <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        {evaluation.date} • {evaluation.section}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && <CreateEvaluationModal onClose={() => setShowCreateModal(false)} />}
      {showRubricModal && <RubricModal onClose={() => setShowRubricModal(false)} />}
      {showGradeModal && selectedEvaluation && (
        <GradeModal evaluation={selectedEvaluation} onClose={() => setShowGradeModal(false)} />
      )}
    </div>
  );
};

export default FacultyEvaluation;