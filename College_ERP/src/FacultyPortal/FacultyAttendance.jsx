import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar,
  Users,
  UserCheck,
  UserX,
  Clock,
  Camera,
  Upload,
  Download,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  FileText,
  Zap,
  Eye,
  Edit3,
  Save,
  X,
  Plus,
  Settings,
  RefreshCw,
  Target,
  Award,
  BookOpen,
  Send,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import aiPaperReaderService from '../services/aiPaperReaderService';

const FacultyAttendance = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedClass, setSelectedClass] = useState('CS301-A');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);

  const fileInputRef = useRef(null);

  // Mock class data
  const classes = [
    { id: 'CS301-A', name: 'Machine Learning - Section A', students: 45, subject: 'CS301' },
    { id: 'CS401-B', name: 'Data Science - Section B', students: 38, subject: 'CS401' },
    { id: 'CS501-C', name: 'Advanced AI - Section C', students: 32, subject: 'CS501' }
  ];

  // Mock students data
  const mockStudents = [
    { id: 'CSE001', rollNo: 'CSE001', name: 'Aarav Sharma', email: 'aarav@jecrc.edu', attendance: 92 },
    { id: 'CSE002', rollNo: 'CSE002', name: 'Priya Patel', email: 'priya@jecrc.edu', attendance: 88 },
    { id: 'CSE003', rollNo: 'CSE003', name: 'Rohit Kumar', email: 'rohit@jecrc.edu', attendance: 95 },
    { id: 'CSE004', rollNo: 'CSE004', name: 'Sneha Gupta', email: 'sneha@jecrc.edu', attendance: 78 },
    { id: 'CSE005', rollNo: 'CSE005', name: 'Arjun Singh', email: 'arjun@jecrc.edu', attendance: 85 },
    { id: 'CSE006', rollNo: 'CSE006', name: 'Ananya Das', email: 'ananya@jecrc.edu', attendance: 91 },
    { id: 'CSE007', rollNo: 'CSE007', name: 'Vikram Thakur', email: 'vikram@jecrc.edu', attendance: 82 },
    { id: 'CSE008', rollNo: 'CSE008', name: 'Kavya Mehta', email: 'kavya@jecrc.edu', attendance: 89 },
    { id: 'CSE009', rollNo: 'CSE009', name: 'Ravi Agarwal', email: 'ravi@jecrc.edu', attendance: 86 },
    { id: 'CSE010', rollNo: 'CSE010', name: 'Pooja Jain', email: 'pooja@jecrc.edu', attendance: 93 }
  ];

  // Initialize attendance data
  useEffect(() => {
    const key = `${selectedClass}-${selectedDate}`;
    if (!attendanceData[key]) {
      const initialData = mockStudents.map(student => ({
        ...student,
        status: 'present',
        timestamp: null,
        notes: ''
      }));
      setAttendanceData(prev => ({ ...prev, [key]: initialData }));
    }
  }, [selectedClass, selectedDate]);

  const currentAttendance = attendanceData[`${selectedClass}-${selectedDate}`] || [];
  const filteredStudents = currentAttendance.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      const result = await aiPaperReaderService.processAttendanceSheet(
        files[0], 
        selectedClass, 
        selectedDate, 
        aiPrompt
      );

      if (result.success) {
        setExtractedData(result.extractedData);
        console.log('🤖 AI Processing complete:', result);
      }
    } catch (error) {
      console.error('AI processing failed:', error);
    } finally {
      setIsProcessing(false);
      clearInterval(progressInterval);
    }
  };

  // Apply AI extracted data to attendance
  const applyAIData = () => {
    if (!extractedData) return;

    const key = `${selectedClass}-${selectedDate}`;
    const updatedAttendance = currentAttendance.map(student => {
      const extracted = extractedData.students.find(s => s.rollNo === student.rollNo);
      if (extracted) {
        return {
          ...student,
          status: extracted.status,
          confidence: extracted.confidence,
          timestamp: new Date().toISOString(),
          notes: `AI detected (${Math.round(extracted.confidence * 100)}% confidence)`
        };
      }
      return student;
    });

    setAttendanceData(prev => ({ ...prev, [key]: updatedAttendance }));
    setExtractedData(null);
    setShowAIModal(false);
  };

  // Handle individual attendance change
  const updateAttendance = (studentId, status) => {
    const key = `${selectedClass}-${selectedDate}`;
    const updated = currentAttendance.map(student =>
      student.id === studentId
        ? { ...student, status, timestamp: new Date().toISOString() }
        : student
    );
    setAttendanceData(prev => ({ ...prev, [key]: updated }));
  };

  // Handle bulk actions
  const applyBulkAction = () => {
    if (!bulkAction || selectedStudents.length === 0) return;

    const key = `${selectedClass}-${selectedDate}`;
    const updated = currentAttendance.map(student =>
      selectedStudents.includes(student.id)
        ? { ...student, status: bulkAction, timestamp: new Date().toISOString() }
        : student
    );
    setAttendanceData(prev => ({ ...prev, [key]: updated }));
    setSelectedStudents([]);
    setBulkAction('');
  };

  // Calculate statistics
  const stats = {
    total: currentAttendance.length,
    present: currentAttendance.filter(s => s.status === 'present').length,
    absent: currentAttendance.filter(s => s.status === 'absent').length,
    late: currentAttendance.filter(s => s.status === 'late').length,
    presentPercentage: currentAttendance.length > 0 
      ? Math.round((currentAttendance.filter(s => s.status === 'present').length / currentAttendance.length) * 100)
      : 0
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
        <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{value}</div>
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{title}</p>
        {subtitle && <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{subtitle}</p>}
      </div>
    </div>
  );

  const StudentRow = ({ student }) => {
    const isSelected = selectedStudents.includes(student.id);
    
    return (
      <div className="rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
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
            
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                student.status === 'present' ? 'bg-green-500' :
                student.status === 'absent' ? 'bg-red-500' :
                student.status === 'late' ? 'bg-yellow-500' : 'bg-gray-500'
              }`}>
                {student.name.charAt(0).toUpperCase()}
              </div>
              
              <div>
                <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{student.name}</div>
                <div className="text-sm" style={{ color: 'var(--muted)' }}>{student.rollNo}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                student.status === 'present' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                student.status === 'absent' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                student.status === 'late' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
              }`}>
                {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
              </div>
              {student.confidence && (
                <div className="text-xs text-gray-500 mt-1">
                  Confidence: {Math.round(student.confidence * 100)}%
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => updateAttendance(student.id, 'present')}
                className={`p-2 rounded-lg transition-colors ${
                  student.status === 'present' 
                    ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' 
                    : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600 dark:bg-gray-700 dark:text-gray-500'
                }`}
                title="Mark Present"
              >
                <UserCheck size={16} />
              </button>
              <button
                onClick={() => updateAttendance(student.id, 'absent')}
                className={`p-2 rounded-lg transition-colors ${
                  student.status === 'absent' 
                    ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300' 
                    : 'bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600 dark:bg-gray-700 dark:text-gray-500'
                }`}
                title="Mark Absent"
              >
                <UserX size={16} />
              </button>
              <button
                onClick={() => updateAttendance(student.id, 'late')}
                className={`p-2 rounded-lg transition-colors ${
                  student.status === 'late' 
                    ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300' 
                    : 'bg-gray-100 text-gray-400 hover:bg-yellow-100 hover:text-yellow-600 dark:bg-gray-700 dark:text-gray-500'
                }`}
                title="Mark Late"
              >
                <Clock size={16} />
              </button>
            </div>
          </div>
        </div>

        {student.notes && (
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-2 rounded">
            {student.notes}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6" style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              Attendance Management
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Modern attendance tracking with AI-powered paper reading
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

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Students"
            value={stats.total}
            subtitle="Enrolled"
            color="#6b7280"
          />
          <StatCard
            icon={UserCheck}
            title="Present"
            value={stats.present}
            subtitle={`${stats.presentPercentage}% attendance`}
            color="#10b981"
            trend={5}
          />
          <StatCard
            icon={UserX}
            title="Absent"
            value={stats.absent}
            subtitle={`${Math.round((stats.absent/stats.total)*100)}% absent`}
            color="#ef4444"
            trend={-2}
          />
          <StatCard
            icon={Clock}
            title="Late"
            value={stats.late}
            subtitle="Arrived late"
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

              {selectedStudents.length > 0 && (
                <div className="flex items-center gap-2">
                  <select
                    value={bulkAction}
                    onChange={(e) => setBulkAction(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Bulk Action</option>
                    <option value="present">Mark Present</option>
                    <option value="absent">Mark Absent</option>
                    <option value="late">Mark Late</option>
                  </select>
                  <button
                    onClick={applyBulkAction}
                    disabled={!bulkAction}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Apply ({selectedStudents.length})
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* AI Paper Reader Button */}
              <button
                onClick={() => setShowAIModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg"
              >
                <Zap size={18} />
                AI Paper Reader
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
              Attendance Analytics
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Top Performers</h4>
                <div className="space-y-2">
                  {mockStudents
                    .sort((a, b) => b.attendance - a.attendance)
                    .slice(0, 3)
                    .map((student, index) => (
                      <div key={student.id} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          #{index + 1} {student.name}
                        </span>
                        <span className="text-sm font-medium text-green-600">{student.attendance}%</span>
                      </div>
                    ))}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Needs Attention</h4>
                <div className="space-y-2">
                  {mockStudents
                    .filter(s => s.attendance < 85)
                    .slice(0, 3)
                    .map((student) => (
                      <div key={student.id} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">{student.name}</span>
                        <span className="text-sm font-medium text-red-600">{student.attendance}%</span>
                      </div>
                    ))}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Class Average</h4>
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {Math.round(mockStudents.reduce((acc, s) => acc + s.attendance, 0) / mockStudents.length)}%
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Overall attendance rate</p>
              </div>
            </div>
          </div>
        )}

        {/* Student List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Users size={20} />
              Students ({filteredStudents.length})
            </h2>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {filteredStudents.map(student => (
                <StudentRow key={student.id} student={student} />
              ))}
            </div>
          </div>
        </div>

        {/* AI Modal */}
        {showAIModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Zap className="text-purple-500" size={20} />
                    AI Paper Reader
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
                {!isProcessing && !extractedData && (
                  <>
                    <div className="text-center">
                      <Camera className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Upload Attendance Sheet
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        Upload a photo of your paper attendance sheet and let AI read it automatically
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
                          placeholder="e.g., 'Mark students with checkmarks as present, others as absent' or 'Students with timestamps before 9:00 AM are present'"
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
                      AI Processing...
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

                {extractedData && !isProcessing && (
                  <div className="space-y-6">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="text-green-500" size={20} />
                        <h4 className="font-medium text-green-800 dark:text-green-200">
                          AI Processing Complete!
                        </h4>
                      </div>
                      <p className="text-green-700 dark:text-green-300 text-sm">
                        Detected {extractedData.totalStudents} students with 92% confidence
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{extractedData.present}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Present</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{extractedData.absent}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Absent</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">{extractedData.late}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Late</div>
                      </div>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {extractedData.students.map(student => (
                        <div key={student.rollNo} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <span className="text-sm font-medium">{student.name} ({student.rollNo})</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              student.status === 'present' ? 'bg-green-100 text-green-800' :
                              student.status === 'absent' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {student.status}
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
                        onClick={applyAIData}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <CheckCircle size={16} />
                        Apply to Attendance
                      </button>
                      <button
                        onClick={() => setExtractedData(null)}
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

export default FacultyAttendance;