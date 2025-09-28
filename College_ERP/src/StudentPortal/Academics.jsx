import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Upload, Edit, Download, Plus, Search, Calendar, AlertTriangle, BarChart2, PieChart, FileText, Bot, TrendingUp, BookOpen, File, FileType, TimerIcon , Group, LineSquiggleIcon , Microscope, CheckCircle2, School, Eye } from "lucide-react";
import { Bar, Line, Pie } from "react-chartjs-2";
import zoomPlugin from 'chartjs-plugin-zoom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, zoomPlugin, Filler);

// JECRC University branding colors
const jecrcColors = {
  primary: "#1E3A8A",
  secondary: "#10B981",
  accent: "#F59E0B",
  danger: "#EF4444",
  neutral: "#6B7280",
};

// Dummy data based on JECRC University B.Tech CSE Core curriculum research
const jecrcSemesters = [1, 2, 3, 4, 5, 6, 7, 8];

const initialCourses = [
  { id: "c1", semester: 1, code: "CSE101", title: "Introduction to Programming", credits: 4, instructor: "Dr. Priya Sharma", syllabus: "Basics of C/C++, data types, control structures", resources: "Textbook, Lecture Notes, Video Tutorials", grade: "A", attendance: 95 },
  { id: "c2", semester: 1, code: "MAT101", title: "Engineering Mathematics I", credits: 3, instructor: "Prof. Vikram Singh", syllabus: "Calculus, Differential Equations", resources: "Khan Academy Videos, Practice Problems", grade: "B+", attendance: 88 },
  { id: "c3", semester: 2, code: "CSE201", title: "Data Structures", credits: 4, instructor: "Dr. Rajesh Kumar", syllabus: "Arrays, Linked Lists, Stacks, Queues", resources: "GeeksforGeeks Articles, Coding Practice", grade: "A-", attendance: 92 },
  { id: "c4", semester: 2, code: "PHY201", title: "Engineering Physics", credits: 3, instructor: "Dr. Anita Verma", syllabus: "Mechanics, Optics", resources: "Lab Manuals, Simulations", grade: "B", attendance: 85 },
  { id: "c5", semester: 3, code: "CSE301", title: "Algorithms", credits: 4, instructor: "Prof. Suresh Jain", syllabus: "Sorting, Searching, Graph Algorithms", resources: "CLRS Textbook, LeetCode Problems", grade: "A", attendance: 96 },
  // Add more courses up to 30 for all semesters
  { id: "c6", semester: 3, code: "CSE302", title: "Database Management Systems", credits: 4, instructor: "Dr. Neha Gupta", syllabus: "SQL, Normalization", resources: "MySQL Tutorials", grade: "B+", attendance: 90 },
  { id: "c7", semester: 4, code: "CSE401", title: "Operating Systems", credits: 4, instructor: "Prof. Arun Sharma", syllabus: "Processes, Memory Management", resources: "OS Book by Galvin", grade: "A-", attendance: 93 },
  { id: "c8", semester: 4, code: "CSE402", title: "Computer Networks", credits: 4, instructor: "Dr. Priya Singh", syllabus: "TCP/IP, OSI Model", resources: "Cisco Networking Academy", grade: "B", attendance: 87 },
  { id: "c9", semester: 5, code: "CSE501", title: "Software Engineering", credits: 3, instructor: "Prof. Rajesh Kumar", syllabus: "Agile, Waterfall", resources: "UML Diagrams Tools", grade: "A", attendance: 94 },
  { id: "c10", semester: 5, code: "CSE502", title: "Web Technologies", credits: 4, instructor: "Dr. Anita Verma", syllabus: "HTML, CSS, JS", resources: "MDN Web Docs", grade: "B+", attendance: 89 },
  { id: "c11", semester: 6, code: "CSE601", title: "Machine Learning", credits: 4, instructor: "Prof. Suresh Jain", syllabus: "Supervised Learning", resources: "Coursera ML Course", grade: "A-", attendance: 91 },
  { id: "c12", semester: 6, code: "CSE602", title: "Cloud Computing", credits: 3, instructor: "Dr. Neha Gupta", syllabus: "AWS, Azure", resources: "Cloud Provider Docs", grade: "B", attendance: 86 },
  { id: "c13", semester: 7, code: "CSE701", title: "Big Data Analytics", credits: 4, instructor: "Prof. Arun Sharma", syllabus: "Hadoop, Spark", resources: "Apache Docs", grade: "A", attendance: 95 },
  { id: "c14", semester: 7, code: "CSE702", title: "Cyber Security", credits: 3, instructor: "Dr. Priya Singh", syllabus: "Encryption, Firewalls", resources: "OWASP Guide", grade: "B+", attendance: 88 },
  { id: "c15", semester: 8, code: "CSE801", title: "Project Work", credits: 6, instructor: "Prof. Rajesh Kumar", syllabus: "Capstone Project", resources: "GitHub Repos", grade: "A-", attendance: 92 },
  // Continue adding up to 30 courses
  { id: "c16", semester: 1, code: "CHE101", title: "Engineering Chemistry", credits: 3, instructor: "Dr. Anita Verma", syllabus: "Organic Chemistry", resources: "Lab Manuals", grade: "B", attendance: 85 },
  { id: "c17", semester: 1, code: "PHY101", title: "Engineering Physics", credits: 3, instructor: "Prof. Suresh Jain", syllabus: "Mechanics", resources: "Physics Simulations", grade: "A", attendance: 94 },
  { id: "c18", semester: 2, code: "MAT201", title: "Engineering Mathematics II", credits: 3, instructor: "Dr. Neha Gupta", syllabus: "Linear Algebra", resources: "Math Worksheets", grade: "B+", attendance: 89 },
  { id: "c19", semester: 2, code: "CSE202", title: "Object Oriented Programming", credits: 4, instructor: "Prof. Arun Sharma", syllabus: "Java OOP", resources: "Oracle Docs", grade: "A-", attendance: 91 },
  { id: "c20", semester: 3, code: "CSE303", title: "Discrete Mathematics", credits: 3, instructor: "Dr. Priya Singh", syllabus: "Set Theory", resources: "Math Proofs", grade: "B", attendance: 86 },
  { id: "c21", semester: 3, code: "CSE304", title: "Computer Organization", credits: 4, instructor: "Prof. Rajesh Kumar", syllabus: "CPU Architecture", resources: "Patterson Book", grade: "A", attendance: 95 },
  { id: "c22", semester: 4, code: "CSE403", title: "Theory of Computation", credits: 3, instructor: "Dr. Anita Verma", syllabus: "Automata Theory", resources: "Sipser Book", grade: "B+", attendance: 88 },
  { id: "c23", semester: 4, code: "CSE404", title: "Compiler Design", credits: 4, instructor: "Prof. Suresh Jain", syllabus: "Lexical Analysis", resources: "Dragon Book", grade: "A-", attendance: 92 },
  { id: "c24", semester: 5, code: "CSE503", title: "Artificial Intelligence", credits: 4, instructor: "Dr. Neha Gupta", syllabus: "Search Algorithms", resources: "AI Tutorials", grade: "A", attendance: 94 },
  { id: "c25", semester: 5, code: "CSE504", title: "Internet of Things", credits: 3, instructor: "Prof. Arun Sharma", syllabus: "IoT Protocols", resources: "Arduino Projects", grade: "B", attendance: 85 },
  { id: "c26", semester: 6, code: "CSE603", title: "Blockchain Technology", credits: 3, instructor: "Dr. Priya Singh", syllabus: "Cryptocurrency", resources: "Ethereum Docs", grade: "A-", attendance: 91 },
  { id: "c27", semester: 6, code: "CSE604", title: "Cyber Security", credits: 4, instructor: "Prof. Rajesh Kumar", syllabus: "Ethical Hacking", resources: "Kali Linux Tools", grade: "B+", attendance: 89 },
  { id: "c28", semester: 7, code: "CSE703", title: "Deep Learning", credits: 4, instructor: "Dr. Anita Verma", syllabus: "Neural Networks", resources: "TensorFlow Tutorials", grade: "A", attendance: 95 },
  { id: "c29", semester: 7, code: "CSE704", title: "Cloud Computing", credits: 3, instructor: "Prof. Suresh Jain", syllabus: "AWS Services", resources: "AWS Console", grade: "B", attendance: 86 },
  { id: "c30", semester: 8, code: "CSE804", title: "Internship/Project", credits: 6, instructor: "Dr. Neha Gupta", syllabus: "Real-world Application", resources: "Industry Projects", grade: "A-", attendance: 92 },
];

