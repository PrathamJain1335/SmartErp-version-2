import React, { useState } from "react";
import { 
  ChevronLeft, ChevronRight, Download, Search, Calendar, AlertTriangle, 
  BarChart2, PieChart, Receipt, CreditCard, HelpCircle, Calculator, 
  Lightbulb, TrendingUp, DollarSign, Clock, CheckCircle, XCircle, 
  Bell, FileText, Gift, Eye, ExternalLink, Filter, RefreshCcw,
  ArrowUpRight, ArrowDownRight, Wallet, CreditCard as CardIcon,
  Bot, Sparkles, Brain, Target, Zap
} from "lucide-react";

// Import AI Components
import {
  FeePaymentSimulator,
  PersonalizedFeeReminders,
  FeeBreakdownVisualizer,
  ScholarshipEligibilityChecker,
  VirtualFeeAdvisor
} from '../components/AI';
import { Bar, Pie, Line as LineChart } from "react-chartjs-2";
import zoomPlugin from 'chartjs-plugin-zoom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend, zoomPlugin);

// JECRC University branding colors
const jecrcColors = {
  primary: "#1E3A8A",
  secondary: "#10B981",
  accent: "#F59E0B",
  danger: "#EF4444",
  neutral: "#6B7280",
};

// Sample data based on JECRC University B.Tech CSE fees (from research: Tuition ~₹1,75,000/year, Hostel ~₹1,00,000/year, Caution ~₹10,000)
const initialFeeOverview = {
  upcoming: [
    { id: "u1", description: "Semester 3 Tuition Fee", amount: 87500, dueDate: "2025-09-30", status: "Upcoming" },
    { id: "u2", description: "Hostel Fee (Semester 3)", amount: 50000, dueDate: "2025-09-30", status: "Upcoming" },
  ],
  pending: [
    { id: "p1", description: "Semester 2 Late Fine", amount: 500, dueDate: "2025-09-15", status: "Pending" },
  ],
  fines: 500,
  totalPaid: 262500,
  totalDue: 137500,
};

const initialPayments = [
  { id: "pay1", semester: 1, date: "2024-07-15", amount: 87500, type: "Tuition Fee", method: "Online" },
  { id: "pay2", semester: 1, date: "2024-07-15", amount: 50000, type: "Hostel Fee", method: "Cash" },
  { id: "pay3", semester: 2, date: "2025-01-10", amount: 87500, type: "Tuition Fee", method: "Online" },
  { id: "pay4", semester: 2, date: "2025-01-10", amount: 50000, type: "Hostel Fee", method: "Online" },
  { id: "pay5", semester: 1, date: "2024-07-10", amount: 10000, type: "Caution Money", method: "Online" },
  // Add more up to 30
];

const initialReceipts = [
  { id: "rec1", receiptId: "REC001", paidDate: "2024-07-15", dueDate: "2024-07-31", amount: 87500, fine: 0, status: "Paid" },
  { id: "rec2", receiptId: "REC002", paidDate: "2024-07-15", dueDate: "2024-07-31", amount: 50000, fine: 0, status: "Paid" },
  { id: "rec3", receiptId: "REC003", paidDate: "2025-01-10", dueDate: "2025-01-31", amount: 87500, fine: 0, status: "Paid" },
  { id: "rec4", receiptId: "REC004", paidDate: "2025-01-10", dueDate: "2025-01-31", amount: 50000, fine: 0, status: "Paid" },
  { id: "rec5", receiptId: "REC005", paidDate: "2024-07-10", dueDate: "2024-07-31", amount: 10000, fine: 0, status: "Paid" },
  // Add more up to 30
];

const initialFines = [
  { id: "f1", description: "Late Fee Payment (Semester 2)", amount: 500, dueDate: "2025-09-15", status: "Pending" },
  { id: "f2", description: "Library Book Overdue", amount: 100, dueDate: "2025-09-20", status: "Paid" },
  // Add more
];

