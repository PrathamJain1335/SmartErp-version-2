import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, Users, UserPlus, Edit, Trash2, Eye, Download, Filter,
  MoreHorizontal, AlertTriangle, CheckCircle, Clock, Book,
  Phone, Mail, MapPin, GraduationCap, User, Calendar, Loader,
  RefreshCw, ArrowUpDown, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { studentsAPI, profilePhotoAPI } from '../services/api';
import ProfilePhotoUpload from '../components/ProfilePhotoUpload';

const StudentListNew = () => {
  // State for data management
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  
  // State for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 20;

  // Load students from API
  useEffect(() => {
    loadStudents();
  }, [currentPage, searchTerm, departmentFilter, statusFilter, sectionFilter]);

  const loadStudents = async () => {
    setLoading(true);
    setError('');

    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm || undefined,
        department: departmentFilter || undefined,
        status: statusFilter || undefined,
        section: sectionFilter || undefined
      };

      // Remove undefined values
      Object.keys(params).forEach(key => 
        params[key] === undefined && delete params[key]
      );

      const response = await studentsAPI.getAll(params);
      
      if (response.success) {
        setStudents(response.data.students || []);
        const pagination = response.data.pagination || {};
        setTotalPages(pagination.totalPages || 1);
        setTotalCount(pagination.totalCount || 0);
      } else {
        setError(response.message || 'Failed to load students');
      }
    } catch (err) {
      console.error('Students loading error:', err);
      setError(err.message || 'Failed to load students. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get unique filter options from loaded students
  const filterOptions = useMemo(() => {
    const departments = [...new Set(students.map(s => s.Department).filter(Boolean))];
    const sections = [...new Set(students.map(s => s.Section).filter(Boolean))];
    const statuses = [...new Set(students.map(s => s.accountStatus || 'active').filter(Boolean))];

    return { departments, sections, statuses };
  }, [students]);

  // Handle student selection for detailed view
  const handleStudentClick = async (student) => {
    setSelectedStudent(student);
    setShowStudentModal(true);

    // Load detailed student information
    try {
      const detailed = await studentsAPI.getById(student.Student_ID);
      if (detailed.success) {
        setSelectedStudent(detailed.data.student);
      }
    } catch (err) {
      console.error('Failed to load student details:', err);
    }
  };

  // Handle search with debouncing
  const handleSearch = useMemo(() => {
    const debounce = (func, delay) => {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
      };
    };

    return debounce((term) => {
      setSearchTerm(term);
      setCurrentPage(1);
    }, 500);
  }, []);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('');
    setStatusFilter('');
    setSectionFilter('');
    setCurrentPage(1);
  };

  // Student status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Inactive' },
      suspended: { bg: 'bg-red-100', text: 'text-red-800', label: 'Suspended' },
      graduated: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Graduated' }
    };

    const config = statusConfig[status] || statusConfig.active;

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  // Student profile photo component
  const StudentPhoto = ({ student }) => {
    const photoUrl = student.profilePhotoUrl || student.profilePicture || '/uploads/profiles/default-avatar.png';
    
    return (
      <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
        {photoUrl && photoUrl !== '/uploads/profiles/default-avatar.png' ? (
          <img
            src={`http://localhost:5000${photoUrl}`}
            alt={student.Full_Name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-600">
          <User size={20} />
        </div>
      </div>
    );
  };

  // Student Detail Modal
  const StudentDetailModal = ({ student, onClose }) => {
    if (!student) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <StudentPhoto student={student} />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{student.Full_Name}</h2>
                <p className="text-gray-600">{student.Student_ID} • {student.Department}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{student.Full_Name}</p>
                      <p className="text-sm text-gray-600">Full Name</p>
                    </div>
                  </div>
                  
                  {student.Email_ID && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{student.Email_ID}</p>
                        <p className="text-sm text-gray-600">Email Address</p>
                      </div>
                    </div>
                  )}

                  {student.Phone_No && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{student.Phone_No}</p>
                        <p className="text-sm text-gray-600">Phone Number</p>
                      </div>
                    </div>
                  )}

                  {student.Address && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{student.Address}</p>
                        <p className="text-sm text-gray-600">Address</p>
                      </div>
                    </div>
                  )}

                  {student.Date_of_Birth && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{new Date(student.Date_of_Birth).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-600">Date of Birth</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Academic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{student.Department}</p>
                      <p className="text-sm text-gray-600">Department</p>
                    </div>
                  </div>

                  {student.Section && (
                    <div className="flex items-center gap-3">
                      <Book className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Section {student.Section}</p>
                        <p className="text-sm text-gray-600">Section</p>
                      </div>
                    </div>
                  )}

                  {student.Semester && (
                    <div className="flex items-center gap-3">
                      <Book className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Semester {student.Semester}</p>
                        <p className="text-sm text-gray-600">Current Semester</p>
                      </div>
                    </div>
                  )}

                  {student.Roll_No && (
                    <div className="flex items-center gap-3">
                      <Book className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{student.Roll_No}</p>
                        <p className="text-sm text-gray-600">Roll Number</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-gray-400" />
                    <div>
                      <StatusBadge status={student.accountStatus || 'active'} />
                      <p className="text-sm text-gray-600 mt-1">Account Status</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Photo Upload Section */}
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Photo</h3>
              <ProfilePhotoUpload
                currentUser={student}
                onPhotoUpdate={(newPhotoUrl) => {
                  setSelectedStudent({
                    ...student,
                    profilePhotoUrl: newPhotoUrl
                  });
                  // Refresh the student list to show updated photo
                  loadStudents();
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Edit size={16} />
                Edit Student
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                <Download size={16} />
                Download Details
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading && students.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Loading Students...</h2>
          <p className="text-gray-500 mt-2">Fetching student data from server</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
            <p className="text-gray-600 mt-1">
              Manage and view detailed student information
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={loadStudents}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
              <UserPlus size={16} />
              Add Student
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search students by name, ID, email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Department Filter */}
            <select
              value={departmentFilter}
              onChange={(e) => {
                setDepartmentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Departments</option>
              {filterOptions.departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            {/* Section Filter */}
            <select
              value={sectionFilter}
              onChange={(e) => {
                setSectionFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Sections</option>
              {filterOptions.sections.map(section => (
                <option key={section} value={section}>Section {section}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              {filterOptions.statuses.map(status => (
                <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Active Filters & Reset */}
          {(searchTerm || departmentFilter || sectionFilter || statusFilter) && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                  Search: "{searchTerm}"
                </span>
              )}
              {departmentFilter && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                  Department: {departmentFilter}
                </span>
              )}
              {sectionFilter && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                  Section: {sectionFilter}
                </span>
              )}
              {statusFilter && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                  Status: {statusFilter}
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-sm text-red-600 hover:text-red-800 ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {students.length} of {totalCount} students
          {searchTerm && ` matching "${searchTerm}"`}
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Section
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr
                  key={student.Student_ID}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleStudentClick(student)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <StudentPhoto student={student} />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {student.Full_Name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.Email_ID || 'No email'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.Student_ID}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.Department || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.Section ? `Section ${student.Section}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.Phone_No || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={student.accountStatus || 'active'} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStudentClick(student);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle edit
                        }}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle more actions
                        }}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {students.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Students Found</h3>
            <p className="text-gray-500">
              {searchTerm || departmentFilter || sectionFilter || statusFilter
                ? 'Try adjusting your search criteria or filters.'
                : 'No students have been added yet.'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="px-3 py-2 text-sm text-gray-700">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Student Detail Modal */}
      {showStudentModal && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => {
            setShowStudentModal(false);
            setSelectedStudent(null);
          }}
        />
      )}
    </div>
  );
};

export default StudentListNew;