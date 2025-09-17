import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Upload, Edit, Download, Plus, Search, Calendar, AlertTriangle, BarChart2, PieChart, FileText, Users, Bot, TrendingUp, Mic, Scan, CreditCard } from "lucide-react";
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

// Dummy data for JECRC Fee Management
const initialFeeStructures = [
  { id: "1", school: "School of Engineering & Technology", branch: "Computer Science", feeType: "Tuition Fee", amount: 150000, semester: "1", dueDate: "2025-09-15" },
  { id: "2", school: "School of Sciences", branch: "Physics", feeType: "Hostel Fee", amount: 80000, semester: "1", dueDate: "2025-09-20" },
  // Expanded to 12
  { id: "3", school: "School of Engineering & Technology", branch: "Mechanical", feeType: "Lab Fee", amount: 20000, semester: "1", dueDate: "2025-09-25" },
  { id: "4", school: "School of Law", branch: "LLB", feeType: "Tuition Fee", amount: 120000, semester: "1", dueDate: "2025-09-30" },
  { id: "5", school: "School of Business", branch: "BBA", feeType: "Exam Fee", amount: 5000, semester: "1", dueDate: "2025-10-05" },
  { id: "6", school: "School of Design", branch: "B.Des", feeType: "Library Fee", amount: 3000, semester: "1", dueDate: "2025-10-10" },
  { id: "7", school: "School of Humanities & Social Sciences", branch: "BA", feeType: "Sports Fee", amount: 2000, semester: "1", dueDate: "2025-10-15" },
  { id: "8", school: "School of Allied Health Sciences", branch: "B.Sc Nursing", feeType: "Hostel Fee", amount: 85000, semester: "1", dueDate: "2025-10-20" },
  { id: "9", school: "School of Computer Applications", branch: "BCA", feeType: "Tuition Fee", amount: 100000, semester: "1", dueDate: "2025-10-25" },
  { id: "10", school: "School of Sciences", branch: "Chemistry", feeType: "Lab Fee", amount: 15000, semester: "1", dueDate: "2025-10-30" },
  { id: "11", school: "School of Engineering & Technology", branch: "Civil", feeType: "Exam Fee", amount: 6000, semester: "1", dueDate: "2025-11-05" },
  { id: "12", school: "School of Law", branch: "LLM", feeType: "Library Fee", amount: 4000, semester: "1", dueDate: "2025-11-10" },
];

const initialStudentFees = [
  { id: "1", school: "School of Engineering & Technology", branch: "Computer Science", student: "Aarav Sharma", feeType: "Tuition Fee", amount: 150000, paid: 100000, due: 50000, status: "Partial Paid" },
  { id: "2", school: "School of Sciences", branch: "Physics", student: "Diya Patel", feeType: "Hostel Fee", amount: 80000, paid: 80000, due: 0, status: "Paid" },
  // Expanded
];

const initialPayments = [
  { id: "1", school: "School of Engineering & Technology", branch: "Computer Science", student: "Aarav Sharma", amount: 100000, date: "2025-08-15", method: "Online", status: "Successful" },
  { id: "2", school: "School of Sciences", branch: "Physics", student: "Diya Patel", amount: 80000, date: "2025-08-20", method: "Cash", status: "Successful" },
  // Expanded
];

const initialScholarships = [
  { id: "1", school: "School of Engineering & Technology", branch: "Computer Science", student: "Rohan Gupta", amount: 50000, status: "Approved" },
  { id: "2", school: "School of Sciences", branch: "Physics", student: "Priya Singh", amount: 30000, status: "Pending" },
  // Expanded
];

const initialFines = [
  { id: "1", school: "School of Engineering & Technology", branch: "Computer Science", student: "Aarav Sharma", reason: "Late Payment", amount: 2000, status: "Unpaid" },
  { id: "2", school: "School of Sciences", branch: "Physics", student: "Diya Patel", reason: "Overdue Fee", amount: 1000, status: "Paid" },
  // Expanded
];

const initialReminders = [
  { id: "1", title: "Fee Deadline", date: "2025-09-15", description: "Last day for tuition fee payment." },
  { id: "2", title: "Scholarship Application", date: "2025-09-20", description: "Apply for merit scholarships." },
  // Expanded
];

const initialTopDefaulters = [
  { rank: 1, school: "School of Engineering & Technology", branch: "Computer Science", student: "Rohan Gupta", due: 50000 },
  { rank: 2, school: "School of Sciences", branch: "Physics", student: "Priya Singh", due: 30000 },
  // Expanded
];

