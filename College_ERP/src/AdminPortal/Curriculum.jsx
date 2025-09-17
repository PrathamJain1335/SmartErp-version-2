import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Upload, Edit, Download, Plus, Search, BookOpen, Video, PlayCircle, Mic, Scan, Brain, Lightbulb, Moon, Sun } from "lucide-react";
import { Bar, Line } from "react-chartjs-2";
import zoomPlugin from 'chartjs-plugin-zoom';
import { BarChart } from "lucide-react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,

} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, zoomPlugin, Filler);

// JECRC University branding colors
const jecrcColors = {
  primary: "#1E3A8A",
  secondary: "#10B981",
  accent: "#F59E0B",
  danger: "#EF4444",
};

// Dummy curriculum data
const initialCourses = [
  { id: "c1", code: "CS101", title: "Introduction to Programming", credits: 4, school: "School of Engineering & Technology", branch: "Computer Science", semester: 1 },
  { id: "c2", code: "ME201", title: "Thermodynamics", credits: 4, school: "School of Engineering & Technology", branch: "Mechanical", semester: 2 },
  { id: "c3", code: "PH301", title: "Quantum Physics", credits: 3, school: "School of Sciences", branch: "Physics", semester: 3 },
  { id: "c4", code: "LA401", title: "Constitutional Law", credits: 4, school: "School of Law", branch: "LLB", semester: 4 },
  { id: "c5", code: "BB501", title: "Principles of Management", credits: 3, school: "School of Business", branch: "BBA", semester: 5 },
  { id: "c6", code: "DS601", title: "Graphic Design Basics", credits: 4, school: "School of Design", branch: "B.Des", semester: 6 },
  { id: "c7", code: "HS701", title: "Sociology", credits: 3, school: "School of Humanities & Social Sciences", branch: "BA", semester: 7 },
  { id: "c8", code: "AH801", title: "Human Anatomy", credits: 4, school: "School of Allied Health Sciences", branch: "B.Sc Nursing", semester: 8 },
  { id: "c9", code: "CA901", title: "Data Structures", credits: 4, school: "School of Computer Applications", branch: "BCA", semester: 1 },
  { id: "c10", code: "SC1001", title: "Organic Chemistry", credits: 3, school: "School of Sciences", branch: "Chemistry", semester: 2 },
  { id: "c11", code: "CE1101", title: "Structural Analysis", credits: 4, school: "School of Engineering & Technology", branch: "Civil", semester: 3 },
  { id: "c12", code: "LA1201", title: "International Law", credits: 4, school: "School of Law", branch: "LLM", semester: 4 },
  { id: "c13", code: "EE1301", title: "Circuit Theory", credits: 4, school: "School of Engineering & Technology", branch: "Electrical", semester: 5 },
  { id: "c14", code: "BB1401", title: "Marketing Management", credits: 3, school: "School of Business", branch: "MBA", semester: 6 },
  { id: "c15", code: "DS1501", title: "UI/UX Design", credits: 4, school: "School of Design", branch: "M.Des", semester: 7 },
  { id: "c16", code: "HS1601", title: "Psychology", credits: 3, school: "School of Humanities & Social Sciences", branch: "MA", semester: 8 },
  { id: "c17", code: "AH1701", title: "Physiotherapy Basics", credits: 4, school: "School of Allied Health Sciences", branch: "BPT", semester: 1 },
  { id: "c18", code: "CA1801", title: "Algorithms", credits: 4, school: "School of Computer Applications", branch: "MCA", semester: 2 },
  { id: "c19", code: "SC1901", title: "Calculus", credits: 3, school: "School of Sciences", branch: "Mathematics", semester: 3 },
  { id: "c20", code: "CS2001", title: "Object-Oriented Programming", credits: 4, school: "School of Engineering & Technology", branch: "Computer Science", semester: 4 },
  { id: "c21", code: "ME2101", title: "Fluid Mechanics", credits: 4, school: "School of Engineering & Technology", branch: "Mechanical", semester: 5 },
  { id: "c22", code: "PH2201", title: "Classical Mechanics", credits: 3, school: "School of Sciences", branch: "Physics", semester: 6 },
  { id: "c23", code: "LA2301", title: "Criminal Law", credits: 4, school: "School of Law", branch: "LLB", semester: 7 },
  { id: "c24", code: "BB2401", title: "Financial Accounting", credits: 3, school: "School of Business", branch: "BBA", semester: 8 },
  { id: "c25", code: "DS2501", title: "Product Design", credits: 4, school: "School of Design", branch: "B.Des", semester: 1 },
  { id: "c26", code: "HS2601", title: "History", credits: 3, school: "School of Humanities & Social Sciences", branch: "BA", semester: 2 },
  { id: "c27", code: "AH2701", title: "Nursing Practices", credits: 4, school: "School of Allied Health Sciences", branch: "B.Sc Nursing", semester: 3 },
  { id: "c28", code: "CA2801", title: "Database Management", credits: 4, school: "School of Computer Applications", branch: "BCA", semester: 4 },
  { id: "c29", code: "SC2901", title: "Physical Chemistry", credits: 3, school: "School of Sciences", branch: "Chemistry", semester: 5 },
  { id: "c30", code: "CE3001", title: "Geotechnical Engineering", credits: 4, school: "School of Engineering & Technology", branch: "Civil", semester: 6 },
];

