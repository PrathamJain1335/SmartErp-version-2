import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Download, Upload, FileText, Clock, Book, Code, CheckCircle, AlertTriangle } from "lucide-react";
import { authAPI } from '../services/api';
import axios from 'axios';

// JECRC University branding colors
const jecrcColors = {
  primary: "#1E3A8A",
  secondary: "#10B981",
  accent: "#F59E0B",
  danger: "#EF4444",
  neutral: "#6B7280",
};

// Dummy data for assignments (10 subjects)
const initialAssignments = [
  { id: "asn1", subjectName: "Computer Networks", subjectCode: "CS401", assignmentNo: 1, dueDate: "2025-09-15", pdfUrl: "./Assignment02.pdf", submitted: false, submissionDate: null },
  { id: "asn2", subjectName: "Operating System", subjectCode: "CS402", assignmentNo: 2, dueDate: "2025-09-20", pdfUrl: "./Assignment02.pdf", submitted: false, submissionDate: null },
  { id: "asn3", subjectName: "Discrete Mathematics", subjectCode: "MA301", assignmentNo: 3, dueDate: "2025-09-25", pdfUrl: "./Assignment02.pdf", submitted: false, submissionDate: null },
  { id: "asn4", subjectName: "R Programming", subjectCode: "ST401", assignmentNo: 4, dueDate: "2025-10-01", pdfUrl: "./Assignment02.pdf/", submitted: false, submissionDate: null },
  { id: "asn5", subjectName: "Probabilistic Modelling Using Python", subjectCode: "ST402", assignmentNo: 5, dueDate: "2025-10-05", pdfUrl: "./Assignment02.pdf", submitted: false, submissionDate: null },
  { id: "asn6", subjectName: "Life Skills", subjectCode: "HS401", assignmentNo: 6, dueDate: "2025-10-10", pdfUrl: "./Assignment02.pdf/ls_assn6.pdf", submitted: false, submissionDate: null },
  { id: "asn7", subjectName: "Software Engineering And Project Management", subjectCode: "CS403", assignmentNo: 7, dueDate: "2025-10-15", pdfUrl: "./Assignment02.pdf", submitted: false, submissionDate: null },
  { id: "asn8", subjectName: "Data Structure and Algorithm", subjectCode: "CS404", assignmentNo: 8, dueDate: "2025-10-20", pdfUrl: "./Assignment02.pdf", submitted: false, submissionDate: null },
  { id: "asn9", subjectName: "Computer Networks", subjectCode: "CS401", assignmentNo: 2, dueDate: "2025-10-25", pdfUrl: "./Assignment02.pdf", submitted: false, submissionDate: null },
  { id: "asn10", subjectName: "Operating System", subjectCode: "CS402", assignmentNo: 3, dueDate: "2025-10-30", pdfUrl: "./Assignment02.pdf", submitted: false, submissionDate: null },
];


