import React, { useState } from "react";
import {
  ChevronLeft, ChevronRight, Upload, Edit, Download, Plus, Search, Calendar, AlertTriangle, 
  BarChart2, PieChart, FileText, Users, Bot, TrendingUp, Mic, Scan, Brain, Sparkles, 
  Target, Award, Clock, UserCheck, UserX, Briefcase, GraduationCap, Star, 
  BookOpen, Activity, Zap, Filter, Settings, Bell, Eye, Shield
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, RadialBarChart, RadialBar
} from 'recharts';

// JECRC University branding colors - For reference in future extensions
// const jecrcColors = {
//   primary: "#1E3A8A", // Blue
//   secondary: "#10B981", // Green
//   accent: "#F59E0B", // Yellow
//   danger: "#EF4444", // Red
//   neutral: "#6B7280", // Gray
// };

// JECRC Schools and Branches
const jecrcSchools = ["School of Engineering & Technology", "School of Computer Applications", "School of Business", "School of Design", "School of Humanities & Social Sciences", "School of Allied Health Sciences", "School of Law", "School of Sciences"];
const jecrcBranches = {
  "School of Engineering & Technology": ["Computer Science", "Mechanical", "Civil", "Electronics", "Electrical"],
  "School of Computer Applications": ["BCA", "MCA"],
  "School of Business": ["BBA", "MBA"],
  "School of Design": ["B.Des", "M.Des"],
  "School of Humanities & Social Sciences": ["BA", "MA"],
  "School of Allied Health Sciences": ["B.Sc Nursing", "BPT"],
  "School of Law": ["LLB", "LLM"],
  "School of Sciences": ["Physics", "Chemistry", "Mathematics"],
};