const initialSyllabus = initialCourses.map((c) => ({
  id: c.id,
  topics: Array.from({ length: 5 }, (_, i) => `Topic ${i + 1}: Core Concept ${i + 1}`),
  resources: ["Textbook", "Lecture Notes", "Video Tutorial"],
}));

const initialProgress = initialCourses.map((c) => ({
  id: c.id,
  completionRate: Math.floor(Math.random() * 100),
  lastUpdated: new Date(2025, Math.floor(Math.random() * 9), Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
}));

export default function Curriculum() {
  const [activeTab, setActiveTab] = useState("courses");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [courses, setCourses] = useState(initialCourses);
  const [syllabus] = useState(initialSyllabus);
  const [progress] = useState(initialProgress);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  
  // AI Feature States
  const [videoLessons, setVideoLessons] = useState([]);
  const [voiceNotes, setVoiceNotes] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [arVisuals, setArVisuals] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [interactiveSessions, setInteractiveSessions] = useState([]);
  const [liveFeedback, setLiveFeedback] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const rowsPerPage = 5;

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

  // Chart Data with Fallback
  const [progressTrendData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    datasets: [
      {
        label: "Average Completion Rate (%)",
        data: [20, 35, 50, 65, 75, 85, 90, 95, 98],
        borderColor: jecrcColors.primary,
        fill: true,
        backgroundColor: "rgba(30, 58, 138, 0.2)",
        tension: 0.4,
      },
    ],
  });

  const filterData = (data) => {
    return data.filter((item) => 
      (selectedSchool ? item.school === selectedSchool : true) &&
      (selectedBranch ? item.branch === selectedBranch : true) &&
      (searchTerm ? Object.values(item).some((val) => val.toString().toLowerCase().includes(searchTerm.toLowerCase())) : true)
    );
  };

  const filteredCourses = filterData(courses);
  const filteredSyllabus = filterData(syllabus);
  const filteredProgress = filterData(progress);

  const pagedCourses = filteredCourses.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pagedSyllabus = filteredSyllabus.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pagedProgress = filteredProgress.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const maxPage = Math.ceil(filteredCourses.length / rowsPerPage);

  const handleAddCourse = () => {
    setCourses((prev) => [...prev, { id: Date.now().toString(), code: `CS${Date.now().toString().slice(-3)}`, title: "New Course", credits: 3, school: selectedSchool, branch: selectedBranch, semester: 1 }]);
  };

  const handleUpdateSyllabus = (courseId, topic) => {
    console.log("Updating syllabus for course:", courseId, topic);
  };

  const handleViewCourseDetails = (course) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCourse(null);
  };

  const handleExport = () => {
    console.log("Exporting curriculum data to PDF with JECRC branding...");
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark-root", isDarkTheme);
    initializeAIFeatures();
  }, [isDarkTheme]);
  
  // Initialize AI Features with demo data
  const initializeAIFeatures = () => {
    // Video Lessons Demo Data
    setVideoLessons([
      { id: 1, courseId: 'c1', title: 'Introduction to Programming Basics', duration: '45 mins', views: 234, rating: 4.8 },
      { id: 2, courseId: 'c2', title: 'Thermodynamics Fundamentals', duration: '38 mins', views: 189, rating: 4.6 },
      { id: 3, courseId: 'c3', title: 'Quantum Physics Concepts', duration: '52 mins', views: 156, rating: 4.9 }
    ]);
    
    // AR Visuals Demo Data
    setArVisuals([
      { id: 1, courseId: 'c1', title: 'Data Structure Visualization', type: '3D Model', interactions: 45 },
      { id: 2, courseId: 'c2', title: 'Heat Transfer Simulation', type: 'AR Experience', interactions: 23 },
      { id: 3, courseId: 'c3', title: 'Atomic Structure Model', type: '3D Interactive', interactions: 67 }
    ]);
    
    // Interactive Sessions Demo Data
    setInteractiveSessions([
      { id: 1, title: 'Advanced Programming Q&A', date: '2025-01-15', participants: 45, status: 'upcoming' },
      { id: 2, title: 'Physics Problem Solving', date: '2025-01-18', participants: 32, status: 'live' },
      { id: 3, title: 'Law Case Studies Discussion', date: '2025-01-20', participants: 28, status: 'upcoming' }
    ]);
    
    generateAIRecommendations();
  };
  
  // AI Functions
  const generateAIRecommendations = () => {
    const recommendations = [
      { 
        type: 'Course Optimization', 
        message: 'Based on student performance, consider adding more practical exercises to CS101',
        priority: 'high',
        impact: '15% improvement expected'
      },
      {
        type: 'Resource Suggestion',
        message: 'Students struggling with Quantum Physics would benefit from visual learning materials',
        priority: 'medium',
        impact: '10% improvement expected'
      },
      {
        type: 'Schedule Optimization',
        message: 'Moving Thermodynamics to morning slots could improve attendance by 12%',
        priority: 'low',
        impact: '8% improvement expected'
      }
    ];
    setAiRecommendations(recommendations);
  };
  
  const optimizeAICurriculum = () => {
    setIsProcessing(true);
    // Simulate AI processing
    setTimeout(() => {
      const analysis = {
        overallScore: 87,
        improvements: [
          'Add 3 more practical sessions to Computer Science courses',
          'Reduce theory load in Physics by 10%',
          'Introduce peer learning in Business courses'
        ],
        predictions: {
          expectedImprovement: '23%',
          timeToImplement: '4 weeks',
          affectedStudents: 1245
        }
      };
      setAiAnalysis(analysis);
      setIsProcessing(false);
    }, 3000);
  };
  
  const handleVoiceRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate recording
      setTimeout(() => {
        const newNote = {
          id: Date.now(),
          title: `Voice Note ${voiceNotes.length + 1}`,
          duration: '2:34',
          courseId: selectedCourse?.id || 'c1',
          date: new Date().toLocaleDateString()
        };
        setVoiceNotes(prev => [...prev, newNote]);
        setIsRecording(false);
      }, 3000);
    }
  };
  
  const collectLiveFeedback = () => {
    const feedback = {
      id: Date.now(),
      responses: Math.floor(Math.random() * 50) + 20,
      rating: (Math.random() * 2 + 3).toFixed(1),
      timestamp: new Date().toLocaleString()
    };
    setLiveFeedback(prev => [...prev, feedback]);
  };

  return (
    <div className={`p-6 min-h-screen ${isDarkTheme ? "dark" : ""}`} style={{ backgroundColor: `var(--bg)`, color: `var(--text)` }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <img src="/image.png" alt="JECRC University Logo" className="w-20 h-8 mr-4" />
          <h2 className="text-2xl font-semibold" style={{ color: `var(--text)` }}>Curriculum Management</h2>
        </div>
        <button
          onClick={() => setIsDarkTheme(!isDarkTheme)}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
        >
          {isDarkTheme ? <Sun size={20} color="var(--text)" /> : <Moon size={20} color="var(--text)" />}
        </button>
      </div>

      {/* School and Branch Filters */}
      <div className="flex items-center gap-4 mb-6">
        <select
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded p-2 w-full md:w-64 text-black dark:text-white"
          value={selectedSchool}
          onChange={(e) => {
            setSelectedSchool(e.target.value);
            setSelectedBranch("");
          }}
          style={{ color: `var(--text)`, backgroundColor: `var(--card)` }}
        >
          <option value="">All Schools</option>
          {jecrcSchools.map((school) => (
            <option key={school} value={school}>{school}</option>
          ))}
        </select>
        <select
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded p-2 w-full md:w-64 text-black dark:text-white"
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          disabled={!selectedSchool}
          style={{ color: `var(--text)`, backgroundColor: `var(--card)` }}
        >
          <option value="">All Branches</option>
          {(jecrcBranches[selectedSchool] || []).map((branch) => (
            <option key={branch} value={branch}>{branch}</option>
          ))}
        </select>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6 overflow-x-auto">
        {["courses", "syllabus", "progress", "analytics", "videolessons", "voicenotes", "arvisuals", "aicurriculum", "smartrecommend", "interactivesessions", "livefeedback"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg ${activeTab === tab ? "bg-red-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"} whitespace-nowrap flex items-center gap-2`}
          >
            {tab === "videolessons" && <Video size={16} />}
            {tab === "voicenotes" && <Mic size={16} />}
            {tab === "arvisuals" && <Scan size={16} />}
            {tab === "aicurriculum" && <Brain size={16} />}
            {tab === "smartrecommend" && <Lightbulb size={16} />}
            {tab === "interactivesessions" && <PlayCircle size={16} />}
            {tab === "livefeedback" && <BookOpen size={16} />}
            {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, " $1").trim()}
          </button>
        ))}
      </div>

      {/* Modal for Course Details */}
      {modalOpen && selectedCourse && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-3/4 max-w-4xl p-6 relative" style={{ backgroundColor: `var(--card)` }}>
            <button onClick={closeModal} className="absolute top-2 right-2 text-xl text-gray-400 dark:text-gray-500 hover:text-red-400 dark:hover:text-red-300">&times;</button>
            <h2 className="text-xl font-bold mb-4" style={{ color: `var(--text)` }}>{selectedCourse.title} - Course Details</h2>
            <p><strong>Code:</strong> {selectedCourse.code}</p>
            <p><strong>Credits:</strong> {selectedCourse.credits}</p>
            <p><strong>School:</strong> {selectedCourse.school}</p>
            <p><strong>Branch:</strong> {selectedCourse.branch}</p>
            <p><strong>Semester:</strong> {selectedCourse.semester}</p>
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2" style={{ color: `var(--text)` }}>Syllabus Topics</h3>
              <ul className="list-disc pl-5">
                {syllabus.find(s => s.id === selectedCourse.id)?.topics.map((topic, i) => (
                  <li key={i} style={{ color: `var(--text)` }}>{topic}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Courses Section */}
      {activeTab === "courses" && (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
              onClick={handleAddCourse}
            >
              <Plus size={16} className="mr-2" /> Add Course
            </button>
            <input
              type="text"
              placeholder="Search by code or title..."
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded p-2 w-full md:w-64 text-black dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ color: `var(--text)`, backgroundColor: `var(--card)` }}
            />
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center
"
              onClick={handleExport}
            >
              <Download size={16} className="mr-2" /> Export Courses
            </button>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4 overflow-x-auto" style={{ backgroundColor: `var(--card)` }}>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-2">School</th>
                  <th className="p-2">Branch</th>
                  <th className="p-2">Code</th>
                  <th className="p-2">Title</th>
                  <th className="p-2">Credits</th>
                  <th className="p-2">Semester</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedCourses.length > 0 ? (
                  pagedCourses.map((item) => (
                    <tr key={item.id} className="border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <td className="p-2" style={{ color: `var(--text)` }}>{item.school}</td>
                      <td className="p-2" style={{ color: `var(--text)` }}>{item.branch}</td>
                      <td className="p-2" style={{ color: `var(--text)` }}>{item.code}</td>
                      <td className="p-2" style={{ color: `var(--text)` }}>{item.title}</td>
                      <td className="p-2" style={{ color: `var(--text)` }}>{item.credits}</td>
                      <td className="p-2" style={{ color: `var(--text)` }}>{item.semester}</td>
                      <td className="p-2">
                        <button
                          className="text-blue-500 hover:underline mr-2"
                          onClick={() => handleUpdateSyllabus(item.id, "topic")}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="text-green-500 hover:underline"
                          onClick={() => handleViewCourseDetails(item)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-4 text-center" style={{ color: `var(--muted)` }}>
                      No courses found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4 text-gray-600 dark:text-gray-300">
            <span>
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredCourses.length)} of {filteredCourses.length} entries
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
              >
                <ChevronLeft size={16} color="var(--text)" />
              </button>
              <span style={{ color: `var(--text)` }}>{page}</span>
              <button
                disabled={page === maxPage}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
              >
                <ChevronRight size={16} color="var(--text)" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Syllabus Section */}
      {activeTab === "syllabus" && (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by course code or title..."
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded p-2 w-full md:w-64 text-black dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ color: `var(--text)`, backgroundColor: `var(--card)` }}
            />
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center
"
              onClick={handleExport}
            >
              <Download size={16} className="mr-2" /> Export Syllabus
            </button>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4 overflow-x-auto" style={{ backgroundColor: `var(--card)` }}>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-2">School</th>
                  <th className="p-2">Branch</th>
                  <th className="p-2">Code</th>
                  <th className="p-2">Title</th>
                  <th className="p-2">Topics</th>
                  <th className="p-2">Resources</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedSyllabus.length > 0 ? (
                  pagedSyllabus.map((item) => {
                    const course = courses.find(c => c.id === item.id);
                    return (
                      <tr key={item.id} className="border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <td className="p-2" style={{ color: `var(--text)` }}>{course?.school}</td>
                        <td className="p-2" style={{ color: `var(--text)` }}>{course?.branch}</td>
                        <td className="p-2" style={{ color: `var(--text)` }}>{course?.code}</td>
                        <td className="p-2" style={{ color: `var(--text)` }}>{course?.title}</td>
                        <td className="p-2" style={{ color: `var(--text)` }}>{item.topics.join(", ")}</td>
                        <td className="p-2" style={{ color: `var(--text)` }}>{item.resources.join(", ")}</td>
                        <td className="p-2">
                          <button
                            className="text-blue-500 hover:underline"
                            onClick={() => handleUpdateSyllabus(item.id, "topic")}
                          >
                            <Edit size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="p-4 text-center" style={{ color: `var(--muted)` }}>
                      No syllabus found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4 text-gray-600 dark:text-gray-300">
            <span>
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredSyllabus.length)} of {filteredSyllabus.length} entries
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
              >
                <ChevronLeft size={16} color="var(--text)" />
              </button>
              <span style={{ color: `var(--text)` }}>{page}</span>
              <button
                disabled={page === maxPage}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
              >
                <ChevronRight size={16} color="var(--text)" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Section */}
      {activeTab === "progress" && (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by course code or title..."
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded p-2 w-full md:w-64 text-black dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ color: `var(--text)`, backgroundColor: `var(--card)` }}
            />
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center
"
              onClick={handleExport}
            >
              <Download size={16} className="mr-2" /> Export Progress
            </button>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-4 overflow-x-auto" style={{ backgroundColor: `var(--card)` }}>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-2">School</th>
                  <th className="p-2">Branch</th>
                  <th className="p-2">Code</th>
                  <th className="p-2">Title</th>
                  <th className="p-2">Completion Rate (%)</th>
                  <th className="p-2">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {pagedProgress.length > 0 ? (
                  pagedProgress.map((item) => {
                    const course = courses.find(c => c.id === item.id);
                    return (
                      <tr key={item.id} className="border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <td className="p-2" style={{ color: `var(--text)` }}>{course?.school}</td>
                        <td className="p-2" style={{ color: `var(--text)` }}>{course?.branch}</td>
                        <td className="p-2" style={{ color: `var(--text)` }}>{course?.code}</td>
                        <td className="p-2" style={{ color: `var(--text)` }}>{course?.title}</td>
                        <td className="p-2" style={{ color: `var(--text)` }}>{item.completionRate}%</td>
                        <td className="p-2" style={{ color: `var(--text)` }}>{item.lastUpdated}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="p-4 text-center" style={{ color: `var(--muted)` }}>
                      No progress data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4 text-gray-600 dark:text-gray-300">
            <span>
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredProgress.length)} of {filteredProgress.length} entries
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
              >
                <ChevronLeft size={16} color="var(--text)" />
              </button>
              <span style={{ color: `var(--text)` }}>{page}</span>
              <button
                disabled={page === maxPage}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
              >
                <ChevronRight size={16} color="var(--text)" />
              </button>
            </div>
          </div>
          <div className="mt-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow" style={{ backgroundColor: `var(--card)` }}>
            <h3 className="text-lg font-medium mb-4 flex items-center" style={{ color: `var(--text)` }}>
              <Line size={20} className="mr-2" /> Progress Trend (Unique Feature: Predictive Analytics)
            </h3>
            {progressTrendData && progressTrendData.labels && progressTrendData.datasets && progressTrendData.datasets.length > 0 ? (
              <Line data={progressTrendData} options={{ plugins: { zoom: { zoom: { mode: 'x' } }, filler: { propagate: true } } }} />
            ) : (
              <p style={{ color: `var(--muted)` }}>No data available for chart.</p>
            )}
          </div>
        </div>
      )}

      {/* Analytics Section */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {progressTrendData && progressTrendData.labels && progressTrendData.datasets && progressTrendData.datasets.length > 0 ? (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow" style={{ backgroundColor: `var(--card)` }}>
              <h3 className="text-lg font-medium mb-4 flex items-center" style={{ color: `var(--text)` }}>
                <BarChart size={20} className="mr-2" /> Course Completion Analytics
              </h3>
              <Line data={progressTrendData} options={{ plugins: { zoom: { zoom: { mode: 'x' } }, filler: { propagate: true } } }} />
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow" style={{ backgroundColor: `var(--card)` }}>
              <p style={{ color: `var(--muted)` }}>No data available for analytics.</p>
            </div>
          )}
        </div>
      )}

      {/* Video Lessons Tab */}
      {activeTab === "videolessons" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow" style={{ backgroundColor: `var(--card)` }}>
            <h3 className="text-lg font-medium mb-4 flex items-center" style={{ color: `var(--text)` }}>
              <Video size={20} className="mr-2" /> Video Lessons Library
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Access recorded video lessons for each course with analytics.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videoLessons.map(lesson => (
                <div key={lesson.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium" style={{ color: `var(--text)` }}>{lesson.title}</h4>
                    <span className="text-sm text-gray-500">{lesson.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-3">
                    <span>{lesson.views} views</span>
                    <span className="flex items-center">⭐ {lesson.rating}</span>
                  </div>
                  <button
                    className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center justify-center"
                    onClick={() => alert(`Playing: ${lesson.title}`)}
                  >
                    <PlayCircle size={16} className="mr-2" /> Play Video
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Voice Notes Tab */}
      {activeTab === "voicenotes" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow" style={{ backgroundColor: `var(--card)` }}>
            <h3 className="text-lg font-medium mb-4 flex items-center" style={{ color: `var(--text)` }}>
              <Mic size={20} className="mr-2" /> Voice Notes Manager
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Record and manage audio notes for courses with AI transcription.</p>
            
            <div className="flex gap-4 mb-6">
              <button
                className={`px-4 py-2 rounded flex items-center ${
                  isRecording ? 'bg-red-600 text-white' : 'bg-red-500 text-white hover:bg-red-700'
                }`}
                onClick={handleVoiceRecording}
                disabled={isRecording}
              >
                <Mic size={16} className="mr-2" /> 
                {isRecording ? 'Recording...' : 'Record Note'}
              </button>
              {isRecording && (
                <div className="flex items-center text-red-600">
                  <div className="animate-pulse w-3 h-3 bg-red-600 rounded-full mr-2"></div>
                  Recording in progress...
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium" style={{ color: `var(--text)` }}>Recorded Notes ({voiceNotes.length})</h4>
              {voiceNotes.length > 0 ? (
                voiceNotes.map(note => (
                  <div key={note.id} className="border rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <h5 className="font-medium" style={{ color: `var(--text)` }}>{note.title}</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Duration: {note.duration} | {note.date}</p>
                    </div>
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => alert(`Playing: ${note.title}`)}
                    >
                      Play
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No voice notes recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AR Visuals Tab */}
      {activeTab === "arvisuals" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow" style={{ backgroundColor: `var(--card)` }}>
            <h3 className="text-lg font-medium mb-4 flex items-center" style={{ color: `var(--text)` }}>
              <Scan size={20} className="mr-2" /> AR & 3D Visualizations
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Immersive 3D and AR experiences for better concept understanding.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {arVisuals.map(visual => (
                <div key={visual.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium" style={{ color: `var(--text)` }}>{visual.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs ${
                      visual.type === '3D Model' ? 'bg-blue-100 text-blue-800' :
                      visual.type === 'AR Experience' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {visual.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {visual.interactions} student interactions
                  </p>
                  <button
                    className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center justify-center"
                    onClick={() => alert(`Launching ${visual.title} - ${visual.type}`)}
                  >
                    <Scan size={16} className="mr-2" /> Launch {visual.type}
                  </button>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mt-6">
              <h4 className="font-medium mb-2" style={{ color: `var(--text)` }}>🎯 Usage Analytics</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">135</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Total Interactions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">89%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Engagement Rate</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">4.7</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Avg Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Curriculum Tab */}
      {activeTab === "aicurriculum" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow" style={{ backgroundColor: `var(--card)` }}>
            <h3 className="text-lg font-medium mb-4 flex items-center" style={{ color: `var(--text)` }}>
              <Brain size={20} className="mr-2" /> AI Curriculum Optimizer
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">AI-powered curriculum analysis and optimization based on student performance data.</p>
            
            <div className="flex gap-4 mb-6">
              <button
                className={`px-4 py-2 rounded flex items-center ${
                  isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-700'
                }`}
                onClick={optimizeAICurriculum}
                disabled={isProcessing}
              >
                <Brain size={16} className="mr-2" /> 
                {isProcessing ? 'Analyzing...' : 'Run AI Analysis'}
              </button>
              {isProcessing && (
                <div className="flex items-center text-blue-600">
                  <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                  Processing curriculum data...
                </div>
              )}
            </div>
            
            {aiAnalysis && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-4" style={{ color: `var(--text)` }}>
                  🎨 AI Analysis Results
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{aiAnalysis.overallScore}%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Curriculum Efficiency</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{aiAnalysis.predictions.expectedImprovement}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Expected Improvement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{aiAnalysis.predictions.affectedStudents}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Students Impacted</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium mb-2" style={{ color: `var(--text)` }}>AI Recommendations:</h5>
                    <ul className="space-y-2">
                      {aiAnalysis.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          <span style={{ color: `var(--text)` }}>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
                    <p className="text-sm">
                      <strong>Implementation Timeline:</strong> {aiAnalysis.predictions.timeToImplement}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Smart Recommendations Tab */}
      {activeTab === "smartrecommend" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow" style={{ backgroundColor: `var(--card)` }}>
            <h3 className="text-lg font-medium mb-4 flex items-center" style={{ color: `var(--text)` }}>
              <Lightbulb size={20} className="mr-2" /> AI Smart Recommendations
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">AI-powered recommendations for curriculum improvements and optimizations.</p>
            
            <div className="flex gap-4 mb-6">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center"
                onClick={generateAIRecommendations}
              >
                <Lightbulb size={16} className="mr-2" /> Refresh Recommendations
              </button>
            </div>
            
            <div className="space-y-4">
              {aiRecommendations.map((recommendation, index) => (
                <div key={index} className={`border-l-4 p-4 rounded ${
                  recommendation.priority === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-500/20' :
                  recommendation.priority === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                  'border-green-500 bg-green-50 dark:bg-green-900/20'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium" style={{ color: `var(--text)` }}>{recommendation.type}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      recommendation.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' :
                      recommendation.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                      'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                    }`}>
                      {recommendation.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">{recommendation.message}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      🎨 {recommendation.impact}
                    </span>
                    <button className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                      Implement
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Interactive Sessions Tab */}
      {activeTab === "interactivesessions" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow" style={{ backgroundColor: `var(--card)` }}>
            <h3 className="text-lg font-medium mb-4 flex items-center" style={{ color: `var(--text)` }}>
              <PlayCircle size={20} className="mr-2" /> Interactive Learning Sessions
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Join live interactive sessions with real-time collaboration and Q&A.</p>
            
            <div className="space-y-4">
              {interactiveSessions.map(session => (
                <div key={session.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium" style={{ color: `var(--text)` }}>{session.title}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      session.status === 'live' ? 'bg-red-100 text-red-800 animate-pulse' :
                      session.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {session.status === 'live' ? '🔴 LIVE' : 
                       session.status === 'upcoming' ? '📅 UPCOMING' : 'ENDED'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-3">
                    <span>📅 {session.date}</span>
                    <span>👥 {session.participants} participants</span>
                  </div>
                  <button
                    className={`w-full px-4 py-2 rounded flex items-center justify-center ${
                      session.status === 'live' ? 'bg-red-600 text-white hover:bg-red-700' :
                      session.status === 'upcoming' ? 'bg-blue-600 text-white hover:bg-blue-700' :
                      'bg-gray-400 text-white cursor-not-allowed'
                    }`}
                    onClick={() => {
                      if (session.status !== 'ended') {
                        alert(`${session.status === 'live' ? 'Joining' : 'Scheduling reminder for'}: ${session.title}`);
                      }
                    }}
                    disabled={session.status === 'ended'}
                  >
                    <PlayCircle size={16} className="mr-2" /> 
                    {session.status === 'live' ? 'Join Now' :
                     session.status === 'upcoming' ? 'Set Reminder' : 'Session Ended'}
                  </button>
                </div>
              ))}
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h4 className="font-medium mb-2" style={{ color: `var(--text)` }}>📈 Session Analytics</h4>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-purple-600">105</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Avg Participants</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-green-600">92%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Feedback Tab */}
      {activeTab === "livefeedback" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow" style={{ backgroundColor: `var(--card)` }}>
            <h3 className="text-lg font-medium mb-4 flex items-center" style={{ color: `var(--text)` }}>
              <BookOpen size={20} className="mr-2" /> Live Feedback System
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Real-time feedback collection and analysis from students and faculty.</p>
            
            <div className="flex gap-4 mb-6">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center"
                onClick={collectLiveFeedback}
              >
                <BookOpen size={16} className="mr-2" /> Start Feedback Collection
              </button>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium" style={{ color: `var(--text)` }}>Recent Feedback Sessions</h4>
              {liveFeedback.length > 0 ? (
                liveFeedback.map(feedback => (
                  <div key={feedback.id} className="border rounded-lg p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium" style={{ color: `var(--text)` }}>Feedback Session</h5>
                      <span className="text-sm text-gray-600 dark:text-gray-300">{feedback.timestamp}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{feedback.responses}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Responses</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{feedback.rating}/5</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Avg Rating</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No feedback sessions yet. Start collecting feedback to see results here.</p>
              )}
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <h4 className="font-medium mb-2" style={{ color: `var(--text)` }}>📈 Feedback Overview</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-orange-600">{liveFeedback.reduce((sum, f) => sum + f.responses, 0)}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Total Responses</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-blue-600">
                    {liveFeedback.length > 0 ? (liveFeedback.reduce((sum, f) => sum + parseFloat(f.rating), 0) / liveFeedback.length).toFixed(1) : '0.0'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Avg Rating</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-green-600">{liveFeedback.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Sessions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}