const initialSyllabus = initialCourses.map((c) => ({
  id: c.id,
  topics: ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5"], // Sample topics
  resources: ["Textbook", "Lecture Notes", "Video Tutorial", "Online Resource", "Practice Problems"],
}));

const initialGrades = initialCourses.map((c) => ({
  id: c.id,
  grade: c.grade,
  marks: Math.floor(Math.random() * 100) + 1, // Random marks
}));

const initialAttendance = initialCourses.map((c) => ({
  id: c.id,
  attendance: c.attendance,
}));

const initialAssignments = initialCourses.map((c) => ({
  id: c.id,
  assignments: [
    { id: "as1", title: "Assignment 1", dueDate: "2025-09-15", submitted: false },
    { id: "as2", title: "Assignment 2", dueDate: "2025-09-20", submitted: false },
  ],
}));

const initialExams = initialCourses.map((c) => ({
  id: c.id,
  exams: [
    { id: "ex1", title: "Midterm", date: "2025-10-15", time: "10:00 AM" },
    { id: "ex2", title: "Final", date: "2025-12-20", time: "09:00 AM" },
  ],
}));

const initialCertificates = [
  { id: "cert1", title: "Certification in Python", issuedDate: "2025-08-01", issuer: "Coursera" },
  { id: "cert2", title: "Certification in Data Science", issuedDate: "2025-08-15", issuer: "IBM" },
];