// Enhanced Faculty Database with AI Performance Insights
const initialFaculties = [
  { 
    id: "f1", 
    school: "School of Engineering & Technology", 
    branch: "Computer Science", 
    name: "Dr. Emily Carter", 
    facultyId: "FAC-001", 
    designation: "Professor", 
    email: "emily@jecrc.ac.in", 
    phone: "111-222-3331",
    experience: 12,
    qualifications: ["Ph.D. Computer Science", "M.Tech CSE"],
    specialization: ["Machine Learning", "Data Structures"],
    aiMetrics: {
      performanceScore: 94,
      studentRating: 4.8,
      researchOutput: 15,
      teachingLoad: 18,
      innovationIndex: 92,
      collaborationScore: 88
    },
    aiInsights: {
      performanceLevel: 'excellent',
      workloadStatus: 'optimal',
      burnoutRisk: 'low',
      promotionEligibility: 'ready',
      strengths: ['Research Excellence', 'Student Engagement', 'Innovation'],
      improvements: ['Work-Life Balance', 'Administrative Tasks']
    },
    recentActivity: [
      { type: 'research', title: 'Published AI Research Paper', date: '2024-01-10' },
      { type: 'teaching', title: 'Introduced New ML Course', date: '2024-01-08' },
      { type: 'award', title: 'Best Faculty Award 2024', date: '2024-01-05' }
    ]
  },
  { 
    id: "f2", 
    school: "School of Engineering & Technology", 
    branch: "Mechanical", 
    name: "Dr. Benjamin Lee", 
    facultyId: "FAC-002", 
    designation: "Associate Professor", 
    email: "benjamin@jecrc.ac.in", 
    phone: "111-222-3332",
    experience: 8,
    qualifications: ["Ph.D. Mechanical Engineering", "M.Tech Thermal"],
    specialization: ["Thermal Engineering", "Fluid Mechanics"],
    aiMetrics: {
      performanceScore: 87,
      studentRating: 4.5,
      researchOutput: 12,
      teachingLoad: 20,
      innovationIndex: 78,
      collaborationScore: 85
    },
    aiInsights: {
      performanceLevel: 'very good',
      workloadStatus: 'high',
      burnoutRisk: 'medium',
      promotionEligibility: 'under review',
      strengths: ['Teaching Excellence', 'Student Mentoring', 'Industry Connections'],
      improvements: ['Research Output', 'Digital Teaching Methods']
    },
    recentActivity: [
      { type: 'teaching', title: 'Conducted Industry Workshop', date: '2024-01-12' },
      { type: 'collaboration', title: 'Joint Project with Industry', date: '2024-01-07' }
    ]
  },
  { id: "f3", school: "School of Sciences", branch: "Physics", name: "Dr. Olivia Chen", facultyId: "FAC-003", designation: "Assistant Professor", email: "olivia@jecrc.ac.in", phone: "111-222-3333", experience: 5, aiMetrics: { performanceScore: 82, studentRating: 4.3, researchOutput: 8, teachingLoad: 16, innovationIndex: 75, collaborationScore: 80 }, aiInsights: { performanceLevel: 'good', workloadStatus: 'optimal', burnoutRisk: 'low', promotionEligibility: 'potential', strengths: ['Research Focus', 'Student Support'], improvements: ['Leadership Skills', 'Collaboration'] } },
  { id: "f4", school: "School of Law", branch: "LLB", name: "Dr. James Smith", facultyId: "FAC-004", designation: "Professor", email: "james@jecrc.ac.in", phone: "111-222-3334", experience: 15, aiMetrics: { performanceScore: 90, studentRating: 4.7, researchOutput: 20, teachingLoad: 14, innovationIndex: 85, collaborationScore: 88 }, aiInsights: { performanceLevel: 'excellent', workloadStatus: 'optimal', burnoutRisk: 'low', promotionEligibility: 'ready', strengths: ['Legal Expertise', 'Mentoring', 'Publications'], improvements: ['Technology Integration'] } },
  { id: "f5", school: "School of Business", branch: "BBA", name: "Dr. Sophia Brown", facultyId: "FAC-005", designation: "Associate Professor", email: "sophia@jecrc.ac.in", phone: "111-222-3335", experience: 9, aiMetrics: { performanceScore: 85, studentRating: 4.4, researchOutput: 11, teachingLoad: 18, innovationIndex: 82, collaborationScore: 86 }, aiInsights: { performanceLevel: 'very good', workloadStatus: 'optimal', burnoutRisk: 'low', promotionEligibility: 'under review', strengths: ['Business Acumen', 'Case Studies'], improvements: ['Digital Marketing', 'Data Analytics'] } }
];

// These data sets will be used in future tabs for faculty attendance and salary management
// const initialAttendance = initialFaculties.map((f) => ({
//   id: f.id,
//   name: f.name,
//   attendanceRecords: Array.from({ length: 12 }, (_, month) => ({
//     month: new Date(2025, month, 1).toLocaleString('default', { month: 'short' }),
//     present: Math.floor(Math.random() * 25) + 5, // Random present days
//     leaves: Math.floor(Math.random() * 5), // Random leaves
//   })),
// }));
// 
// const initialSalaries = initialFaculties.map((f) => ({
//   id: f.id,
//   name: f.name,
//   baseSalary: 80000 + Math.floor(Math.random() * 20000), // Random base salary
//   salaryRecords: Array.from({ length: 12 }, (_, month) => ({
//     month: new Date(2025, month, 1).toLocaleString('default', { month: 'short' }),
//     gross: 80000 + Math.floor(Math.random() * 20000),
//     deductions: Math.floor(Math.random() * 5000),
//     net: 0, // To be calculated
//     status: Math.random() > 0.5 ? "Paid" : "Pending",
//   })),
// }));

