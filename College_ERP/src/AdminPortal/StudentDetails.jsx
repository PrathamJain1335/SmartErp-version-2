import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, Edit, Badge, User2Icon, Search, Users, BookOpen, DollarSign, GraduationCap,
  Brain, Zap, Target, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Activity,
  Bell, Star, Heart, ArrowUpRight, ArrowDownRight, MoreHorizontal, Sparkles,
  Award, Calendar, Clock, BarChart3, PieChart, LineChart, Settings, Shield,
  Eye, Download, Filter, MessageSquare, FileText, UserCheck, UserX, Cpu,
  MapPin, Phone, Mail, Home, UserPlus, Trash2, Save, RefreshCw, Send,
  Upload, XCircle, CheckCircle2, AlertCircle, Info, Lightbulb, Briefcase, User
} from 'lucide-react';
import {
  LineChart as RechartsLine,
  BarChart as RechartsBar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

// Enhanced Student Database with AI Insights
const studentDatabase = [
  {
    name: "Sophia Clark",
    enrollmentNo: "20B03001",
    rollNo: "CS001",
    status: "Active",
    dob: "March 15, 2003",
    gender: "Female",
    contact: "(555) 111-2222",
    email: "sophia.clark@jecrcu.edu.in",
    address: "123 University Ave, Jaipur, Rajasthan",
    department: "Computer Science & Engineering",
    year: "3rd Year",
    section: "A",
    cgpa: 8.45,
    attendance: 87.2,
    guardian: {
      father: { name: "Robert Clark", contact: "(555) 111-2233", occupation: "Software Engineer" },
      mother: { name: "Maria Clark", contact: "(555) 111-2244", occupation: "Doctor" },
    },
    feeStatus: { total: 175000, paid: 125000, pending: 50000 },
    academicRecord: [7.8, 8.1, 8.3, 8.2, 8.4, 8.45],
    subjects: ['Data Structures', 'Algorithms', 'DBMS', 'Computer Networks', 'Software Engineering', 'Machine Learning'],
    aiInsights: {
      riskLevel: 'low',
      predictedGPA: 8.7,
      strengths: ['Analytical Thinking', 'Programming', 'Problem Solving'],
      improvements: ['Communication Skills', 'Team Collaboration'],
      careerMatch: ['Software Engineer', 'Data Scientist', 'AI Researcher'],
      studyPattern: 'consistent',
      engagementLevel: 'high',
      placementProbability: 92
    },
    behaviorMetrics: {
      submissionRate: 98,
      participationScore: 87,
      punctualityScore: 94,
      disciplinaryRecords: 0,
      leadershipScore: 76
    },
    smartRecommendations: [
      { type: 'course', title: 'Advanced Machine Learning', priority: 'high', reason: 'Based on performance in ML fundamentals' },
      { type: 'internship', title: 'Software Development Internship', priority: 'medium', reason: 'Strong programming skills detected' },
      { type: 'skill', title: 'Public Speaking Workshop', priority: 'low', reason: 'To enhance communication skills' }
    ]
  },
  {
    name: "Aarav Sharma",
    enrollmentNo: "20B03002",
    rollNo: "CS002",
    status: "Active",
    dob: "January 15, 2003",
    gender: "Male",
    contact: "(555) 111-3333",
    email: "aarav.sharma@jecrcu.edu.in",
    address: "456 College Road, Jaipur, Rajasthan",
    department: "Computer Science & Engineering",
    year: "3rd Year",
    section: "A",
    cgpa: 7.95,
    attendance: 82.5,
    guardian: {
      father: { name: "Rajesh Sharma", contact: "(555) 111-3344", occupation: "Business Owner" },
      mother: { name: "Sunita Sharma", contact: "(555) 111-3355", occupation: "Teacher" },
    },
    feeStatus: { total: 175000, paid: 175000, pending: 0 },
    academicRecord: [7.2, 7.5, 7.8, 7.9, 8.0, 7.95],
    subjects: ['Data Structures', 'Algorithms', 'DBMS', 'Computer Networks', 'Software Engineering', 'Machine Learning'],
    aiInsights: {
      riskLevel: 'medium',
      predictedGPA: 8.2,
      strengths: ['Persistence', 'Improvement Mindset', 'Technical Skills'],
      improvements: ['Time Management', 'Study Consistency'],
      careerMatch: ['Backend Developer', 'System Administrator', 'Technical Support'],
      studyPattern: 'improving',
      engagementLevel: 'medium',
      placementProbability: 78
    },
    behaviorMetrics: {
      submissionRate: 89,
      participationScore: 72,
      punctualityScore: 86,
      disciplinaryRecords: 1,
      leadershipScore: 58
    },
    smartRecommendations: [
      { type: 'study', title: 'Study Group Formation', priority: 'high', reason: 'Collaborative learning could boost performance' },
      { type: 'skill', title: 'Time Management Workshop', priority: 'high', reason: 'Detected inconsistent submission patterns' },
      { type: 'mentoring', title: 'Peer Mentoring Program', priority: 'medium', reason: 'Could benefit from academic guidance' }
    ]
  },
  {
    name: "Priya Patel",
    enrollmentNo: "20B04003",
    rollNo: "EC003",
    status: "Active",
    dob: "July 22, 2003",
    gender: "Female",
    contact: "(555) 222-4444",
    email: "priya.patel@jecrcu.edu.in",
    address: "789 Tech Park, Jaipur, Rajasthan",
    department: "Electronics & Communication Engineering",
    year: "3rd Year",
    section: "B",
    cgpa: 8.75,
    attendance: 91.3,
    guardian: {
      father: { name: "Amit Patel", contact: "(555) 222-4455", occupation: "Electrical Engineer" },
      mother: { name: "Kavita Patel", contact: "(555) 222-4466", occupation: "Professor" },
    },
    feeStatus: { total: 165000, paid: 165000, pending: 0 },
    academicRecord: [8.1, 8.3, 8.5, 8.6, 8.7, 8.75],
    subjects: ['Digital Electronics', 'Signal Processing', 'Communication Systems', 'Microprocessors', 'VLSI Design', 'Embedded Systems'],
    aiInsights: {
      riskLevel: 'low',
      predictedGPA: 9.0,
      strengths: ['Circuit Design', 'Mathematical Analysis', 'Innovation'],
      improvements: ['Project Management', 'Industry Exposure'],
      careerMatch: ['Hardware Engineer', 'VLSI Designer', 'Signal Processing Engineer'],
      studyPattern: 'excellent',
      engagementLevel: 'very high',
      placementProbability: 96
    },
    behaviorMetrics: {
      submissionRate: 98,
      participationScore: 92,
      punctualityScore: 96,
      disciplinaryRecords: 0,
      leadershipScore: 84
    },
    smartRecommendations: [
      { type: 'internship', title: 'VLSI Design Internship', priority: 'high', reason: 'Exceptional performance in circuit design' },
      { type: 'project', title: 'Innovation Challenge Participation', priority: 'high', reason: 'Strong innovation potential identified' },
      { type: 'mentoring', title: 'Junior Student Mentoring', priority: 'medium', reason: 'Could benefit others with knowledge sharing' }
    ]
  },
  {
    name: "Arjun Kumar",
    enrollmentNo: "20B02004",
    rollNo: "ME004",
    status: "Active",
    dob: "November 8, 2002",
    gender: "Male",
    contact: "(555) 333-5555",
    email: "arjun.kumar@jecrcu.edu.in",
    address: "321 Engineering Lane, Jaipur, Rajasthan",
    department: "Mechanical Engineering",
    year: "4th Year",
    section: "A",
    cgpa: 7.68,
    attendance: 79.8,
    guardian: {
      father: { name: "Suresh Kumar", contact: "(555) 333-5566", occupation: "Mechanical Engineer" },
      mother: { name: "Lakshmi Kumar", contact: "(555) 333-5577", occupation: "Homemaker" },
    },
    feeStatus: { total: 160000, paid: 120000, pending: 40000 },
    academicRecord: [7.0, 7.2, 7.4, 7.5, 7.6, 7.68],
    subjects: ['Thermodynamics', 'Fluid Mechanics', 'Machine Design', 'Manufacturing Processes', 'Heat Transfer', 'Automobile Engineering'],
    aiInsights: {
      riskLevel: 'high',
      predictedGPA: 7.5,
      strengths: ['Practical Application', 'Mechanical Aptitude', 'Problem Solving'],
      improvements: ['Study Habits', 'Attendance', 'Academic Focus'],
      careerMatch: ['Manufacturing Engineer', 'Maintenance Engineer', 'Technical Sales'],
      studyPattern: 'inconsistent',
      engagementLevel: 'low',
      placementProbability: 68
    },
    behaviorMetrics: {
      submissionRate: 78,
      participationScore: 65,
      punctualityScore: 72,
      disciplinaryRecords: 2,
      leadershipScore: 45
    },
    smartRecommendations: [
      { type: 'mentoring', title: 'Academic Support Program', priority: 'high', reason: 'Low attendance and inconsistent performance detected' },
      { type: 'skill', title: 'CAD Software Training', priority: 'high', reason: 'Technical skills enhancement needed for placements' },
      { type: 'counseling', title: 'Career Guidance Session', priority: 'medium', reason: 'Help identify suitable career paths' }
    ]
  },
  {
    name: "Ananya Singh",
    enrollmentNo: "20B01005",
    rollNo: "CE005",
    status: "Active",
    dob: "September 12, 2003",
    gender: "Female",
    contact: "(555) 444-6666",
    email: "ananya.singh@jecrcu.edu.in",
    address: "567 Campus View, Jaipur, Rajasthan",
    department: "Civil Engineering",
    year: "3rd Year",
    section: "A",
    cgpa: 8.12,
    attendance: 88.7,
    guardian: {
      father: { name: "Vikram Singh", contact: "(555) 444-6677", occupation: "Civil Engineer" },
      mother: { name: "Meera Singh", contact: "(555) 444-6688", occupation: "Architect" },
    },
    feeStatus: { total: 155000, paid: 110000, pending: 45000 },
    academicRecord: [7.5, 7.8, 8.0, 8.1, 8.1, 8.12],
    subjects: ['Structural Engineering', 'Geotechnical Engineering', 'Transportation Engineering', 'Environmental Engineering', 'Construction Management', 'Surveying'],
    aiInsights: {
      riskLevel: 'medium',
      predictedGPA: 8.3,
      strengths: ['Structural Analysis', 'Environmental Awareness', 'Project Planning'],
      improvements: ['Financial Management', 'Advanced Software Skills'],
      careerMatch: ['Structural Engineer', 'Environmental Consultant', 'Project Manager'],
      studyPattern: 'steady',
      engagementLevel: 'high',
      placementProbability: 85
    },
    behaviorMetrics: {
      submissionRate: 91,
      participationScore: 82,
      punctualityScore: 89,
      disciplinaryRecords: 0,
      leadershipScore: 78
    },
    smartRecommendations: [
      { type: 'internship', title: 'Construction Company Internship', priority: 'high', reason: 'Strong foundation in construction management' },
      { type: 'skill', title: 'AutoCAD & Revit Training', priority: 'high', reason: 'Industry-standard software skills needed' },
      { type: 'project', title: 'Sustainable Building Design Project', priority: 'medium', reason: 'Aligns with environmental awareness strength' }
    ]
  }
];

const initialStudent = studentDatabase[0]; // Default to first student


export default function StudentDetails() {
  const [student, setStudent] = useState(initialStudent);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredStudents, setFilteredStudents] = useState(studentDatabase);

  // Search functionality
  useEffect(() => {
    if (searchQuery) {
      const filtered = studentDatabase.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.enrollmentNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(studentDatabase);
    }
  }, [searchQuery]);

  const handleStudentSelect = (selectedStudent) => {
    setStudent(selectedStudent);
    setSearchQuery('');
    setShowDropdown(false);
  };




  const handleEditProfile = () => {
    console.log("Editing profile for", student.name);
    // Placeholder for edit logic
  };

  const handleDownloadID = () => {
    console.log("Downloading ID card for", student.name);
    // Placeholder for download logic
  };

  const handleDeactivate = () => {
    console.log("Deactivating student", student.name);
    // Placeholder for deactivate logic
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="p-6">
        {/* Enhanced Header with AI Assistant */}
        <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg mb-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                Student Management
              </h1>
              <p className="text-gray-600 mt-1">Advanced analytics and intelligent insights for student success</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-lg">
                <Brain className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-medium">AI Assistant Active</span>
              </div>
              <button className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">
                <Bell className="h-5 w-5 text-blue-600" />
              </button>
            </div>
          </div>
          
          {/* Enhanced Search with AI Suggestions */}
          <div className="relative">
            <div className="flex items-center">
              <Search className="h-5 w-5 text-gray-400 absolute left-4" />
              <input
                type="text"
                placeholder="🤖 AI Search: Try 'students at risk' or 'top performers'..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all"
              />
              <Sparkles className="h-5 w-5 text-purple-500 absolute right-4" />
            </div>
            
            {/* Enhanced Dropdown with AI Insights */}
            {showDropdown && searchQuery && filteredStudents.length > 0 && (
              <div className="absolute z-10 w-full mt-3 bg-white/90 backdrop-blur-lg border border-gray-200 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
                {filteredStudents.map((studentItem) => (
                  <div
                    key={studentItem.enrollmentNo}
                    onClick={() => handleStudentSelect(studentItem)}
                    className="p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{studentItem.name}</div>
                        <div className="text-sm text-gray-600 flex items-center gap-4">
                          <span>{studentItem.enrollmentNo}</span>
                          <span>{studentItem.department}</span>
                          <span className="flex items-center gap-1">
                            <GraduationCap className="h-4 w-4" />
                            CGPA: {studentItem.cgpa}
                          </span>
                        </div>
                        {studentItem.aiInsights && (
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              studentItem.aiInsights.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                              studentItem.aiInsights.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              🤖 {studentItem.aiInsights.riskLevel.toUpperCase()} RISK
                            </span>
                            <span className="text-xs text-gray-500">
                              Predicted GPA: {studentItem.aiInsights.predictedGPA}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium mb-1 ${
                          studentItem.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {studentItem.status}
                        </div>
                        {studentItem.aiInsights && (
                          <div className="text-xs text-gray-500">
                            📊 {studentItem.aiInsights.placementProbability}% Placement Probability
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
        
        {/* AI-Powered Quick Insights */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-xl text-white">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5" />
              <span className="font-medium">At-Risk Students</span>
            </div>
            <div className="text-2xl font-bold">3</div>
            <div className="text-xs opacity-90">Need immediate attention</div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 rounded-xl text-white">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5" />
              <span className="font-medium">Top Performers</span>
            </div>
            <div className="text-2xl font-bold">12</div>
            <div className="text-xs opacity-90">Above 8.5 CGPA</div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-xl text-white">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-5 w-5" />
              <span className="font-medium">AI Predictions</span>
            </div>
            <div className="text-2xl font-bold">87%</div>
            <div className="text-xs opacity-90">Placement accuracy</div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-xl text-white">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-5 w-5" />
              <span className="font-medium">Smart Alerts</span>
            </div>
            <div className="text-2xl font-bold">5</div>
            <div className="text-xs opacity-90">Active recommendations</div>
          </div>
        </div>

        
        {/* Student Profile Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button className="p-2 bg-white/60 backdrop-blur-sm rounded-lg hover:bg-white/80 transition-colors">
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
              <p className="text-gray-600">{student.enrollmentNo} | {student.department}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              student.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {student.status}
            </div>
          </div>
        </div>

        {/* Enhanced Student Overview with AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Student Profile Card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </h3>
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 flex items-center gap-1 text-sm"
                onClick={handleEditProfile}
              >
                <Edit className="h-4 w-4" /> Edit
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Date of Birth:</span>
                <span className="font-medium">{student.dob}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gender:</span>
                <span className="font-medium">{student.gender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Contact:</span>
                <span className="font-medium">{student.contact}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-blue-600">{student.email}</span>
              </div>
              <div className="pt-2 border-t">
                <span className="text-gray-600 text-xs">Address:</span>
                <p className="text-sm mt-1">{student.address}</p>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <h4 className="font-medium text-gray-700 mb-3">Guardian Information</h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="font-medium text-gray-800">Father</p>
                  <p className="text-gray-600">{student.guardian.father.name}</p>
                  <p className="text-gray-600">{student.guardian.father.contact}</p>
                  <p className="text-gray-600">{student.guardian.father.occupation}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Mother</p>
                  <p className="text-gray-600">{student.guardian.mother.name}</p>
                  <p className="text-gray-600">{student.guardian.mother.contact}</p>
                  <p className="text-gray-600">{student.guardian.mother.occupation}</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <button
                className="flex-1 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 flex items-center justify-center gap-1 text-sm"
                onClick={handleDownloadID}
              >
                <Badge className="h-4 w-4" /> ID Card
              </button>
              <button
                className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 flex items-center justify-center gap-1 text-sm"
                onClick={handleDeactivate}
              >
                <User2Icon className="h-4 w-4" /> Deactivate
              </button>
            </div>
          </div>

          {/* Academic Overview */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Academic Overview
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{student.cgpa}</div>
                <div className="text-xs text-blue-700">Current CGPA</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{student.attendance}%</div>
                <div className="text-xs text-green-700">Attendance</div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Academic Progress</span>
                <span className="text-sm font-medium">Semester {student.academicRecord.length}</span>
              </div>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={student.academicRecord.map((gpa, index) => ({ semester: index + 1, gpa }))}>
                    <XAxis dataKey="semester" fontSize={10} />
                    <YAxis domain={[0, 10]} fontSize={10} />
                    <Tooltip />
                    <Area type="monotone" dataKey="gpa" stroke="#3B82F6" fill="#93C5FD" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="text-sm">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Department:</span>
                <span className="font-medium">{student.department.split(' ').map(word => word[0]).join('')}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Year & Section:</span>
                <span className="font-medium">{student.year} - {student.section}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fee Status:</span>
                <span className={`font-medium ${
                  student.feeStatus?.pending > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {student.feeStatus?.pending > 0 ? `₹${student.feeStatus.pending.toLocaleString()} Due` : 'Paid'}
                </span>
              </div>
            </div>
          </div>

          {/* AI Insights Panel */}
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              AI Insights & Predictions
            </h3>
            
            {student.aiInsights && (
              <div className="space-y-4">
                {/* Risk Assessment */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Risk Level</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      student.aiInsights.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                      student.aiInsights.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {student.aiInsights.riskLevel.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Predicted GPA:</span>
                      <span className="font-bold text-blue-600 ml-1">{student.aiInsights.predictedGPA}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Placement Prob:</span>
                      <span className="font-bold text-green-600 ml-1">{student.aiInsights.placementProbability}%</span>
                    </div>
                  </div>
                </div>
                
                {/* Strengths & Improvements */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <h4 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" /> Strengths
                    </h4>
                    <div className="space-y-1">
                      {student.aiInsights.strengths.slice(0, 2).map((strength, index) => (
                        <div key={index} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                          {strength}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-orange-700 mb-2 flex items-center gap-1">
                      <Target className="h-4 w-4" /> Improvements
                    </h4>
                    <div className="space-y-1">
                      {student.aiInsights.improvements.slice(0, 2).map((improvement, index) => (
                        <div key={index} className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded">
                          {improvement}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Career Matches */}
                <div>
                  <h4 className="text-sm font-medium text-blue-700 mb-2 flex items-center gap-1">
                    <Briefcase className="h-4 w-4" /> Career Matches
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {student.aiInsights.careerMatch.slice(0, 3).map((career, index) => (
                      <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        {career}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Engagement Metrics */}
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 rounded-lg">
                  <h4 className="text-sm font-medium text-purple-700 mb-2">Engagement Metrics</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span>Study Pattern:</span>
                      <span className="font-medium capitalize">{student.aiInsights.studyPattern}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Engagement:</span>
                      <span className="font-medium capitalize">{student.aiInsights.engagementLevel}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* AI Recommendations */}
            {student.smartRecommendations && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1">
                  <Lightbulb className="h-4 w-4 text-yellow-500" /> Smart Recommendations
                </h4>
                <div className="space-y-2">
                  {student.smartRecommendations.slice(0, 2).map((rec, index) => (
                    <div key={index} className="bg-yellow-50 p-2 rounded-lg border-l-4 border-yellow-400">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-yellow-800">{rec.title}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                          rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {rec.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{rec.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Advanced Analytics Dashboard with Tabs */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 py-4">
              <button className="border-b-2 border-blue-500 text-blue-600 font-medium py-2 px-1 text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Attendance Analytics
              </button>
              <button className="text-gray-500 hover:text-gray-700 py-2 px-1 text-sm flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Academic Performance
              </button>
              <button className="text-gray-500 hover:text-gray-700 py-2 px-1 text-sm flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Financial Records
              </button>
              <button className="text-gray-500 hover:text-gray-700 py-2 px-1 text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Behavior & Discipline
              </button>
            </nav>
          </div>
          
          {/* Attendance Analytics Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Attendance Overview */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Attendance Overview</h3>
                  <select className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option>Current Semester</option>
                    <option>Last Semester</option>
                    <option>Academic Year</option>
                  </select>
                </div>
                
                <div className="h-64 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { month: 'Aug', present: 22, absent: 3, leave: 1 },
                      { month: 'Sep', present: 18, absent: 5, leave: 2 },
                      { month: 'Oct', present: 20, absent: 2, leave: 1 },
                      { month: 'Nov', present: 19, absent: 3, leave: 2 },
                      { month: 'Dec', present: 15, absent: 1, leave: 1 }
                    ]}>
                      <XAxis dataKey="month" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="present" fill="#10B981" />
                      <Bar dataKey="absent" fill="#EF4444" />
                      <Bar dataKey="leave" fill="#F59E0B" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <span className="text-2xl font-bold text-green-600">{student.attendance}%</span>
                  </div>
                  <div className="text-sm text-green-700">Overall Attendance</div>
                  <div className="text-xs text-green-600">Target: 75% minimum</div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Calendar className="h-6 w-6 text-blue-600" />
                    <span className="text-2xl font-bold text-blue-600">94</span>
                  </div>
                  <div className="text-sm text-blue-700">Days Present</div>
                  <div className="text-xs text-blue-600">This semester</div>
                </div>
                
                <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <XCircle className="h-6 w-6 text-red-600" />
                    <span className="text-2xl font-bold text-red-600">13</span>
                  </div>
                  <div className="text-sm text-red-700">Days Absent</div>
                  <div className="text-xs text-red-600">Needs improvement</div>
                </div>
                
                {student.behaviorMetrics && (
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-purple-700 mb-2">Behavior Score</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Punctuality:</span>
                        <span className="font-medium">{student.behaviorMetrics.punctualityScore}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Participation:</span>
                        <span className="font-medium">{student.behaviorMetrics.participationScore}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* AI-Powered Attendance Management */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Smart Attendance Management
              </h3>
              
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">Date</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">Subject</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">AI Score</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {[
                        { date: '2024-01-15', subject: 'Data Structures', status: 'Present', score: 95, remarks: 'Active participation' },
                        { date: '2024-01-14', subject: 'Algorithms', status: 'Present', score: 88, remarks: 'Good engagement' },
                        { date: '2024-01-13', subject: 'DBMS', status: 'Absent', score: 0, remarks: 'Medical leave' },
                        { date: '2024-01-12', subject: 'Networks', status: 'Late', score: 70, remarks: 'Arrived 10 mins late' }
                      ].map((record, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-900">{record.date}</td>
                          <td className="px-4 py-3 text-gray-700">{record.subject}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              record.status === 'Present' ? 'bg-green-100 text-green-800' :
                              record.status === 'Late' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {record.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-2 rounded-full ${
                                record.score >= 90 ? 'bg-green-400' :
                                record.score >= 70 ? 'bg-yellow-400' :
                                'bg-red-400'
                              }`}></div>
                              <span className="text-sm font-medium">{record.score}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{record.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="flex gap-3 mt-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2 text-sm">
                  <Download className="h-4 w-4" />
                  Export Report
                </button>
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2 text-sm">
                  <MessageSquare className="h-4 w-4" />
                  Send Alert to Parent
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4" />
                  AI Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* AI-Generated Action Items */}
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            AI-Generated Action Items
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <span className="font-medium text-gray-800">Immediate Attention</span>
              </div>
              <p className="text-sm text-gray-600">Student attendance has dropped below 80%. Consider intervention.</p>
              <button className="mt-2 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">Schedule Meeting</button>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="font-medium text-gray-800">Opportunity</span>
              </div>
              <p className="text-sm text-gray-600">Strong performance in core subjects. Consider advanced coursework.</p>
              <button className="mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Explore Options</button>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="font-medium text-gray-800">Collaboration</span>
              </div>
              <p className="text-sm text-gray-600">Peer mentoring could improve overall engagement and performance.</p>
              <button className="mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Connect Students</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