const initialCareerResources = [
  { id: "career1", title: "Resume Building Workshop", date: "2025-09-25" },
  { id: "career2", title: "Mock Interview Session", date: "2025-10-05" },
];

const initialProgress = initialCourses.map((c) => ({
  id: c.id,
  completion: Math.floor(Math.random() * 100),
}));

const initialFeedback = initialCourses.map((c) => ({
  id: c.id,
  feedback: "Excellent teaching, clear explanations.",
}));

const initialVirtualLabs = initialCourses.map((c) => ({
  id: c.id,
  labs: ["Lab 1: Programming Basics", "Lab 2: Data Structures"],
}));

const initialRecommendations = initialCourses.map((c) => ({
  id: c.id,
  recommendations: ["Recommended Book: CLRS", "Online Course: Coursera Algorithms"],
}));

export default function Academics() {
  const [activeTab, setActiveTab] = useState("courses");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [courses, setCourses] = useState(initialCourses);
  const [syllabus, setSyllabus] = useState(initialSyllabus);
  const [grades, setGrades] = useState(initialGrades);
  const [attendance, setAttendance] = useState(initialAttendance);
  const [assignments, setAssignments] = useState(initialAssignments);
  const [exams, setExams] = useState(initialExams);
  const [certificates, setCertificates] = useState(initialCertificates);
  const [careerResources, setCareerResources] = useState(initialCareerResources);
  const [progress, setProgress] = useState(initialProgress);
  const [feedback, setFeedback] = useState(initialFeedback);
  const [virtualLabs, setVirtualLabs] = useState(initialVirtualLabs);
  const [recommendations, setRecommendations] = useState(initialRecommendations);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const rowsPerPage = 5;

  // Advanced Charts Data
  const gradeDistributionData = {
    labels: ["A+", "A", "B", "C", "D", "F"],
    datasets: [
      {
        label: "Grades",
        data: [25, 30, 20, 15, 5, 5],
        backgroundColor: [jecrcColors.primary, jecrcColors.secondary, jecrcColors.accent, jecrcColors.neutral, jecrcColors.danger, jecrcColors.danger],
      },
    ],
  };

  const performanceTrendData = {
    labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5"],
    datasets: [
      {
        label: "Average Marks",
        data: [80, 82, 85, 88, 90],
        borderColor: jecrcColors.primary,
        fill: true,
        backgroundColor: "rgba(30, 58, 138, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const aiPredictionData = {
    labels: ["Actual", "Predicted"],
    datasets: [
      {
        label: "Marks",
        data: [85, 92],
        backgroundColor: [jecrcColors.secondary, jecrcColors.accent],
      },
    ],
  };

  // Filters based on semester
  const filterData = (data) => {
    return data.filter((item) => 
      (selectedSemester ? item.semester === Number(selectedSemester) : true) &&
      (searchTerm ? Object.values(item).some((val) => val.toString().toLowerCase().includes(searchTerm.toLowerCase())) : true)
    );
  };

  const filteredCourses = filterData(courses);
  const filteredSyllabus = filterData(syllabus);
  const filteredGrades = filterData(grades);
  const filteredAttendance = filterData(attendance);
  const filteredAssignments = filterData(assignments);
  const filteredExams = filterData(exams);
  const filteredCertificates = filterData(certificates);
  const filteredCareerResources = filterData(careerResources);
  const filteredProgress = filterData(progress);
  const filteredFeedback = filterData(feedback);
  const filteredVirtualLabs = filterData(virtualLabs);
  const filteredRecommendations = filterData(recommendations);

  const pagedCourses = filteredCourses.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pagedSyllabus = filteredSyllabus.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pagedGrades = filteredGrades.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pagedAttendance = filteredAttendance.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pagedAssignments = filteredAssignments.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pagedExams = filteredExams.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pagedCertificates = filteredCertificates.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pagedCareerResources = filteredCareerResources.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pagedProgress = filteredProgress.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pagedFeedback = filteredFeedback.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pagedVirtualLabs = filteredVirtualLabs.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pagedRecommendations = filteredRecommendations.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const maxPage = Math.ceil(filteredCourses.length / rowsPerPage);

  const handleEnrollCourse = (courseId) => {
    console.log("Enrolling in course:", courseId);
  };

  const handleViewSyllabus = (courseId) => {
    console.log("Viewing syllabus for course:", courseId);
  };

  const handleViewCourseDetails = (course) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCourse(null);
  };

  const handleSubmitFeedback = (courseId, feedbackText) => {
    console.log("Submitting feedback for course:", courseId, feedbackText);
  };

  const handleAccessLab = (lab) => {
    console.log("Accessing virtual lab:", lab);
  };

  // Stub for export functionality
  const handleExport = () => {
    alert("Export functionality is not implemented yet.");
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Logo and Title */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <img src="/image.png" alt="JECRC University Logo" className="w-20 h-8 mr-4" />
            <div>
              <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>Academic Portal</h1>
              <p className="text-lg" style={{ color: 'var(--muted)' }}>Manage your courses, grades, and academic progress</p>
            </div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group" 
               style={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ color: 'var(--muted)' }} className="text-sm font-medium">Total Courses</p>
                  <p className="text-3xl font-bold text-red-600">{courses.length}</p>
                </div>
                <BookOpen className="w-12 h-12 text-red-600 opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
          
          <div className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group" 
               style={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ color: 'var(--muted)' }} className="text-sm font-medium">Average Grade</p>
                  <p className="text-3xl font-bold text-green-600">A-</p>
                </div>
                <TrendingUp className="w-12 h-12 text-green-600 opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
          
          <div className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group" 
               style={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ color: 'var(--muted)' }} className="text-sm font-medium">Avg Attendance</p>
                  <p className="text-3xl font-bold text-purple-600">90%</p>
                </div>
                <CheckCircle2 className="w-12 h-12 text-purple-600 opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
          
          <div className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group" 
               style={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ color: 'var(--muted)' }} className="text-sm font-medium">Current Semester</p>
                  <p className="text-3xl font-bold text-orange-600">6</p>
                </div>
                <School className="w-12 h-12 text-orange-600 opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 mb-8 transition-all duration-300 hover:shadow-lg" 
             style={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <Search className="w-5 h-5" />
            Filters & Search
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              className="px-4 py-3 rounded-lg border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              style={{ backgroundColor: 'var(--input)', borderColor: 'var(--border)', color: 'var(--text)' }}
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              <option value="">All Semesters</option>
              {jecrcSemesters.map((sem) => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Modern Tab Navigation */}
        <div className="p-2 mb-8 overflow-x-auto" 
             style={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <div className="flex space-x-2 min-w-max">
            {[
              { key: "courses", label: "Courses", icon: BookOpen },
              { key: "syllabus", label: "Syllabus", icon: FileText },
              { key: "grades", label: "Grades", icon: TrendingUp },
              { key: "attendance", label: "Attendance", icon: CheckCircle2 },
              { key: "assignments", label: "Assignments", icon: File },
              { key: "exams", label: "Exams", icon: Calendar },
              { key: "certificates", label: "Certificates", icon: FileText },
              { key: "career", label: "Career", icon: TrendingUp },
              { key: "progress", label: "Progress", icon: BarChart2 },
              { key: "feedback", label: "Feedback", icon: Edit },
              { key: "virtuallabs", label: "Virtual Labs", icon: Microscope },
              { key: "recommendations", label: "Recommendations", icon: Bot }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-6 py-3 rounded-lg whitespace-nowrap flex items-center gap-3 font-medium transition-all duration-300 ${
                    activeTab === tab.key
                      ? 'text-white shadow-lg transform scale-105'
                      : 'hover:scale-105 hover:shadow-md'
                  }`}
                  style={activeTab === tab.key ? 
                    { backgroundColor: 'var(--accent)' } : 
                    { backgroundColor: 'var(--hover)', color: 'var(--text)' }
                  }
                >
                  <IconComponent size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modern Modal for Course Details */}
        {modalOpen && selectedCourse && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100" 
                 style={{ backgroundColor: 'var(--card)', borderRadius: '24px', border: '1px solid var(--border)' }}>
              
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-red-600" />
                  <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{selectedCourse.title}</h2>
                </div>
                <button 
                  onClick={closeModal} 
                  className="p-2 rounded-full hover:scale-110 transition-all duration-200" 
                  style={{ backgroundColor: 'var(--hover)', color: 'var(--muted)' }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--hover)' }}>
                    <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text)' }}>Course Information</h3>
                    <div className="space-y-2" style={{ color: 'var(--text)' }}>
                      <p><span className="font-medium" style={{ color: 'var(--muted)' }}>Code:</span> {selectedCourse.code}</p>
                      <p><span className="font-medium" style={{ color: 'var(--muted)' }}>Credits:</span> {selectedCourse.credits}</p>
                      <p><span className="font-medium" style={{ color: 'var(--muted)' }}>Instructor:</span> {selectedCourse.instructor}</p>
                      <p><span className="font-medium" style={{ color: 'var(--muted)' }}>Semester:</span> {selectedCourse.semester}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--hover)' }}>
                    <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text)' }}>Performance</h3>
                    <div className="space-y-2" style={{ color: 'var(--text)' }}>
                      <p><span className="font-medium" style={{ color: 'var(--muted)' }}>Grade:</span> 
                        <span className="ml-2 px-2 py-1 rounded-lg text-sm font-semibold bg-green-100 text-green-800">{selectedCourse.grade}</span>
                      </p>
                      <p><span className="font-medium" style={{ color: 'var(--muted)' }}>Attendance:</span> 
                        <span className="ml-2 px-2 py-1 rounded-lg text-sm font-semibold bg-red-100 text-red-800">{selectedCourse.attendance}%</span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text)' }}>Course Description</h3>
                  <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--hover)' }}>
                    <p className="mb-3" style={{ color: 'var(--text)' }}><span className="font-medium" style={{ color: 'var(--muted)' }}>Syllabus:</span> {selectedCourse.syllabus}</p>
                    <p style={{ color: 'var(--text)' }}><span className="font-medium" style={{ color: 'var(--muted)' }}>Resources:</span> {selectedCourse.resources}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modern Courses Section */}
        {activeTab === "courses" && (
          <div>
            {/* Search and Export Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 rounded-xl" 
                 style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={20} style={{ color: 'var(--icon)' }} />
                <input
                  type="text"
                  placeholder="Search courses by name, code, or instructor..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  style={{ backgroundColor: 'var(--input)', borderColor: 'var(--border)', color: 'var(--text)' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                className="px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-all duration-200 hover:scale-105 shadow-lg text-white"
                style={{ backgroundColor: 'var(--button-success)' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--success)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--button-success)'}
                onClick={handleExport}
              >
                <Download size={18} /> Export Courses
              </button>
            </div>
            
            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {pagedCourses.length > 0 ? (
                pagedCourses.map((course) => (
                  <div key={course.id} 
                       className="group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer" 
                       style={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                    
                    {/* Semester Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className="px-3 py-1 text-white text-sm font-semibold rounded-full"
                            style={{ backgroundColor: 'var(--tertiary)' }}>
                        Sem {course.semester}
                      </span>
                    </div>
                    
                    <div className="p-6">
                      {/* Course Header */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className="p-3 rounded-lg bg-red-100 text-red-600">
                          <BookOpen size={24} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg" style={{ color: 'var(--text)' }}>{course.title}</h3>
                          </div>
                          <p className="font-medium text-red-600">{course.code}</p>
                          <p style={{ color: 'var(--muted)' }} className="text-sm">{course.credits} Credits</p>
                        </div>
                      </div>
                      
                      {/* Instructor */}
                      <div className="flex items-center gap-2 mb-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--hover)' }}>
                          <span className="text-sm font-medium" style={{ color: 'var(--muted)' }}>{course.instructor.split(' ').map(n => n[0]).join('')}</span>
                        </div>
                        <div>
                          <p className="font-medium" style={{ color: 'var(--text)' }}>{course.instructor}</p>
                          <p style={{ color: 'var(--muted)' }} className="text-sm">Instructor</p>
                        </div>
                      </div>
                      
                      {/* Performance Indicators */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp size={16} className="text-green-600" />
                          <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>Grade: </span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded">{course.grade}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-red-600" />
                          <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{course.attendance}%</span>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewCourseDetails(course)}
                          className="flex-1 px-4 py-2 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
                          style={{ backgroundColor: 'var(--tertiary)' }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--info)'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--tertiary)'}
                        >
                          <Eye size={16} /> View Details
                        </button>
                        <button
                          onClick={() => handleEnrollCourse(course.id)}
                          className="flex-1 px-4 py-2 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
                          style={{ backgroundColor: 'var(--button-success)' }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--success)'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--button-success)'}
                        >
                          <Plus size={16} /> Enroll
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full">
                  <div className="text-center py-12" style={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                    <BookOpen size={48} className="mx-auto mb-4" style={{ color: 'var(--icon)' }} />
                    <p className="text-lg font-medium" style={{ color: 'var(--muted)' }}>No courses found</p>
                    <p style={{ color: 'var(--muted)' }}>Try adjusting your search criteria</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Modern Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 rounded-xl" 
                 style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--muted)' }}>
                Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredCourses.length)} of {filteredCourses.length} entries
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105" 
                  style={{ backgroundColor: 'var(--hover)', color: 'var(--text)' }}
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="px-4 py-2 rounded-lg font-medium" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
                  {page}
                </span>
                <button
                  disabled={page === maxPage}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105" 
                  style={{ backgroundColor: 'var(--hover)', color: 'var(--text)' }}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modern Syllabus Section */}
        {activeTab === "syllabus" && (
          <div>
            {/* Search and Export Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 rounded-xl" 
                 style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={20} style={{ color: 'var(--icon)' }} />
                <input
                  type="text"
                  placeholder="Search syllabus by course name or topics..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  style={{ backgroundColor: 'var(--input)', borderColor: 'var(--border)', color: 'var(--text)' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                className="px-6 py-3 text-white rounded-lg flex items-center gap-2 font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                style={{ backgroundColor: '#8b5cf6' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#7c3aed'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#8b5cf6'}
                onClick={handleExport}
              >
                <Download size={18} /> Export Syllabus
              </button>
            </div>
            
            {/* Syllabus Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {pagedSyllabus.length > 0 ? (
                pagedSyllabus.map((item) => {
                  const course = courses.find((c) => c.id === item.id);
                  return (
                    <div key={item.id} 
                         className="group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl" 
                         style={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                      
                      {/* Card Header */}
                      <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
                              <FileText size={24} />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg" style={{ color: 'var(--text)' }}>{course?.title}</h3>
                              <p className="font-medium" style={{ color: 'var(--accent)' }}>{course?.code}</p>
                              <p style={{ color: 'var(--muted)' }} className="text-sm">Semester {course?.semester}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Course Topics */}
                      <div className="p-6">
                        <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                          <BookOpen size={16} />
                          Course Topics
                        </h4>
                        <div className="space-y-2 mb-4">
                          {item.topics.map((topic, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--accent)' }}></div>
                              <span style={{ color: 'var(--text)' }} className="text-sm">{topic}</span>
                            </div>
                          ))}
                        </div>
                        
                        {/* Resources */}
                        <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                          <File size={16} />
                          Resources
                        </h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.resources.map((resource, index) => (
                            <span key={index} 
                                  className="px-3 py-1 text-sm rounded-full" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
                              {resource}
                            </span>
                          ))}
                        </div>
                        
                        {/* Action Button */}
                        <button
                          onClick={() => handleViewSyllabus(item.id)}
                          className="w-full px-4 py-3 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
                          style={{ backgroundColor: 'var(--accent)' }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--accent-hover)'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--accent)'}
                        >
                          <Eye size={16} /> View Syllabus Details
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full">
                  <div className="text-center py-12" style={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                    <FileText size={48} className="mx-auto mb-4" style={{ color: 'var(--icon)' }} />
                    <p className="text-lg font-medium" style={{ color: 'var(--muted)' }}>No syllabus found</p>
                    <p style={{ color: 'var(--muted)' }}>Try adjusting your search criteria</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Modern Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 rounded-xl" 
                 style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--muted)' }}>
                Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredSyllabus.length)} of {filteredSyllabus.length} entries
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105" 
                  style={{ backgroundColor: 'var(--hover)', color: 'var(--text)' }}
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="px-4 py-2 rounded-lg font-medium" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
                  {page}
                </span>
                <button
                  disabled={page === maxPage}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105" 
                  style={{ backgroundColor: 'var(--hover)', color: 'var(--text)' }}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Grades Section */}
      {activeTab === "grades" && (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Search grades..."
              className="bg-white border rounded p-2 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center"
              onClick={handleExport}
            >
              <Download size={16} className="mr-2" /> Export Grades
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow mb-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-2">Semester</th>
                  <th className="p-2">Code</th>
                  <th className="p-2">Title</th>
                  <th className="p-2">Grade</th>
                  <th className="p-2">Marks</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedGrades.length > 0 ? (
                  pagedGrades.map((item) => {
                    const course = courses.find((c) => c.id === item.id);
                    return (
                      <tr key={item.id} className="border-b hover:bg-gray-100">
                        <td className="p-2">{course?.semester}</td>
                        <td className="p-2">{course?.code}</td>
                        <td className="p-2">{course?.title}</td>
                        <td className="p-2">{item.grade}</td>
                        <td className="p-2">{item.marks}</td>
                        <td className="p-2">
                          <button
                            className="text-red-500 hover:underline"
                            onClick={() => handleViewCourseDetails(course)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-500">
                      No grades found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4 text-gray-600">
            <span>
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredGrades.length)} of {filteredGrades.length} entries
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 bg-gray-200 rounded disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              <span>{page}</span>
              <button
                disabled={page === maxPage}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 bg-gray-200 rounded disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Section */}
      {activeTab === "attendance" && (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Search attendance..."
              className="bg-white border rounded p-2 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center"
              onClick={handleExport}
            >
              <Download size={16} className="mr-2" /> Export Attendance
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow mb-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-2">Semester</th>
                  <th className="p-2">Code</th>
                  <th className="p-2">Title</th>
                  <th className="p-2">Attendance (%)</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedAttendance.length > 0 ? (
                  pagedAttendance.map((item) => {
                    const course = courses.find((c) => c.id === item.id);
                    return (
                      <tr key={item.id} className="border-b hover:bg-gray-100">
                        <td className="p-2">{course?.semester}</td>
                        <td className="p-2">{course?.code}</td>
                        <td className="p-2">{course?.title}</td>
                        <td className="p-2">{item.attendance}%</td>
                        <td className="p-2">
                          <button
                            className="text-red-500 hover:underline"
                            onClick={() => handleViewCourseDetails(course)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500">
                      No attendance records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4 text-gray-600">
            <span>
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredAttendance.length)} of {filteredAttendance.length} entries
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 bg-gray-200 rounded disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              <span>{page}</span>
              <button
                disabled={page === maxPage}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 bg-gray-200 rounded disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assignments Section */}
      {activeTab === "assignments" && (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Search assignments..."
              className="bg-white border rounded p-2 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center"
              onClick={handleExport}
            >
              <Download size={16} className="mr-2" /> Export Assignments
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow mb-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-2">Semester</th>
                  <th className="p-2">Code</th>
                  <th className="p-2">Title</th>
                  <th className="p-2">Assignments</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedAssignments.length > 0 ? (
                  pagedAssignments.map((item) => {
                    const course = courses.find((c) => c.id === item.id);
                    return (
                      <tr key={item.id} className="border-b hover:bg-gray-100">
                        <td className="p-2">{course?.semester}</td>
                        <td className="p-2">{course?.code}</td>
                        <td className="p-2">{course?.title}</td>
                        <td className="p-2">{item.assignments.map((a) => a.title).join(", ")}</td>
                        <td className="p-2">
                          <button
                            className="text-red-500 hover:underline"
                            onClick={() => handleViewCourseDetails(course)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500">
                      No assignments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4 text-gray-600">
            <span>
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredAssignments.length)} of {filteredAssignments.length} entries
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 bg-gray-200 rounded disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              <span>{page}</span>
              <button
                disabled={page === maxPage}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 bg-gray-200 rounded disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exams Section */}
      {activeTab === "exams" && (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Search exams..."
              className="bg-white border rounded p-2 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center"
              onClick={handleExport}
            >
              <Download size={16} className="mr-2" /> Export Exams
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow mb-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-2">Semester</th>
                  <th className="p-2">Code</th>
                  <th className="p-2">Title</th>
                  <th className="p-2">Exams</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedExams.length > 0 ? (
                  pagedExams.map((item) => {
                    const course = courses.find((c) => c.id === item.id);
                    return (
                      <tr key={item.id} className="border-b hover:bg-gray-100">
                        <td className="p-2">{course?.semester}</td>
                        <td className="p-2">{course?.code}</td>
                        <td className="p-2">{course?.title}</td>
                        <td className="p-2">{item.exams.map((e) => e.title).join(", ")}</td>
                        <td className="p-2">
                          <button
                            className="text-red-500 hover:underline"
                            onClick={() => handleViewCourseDetails(course)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500">
                      No exams found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4 text-gray-600">
            <span>
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredExams.length)} of {filteredExams.length} entries
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 bg-gray-200 rounded disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              <span>{page}</span>
              <button
                disabled={page === maxPage}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 bg-gray-200 rounded disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Certificates Section */}
      {activeTab === "certificates" && (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Search certificates..."
              className="bg-white border rounded p-2 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center"
              onClick={handleExport}
            >
              <Download size={16} className="mr-2" /> Export Certificates
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow mb-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-2">Title</th>
                  <th className="p-2">Issued Date</th>
                  <th className="p-2">Issuer</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedCertificates.length > 0 ? (
                  pagedCertificates.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-100">
                      <td className="p-2">{item.title}</td>
                      <td className="p-2">{item.issuedDate}</td>
                      <td className="p-2">{item.issuer}</td>
                      <td className="p-2">
                        <button
                          className="text-red-500 hover:underline"
                          onClick={() => console.log("Downloading certificate:", item.id)}
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-500">
                      No certificates found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4 text-gray-600">
            <span>
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredCertificates.length)} of {filteredCertificates.length} entries
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 bg-gray-200 rounded disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              <span>{page}</span>
              <button
                disabled={page === maxPage}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 bg-gray-200 rounded disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Career Section */}
      {activeTab === "career" && (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Search career resources..."
              className="bg-white border rounded p-2 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center"
              onClick={handleExport}
            >
              <Download size={16} className="mr-2" /> Export Career Resources
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow mb-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-2">Title</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedCareerResources.length > 0 ? (
                  pagedCareerResources.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-100">
                      <td className="p-2">{item.title}</td>
                      <td className="p-2">{item.date}</td>
                      <td className="p-2">
                        <button
                          className="text-red-500 hover:underline"
                          onClick={() => console.log("Viewing career resource:", item.id)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-4 text-center text-gray-500">
                      No career resources found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4 text-gray-600">
            <span>
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredCareerResources.length)} of {filteredCareerResources.length} entries
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 bg-gray-200 rounded disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              <span>{page}</span>
              <button
                disabled={page === maxPage}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 bg-gray-200 rounded disabled:opacity-50"
              >
                <ChevronRight size={16} />
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
              placeholder="Search progress..."
              className="bg-white border rounded p-2 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center"
              onClick={handleExport}
            >
              <Download size={16} className="mr-2" /> Export Progress
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow mb-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-2">Semester</th>
                  <th className="p-2">Code</th>
                  <th className="p-2">Title</th>
                  <th className="p-2">Completion (%)</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedProgress.length > 0 ? (
                  pagedProgress.map((item) => {
                    const course = courses.find((c) => c.id === item.id);
                    return (
                      <tr key={item.id} className="border-b hover:bg-gray-100">
                        <td className="p-2">{course?.semester}</td>
                        <td className="p-2">{course?.code}</td>
                        <td className="p-2">{course?.title}</td>
                        <td className="p-2">{item.completion}%</td>
                        <td className="p-2">
                          <button
                            className="text-red-500 hover:underline"
                            onClick={() => handleViewCourseDetails(course)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500">
                      No progress data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4 text-gray-600">
            <span>
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredProgress.length)} of {filteredProgress.length} entries
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 bg-gray-200 rounded disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              <span>{page}</span>
              <button
                disabled={page === maxPage}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 bg-gray-200 rounded disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Section */}
      {activeTab === "feedback" && (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Search feedback..."
              className="bg-white border rounded p-2 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center"
              onClick={handleExport}
            >
              <Download size={16} className="mr-2" /> Export Feedback
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow mb-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-2">Semester</th>
                  <th className="p-2">Code</th>
                  <th className="p-2">Title</th>
                  <th className="p-2">Feedback</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedFeedback.length > 0 ? (
                  pagedFeedback.map((item) => {
                    const course = courses.find((c) => c.id === item.id);
                    return (
                      <tr key={item.id} className="border-b hover:bg-gray-100">
                        <td className="p-2">{course?.semester}</td>
                        <td className="p-2">{course?.code}</td>
                        <td className="p-2">{course?.title}</td>
                        <td className="p-2">{item.feedback}</td>
                        <td className="p-2">
                          <button
                            className="text-red-500 hover:underline"
                            onClick={() => console.log("Editing feedback for course:", item.id)}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500">
                      No feedback found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4 text-gray-600">
            <span>
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredFeedback.length)} of {filteredFeedback.length} entries
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 bg-gray-200 rounded disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              <span>{page}</span>
              <button
                disabled={page === maxPage}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 bg-gray-200 rounded disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Virtual Labs Section */}
      {activeTab === "virtuallabs" && (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Search virtual labs..."
              className="bg-white border rounded p-2 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center"
              onClick={handleExport}
            >
              <Download size={16} className="mr-2" /> Export Labs
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow mb-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-2">Semester</th>
                  <th className="p-2">Code</th>
                  <th className="p-2">Title</th>
                  <th className="p-2">Labs</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedVirtualLabs.length > 0 ? (
                  pagedVirtualLabs.map((item) => {
                    const course = courses.find((c) => c.id === item.id);
                    return (
                      <tr key={item.id} className="border-b hover:bg-gray-100">
                        <td className="p-2">{course?.semester}</td>
                        <td className="p-2">{course?.code}</td>
                        <td className="p-2">{course?.title}</td>
                        <td className="p-2">{item.labs.join(", ")}</td>
                        <td className="p-2">
                          <button
                            className="text-red-500 hover:underline"
                            onClick={() => handleAccessLab(item.labs[0])}
                          >
                            Access
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500">
                      No virtual labs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4 text-gray-600">
            <span>
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredVirtualLabs.length)} of {filteredVirtualLabs.length} entries
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 bg-gray-200 rounded disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              <span>{page}</span>
              <button
                disabled={page === maxPage}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 bg-gray-200 rounded disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Section */}
      {activeTab === "recommendations" && (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Search recommendations..."
              className="bg-white border rounded p-2 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center"
              onClick={handleExport}
            >
              <Download size={16} className="mr-2" /> Export Recommendations
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow mb-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-2">Semester</th>
                  <th className="p-2">Code</th>
                  <th className="p-2">Title</th>
                  <th className="p-2">Recommendations</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedRecommendations.length > 0 ? (
                  pagedRecommendations.map((item) => {
                    const course = courses.find((c) => c.id === item.id);
                    return (
                      <tr key={item.id} className="border-b hover:bg-gray-100">
                        <td className="p-2">{course?.semester}</td>
                        <td className="p-2">{course?.code}</td>
                        <td className="p-2">{course?.title}</td>
                        <td className="p-2">{item.recommendations.join(", ")}</td>
                        <td className="p-2">
                          <button
                            className="text-red-500 hover:underline"
                            onClick={() => handleViewCourseDetails(course)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500">
                      No recommendations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4 text-gray-600">
            <span>
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredRecommendations.length)} of {filteredRecommendations.length} entries
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 bg-gray-200 rounded disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              <span>{page}</span>
              <button
                disabled={page === maxPage}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 bg-gray-200 rounded disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Section */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
              <PieChart size={20} className="mr-2 text-red-900" /> Grade Distribution
            </h3>
            <Pie data={gradeDistributionData} options={{ plugins: { zoom: { zoom: { mode: 'xy' } } } }} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
              <Line size={20} className="mr-2 text-red-900" /> Performance Trend
            </h3>
            <Line data={performanceTrendData} options={{ plugins: { zoom: { zoom: { mode: 'x' } }, filler: { propagate: true } } }} />
          </div>
        </div>
      )}

      {/* AI Predictions Tab */}
      {activeTab === "aipredictions" && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
            <Bot size={20} className="mr-2 text-red-900" /> AI Performance Predictions
          </h3>
          <p className="text-gray-600 mb-4">AI-driven predictions for your academic performance.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-md font-medium mb-2">Predicted vs Actual Marks</h4>
              <Bar data={aiPredictionData} options={{ plugins: { zoom: { zoom: { mode: 'y' } } } }} />
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}