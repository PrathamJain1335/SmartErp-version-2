import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Upload, Edit, Download, Plus, Search, Calendar, AlertTriangle, BarChart2, PieChart as PieChartIcon, FileText, Users, Bot, TrendingUp, Mic, Scan, BookOpen, ThumbsUp, Group, MessageSquare, LucideTimer, Lightbulb } from "lucide-react";
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
import { Message } from "@mui/icons-material";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler, zoomPlugin);

// JECRC University branding colors
const jecrcColors = {
  primary: "#1E3A8A",
  secondary: "#10B981",
  accent: "#F59E0B",
  danger: "#EF4444",
  neutral: "#6B7280",
};

// Dummy data for JECRC Student Library
const initialBooks = [
  { id: "1", title: "Introduction to Algorithms", author: "Thomas H. Cormen", isbn: "9780262033848", type: "Print", status: "Available", category: "Computer Science" },
  { id: "2", title: "Quantum Mechanics", author: "David J. Griffiths", isbn: "9781107189638", type: "E-Book", status: "Available", category: "Physics" },
  { id: "3", title: "Thermodynamics", author: "Yunus Cengel", isbn: "9780073398174", type: "Print", status: "Borrowed", category: "Mechanical Engineering" },
  { id: "4", title: "Constitutional Law", author: "VN Shukla", isbn: "9789388822299", type: "E-Book", status: "Available", category: "Law" },
  { id: "5", title: "Principles of Management", author: "Peter Drucker", isbn: "9780060855865", type: "Print", status: "Available", category: "Business" },
  { id: "6", title: "Design Thinking", author: "Tim Brown", isbn: "9780061766084", type: "E-Book", status: "Borrowed", category: "Design" },
  { id: "7", title: "History of India", author: "Romila Thapar", isbn: "9780143104124", type: "Print", status: "Available", category: "Humanities" },
  { id: "8", title: "Nursing Fundamentals", author: "Barbara Kozier", isbn: "9780133974362", type: "E-Book", status: "Available", category: "Health Sciences" },
  { id: "9", title: "Database Systems", author: "Abraham Silberschatz", isbn: "9780078022159", type: "Print", status: "Borrowed", category: "Computer Applications" },
  { id: "10", title: "Organic Chemistry", author: "Jonathan Clayden", isbn: "9780198503460", type: "E-Book", status: "Available", category: "Chemistry" },
  { id: "11", title: "Structural Analysis", author: "R.C. Hibbeler", isbn: "9780134610672", type: "Print", status: "Available", category: "Civil Engineering" },
  { id: "12", title: "International Law", author: "Malcolm Shaw", isbn: "9781107612495", type: "E-Book", status: "Borrowed", category: "Law" },
  { id: "13", title: "Engineering Mathematics", author: "B.S. Grewal", isbn: "9788193328491", type: "Print", status: "Available", category: "Engineering" },
  { id: "14", title: "Digital Electronics", author: "Morris Mano", isbn: "9789332580060", type: "E-Book", status: "Available", category: "Electronics" },
  { id: "15", title: "Financial Management", author: "Prasanna Chandra", isbn: "9789352605590", type: "Print", status: "Borrowed", category: "Business" },
  { id: "16", title: "Graphic Design Basics", author: "David Dabner", isbn: "9780500519523", type: "E-Book", status: "Available", category: "Design" },
  { id: "17", title: "Sociology", author: "Anthony Giddens", isbn: "9780745643588", type: "Print", status: "Available", category: "Social Sciences" },
  { id: "18", title: "Human Anatomy", author: "Elaine Marieb", isbn: "9780135168059", type: "E-Book", status: "Borrowed", category: "Health Sciences" },
  { id: "19", title: "Computer Networks", author: "Andrew Tanenbaum", isbn: "9789332518742", type: "Print", status: "Available", category: "Computer Science" },
  { id: "20", title: "Physical Chemistry", author: "P.W. Atkins", isbn: "9780198817895", type: "E-Book", status: "Available", category: "Chemistry" },
  { id: "21", title: "Geotechnical Engineering", author: "Braja M. Das", isbn: "9781305970939", type: "Print", status: "Borrowed", category: "Civil Engineering" },
  { id: "22", title: "Criminal Law", author: "K.D. Gaur", isbn: "9788131253649", type: "E-Book", status: "Available", category: "Law" },
  { id: "23", title: "Linear Algebra", author: "Gilbert Strang", isbn: "9780980232776", type: "Print", status: "Available", category: "Mathematics" },
  { id: "24", title: "Power Systems", author: "Leonard L. Grigsby", isbn: "9781439856338", type: "E-Book", status: "Borrowed", category: "Electrical Engineering" },
  { id: "25", title: "Marketing Management", author: "Philip Kotler", isbn: "9780133856460", type: "Print", status: "Available", category: "Business" },
  { id: "26", title: "UI/UX Design", author: "Steve Krug", isbn: "9780321965516", type: "E-Book", status: "Available", category: "Design" },
  { id: "27", title: "Psychology", author: "Saundra Ciccarelli", isbn: "9780205972241", type: "Print", status: "Borrowed", category: "Social Sciences" },
  { id: "28", title: "Physiotherapy", author: "Susan B. O'Sullivan", isbn: "9780803661134", type: "E-Book", status: "Available", category: "Health Sciences" },
  { id: "29", title: "Software Engineering", author: "Ian Sommerville", isbn: "9780133943030", type: "Print", status: "Available", category: "Computer Science" },
  { id: "30", title: "Inorganic Chemistry", author: "J.D. Lee", isbn: "9788126566358", type: "E-Book", status: "Borrowed", category: "Chemistry" },
];

