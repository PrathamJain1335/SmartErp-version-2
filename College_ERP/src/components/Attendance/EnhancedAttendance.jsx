import React, { useState, useEffect } from 'react';
import { Calendar, Users, CheckCircle, XCircle, Clock, Download, Filter, Search, BarChart3, TrendingUp } from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

const EnhancedAttendance = ({ portal = 'student', userRole = 'Student' }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Demo data based on portal
  const generateAttendanceData = () => {
    if (portal === 'student') {
      return {
        myAttendance: {
          overall: 87.2,
          subjects: [
            { name: 'Data Structures', attended: 22, total: 25, percentage: 88 },
            { name: 'Algorithms', attended: 21, total: 25, percentage: 84 },
            { name: 'DBMS', attended: 20, total: 24, percentage: 83.3 },
            { name: 'Computer Networks', attended: 24, total: 27, percentage: 88.9 },
            { name: 'Software Engineering', attended: 23, total: 26, percentage: 88.5 },
            { name: 'Machine Learning', attended: 19, total: 23, percentage: 82.6 }
          ],
          monthlyTrend: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: [85, 87, 84, 89, 86, 87.2]
          },
          weeklyPattern: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            data: [90, 85, 88, 92, 84, 78]
          }
        }
      };
    } else if (portal === 'faculty') {
      return {
        classes: [
          { id: 'cs201a', name: 'CSE 2nd Year - Section A', subject: 'Data Structures', students: 45 },
          { id: 'cs201b', name: 'CSE 2nd Year - Section B', subject: 'Data Structures', students: 42 },
          { id: 'cs301a', name: 'CSE 3rd Year - Section A', subject: 'Computer Networks', students: 38 },
        ],
        todayAttendance: [
          { rollNo: 'CS001', name: 'Sophia Clark', status: 'Present', time: '09:15' },
          { rollNo: 'CS002', name: 'Aarav Sharma', status: 'Present', time: '09:12' },
          { rollNo: 'CS003', name: 'Priya Patel', status: 'Absent', time: '-' },
          { rollNo: 'CS004', name: 'Arjun Kumar', status: 'Late', time: '09:25' },
          { rollNo: 'CS005', name: 'Ananya Singh', status: 'Present', time: '09:10' },
        ],
        classStats: {
          totalStudents: 45,
          present: 38,
          absent: 5,
          late: 2,
          percentage: 84.4
        }
      };
    } else {
      return {
        systemStats: {
          totalStudents: 2456,
          todayPresent: 2203,
          todayAbsent: 198,
          todayLate: 55,
          overallPercentage: 89.7
        },
        departmentStats: [
          { dept: 'CSE', total: 890, present: 801, percentage: 90.0 },
          { dept: 'ECE', total: 654, present: 587, percentage: 89.8 },
          { dept: 'ME', total: 520, present: 458, percentage: 88.1 },
          { dept: 'CE', total: 386, present: 340, percentage: 88.1 },
          { dept: 'IT', total: 298, present: 265, percentage: 88.9 },
        ]
      };
    }
  };

  const [data, setData] = useState(generateAttendanceData());

  useEffect(() => {
    setData(generateAttendanceData());
  }, [portal]);

  // Chart configurations
  const attendanceTrendData = {
    labels: data.myAttendance?.monthlyTrend?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Attendance %',
      data: data.myAttendance?.monthlyTrend?.data || [85, 87, 84, 89, 86, 87],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const subjectAttendanceData = {
    labels: data.myAttendance?.subjects?.map(s => s.name) || [],
    datasets: [{
      label: 'Attendance %',
      data: data.myAttendance?.subjects?.map(s => s.percentage) || [],
      backgroundColor: [
        '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#6B7280'
      ],
      borderWidth: 2
    }]
  };

  const attendanceDistributionData = {
    labels: ['Present', 'Absent', 'Late'],
    datasets: [{
      data: portal === 'faculty' ? 
        [data.classStats?.present || 38, data.classStats?.absent || 5, data.classStats?.late || 2] :
        [data.systemStats?.todayPresent || 2203, data.systemStats?.todayAbsent || 198, data.systemStats?.todayLate || 55],
      backgroundColor: ['#10B981', '#EF4444', '#F59E0B'],
      borderWidth: 0
    }]
  };

  const markAttendance = (rollNo, status) => {
    if (portal === 'faculty') {
      setData(prev => ({
        ...prev,
        todayAttendance: prev.todayAttendance.map(student => 
          student.rollNo === rollNo ? { ...student, status } : student
        )
      }));
    }
  };

  const markAllPresent = () => {
    if (portal === 'faculty') {
      setData(prev => ({
        ...prev,
        todayAttendance: prev.todayAttendance.map(student => ({
          ...student,
          status: 'Present',
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }))
      }));
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {portal === 'student' ? 'My Attendance' : 
           portal === 'faculty' ? 'Class Attendance Management' : 
           'System Attendance Overview'}
        </h1>
        <p className="text-gray-600">
          {portal === 'student' ? 'Track your attendance across all subjects' :
           portal === 'faculty' ? 'Manage and track student attendance for your classes' :
           'Monitor attendance across all departments and classes'}
        </p>
      </div>

      {/* Student Portal - My Attendance */}
      {portal === 'student' && (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <span className={`text-lg font-semibold ${
                  data.myAttendance?.overall >= 75 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {data.myAttendance?.overall}%
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Overall Attendance</h3>
              <p className="text-sm text-gray-600 mt-1">
                {data.myAttendance?.overall >= 75 ? 'Good attendance!' : 'Below minimum requirement'}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-lg font-semibold text-green-600">
                  {data.myAttendance?.subjects?.reduce((acc, s) => acc + s.attended, 0) || 129}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Classes Attended</h3>
              <p className="text-sm text-gray-600 mt-1">Total attended classes</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <span className="text-lg font-semibold text-red-600">
                  {data.myAttendance?.subjects?.reduce((acc, s) => acc + (s.total - s.attended), 0) || 21}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Classes Missed</h3>
              <p className="text-sm text-gray-600 mt-1">Total missed classes</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <span className="text-lg font-semibold text-purple-600">6</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Subjects Enrolled</h3>
              <p className="text-sm text-gray-600 mt-1">Current semester</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Monthly Attendance Trend</h3>
              <div className="h-64">
                <Line data={attendanceTrendData} options={chartOptions} />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Subject-wise Attendance</h3>
              <div className="h-64">
                <Bar data={subjectAttendanceData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Subject Details */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Subject-wise Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-sm font-medium text-gray-700">Subject</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700">Classes Attended</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700">Total Classes</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700">Percentage</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.myAttendance?.subjects?.map((subject, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{subject.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{subject.attended}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{subject.total}</td>
                      <td className="px-4 py-3 text-sm font-semibold">
                        <span className={subject.percentage >= 75 ? 'text-green-600' : 'text-red-600'}>
                          {subject.percentage.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          subject.percentage >= 75 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {subject.percentage >= 75 ? 'Good' : 'Low'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Faculty Portal - Class Management */}
      {portal === 'faculty' && (
        <>
          {/* Class Selection */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Class</option>
                  {data.classes?.map((cls) => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Subject</option>
                  <option value="data-structures">Data Structures</option>
                  <option value="algorithms">Algorithms</option>
                  <option value="networks">Computer Networks</option>
                </select>
              </div>
            </div>
          </div>

          {/* Attendance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-6 w-6 text-blue-600" />
                <span className="font-medium text-blue-900">Total Students</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{data.classStats?.totalStudents}</div>
            </div>
            
            <div className="bg-green-50 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <span className="font-medium text-green-900">Present</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{data.classStats?.present}</div>
            </div>
            
            <div className="bg-red-50 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <XCircle className="h-6 w-6 text-red-600" />
                <span className="font-medium text-red-900">Absent</span>
              </div>
              <div className="text-2xl font-bold text-red-600">{data.classStats?.absent}</div>
            </div>
            
            <div className="bg-orange-50 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="h-6 w-6 text-orange-600" />
                <span className="font-medium text-orange-900">Late</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">{data.classStats?.late}</div>
            </div>
          </div>

          {/* Attendance Management */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Mark Attendance</h3>
              <div className="flex gap-3">
                <button
                  onClick={markAllPresent}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Mark All Present
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Save Attendance
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-sm font-medium text-gray-700">Roll No</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700">Name</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700">Status</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700">Time</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.todayAttendance?.map((student, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{student.rollNo}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{student.name}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          student.status === 'Present' ? 'bg-green-100 text-green-800' :
                          student.status === 'Absent' ? 'bg-red-100 text-red-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{student.time}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => markAttendance(student.rollNo, 'Present')}
                            className={`px-3 py-1 rounded text-xs ${
                              student.status === 'Present' 
                                ? 'bg-green-600 text-white' 
                                : 'bg-gray-200 text-gray-600 hover:bg-green-100'
                            }`}
                          >
                            P
                          </button>
                          <button
                            onClick={() => markAttendance(student.rollNo, 'Absent')}
                            className={`px-3 py-1 rounded text-xs ${
                              student.status === 'Absent' 
                                ? 'bg-red-600 text-white' 
                                : 'bg-gray-200 text-gray-600 hover:bg-red-100'
                            }`}
                          >
                            A
                          </button>
                          <button
                            onClick={() => markAttendance(student.rollNo, 'Late')}
                            className={`px-3 py-1 rounded text-xs ${
                              student.status === 'Late' 
                                ? 'bg-orange-600 text-white' 
                                : 'bg-gray-200 text-gray-600 hover:bg-orange-100'
                            }`}
                          >
                            L
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Attendance Analytics */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Today's Attendance Distribution</h3>
            <div className="h-64">
              <Doughnut data={attendanceDistributionData} options={chartOptions} />
            </div>
          </div>
        </>
      )}

      {/* Admin Portal - System Overview */}
      {portal === 'admin' && (
        <>
          {/* System Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-6 w-6 text-blue-600" />
                <span className="font-medium text-blue-900">Total Students</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{data.systemStats?.totalStudents.toLocaleString()}</div>
            </div>
            
            <div className="bg-green-50 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <span className="font-medium text-green-900">Today Present</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{data.systemStats?.todayPresent.toLocaleString()}</div>
            </div>
            
            <div className="bg-red-50 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <XCircle className="h-6 w-6 text-red-600" />
                <span className="font-medium text-red-900">Today Absent</span>
              </div>
              <div className="text-2xl font-bold text-red-600">{data.systemStats?.todayAbsent}</div>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-6 w-6 text-purple-600" />
                <span className="font-medium text-purple-900">Overall %</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">{data.systemStats?.overallPercentage}%</div>
            </div>
          </div>

          {/* Department Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Department-wise Attendance</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-sm font-medium text-gray-700">Department</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700">Total Students</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700">Present Today</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700">Attendance %</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.departmentStats?.map((dept, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{dept.dept}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{dept.total}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{dept.present}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-blue-600">{dept.percentage}%</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          dept.percentage >= 85 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {dept.percentage >= 85 ? 'Good' : 'Needs Attention'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* System Attendance Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Today's Attendance Distribution</h3>
            <div className="h-64">
              <Doughnut data={attendanceDistributionData} options={chartOptions} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EnhancedAttendance;