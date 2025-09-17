import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Download, Upload, FileText, Clock, Book, Code, CheckCircle, AlertTriangle } from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

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
  const [assignments, setAssignments] = useState(initialAssignments);
  const [activeTab, setActiveTab] = useState("assignments");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const rowsPerPage = 6;

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
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size <= 4 * 1024 * 1024 && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Please upload a PDF file under 4MB.");
      e.target.value = null;
    }
  };

  const handleSubmitAssignment = () => {
    if (file && selectedAssignment) {
      console.log("Submitting assignment:", selectedAssignment.id, "with file:", file.name);
      setAssignments((prevAssignments) =>
        prevAssignments.map((assignment) =>
          assignment.id === selectedAssignment.id
            ? { ...assignment, submitted: true, submissionDate: new Date().toISOString().split("T")[0] }
            : assignment
        )
      );
      alert("Assignment submitted successfully!");
      closeModal();
    } else {
      alert("Please select a PDF file to submit.");
    }
  };

  return (
    <div className="p-6 min-h-screen font-sans" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="flex items-center mb-6">
        <img src="./image.png" alt="JECRC University Logo" className="w-20 h-8 mr-4" />
        <h2 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>Assignment Portal</h2>
      </div>

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
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>Upload Submission (Max 4MB PDF)</label>
                  <input type="file" accept="application/pdf" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-500 file:text-white hover:file:bg-blue-700" />
                  <button
                    onClick={handleSubmitAssignment}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
                    disabled={!file}
                  >
                    <Upload size={16} className="mr-2" /> Submit Assignment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}