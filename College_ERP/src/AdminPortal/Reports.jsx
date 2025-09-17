import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Download, Edit, Search, Plus, ArrowRight, Brain, Activity, CheckCircle, AlertTriangle, TrendingUp, TrendingDown, AlertCircle, Target, Users, Briefcase, Star, Shield, Eye, Clock } from "lucide-react";
import { Bar, Line, Pie } from "react-chartjs-2";
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
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

const initialAttendanceData = [
  { student: "Aarav Sharma", subject: "CS101", attendance: 93 },
  { student: "Diya Patel", subject: "PHY101", attendance: 88 },
  { student: "Rohan Gupta", subject: "MA203", attendance: 72 },
];
const initialMarksData = [
  { student: "Aarav Sharma", subject: "CS101", marks: 88, grade: "A" },
  { student: "Diya Patel", subject: "PHY101", marks: 92, grade: "A+" },
  { student: "Rohan Gupta", subject: "MA203", marks: 75, grade: "B" },
];
const initialPlacementData = [
  { student: "Priya Singh", company: "Tech Solutions", role: "SDE Intern", status: "Internship" },
  { student: "Vikram Kumar", company: "Innovate Inc.", role: "Data Analyst", status: "Placed" },
  { student: "Aarav Sharma", company: "Web Weavers", role: "Frontend Dev", status: "Ongoing" },
];
const initialDisciplinaryData = [
  { date: "2023-10-26", student: "Rohan Gupta", type: "Warning", action: "Verbal Warning" },
  { date: "2023-11-05", student: "Anonymous", type: "Fine", action: "INR 500 Fine" },
];

export default function Reports() {
  const [activeTab, setActiveTab] = useState("summary");
  const [attendanceFilter, setAttendanceFilter] = useState({ period: "Daily", class: "All Classes/Sections" });
  const [marksFilter, setMarksFilter] = useState({ semester: "All Semesters", subject: "All Subjects" });
  const [placementFilter, setPlacementFilter] = useState({ batch: "All Batches/Years" });
  const [disciplinaryFilter, setDisciplinaryFilter] = useState({ type: "All Incident Types" });
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  
  // AI Model Status and Processing States
  const [aiModelStatus, setAiModelStatus] = useState('active');
  const [processingStates, setProcessingStates] = useState({
    attendance: false,
    academic: false,
    placement: false,
    disciplinary: false
  });
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // AI-powered attendance analytics
  const [attendanceInsights, setAttendanceInsights] = useState({
    riskStudents: [
      { name: "Rohan Gupta", currentAttendance: 72, predictedAttendance: 68, risk: "high" },
      { name: "Priya Singh", currentAttendance: 78, predictedAttendance: 75, risk: "medium" }
    ],
    trendPredictions: {
      nextWeek: 89.8,
      nextMonth: 87.5,
      confidence: 92
    },
    patterns: [
      { pattern: "Monday absences increased by 15%", severity: "medium" },
      { pattern: "Rain days show 20% attendance drop", severity: "low" },
      { pattern: "Post-exam attendance improves by 12%", severity: "positive" }
    ]
  });

  // AI-powered academic performance analytics
  const [academicInsights, setAcademicInsights] = useState({
    gradePredictions: [
      { student: "Aarav Sharma", current: 88, predicted: 92, trend: "improving", confidence: 87 },
      { student: "Diya Patel", current: 92, predicted: 89, trend: "declining", confidence: 82 },
      { student: "Rohan Gupta", current: 75, predicted: 70, trend: "at-risk", confidence: 93 }
    ],
    subjectInsights: [
      { subject: "CS101", averageImprovement: "+5.2%", difficulty: "moderate", recommendation: "Increase practical sessions" },
      { subject: "PHY101", averageImprovement: "-2.1%", difficulty: "high", recommendation: "Additional tutoring needed" },
      { subject: "MA203", averageImprovement: "+1.8%", difficulty: "low", recommendation: "Maintain current approach" }
    ],
    recommendations: [
      { student: "Rohan Gupta", action: "Schedule immediate academic counseling", priority: "high" },
      { student: "Diya Patel", action: "Monitor for external stress factors", priority: "medium" },
      { student: "Class Overall", action: "Consider mid-term assessments", priority: "low" }
    ]
  });

  // AI-powered placement analytics
  const [placementInsights, setPlacementInsights] = useState({
    placementProbabilities: [
      { student: "Aarav Sharma", probability: 92, tier: "Top-tier", recommendedRoles: ["SDE", "Product Manager"] },
      { student: "Diya Patel", probability: 88, tier: "High", recommendedRoles: ["Data Scientist", "Research Analyst"] },
      { student: "Rohan Gupta", probability: 65, tier: "Medium", recommendedRoles: ["Junior Developer", "Support Engineer"] }
    ],
    skillGapAnalysis: [
      { skill: "Machine Learning", demand: "High", currentLevel: "Low", gap: "Critical" },
      { skill: "React/Frontend", demand: "High", currentLevel: "Medium", gap: "Moderate" },
      { skill: "System Design", demand: "Medium", currentLevel: "Low", gap: "High" }
    ],
    companyMatching: [
      { company: "Tech Giants", matchScore: 78, requirements: "High GPA, Strong coding", availability: "Limited" },
      { company: "Startups", matchScore: 85, requirements: "Versatile skills, Adaptability", availability: "Good" },
      { company: "Consulting", matchScore: 72, requirements: "Communication, Analytics", availability: "Moderate" }
    ],
    predictions: {
      overallPlacementRate: 87,
      avgPackageIncrease: "+12%",
      topCompaniesInterest: "High",
      confidence: 89
    }
  });

  // AI-powered disciplinary analytics
  const [disciplinaryInsights, setDisciplinaryInsights] = useState({
    behaviorPredictions: [
      { student: "Anonymous", riskScore: 85, predictedIncidents: 3, timeframe: "Next 30 days", severity: "high" },
      { student: "Rohan Gupta", riskScore: 72, predictedIncidents: 1, timeframe: "Next 45 days", severity: "medium" }
    ],
    patternAnalysis: [
      { pattern: "Increased incidents before exam periods", frequency: "75%", correlation: "high" },
      { pattern: "Weather-related behavioral changes", frequency: "45%", correlation: "medium" },
      { pattern: "Monday morning incidents higher by 40%", frequency: "65%", correlation: "high" }
    ],
    interventions: [
      { type: "Counseling Session", effectiveness: "87%", recommended: "For repeated violations" },
      { type: "Peer Mentoring", effectiveness: "79%", recommended: "For social behavioral issues" },
      { type: "Academic Support", effectiveness: "92%", recommended: "For stress-related incidents" }
    ],
    riskAssessment: {
      overall: "Medium",
      trendDirection: "decreasing",
      confidence: 88,
      nextReview: "7 days"
    }
  });

  // Simulate AI processing states
  useEffect(() => {
    const interval = setInterval(() => {
      setProcessingStates(prev => ({
        attendance: Math.random() > 0.8,
        academic: Math.random() > 0.7,
        placement: Math.random() > 0.9,
        disciplinary: Math.random() > 0.85
      }));
      setLastUpdated(new Date());
      
      // Simulate dynamic AI insights
      setAttendanceInsights(prev => ({
        ...prev,
        trendPredictions: {
          ...prev.trendPredictions,
          nextWeek: 87 + Math.random() * 6,
          confidence: 88 + Math.random() * 10
        }
      }));
      
      // Update academic predictions
      setAcademicInsights(prev => ({
        ...prev,
        gradePredictions: prev.gradePredictions.map(pred => ({
          ...pred,
          confidence: 85 + Math.random() * 10
        }))
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Dummy data for charts
  const attendanceTrendData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Average Attendance (%)",
        data: [92.5, 91.8, 90.5, 89.2],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const gradeDistributionData = {
    labels: ["A", "A+", "B", "C"],
    datasets: [
      {
        data: [30, 25, 35, 10],
        backgroundColor: ["#4CAF50", "#8BC34A", "#FF9800", "#F44336"],
      },
    ],
  };

  const progressOverSemestersData = {
    labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
    datasets: [
      {
        label: "Average GPA",
        data: [3.5, 3.7, 3.6, 3.8],
        borderColor: "rgb(153, 102, 255)",
        tension: 0.1,
      },
    ],
  };

  const placementStatusData = {
    labels: ["Placed", "Internship", "Ongoing"],
    datasets: [
      {
        data: [40, 30, 30],
        backgroundColor: ["#4CAF50", "#FF9800", "#2196F3"],
      },
    ],
  };

  const companyWisePlacementsData = {
    labels: ["Tech Solutions", "Innovate Inc.", "Web Weavers"],
    datasets: [
      {
        label: "Placements",
        data: [15, 10, 5],
        backgroundColor: ["#4CAF50", "#FF9800", "#2196F3"],
      },
    ],
  };

  const incidentTrendData = {
    labels: ["Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Incidents",
        data: [5, 4, 3],
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
    ],
  };

  const filteredAttendance = initialAttendanceData.filter(
    (item) =>
      item.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredMarks = initialMarksData.filter(
    (item) =>
      item.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredPlacement = initialPlacementData.filter(
    (item) =>
      item.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredDisciplinary = initialDisciplinaryData.filter(
    (item) =>
      item.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.date.includes(searchTerm)
  );

  const pagedAttendance = filteredAttendance.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pagedMarks = filteredMarks.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pagedPlacement = filteredPlacement.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pagedDisciplinary = filteredDisciplinary.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // Calculate max page for each section dynamically
  const getMaxPage = (filteredData) => Math.ceil(Math.max(1, filteredData.length) / rowsPerPage);
  
  const maxPageAttendance = getMaxPage(filteredAttendance);
  const maxPageMarks = getMaxPage(filteredMarks);
  const maxPagePlacement = getMaxPage(filteredPlacement);
  const maxPageDisciplinary = getMaxPage(filteredDisciplinary);

  const handleExport = (tabType = 'general') => {
    console.log(`Exporting AI-powered ${tabType} report...`);
    
    // Generate AI summary based on current tab
    const generateAISummary = (type) => {
      switch(type) {
        case 'attendance':
          return {
            summary: "AI Analysis: Attendance shows declining trend (92.5% to 89.8%). 2 high-risk students identified.",
            predictions: "Predicted 5.2% decline in next 30 days. Intervention recommended.",
            recommendations: ["Implement attendance monitoring system", "Contact at-risk students", "Review attendance policies"]
          };
        case 'academic':
          return {
            summary: "AI Analysis: 3 students at academic risk. Grade predictions show mixed trends.",
            predictions: "Rohan Gupta: 75→70 (93% confidence), Diya Patel: 92→89 (declining trend)",
            recommendations: ["Schedule academic counseling", "Increase tutoring support", "Monitor stress factors"]
          };
        case 'placement':
          return {
            summary: "AI Analysis: 87% placement rate projected. Critical skill gaps in ML and System Design.",
            predictions: "Package growth +12%, High demand for versatile skills",
            recommendations: ["Bridge skill gaps through training", "Focus on startup placements", "Enhance practical experience"]
          };
        case 'disciplinary':
          return {
            summary: "AI Analysis: Medium risk environment, decreasing trend (88% confidence).",
            predictions: "Behavioral incidents expected to decrease by 15% next month",
            recommendations: ["Continue current intervention strategies", "Monitor exam period patterns", "Implement peer mentoring"]
          };
        default:
          return {
            summary: "AI-powered comprehensive institutional analysis with predictive insights across all domains.",
            predictions: "Overall positive outlook with targeted intervention opportunities identified.",
            recommendations: ["Implement AI-driven early warning systems", "Focus on at-risk student support", "Enhance data-driven decision making"]
          };
      }
    };
    
    const aiSummary = generateAISummary(activeTab);
    
    // Simulate AI report generation
    const reportData = {
      timestamp: new Date().toISOString(),
      reportType: `AI-Powered ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Analysis`,
      aiInsights: aiSummary,
      confidence: Math.floor(85 + Math.random() * 10),
      dataPoints: {
        attendance: attendanceInsights,
        academic: academicInsights,
        placement: placementInsights,
        disciplinary: disciplinaryInsights
      }
    };
    
    // Create downloadable content
    const reportContent = `
AI-POWERED COLLEGE ERP REPORT
${'='.repeat(50)}
Generated: ${new Date().toLocaleString()}
Report Type: ${reportData.reportType}
AI Confidence Level: ${reportData.confidence}%

EXECUTIVE SUMMARY
${'-'.repeat(20)}
${aiSummary.summary}

PREDICTIVE INSIGHTS
${'-'.repeat(20)}
${aiSummary.predictions}

AI RECOMMENDATIONS
${'-'.repeat(20)}
${aiSummary.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

DETAILED ANALYTICS
${'-'.repeat(20)}
This report was generated using AI algorithms analyzing institutional data patterns,
student behavior metrics, and predictive modeling for actionable insights.

Note: This is a simulated AI report for demonstration purposes.
    `;
    
    // Create and download file
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `AI_Report_${activeTab}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    // Show success message
    alert(`AI-powered ${activeTab} report exported successfully with predictive insights and recommendations!`);
  };

  const handleEdit = (item) => {
    console.log("Editing:", item);
    // Placeholder for edit logic
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">AI-Powered Reports & Analytics</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow">
            <Brain className="text-blue-600 mr-2" size={20} />
            <div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-700 mr-2">AI Models:</span>
                {aiModelStatus === 'active' ? (
                  <div className="flex items-center">
                    <CheckCircle className="text-green-500 mr-1" size={16} />
                    <span className="text-green-600 text-sm font-medium">Active</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <AlertTriangle className="text-orange-500 mr-1" size={16} />
                    <span className="text-orange-600 text-sm font-medium">Updating</span>
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            </div>
          </div>
          <div className="flex items-center bg-gradient-to-r from-purple-500 to-blue-600 text-white px-4 py-2 rounded-lg shadow">
            <Activity className="mr-2 animate-pulse" size={16} />
            <span className="text-sm font-medium">Real-time Analytics</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        {["summary", "attendance", "academic", "placement", "disciplinary"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-t-lg ${activeTab === tab ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, " $1").trim()}
          </button>
        ))}
      </div>

      {/* Summary Dashboard */}
      {activeTab === "summary" && (
        <div>
          {/* Main KPI Cards with AI Predictions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-gray-700">Attendance Overview</h3>
                <Brain className="text-green-500" size={20} />
              </div>
              <p className="text-2xl font-bold text-green-600">92.5%</p>
              <p className="text-sm text-gray-500">Overall Average</p>
              <div className="flex items-center mt-2 text-xs">
                <TrendingDown className="text-orange-500 mr-1" size={12} />
                <span className="text-orange-600">Predicted: 89.8% next week</span>
              </div>
              <button 
                onClick={() => setActiveTab('attendance')}
                className="text-red-500 hover:underline flex items-center mt-2 text-sm"
              >
                <ArrowRight size={16} className="mr-1" /> View AI Analysis
              </button>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-gray-700">Academic Performance</h3>
                <Brain className="text-purple-500" size={20} />
              </div>
              <p className="text-2xl font-bold text-purple-600">3.7 GPA</p>
              <p className="text-sm text-gray-500">Average GPA</p>
              <div className="flex items-center mt-2 text-xs">
                <AlertTriangle className="text-red-500 mr-1" size={12} />
                <span className="text-red-600">3 at-risk students identified</span>
              </div>
              <button 
                onClick={() => setActiveTab('academic')}
                className="text-red-500 hover:underline flex items-center mt-2 text-sm"
              >
                <ArrowRight size={16} className="mr-1" /> View Predictions
              </button>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-indigo-500">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-gray-700">Placement & Internship</h3>
                <Brain className="text-indigo-500" size={20} />
              </div>
              <p className="text-2xl font-bold text-indigo-600">85%</p>
              <p className="text-sm text-gray-500">Placement Rate</p>
              <div className="flex items-center mt-2 text-xs">
                <TrendingUp className="text-green-500 mr-1" size={12} />
                <span className="text-green-600">Projected: 87% next quarter</span>
              </div>
              <button 
                onClick={() => setActiveTab('placement')}
                className="text-red-500 hover:underline flex items-center mt-2 text-sm"
              >
                <ArrowRight size={16} className="mr-1" /> View Analytics
              </button>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-gray-700">Disciplinary Records</h3>
                <Brain className="text-red-500" size={20} />
              </div>
              <p className="text-2xl font-bold text-red-600">12</p>
              <p className="text-sm text-gray-500">Incidents this month</p>
              <div className="flex items-center mt-2 text-xs">
                <TrendingDown className="text-green-500 mr-1" size={12} />
                <span className="text-green-600">Risk decreasing (88% confidence)</span>
              </div>
              <button 
                onClick={() => setActiveTab('disciplinary')}
                className="text-red-500 hover:underline flex items-center mt-2 text-sm"
              >
                <ArrowRight size={16} className="mr-1" /> View Risk Analysis
              </button>
            </div>
          </div>

          {/* AI Insights Summary Panel */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6 rounded-lg shadow mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold flex items-center">
                <Brain className="mr-2" size={24} />
                AI Executive Summary
              </h3>
              <div className="flex items-center bg-white/20 px-3 py-1 rounded-full">
                <Activity className="animate-pulse mr-2" size={16} />
                <span className="text-sm">Live Analytics</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <AlertCircle className="mr-2" size={16} />
                  Key Alerts & Recommendations
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Immediate intervention required for 2 high-risk students (Rohan Gupta, Anonymous)</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Attendance trend shows declining pattern - consider proactive measures</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Placement prospects improving with 87% projected success rate</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Critical skill gaps identified in Machine Learning and System Design</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <Target className="mr-2" size={16} />
                  Predictive Insights
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center bg-white/10 p-3 rounded">
                    <span>Next Week Attendance:</span>
                    <span className="font-bold">89.8% ↓</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/10 p-3 rounded">
                    <span>Academic Risk Students:</span>
                    <span className="font-bold text-orange-300">3 students</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/10 p-3 rounded">
                    <span>Placement Success Rate:</span>
                    <span className="font-bold text-green-300">87% ↑</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/10 p-3 rounded">
                    <span>Behavioral Incidents:</span>
                    <span className="font-bold text-green-300">Decreasing ↓</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
              <span className="text-sm opacity-90">Last AI Analysis: {new Date().toLocaleString()}</span>
              <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded transition-colors">
                Generate Full Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Reports */}
      {activeTab === "attendance" && (
        <div>
          {/* AI Attendance Insights Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-700">AI Predictions</h3>
                {processingStates.attendance && (
                  <div className="flex items-center text-blue-600">
                    <Activity className="animate-spin mr-1" size={16} />
                    <span className="text-xs">Processing</span>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Next Week:</span>
                  <div className="flex items-center">
                    <TrendingDown className="text-orange-500 mr-1" size={16} />
                    <span className="font-medium">{attendanceInsights.trendPredictions.nextWeek.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Next Month:</span>
                  <div className="flex items-center">
                    <TrendingDown className="text-red-500 mr-1" size={16} />
                    <span className="font-medium">{attendanceInsights.trendPredictions.nextMonth}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Confidence:</span>
                  <span className="font-medium text-green-600">{attendanceInsights.trendPredictions.confidence.toFixed(0)}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
              <h3 className="text-lg font-medium text-gray-700 mb-3">At-Risk Students</h3>
              <div className="space-y-2">
                {attendanceInsights.riskStudents.map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
                    <div>
                      <div className="font-medium text-sm">{student.name}</div>
                      <div className="text-xs text-gray-600">{student.currentAttendance}% → {student.predictedAttendance}%</div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      student.risk === 'high' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {student.risk.toUpperCase()}
                    </div>
                  </div>
                ))}
                <button className="w-full text-red-600 text-sm hover:underline mt-2">
                  Send Automated Alerts
                </button>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Pattern Recognition</h3>
              <div className="space-y-2">
                {attendanceInsights.patterns.map((pattern, index) => (
                  <div key={index} className="flex items-start p-2 bg-gray-50 rounded">
                    <AlertCircle className={`mr-2 mt-0.5 ${
                      pattern.severity === 'positive' ? 'text-green-500' :
                      pattern.severity === 'medium' ? 'text-orange-500' : 'text-gray-500'
                    }`} size={16} />
                    <div className="text-sm text-gray-700">{pattern.pattern}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <select
              className="bg-white border rounded p-2"
              value={attendanceFilter.period}
              onChange={(e) => setAttendanceFilter({ ...attendanceFilter, period: e.target.value })}
            >
              <option>Daily</option>
              <option>Monthly</option>
              <option>Semester-wise</option>
            </select>
            <select
              className="bg-white border rounded p-2"
              value={attendanceFilter.class}
              onChange={(e) => setAttendanceFilter({ ...attendanceFilter, class: e.target.value })}
            >
              <option>All Classes/Sections</option>
              <option>CSE-A</option>
              <option>ECE-B</option>
            </select>
            <input
              type="text"
              placeholder="Search/Filter"
              className="bg-white border rounded p-2 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-2 rounded hover:from-red-600 hover:to-pink-700 flex items-center transition-all"
              onClick={() => handleExport(activeTab)}
            >
              <Brain size={16} className="mr-1" />
              <Download size={16} className="mr-2" /> AI Export
            </button>
            <button
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600 flex items-center"
              onClick={() => console.log("Edit Attendance")}
            >
              <Edit size={16} className="mr-2" /> Edit Attendance
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Attendance Details</h3>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">Student Name</th>
                  <th className="p-2">Subject</th>
                  <th className="p-2">Attendance %</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedAttendance.map((item) => (
                  <tr key={item.student} className="border-b">
                    <td className="p-2">{item.student}</td>
                    <td className="p-2">{item.subject}</td>
                    <td className="p-2">{item.attendance}%</td>
                    <td className="p-2">
                      <button
                        className="text-red-500 hover:underline mr-2"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Attendance Trend</h3>
            <Line data={attendanceTrendData} />
          </div>
          <div className="flex justify-between mt-4 text-gray-600">
            <span>
              Showing {(page - 1) * rowsPerPage + 1} to{" "}
              {Math.min(page * rowsPerPage, filteredAttendance.length)} of{" "}
              {filteredAttendance.length} entries
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
                disabled={page === maxPageAttendance}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 bg-gray-200 rounded disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Academic Performance Reports */}
      {activeTab === "academic" && (
        <div>
          {/* AI Academic Performance Insights Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-700">Grade Predictions</h3>
                {processingStates.academic && (
                  <div className="flex items-center text-purple-600">
                    <Activity className="animate-spin mr-1" size={16} />
                    <span className="text-xs">Processing</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                {academicInsights.gradePredictions.map((pred, index) => (
                  <div key={index} className="p-2 bg-purple-50 rounded">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{pred.student}</span>
                      <div className={`px-2 py-1 rounded text-xs ${
                        pred.trend === 'improving' ? 'bg-green-100 text-green-800' :
                        pred.trend === 'declining' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {pred.trend.toUpperCase()}
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Current: {pred.current} → Predicted: {pred.predicted} ({pred.confidence.toFixed(0)}% confidence)
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Subject Analysis</h3>
              <div className="space-y-3">
                {academicInsights.subjectInsights.map((subject, index) => (
                  <div key={index} className="p-3 bg-orange-50 rounded">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm">{subject.subject}</span>
                      <span className={`text-xs font-medium ${
                        subject.averageImprovement.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {subject.averageImprovement}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">
                      Difficulty: <span className={`font-medium ${
                        subject.difficulty === 'high' ? 'text-red-600' :
                        subject.difficulty === 'moderate' ? 'text-orange-600' : 'text-green-600'
                      }`}>{subject.difficulty}</span>
                    </div>
                    <div className="text-xs text-blue-600">{subject.recommendation}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
              <h3 className="text-lg font-medium text-gray-700 mb-3">AI Recommendations</h3>
              <div className="space-y-2">
                {academicInsights.recommendations.map((rec, index) => (
                  <div key={index} className="p-2 bg-green-50 rounded border-l-2 border-green-300">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-sm">{rec.student}</span>
                      <div className={`px-2 py-1 rounded text-xs ${
                        rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                        rec.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {rec.priority.toUpperCase()}
                      </div>
                    </div>
                    <div className="text-xs text-gray-700">{rec.action}</div>
                  </div>
                ))}
                <button className="w-full text-green-600 text-sm hover:underline mt-3">
                  Generate Action Plan
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <select
              className="bg-white border rounded p-2"
              value={marksFilter.semester}
              onChange={(e) => setMarksFilter({ ...marksFilter, semester: e.target.value })}
            >
              <option>All Semesters</option>
              <option>Semester 1</option>
              <option>Semester 2</option>
            </select>
            <select
              className="bg-white border rounded p-2"
              value={marksFilter.subject}
              onChange={(e) => setMarksFilter({ ...marksFilter, subject: e.target.value })}
            >
              <option>All Subjects</option>
              <option>CS101</option>
              <option>PHY101</option>
            </select>
            <input
              type="text"
              placeholder="Search/Filter"
              className="bg-white border rounded p-2 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-2 rounded hover:from-red-600 hover:to-pink-700 flex items-center transition-all"
              onClick={() => handleExport(activeTab)}
            >
              <Brain size={16} className="mr-1" />
              <Download size={16} className="mr-2" /> AI Export
            </button>
            <button
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600 flex items-center"
              onClick={() => console.log("Edit Marks")}
            >
              <Edit size={16} className="mr-2" /> Edit Marks
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Student Marks</h3>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">Student</th>
                  <th className="p-2">Subject</th>
                  <th className="p-2">Marks</th>
                  <th className="p-2">Grade</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedMarks.map((item) => (
                  <tr key={item.student} className="border-b">
                    <td className="p-2">{item.student}</td>
                    <td className="p-2">{item.subject}</td>
                    <td className="p-2">{item.marks}</td>
                    <td className="p-2">{item.grade}</td>
                    <td className="p-2">
                      <button
                        className="text-red-500 hover:underline mr-2"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Grade Distribution</h3>
              <Pie data={gradeDistributionData} />
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Progress Over Semesters</h3>
              <Line data={progressOverSemestersData} />
            </div>
          </div>
          <div className="flex justify-between mt-4 text-gray-600">
            <span>
              Showing {(page - 1) * rowsPerPage + 1} to{" "}
              {Math.min(page * rowsPerPage, filteredMarks.length)} of{" "}
              {filteredMarks.length} entries
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
                disabled={page === maxPageMarks}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 bg-gray-200 rounded disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Placement & Internship Statistics */}
      {activeTab === "placement" && (
        <div>
          {/* AI Placement Insights Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-indigo-500">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-700">Placement Predictions</h3>
                {processingStates.placement && (
                  <div className="flex items-center text-indigo-600">
                    <Activity className="animate-spin mr-1" size={16} />
                    <span className="text-xs">Processing</span>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-indigo-50 rounded">
                  <span className="text-sm text-gray-600">Overall Rate:</span>
                  <span className="font-bold text-indigo-600">{placementInsights.predictions.overallPlacementRate}%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <span className="text-sm text-gray-600">Package Growth:</span>
                  <span className="font-bold text-green-600">{placementInsights.predictions.avgPackageIncrease}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                  <span className="text-sm text-gray-600">Top Companies:</span>
                  <span className="font-medium text-purple-600">{placementInsights.predictions.topCompaniesInterest}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span className="text-sm text-gray-600">Confidence:</span>
                  <span className="font-medium text-blue-600">{placementInsights.predictions.confidence}%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-cyan-500">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Student Placement Probability</h3>
              <div className="space-y-2">
                {placementInsights.placementProbabilities.map((student, index) => (
                  <div key={index} className="p-2 bg-cyan-50 rounded">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm">{student.student}</span>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        student.tier === 'Top-tier' ? 'bg-green-100 text-green-800' :
                        student.tier === 'High' ? 'bg-blue-100 text-blue-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {student.probability}%
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">Tier: {student.tier}</div>
                    <div className="text-xs text-blue-600">
                      Recommended: {student.recommendedRoles.join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-pink-500">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Skill Gap Analysis</h3>
              <div className="space-y-2">
                {placementInsights.skillGapAnalysis.map((skill, index) => (
                  <div key={index} className="p-2 bg-pink-50 rounded">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm">{skill.skill}</span>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        skill.gap === 'Critical' ? 'bg-red-100 text-red-800' :
                        skill.gap === 'High' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {skill.gap}
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Demand: <span className={`font-medium ${
                        skill.demand === 'High' ? 'text-red-600' : 'text-blue-600'
                      }`}>{skill.demand}</span></span>
                      <span>Level: <span className="font-medium text-gray-800">{skill.currentLevel}</span></span>
                    </div>
                  </div>
                ))}
                <button className="w-full text-pink-600 text-sm hover:underline mt-2">
                  Generate Training Plan
                </button>
              </div>
            </div>
          </div>

          {/* Company Matching Intelligence */}
          <div className="bg-white p-4 rounded-lg shadow mb-6 border-l-4 border-teal-500">
            <h3 className="text-lg font-medium text-gray-700 mb-4">AI Company Matching</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {placementInsights.companyMatching.map((company, index) => (
                <div key={index} className="p-3 bg-teal-50 rounded border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Briefcase className="text-teal-600 mr-2" size={16} />
                      <span className="font-medium text-sm">{company.company}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="text-yellow-500 mr-1" size={14} />
                      <span className="text-sm font-medium">{company.matchScore}%</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">{company.requirements}</div>
                  <div className={`text-xs font-medium ${
                    company.availability === 'Good' ? 'text-green-600' :
                    company.availability === 'Moderate' ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    Availability: {company.availability}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <select
              className="bg-white border rounded p-2"
              value={placementFilter.batch}
              onChange={(e) => setPlacementFilter({ ...placementFilter, batch: e.target.value })}
            >
              <option>All Batches/Years</option>
              <option>2023</option>
              <option>2024</option>
            </select>
            <input
              type="text"
              placeholder="Filter/Search"
              className="bg-white border rounded p-2 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-2 rounded hover:from-red-600 hover:to-pink-700 flex items-center transition-all"
              onClick={() => handleExport(activeTab)}
            >
              <Brain size={16} className="mr-1" />
              <Download size={16} className="mr-2" /> AI Export
            </button>
            <button
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600 flex items-center"
              onClick={() => console.log("Add Record")}
            >
              <Plus size={16} className="mr-2" /> Add Record
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Placement Data</h3>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">Student Name</th>
                  <th className="p-2">Company</th>
                  <th className="p-2">Role</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedPlacement.map((item) => (
                  <tr key={item.student} className="border-b">
                    <td className="p-2">{item.student}</td>
                    <td className="p-2">{item.company}</td>
                    <td className="p-2">{item.role}</td>
                    <td className="p-2">{item.status}</td>
                    <td className="p-2">
                      <button
                        className="text-red-500 hover:underline mr-2"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Placement Status</h3>
              <Pie data={placementStatusData} />
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Company-wise Placements</h3>
              <Bar data={companyWisePlacementsData} />
            </div>
          </div>
          <div className="flex justify-between mt-4 text-gray-600">
            <span>
              Showing {(page - 1) * rowsPerPage + 1} to{" "}
              {Math.min(page * rowsPerPage, filteredPlacement.length)} of{" "}
              {filteredPlacement.length} entries
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
                disabled={page === maxPagePlacement}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 bg-gray-200 rounded disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disciplinary Records */}
      {activeTab === "disciplinary" && (
        <div>
          {/* AI Disciplinary Insights Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-700">Risk Assessment</h3>
                {processingStates.disciplinary && (
                  <div className="flex items-center text-red-600">
                    <Activity className="animate-spin mr-1" size={16} />
                    <span className="text-xs">Processing</span>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                  <span className="text-sm text-gray-600">Overall Risk:</span>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    disciplinaryInsights.riskAssessment.overall === 'High' ? 'bg-red-100 text-red-800' :
                    disciplinaryInsights.riskAssessment.overall === 'Medium' ? 'bg-orange-100 text-orange-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {disciplinaryInsights.riskAssessment.overall}
                  </div>
                </div>
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span className="text-sm text-gray-600">Trend:</span>
                  <div className="flex items-center">
                    {disciplinaryInsights.riskAssessment.trendDirection === 'decreasing' ? (
                      <TrendingDown className="text-green-500 mr-1" size={16} />
                    ) : (
                      <TrendingUp className="text-red-500 mr-1" size={16} />
                    )}
                    <span className={`text-xs font-medium ${
                      disciplinaryInsights.riskAssessment.trendDirection === 'decreasing' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {disciplinaryInsights.riskAssessment.trendDirection}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                  <span className="text-sm text-gray-600">Confidence:</span>
                  <span className="font-medium text-purple-600">{disciplinaryInsights.riskAssessment.confidence}%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Next Review:</span>
                  <span className="font-medium text-gray-600">{disciplinaryInsights.riskAssessment.nextReview}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Behavioral Predictions</h3>
              <div className="space-y-2">
                {disciplinaryInsights.behaviorPredictions.map((pred, index) => (
                  <div key={index} className="p-2 bg-orange-50 rounded border">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm">{pred.student}</span>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        pred.severity === 'high' ? 'bg-red-100 text-red-800' :
                        pred.severity === 'medium' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        Risk: {pred.riskScore}%
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">
                      Predicted incidents: {pred.predictedIncidents} in {pred.timeframe}
                    </div>
                    <div className="text-xs text-blue-600">Requires immediate attention</div>
                  </div>
                ))}
                <button className="w-full text-orange-600 text-sm hover:underline mt-2">
                  Schedule Interventions
                </button>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Pattern Analysis</h3>
              <div className="space-y-2">
                {disciplinaryInsights.patternAnalysis.map((pattern, index) => (
                  <div key={index} className="p-2 bg-green-50 rounded border-l-2 border-green-300">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center">
                        <Eye className="text-green-600 mr-1" size={14} />
                        <span className="text-xs font-medium">{pattern.frequency}</span>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${
                        pattern.correlation === 'high' ? 'bg-red-100 text-red-800' :
                        pattern.correlation === 'medium' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {pattern.correlation}
                      </div>
                    </div>
                    <div className="text-xs text-gray-700">{pattern.pattern}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Intervention Recommendations */}
          <div className="bg-white p-4 rounded-lg shadow mb-6 border-l-4 border-blue-500">
            <h3 className="text-lg font-medium text-gray-700 mb-4">AI Intervention Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {disciplinaryInsights.interventions.map((intervention, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Shield className="text-blue-600 mr-2" size={16} />
                      <span className="font-medium text-sm">{intervention.type}</span>
                    </div>
                    <div className="flex items-center">
                      <Target className="text-green-500 mr-1" size={14} />
                      <span className="text-sm font-medium">{intervention.effectiveness}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">{intervention.recommended}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <select
              className="bg-white border rounded p-2"
              value={disciplinaryFilter.type}
              onChange={(e) => setDisciplinaryFilter({ ...disciplinaryFilter, type: e.target.value })}
            >
              <option>All Incident Types</option>
              <option>Warning</option>
              <option>Fine</option>
              <option>Suspension</option>
            </select>
            <input
              type="text"
              placeholder="Search/Filter"
              className="bg-white border rounded p-2 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-2 rounded hover:from-red-600 hover:to-pink-700 flex items-center transition-all"
              onClick={() => handleExport(activeTab)}
            >
              <Brain size={16} className="mr-1" />
              <Download size={16} className="mr-2" /> AI Export
            </button>
            <button
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600 flex items-center"
              onClick={() => console.log("Add Incident")}
            >
              <Plus size={16} className="mr-2" /> Add Incident
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Incident Log</h3>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">Date</th>
                  <th className="p-2">Student</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Action Taken</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedDisciplinary.map((item) => (
                  <tr key={item.date + item.student} className="border-b">
                    <td className="p-2">{item.date}</td>
                    <td className="p-2">{item.student}</td>
                    <td className="p-2">{item.type}</td>
                    <td className="p-2">{item.action}</td>
                    <td className="p-2">
                      <button
                        className="text-red-500 hover:underline mr-2"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Incident Trend (Monthly)</h3>
            <Line data={incidentTrendData} />
          </div>
          <div className="flex justify-between mt-4 text-gray-600">
            <span>
              Showing {(page - 1) * rowsPerPage + 1} to{" "}
              {Math.min(page * rowsPerPage, filteredDisciplinary.length)} of{" "}
              {filteredDisciplinary.length} entries
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
                disabled={page === maxPageDisciplinary}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 bg-gray-200 rounded disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}