const initialBorrowHistory = [
  { id: "1", title: "Introduction to Algorithms", borrowDate: "2025-09-01", dueDate: "2025-09-15", returned: false, fine: 0 },
  { id: "2", title: "Quantum Mechanics", borrowDate: "2025-09-05", dueDate: "2025-09-20", returned: true, fine: 0 },
  { id: "3", title: "Thermodynamics", borrowDate: "2025-09-10", dueDate: "2025-09-25", returned: false, fine: 50 },
  { id: "4", title: "Constitutional Law", borrowDate: "2025-09-12", dueDate: "2025-09-27", returned: false, fine: 0 },
  { id: "5", title: "Principles of Management", borrowDate: "2025-09-15", dueDate: "2025-09-30", returned: true, fine: 0 },
  { id: "6", title: "Design Thinking", borrowDate: "2025-09-18", dueDate: "2025-10-03", returned: false, fine: 0 },
  { id: "7", title: "History of India", borrowDate: "2025-09-20", dueDate: "2025-10-05", returned: false, fine: 0 },
  { id: "8", title: "Nursing Fundamentals", borrowDate: "2025-09-22", dueDate: "2025-10-07", returned: true, fine: 0 },
  { id: "9", title: "Database Systems", borrowDate: "2025-09-25", dueDate: "2025-10-10", returned: false, fine: 0 },
  { id: "10", title: "Organic Chemistry", borrowDate: "2025-09-28", dueDate: "2025-10-13", returned: false, fine: 0 },
  { id: "11", title: "Structural Analysis", borrowDate: "2025-09-30", dueDate: "2025-10-15", returned: true, fine: 0 },
  { id: "12", title: "International Law", borrowDate: "2025-10-02", dueDate: "2025-10-17", returned: false, fine: 0 },
  // Add more up to 30
];

const initialFines = [
  { id: "1", book: "Thermodynamics", amount: 50, dueDate: "2025-09-25", status: "Unpaid" },
  { id: "2", book: "Design Thinking", amount: 30, dueDate: "2025-10-03", status: "Unpaid" },
  // Add more
];

const initialDigitalResources = [
  { id: "1", title: "DELNET E-Journals", type: "Journal", access: "Online" },
  { id: "2", title: "NPTEL Videos", type: "Video", access: "Online" },
  { id: "3", title: "IEEE Xplore", type: "Database", access: "Online" },
  { id: "4", title: "EBSCO E-Books", type: "E-Book", access: "Online" },
  { id: "5", title: "ProQuest Theses", type: "Theses", access: "Online" },
  { id: "6", title: "Shodhganga", type: "Theses", access: "Online" },
  { id: "7", title: "JSTOR", type: "Journal", access: "Online" },
  { id: "8", title: "SpringerLink", type: "Journal", access: "Online" },
  { id: "9", title: "ScienceDirect", type: "Journal", access: "Online" },
  { id: "10", title: "Wiley Online Library", type: "Journal", access: "Online" },
  // Add more up to 30
];

const initialRecommendations = [
  { id: "1", title: "Introduction to Algorithms", category: "Computer Science" },
  { id: "2", title: "Clean Code", category: "Skill Development" },
  // Add more
];

const initialStudyGroups = [
  { id: "1", book: "Introduction to Algorithms", members: 5, meetingDate: "2025-09-15" },
  { id: "2", book: "Quantum Mechanics", members: 3, meetingDate: "2025-09-20" },
  // Add more
];

const initialReadingProgress = initialBorrowHistory.map((h) => ({
  id: h.id,
  progress: Math.floor(Math.random() * 100),
}));

const initialFeedback = initialBooks.map((b) => ({
  id: b.id,
  feedback: "Great book for beginners.",
}));