const initialScholarships = [
  { id: "s1", title: "Merit-Based Scholarship", amount: 20000, status: "Applied", eligibility: "CGPA > 8.5" },
  { id: "s2", title: "Need-Based Scholarship", amount: 15000, status: "Eligible", eligibility: "Family Income < ₹5L" },
  // Add more
];

const profile = {
  fullName: "John Doe",
  studentId: "JECRC2025001",
  department: "Computer Science & Engineering",
  course: "B.Tech (CSE)",
  enrollmentYear: "2023",
  
  feeDetails: {
    totalFees: 120000,        // Total fees in currency units
    paidAmount: 90000,        // Amount paid so far
    dueAmount: 30000,         // Amount remaining
    installments: [
      {
        installmentName: "First Installment",
        dueDate: "2025-07-10",
        amount: 40000,
        paid: true,
        paidDate: "2025-07-08",
      },
      {
        installmentName: "Second Installment",
        dueDate: "2025-09-10",
        amount: 40000,
        paid: true,
        paidDate: "2025-09-05",
      },
      {
        installmentName: "Third Installment",
        dueDate: "2025-11-10",
        amount: 40000,
        paid: false,
        paidDate: null,
      },
    ],
    lateFeeCharges: 0,
    scholarshipAmount: 10000,
    paymentMethods: ["Online Bank Transfer", "Credit Card", "UPI"],
    lastPaymentDate: "2025-09-05",
  },

  contactDetails: {
    email: "john.doe@jecrcu.edu.in",
    phone: "+91-9876543210",
    emergencyContact: {
      name: "Robert Doe",
      relation: "Father",
      phone: "+91-8765432109",
    },
  },

  academicStatus: "Good Standing",
} ;

