import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Upload, Edit, Download, Plus, Search, Calendar, AlertTriangle, BarChart2, PieChart, FileText, Users, Bot, TrendingUp } from "lucide-react";
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

// Register Chart.js components with advanced features (zoom, filler for area charts)
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, zoomPlugin, Filler);

// JECRC University branding colors
const jecrcColors = {
  primary: "#1E3A8A", // Blue
  secondary: "#10B981", // Green
  accent: "#F59E0B", // Yellow
  danger: "#EF4444", // Red
  neutral: "#6B7280", // Gray
};

// Dummy data tailored for JECRC University
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

const initialTimetable = [
  { id: "1", school: "School of Engineering & Technology", branch: "Computer Science", exam: "Midterm", date: "2025-10-15", time: "10:00 AM", subject: "CS101", class: "CSE-A" },
  { id: "2", school: "School of Sciences", branch: "Physics", exam: "Final", date: "2025-12-20", time: "09:00 AM", subject: "PHY101", class: "PHY-B" },
  { id: "3", school: "School of Engineering & Technology", branch: "Mechanical", exam: "Midterm", date: "2025-10-16", time: "11:00 AM", subject: "ME101", class: "ME-C" },
  { id: "4", school: "School of Law", branch: "LLB", exam: "Final", date: "2025-12-21", time: "10:00 AM", subject: "LLB101", class: "LLB-D" },
  { id: "5", school: "School of Business", branch: "BBA", exam: "Midterm", date: "2025-10-17", time: "09:00 AM", subject: "BBA101", class: "BBA-A" },
  { id: "6", school: "School of Design", branch: "B.Des", exam: "Final", date: "2025-12-22", time: "11:00 AM", subject: "BD101", class: "BD-B" },
  { id: "7", school: "School of Humanities & Social Sciences", branch: "BA", exam: "Midterm", date: "2025-10-18", time: "10:00 AM", subject: "BA101", class: "BA-C" },
  { id: "8", school: "School of Allied Health Sciences", branch: "B.Sc Nursing", exam: "Final", date: "2025-12-23", time: "09:00 AM", subject: "NUR101", class: "NUR-D" },
  { id: "9", school: "School of Computer Applications", branch: "BCA", exam: "Midterm", date: "2025-10-19", time: "11:00 AM", subject: "BCA101", class: "BCA-A" },
  { id: "10", school: "School of Sciences", branch: "Chemistry", exam: "Final", date: "2025-12-24", time: "10:00 AM", subject: "CHE101", class: "CHE-B" },
  { id: "11", school: "School of Engineering & Technology", branch: "Civil", exam: "Midterm", date: "2025-10-20", time: "09:00 AM", subject: "CE101", class: "CE-C" },
  { id: "12", school: "School of Law", branch: "LLM", exam: "Final", date: "2025-12-25", time: "11:00 AM", subject: "LLM101", class: "LLM-D" },
];

const initialUpdates = [
  { id: "1", school: "School of Engineering & Technology", branch: "Computer Science", title: "Exam Postponed", date: "2025-09-10", content: "CS101 Midterm postponed to Oct 20." },
  { id: "2", school: "School of Sciences", branch: "Physics", title: "Result Declaration", date: "2025-09-15", content: "Final results for PHY101 declared." },
];

const initialResults = [
  { id: "1", school: "School of Engineering & Technology", branch: "Computer Science", student: "Aarav Sharma", exam: "Midterm", subject: "CS101", marks: 85, grade: "A" },
  { id: "2", school: "School of Sciences", branch: "Physics", student: "Diya Patel", exam: "Midterm", subject: "PHY101", marks: 78, grade: "B" },
];

const initialRevaluationRequests = [
  { id: "1", school: "School of Engineering & Technology", branch: "Computer Science", student: "Rohan Gupta", exam: "Midterm", subject: "CS101", status: "Pending" },
  { id: "2", school: "School of Sciences", branch: "Physics", student: "Priya Singh", exam: "Final", subject: "PHY101", status: "Approved" },
];

const initialTopPerformers = [
  { rank: 1, school: "School of Engineering & Technology", branch: "Computer Science", student: "Aarav Sharma", marks: 95, subject: "CS101" },
  { rank: 2, school: "School of Sciences", branch: "Physics", student: "Diya Patel", marks: 92, subject: "PHY101" },
];