export default function Assignment() {
  const [assignments, setAssignments] = useState([]);
  const [activeTab, setActiveTab] = useState("assignments");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [submissionText, setSubmissionText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const rowsPerPage = 6;

  // API Configuration
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  
  // Get current user on component mount
  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    setUser({
      id: currentUser.userId,
      role: currentUser.role,
      name: currentUser.profile?.name || 'Student'
    });
  }, []);
  
  // Set up axios default headers
  useEffect(() => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // Fetch assignments from API
  useEffect(() => {
    if (user?.id) {
      fetchAssignments();
    }
  }, [user]);

  const fetchAssignments = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/assignments/student/${user.id}`);
      if (response.data.success) {
        setAssignments(response.data.data.assignments || []);
      } else {
        // Fallback to mock data if API fails
        setAssignments(initialAssignments);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
      setError('Failed to load assignments');
      // Use mock data as fallback
      setAssignments(initialAssignments);
    } finally {
      setLoading(false);
    }
  };

  const filterData = (data) => {
    return data.filter((item) =>
      (searchTerm ? item.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) || item.subjectCode.toLowerCase().includes(searchTerm.toLowerCase()) : true)
    );
  };

  const filteredAssignments = filterData(assignments);
  const pagedAssignments = filteredAssignments.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const maxPage = Math.ceil(filteredAssignments.length / rowsPerPage);

  const handleViewAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedAssignment(null);
    setFile(null);
    setSubmissionText("");
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file size (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("Please upload a file under 5MB.");
        e.target.value = null;
        return;
      }
      
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert("Please upload a PDF, DOC, or DOCX file.");
        e.target.value = null;
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleSubmitAssignment = async () => {
    if (!selectedAssignment) {
      alert("No assignment selected.");
      return;
    }

    if (!file && !submissionText.trim()) {
      alert("Please upload a file or enter submission text.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      if (file) {
        formData.append('assignmentFile', file);
      }
      if (submissionText.trim()) {
        formData.append('submissionText', submissionText.trim());
      }

      const response = await axios.put(
        `${API_BASE_URL}/assignments/${selectedAssignment.id}/submit`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        // Update local assignments state
        setAssignments((prevAssignments) =>
          prevAssignments.map((assignment) =>
            assignment.id === selectedAssignment.id
              ? { 
                  ...assignment, 
                  submitted: true, 
                  status: 'submitted',
                  submissionDate: new Date().toISOString().split("T")[0],
                  submittedDate: new Date().toISOString().split("T")[0]
                }
              : assignment
          )
        );
        
        alert(response.data.message || "Assignment submitted successfully!");
        closeModal();
      } else {
        alert(response.data.message || "Failed to submit assignment.");
      }
    } catch (error) {
      console.error('Error submitting assignment:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed to submit assignment. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="p-6 min-h-screen font-sans flex items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--accent)' }}></div>
          <p style={{ color: 'var(--text)' }}>Loading assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen font-sans" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="flex items-center mb-6">
        <img src="./image.png" alt="JECRC University Logo" className="w-20 h-8 mr-4" />
        <h2 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>Assignment Portal</h2>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-md border" style={{ backgroundColor: 'var(--accent-light)', borderColor: 'var(--danger)', color: 'var(--danger)' }}>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6 overflow-x-auto p-2 rounded-lg shadow-md" style={{ backgroundColor: 'var(--card)' }}>
        {["assignments", "submitted", "notifications"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 rounded-md transition duration-200 flex items-center gap-2"
            style={activeTab === tab ? 
              { backgroundColor: 'var(--accent)', color: 'white' } : 
              { color: 'var(--text)', backgroundColor: 'transparent' }
            }
          >
            {tab === "assignments" && <FileText size={16} />}
            {tab === "submitted" && <CheckCircle size={16} />}
            {tab === "notifications" && <AlertTriangle size={16} />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Assignments Section */}
      {activeTab === "assignments" && (
        <div>
          <div className="flex items-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by subject or code..."
              className="border rounded-md p-2 w-full md:w-64 focus:outline-none focus:ring-2" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pagedAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="p-6 rounded-lg shadow-md border cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:scale-105 hover:rotate-2 perspective-1000"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', perspective: "1000px" }}
                onClick={() => handleViewAssignment(assignment)}
              >
                <div className="flex flex-col items-center text-center">
                  <Book size={40} className="mb-4" style={{ color: 'var(--accent)' }} />
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>{assignment.subjectName}</h3>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>Code: {assignment.subjectCode}</p>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>Assignment #{assignment.assignmentNo}</p>
                  <p className="text-sm mt-2" style={{ color: 'var(--accent)' }}>
                    <Clock size={16} className="inline mr-1" /> Due: {assignment.dueDate}
                  </p>
                  <div className="mt-4 p-2 rounded-full" style={{ backgroundColor: 'var(--soft)' }}>
                    <Download size={20} style={{ color: 'var(--accent)' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6" style={{ color: 'var(--muted)' }}>
            <span>
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredAssignments.length)} of {filteredAssignments.length} assignments
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 rounded-full disabled:opacity-50 transition" style={{ backgroundColor: 'var(--hover)', color: 'var(--text)' }}
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-4">{page}</span>
              <button
                disabled={page === maxPage}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 rounded-full disabled:opacity-50 transition" style={{ backgroundColor: 'var(--hover)', color: 'var(--text)' }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submitted Assignments Section */}
      {activeTab === "submitted" && (
        <div>
          <div className="flex items-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Search submitted assignments..."
              className="border rounded-md p-2 w-full md:w-64 focus:outline-none focus:ring-2" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssignments
              .filter((a) => a.submitted)
              .slice((page - 1) * rowsPerPage, page * rowsPerPage)
              .map((assignment) => (
                <div
                  key={assignment.id}
                  className="p-6 rounded-lg shadow-md border cursor-pointer transform transition-all duration-300 hover:shadow-xl hover:scale-105 hover:rotate-2 perspective-1000"
                  style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', perspective: "1000px" }}
                  onClick={() => handleViewAssignment(assignment)}
                >
                  <div className="flex flex-col items-center text-center">
                    <CheckCircle size={40} className="text-green-500 mb-4" />
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>{assignment.subjectName}</h3>
                    <p className="text-sm" style={{ color: 'var(--muted)' }}>Code: {assignment.subjectCode}</p>
                    <p className="text-sm" style={{ color: 'var(--muted)' }}>Assignment #{assignment.assignmentNo}</p>
                    <p className="text-sm text-green-500 mt-2">
                      <Clock size={16} className="inline mr-1" /> Submitted: {assignment.submissionDate}
                    </p>
                  </div>
                </div>
              ))}
          </div>
          <div className="flex justify-between mt-6" style={{ color: 'var(--muted)' }}>
            <span>
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredAssignments.filter((a) => a.submitted).length)} of {filteredAssignments.filter((a) => a.submitted).length} submitted assignments
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2 rounded-full disabled:opacity-50 transition" style={{ backgroundColor: 'var(--hover)', color: 'var(--text)' }}
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-4">{page}</span>
              <button
                disabled={page === maxPage}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 rounded-full disabled:opacity-50 transition" style={{ backgroundColor: 'var(--hover)', color: 'var(--text)' }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Section */}
      {activeTab === "notifications" && (
        <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: 'var(--card)' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>Notifications</h3>
          <ul className="space-y-4">
            <li className="flex items-center justify-between p-3 rounded-md" style={{ backgroundColor: 'var(--hover)' }}>
              <span style={{ color: 'var(--text)' }}>New assignment uploaded for Computer Networks (CS401)</span>
              <span className="text-sm" style={{ color: 'var(--muted)' }}>10:12 PM, 09-10-2025</span>
            </li>
            <li className="flex items-center justify-between p-3 rounded-md" style={{ backgroundColor: 'var(--hover)' }}>
              <span style={{ color: 'var(--text)' }}>Submission deadline approaching for Operating System (CS402)</span>
              <span className="text-sm" style={{ color: 'var(--muted)' }}>10:00 AM, 09-10-2025</span>
            </li>
          </ul>
        </div>
      )}

      {/* Modal for Assignment Details */}
      {modalOpen && selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="rounded-xl shadow-xl w-11/12 md:w-3/4 lg:w-1/2 p-6 relative" style={{ backgroundColor: 'var(--card)' }}>
            <button onClick={closeModal} className="absolute top-2 right-2 text-xl hover:text-red-400" style={{ color: 'var(--muted)' }}>&times;</button>
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text)' }}>Assignment Details</h2>
            <div className="space-y-4" style={{ color: 'var(--text)' }}>
              <p><strong>Subject Name:</strong> {selectedAssignment.subjectName}</p>
              <p><strong>Subject Code:</strong> {selectedAssignment.subjectCode}</p>
              <p><strong>Assignment No:</strong> {selectedAssignment.assignmentNo}</p>
              <p><strong>Due Date:</strong> {selectedAssignment.dueDate}</p>
              <p><strong>Status:</strong> {selectedAssignment.submitted ? `Submitted on ${selectedAssignment.submissionDate}` : "Not Submitted"}</p>
              <div>
                <a href={selectedAssignment.pdfUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center" style={{ color: 'var(--accent)' }}>
                  <Download size={16} className="mr-1" /> View Assignment PDF
                </a>
              </div>
              {!selectedAssignment.submitted && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>Submission Text (Optional)</label>
                    <textarea
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                      placeholder="Enter any comments or text submission here..."
                      className="w-full p-3 border rounded-md resize-none h-24 focus:outline-none focus:ring-2"
                      style={{ 
                        backgroundColor: 'var(--input)', 
                        borderColor: 'var(--border)', 
                        color: 'var(--text)',
                        focusRingColor: 'var(--accent)'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>Upload File (Max 5MB - PDF, DOC, DOCX)</label>
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                      onChange={handleFileChange} 
                      className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:text-white hover:file:opacity-80 transition-opacity"
                      style={{
                        color: 'var(--text)',
                        backgroundColor: 'var(--input)',
                        '--file-bg': 'var(--accent)',
                        '--file-hover-bg': 'var(--accent-hover)'
                      }}
                    />
                    
                    {file && (
                      <div className="mt-2 p-2 rounded" style={{ backgroundColor: 'var(--soft)', color: 'var(--text)' }}>
                        <p className="text-sm">
                          <strong>Selected:</strong> {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={handleSubmitAssignment}
                    disabled={submitting || (!file && !submissionText.trim())}
                    className="w-full py-3 rounded-md font-medium flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      backgroundColor: (!file && !submissionText.trim()) || submitting ? 'var(--muted)' : 'var(--accent)', 
                      color: 'white'
                    }}
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Upload size={16} /> Submit Assignment
                      </>
                    )}
                  </button>
                  
                  {(!file && !submissionText.trim()) && (
                    <p className="text-sm text-center" style={{ color: 'var(--muted)' }}>
                      Please upload a file or enter submission text to submit
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}