export default function Fees() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeAITool, setActiveAITool] = useState(null);
  const rowsPerPage = 5;

  // Chart Data
  const feeBreakdownData = {
    labels: ["Tuition", "Hostel", "Caution", "Fines"],
    datasets: [
      {
        data: [175000, 100000, 10000, 600],
        backgroundColor: [jecrcColors.primary, jecrcColors.secondary, jecrcColors.accent, jecrcColors.danger],
      },
    ],
  };

  const paymentHistoryData = {
    labels: ["Jul 2024", "Jan 2025", "Jul 2025"],
    datasets: [
      {
        label: "Payments (₹)",
        data: [185000, 137500, 87500],
        borderColor: jecrcColors.primary,
        fill: true,
        backgroundColor: "rgba(30, 58, 138, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const filterData = (data) => {
    return data.filter((item) => 
      (searchTerm ? Object.values(item).some((val) => val.toString().toLowerCase().includes(searchTerm.toLowerCase())) : true)
    );
  };

  const filteredPayments = filterData(initialPayments);
  const filteredReceipts = filterData(initialReceipts);
  const filteredFines = filterData(initialFines);
  const filteredScholarships = filterData(initialScholarships);

  const pagedPayments = filteredPayments.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pagedReceipts = filteredReceipts.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pagedFines = filteredFines.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pagedScholarships = filteredScholarships.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const maxPage = Math.ceil(filteredPayments.length / rowsPerPage);

  const handleViewReceipt = (receipt) => {
    setSelectedReceipt(receipt);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedReceipt(null);
  };

  const handlePayFee = () => {
    console.log("Redirecting to payment gateway...");
  };

  const handleApplyScholarship = () => {
    console.log("Applying for scholarship...");
  };

  const handleExport = () => {
    console.log("Exporting fee data to PDF with JECRC branding...");
  };

  // AI Tools Features
  const aiToolsFeatures = [
    { 
      id: "simulator", 
      title: "Fee Payment Simulator", 
      description: "AI-powered payment planning with smart insights and recommendations",
      icon: <Calculator size={20} />, 
      color: "bg-blue-500",
      component: FeePaymentSimulator
    },
    { 
      id: "advisor", 
      title: "Virtual Fee Advisor", 
      description: "24/7 AI chatbot for all your fee-related questions and support",
      icon: <Bot size={20} />, 
      color: "bg-purple-500",
      component: VirtualFeeAdvisor
    },
    { 
      id: "visualizer", 
      title: "Fee Breakdown Visualizer", 
      description: "Interactive charts and graphs to understand your fee structure",
      icon: <PieChart size={20} />, 
      color: "bg-green-500",
      component: FeeBreakdownVisualizer
    },
    { 
      id: "reminders", 
      title: "Smart Fee Reminders", 
      description: "Personalized AI notifications and payment reminders",
      icon: <Bell size={20} />, 
      color: "bg-orange-500",
      component: PersonalizedFeeReminders
    },
    { 
      id: "checker", 
      title: "Scholarship AI Checker", 
      description: "AI-powered eligibility analysis for available scholarships",
      icon: <Target size={20} />, 
      color: "bg-indigo-500",
      component: ScholarshipEligibilityChecker
    },
  ];

  const handleAIToolClick = (tool) => {
    setActiveAITool(tool);
    console.log(`Opening AI Tool: ${tool.title}`);
  };

  const closeAITool = () => {
    setActiveAITool(null);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient)' }}>
      {/* Modern Header */}
      <div className="sticky top-0 z-10 backdrop-blur-sm border-b" 
           style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/image.png" alt="JECRC University Logo" className="h-10 w-auto" />
              <div>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Fee Management</h1>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>Manage your academic fees and payments</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg" 
                   style={{ backgroundColor: 'var(--soft)' }}>
                <CheckCircle size={16} style={{ color: 'var(--success)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--success)' }}>Account in Good Standing</span>
              </div>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" 
                      style={{ color: 'var(--muted)' }}>
                <Bell size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Modern Tab Navigation */}
      <div className="mb-8">
        <div className="border-b" style={{ borderColor: 'var(--border)' }}>
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {[
              { id: "dashboard", label: "Dashboard", icon: <BarChart2 size={18} /> },
              { id: "payments", label: "Payment History", icon: <CreditCard size={18} /> },
              { id: "receipts", label: "Receipts", icon: <Receipt size={18} /> },
              { id: "fines", label: "Fines & Penalties", icon: <AlertTriangle size={18} /> },
              { id: "scholarship", label: "Scholarships", icon: <Gift size={18} /> },
              { id: "analytics", label: "Analytics", icon: <TrendingUp size={18} /> },
              { id: "uniquefeatures", label: "AI Tools", icon: <Lightbulb size={18} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                  activeTab === tab.id ? 'border-red-500' : 'border-transparent'
                }`}
                style={{
                  color: activeTab === tab.id ? 'var(--accent)' : 'var(--muted)',
                  borderBottomColor: activeTab === tab.id ? 'var(--accent)' : 'transparent'
                }}
              >
                <span className={`mr-2 transition-colors ${
                  activeTab === tab.id ? 'text-red-500' : 'text-gray-400'
                }`}>
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Modal for Receipt View */}
      {modalOpen && selectedReceipt && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="rounded-xl shadow-xl w-3/4 max-w-md p-6 relative" style={{ backgroundColor: 'var(--card)' }}>
            <button onClick={closeModal} className="absolute top-2 right-2 text-xl text-gray-400 hover:text-red-400">&times;</button>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text)' }}>Fee Receipt - {selectedReceipt.receiptId}</h2>
            <p><strong>Paid Date:</strong> {selectedReceipt.paidDate}</p>
            <p><strong>Due Date:</strong> {selectedReceipt.dueDate}</p>
            <p><strong>Amount:</strong> ₹{selectedReceipt.amount}</p>
            <p><strong>Fine:</strong> ₹{selectedReceipt.fine}</p>
            <p><strong>Status:</strong> {selectedReceipt.status}</p>
            <div className="mt-4 border-t border-gray-300 pt-4">
              <p><strong>Student Name:</strong> {profile.name}</p>
              <p><strong>Student ID:</strong> {profile.rollNumber}</p>
              <p><strong>Course:</strong> B.Tech CSE</p>
              <p><strong>University:</strong> JECRC University</p>
            </div>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
              onClick={handleExport}
            >
              <Download size={16} className="mr-2" /> Download Receipt
            </button>
          </div>
        </div>
      )}

      {/* AI Tool Modal */}
      {activeAITool && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-7xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl" style={{ backgroundColor: 'var(--card)' }}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${activeAITool.color} text-white`}>
                  {activeAITool.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>{activeAITool.title}</h2>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>{activeAITool.description}</p>
                </div>
              </div>
              <button 
                onClick={closeAITool}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                style={{ color: 'var(--muted)' }}
              >
                <XCircle size={24} />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
              {activeAITool.component && <activeAITool.component />}
            </div>
          </div>
        </div>
      )}

      {/* Modern Dashboard Section */}
      {activeTab === "dashboard" && (
        <div className="space-y-8">
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Paid Card */}
            <div className="rounded-xl p-6 border shadow-sm transition-all duration-200 hover:shadow-md" 
                 style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>Total Paid</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: 'var(--success)' }}>₹{initialFeeOverview.totalPaid.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight size={14} style={{ color: 'var(--success)' }} />
                    <span className="text-xs ml-1" style={{ color: 'var(--success)' }}>On track</span>
                  </div>
                </div>
                <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--success)', opacity: 0.1 }}>
                  <CheckCircle size={24} style={{ color: 'var(--success)' }} />
                </div>
              </div>
            </div>

            {/* Upcoming Fees Card */}
            <div className="rounded-xl p-6 border shadow-sm transition-all duration-200 hover:shadow-md" 
                 style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>Upcoming Fees</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: 'var(--warning)' }}>₹{initialFeeOverview.totalDue.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <Clock size={14} style={{ color: 'var(--warning)' }} />
                    <span className="text-xs ml-1" style={{ color: 'var(--warning)' }}>Due in 15 days</span>
                  </div>
                </div>
                <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--warning)', opacity: 0.1 }}>
                  <Calendar size={24} style={{ color: 'var(--warning)' }} />
                </div>
              </div>
            </div>

            {/* Pending Fees Card */}
            <div className="rounded-xl p-6 border shadow-sm transition-all duration-200 hover:shadow-md" 
                 style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>Pending Fees</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: 'var(--accent)' }}>₹{initialFeeOverview.pending.reduce((acc, p) => acc + p.amount, 0).toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <AlertTriangle size={14} style={{ color: 'var(--accent)' }} />
                    <span className="text-xs ml-1" style={{ color: 'var(--accent)' }}>Needs attention</span>
                  </div>
                </div>
                <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--accent)', opacity: 0.1 }}>
                  <XCircle size={24} style={{ color: 'var(--accent)' }} />
                </div>
              </div>
            </div>

            {/* Fines & Penalties Card */}
            <div className="rounded-xl p-6 border shadow-sm transition-all duration-200 hover:shadow-md" 
                 style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>Fines & Penalties</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: initialFeeOverview.fines > 0 ? 'var(--accent)' : 'var(--success)' }}>₹{initialFeeOverview.fines}</p>
                  <div className="flex items-center mt-2">
                    {initialFeeOverview.fines > 0 ? (
                      <>
                        <AlertTriangle size={14} style={{ color: 'var(--accent)' }} />
                        <span className="text-xs ml-1" style={{ color: 'var(--accent)' }}>Pay immediately</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={14} style={{ color: 'var(--success)' }} />
                        <span className="text-xs ml-1" style={{ color: 'var(--success)' }}>All clear</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="p-3 rounded-full" style={{ backgroundColor: initialFeeOverview.fines > 0 ? 'var(--accent)' : 'var(--success)', opacity: 0.1 }}>
                  {initialFeeOverview.fines > 0 ? <AlertTriangle size={24} style={{ color: 'var(--accent)' }} /> : <CheckCircle size={24} style={{ color: 'var(--success)' }} />}
                </div>
              </div>
            </div>
          </div>

          {/* Fee Summary Progress */}
          <div className="rounded-xl p-6 border shadow-sm" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Annual Fee Progress</h3>
              <div className="flex items-center space-x-2 px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--soft)' }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--success)' }}></div>
                <span className="text-sm font-medium" style={{ color: 'var(--success)' }}>65% Complete</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm" style={{ color: 'var(--muted)' }}>
                <span>₹{initialFeeOverview.totalPaid.toLocaleString()} paid</span>
                <span>₹{(initialFeeOverview.totalPaid + initialFeeOverview.totalDue).toLocaleString()} total</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="h-3 rounded-full transition-all duration-500" 
                  style={{ 
                    backgroundColor: 'var(--success)', 
                    width: `${(initialFeeOverview.totalPaid / (initialFeeOverview.totalPaid + initialFeeOverview.totalDue)) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Action Items Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Payments */}
            <div className="rounded-xl p-6 border shadow-sm" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Upcoming Payments</h3>
                <Calendar size={20} style={{ color: 'var(--muted)' }} />
              </div>
              <div className="space-y-4">
                {initialFeeOverview.upcoming.map((fee) => (
                  <div key={fee.id} className="flex items-center justify-between p-4 rounded-lg border" 
                       style={{ backgroundColor: 'var(--hover)', borderColor: 'var(--border)' }}>
                    <div className="flex-1">
                      <p className="font-medium" style={{ color: 'var(--text)' }}>{fee.description}</p>
                      <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Due: {new Date(fee.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold" style={{ color: 'var(--text)' }}>₹{fee.amount.toLocaleString()}</p>
                      <button 
                        className="mt-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                        style={{ backgroundColor: 'var(--accent)', color: 'white' }}
                        onClick={handlePayFee}
                      >
                        Pay Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Actions */}
            <div className="rounded-xl p-6 border shadow-sm" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Action Required</h3>
                <AlertTriangle size={20} style={{ color: 'var(--accent)' }} />
              </div>
              <div className="space-y-4">
                {initialFeeOverview.pending.map((fee) => (
                  <div key={fee.id} className="flex items-center justify-between p-4 rounded-lg border" 
                       style={{ backgroundColor: 'var(--accent-light)', borderColor: 'var(--accent)', borderWidth: '1px' }}>
                    <div className="flex-1">
                      <p className="font-medium" style={{ color: 'var(--text)' }}>{fee.description}</p>
                      <p className="text-sm mt-1" style={{ color: 'var(--accent)' }}>Overdue since {new Date(fee.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold" style={{ color: 'var(--accent)' }}>₹{fee.amount.toLocaleString()}</p>
                      <button 
                        className="mt-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                        style={{ backgroundColor: 'var(--accent)', color: 'white' }}
                        onClick={handlePayFee}
                      >
                        Pay Immediately
                      </button>
                    </div>
                  </div>
                ))}
                {initialFeeOverview.pending.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle size={48} className="mx-auto mb-3" style={{ color: 'var(--success)' }} />
                    <p className="font-medium" style={{ color: 'var(--success)' }}>All caught up!</p>
                    <p className="text-sm" style={{ color: 'var(--muted)' }}>No pending payments at this time.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl p-6 border shadow-sm" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 rounded-lg text-center transition-all duration-200 hover:scale-105" 
                      style={{ backgroundColor: 'var(--hover)', borderColor: 'var(--border)' }}>
                <Wallet size={24} className="mx-auto mb-2" style={{ color: 'var(--accent)' }} />
                <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>Make Payment</p>
              </button>
              <button className="p-4 rounded-lg text-center transition-all duration-200 hover:scale-105" 
                      style={{ backgroundColor: 'var(--hover)', borderColor: 'var(--border)' }}>
                <Receipt size={24} className="mx-auto mb-2" style={{ color: 'var(--accent)' }} />
                <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>View Receipts</p>
              </button>
              <button className="p-4 rounded-lg text-center transition-all duration-200 hover:scale-105" 
                      style={{ backgroundColor: 'var(--hover)', borderColor: 'var(--border)' }}>
                <Download size={24} className="mx-auto mb-2" style={{ color: 'var(--accent)' }} />
                <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>Download Statement</p>
              </button>
              <button className="p-4 rounded-lg text-center transition-all duration-200 hover:scale-105" 
                      style={{ backgroundColor: 'var(--hover)', borderColor: 'var(--border)' }}>
                <Gift size={24} className="mx-auto mb-2" style={{ color: 'var(--accent)' }} />
                <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>Apply Scholarship</p>
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
              className="border rounded p-2 w-full md:w-64" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }}
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
          <div className="p-4 rounded-lg shadow mb-4 overflow-x-auto" style={{ backgroundColor: 'var(--card)' }}>
            <table className="w-full text-left text-sm">
              <thead>
                <tr style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
                  <th className="p-2">Semester</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Method</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedPayments.length > 0 ? (
                  pagedPayments.map((item) => (
                    <tr key={item.id} className="border-b" style={{ borderColor: 'var(--border)', color: 'var(--text)' }} onMouseEnter={(e) => e.target.parentElement.style.backgroundColor = 'var(--hover)'} onMouseLeave={(e) => e.target.parentElement.style.backgroundColor = 'transparent'}>
                      <td className="p-2">{item.semester}</td>
                      <td className="p-2">{item.date}</td>
                      <td className="p-2">₹{item.amount}</td>
                      <td className="p-2">{item.type}</td>
                      <td className="p-2">{item.method}</td>
                      <td className="p-2">
                        <button
                          className="text-blue-500 hover:underline"
                          onClick={() => handleViewReceipt(item)}
                        >
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-4 text-center" style={{ color: 'var(--muted)' }}>
                      No payments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4" style={{ color: 'var(--muted)' }}>
            <span>
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredPayments.length)} of {filteredPayments.length} entries
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 rounded disabled:opacity-50" style={{ backgroundColor: 'var(--hover)', color: 'var(--text)' }}
              >
                <ChevronLeft size={16} />
              </button>
              <span>{page}</span>
              <button
                disabled={page === maxPage}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 rounded disabled:opacity-50" style={{ backgroundColor: 'var(--hover)', color: 'var(--text)' }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modern Receipts Section */}
      {activeTab === "receipts" && (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Search receipts..."
              className="bg-white border rounded p-2 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
              onClick={handleExport}
            >
              <Download size={16} className="mr-2" /> Export Receipts
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow mb-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-2">Receipt ID</th>
                  <th className="p-2">Paid Date</th>
                  <th className="p-2">Due Date</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Fine</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedReceipts.length > 0 ? (
                  pagedReceipts.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-100">
                      <td className="p-2">{item.receiptId}</td>
                      <td className="p-2">{item.paidDate}</td>
                      <td className="p-2">{item.dueDate}</td>
                      <td className="p-2">₹{item.amount}</td>
                      <td className="p-2">₹{item.fine}</td>
                      <td className="p-2">{item.status}</td>
                      <td className="p-2">
                        <button
                          className="text-blue-500 hover:underline"
                          onClick={() => handleViewReceipt(item)}
                        >
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500">
                      No receipts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4 text-gray-600">
            <span>
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredReceipts.length)} of {filteredReceipts.length} entries
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
              <Download size={16} className="mr-2" /> Export Fines
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow mb-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-2">Description</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Due Date</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedFines.length > 0 ? (
                  pagedFines.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-100">
                      <td className="p-2">{item.description}</td>
                      <td className="p-2">₹{item.amount}</td>
                      <td className="p-2">{item.dueDate}</td>
                      <td className="p-2">{item.status}</td>
                      <td className="p-2">
                        <button
                          className="text-blue-500 hover:underline"
                          onClick={() => handlePayFee()}
                        >
                          Pay Now
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500">
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

      {/* Scholarship Section */}
      {activeTab === "scholarship" && (
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
                  <th className="p-2">Title</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Eligibility</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedScholarships.length > 0 ? (
                  pagedScholarships.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-100">
                      <td className="p-2">{item.title}</td>
                      <td className="p-2">₹{item.amount}</td>
                      <td className="p-2">{item.status}</td>
                      <td className="p-2">{item.eligibility}</td>
                      <td className="p-2">
                        <button
                          className="text-blue-500 hover:underline"
                          onClick={() => handleApplyScholarship()}
                        >
                          Apply
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500">
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

      {/* Analytics Section */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
              <PieChart size={20} className="mr-2 text-blue-900" /> Fee Breakdown
            </h3>
            <Pie data={feeBreakdownData} options={{ plugins: { zoom: { zoom: { mode: 'xy' } } } }} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
              <TrendingUp size={20} className="mr-2 text-blue-900" /> Payment History Trend
            </h3>
            <LineChart data={paymentHistoryData} options={{ plugins: { zoom: { zoom: { mode: 'x' } }, filler: { propagate: true } } }} />
          </div>
        </div>
      )}

        
        {/* AI Tools Section */}
        {activeTab === "uniquefeatures" && (
          <div className="space-y-8">
            {/* AI Tools Header */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--accent)', opacity: 0.1 }}>
                  <Brain size={32} style={{ color: 'var(--accent)' }} />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text)' }}>AI-Powered Fee Tools</h2>
              <p className="text-lg" style={{ color: 'var(--muted)' }}>Intelligent solutions to help you manage your fees smarter</p>
            </div>

            {/* AI Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiToolsFeatures.map((tool) => (
                <div key={tool.id} className="rounded-xl p-6 border shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
                     style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                     onClick={() => handleAIToolClick(tool)}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${tool.color} text-white`}>
                      {tool.icon}
                    </div>
                    <div className="flex items-center space-x-1" style={{ color: 'var(--muted)' }}>
                      <Sparkles size={16} />
                      <span className="text-xs font-medium">AI</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>{tool.title}</h3>
                  <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>{tool.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--soft)', color: 'var(--accent)' }}>Free</span>
                    <div className="flex items-center text-sm" style={{ color: 'var(--accent)' }}>
                      <span className="mr-1">Launch</span>
                      <ExternalLink size={14} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Benefits Section */}
            <div className="rounded-xl p-6 border" style={{ backgroundColor: 'var(--hover)', borderColor: 'var(--border)' }}>
              <div className="flex items-center mb-4">
                <Zap size={24} className="mr-3" style={{ color: 'var(--accent)' }} />
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Why Use AI Tools?</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle size={20} style={{ color: 'var(--success)' }} />
                  <span className="text-sm" style={{ color: 'var(--text)' }}>Smart payment planning</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle size={20} style={{ color: 'var(--success)' }} />
                  <span className="text-sm" style={{ color: 'var(--text)' }}>24/7 instant support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle size={20} style={{ color: 'var(--success)' }} />
                  <span className="text-sm" style={{ color: 'var(--text)' }}>Personalized insights</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle size={20} style={{ color: 'var(--success)' }} />
                  <span className="text-sm" style={{ color: 'var(--text)' }}>Cost optimization</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle size={20} style={{ color: 'var(--success)' }} />
                  <span className="text-sm" style={{ color: 'var(--text)' }}>Scholarship discovery</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle size={20} style={{ color: 'var(--success)' }} />
                  <span className="text-sm" style={{ color: 'var(--text)' }}>Automated reminders</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other sections placeholder */}
        {(activeTab === "receipts" || activeTab === "fines" || activeTab === "scholarship" || activeTab === "analytics") && (
          <div className="rounded-xl p-8 border text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 rounded-full" style={{ backgroundColor: 'var(--accent)', opacity: 0.1 }}>
                <Lightbulb size={32} style={{ color: 'var(--accent)' }} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>Section Under Development</h3>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>The {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} section will be modernized with the same red and white theme.</p>
                <p className="text-xs mt-2" style={{ color: 'var(--muted)' }}>Features: Enhanced UI, better accessibility, responsive design, and improved user experience.</p>
              </div>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className="px-6 py-2 rounded-lg font-medium transition-colors"
                style={{ backgroundColor: 'var(--accent)', color: 'white' }}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}