import React, { useState, useRef, useEffect } from 'react';
import {
  GraduationCap,
  Users,
  Trophy,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  FileText,
  Download,
  Upload,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit3,
  Save,
  X,
  Plus,
  Settings,
  Target,
  Award,
  BookOpen,
  Calculator,
  Eye,
  EyeOff,
  Star,
  Clock,
  Calendar,
  Zap,
  RefreshCw,
  Send,
  ChevronDown,
  ChevronUp,
  ArrowUpDown
} from 'lucide-react';
import aiPaperReaderService from '../services/aiPaperReaderService';

const FacultyResults = () => {
  const [selectedClass, setSelectedClass] = useState('CS301-A');
  const [selectedExam, setSelectedExam] = useState('midterm');
  const [viewMode, setViewMode] = useState('grid'); // grid, table
  const [searchTerm, setSearchTerm] = useState('');
  const [resultsData, setResultsData] = useState({});
  const [editingStudent, setEditingStudent] = useState(null);
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [extractedResults, setExtractedResults] = useState(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [gradeDistribution, setGradeDistribution] = useState({});

  const fileInputRef = useRef(null);

  // Mock class data
  const classes = [
    { id: 'CS301-A', name: 'Machine Learning - Section A', students: 45, subject: 'CS301' },
    { id: 'CS401-B', name: 'Data Science - Section B', students: 38, subject: 'CS401' },
    { id: 'CS501-C', name: 'Advanced AI - Section C', students: 32, subject: 'CS501' }
  ];

  const examTypes = [
    { id: 'midterm', name: 'Mid-Term Exam', maxMarks: 50, weight: 30 },
    { id: 'final', name: 'Final Exam', maxMarks: 100, weight: 50 },
    { id: 'assignment', name: 'Assignments', maxMarks: 100, weight: 20 },
    { id: 'project', name: 'Project Work', maxMarks: 100, weight: 25 }
  ];

  // Mock students data with results
  const mockStudents = [
    { 
      id: 'CSE001', 
      rollNo: 'CSE001', 
      name: 'Aarav Sharma', 
      email: 'aarav@jecrc.edu',
      results: {
        midterm: { marks: 42, maxMarks: 50, grade: 'A', percentage: 84 },
        final: { marks: 88, maxMarks: 100, grade: 'A', percentage: 88 },
        assignment: { marks: 92, maxMarks: 100, grade: 'A+', percentage: 92 },
        project: { marks: 85, maxMarks: 100, grade: 'A', percentage: 85 }
      }
    },
    { 
      id: 'CSE002', 
      rollNo: 'CSE002', 
      name: 'Priya Patel', 
      email: 'priya@jecrc.edu',
      results: {
        midterm: { marks: 38, maxMarks: 50, grade: 'B+', percentage: 76 },
        final: { marks: 82, maxMarks: 100, grade: 'A-', percentage: 82 },
        assignment: { marks: 88, maxMarks: 100, grade: 'A', percentage: 88 },
        project: { marks: 90, maxMarks: 100, grade: 'A+', percentage: 90 }
      }
    },
    { 
      id: 'CSE003', 
      rollNo: 'CSE003', 
      name: 'Rohit Kumar', 
      email: 'rohit@jecrc.edu',
      results: {
        midterm: { marks: 45, maxMarks: 50, grade: 'A+', percentage: 90 },
        final: { marks: 95, maxMarks: 100, grade: 'A+', percentage: 95 },
        assignment: { marks: 89, maxMarks: 100, grade: 'A', percentage: 89 },
        project: { marks: 88, maxMarks: 100, grade: 'A', percentage: 88 }
      }
    },
    { 
      id: 'CSE004', 
      rollNo: 'CSE004', 
      name: 'Sneha Gupta', 
      email: 'sneha@jecrc.edu',
      results: {
        midterm: { marks: 32, maxMarks: 50, grade: 'B', percentage: 64 },
        final: { marks: 72, maxMarks: 100, grade: 'B+', percentage: 72 },
        assignment: { marks: 75, maxMarks: 100, grade: 'B+', percentage: 75 },
        project: { marks: 78, maxMarks: 100, grade: 'B+', percentage: 78 }
      }
    },
    { 
      id: 'CSE005', 
      rollNo: 'CSE005', 
      name: 'Arjun Singh', 
      email: 'arjun@jecrc.edu',
      results: {
        midterm: { marks: 40, maxMarks: 50, grade: 'A-', percentage: 80 },
        final: { marks: 85, maxMarks: 100, grade: 'A', percentage: 85 },
        assignment: { marks: 82, maxMarks: 100, grade: 'A-', percentage: 82 },
        project: { marks: 84, maxMarks: 100, grade: 'A', percentage: 84 }
      }
    }
  ];

  // Initialize results data
  useEffect(() => {
    const key = `${selectedClass}-${selectedExam}`;
    if (!resultsData[key]) {
      const initialData = mockStudents.map(student => ({
        ...student,
        result: student.results[selectedExam] || { marks: 0, maxMarks: 100, grade: 'F', percentage: 0 }
      }));
      setResultsData(prev => ({ ...prev, [key]: initialData }));
    }
  }, [selectedClass, selectedExam]);

  // Calculate grade distribution
  useEffect(() => {
    const currentResults = resultsData[`${selectedClass}-${selectedExam}`] || [];
    const distribution = currentResults.reduce((acc, student) => {
      const grade = student.result.grade;
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    }, {});
    setGradeDistribution(distribution);
  }, [resultsData, selectedClass, selectedExam]);

  const currentResults = resultsData[`${selectedClass}-${selectedExam}`] || [];
  
  // Filter and sort students
  let filteredStudents = currentResults.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (sortConfig.key) {
    filteredStudents.sort((a, b) => {
      let aValue = sortConfig.key === 'name' ? a.name : 
                   sortConfig.key === 'rollNo' ? a.rollNo :
                   sortConfig.key === 'marks' ? a.result.marks :
                   sortConfig.key === 'percentage' ? a.result.percentage :
                   a.result.grade;
      let bValue = sortConfig.key === 'name' ? b.name : 
                   sortConfig.key === 'rollNo' ? b.rollNo :
                   sortConfig.key === 'marks' ? b.result.marks :
                   sortConfig.key === 'percentage' ? b.result.percentage :
                   b.result.grade;

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortConfig.direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }

  // Handle AI paper processing
  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    setProcessingProgress(0);
    
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const progress = aiPaperReaderService.getProcessingProgress(startTime);
      setProcessingProgress(progress.progress);
      if (progress.progress >= 100) {
        clearInterval(progressInterval);
      }
    }, 100);

    try {
      const result = await aiPaperReaderService.processResultsSheet(
        files[0], 
        selectedClass, 
        selectedExam, 
        aiPrompt
      );

      if (result.success) {
        setExtractedResults(result.extractedData);
        console.log('🤖 AI Results Processing complete:', result);
      }
    } catch (error) {
      console.error('AI processing failed:', error);
    } finally {
      setIsProcessing(false);
      clearInterval(progressInterval);
    }
  };

  // Apply AI extracted results
  const applyAIResults = () => {
    if (!extractedResults) return;

    const key = `${selectedClass}-${selectedExam}`;
    const updatedResults = currentResults.map(student => {
      const extracted = extractedResults.students.find(s => s.rollNo === student.rollNo);
      if (extracted) {
        return {
          ...student,
          result: {
            marks: extracted.marks,
            maxMarks: extracted.maxMarks,
            grade: extracted.grade,
            percentage: Math.round((extracted.marks / extracted.maxMarks) * 100),
            confidence: extracted.confidence,
            aiProcessed: true
          }
        };
      }
      return student;
    });

    setResultsData(prev => ({ ...prev, [key]: updatedResults }));
    setExtractedResults(null);
    setShowAIModal(false);
  };

  // Update individual result
  const updateResult = (studentId, field, value) => {
    const key = `${selectedClass}-${selectedExam}`;
    const updated = currentResults.map(student => {
      if (student.id === studentId) {
        const newResult = { ...student.result, [field]: value };
        if (field === 'marks') {
          newResult.percentage = Math.round((value / newResult.maxMarks) * 100);
          newResult.grade = calculateGrade(newResult.percentage);
        }
        return { ...student, result: newResult };
      }
      return student;
    });
    setResultsData(prev => ({ ...prev, [key]: updated }));
  };

  // Calculate grade based on percentage
  const calculateGrade = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 85) return 'A';
    if (percentage >= 80) return 'A-';
    if (percentage >= 75) return 'B+';
    if (percentage >= 70) return 'B';
    if (percentage >= 65) return 'B-';
    if (percentage >= 60) return 'C+';
    if (percentage >= 55) return 'C';
    if (percentage >= 50) return 'C-';
    if (percentage >= 40) return 'D';
    return 'F';
  };

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Calculate statistics
  const stats = {
    total: currentResults.length,
    average: currentResults.length > 0 
      ? Math.round(currentResults.reduce((acc, s) => acc + s.result.percentage, 0) / currentResults.length)
      : 0,
    highest: currentResults.length > 0 
      ? Math.max(...currentResults.map(s => s.result.marks))
      : 0,
    lowest: currentResults.length > 0 
      ? Math.min(...currentResults.map(s => s.result.marks))
      : 0,
    passCount: currentResults.filter(s => s.result.percentage >= 40).length,
    failCount: currentResults.filter(s => s.result.percentage < 40).length
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color, trend }) => (
    <div className="rounded-xl p-6 shadow-lg border" style={{ background: 'var(--card)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-lg)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-lg" style={{ backgroundColor: `${color}20` }}>
          <Icon size={24} style={{ color }} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            trend > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
          }`}>
            {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
        {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );

  const StudentResultCard = ({ student }) => {
    const isSelected = selectedStudents.includes(student.id);
    const isEditing = editingStudent === student.id;
    
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border transition-all ${
        isSelected ? 'border-blue-500 shadow-md' : 'border-gray-200 dark:border-gray-700 hover:shadow-md'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {bulkEditMode && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedStudents(prev => [...prev, student.id]);
                  } else {
                    setSelectedStudents(prev => prev.filter(id => id !== student.id));
                  }
                }}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
            )}
            
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
              student.result.grade === 'A+' || student.result.grade === 'A' ? 'bg-green-500' :
              student.result.grade === 'A-' || student.result.grade === 'B+' || student.result.grade === 'B' ? 'bg-blue-500' :
              student.result.grade === 'B-' || student.result.grade === 'C+' || student.result.grade === 'C' ? 'bg-yellow-500' :
              student.result.grade === 'C-' || student.result.grade === 'D' ? 'bg-orange-500' : 'bg-red-500'
            }`}>
              {student.result.grade}
            </div>
            
            <div>
              <div className="font-medium text-gray-900 dark:text-white">{student.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{student.rollNo}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditingStudent(isEditing ? null : student.id)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title={isEditing ? "Cancel Edit" : "Edit Result"}
            >
              {isEditing ? <X size={16} /> : <Edit3 size={16} />}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Marks Obtained
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={student.result.marks}
                  onChange={(e) => updateResult(student.id, 'marks', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  max={student.result.maxMarks}
                  min={0}
                />
              ) : (
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {student.result.marks}/{student.result.maxMarks}
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Percentage
              </label>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {student.result.percentage}%
              </div>
            </div>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                student.result.percentage >= 80 ? 'bg-green-500' :
                student.result.percentage >= 60 ? 'bg-blue-500' :
                student.result.percentage >= 40 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(student.result.percentage, 100)}%` }}
            />
          </div>

          {student.result.aiProcessed && (
            <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400">
              <Zap size={12} />
              AI Processed {student.result.confidence && `(${Math.round(student.result.confidence * 100)}% confidence)`}
            </div>
          )}
        </div>

        {isEditing && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setEditingStudent(null)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            >
              <Save size={14} />
              Save
            </button>
          </div>
        )}
      </div>
    );
  };

  const StudentResultRow = ({ student }) => {
    const isSelected = selectedStudents.includes(student.id);
    const isEditing = editingStudent === student.id;
    
    return (
      <tr className={`${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700'} transition-colors`}>
        <td className="px-6 py-4">
          {bulkEditMode && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedStudents(prev => [...prev, student.id]);
                } else {
                  setSelectedStudents(prev => prev.filter(id => id !== student.id));
                }
              }}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
          )}
        </td>
        
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
              student.result.grade === 'A+' || student.result.grade === 'A' ? 'bg-green-500' :
              student.result.grade === 'A-' || student.result.grade === 'B+' || student.result.grade === 'B' ? 'bg-blue-500' :
              student.result.grade === 'B-' || student.result.grade === 'C+' || student.result.grade === 'C' ? 'bg-yellow-500' :
              student.result.grade === 'C-' || student.result.grade === 'D' ? 'bg-orange-500' : 'bg-red-500'
            }`}>
              {student.result.grade}
            </div>
            
            <div>
              <div className="font-medium text-gray-900 dark:text-white">{student.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{student.rollNo}</div>
            </div>
          </div>
        </td>
        
        <td className="px-6 py-4">
          {isEditing ? (
            <input
              type="number"
              value={student.result.marks}
              onChange={(e) => updateResult(student.id, 'marks', parseInt(e.target.value) || 0)}
              className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              max={student.result.maxMarks}
              min={0}
            />
          ) : (
            <span className="font-medium text-gray-900 dark:text-white">
              {student.result.marks}/{student.result.maxMarks}
            </span>
          )}
        </td>
        
        <td className="px-6 py-4">
          <span className="font-medium text-gray-900 dark:text-white">
            {student.result.percentage}%
          </span>
        </td>
        
        <td className="px-6 py-4">
          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
            student.result.grade === 'A+' || student.result.grade === 'A' ? 'bg-green-100 text-green-800' :
            student.result.grade === 'A-' || student.result.grade === 'B+' || student.result.grade === 'B' ? 'bg-blue-100 text-blue-800' :
            student.result.grade === 'B-' || student.result.grade === 'C+' || student.result.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
            student.result.grade === 'C-' || student.result.grade === 'D' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
          }`}>
            {student.result.grade}
          </span>
        </td>
        
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditingStudent(isEditing ? null : student.id)}
              className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title={isEditing ? "Save" : "Edit"}
            >
              {isEditing ? <Save size={14} /> : <Edit3 size={14} />}
            </button>
            
            {student.result.aiProcessed && (
              <Zap size={14} className="text-purple-500" title="AI Processed" />
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="min-h-screen p-6" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              Results Management
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Modern grade management with AI-powered result processing
            </p>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>

            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              {examTypes.map(exam => (
                <option key={exam.id} value={exam.id}>{exam.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Students"
            value={stats.total}
            subtitle="Enrolled"
            color="#6b7280"
          />
          <StatCard
            icon={Calculator}
            title="Class Average"
            value={`${stats.average}%`}
            subtitle="Overall performance"
            color="#3b82f6"
            trend={2}
          />
          <StatCard
            icon={Trophy}
            title="Pass Rate"
            value={`${Math.round((stats.passCount/stats.total)*100)}%`}
            subtitle={`${stats.passCount}/${stats.total} passed`}
            color="#10b981"
            trend={5}
          />
          <StatCard
            icon={TrendingUp}
            title="Highest Score"
            value={stats.highest}
            subtitle="Best performance"
            color="#f59e0b"
          />
        </div>

        {/* Action Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Grid View"
                >
                  <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Table View"
                >
                  <FileText size={16} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setBulkEditMode(!bulkEditMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  bulkEditMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Edit3 size={16} />
                {bulkEditMode ? 'Exit Bulk Edit' : 'Bulk Edit'}
              </button>

              <button
                onClick={() => setShowAIModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg"
              >
                <Zap size={18} />
                AI Result Reader
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <Download size={18} />
                Export
              </button>

              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <BarChart3 size={18} />
                Analytics
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Panel */}
        {showAnalytics && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BarChart3 size={20} />
              Grade Distribution
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {Object.entries(gradeDistribution).map(([grade, count]) => (
                <div key={grade} className="text-center">
                  <div className={`text-2xl font-bold mb-1 ${
                    grade === 'A+' || grade === 'A' ? 'text-green-600' :
                    grade === 'A-' || grade === 'B+' || grade === 'B' ? 'text-blue-600' :
                    grade === 'B-' || grade === 'C+' || grade === 'C' ? 'text-yellow-600' :
                    grade === 'C-' || grade === 'D' ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {count}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Grade {grade}</div>
                  <div className="text-xs text-gray-500">
                    {Math.round((count / stats.total) * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map(student => (
              <StudentResultCard key={student.id} student={student} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText size={20} />
                Results Table ({filteredStudents.length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {bulkEditMode && 'Select'}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-2">
                        Student
                        <ArrowUpDown size={12} />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => handleSort('marks')}
                    >
                      <div className="flex items-center gap-2">
                        Marks
                        <ArrowUpDown size={12} />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => handleSort('percentage')}
                    >
                      <div className="flex items-center gap-2">
                        Percentage
                        <ArrowUpDown size={12} />
                      </div>
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => handleSort('grade')}
                    >
                      <div className="flex items-center gap-2">
                        Grade
                        <ArrowUpDown size={12} />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredStudents.map(student => (
                    <StudentResultRow key={student.id} student={student} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* AI Modal */}
        {showAIModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Zap className="text-purple-500" size={20} />
                    AI Result Reader
                  </h3>
                  <button
                    onClick={() => setShowAIModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {!isProcessing && !extractedResults && (
                  <>
                    <div className="text-center">
                      <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Upload Result Sheet
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        Upload a photo or scan of your result sheet and let AI extract grades automatically
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          AI Prompt (Optional)
                        </label>
                        <textarea
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          placeholder="e.g., 'Extract marks from the table, calculate percentage based on total 50 marks' or 'Read handwritten grades and convert to letter grades'"
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          rows={3}
                        />
                      </div>

                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
                      >
                        <Upload className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                        <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          JPG, PNG, or PDF up to 10MB
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handleFileUpload(e.target.files)}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </>
                )}

                {isProcessing && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      AI Processing Results...
                    </h4>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${processingProgress}%` }}
                      />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{processingProgress}% Complete</p>
                  </div>
                )}

                {extractedResults && !isProcessing && (
                  <div className="space-y-6">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="text-green-500" size={20} />
                        <h4 className="font-medium text-green-800 dark:text-green-200">
                          AI Processing Complete!
                        </h4>
                      </div>
                      <p className="text-green-700 dark:text-green-300 text-sm">
                        Extracted results for {extractedResults.totalStudents} students with 94% confidence
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{extractedResults.averageScore}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Average Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{extractedResults.highestScore}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Highest</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{extractedResults.lowestScore}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Lowest</div>
                      </div>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {extractedResults.students.map(student => (
                        <div key={student.rollNo} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <span className="text-sm font-medium">{student.name} ({student.rollNo})</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">{student.marks}/{student.maxMarks}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              student.grade === 'A+' || student.grade === 'A' ? 'bg-green-100 text-green-800' :
                              student.grade === 'B+' || student.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                              student.grade === 'C+' || student.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {student.grade}
                            </span>
                            <span className="text-xs text-gray-500">
                              {Math.round(student.confidence * 100)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={applyAIResults}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <CheckCircle size={16} />
                        Apply Results
                      </button>
                      <button
                        onClick={() => setExtractedResults(null)}
                        className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        <RefreshCw size={16} />
                        Try Again
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyResults;