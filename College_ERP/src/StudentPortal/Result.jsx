import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Download, BarChart2, FileText, Award, PieChart, Book, GraduationCap, User, TrendingUp } from "lucide-react"; // Added new icons
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement, // Added ArcElement for Pie chart
} from "chart.js";

// Register Chart.js components including ArcElement
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);
import { Bar, Pie } from "react-chartjs-2";

// JECRC University branding colors
const jecrcColors = {
  primary: "#1E3A8A", // JECRC Blue
  secondary: "#10B981", // Accent Green
  accent: "#F59E0B", // Orange accent (used for grades/highlights)
  danger: "#EF4444",
  neutral: "#6B7280",
  lightBlue: "#E0E7FF", // Lighter blue for backgrounds/accents
};

// Dummy Student and Overall Result Data (You'd likely get this via props or API)
const studentInfo = {
  name: "Pratham Jain",
  rollNumber: "24BCON2776",
  program: "B.Tech – Computer Science & Engineering",
  semesterInfo: "3rd Semester", // Changed name to avoid conflict with overallResult.semester
  academicYear: "2025–26",
};

// Dummy subjects and result data (kept from your original code)
const subjects = [
  { id: "sub1", name: "Computer Networks", code: "CS401", inSemI: 15, inSemII: 18, assignment: 10, practical: 12, endSem: 45, total: 100, grade: "A" },
  { id: "sub2", name: "Operating System", code: "CS402", inSemI: 17, inSemII: 16, assignment: 12, practical: 14, endSem: 48, total: 100, grade: "A+" },
  { id: "sub3", name: "Discrete Mathematics", code: "MA301", inSemI: 14, inSemII: null, assignment: 11, practical: 13, endSem: 42, total: 100, grade: "B" },
  { id: "sub4", name: "R Programming", code: "ST401", inSemI: 16, inSemII: 15, assignment: 13, practical: 15, endSem: 50, total: 100, grade: "A+" },
  { id: "sub5", name: "Probabilistic Modelling Using Python", code: "ST402", inSemI: 18, inSemII: 17, assignment: 14, practical: 16, endSem: 47, total: 100, grade: "A" },
  { id: "sub6", name: "Life Skills", code: "HS401", inSemI: 15, inSemII: null, assignment: 12, practical: 14, endSem: 44, total: 100, grade: "B+" },
  { id: "sub7", name: "Software Engineering And Project Management", code: "CS403", inSemI: 17, inSemII: 16, assignment: 13, practical: 15, endSem: 49, total: 100, grade: "A+" },
  { id: "sub8", name: "Data Structure and Algorithm", code: "CS404", inSemI: 16, inSemII: 15, assignment: 14, practical: 16, endSem: 46, total: 100, grade: "A" },
  { id: "sub9", name: "Computer Networks", code: "CS401", inSemI: 14, inSemII: null, assignment: 11, practical: 13, endSem: 43, total: 100, grade: "B+" },
  { id: "sub10", name: "Operating System", code: "CS402", inSemI: 15, inSemII: 18, assignment: 12, practical: 14, endSem: 45, total: 100, grade: "A" },
];

const overallResult = {
  cgpa: 8.7,
  sgpa: 8.9,
  totalCredits: 24,
  resultStatus: "Passed", // Added result status
  semester: "Fall 2025",
};

const classComparison = { averageCgpa: 8.2, studentRank: 5, classSize: 50 };
const universityComparison = { averageCgpa: 7.9, studentRank: 12, totalStudents: 500 };


export default function Result() {
  const [activeTab, setActiveTab] = useState("marksheet"); // Changed default tab to 'marksheet'
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 6;

  const filterData = (data) => {
    return data.filter((item) =>
      (searchTerm ? item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.code.toLowerCase().includes(searchTerm.toLowerCase()) : true)
    );
  };

  const filteredSubjects = filterData(subjects);
  const pagedSubjects = filteredSubjects.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const maxPage = Math.ceil(filteredSubjects.length / rowsPerPage);

  const handleDownloadResult = () => {
    // This will download the current active tab's content
    const input = document.getElementById("result-content"); // Changed ID to target the main content area
    if (!input) return;

    html2canvas(input, { scale: 2 }).then((canvas) => { // Increased scale for better PDF quality
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4"); // 'p' for portrait, 'mm' for units, 'a4' for size
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Add a margin to the PDF
      const margin = 10;
      pdf.addImage(imgData, "PNG", margin, margin, pdfWidth - 2 * margin, pdfHeight - 2 * margin);
      pdf.save(`JECRC_University_Result_${studentInfo.name.replace(/\s+/g, '_')}_${studentInfo.academicYear}.pdf`);
    });
  };

  // Chart data for Analytics tab
  const classComparisonData = {
    labels: ["Your CGPA", "Class Avg"],
    datasets: [
      {
        label: "CGPA",
        data: [overallResult.cgpa, classComparison.averageCgpa],
        backgroundColor: [jecrcColors.primary, jecrcColors.neutral],
        borderColor: [jecrcColors.primary, jecrcColors.neutral],
        borderWidth: 1,
      },
    ],
  };

  const universityComparisonData = {
    labels: ["Your CGPA", "University Avg"],
    datasets: [
      {
        data: [overallResult.cgpa, universityComparison.averageCgpa],
        backgroundColor: [jecrcColors.secondary, jecrcColors.danger],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows flexible height
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: 'Poppins, sans-serif',
          },
          color: jecrcColors.neutral,
        }
      },
      title: {
        display: false, // Title handled by h3/h4 in JSX
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10, // Assuming CGPA is out of 10
        grid: {
          color: '#f0f0f0',
        },
        ticks: {
          font: {
            family: 'Poppins, sans-serif',
          },
          color: jecrcColors.neutral,
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'Poppins, sans-serif',
          },
          color: jecrcColors.neutral,
        }
      }
    }
  };


  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <img
              src="./image.png"
              alt="JECRC University Logo"
              className="w-20 h-8 mr-4"
            />
            <div>
              <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>Academic Results</h1>
              <p className="text-lg" style={{ color: 'var(--muted)' }}>View your academic performance and analytics</p>
            </div>
          </div>
        </div>

        {/* Quick Performance Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group" 
               style={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ color: 'var(--muted)' }} className="text-sm font-medium">Current CGPA</p>
                  <p className="text-3xl font-bold text-green-600">{overallResult.cgpa}</p>
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
                  <p style={{ color: 'var(--muted)' }} className="text-sm font-medium">Current SGPA</p>
                  <p className="text-3xl font-bold text-blue-600">{overallResult.sgpa}</p>
                </div>
                <BarChart2 className="w-12 h-12 text-blue-600 opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
          
          <div className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group" 
               style={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ color: 'var(--muted)' }} className="text-sm font-medium">Class Rank</p>
                  <p className="text-3xl font-bold text-purple-600">{classComparison.studentRank}</p>
                </div>
                <Award className="w-12 h-12 text-purple-600 opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
          
          <div className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group" 
               style={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ color: 'var(--muted)' }} className="text-sm font-medium">Total Credits</p>
                  <p className="text-3xl font-bold text-orange-600">{overallResult.totalCredits}</p>
                </div>
                <GraduationCap className="w-12 h-12 text-orange-600 opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>

        {/* Modern Tab Navigation */}
        <div className="p-2 mb-8 overflow-x-auto" 
             style={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <div className="flex space-x-2 min-w-max">
            {[
              { id: "marksheet", label: "Detailed Marksheet", icon: FileText },
              { id: "overall", label: "Overall Summary", icon: Award },
              { id: "analytics", label: "Performance Analytics", icon: BarChart2 },
            ].map((tabItem) => {
              const IconComponent = tabItem.icon;
              return (
                <button
                  key={tabItem.id}
                  onClick={() => setActiveTab(tabItem.id)}
                  className={`px-6 py-3 rounded-lg whitespace-nowrap flex items-center gap-3 font-medium transition-all duration-300 ${
                    activeTab === tabItem.id
                      ? 'text-white shadow-lg transform scale-105'
                      : 'hover:scale-105 hover:shadow-md'
                  }`}
                  style={activeTab === tabItem.id ? 
                    { backgroundColor: 'var(--accent)' } : 
                    { backgroundColor: 'var(--hover)', color: 'var(--text)' }
                  }
                >
                  <IconComponent size={18} />
                  {tabItem.label}
                </button>
              );
            })}
            
            {/* Download Button */}
            <button
              onClick={handleDownloadResult}
              className="ml-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 font-medium transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <Download size={18} /> Download PDF
            </button>
          </div>
        </div>

        {/* Main Content Area - This will be captured for PDF */}
        <div id="result-content" className="transition-all duration-300 hover:shadow-lg" 
             style={{ backgroundColor: 'var(--card)', borderRadius: '24px', border: '1px solid var(--border)' }}>

          {/* Modern Header Section for PDF */}
          {(activeTab === "marksheet" || activeTab === "overall") && (
            <>
              <div className="p-8 border-b" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src="./image.png" alt="JECRC University Logo" className="w-25 h-16" />
                    <div>
                      <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>JECRC University</h1>
                      <p className="text-lg font-medium" style={{ color: 'var(--accent)' }}>Academic Scorecard / Result</p>
                    </div>
                  </div>
                  <div className="text-right p-4 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
                    <p className="font-medium" style={{ color: 'var(--text)' }}>Semester: {studentInfo.semesterInfo}</p>
                    <p className="font-medium" style={{ color: 'var(--text)' }}>Academic Year: {studentInfo.academicYear}</p>
                  </div>
                </div>
              </div>

              {/* Modern Student Information Card */}
              <div className="p-8">
                <div className="p-6 rounded-xl mb-8" style={{ backgroundColor: 'var(--hover)', border: '1px solid var(--border)' }}>
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                    <User size={24} className="text-blue-600" /> Student Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
                        <span className="font-semibold w-24" style={{ color: 'var(--muted)' }}>Name:</span>
                        <span className="font-medium text-lg" style={{ color: 'var(--text)' }}>{studentInfo.name}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
                        <span className="font-semibold w-24" style={{ color: 'var(--muted)' }}>Roll No:</span>
                        <span className="font-medium text-lg" style={{ color: 'var(--text)' }}>{studentInfo.rollNumber}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
                        <span className="font-semibold w-24" style={{ color: 'var(--muted)' }}>Program:</span>
                        <span className="font-medium text-lg" style={{ color: 'var(--text)' }}>{studentInfo.program}</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
                        <span className="font-semibold w-24" style={{ color: 'var(--muted)' }}>Semester:</span>
                        <span className="font-medium text-lg" style={{ color: 'var(--text)' }}>{studentInfo.semesterInfo}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Modern Marksheet Tab */}
          {activeTab === "marksheet" && (
            <div className="p-8 pt-0">
              {/* Performance Summary Cards */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                  <TrendingUp size={24} className="text-green-600" /> Performance Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-xl border transition-all duration-300 hover:scale-105 hover:shadow-lg" 
                       style={{ backgroundColor: 'var(--hover)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold" style={{ color: 'var(--muted)' }}>CGPA / SGPA</span>
                      <BarChart2 size={20} className="text-green-600" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-green-600">{overallResult.cgpa}</span>
                      <span className="text-xl font-medium" style={{ color: 'var(--muted)' }}>/</span>
                      <span className="text-3xl font-bold text-blue-600">{overallResult.sgpa}</span>
                    </div>
                  </div>
                  
                  <div className="p-6 rounded-xl border transition-all duration-300 hover:scale-105 hover:shadow-lg" 
                       style={{ backgroundColor: 'var(--hover)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold" style={{ color: 'var(--muted)' }}>Total Credits</span>
                      <GraduationCap size={20} className="text-orange-600" />
                    </div>
                    <span className="text-3xl font-bold text-orange-600">{overallResult.totalCredits}</span>
                  </div>
                  
                  <div className="p-6 rounded-xl border transition-all duration-300 hover:scale-105 hover:shadow-lg" 
                       style={{ backgroundColor: 'var(--hover)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold" style={{ color: 'var(--muted)' }}>Result Status</span>
                      <Award size={20} className={overallResult.resultStatus === 'Passed' ? 'text-green-600' : 'text-red-600'} />
                    </div>
                    <span className={`text-3xl font-bold ${
                      overallResult.resultStatus === 'Passed' ? 'text-green-600' : 
                      overallResult.resultStatus === 'Distinction' ? 'text-green-700' : 
                      'text-red-600'
                    }`}>
                      {overallResult.resultStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modern Subject-wise Marks Section */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                  <Book size={24} className="text-blue-600" /> Subject-wise Marks (Internal)
                </h3>
                
                {/* Search Bar */}
                <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: 'var(--hover)', border: '1px solid var(--border)' }}>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by subject name or code..."
                      className="w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      style={{ backgroundColor: 'var(--input)', borderColor: 'var(--border)', color: 'var(--text)' }}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <User size={20} className="text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Modern Table */}
                <div className="rounded-xl border overflow-hidden shadow-lg" style={{ borderColor: 'var(--border)' }}>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y" style={{ backgroundColor: 'var(--card)' }}>
                      <thead style={{ backgroundColor: 'var(--accent)' }}>
                        <tr>
                          <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Sr.</th>
                          <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Code</th>
                          <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Subject</th>
                          <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">In-Sem I</th>
                          <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">In-Sem II</th>
                          <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Assignment</th>
                          <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Practical</th>
                          <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">End-Sem</th>
                          <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Total</th>
                          <th className="px-4 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y" style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}>
                        {pagedSubjects.map((subject, index) => (
                          <tr key={subject.id} className="transition-all duration-200 hover:scale-[1.02] hover:shadow-md" style={{ backgroundColor: index % 2 === 0 ? 'var(--card)' : 'var(--hover)' }}>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">{(page - 1) * rowsPerPage + index + 1}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{subject.code}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold">{subject.name}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                {subject.inSemI || 'N/A'}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                {subject.inSemII || 'N/A'}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                                {subject.assignment}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                              <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold">
                                {subject.practical}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-bold">
                                {subject.endSem}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                              <span className="px-3 py-2 bg-gray-100 text-gray-800 rounded-lg text-base font-bold">
                                {(subject.inSemI || 0) + (subject.inSemII || 0) + (subject.assignment || 0) + (subject.practical || 0) + (subject.endSem || 0)}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                              <span className={`px-3 py-2 rounded-lg text-base font-bold ${
                                subject.grade === 'A+' ? 'bg-green-100 text-green-800' :
                                subject.grade === 'A' ? 'bg-green-100 text-green-700' :
                                subject.grade === 'B+' ? 'bg-blue-100 text-blue-700' :
                                subject.grade === 'B' ? 'bg-yellow-100 text-yellow-700' :
                                subject.grade === 'C' ? 'bg-orange-100 text-orange-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {subject.grade}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Modern Pagination */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 p-4 rounded-xl" 
                     style={{ backgroundColor: 'var(--hover)', border: '1px solid var(--border)' }}>
                  <div style={{ color: 'var(--muted)' }}>
                    Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredSubjects.length)} of {filteredSubjects.length} subjects
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                      className="p-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105" 
                      style={{ backgroundColor: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' }}
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
                      style={{ backgroundColor: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' }}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modern Overall Result Section */}
          {activeTab === "overall" && (
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                <Award size={24} className="text-green-600" /> End Semester Result - {overallResult.semester}
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Performance Summary Card */}
                <div className="p-6 rounded-xl border transition-all duration-300 hover:shadow-lg" 
                     style={{ backgroundColor: 'var(--hover)', borderColor: 'var(--border)' }}>
                  <h4 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                    <TrendingUp size={20} className="text-green-600" />
                    Overall Performance Summary
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
                      <span className="font-medium" style={{ color: 'var(--muted)' }}>CGPA:</span>
                      <span className="text-2xl font-bold text-green-600">{overallResult.cgpa}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
                      <span className="font-medium" style={{ color: 'var(--muted)' }}>SGPA:</span>
                      <span className="text-2xl font-bold text-blue-600">{overallResult.sgpa}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
                      <span className="font-medium" style={{ color: 'var(--muted)' }}>Total Credits:</span>
                      <span className="text-2xl font-bold text-orange-600">{overallResult.totalCredits}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
                      <span className="font-medium" style={{ color: 'var(--muted)' }}>Result Status:</span>
                      <span className={`text-2xl font-bold ${
                        overallResult.resultStatus === 'Passed' ? 'text-green-600' :
                        overallResult.resultStatus === 'Distinction' ? 'text-green-700' :
                        'text-red-600'
                      }`}>{overallResult.resultStatus}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
                      <span className="font-medium" style={{ color: 'var(--muted)' }}>Semester:</span>
                      <span className="text-2xl font-bold text-purple-600">{overallResult.semester}</span>
                    </div>
                  </div>
                </div>
                
                {/* Subject-wise End-Sem Marks Card */}
                <div className="p-6 rounded-xl border transition-all duration-300 hover:shadow-lg" 
                     style={{ backgroundColor: 'var(--hover)', borderColor: 'var(--border)' }}>
                  <h4 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                    <Book size={20} className="text-blue-600" />
                    Subject-wise End-Sem Marks
                  </h4>
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                    {subjects.slice(0, 6).map((subject) => (
                      <div key={subject.id} className="flex justify-between items-center p-3 rounded-lg transition-colors duration-200" 
                           style={{ backgroundColor: 'var(--card)' }}>
                        <div>
                          <span className="font-medium block" style={{ color: 'var(--text)' }}>{subject.name}</span>
                          <span className="text-sm" style={{ color: 'var(--muted)' }}>({subject.code})</span>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                          {subject.endSem} / 80
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modern Analytics Section */}
          {activeTab === "analytics" && (
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                <BarChart2 size={24} className="text-blue-600" /> Performance Analytics
              </h3>
              
              {/* Analytics Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Class Comparison Card */}
                <div className="p-6 rounded-xl border transition-all duration-300 hover:shadow-xl" 
                     style={{ backgroundColor: 'var(--hover)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text)' }}>
                      <BarChart2 size={20} className="text-blue-600" />
                      Class Comparison
                    </h4>
                    <div className="p-2 rounded-lg bg-blue-100">
                      <BarChart2 size={24} className="text-blue-600" />
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
                      <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>Class Average</p>
                      <p className="text-xl font-bold text-blue-600">{classComparison.averageCgpa}</p>
                    </div>
                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
                      <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>Your Rank</p>
                      <p className="text-xl font-bold text-green-600">{classComparison.studentRank}/{classComparison.classSize}</p>
                    </div>
                  </div>
                  
                  {/* Chart */}
                  <div className="h-64 p-4 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
                    <Bar data={classComparisonData} options={chartOptions} />
                  </div>
                </div>
                
                {/* University Comparison Card */}
                <div className="p-6 rounded-xl border transition-all duration-300 hover:shadow-xl" 
                     style={{ backgroundColor: 'var(--hover)', borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text)' }}>
                      <PieChart size={20} className="text-purple-600" />
                      University Comparison
                    </h4>
                    <div className="p-2 rounded-lg bg-purple-100">
                      <PieChart size={24} className="text-purple-600" />
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
                      <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>University Average</p>
                      <p className="text-xl font-bold text-purple-600">{universityComparison.averageCgpa}</p>
                    </div>
                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
                      <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>Your Rank</p>
                      <p className="text-xl font-bold text-green-600">{universityComparison.studentRank}/{universityComparison.totalStudents}</p>
                    </div>
                  </div>
                  
                  {/* Chart */}
                  <div className="h-64 p-4 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
                    <Pie data={universityComparisonData} options={chartOptions} />
                  </div>
                </div>
              </div>
              
              {/* Additional Performance Insights */}
              <div className="mt-8 p-6 rounded-xl border" style={{ backgroundColor: 'var(--hover)', borderColor: 'var(--border)' }}>
                <h4 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                  <TrendingUp size={20} className="text-green-600" />
                  Performance Insights
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
                    <div className="text-2xl font-bold text-green-600 mb-2">{overallResult.cgpa > classComparison.averageCgpa ? '+' : ''}{(overallResult.cgpa - classComparison.averageCgpa).toFixed(1)}</div>
                    <div className="text-sm" style={{ color: 'var(--muted)' }}>Above Class Average</div>
                  </div>
                  <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
                    <div className="text-2xl font-bold text-blue-600 mb-2">{Math.round(((classComparison.classSize - classComparison.studentRank + 1) / classComparison.classSize) * 100)}%</div>
                    <div className="text-sm" style={{ color: 'var(--muted)' }}>Percentile in Class</div>
                  </div>
                  <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
                    <div className="text-2xl font-bold text-purple-600 mb-2">{overallResult.sgpa}</div>
                    <div className="text-sm" style={{ color: 'var(--muted)' }}>Current Semester GPA</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* Footer (Common to Marksheet and Overall, potentially) */}
        {(activeTab === "marksheet" || activeTab === "overall") && (
          <footer className="pt-8 mt-8 border-t border-gray-200 text-sm text-gray-600 flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p>Signature of Head of Department</p>
              <p>Date of Declaration: {new Date().toLocaleDateString()}</p>
            </div>
            <div className="text-center md:text-right">
              {/* Optional University Seal */}
              <img src="./image.png" alt="University Seal" className="w-24 h-auto mx-auto md:ml-auto mb-2" />
              <p className="italic text-gray-500">Disclaimer: This is a computer-generated result; no signature required.</p>
            </div>
          </footer>
        )}
        </div>
      </div>
    </div>
  );
}