export default function StudentLibrary() {
  const [activeTab, setActiveTab] = useState("catalog");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const rowsPerPage = 5;

  // State for books, borrow history, fines, etc.
  const [books, setBooks] = useState(initialBooks);
  const [borrowHistory, setBorrowHistory] = useState(initialBorrowHistory);
  const [fines, setFines] = useState(initialFines);
  const [digitalResources, setDigitalResources] = useState(initialDigitalResources);
  const [recommendations, setRecommendations] = useState(initialRecommendations);
  const [studyGroups, setStudyGroups] = useState(initialStudyGroups);
  const [readingProgress, setReadingProgress] = useState(initialReadingProgress);
  const [feedback, setFeedback] = useState(initialFeedback);

  // Advanced Charts Data
  const borrowTrendData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    datasets: [
      {
        label: "Borrowed Books",
        data: [20, 35, 50, 65, 75, 85, 90, 95, 98],
        borderColor: jecrcColors.primary,
        fill: true,
        backgroundColor: "rgba(30, 58, 138, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const categoryDistributionData = {
    labels: ["Computer Science", "Physics", "Mechanical", "Law", "Business"],
    datasets: [
      {
        data: [30, 25, 20, 15, 10],
        backgroundColor: [jecrcColors.primary, jecrcColors.secondary, jecrcColors.accent, jecrcColors.danger, jecrcColors.neutral],
      },
    ],
  };

  const filterData = (data) => {
    return data.filter((item) => 
      (searchTerm ? Object.values(item).some((val) => val.toString().toLowerCase().includes(searchTerm.toLowerCase())) : true)
    );
  };

  const filteredBooks = filterData(books);
  const filteredBorrowHistory = filterData(borrowHistory);
  const filteredFines = filterData(fines);
  const filteredDigitalResources = filterData(digitalResources);
  const filteredRecommendations = filterData(recommendations);
  const filteredStudyGroups = filterData(studyGroups);
  const filteredReadingProgress = filterData(readingProgress);
  const filteredFeedback = filterData(feedback);

  const pagedBooks = filteredBooks.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pagedBorrowHistory = filteredBorrowHistory.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pagedFines = filteredFines.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pagedDigitalResources = filteredDigitalResources.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pagedRecommendations = filteredRecommendations.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pagedStudyGroups = filteredStudyGroups.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pagedReadingProgress = filteredReadingProgress.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pagedFeedback = filteredFeedback.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const maxPage = Math.ceil(filteredBooks.length / rowsPerPage);

  const handleBorrowBook = (bookId) => {
    console.log("Borrowing book:", bookId);
    // Simulate borrow action
    setBooks((prev) => prev.map((b) => b.id === bookId ? { ...b, status: "Borrowed" } : b));
    setBorrowHistory((prev) => [...prev, { id: Date.now().toString(), title: books.find((b) => b.id === bookId)?.title, borrowDate: new Date().toISOString().split("T")[0], dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], returned: false, fine: 0 }]);
  };

  const handleReturnBook = (historyId) => {
    console.log("Returning book:", historyId);
    // Simulate return action
    setBorrowHistory((prev) => prev.map((h) => h.id === historyId ? { ...h, returned: true } : h));
  };

  const handlePayFine = (fineId) => {
    console.log("Paying fine:", fineId);
    // Simulate payment
    setFines((prev) => prev.map((f) => f.id === fineId ? { ...f, status: "Paid" } : f));
  };

  const handleAccessResource = (resourceId) => {
    console.log("Accessing digital resource:", resourceId);
  };

  const handleViewBookDetails = (book) => {
    setSelectedBook(book);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedBook(null);
  };

  const handleSubmitFeedback = (bookId, feedbackText) => {
    console.log("Submitting feedback for book:", bookId, feedbackText);
    setFeedback((prev) => prev.map((f) => f.id === bookId ? { ...f, feedback: feedbackText } : f));
  };

  const handleJoinStudyGroup = (groupId) => {
    console.log("Joining study group:", groupId);
  };

  const handleTrackProgress = (historyId, progress) => {
    console.log("Updating reading progress for:", historyId, progress);
    setReadingProgress((prev) => prev.map((p) => p.id === historyId ? { ...p, progress } : p));
  };

  // Unique Features for Academics and Skill Development
  const uniqueFeatures = [
    { id: "recommendations", title: "Personalized Book Recommendations", icon: <ThumbsUp size={16} />, description: "Get book suggestions based on your courses." },
    { id: "study-groups", title: "Study Group Matching", icon: <Group size={16} />, description: "Join or create study groups for library sessions." },
    { id: "feedback", title: "Book Feedback System", icon: <MessageSquare size={16} />, description: "Submit and view feedback on books." },
    { id: "progress-tracker", title: "Reading Progress Tracker", icon: <LucideTimer size={16} />, description: "Track your reading progress for borrowed books." },
    { id: "virtual-preview", title: "Virtual Book Preview", icon: <Scan size={16} />, description: "Preview book contents before borrowing." },
    { id: "skill-resources", title: "Skill Development Resources", icon: <Lightbulb size={16} />, description: "Access resources for soft skills and career development." },
    { id: "exam-kits", title: "Exam Preparation Kits", icon: <BookOpen size={16} />, description: "Curated books and resources for exam prep." },
  ];

  // Export handler for various tabs
  const handleExport = () => {
    const data = activeTab === "catalog" ? filteredBooks 
      : activeTab === "borrowhistory" ? filteredBorrowHistory 
      : activeTab === "fines" ? filteredFines 
      : activeTab === "digitalresources" ? filteredDigitalResources 
      : activeTab === "recommendations" ? filteredRecommendations 
      : activeTab === "study-groups" ? filteredStudyGroups 
      : activeTab === "feedback" ? filteredFeedback 
      : activeTab === "progress-tracker" ? filteredReadingProgress 
      : [];

    const headers = Object.keys(data[0] || {}).join(",");
    const csv = [
      headers,
      ...data.map(row => Object.values(row).join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `JECRC_Library_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleUniqueFeatureClick = (feature) => {
    console.log("Accessing unique feature:", feature.title);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <img src="/image.png" alt="JECRC University Logo" className="w-20 h-8 mr-4" />
            <div>
              <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>Digital Library</h1>
              <p className="text-lg" style={{ color: 'var(--muted)' }}>Access books, resources, and manage your library activities</p>
            </div>
          </div>
        </div>

        {/* Quick Library Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group" 
               style={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ color: 'var(--muted)' }} className="text-sm font-medium">Available Books</p>
                  <p className="text-3xl font-bold text-blue-600">{books.filter(b => b.status === 'Available').length}</p>
                </div>
                <BookOpen className="w-12 h-12 text-blue-600 opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
          
          <div className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group" 
               style={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ color: 'var(--muted)' }} className="text-sm font-medium">Borrowed Books</p>
                  <p className="text-3xl font-bold text-green-600">{borrowHistory.filter(h => !h.returned).length}</p>
                </div>
                <Users className="w-12 h-12 text-green-600 opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
          
          <div className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group" 
               style={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ color: 'var(--muted)' }} className="text-sm font-medium">Pending Fines</p>
                  <p className="text-3xl font-bold text-red-600">₹{fines.filter(f => f.status === 'Unpaid').reduce((sum, f) => sum + f.amount, 0)}</p>
                </div>
                <AlertTriangle className="w-12 h-12 text-red-600 opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
          
          <div className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group" 
               style={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ color: 'var(--muted)' }} className="text-sm font-medium">Digital Resources</p>
                  <p className="text-3xl font-bold text-purple-600">{digitalResources.length}</p>
                </div>
                <FileText className="w-12 h-12 text-purple-600 opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>

        {/* Modern Tab Navigation */}
        <div className="p-2 mb-8 overflow-x-auto" 
             style={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <div className="flex space-x-2 min-w-max">
            {[
              { key: "catalog", label: "Book Catalog", icon: BookOpen },
              { key: "borrowhistory", label: "Borrow History", icon: Calendar },
              { key: "fines", label: "Fines & Fees", icon: AlertTriangle },
              { key: "digitalresources", label: "Digital Resources", icon: FileText },
              { key: "analytics", label: "Reading Analytics", icon: BarChart2 },
              { key: "recommendations", label: "Recommendations", icon: ThumbsUp },
              { key: "study-groups", label: "Study Groups", icon: Group },
              { key: "feedback", label: "Book Reviews", icon: MessageSquare },
              { key: "progress-tracker", label: "Reading Progress", icon: LucideTimer },
              { key: "virtual-preview", label: "Book Preview", icon: Scan },
              { key: "skill-resources", label: "Skill Resources", icon: Lightbulb },
              { key: "exam-kits", label: "Exam Kits", icon: Users }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-3 rounded-lg whitespace-nowrap flex items-center gap-2 font-medium transition-all duration-300 ${
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

        {/* Modern Book Details Modal */}
        {modalOpen && selectedBook && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100" 
                 style={{ backgroundColor: 'var(--card)', borderRadius: '24px', border: '1px solid var(--border)' }}>
              
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{selectedBook.title}</h2>
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
                    <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text)' }}>Book Information</h3>
                    <div className="space-y-2" style={{ color: 'var(--text)' }}>
                      <p><span className="font-medium" style={{ color: 'var(--muted)' }}>Author:</span> {selectedBook.author}</p>
                      <p><span className="font-medium" style={{ color: 'var(--muted)' }}>ISBN:</span> {selectedBook.isbn}</p>
                      <p><span className="font-medium" style={{ color: 'var(--muted)' }}>Type:</span> 
                        <span className="ml-2 px-2 py-1 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'var(--info-light)', color: 'var(--info)' }}>{selectedBook.type}</span>
                      </p>
                      <p><span className="font-medium" style={{ color: 'var(--muted)' }}>Category:</span> {selectedBook.category}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--hover)' }}>
                    <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text)' }}>Availability</h3>
                    <div className="space-y-2" style={{ color: 'var(--text)' }}>
                      <p><span className="font-medium" style={{ color: 'var(--muted)' }}>Status:</span> 
                        <span className={`ml-2 px-3 py-1 rounded-lg text-sm font-semibold ${
                          selectedBook.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>{selectedBook.status}</span>
                      </p>
                      {selectedBook.status === 'Available' && (
                        <button
                          className="w-full mt-4 px-6 py-3 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
                          style={{ backgroundColor: 'var(--button-success)' }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--success)'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--button-success)'}
                          onClick={() => {
                            handleBorrowBook(selectedBook.id);
                            closeModal();
                          }}
                        >
                          <BookOpen size={18} />
                          Borrow This Book
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modern Catalog Section */}
        {activeTab === "catalog" && (
          <div>
            {/* Search and Export Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 rounded-xl" 
                 style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={20} style={{ color: 'var(--icon)' }} />
                <input
                  type="text"
                  placeholder="Search books by title, author, or category..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  style={{ backgroundColor: 'var(--input)', borderColor: 'var(--border)', color: 'var(--text)' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                className="px-6 py-3 text-white rounded-lg flex items-center gap-2 font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                style={{ backgroundColor: 'var(--button-success)' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--success)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--button-success)'}
                onClick={handleExport}
              >
                <Download size={18} /> Export Catalog
              </button>
            </div>
            
            {/* Books Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {pagedBooks.length > 0 ? (
                pagedBooks.map((book) => (
                  <div key={book.id} 
                       className="group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer" 
                       style={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        book.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {book.status}
                      </span>
                    </div>
                    
                    <div className="p-6">
                      {/* Book Header */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--info)' }}>
                          <BookOpen size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--text)' }}>{book.title}</h3>
                          <p className="font-medium" style={{ color: 'var(--info)' }}>{book.author}</p>
                          <p style={{ color: 'var(--muted)' }} className="text-sm">{book.category}</p>
                        </div>
                      </div>
                      
                      {/* Book Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
                          <span className="text-sm font-medium" style={{ color: 'var(--muted)' }}>ISBN:</span>
                          <span className="text-sm" style={{ color: 'var(--text)' }}>{book.isbn}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
                          <span className="text-sm font-medium" style={{ color: 'var(--muted)' }}>Type:</span>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            book.type === 'E-Book' ? 'bg-red-100 text-purple-800' : 'bg-orange-100 text-orange-800'
                          }`}>{book.type}</span>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewBookDetails(book)}
                          className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
                        >
                          <Search size={16} /> View Details
                        </button>
                        {book.status === "Available" && (
                          <button
                            onClick={() => handleBorrowBook(book.id)}
                            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
                          >
                            <BookOpen size={16} /> Borrow
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full">
                  <div className="text-center py-12" style={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                    <BookOpen size={48} className="mx-auto mb-4" style={{ color: 'var(--icon)' }} />
                    <p className="text-lg font-medium" style={{ color: 'var(--muted)' }}>No books found</p>
                    <p style={{ color: 'var(--muted)' }}>Try adjusting your search criteria</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Modern Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 rounded-xl" 
                 style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--muted)' }}>
                Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredBooks.length)} of {filteredBooks.length} books
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

      {/* Borrow History Section */}
      {activeTab === "borrowhistory" && (
        <div>
          <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 rounded-xl" 
               style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={20} style={{ color: 'var(--icon)' }} />
              <input
                type="text"
                placeholder="Search borrow history..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ backgroundColor: 'var(--input)', borderColor: 'var(--border)', color: 'var(--text)' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="px-6 py-3 text-white rounded-lg flex items-center gap-2 font-medium transition-all duration-200 hover:scale-105 shadow-lg"
              style={{ backgroundColor: 'var(--danger)' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--danger-hover)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--danger)'}
              onClick={handleExport}
            >
              <Download size={18} /> Export History
            </button>
          </div>
          <div className="rounded-xl overflow-hidden mb-6" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr style={{ backgroundColor: 'var(--danger)', color: 'white' }}>
                    <th className="p-4 font-semibold">Title</th>
                    <th className="p-4 font-semibold">Borrow Date</th>
                    <th className="p-4 font-semibold">Due Date</th>
                    <th className="p-4 font-semibold">Returned</th>
                    <th className="p-4 font-semibold">Fine</th>
                    <th className="p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedBorrowHistory.length > 0 ? (
                    pagedBorrowHistory.map((item) => (
                      <tr key={item.id} className="transition-colors duration-200" style={{ borderBottom: '1px solid var(--border)' }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--hover)'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                        <td className="p-4 font-medium" style={{ color: 'var(--text)' }}>{item.title}</td>
                        <td className="p-4" style={{ color: 'var(--muted)' }}>{item.borrowDate}</td>
                        <td className="p-4" style={{ color: 'var(--muted)' }}>{item.dueDate}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.returned ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                          }`}>
                            {item.returned ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="p-4 font-semibold" style={{ color: item.fine > 0 ? 'var(--danger)' : 'var(--success)' }}>₹{item.fine}</td>
                        <td className="p-4">
                          {!item.returned && (
                            <button
                              className="px-3 py-1 rounded-lg text-sm font-medium text-white transition-all duration-200 hover:scale-105"
                              style={{ backgroundColor: 'var(--button-success)' }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--success)'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--button-success)'}
                              onClick={() => handleReturnBook(item.id)}
                            >
                              Return
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Calendar size={48} style={{ color: 'var(--icon)', opacity: 0.5 }} />
                          <p className="text-lg font-medium" style={{ color: 'var(--muted)' }}>No borrow history found</p>
                          <p style={{ color: 'var(--muted)' }}>Your borrowed books will appear here</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 rounded-xl" 
               style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div style={{ color: 'var(--muted)' }}>
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredBorrowHistory.length)} of {filteredBorrowHistory.length} entries
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

      {/* Fines Section */}
      {activeTab === "fines" && (
        <div>
          <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 rounded-xl" 
               style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={20} style={{ color: 'var(--icon)' }} />
              <input
                type="text"
                placeholder="Search fines and fees..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ backgroundColor: 'var(--input)', borderColor: 'var(--border)', color: 'var(--text)' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="px-6 py-3 text-white rounded-lg flex items-center gap-2 font-medium transition-all duration-200 hover:scale-105 shadow-lg"
              style={{ backgroundColor: 'var(--danger)' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--danger-hover)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--danger)'}
              onClick={handleExport}
            >
              <Download size={18} /> Export Fines
            </button>
          </div>
          
          <div className="rounded-xl overflow-hidden mb-6" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr style={{ backgroundColor: 'var(--danger)', color: 'white' }}>
                    <th className="p-4 font-semibold">Book</th>
                    <th className="p-4 font-semibold">Amount</th>
                    <th className="p-4 font-semibold">Due Date</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedFines.length > 0 ? (
                    pagedFines.map((item) => (
                      <tr key={item.id} className="transition-colors duration-200" style={{ borderBottom: '1px solid var(--border)' }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--hover)'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                        <td className="p-4 font-medium" style={{ color: 'var(--text)' }}>{item.book}</td>
                        <td className="p-4 font-bold" style={{ color: 'var(--danger)' }}>₹{item.amount}</td>
                        <td className="p-4" style={{ color: 'var(--muted)' }}>{item.dueDate}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="p-4">
                          {item.status === 'Unpaid' && (
                            <button
                              className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all duration-200 hover:scale-105 flex items-center gap-2"
                              style={{ backgroundColor: 'var(--button-success)' }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--success)'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--button-success)'}
                              onClick={() => handlePayFine(item.id)}
                            >
                              <Download size={14} /> Pay Fine
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <AlertTriangle size={48} style={{ color: 'var(--icon)', opacity: 0.5 }} />
                          <p className="text-lg font-medium" style={{ color: 'var(--muted)' }}>No fines found</p>
                          <p style={{ color: 'var(--muted)' }}>You're all caught up!</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 rounded-xl" 
               style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div style={{ color: 'var(--muted)' }}>
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredFines.length)} of {filteredFines.length} entries
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

      {/* Digital Resources Section */}
      {activeTab === "digitalresources" && (
        <div>
          <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 rounded-xl" 
               style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={20} style={{ color: 'var(--icon)' }} />
              <input
                type="text"
                placeholder="Search digital resources..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ backgroundColor: 'var(--input)', borderColor: 'var(--border)', color: 'var(--text)' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              className="px-6 py-3 bg-red-500 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 font-medium transition-all duration-200 hover:scale-105 shadow-lg"
              onClick={handleExport}
            >
              <Download size={18} /> Export Resources
            </button>
          </div>
          
          <div className="rounded-xl overflow-hidden mb-6" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-red-500 text-white">
                    <th className="p-4 font-semibold">Title</th>
                    <th className="p-4 font-semibold">Type</th>
                    <th className="p-4 font-semibold">Access</th>
                    <th className="p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedDigitalResources.length > 0 ? (
                    pagedDigitalResources.map((item) => (
                      <tr key={item.id} className="transition-colors duration-200" style={{ borderBottom: '1px solid var(--border)' }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--hover)'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                        <td className="p-4 font-medium" style={{ color: 'var(--text)' }}>{item.title}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.type === 'Journal' ? 'bg-blue-100 text-blue-800' :
                            item.type === 'Video' ? 'bg-red-100 text-purple-800' :
                            item.type === 'Database' ? 'bg-green-100 text-green-800' :
                            item.type === 'E-Book' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="p-4" style={{ color: 'var(--muted)' }}>{item.access}</td>
                        <td className="p-4">
                          <button
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 flex items-center gap-2"
                            onClick={() => handleAccessResource(item.id)}
                          >
                            <FileText size={14} /> Access
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <FileText size={48} style={{ color: 'var(--icon)', opacity: 0.5 }} />
                          <p className="text-lg font-medium" style={{ color: 'var(--muted)' }}>No digital resources found</p>
                          <p style={{ color: 'var(--muted)' }}>Digital resources will appear here</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 rounded-xl" 
               style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <div style={{ color: 'var(--muted)' }}>
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredDigitalResources.length)} of {filteredDigitalResources.length} entries
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

      {/* Analytics Section */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: 'var(--text)' }}>
              <BarChart2 size={20} className="mr-2" style={{ color: 'var(--info)' }} /> Borrow Trend
            </h3>
            {borrowTrendData && borrowTrendData.labels && borrowTrendData.datasets && (
              <Line data={borrowTrendData} options={{ plugins: { zoom: { zoom: { mode: 'x' } }, filler: { propagate: true } } }} />
            )}
          </div>
          <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: 'var(--text)' }}>
              <PieChartIcon size={20} className="mr-2" style={{ color: 'var(--info)' }} /> Category Distribution
            </h3>
            {categoryDistributionData && categoryDistributionData.labels && categoryDistributionData.datasets && (
              <Pie data={categoryDistributionData} options={{ plugins: { zoom: { zoom: { mode: 'xy' } } } }} />
            )}
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
                  <th className="p-2">Title</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedRecommendations.length > 0 ? (
                  pagedRecommendations.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-100">
                      <td className="p-2">{item.title}</td>
                      <td className="p-2">{item.category}</td>
                      <td className="p-2">
                        <button
                          className="text-blue-500 hover:underline"
                          onClick={() => handleViewBookDetails(item)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-4 text-center text-gray-500">
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

      {/* Study Groups Section */}
      {activeTab === "study-groups" && (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Search study groups..."
              className="bg-white border rounded p-2 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center"
              onClick={handleExport}
            >
              <Download size={16} className="mr-2" /> Export Study Groups
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow mb-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-2">Book</th>
                  <th className="p-2">Members</th>
                  <th className="p-2">Meeting Date</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedStudyGroups.length > 0 ? (
                  pagedStudyGroups.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-100">
                      <td className="p-2">{item.book}</td>
                      <td className="p-2">{item.members}</td>
                      <td className="p-2">{item.meetingDate}</td>
                      <td className="p-2">
                        <button
                          className="text-blue-500 hover:underline"
                          onClick={() => handleJoinStudyGroup(item.id)}
                        >
                          Join
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-500">
                      No study groups found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4 text-gray-600">
            <span>
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredStudyGroups.length)} of {filteredStudyGroups.length} entries
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
                  <th className="p-2">Title</th>
                  <th className="p-2">Feedback</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedFeedback.length > 0 ? (
                  pagedFeedback.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-100">
                      <td className="p-2">{books.find((b) => b.id === item.id)?.title}</td>
                      <td className="p-2">{item.feedback}</td>
                      <td className="p-2">
                        <button
                          className="text-blue-500 hover:underline"
                          onClick={() => console.log("Editing feedback for book:", item.id)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-4 text-center text-gray-500">
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

      {/* Progress Tracker Section */}
      {activeTab === "progress-tracker" && (
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
                  <th className="p-2">Title</th>
                  <th className="p-2">Progress (%)</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedReadingProgress.length > 0 ? (
                  pagedReadingProgress.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-100">
                      <td className="p-2">{borrowHistory.find((h) => h.id === item.id)?.title}</td>
                      <td className="p-2">{item.progress}%</td>
                      <td className="p-2">
                        <button
                          className="text-blue-500 hover:underline"
                          onClick={() => handleTrackProgress(item.id, item.progress + 10)} // Simulate update
                        >
                          Update Progress
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-4 text-center text-gray-500">
                      No reading progress found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between mt-4 text-gray-600">
            <span>
              Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, filteredReadingProgress.length)} of {filteredReadingProgress.length} entries
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

      {/* Virtual Preview Section */}
      {activeTab === "virtual-preview" && (
        <div className="p-8 rounded-xl" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
          <h3 className="text-2xl font-bold mb-4 flex items-center" style={{ color: 'var(--text)' }}>
            <Scan size={24} className="mr-3" style={{ color: 'var(--info)' }} /> Virtual Book Preview
          </h3>
          <p className="text-lg mb-6" style={{ color: 'var(--muted)' }}>Preview book contents before borrowing.</p>
          
          {/* Simulate preview */}
          <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--hover)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-4 mb-6">
              <BookOpen size={32} style={{ color: 'var(--accent)' }} />
              <div>
                <h4 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Introduction to Algorithms</h4>
                <p style={{ color: 'var(--muted)' }}>Thomas H. Cormen</p>
              </div>
            </div>
            <div className="space-y-4">
              <p style={{ color: 'var(--text)' }}>Chapter 1: The Role of Algorithms in Computing</p>
              <p style={{ color: 'var(--text)' }}>This chapter introduces the basic concepts of algorithms, their importance in computing, and provides an overview of the book's structure...</p>
              <div className="flex gap-4 mt-6">
                <button className="px-6 py-3 bg-blue-500 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center gap-2">
                  <Scan size={16} /> Full Preview
                </button>
                <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center gap-2">
                  <BookOpen size={16} /> Borrow Book
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Skill Resources Section */}
      {activeTab === "skill-resources" && (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Search skill resources..."
              className="bg-white border rounded p-2 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center"
              onClick={handleExport}
            >
              <Download size={16} className="mr-2" /> Export Skill Resources
            </button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow mb-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="p-2">Title</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedRecommendations.length > 0 ? (
                  pagedRecommendations.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-100">
                      <td className="p-2">{item.title}</td>
                      <td className="p-2">{item.category}</td>
                      <td className="p-2">
                        <button
                          className="text-blue-500 hover:underline"
                          onClick={() => handleAccessResource(item.id)}
                        >
                          Access
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-4 text-center text-gray-500">
                      No skill resources found.
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

      {/* Exam Kits Section */}
      {activeTab === "exam-kits" && (
        <div>
          <div className="p-8 rounded-xl mb-6" style={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}>
            <h3 className="text-2xl font-bold mb-4 flex items-center" style={{ color: 'var(--text)' }}>
              <BookOpen size={24} className="mr-3" style={{ color: 'var(--info)' }} /> Exam Preparation Kits
            </h3>
            <p className="text-lg" style={{ color: 'var(--muted)' }}>Curated books and resources for exam preparation across different semesters and subjects.</p>
          </div>
          
          {/* Exam Kits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: 1, title: "Semester 1 - Engineering Kit", subjects: ["Mathematics", "Physics", "Chemistry"], books: 12 },
              { id: 2, title: "Semester 2 - Computer Science Kit", subjects: ["Programming", "Data Structures", "Algorithms"], books: 8 },
              { id: 3, title: "Semester 3 - Business Kit", subjects: ["Management", "Marketing", "Finance"], books: 10 },
              { id: 4, title: "Final Year - Project Kit", subjects: ["Research Methods", "Project Management"], books: 6 },
              { id: 5, title: "Law School - Foundation Kit", subjects: ["Constitutional Law", "Criminal Law"], books: 15 },
              { id: 6, title: "Medical - MBBS Kit", subjects: ["Anatomy", "Physiology", "Biochemistry"], books: 20 }
            ].map((kit) => (
              <div key={kit.id} 
                   className="group transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer" 
                   style={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                
                <div className="p-6">
                  {/* Kit Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
                      <Users size={24} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg" style={{ color: 'var(--text)' }}>{kit.title}</h4>
                      <p className="text-sm" style={{ color: 'var(--muted)' }}>{kit.books} books included</p>
                    </div>
                  </div>
                  
                  {/* Subjects */}
                  <div className="mb-4">
                    <h5 className="font-semibold mb-2" style={{ color: 'var(--text)' }}>Subjects Covered:</h5>
                    <div className="flex flex-wrap gap-2">
                      {kit.subjects.map((subject, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <button className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2">
                    <Download size={16} /> Access Kit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}