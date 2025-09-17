import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  AccessTime as AccessTimeIcon,
  Announcement as AnnouncementIcon,
  Assignment as AssignmentIcon,
  Event as EventIcon,
  LibraryBooks as LibraryBooksIcon,
  Work as WorkIcon,
  Grade as GradeIcon,
  Link as LinkIcon,
  Cloud as CloudIcon,
  Upload as UploadIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
} from "@mui/icons-material";
import { BarChart as BarChartIcon } from '@mui/icons-material';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard({ data, handlers }) {
  const { profile, courses, attendance, assignments, exams, results, notifications } = data;

  // Sample subjects from JECRC University (based on research: B.Tech CSE courses)
  const subjects = [
    { name: "Introduction to Programming", attendance: 85 },
    { id: "sub2", name: "Data Structures", attendance: 92 },
    { id: "sub3", name: "Algorithms", attendance: 78 },
    { id: "sub4", name: "Database Management", attendance: 88 },
    { id: "sub5", name: "Computer Networks", attendance: 95 },
  ];

  // Calculate overall attendance
  const totalClasses = attendance.length;
  const attendedClasses = attendance.filter((a) => a.present).length;
  const attendancePercentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;

  // Chart data for overall attendance
  const attendanceChartData = {
    labels: ["Attended", "Missed"],
    datasets: [
      {
        data: [attendancePercentage, 100 - attendancePercentage],
        backgroundColor: ['var(--accent)', 'var(--muted)'],
        borderWidth: 0,
      },
    ],
  };

  // State for modals
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // State for upload files
  const [selectedFiles, setSelectedFiles] = useState({});

  const handleFileChange = (e, assignmentId) => {
    const file = e.target.files[0];
    if (file && file.size <= 4 * 1024 * 1024) { // 4 MB limit
      setSelectedFiles((prev) => ({ ...prev, [assignmentId]: file }));
      console.log(`Uploaded file for assignment ${assignmentId}: ${file.name}`);
      // Integrate with handlers if needed, e.g., handlers.submitAssignment(assignmentId);
    } else {
      alert("File size exceeds 4 MB limit.");
    }
  };

  const handleAnnouncementClick = (notif) => {
    setSelectedAnnouncement(notif);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedAnnouncement(null);
  };

  // Sample schedule with statuses
  const schedule = [
    { id: "class1", subject: "Lecture 01: Advanced Mathematics", time: "8:00 AM - 8:50 AM | Room 201", status: "Ongoing" },
    { id: "class2", subject: "Lecture 02: Physics II", time: "8:50 AM - 9:40 AM | Room 305", status: "Upcoming" },
    { id: "class3", subject: "Lecture 03: Chemistry Fundamentals", time: "9:40 AM - 10:30 AM | Lab A", status: "Upcoming" },
    { id: "class4", subject: "Lecture 04: Data Structures", time: "10:30 AM - 11:20 AM | Room 402", status: "No Class" },
    { id: "class5", subject: "Lecture 05: Algorithms", time: "11:20 AM - 12:05 PM | Room 201", status: "Cancelled" },
    { id: "class6", subject: "Lecture 06: Computer Networks", time: "12:05 PM - 12:50 PM | Room 305", status: "Upcoming" },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "Ongoing":
        return <CheckCircleIcon className="text-green-600" />;
      case "Upcoming":
        return <HourglassEmptyIcon className="text-blue-600" />;
      case "Cancelled":
        return <CancelIcon className="text-red-600" />;
      case "No Class":
        return <CancelIcon className="text-gray-600" />;
      default:
        return null;
    }
  };

  // Sample assignments with subjects and numbers
  const sampleAssignments = [
    { id: "as1", subject: "Computer Organization Design ", number: 3, title: "Mathematics Assignment 3", dueDate: "2025-09-11", submitted: false },
    { id: "as2", subject: "Data Structure and Algorithm", number: 1, title: "Physics Lab Report", dueDate: "2025-09-14", submitted: false },
    { id: "as3", subject: "Computer Networks", number: 2, title: "Chemistry Problem Set", dueDate: "2025-09-16", submitted: false },
    { id: "as4", subject: "Operating System", number: 4, title: "DS Coding Challenge", dueDate: "2025-09-18", submitted: false },
    { id: "as5", subject: "Software Engineering and Project Management", number: 5, title: "Algorithm Analysis", dueDate: "2025-09-20", submitted: false },
  ];

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      {/* Header */}
      <div className="flex items-center mb-6">
        <img src="/image.png" alt="JECRC University Logo" className="w-20 h-8 mr-4" />
        <div>
          <h2 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>Student Dashboard</h2>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Welcome back, {profile?.name || 'Student'}!</p>
        </div>
      </div>

      {/* Modern Welcome Section */}
      <div className="mb-8 p-6 rounded-lg shadow-lg text-white" style={{ background: 'linear-gradient(135deg, var(--accent), var(--secondary))' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Good Day, {profile?.name?.split(' ')[0] || 'Student'}!</h1>
            <p className="text-lg opacity-90">You have {sampleAssignments.filter(a => !a.submitted).length} pending assignments and {exams.length} upcoming exams</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <CloudIcon className="text-white" size={24} />
              <span className="text-lg font-semibold">24°C</span>
            </div>
            <p className="text-sm opacity-75">Sunny Day in Jaipur</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>Quick Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Attendance Card */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
            <div className="flex items-center gap-2 mb-2">
              <BarChartIcon className="h-5 w-5" style={{ color: 'var(--accent)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>Attendance</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{attendancePercentage}%</p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>Overall</p>
              </div>
              <div className="relative w-16 h-16">
                <Doughnut
                  data={attendanceChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "70%",
                    plugins: {
                      legend: { display: false },
                      tooltip: { enabled: false },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Assignments Card */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
            <div className="flex items-center gap-2 mb-2">
              <AssignmentIcon className="h-5 w-5" style={{ color: 'var(--accent)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>Assignments</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
              {sampleAssignments.filter((a) => !a.submitted).length}
            </p>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>Pending ({sampleAssignments.length} Total)</p>
          </div>

          {/* Exams Card */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
            <div className="flex items-center gap-2 mb-2">
              <EventIcon className="h-5 w-5" style={{ color: 'var(--accent)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>Upcoming Exams</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{exams.length}</p>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>Next: {exams[0]?.date || "N/A"}</p>
          </div>

          {/* Results Card */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
            <div className="flex items-center gap-2 mb-2">
              <GradeIcon className="h-5 w-5" style={{ color: 'var(--accent)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>Results</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{results.length}</p>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>Latest: {results[0]?.semester || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Announcements with Clickable Modals */}
      <div className="mb-6 p-4 rounded-lg shadow-lg" style={{ backgroundColor: 'var(--card)' }}>
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <AnnouncementIcon className="mr-2" style={{ color: 'var(--accent)' }} /> Announcements
        </h3>
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="mb-3 p-3 rounded-md cursor-pointer transition-colors"
            style={{ backgroundColor: 'var(--soft)' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--hover)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--soft)'}
            onClick={() => handleAnnouncementClick(notif)}
          >
            <p className="font-medium" style={{ color: 'var(--text)' }}>{notif.title}</p>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>Posted {notif.timestamp}</p>
          </div>
        ))}
      </div>

      {/* Modal for Full Announcement */}
      {modalOpen && selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="rounded-xl shadow-xl w-3/4 max-w-lg p-6 relative" style={{ backgroundColor: 'var(--card)' }}>
            <button 
              onClick={closeModal} 
              className="absolute top-2 right-2 text-xl transition-colors" 
              style={{ color: 'var(--muted)' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--accent)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--muted)'}
            >&times;</button>
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text)' }}>{selectedAnnouncement.title}</h2>
            <p style={{ color: 'var(--text)' }}><strong>Posted:</strong> {selectedAnnouncement.timestamp}</p>
            <p className="mt-2" style={{ color: 'var(--text)' }}>{selectedAnnouncement.content}</p>
          </div>
        </div>
      )}

      {/* Schedule Section */}
      <div className="mb-6 p-4 rounded-lg shadow-lg" style={{ backgroundColor: 'var(--card)' }}>
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>Today's Schedule</h3>
        {schedule.map((classItem) => (
          <div
            key={classItem.id}
            className="mb-2 p-2 border-b flex justify-between items-start last:border-0"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="flex items-start gap-2">
              <AccessTimeIcon className="mt-1" style={{ color: 'var(--muted)' }} />
              <div>
                <p className="font-medium" style={{ color: 'var(--text)' }}>{classItem.subject}</p>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>{classItem.time}</p>
              </div>
            </div>
            <span 
              className="px-2 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: classItem.status === "Ongoing" ? 'var(--success)' :
                  classItem.status === "Upcoming" ? 'var(--info)' :
                  classItem.status === "Cancelled" ? 'var(--danger)' : 'var(--muted)',
                color: 'white'
              }}
            >
              {classItem.status}
            </span>
          </div>
        ))}
      </div>

      {/* Overall Attendance with Circular Chart */}
      <div className="mb-6 p-4 rounded-lg shadow-lg" style={{ backgroundColor: 'var(--card)' }}>
        <h4 className="text-md font-medium mb-2" style={{ color: 'var(--text)' }}>Individual Subject Attendance</h4>
        <ul>
          {subjects.map((subject) => (
            <li key={subject.id} className="mb-2 p-2 rounded-md flex justify-between" style={{ backgroundColor: 'var(--soft)' }}>
              <span style={{ color: 'var(--text)' }}>{subject.name}</span>
              <span className="font-medium" style={{ color: 'var(--text)' }}>{subject.attendance}%</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Pending Assignments */}
      <div className="mb-6 p-4 rounded-lg shadow-lg" style={{ backgroundColor: 'var(--card)' }}>
        <div className="flex items-center mb-3">
          <AssignmentIcon className="mr-2" style={{ color: 'var(--accent)' }} />
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Pending Assignments</h2>
        </div>
        {sampleAssignments.map((assignment) => (
          <div
            key={assignment.id}
            className="mb-3 p-3 rounded-md transition-colors"
            style={{ backgroundColor: 'var(--soft)' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--hover)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--soft)'}
          >
            <p className="font-medium" style={{ color: 'var(--text)' }}>{assignment.subject} Assignment {assignment.number}</p>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>
              {assignment.title} - Due in {Math.ceil((new Date(assignment.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} days
            </p>
            <label 
              className="mt-2 px-3 py-1 text-white rounded cursor-pointer flex items-center gap-1 transition-colors"
              style={{ backgroundColor: 'var(--accent)' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--secondary)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--accent)'}
            >
              <UploadIcon fontSize="small" /> Upload PDF (max 4MB)
              <input
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, assignment.id)}
              />
            </label>
            {selectedFiles[assignment.id] && (
              <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                Selected: {selectedFiles[assignment.id].name}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Upcoming Exams */}
      <div className="mb-6 p-4 rounded-lg shadow-lg" style={{ backgroundColor: 'var(--card)' }}>
        <div className="flex items-center mb-3">
          <EventIcon className="mr-2" style={{ color: 'var(--accent)' }} />
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Upcoming Exams</h2>
        </div>
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="mb-3 p-3 rounded-md cursor-pointer transition-colors"
            style={{ backgroundColor: 'var(--soft)' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--hover)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--soft)'}
          >
            <p className="font-medium" style={{ color: 'var(--text)' }}>{exam.title} - {exam.course}</p>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>Date: {exam.date}</p>
          </div>
        ))}
      </div>

      {/* Library Due Items */}
      <div className="mb-6 p-4 rounded-lg shadow-lg" style={{ backgroundColor: 'var(--card)' }}>
        <div className="flex items-center mb-3">
          <LibraryBooksIcon className="mr-2" style={{ color: 'var(--accent)' }} />
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Library Due Items</h2>
        </div>
        <p style={{ color: 'var(--muted)' }}>No due items currently.</p>
      </div>

      {/* Career Opportunities */}
      <div className="mb-6 p-4 rounded-lg shadow-lg" style={{ backgroundColor: 'var(--card)' }}>
        <div className="flex items-center mb-3">
          <WorkIcon className="mr-2" style={{ color: 'var(--accent)' }} />
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Career Opportunities</h2>
        </div>
        <p style={{ color: 'var(--muted)' }}>No new opportunities at the moment.</p>
      </div>

      {/* Recent Grades */}
      <div className="mb-6 p-4 rounded-lg shadow-lg" style={{ backgroundColor: 'var(--card)' }}>
        <div className="flex items-center mb-3">
          <GradeIcon className="mr-2" style={{ color: 'var(--accent)' }} />
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Recent Grades</h2>
        </div>
        {results.map((result) => (
          <div
            key={result.id}
            className="mb-3 p-3 rounded-md cursor-pointer transition-colors"
            style={{ backgroundColor: 'var(--soft)' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--hover)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--soft)'}
          >
            <p className="font-medium" style={{ color: 'var(--text)' }}>{result.course}: {result.grade}</p>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>Semester: {result.semester}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="mb-6 p-4 rounded-lg shadow-lg col-span-1 md:col-span-2 lg:col-span-3" style={{ backgroundColor: 'var(--card)' }}>
        <div className="flex items-center mb-3">
          <LinkIcon className="mr-2" style={{ color: 'var(--accent)' }} />
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Quick Links</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="#" className="hover:underline" style={{ color: 'var(--accent)' }}>University Portal</a>
          <a href="#" className="hover:underline" style={{ color: 'var(--accent)' }}>Course Registration</a>
          <a href="#" className="hover:underline" style={{ color: 'var(--accent)' }}>Fee Payment</a>
          <a href="#" className="hover:underline" style={{ color: 'var(--accent)' }}>Library Catalog</a>
        </div>
      </div>
    </div>
  );
}