export default function Faculty() {
  // Tab state for future multi-tab implementation
  // const [activeTab, setActiveTab] = useState("list");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [faculties] = useState(initialFaculties);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const rowsPerPage = 6;

  // Filters based on school and branch
  const filterData = (data) => {
    return data.filter((item) => 
      (selectedSchool ? item.school === selectedSchool : true) &&
      (selectedBranch ? item.branch === selectedBranch : true) &&
      (searchTerm ? Object.values(item).some((val) => val.toString().toLowerCase().includes(searchTerm.toLowerCase())) : true)
    );
  };

  const filteredFaculties = filterData(faculties);
  const pagedFaculties = filteredFaculties.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const maxPage = Math.ceil(filteredFaculties.length / rowsPerPage);

  const handleViewFacultyProfile = (faculty) => {
    setSelectedFaculty(faculty);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedFaculty(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="p-6">
        {/* Enhanced Header with AI Faculty Assistant */}
        <div className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-lg mb-6 border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
                Faculty Management
              </h1>
              <p className="text-gray-600 mt-1">Advanced analytics and intelligent insights for faculty excellence</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-lg">
                <Brain className="h-5 w-5 text-green-600" />
                <span className="text-green-800 font-medium">AI Assistant Active</span>
              </div>
              <button className="p-2 bg-red-100 rounded-lg hover:bg-red-200 transition-colors">
                <Bell className="h-5 w-5 text-blue-600" />
              </button>
            </div>
          </div>
          
          {/* Enhanced Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Try 'high performers' or 'promotion ready'..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all"
              />
              <Sparkles className="h-5 w-5 text-purple-500 absolute right-4 top-1/2 transform -translate-y-1/2" />
            </div>
            
            <select
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
              value={selectedSchool}
              onChange={(e) => {
                setSelectedSchool(e.target.value);
                setSelectedBranch("");
              }}
            >
              <option value="">All Schools</option>
              {jecrcSchools.map((school) => (
                <option key={school} value={school}>{school.replace('School of ', '')}</option>
              ))}
            </select>
            
            <select
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              disabled={!selectedSchool}
            >
              <option value="">All Departments</option>
              {(jecrcBranches[selectedSchool] || []).map((branch) => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>
        </div>

        {/* AI-Powered Faculty Analytics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
            <div className="flex items-center gap-3 mb-3">
              <Users className="h-8 w-8" />
              <div>
                <div className="text-2xl font-bold">{filteredFaculties.length}</div>
                <div className="text-xs opacity-90">Total Faculty</div>
              </div>
            </div>
            <div className="text-xs opacity-75">Active across all departments</div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
            <div className="flex items-center gap-3 mb-3">
              <Star className="h-8 w-8" />
              <div>
                <div className="text-2xl font-bold">{filteredFaculties.filter(f => f.aiMetrics?.performanceScore > 90).length}</div>
                <div className="text-xs opacity-90">Top Performers</div>
              </div>
            </div>
            <div className="text-xs opacity-75">AI Score above 90</div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="h-8 w-8" />
              <div>
                <div className="text-2xl font-bold">{filteredFaculties.filter(f => f.aiInsights?.promotionEligibility === 'ready').length}</div>
                <div className="text-xs opacity-90">Promotion Ready</div>
              </div>
            </div>
            <div className="text-xs opacity-75">AI recommendation</div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="h-8 w-8" />
              <div>
                <div className="text-2xl font-bold">{filteredFaculties.filter(f => f.aiInsights?.burnoutRisk === 'high').length}</div>
                <div className="text-xs opacity-90">Burnout Risk</div>
              </div>
            </div>
            <div className="text-xs opacity-75">Needs attention</div>
          </div>
        </div>

        {/* AI-Enhanced Faculty List */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Users className="h-6 w-6" />
              Faculty Directory
            </h3>
            <div className="flex items-center gap-3">
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Faculty
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
          
          {/* Faculty Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pagedFaculties.map((faculty) => (
              <div key={faculty.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {faculty.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{faculty.name}</h4>
                      <p className="text-sm text-gray-600">{faculty.designation}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    faculty.aiInsights?.performanceLevel === 'excellent' ? 'bg-green-100 text-green-800' :
                    faculty.aiInsights?.performanceLevel === 'very good' ? 'bg-red-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {faculty.aiInsights?.performanceLevel || 'Standard'}
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Department:</span>
                    <span className="font-medium">{faculty.branch}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Faculty ID:</span>
                    <span className="font-medium">{faculty.facultyId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Experience:</span>
                    <span className="font-medium">{faculty.experience || 5}+ years</span>
                  </div>
                </div>
                
                {faculty.aiMetrics && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">AI Performance Score</span>
                      <span className="text-lg font-bold text-blue-600">{faculty.aiMetrics.performanceScore}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${faculty.aiMetrics.performanceScore}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Student Rating:</span>
                        <span className="font-medium flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          {faculty.aiMetrics.studentRating}/5
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Research:</span>
                        <span className="font-medium">{faculty.aiMetrics.researchOutput} papers</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {faculty.aiInsights && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {faculty.aiInsights.strengths?.slice(0, 2).map((strength, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                          {strength}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs">
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        faculty.aiInsights.burnoutRisk === 'low' ? 'bg-green-100 text-green-800' :
                        faculty.aiInsights.burnoutRisk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {faculty.aiInsights.burnoutRisk?.toUpperCase() || 'LOW'} RISK
                      </div>
                      
                      {faculty.aiInsights.promotionEligibility === 'ready' && (
                        <div className="px-2 py-1 bg-red-100 text-purple-800 text-xs rounded font-medium">
                          PROMOTION READY
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleViewFacultyProfile(faculty)}
                    className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 flex items-center justify-center gap-1 text-sm"
                  >
                    <Eye className="h-4 w-4" />
                    View Profile
                  </button>
                  <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300">
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing {((page - 1) * rowsPerPage) + 1} to {Math.min(page * rowsPerPage, filteredFaculties.length)} of {filteredFaculties.length} faculty members
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-3 py-1 bg-red-100 text-blue-800 rounded-lg font-medium">
                {page} / {maxPage}
              </span>
              <button
                onClick={() => setPage(Math.min(maxPage, page + 1))}
                disabled={page === maxPage}
                className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Enhanced Faculty Profile Modal */}
        {modalOpen && selectedFaculty && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedFaculty.name}</h2>
                  <p className="text-gray-600">{selectedFaculty.designation} | {selectedFaculty.facultyId}</p>
                </div>
                <button 
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{selectedFaculty.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">{selectedFaculty.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Department:</span>
                        <span className="font-medium">{selectedFaculty.branch}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Experience:</span>
                        <span className="font-medium">{selectedFaculty.experience || 5}+ years</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* AI Performance Metrics */}
                  {selectedFaculty.aiMetrics && (
                    <div className="bg-red-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Brain className="h-5 w-5 text-blue-600" />
                        AI Performance Analysis
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Overall Score:</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-red-600 h-2 rounded-full"
                                style={{ width: `${selectedFaculty.aiMetrics.performanceScore}%` }}
                              ></div>
                            </div>
                            <span className="font-bold text-blue-600">{selectedFaculty.aiMetrics.performanceScore}/100</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Student Rating:</span>
                            <span className="font-medium">{selectedFaculty.aiMetrics.studentRating}/5</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Research Output:</span>
                            <span className="font-medium">{selectedFaculty.aiMetrics.researchOutput}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* AI Insights and Recommendations */}
                {selectedFaculty.aiInsights && (
                  <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                      AI Insights & Recommendations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-green-700 mb-2">Strengths</h4>
                        <div className="space-y-1">
                          {selectedFaculty.aiInsights.strengths?.map((strength, index) => (
                            <span key={index} className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-1">
                              {strength}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-orange-700 mb-2">Areas for Improvement</h4>
                        <div className="space-y-1">
                          {selectedFaculty.aiInsights.improvements?.map((improvement, index) => (
                            <span key={index} className="inline-block bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs mr-1">
                              {improvement}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </button>
                  <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Generate Report
                  </button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    AI Analysis
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    );
}