const initialIndividualStudentRecords = [
  { id: "1", student: "Aarav Sharma", school: "School of Engineering & Technology", branch: "Computer Science", examHistory: [{ exam: "Midterm", marks: 85, grade: "A" }, { exam: "Final", marks: 90, grade: "A+" }] },
  { id: "2", student: "Diya Patel", school: "School of Sciences", branch: "Physics", examHistory: [{ exam: "Midterm", marks: 78, grade: "B" }, { exam: "Final", marks: 85, grade: "A" }] },
];

export default function Examination() {
  const [activeTab, setActiveTab] = useState("timetable");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [timetable, setTimetable] = useState(initialTimetable);
  const [updates, setUpdates] = useState(initialUpdates);
  const [results, setResults] = useState(initialResults);
  const [revaluationRequests, setRevaluationRequests] = useState(initialRevaluationRequests);
  const [topPerformers] = useState(initialTopPerformers);
  const [individualRecords] = useState(initialIndividualStudentRecords);
  
  // AI Feature States
  const [aiPredictions, setAiPredictions] = useState([]);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [hallTickets, setHallTickets] = useState([]);
  const [anomalyDetections, setAnomalyDetections] = useState([]);
  const [branchComparisons, setBranchComparisons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const rowsPerPage = 5;

  // Advanced Charts Data
  const passFailRateData = {
    labels: ["Pass", "Fail"],
    datasets: [
      {
        data: [85, 15],
        backgroundColor: [jecrcColors.secondary, jecrcColors.danger],
      },
    ],
  };

  const gradeDistributionData = {
    labels: ["A+", "A", "B", "C", "D", "F"],
    datasets: [
      {
        label: "Students",
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

  const branchComparisonData = {
    labels: jecrcBranches[selectedSchool] || [],
    datasets: [
      {
        label: "Average Marks",
        data: [85, 88, 82, 90, 87],
        backgroundColor: jecrcColors.primary,
      },
    ],
  };

  // Filters based on school and branch
  const filterData = (data) => {
    return data.filter((item) => 
      (selectedSchool ? item.school === selectedSchool : true) &&
      (selectedBranch ? item.branch === selectedBranch : true) &&
      (searchTerm ? Object.values(item).some((val) => val.toString().toLowerCase().includes(searchTerm.toLowerCase())) : true)
    );
  };

  const filteredTimetable = filterData(timetable);
  const filteredUpdates = filterData(updates);
  const filteredResults = filterData(results);
  const filteredRequests = filterData(revaluationRequests);
  const filteredTopPerformers = filterData(topPerformers);
  const filteredIndividualRecords = filterData(individualRecords);

  const pagedTimetable = filteredTimetable.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pagedUpdates = filteredUpdates.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pagedResults = filteredResults.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pagedRequests = filteredRequests.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pagedTopPerformers = filteredTopPerformers.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pagedIndividualRecords = filteredIndividualRecords.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const maxPage = Math.ceil(filteredTimetable.length / rowsPerPage);

  const handleUploadTimetable = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Uploading timetable:", file.name);
      setTimetable((prev) => [...prev, { id: Date.now().toString(), school: selectedSchool, branch: selectedBranch, exam: "New Exam", date: new Date().toISOString().split("T")[0], time: "10:00 AM", subject: file.name, class: "All" }]);
    }
  };

  const handleAddUpdate = () => {
    setUpdates((prev) => [...prev, { id: Date.now().toString(), school: selectedSchool, branch: selectedBranch, title: "New Update", date: new Date().toISOString().split("T")[0], content: "Enter content here." }]);
  };

  const handleUploadResult = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Uploading result:", file.name);
      setResults((prev) => [...prev, { id: Date.now().toString(), school: selectedSchool, branch: selectedBranch, student: "New Student", exam: "New Exam", subject: file.name, marks: 0, grade: "N/A" }]);
    }
  };

  const handleExport = () => {
    console.log("Exporting data to PDF with JECRC branding...");
  };

  const handleEdit = (id) => {
    console.log("Editing item:", id);
  };

  const handleGenerateHallTicket = (studentId) => {
    const newHallTicket = {
      id: Date.now(),
      studentId: studentId,
      hallTicketNumber: `HT${Date.now().toString().slice(-6)}`,
      qrCode: `QR_${studentId}_${Date.now()}`,
      generatedDate: new Date().toLocaleDateString(),
      status: 'Generated'
    };
    setHallTickets(prev => [...prev, newHallTicket]);
    alert(`Hall Ticket Generated!\nHall Ticket No: ${newHallTicket.hallTicketNumber}\nQR Code: ${newHallTicket.qrCode}`);
  };

  const handleApproveRevaluation = (requestId) => {
    const feeCalculation = Math.floor(Math.random() * 500) + 200; // Random fee between 200-700
    setRevaluationRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: 'Approved', fee: feeCalculation } : req
      )
    );
    alert(`Revaluation Request Approved!\nRequest ID: ${requestId}\nFee: ₹${feeCalculation}`);
  };

  const handlePredictPerformance = (studentId) => {
    setIsProcessingAI(true);
    // Simulate AI processing
    setTimeout(() => {
      const prediction = {
        studentId: studentId,
        currentAverage: Math.floor(Math.random() * 20) + 70, // 70-90
        predictedScore: Math.floor(Math.random() * 20) + 75, // 75-95
        confidenceLevel: Math.floor(Math.random() * 30) + 70, // 70-100%
        riskFactors: [
          'Attendance below 80%',
          'Previous subject correlation',
          'Assignment completion rate'
        ][Math.floor(Math.random() * 3)],
        recommendations: [
          'Focus on practical sessions',
          'Additional tutoring recommended',
          'Peer study groups beneficial'
        ]
      };
      setAiPredictions(prev => [...prev, prediction]);
      setIsProcessingAI(false);
      alert(`AI Prediction Complete!\nPredicted Score: ${prediction.predictedScore}%\nConfidence: ${prediction.confidenceLevel}%`);
    }, 3000);
  };
  
  const runAIPredictionModel = () => {
    setIsProcessingAI(true);
    setTimeout(() => {
      const branchPredictions = [
        { branch: 'Computer Science', predicted: 88, actual: 85, accuracy: 96 },
        { branch: 'Mechanical', predicted: 82, actual: 84, accuracy: 98 },
        { branch: 'Civil', predicted: 79, actual: 78, accuracy: 99 },
        { branch: 'Electronics', predicted: 86, actual: 83, accuracy: 97 }
      ];
      setBranchComparisons(branchPredictions);
      
      const anomalies = [
        { student: 'John Doe', expected: 85, actual: 65, deviation: -20, subject: 'Mathematics' },
        { student: 'Jane Smith', expected: 75, actual: 92, deviation: +17, subject: 'Physics' }
      ];
      setAnomalyDetections(anomalies);
      setIsProcessingAI(false);
    }, 4000);
  };
  
  const generateComparativeReport = () => {
    const reportData = {
      totalStudents: filteredResults.length,
      averagePerformance: Math.floor(Math.random() * 20) + 70,
      topBranch: selectedSchool ? jecrcBranches[selectedSchool]?.[0] : 'Computer Science',
      improvementAreas: ['Mathematics', 'Physics', 'Chemistry'],
      reportId: `RPT_${Date.now()}`,
      generatedDate: new Date().toLocaleDateString()
    };
    alert(`Comparative Report Generated!\nReport ID: ${reportData.reportId}\nAverage Performance: ${reportData.averagePerformance}%\nTop Branch: ${reportData.topBranch}`);
  };

  const handleViewStudentRecord = (student) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedStudent(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex items-center mb-6">
        <img src="/image.png" alt="JECRC University Logo" className="w-20 h-8 mr-4" />
        <h2 className="text-2xl font-semibold" style={{ color: `var(--text)` }} > Examination Management</h2>
      </div>

      {/* School and Branch Filters */}
      <div className="flex items-center gap-4 mb-6">
        <select
          className="bg-white border border-gray-300 rounded p-2 w-full md:w-64"
          value={selectedSchool}
          onChange={(e) => {
            setSelectedSchool(e.target.value);
            setSelectedBranch("");
          }}
        >
          <option value="">All Schools</option>
          {jecrcSchools.map((school) => (
            <option key={school} value={school}>{school}</option>
          ))}
        </select>
        <select
          className="bg-white border border-gray-300 rounded p-2 w-full md:w-64"
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          disabled={!selectedSchool}
        >
          <option value="">All Branches</option>
          {(jecrcBranches[selectedSchool] || []).map((branch) => (
            <option key={branch} value={branch}>{branch}</option>
          ))}
        </select>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6 overflow-x-auto">
        {["timetable", "updates", "results", "analytics", "revaluation", "halltickets", "topperformers", "calendar", "studentrecords", "aipredictions", "branchcomparison"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg ${activeTab === tab ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"} whitespace-nowrap flex items-center gap-2`}
          >
            {tab === "aipredictions" && <Bot size={16} />}
            {tab === "branchcomparison" && <BarChart2 size={16} />} {/* Replaced Compare with BarChart2 */}
            {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, " $1").trim()}
          </button>
        ))}
      </div>

      {/* Modal for Individual Student Records */}
      {modalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl w-3/4 max-w-4xl p-6 relative">
            <button onClick={closeModal} className="absolute top-2 right-2 text-xl text-gray-400 hover:text-red-400">&times;</button>
            <h2 className="text-xl font-bold mb-4 text-red-900">{selectedStudent.student} - Exam History</h2>
            <table className="w-full text-left text-sm mb-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">Exam</th>
                  <th className="p-2">Marks</th>
                  <th className="p-2">Grade</th>
                </tr>
              </thead>
              <tbody>
                {selectedStudent.examHistory.map((exam, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{exam.exam}</td>
                    <td className="p-2">{exam.marks}</td>
                    <td className="p-2">{exam.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Performance Trend</h3>
              <Line data={{
                labels: selectedStudent.examHistory.map((h) => h.exam),
                datasets: [
                  {
                    label: "Marks",
                    data: selectedStudent.examHistory.map((h) => h.marks),
                    borderColor: jecrcColors.primary,
                    fill: true,
                    backgroundColor: "rgba(30, 58, 138, 0.2)",
                  },
                ],
              }} options={{ plugins: { zoom: { zoom: { mode: 'x' } } } }} />
            </div>
            <div className="flex gap-3 mt-4">
              <button
                className={`px-4 py-2 rounded flex items-center ${
                  isProcessingAI ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600'
                }`}
                onClick={() => handlePredictPerformance(selectedStudent.id)}
                disabled={isProcessingAI}
              >
                <Bot size={16} className="mr-2" /> 
                {isProcessingAI ? 'Generating Prediction...' : 'AI Predict Future Performance'}
              </button>
              {isProcessingAI && (
                <div className="flex items-center text-blue-600">
                  <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                  Analyzing student data...
                </div>
              )}
            </div>
            
            {/* Display latest prediction for this student */}
            {aiPredictions.filter(p => p.studentId === selectedStudent.id).slice(-1).map((prediction, index) => (
              <div key={index} className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">🤖 Latest AI Prediction</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Performance Metrics</h5>
                    <div className="space-y-1 text-sm">
                      <p>Current Average: <span className="font-medium">{prediction.currentAverage}%</span></p>
                      <p>Predicted Score: <span className="font-medium text-blue-600">{prediction.predictedScore}%</span></p>
                      <p>Confidence Level: <span className="font-medium text-green-600">{prediction.confidenceLevel}%</span></p>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">AI Recommendations</h5>
                    <ul className="text-sm text-gray-600">
                      {prediction.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start mb-1">
                          <span className="text-green-500 mr-1">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {prediction.riskFactors && (
                  <div className="mt-3 p-3 bg-orange-100 rounded">
                    <p className="text-sm"><strong>Risk Factor:</strong> <span className="text-orange-700">{prediction.riskFactors}</span></p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timetable Section */}
      {activeTab === "timetable" && (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <label className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-500 cursor-pointer flex items-center">
              <Upload size={16} className="mr-2" />
              Upload Timetable
              <input type="file" className="hidden" onChange={handleUploadTimetable} accept=".pdf,.csv,.xlsx" />
            </label>
            <input
              type="text"
              placeholder="Search by exam or subject..."
              className="bg-white border rounded p-2 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
              onClick={handleExport}
            >
              <Download size={16} className="mr-2" /> Export Timetable (PDF with JECRC Branding)
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow mb-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-2">School</th>
                  <th className="p-2">Branch</th>
                  <th className="p-2">Exam</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Time</th>
                  <th className="p-2">Subject</th>
                  <th className="p-2">Class</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedTimetable.length > 0 ? (
                  pagedTimetable.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-100">
                      <td className="p-2">{item.school}</td>
                      <td className="p-2">{item.branch}</td>
                      <td className="p-2">{item.exam}</td>
                      <td className="p-2">{item.date}</td>
                      <td className="p-2">{item.time}</td>
                      <td className="p-2">{item.subject}</td>
                      <td className="p-2">{item.class}</td>
                      <td className="p-2">
                        <button
                          className="text-red-500 hover:underline mr-2"
                          onClick={() => handleEdit(item.id)}
                        >
                          <Edit size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="p-4 text-center text-gray-500">
                      No timetable entries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4 text-gray-600">
            <span>
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredTimetable.length)} of {filteredTimetable.length} entries
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

      {/* Updates Section */}
      {activeTab === "updates" && (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
              onClick={handleAddUpdate}
            >
              <Plus size={16} className="mr-2" /> Add Update
            </button>
            <input
              type="text"
              placeholder="Search updates..."
              className="bg-white border rounded p-2 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-500 flex items-center
"
              onClick={handleExport}
            >
              <Download size={16} className="mr-2" /> Export Updates (PDF with JECRC Branding)
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow mb-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-2">School</th>
                  <th className="p-2">Branch</th>
                  <th className="p-2">Title</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Content</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedUpdates.length > 0 ? (
                  pagedUpdates.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-100">
                      <td className="p-2">{item.school}</td>
                      <td className="p-2">{item.branch}</td>
                      <td className="p-2">{item.title}</td>
                      <td className="p-2">{item.date}</td>
                      <td className="p-2">{item.content}</td>
                      <td className="p-2">
                        <button
                          className="text-red-500 hover:underline mr-2"
                          onClick={() => handleEdit(item.id)}
                        >
                          <Edit size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-500">
                      No updates found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4 text-gray-600">
            <span>
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredUpdates.length)} of {filteredUpdates.length} entries
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

      {/* Results Section */}
      {activeTab === "results" && (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <label className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-500 cursor-pointer flex items-center">
              <Upload size={16} className="mr-2" />
              Upload Results
              <input type="file" className="hidden" onChange={handleUploadResult} accept=".csv,.xlsx" />
            </label>
            <input
              type="text"
              placeholder="Search by student or subject..."
              className="bg-white border rounded p-2 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
              onClick={handleExport}
            >
              <Download size={16} className="mr-2" /> Export Results (PDF with JECRC Branding)
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow mb-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-2">School</th>
                  <th className="p-2">Branch</th>
                  <th className="p-2">Student</th>
                  <th className="p-2">Exam</th>
                  <th className="p-2">Subject</th>
                  <th className="p-2">Marks</th>
                  <th className="p-2">Grade</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedResults.length > 0 ? (
                  pagedResults.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-100">
                      <td className="p-2">{item.school}</td>
                      <td className="p-2">{item.branch}</td>
                      <td className="p-2">{item.student}</td>
                      <td className="p-2">{item.exam}</td>
                      <td className="p-2">{item.subject}</td>
                      <td className="p-2">{item.marks}</td>
                      <td className="p-2">{item.grade}</td>
                      <td className="p-2">
                        <button
                          className="text-red-500 hover:underline mr-2"
                          onClick={() => handleEdit(item.id)}
                        >
                          <Edit size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="p-4 text-center text-gray-500">
                      No results found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4 text-gray-600">
            <span>
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredResults.length)} of {filteredResults.length} entries
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
          {passFailRateData && passFailRateData.labels && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                <BarChart2 size={20} className="mr-2 text-red-900" /> Pass/Fail Rate
              </h3>
              <Pie data={passFailRateData} options={{ plugins: { zoom: { zoom: { mode: 'xy' } } } }} />
            </div>
          )}
          {gradeDistributionData && gradeDistributionData.labels && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                <PieChart size={20} className="mr-2 text-red-900" /> Grade Distribution
              </h3>
              <Bar data={gradeDistributionData} options={{ plugins: { zoom: { zoom: { mode: 'x' } } } }} />
            </div>
          )}
          {performanceTrendData && performanceTrendData.labels && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                <Line size={20} className="mr-2 text-red-900" /> Performance Trend
              </h3>
              <Line data={performanceTrendData} options={{ plugins: { zoom: { zoom: { mode: 'xy' } }, filler: { propagate: true } } }} />
            </div>
          )}
        </div>
      )}

      {/* Revaluation Requests Section */}
      {activeTab === "revaluation" && (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Search requests..."
              className="bg-white border rounded p-2 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
              onClick={handleExport}
            >
              <Download size={16} className="mr-2" /> Export Requests (PDF with JECRC Branding)
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow mb-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-2">School</th>
                  <th className="p-2">Branch</th>
                  <th className="p-2">Student</th>
                  <th className="p-2">Exam</th>
                  <th className="p-2">Subject</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedRequests.length > 0 ? (
                  pagedRequests.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-100">
                      <td className="p-2">{item.school}</td>
                      <td className="p-2">{item.branch}</td>
                      <td className="p-2">{item.student}</td>
                      <td className="p-2">{item.exam}</td>
                      <td className="p-2">{item.subject}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-white ${item.status === "Pending" ? "bg-yellow-500" : "bg-green-500"}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-2">
                        <button
                          className="text-green-500 hover:underline mr-2"
                          onClick={() => handleApproveRevaluation(item.id)}
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500">
                      No revaluation requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4 text-gray-600">
            <span>
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredRequests.length)} of {filteredRequests.length} entries
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

      {/* Hall Tickets Section */}
      {activeTab === "halltickets" && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-4 mb-4">
              <input
                type="text"
                placeholder="Search by student..."
                className="bg-white border rounded p-2 w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center"
                onClick={handleExport}
              >
                <Download size={16} className="mr-2" /> Export All Hall Tickets
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-red-500 text-white">
                    <th className="p-2">School</th>
                    <th className="p-2">Branch</th>
                    <th className="p-2">Student</th>
                    <th className="p-2">Exam</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((item) => {
                    const hasTicket = hallTickets.find(ticket => ticket.studentId === item.student);
                    return (
                      <tr key={item.id} className="border-b hover:bg-gray-100">
                        <td className="p-2">{item.school}</td>
                        <td className="p-2">{item.branch}</td>
                        <td className="p-2">{item.student}</td>
                        <td className="p-2">{item.exam}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            hasTicket ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {hasTicket ? 'Generated' : 'Pending'}
                          </span>
                        </td>
                        <td className="p-2">
                          <button
                            className="text-red-500 hover:underline mr-2"
                            onClick={() => handleGenerateHallTicket(item.student)}
                            title="Generate Hall Ticket"
                          >
                            <Download size={16} />
                          </button>
                          {hasTicket && (
                            <span className="text-xs text-green-600 ml-2">
                              #{hasTicket.hallTicketNumber}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-between mt-4 text-gray-600">
              <span>
                Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredResults.length)} of {filteredResults.length} entries
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
          
          {/* Generated Hall Tickets Summary */}
          {hallTickets.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold mb-4">🎫 Recently Generated Hall Tickets</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hallTickets.slice(-6).map((ticket, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border">
                    <h5 className="font-medium text-gray-800 mb-2">{ticket.studentId}</h5>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Hall Ticket: <span className="font-medium text-blue-600">{ticket.hallTicketNumber}</span></p>
                      <p>QR Code: <span className="font-mono text-xs">{ticket.qrCode}</span></p>
                      <p>Generated: <span className="font-medium">{ticket.generatedDate}</span></p>
                      <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs mt-2">
                        {ticket.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 bg-white p-4 rounded-lg border">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{hallTickets.length}</div>
                    <div className="text-sm text-gray-600">Total Generated</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round((hallTickets.length / filteredResults.length) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Completion Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {filteredResults.length - hallTickets.length}
                    </div>
                    <div className="text-sm text-gray-600">Pending</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Top Performers Section */}
      {activeTab === "topperformers" && (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Search performers..."
              className="bg-white border rounded p-2 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-500 flex items-center
"
              onClick={handleExport}
            >
              <Download size={16} className="mr-2" /> Export Top Performers (PDF with JECRC Branding)
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow mb-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-2">Rank</th>
                  <th className="p-2">School</th>
                  <th className="p-2">Branch</th>
                  <th className="p-2">Student</th>
                  <th className="p-2">Marks</th>
                  <th className="p-2">Subject</th>
                </tr>
              </thead>
              <tbody>
                {pagedTopPerformers.length > 0 ? (
                  pagedTopPerformers.map((item) => (
                    <tr key={item.rank} className="border-b hover:bg-gray-100">
                      <td className="p-2">{item.rank}</td>
                      <td className="p-2">{item.school}</td>
                      <td className="p-2">{item.branch}</td>
                      <td className="p-2">{item.student}</td>
                      <td className="p-2">{item.marks}</td>
                      <td className="p-2">{item.subject}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-500">
                      No top performers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4 text-gray-600">
            <span>
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredTopPerformers.length)} of {filteredTopPerformers.length} entries
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

      {/* Calendar Section */}
      {activeTab === "calendar" && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
            <Calendar size={20} className="mr-2 text-red-900" /> JECRC Exam Schedule Calendar
          </h3>
          <p className="text-gray-600 mb-4">Interactive calendar view (integrate with react-big-calendar for full functionality).</p>
          <ul className="mt-4 space-y-2">
            {filteredTimetable.slice(0, 5).map((item) => (
              <li key={item.id} className="flex items-center text-sm text-gray-700">
                <AlertTriangle size={16} className="mr-2 text-yellow-500" /> {item.date}: {item.exam} - {item.subject} ({item.time}) - {item.branch}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Student Records Tab */}
      {activeTab === "studentrecords" && (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by student name or ID..."
              className="bg-white border rounded p-2 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-500 flex items-center
"
              onClick={handleExport}
            >
              <Download size={16} className="mr-2" /> Export Student Records
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow mb-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-2">Student</th>
                  <th className="p-2">School</th>
                  <th className="p-2">Branch</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedIndividualRecords.length > 0 ? (
                  pagedIndividualRecords.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-100">
                      <td className="p-2">{item.student}</td>
                      <td className="p-2">{item.school}</td>
                      <td className="p-2">{item.branch}</td>
                      <td className="p-2">
                        <button
                          className="text-red-500 hover:underline"
                          onClick={() => handleViewStudentRecord(item)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-500">
                      No student records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4 text-gray-600">
            <span>
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredIndividualRecords.length)} of {filteredIndividualRecords.length} entries
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

      {/* AI Predictions Tab */}
      {activeTab === "aipredictions" && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
              <Bot size={20} className="mr-2 text-red-900" /> AI Performance Predictions System
            </h3>
            <p className="text-gray-600 mb-4">AI-driven predictions based on historical data, anomaly detection for performance drops, and personalized recommendations.</p>
            
            <div className="flex gap-4 mb-6">
              <button
                className={`px-4 py-2 rounded flex items-center ${isProcessingAI ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600'}`}
                onClick={runAIPredictionModel}
                disabled={isProcessingAI}
              >
                <TrendingUp size={16} className="mr-2" /> 
                {isProcessingAI ? 'Processing AI Model...' : 'Run AI Prediction Analysis'}
              </button>
              {isProcessingAI && (
                <div className="flex items-center text-blue-600">
                  <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                  Analyzing student performance data...
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-medium mb-2">Predicted vs Actual Performance</h4>
                <Bar data={aiPredictionData} options={{ plugins: { zoom: { zoom: { mode: 'y' } } } }} />
              </div>
              <div>
                <h4 className="text-md font-medium mb-2">Performance Trend Analysis</h4>
                <Line data={performanceTrendData} options={{ plugins: { filler: { propagate: true } } }} />
              </div>
            </div>
          </div>
          
          {/* Branch Comparison Results */}
          {branchComparisons.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                🎯 AI Prediction Results
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {branchComparisons.map((branch, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border">
                    <h5 className="font-medium text-gray-800 mb-2">{branch.branch}</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Predicted:</span>
                        <span className="font-medium">{branch.predicted}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Actual:</span>
                        <span className="font-medium">{branch.actual}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Accuracy:</span>
                        <span className={`font-medium ${branch.accuracy > 95 ? 'text-green-600' : 'text-blue-600'}`}>
                          {branch.accuracy}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Anomaly Detection Results */}
          {anomalyDetections.length > 0 && (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                ⚠️ Performance Anomalies Detected
              </h4>
              <div className="space-y-3">
                {anomalyDetections.map((anomaly, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border-l-4 border-orange-500">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-800">{anomaly.student}</h5>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        anomaly.deviation > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {anomaly.deviation > 0 ? '+' : ''}{anomaly.deviation} points
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Subject: <span className="font-medium">{anomaly.subject}</span></p>
                      <p>Expected: <span className="font-medium">{anomaly.expected}%</span> | Actual: <span className="font-medium">{anomaly.actual}%</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Individual Student Predictions */}
          {aiPredictions.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold mb-4">📊 Individual Student Predictions</h4>
              <div className="space-y-4">
                {aiPredictions.map((prediction, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h5 className="font-medium text-gray-800 mb-2">Performance Metrics</h5>
                        <div className="space-y-1 text-sm">
                          <p>Current Average: <span className="font-medium">{prediction.currentAverage}%</span></p>
                          <p>Predicted Score: <span className="font-medium text-blue-600">{prediction.predictedScore}%</span></p>
                          <p>Confidence: <span className="font-medium text-green-600">{prediction.confidenceLevel}%</span></p>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-800 mb-2">Risk Factors</h5>
                        <p className="text-sm text-orange-600">{prediction.riskFactors}</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-800 mb-2">Recommendations</h5>
                        <ul className="text-sm text-gray-600">
                          {prediction.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-green-500 mr-1">•</span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Branch Comparison Tab */}
      {activeTab === "branchcomparison" && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
              <BarChart2 size={20} className="mr-2 text-red-900" /> AI-Powered Branch Comparison
            </h3>
            <p className="text-gray-600 mb-4">Compare performance across branches with interactive charts, predictive analytics, and automated insights.</p>
            
            <div className="mb-6">
              <Bar data={branchComparisonData} options={{ plugins: { zoom: { zoom: { mode: 'x' } } } }} />
            </div>
            
            <div className="flex gap-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center"
                onClick={generateComparativeReport}
              >
                <FileText size={16} className="mr-2" /> Generate AI Comparative Report
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                onClick={runAIPredictionModel}
              >
                <TrendingUp size={16} className="mr-2" /> Run Branch Analysis
              </button>
            </div>
          </div>
          
          {/* Branch Performance Insights */}
          {branchComparisons.length > 0 && (
            <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold mb-4">📈 Branch Performance Analytics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {branchComparisons.map((branch, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow">
                    <h5 className="font-semibold text-gray-800 mb-3">{branch.branch}</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Predicted:</span>
                        <span className="font-medium text-blue-600">{branch.predicted}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Actual:</span>
                        <span className="font-medium text-green-600">{branch.actual}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">AI Accuracy:</span>
                        <span className={`font-medium ${
                          branch.accuracy > 95 ? 'text-green-600' : 
                          branch.accuracy > 90 ? 'text-blue-600' : 'text-yellow-600'
                        }`}>
                          {branch.accuracy}%
                        </span>
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                            style={{ width: `${branch.actual}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-white p-4 rounded-lg border">
                <h5 className="font-medium text-gray-800 mb-3">🎯 Key Insights</h5>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Highest performing branch: {branchComparisons.reduce((max, branch) => branch.actual > max.actual ? branch : max, branchComparisons[0])?.branch}
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">📊</span>
                    Average prediction accuracy: {Math.round(branchComparisons.reduce((sum, b) => sum + b.accuracy, 0) / branchComparisons.length)}%
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2">🔍</span>
                    Most consistent performance: {branchComparisons.find(b => Math.abs(b.predicted - b.actual) <= 2)?.branch || 'Analysis pending'}
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}