// Future use - Individual fee history data
// const initialIndividualFeeHistory = [
//   { id: "1", student: "Aarav Sharma", school: "School of Engineering & Technology", branch: "Computer Science", feeHistory: [{ feeType: "Tuition Fee", amount: 150000, paid: 100000, date: "2025-08-15" }, { feeType: "Hostel Fee", amount: 80000, paid: 0, date: null }] },
//   { id: "2", student: "Diya Patel", school: "School of Sciences", branch: "Physics", feeHistory: [{ feeType: "Tuition Fee", amount: 120000, paid: 120000, date: "2025-08-20" }, { feeType: "Lab Fee", amount: 15000, paid: 15000, date: "2025-08-25" }] },
//   // Expanded
// ];

export default function FeeManagement() {
  const [activeTab, setActiveTab] = useState("feestructure");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [feeStructures, setFeeStructures] = useState(initialFeeStructures);
  const [studentFees] = useState(initialStudentFees);
  const [payments] = useState(initialPayments);
  const [scholarships] = useState(initialScholarships);
  const [fines] = useState(initialFines);
  const [reminders, setReminders] = useState(initialReminders);
  const [topDefaulters] = useState(initialTopDefaulters);
  // const [individualFeeHistory] = useState(initialIndividualFeeHistory); // Future use
  
  // AI Feature States
  const [aiPredictions, setAiPredictions] = useState([]);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [voiceInquiry, setVoiceInquiry] = useState({ active: false, result: null });
  const [arPreviews, setArPreviews] = useState([]);
  const [branchAnalytics, setBranchAnalytics] = useState([]);
  const [defaulterRiskData, setDefaulterRiskData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const rowsPerPage = 5;

  // Advanced Charts Data
  const collectionTrendData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Fee Collection (₹ Lakh)",
        data: [120, 150, 130, 160, 180],
        borderColor: jecrcColors.primary,
        fill: true,
        backgroundColor: "rgba(30, 58, 138, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const feeCategoryDistributionData = {
    labels: ["Tuition", "Hostel", "Lab", "Exam", "Library"],
    datasets: [
      {
        data: [50, 20, 10, 10, 10],
        backgroundColor: [jecrcColors.primary, jecrcColors.secondary, jecrcColors.accent, jecrcColors.danger, jecrcColors.neutral],
      },
    ],
  };

  const scholarshipAllocationData = {
    labels: ["Approved", "Pending", "Rejected"],
    datasets: [
      {
        data: [60, 30, 10],
        backgroundColor: [jecrcColors.secondary, jecrcColors.accent, jecrcColors.danger],
      },
    ],
  };

  const aiFeePredictionData = {
    labels: ["Actual", "Predicted"],
    datasets: [
      {
        label: "Fee Collection (₹ Lakh)",
        data: [150, 170],
        backgroundColor: [jecrcColors.secondary, jecrcColors.accent],
      },
    ],
  };

  const branchFeeComparisonData = {
    labels: jecrcBranches[selectedSchool] || [],
    datasets: [
      {
        label: "Total Fees Collected (₹ Lakh)",
        data: [200, 180, 150, 120, 100],
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

  const filteredFeeStructures = filterData(feeStructures);
  const filteredStudentFees = filterData(studentFees);
  const filteredPayments = filterData(payments);
  const filteredScholarships = filterData(scholarships);
  const filteredFines = filterData(fines);
  const filteredReminders = filterData(reminders);
  const filteredTopDefaulters = filterData(topDefaulters);
  // const filteredIndividualFeeHistory = filterData(initialIndividualFeeHistory); // Future use

  const pagedFeeStructures = filteredFeeStructures.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pagedStudentFees = filteredStudentFees.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pagedPayments = filteredPayments.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pagedScholarships = filteredScholarships.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pagedFines = filteredFines.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pagedReminders = filteredReminders.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pagedTopDefaulters = filteredTopDefaulters.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const maxPage = Math.ceil(filteredFeeStructures.length / rowsPerPage);

  const handleUploadFeeStructure = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Uploading fee structure:", file.name);
      setFeeStructures((prev) => [...prev, { id: Date.now().toString(), school: selectedSchool, branch: selectedBranch, feeType: "New Fee", amount: 0, semester: "1", dueDate: new Date().toISOString().split("T")[0] }]);
    }
  };

  const handleProcessPayment = (paymentId) => {
    console.log("Processing payment for:", paymentId);
  };

  const handleApproveScholarship = (scholarshipId) => {
    console.log("Approving scholarship:", scholarshipId);
  };

  const handleWaiveFine = (fineId) => {
    console.log("Waiving fine for:", fineId);
  };

  const handleAddReminder = () => {
    setReminders((prev) => [...prev, { id: Date.now().toString(), title: "New Reminder", date: new Date().toISOString().split("T")[0], description: "Enter description here." }]);
  };

  const handlePredictFeeCollection = (branch) => {
    setIsProcessingAI(true);
    // Simulate AI processing
    setTimeout(() => {
      const prediction = {
        branch: branch,
        currentCollection: Math.floor(Math.random() * 500000) + 800000,
        predictedCollection: Math.floor(Math.random() * 600000) + 900000,
        confidenceLevel: Math.floor(Math.random() * 20) + 80,
        defaulterRisk: Math.floor(Math.random() * 30) + 10,
        recommendations: [
          'Send payment reminders to overdue students',
          'Offer flexible payment plans for high-risk defaulters',
          'Implement early bird discount for next semester'
        ],
        timeline: '2-3 weeks for full collection'
      };
      setAiPredictions(prev => [...prev, prediction]);
      setIsProcessingAI(false);
      alert(`AI Prediction Complete!\nPredicted Collection: ₹${prediction.predictedCollection.toLocaleString()}\nConfidence: ${prediction.confidenceLevel}%`);
    }, 3500);
  };

  const runAIFeeAnalysis = () => {
    setIsProcessingAI(true);
    setTimeout(() => {
      const analytics = [
        { branch: 'Computer Science', collected: 850000, predicted: 950000, risk: 15, accuracy: 94 },
        { branch: 'Mechanical', collected: 720000, predicted: 820000, risk: 22, accuracy: 91 },
        { branch: 'Civil', collected: 680000, predicted: 750000, risk: 28, accuracy: 89 },
        { branch: 'Electronics', collected: 790000, predicted: 890000, risk: 18, accuracy: 93 }
      ];
      setBranchAnalytics(analytics);
      
      const riskData = [
        { student: 'Rahul Kumar', branch: 'Computer Science', dueAmount: 45000, riskScore: 85, paymentHistory: 'Irregular' },
        { student: 'Priya Sharma', branch: 'Mechanical', dueAmount: 32000, riskScore: 72, paymentHistory: 'Delayed' }
      ];
      setDefaulterRiskData(riskData);
      setIsProcessingAI(false);
    }, 4000);
  };

  const handleViewFeeHistory = (student) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedStudent(null);
  };

  const handleVoiceInquiry = () => {
    setVoiceInquiry({ active: true, result: null });
    // Simulate voice processing
    setTimeout(() => {
      const mockResult = {
        query: 'What is my fee status?',
        response: {
          totalFees: 150000,
          paidAmount: 100000,
          dueAmount: 50000,
          dueDate: '2025-09-15',
          paymentStatus: 'Partial Paid',
          nextInstallment: 25000
        },
        confidence: 95
      };
      setVoiceInquiry({ active: false, result: mockResult });
    }, 3000);
  };

  const handleARReceiptPreview = (paymentId) => {
    const newPreview = {
      id: Date.now(),
      paymentId: paymentId,
      receiptNumber: `RCP${Date.now().toString().slice(-6)}`,
      breakdown: {
        tuitionFee: 100000,
        hostelFee: 50000,
        labFee: 15000,
        libraryFee: 3000,
        examFee: 5000
      },
      total: 173000,
      arCode: `AR_${paymentId}_${Date.now()}`,
      generated: new Date().toLocaleDateString()
    };
    setArPreviews(prev => [...prev, newPreview]);
    alert(`AR Receipt Preview Generated!\nReceipt: ${newPreview.receiptNumber}\nAR Code: ${newPreview.arCode}\nTotal: ₹${newPreview.total.toLocaleString()}`);
  };

  const handleExport = () => {
    console.log("Exporting data to PDF with JECRC branding...");
  };
  
  const handleEdit = (id) => {
    console.log("Editing item:", id);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex items-center mb-6">
        <img src="\image.png" alt="JECRC University Logo" className="w-20 h-8 mr-4" />
        <h2 className="text-2xl font-semibold" style={{ color: `var(--text)` }}>Fee Management</h2>
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
        {["feestructure", "studentfees", "payments", "scholarships", "fines", "analytics", "aipredictions", "branchcomparison", "reminders", "topdefaulters", "feeinquiry", "arreceipt"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg ${activeTab === tab ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"} whitespace-nowrap flex items-center gap-2`}
          >
            {tab === "aipredictions" && <Bot size={16} />}
            {tab === "branchcomparison" && <BarChart2 size={16} />}
            {tab === "feeinquiry" && <Mic size={16} />}
            {tab === "arreceipt" && <Scan size={16} />}
            {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, " $1").trim()}
          </button>
        ))}
      </div>

      {/* Modal for Individual Fee History */}
      {modalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl w-3/4 max-w-4xl p-6 relative">
            <button onClick={closeModal} className="absolute top-2 right-2 text-xl text-gray-400 hover:text-red-400">&times;</button>
            <h2 className="text-xl font-bold mb-4 text-blue-900">{selectedStudent.student} - Fee History</h2>
            <table className="w-full text-left text-sm mb-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">Fee Type</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Paid</th>
                  <th className="p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {selectedStudent.feeHistory.map((history, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{history.feeType}</td>
                    <td className="p-2">₹{history.amount}</td>
                    <td className="p-2">₹{history.paid}</td>
                    <td className="p-2">{history.date || "Pending"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Payment Trend</h3>
              <Line data={{
                labels: selectedStudent.feeHistory.map((h) => h.feeType),
                datasets: [
                  {
                    label: "Paid Amount",
                    data: selectedStudent.feeHistory.map((h) => h.paid),
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
                onClick={() => handlePredictFeeCollection(selectedStudent.branch)}
                disabled={isProcessingAI}
              >
                <Bot size={16} className="mr-2" /> 
                {isProcessingAI ? 'Generating Prediction...' : 'AI Predict Future Fees'}
              </button>
              {isProcessingAI && (
                <div className="flex items-center text-blue-600">
                  <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                  Analyzing fee patterns...
                </div>
              )}
            </div>
            
            {/* Display latest prediction for this student */}
            {aiPredictions.filter(p => p.branch === selectedStudent.branch).slice(-1).map((prediction, index) => (
              <div key={index} className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">🤖 Latest AI Fee Prediction</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Collection Metrics</h5>
                    <div className="space-y-1 text-sm">
                      <p>Current Collection: <span className="font-medium">₹{prediction.currentCollection.toLocaleString()}</span></p>
                      <p>Predicted Collection: <span className="font-medium text-blue-600">₹{prediction.predictedCollection.toLocaleString()}</span></p>
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
                <div className="mt-3 p-3 bg-orange-100 rounded">
                  <p className="text-sm"><strong>Risk Assessment:</strong> <span className="text-orange-700">{prediction.defaulterRisk}% defaulter risk</span></p>
                  <p className="text-sm"><strong>Timeline:</strong> <span className="text-gray-700">{prediction.timeline}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fee Structure Section */}
      {activeTab === "feestructure" && (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <label className="bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer flex items-center">
              <Upload size={16} className="mr-2" />
              Upload Fee Structure
              <input type="file" className="hidden" onChange={handleUploadFeeStructure} accept=".pdf,.csv,.xlsx" />
            </label>
            <input
              type="text"
              placeholder="Search by fee type or semester..."
              className="bg-white border rounded p-2 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
              onClick={handleExport}
            >
              <Download size={16} className="mr-2" /> Export Fee Structure (PDF with JECRC Branding)
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow mb-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-2">School</th>
                  <th className="p-2">Branch</th>
                  <th className="p-2">Fee Type</th>
                  <th className="p-2">Amount (₹)</th>
                  <th className="p-2">Semester</th>
                  <th className="p-2">Due Date</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedFeeStructures.length > 0 ? (
                  pagedFeeStructures.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-100">
                      <td className="p-2">{item.school}</td>
                      <td className="p-2">{item.branch}</td>
                      <td className="p-2">{item.feeType}</td>
                      <td className="p-2">₹{item.amount}</td>
                      <td className="p-2">{item.semester}</td>
                      <td className="p-2">{item.dueDate}</td>
                      <td className="p-2">
                        <button
                          className="text-blue-500 hover:underline mr-2"
                          onClick={() => handleEdit(item.id)}
                        >
                          <Edit size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500">
                      No fee structures found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4 text-gray-600">
            <span>
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredFeeStructures.length)} of {filteredFeeStructures.length} entries
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

      {/* Student Fees Section */}
      {activeTab === "studentfees" && (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by student or fee type..."
              className="bg-white border rounded p-2 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
              onClick={handleExport}
            >
              <Download size={16} className="mr-2" /> Export Student Fees
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow mb-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-2">School</th>
                  <th className="p-2">Branch</th>
                  <th className="p-2">Student</th>
                  <th className="p-2">Fee Type</th>
                  <th className="p-2">Amount (₹)</th>
                  <th className="p-2">Paid (₹)</th>
                  <th className="p-2">Due (₹)</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedStudentFees.length > 0 ? (
                  pagedStudentFees.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-100">
                      <td className="p-2">{item.school}</td>
                      <td className="p-2">{item.branch}</td>
                      <td className="p-2">{item.student}</td>
                      <td className="p-2">{item.feeType}</td>
                      <td className="p-2">₹{item.amount}</td>
                      <td className="p-2">₹{item.paid}</td>
                      <td className="p-2">₹{item.due}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-white ${item.status === "Paid" ? "bg-green-500" : item.status === "Partial Paid" ? "bg-yellow-500" : "bg-red-500"}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-2">
                        <button
                          className="text-blue-500 hover:underline mr-2"
                          onClick={() => handleViewFeeHistory(item)}
                        >
                          View History
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="p-4 text-center text-gray-500">
                      No student fees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4 text-gray-600">
            <span>
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredStudentFees.length)} of {filteredStudentFees.length} entries
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

      {/* Payments Section */}
      {activeTab === "payments" && (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Search payments..."
              className="bg-white border rounded p-2 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
              onClick={handleExport}
            >
              <Download size={16} className="mr-2" /> Export Payments
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow mb-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-2">School</th>
                  <th className="p-2">Branch</th>
                  <th className="p-2">Student</th>
                  <th className="p-2">Amount (₹)</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Method</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedPayments.length > 0 ? (
                  pagedPayments.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-100">
                      <td className="p-2">{item.school}</td>
                      <td className="p-2">{item.branch}</td>
                      <td className="p-2">{item.student}</td>
                      <td className="p-2">₹{item.amount}</td>
                      <td className="p-2">{item.date}</td>
                      <td className="p-2">{item.method}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-white ${item.status === "Successful" ? "bg-green-500" : "bg-red-500"}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-2">
                        <button
                          className="text-blue-500 hover:underline mr-2"
                          onClick={() => handleProcessPayment(item.id)}
                        >
                          <CreditCard size={16} /> Process Refund
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="p-4 text-center text-gray-500">
                      No payments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4 text-gray-600">
            <span>
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredPayments.length)} of {filteredPayments.length} entries
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

      {/* Scholarships Section */}
      {activeTab === "scholarships" && (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Search scholarships..."
              className="bg-white border rounded p-2 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
              onClick={handleExport}
            >
              <Download size={16} className="mr-2" /> Export Scholarships
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow mb-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-2">School</th>
                  <th className="p-2">Branch</th>
                  <th className="p-2">Student</th>
                  <th className="p-2">Amount (₹)</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedScholarships.length > 0 ? (
                  pagedScholarships.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-100">
                      <td className="p-2">{item.school}</td>
                      <td className="p-2">{item.branch}</td>
                      <td className="p-2">{item.student}</td>
                      <td className="p-2">₹{item.amount}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-white ${item.status === "Approved" ? "bg-green-500" : "bg-yellow-500"}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-2">
                        <button
                          className="text-green-500 hover:underline mr-2"
                          onClick={() => handleApproveScholarship(item.id)}
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-gray-500">
                      No scholarships found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4 text-gray-600">
            <span>
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredScholarships.length)} of {filteredScholarships.length} entries
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

      {/* Fines Section */}
      {activeTab === "fines" && (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Search fines..."
              className="bg-white border rounded p-2 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
              onClick={handleExport}
            >
              <Download size={16} className="mr-2" /> Export Fines Report
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow mb-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-2">School</th>
                  <th className="p-2">Branch</th>
                  <th className="p-2">Student</th>
                  <th className="p-2">Reason</th>
                  <th className="p-2">Amount (₹)</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedFines.length > 0 ? (
                  pagedFines.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-100">
                      <td className="p-2">{item.school}</td>
                      <td className="p-2">{item.branch}</td>
                      <td className="p-2">{item.student}</td>
                      <td className="p-2">{item.reason}</td>
                      <td className="p-2">₹{item.amount}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-white ${item.status === "Unpaid" ? "bg-red-500" : "bg-green-500"}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="p-2">
                        <button
                          className="text-blue-500 hover:underline mr-2"
                          onClick={() => handleWaiveFine(item.id)}
                        >
                          Waive Fine
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500">
                      No fines found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4 text-gray-600">
            <span>
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredFines.length)} of {filteredFines.length} entries
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
          {collectionTrendData && collectionTrendData.labels && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                <BarChart2 size={20} className="mr-2 text-blue-900" /> Fee Collection Trend
              </h3>
              <Line data={collectionTrendData} options={{ plugins: { zoom: { zoom: { mode: 'x' } }, filler: { propagate: true } } }} />
            </div>
          )}
          {feeCategoryDistributionData && feeCategoryDistributionData.labels && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                <PieChart size={20} className="mr-2 text-blue-900" /> Fee Category Distribution
              </h3>
              <Pie data={feeCategoryDistributionData} options={{ plugins: { zoom: { zoom: { mode: 'xy' } } } }} />
            </div>
          )}
          {scholarshipAllocationData && scholarshipAllocationData.labels && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                <BarChart2 size={20} className="mr-2 text-blue-900" /> Scholarship Allocation Status
              </h3>
              <Bar data={scholarshipAllocationData} options={{ plugins: { zoom: { zoom: { mode: 'y' } } } }} />
            </div>
          )}
        </div>
      )}

      {/* AI Predictions Tab */}
      {activeTab === "aipredictions" && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
              <Bot size={20} className="mr-2 text-blue-900" /> AI Fee Collection Predictions System
            </h3>
            <p className="text-gray-600 mb-4">AI-driven predictions for fee collection, defaulter risk analysis, and financial forecasting based on historical data.</p>
            
            <div className="flex gap-4 mb-6">
              <button
                className={`px-4 py-2 rounded flex items-center ${
                  isProcessingAI ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600'
                }`}
                onClick={runAIFeeAnalysis}
                disabled={isProcessingAI}
              >
                <TrendingUp size={16} className="mr-2" /> 
                {isProcessingAI ? 'Processing AI Analysis...' : 'Run AI Fee Prediction'}
              </button>
              {isProcessingAI && (
                <div className="flex items-center text-blue-600">
                  <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                  Analyzing fee collection patterns...
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-medium mb-2">Predicted vs Actual Collection</h4>
                <Bar data={aiFeePredictionData} options={{ plugins: { zoom: { zoom: { mode: 'y' } } } }} />
              </div>
              <div>
                <h4 className="text-md font-medium mb-2">Collection Trend Analysis</h4>
                <Line data={collectionTrendData} options={{ plugins: { filler: { propagate: true } } }} />
              </div>
            </div>
          </div>
          
          {/* Branch Analytics Results */}
          {branchAnalytics.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold mb-4">🎯 AI Branch Analysis Results</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {branchAnalytics.map((branch, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border">
                    <h5 className="font-medium text-gray-800 mb-2">{branch.branch}</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Collected:</span>
                        <span className="font-medium text-green-600">₹{branch.collected.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Predicted:</span>
                        <span className="font-medium text-blue-600">₹{branch.predicted.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Risk Score:</span>
                        <span className={`font-medium ${
                          branch.risk < 20 ? 'text-green-600' : branch.risk < 30 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {branch.risk}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">AI Accuracy:</span>
                        <span className="font-medium text-purple-600">{branch.accuracy}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Defaulter Risk Analysis */}
          {defaulterRiskData.length > 0 && (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold mb-4">⚠️ High-Risk Defaulter Analysis</h4>
              <div className="space-y-3">
                {defaulterRiskData.map((risk, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border-l-4 border-orange-500">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-800">{risk.student}</h5>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        risk.riskScore > 80 ? 'bg-red-100 text-red-800' :
                        risk.riskScore > 60 ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {risk.riskScore}% Risk
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 grid grid-cols-1 md:grid-cols-3 gap-2">
                      <p>Branch: <span className="font-medium">{risk.branch}</span></p>
                      <p>Due Amount: <span className="font-medium text-red-600">₹{risk.dueAmount.toLocaleString()}</span></p>
                      <p>History: <span className="font-medium">{risk.paymentHistory}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Individual Predictions */}
          {aiPredictions.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold mb-4">📈 Individual Branch Predictions</h4>
              <div className="space-y-4">
                {aiPredictions.map((prediction, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h5 className="font-medium text-gray-800 mb-2">Collection Metrics</h5>
                        <div className="space-y-1 text-sm">
                          <p>Current: <span className="font-medium">₹{prediction.currentCollection.toLocaleString()}</span></p>
                          <p>Predicted: <span className="font-medium text-blue-600">₹{prediction.predictedCollection.toLocaleString()}</span></p>
                          <p>Confidence: <span className="font-medium text-green-600">{prediction.confidenceLevel}%</span></p>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-800 mb-2">Risk Analysis</h5>
                        <div className="space-y-1 text-sm">
                          <p>Defaulter Risk: <span className="font-medium text-orange-600">{prediction.defaulterRisk}%</span></p>
                          <p>Timeline: <span className="font-medium">{prediction.timeline}</span></p>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-800 mb-2">AI Recommendations</h5>
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
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Branch Comparison Tab */}
      {activeTab === "branchcomparison" && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
            <BarChart2 size={20} className="mr-2 text-blue-900" /> Branch-wise Fee Comparison (Unique Feature)
          </h3>
          <p className="text-gray-600 mb-4">Compare fee collection and due amounts across branches with interactive charts.</p>
          <Bar data={branchFeeComparisonData} options={{ plugins: { zoom: { zoom: { mode: 'x' } } } }} />
          <button
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
            onClick={handleExport}
          >
            <FileText size={16} className="mr-2" /> Generate Comparative Report
          </button>
        </div>
      )}

      {/* Reminders Section */}
      {activeTab === "reminders" && (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
              onClick={handleAddReminder}
            >
              <Plus size={16} className="mr-2" /> Add Reminder
            </button>
            <input
              type="text"
              placeholder="Search reminders..."
              className="bg-white border rounded p-2 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
              onClick={handleExport}
            >
              <Download size={16} className="mr-2" /> Export Reminders
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow mb-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-2">Title</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedReminders.length > 0 ? (
                  pagedReminders.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-100">
                      <td className="p-2">{item.title}</td>
                      <td className="p-2">{item.date}</td>
                      <td className="p-2">{item.description}</td>
                      <td className="p-2">
                        <button
                          className="text-blue-500 hover:underline mr-2"
                          onClick={() => handleEdit(item.id)}
                        >
                          <Edit size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-500">
                      No reminders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4 text-gray-600">
            <span>
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredReminders.length)} of {filteredReminders.length} entries
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

      {/* Top Defaulters Tab */}
      {activeTab === "topdefaulters" && (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Search defaulters..."
              className="bg-white border rounded p-2 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
              onClick={handleExport}
            >
              <Download size={16} className="mr-2" /> Export Top Defaulters
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
                  <th className="p-2">Due (₹)</th>
                </tr>
              </thead>
              <tbody>
                {pagedTopDefaulters.length > 0 ? (
                  pagedTopDefaulters.map((item) => (
                    <tr key={item.rank} className="border-b hover:bg-gray-100">
                      <td className="p-2">{item.rank}</td>
                      <td className="p-2">{item.school}</td>
                      <td className="p-2">{item.branch}</td>
                      <td className="p-2">{item.student}</td>
                      <td className="p-2">₹{item.due}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500">
                      No top defaulters found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4 text-gray-600">
            <span>
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredTopDefaulters.length)} of {filteredTopDefaulters.length} entries
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

      {/* Fee Inquiry Tab (Voice-Activated) */}
      {activeTab === "feeinquiry" && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
              <Mic size={20} className="mr-2 text-blue-900" /> AI Voice-Activated Fee Inquiry
            </h3>
            <p className="text-gray-600 mb-4">Use voice commands to inquire about fee status, due dates, payment history, or scholarship information with AI-powered speech recognition.</p>
            
            <div className="flex gap-4 mb-6">
              <button
                className={`px-4 py-2 rounded flex items-center ${
                  voiceInquiry.active ? 'bg-red-600 text-white animate-pulse' : 'bg-red-500 text-white hover:bg-red-600'
                }`}
                onClick={handleVoiceInquiry}
                disabled={voiceInquiry.active}
              >
                <Mic size={16} className="mr-2" /> 
                {voiceInquiry.active ? 'Listening...' : 'Start Voice Inquiry'}
              </button>
              {voiceInquiry.active && (
                <div className="flex items-center text-red-600">
                  <div className="animate-pulse w-3 h-3 bg-red-600 rounded-full mr-2"></div>
                  Processing voice command...
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-medium text-gray-700 mb-2">Try saying:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• "What is my fee status?"</li>
                <li>• "When is my next payment due?"</li>
                <li>• "Show me payment history"</li>
                <li>• "Am I eligible for scholarships?"</li>
              </ul>
            </div>
          </div>
          
          {/* Voice Inquiry Results */}
          {voiceInquiry.result && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                🎤 Voice Inquiry Results
              </h4>
              <div className="bg-white p-4 rounded-lg border mb-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium text-gray-800">Query: "{voiceInquiry.result.query}"</p>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-medium">
                    {voiceInquiry.result.confidence}% Confidence
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">₹{voiceInquiry.result.response.totalFees.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Fees</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">₹{voiceInquiry.result.response.paidAmount.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Paid Amount</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">₹{voiceInquiry.result.response.dueAmount.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Due Amount</div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-yellow-50 rounded">
                  <p className="text-sm">
                    <strong>Payment Status:</strong> {voiceInquiry.result.response.paymentStatus} | 
                    <strong>Next Due Date:</strong> {voiceInquiry.result.response.dueDate} | 
                    <strong>Next Installment:</strong> ₹{voiceInquiry.result.response.nextInstallment.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* AR Receipt Preview Tab */}
      {activeTab === "arreceipt" && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
              <Scan size={20} className="mr-2 text-blue-900" /> AR Fee Receipt Preview System
            </h3>
            <p className="text-gray-600 mb-4">Generate interactive AR previews of fee receipts with 3D breakdowns, QR codes, and immersive payment visualization.</p>
            
            <div className="flex gap-4 mb-6">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center"
                onClick={() => handleARReceiptPreview('demo_payment_001')}
              >
                <Scan size={16} className="mr-2" /> Generate AR Receipt Preview
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                onClick={() => handleARReceiptPreview('demo_payment_002')}
              >
                <CreditCard size={16} className="mr-2" /> Preview Payment Receipt
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">🎆 AR Features</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 3D interactive fee breakdown visualization</li>
                <li>• QR code integration for mobile scanning</li>
                <li>• Immersive payment history timeline</li>
                <li>• Real-time receipt validation</li>
              </ul>
            </div>
          </div>
          
          {/* AR Receipt Previews */}
          {arPreviews.length > 0 && (
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold mb-4">🔮 Generated AR Receipt Previews</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {arPreviews.slice(-4).map((preview, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-800">Receipt #{preview.receiptNumber}</h5>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-medium">
                        AR Ready
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tuition Fee:</span>
                        <span className="font-medium">₹{preview.breakdown.tuitionFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hostel Fee:</span>
                        <span className="font-medium">₹{preview.breakdown.hostelFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lab Fee:</span>
                        <span className="font-medium">₹{preview.breakdown.labFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Library Fee:</span>
                        <span className="font-medium">₹{preview.breakdown.libraryFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-2">
                        <span>Total Amount:</span>
                        <span className="text-blue-600">₹{preview.total.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded mb-3">
                      <p className="text-xs text-gray-600 mb-1">AR Code: <span className="font-mono">{preview.arCode}</span></p>
                      <p className="text-xs text-gray-600">Generated: {preview.generated}</p>
                    </div>
                    
                    <button
                      className="w-full bg-purple-500 text-white px-3 py-2 rounded hover:bg-purple-600 flex items-center justify-center text-sm"
                      onClick={() => alert(`Launching AR View for Receipt ${preview.receiptNumber}`)}
                    >
                      <Scan size={14} className="mr-2" /> Launch AR Experience
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 bg-white p-4 rounded-lg border">
                <h5 className="font-medium text-gray-800 mb-3">📈 AR Preview Statistics</h5>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{arPreviews.length}</div>
                    <div className="text-sm text-gray-600">Generated Previews</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">₹{arPreviews.reduce((sum, p) => sum + p.total, 0).toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Amount</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">100%</div>
                    <div className="text-sm text-gray-600">AR Compatibility</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}