import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, BookOpen, ChevronLeft, ChevronRight, Download, Search, Filter, Grid, List, Bell, CheckCircle2, AlertTriangle } from 'lucide-react';

// Sample timetable data for JECRC University B.Tech CSE
const initialTimetable = {
  monday: [
    { id: 'm1', time: '09:00-10:00', subject: 'Computer Networks', code: 'CS401', instructor: 'Dr. Priya Sharma', room: 'CS-101', type: 'Lecture' },
    { id: 'm2', time: '10:00-11:00', subject: 'Operating System', code: 'CS402', instructor: 'Prof. Rajesh Kumar', room: 'CS-102', type: 'Lecture' },
    { id: 'm3', time: '11:30-12:30', subject: 'Data Structures Lab', code: 'CS404L', instructor: 'Dr. Neha Gupta', room: 'Lab-A', type: 'Lab' },
    { id: 'm4', time: '14:00-15:00', subject: 'Mathematics III', code: 'MA301', instructor: 'Prof. Suresh Jain', room: 'Math-201', type: 'Lecture' },
    { id: 'm5', time: '15:00-16:00', subject: 'Life Skills', code: 'HS401', instructor: 'Dr. Anita Verma', room: 'HS-101', type: 'Lecture' }
  ],
  tuesday: [
    { id: 't1', time: '09:00-10:00', subject: 'R Programming', code: 'ST401', instructor: 'Dr. Amit Singh', room: 'CS-103', type: 'Lecture' },
    { id: 't2', time: '10:00-11:00', subject: 'Discrete Mathematics', code: 'MA301', instructor: 'Prof. Vikram Sharma', room: 'Math-202', type: 'Lecture' },
    { id: 't3', time: '11:30-12:30', subject: 'Computer Networks Lab', code: 'CS401L', instructor: 'Dr. Priya Sharma', room: 'Lab-B', type: 'Lab' },
    { id: 't4', time: '14:00-15:00', subject: 'Software Engineering', code: 'CS403', instructor: 'Prof. Arun Sharma', room: 'CS-104', type: 'Lecture' },
    { id: 't5', time: '15:00-16:00', subject: 'Python Programming Lab', code: 'ST402L', instructor: 'Dr. Neha Gupta', room: 'Lab-C', type: 'Lab' }
  ],
  wednesday: [
    { id: 'w1', time: '09:00-10:00', subject: 'Operating System', code: 'CS402', instructor: 'Prof. Rajesh Kumar', room: 'CS-102', type: 'Lecture' },
    { id: 'w2', time: '10:00-11:00', subject: 'Computer Networks', code: 'CS401', instructor: 'Dr. Priya Sharma', room: 'CS-101', type: 'Lecture' },
    { id: 'w3', time: '11:30-12:30', subject: 'Project Management', code: 'CS403', instructor: 'Prof. Arun Sharma', room: 'CS-105', type: 'Seminar' },
    { id: 'w4', time: '14:00-15:00', subject: 'Probabilistic Modelling', code: 'ST402', instructor: 'Dr. Amit Singh', room: 'CS-106', type: 'Lecture' },
    { id: 'w5', time: '15:00-16:00', subject: 'Free Period', code: '', instructor: '', room: '', type: 'Break' }
  ],
  thursday: [
    { id: 'th1', time: '09:00-10:00', subject: 'Data Structures', code: 'CS404', instructor: 'Dr. Neha Gupta', room: 'CS-107', type: 'Lecture' },
    { id: 'th2', time: '10:00-11:00', subject: 'Mathematics III', code: 'MA301', instructor: 'Prof. Suresh Jain', room: 'Math-201', type: 'Tutorial' },
    { id: 'th3', time: '11:30-12:30', subject: 'Operating System Lab', code: 'CS402L', instructor: 'Prof. Rajesh Kumar', room: 'Lab-D', type: 'Lab' },
    { id: 'th4', time: '14:00-15:00', subject: 'R Programming', code: 'ST401', instructor: 'Dr. Amit Singh', room: 'CS-103', type: 'Practical' },
    { id: 'th5', time: '15:00-16:00', subject: 'Life Skills', code: 'HS401', instructor: 'Dr. Anita Verma', room: 'HS-101', type: 'Discussion' }
  ],
  friday: [
    { id: 'f1', time: '09:00-10:00', subject: 'Software Engineering', code: 'CS403', instructor: 'Prof. Arun Sharma', room: 'CS-104', type: 'Lecture' },
    { id: 'f2', time: '10:00-11:00', subject: 'Discrete Mathematics', code: 'MA301', instructor: 'Prof. Vikram Sharma', room: 'Math-202', type: 'Lecture' },
    { id: 'f3', time: '11:30-12:30', subject: 'Comprehensive Viva', code: 'VIVA', instructor: 'All Faculty', room: 'Seminar Hall', type: 'Assessment' },
    { id: 'f4', time: '14:00-15:00', subject: 'Project Work', code: 'CS499', instructor: 'Dr. Priya Sharma', room: 'CS-108', type: 'Project' },
    { id: 'f5', time: '15:00-16:00', subject: 'Library Hours', code: '', instructor: 'Self Study', room: 'Library', type: 'Study' }
  ],
  saturday: [
    { id: 's1', time: '09:00-10:00', subject: 'Extra Classes (If Required)', code: 'EXTRA', instructor: 'Faculty', room: 'TBD', type: 'Makeup' },
    { id: 's2', time: '10:00-11:00', subject: 'Sports / Cultural Activities', code: 'SPORT', instructor: 'Coach', room: 'Ground', type: 'Activity' },
    { id: 's3', time: '11:30-12:30', subject: 'Workshop / Seminar', code: 'WORK', instructor: 'Guest Faculty', room: 'Auditorium', type: 'Workshop' }
  ]
};

// Course information
const courseInfo = {
  semester: '3rd Semester',
  academicYear: '2024-25',
  totalCredits: 24,
  totalSubjects: 8,
  program: 'B.Tech Computer Science & Engineering'
};

const Course = () => {
  const [activeView, setActiveView] = useState('timetable');
  const [selectedDay, setSelectedDay] = useState('monday');
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // week, day
  const [searchTerm, setSearchTerm] = useState('');

  const days = {
    monday: 'Monday',
    tuesday: 'Tuesday', 
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday'
  };

  const timeSlots = ['09:00-10:00', '10:00-11:00', '11:30-12:30', '14:00-15:00', '15:00-16:00'];

  // Get current time for highlighting current class
  const getCurrentTimeSlot = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    if (currentTime >= 9 * 60 && currentTime < 10 * 60) return '09:00-10:00';
    if (currentTime >= 10 * 60 && currentTime < 11 * 60) return '10:00-11:00';
    if (currentTime >= 11 * 60 + 30 && currentTime < 12 * 60 + 30) return '11:30-12:30';
    if (currentTime >= 14 * 60 && currentTime < 15 * 60) return '14:00-15:00';
    if (currentTime >= 15 * 60 && currentTime < 16 * 60) return '15:00-16:00';
    return null;
  };

  const currentTimeSlot = getCurrentTimeSlot();
  const today = new Date().toLocaleLowerCase().slice(0, 3) + new Date().toLocaleLowerString().slice(3);

  // Filter classes based on search
  const filterClasses = (classes) => {
    if (!searchTerm) return classes;
    return classes.filter(cls => 
      cls.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.instructor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.code?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Get class type styling
  const getClassTypeStyle = (type) => {
    const styles = {
      'Lecture': { backgroundColor: 'var(--accent)', color: 'white' },
      'Lab': { backgroundColor: 'var(--secondary)', color: 'white' },
      'Tutorial': { backgroundColor: '#8B5CF6', color: 'white' },
      'Seminar': { backgroundColor: '#06B6D4', color: 'white' },
      'Project': { backgroundColor: '#10B981', color: 'white' },
      'Assessment': { backgroundColor: '#F59E0B', color: 'white' },
      'Break': { backgroundColor: 'var(--muted)', color: 'white' },
      'Study': { backgroundColor: '#6366F1', color: 'white' },
      'Workshop': { backgroundColor: '#EC4899', color: 'white' },
      'Activity': { backgroundColor: '#84CC16', color: 'white' },
      'Makeup': { backgroundColor: '#EF4444', color: 'white' },
      'Practical': { backgroundColor: '#14B8A6', color: 'white' },
      'Discussion': { backgroundColor: '#F97316', color: 'white' }
    };
    return styles[type] || { backgroundColor: 'var(--card)', color: 'var(--text)' };
  };

  const isCurrentClass = (day, timeSlot) => {
    const currentDay = new Date().toLocaleLowerString().substring(0, 3);
    const dayKey = Object.keys(days).find(key => key.startsWith(currentDay));
    return day === dayKey && timeSlot === currentTimeSlot;
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <img src="/image.png" alt="JECRC University Logo" className="w-20 h-8 mr-4" />
            <div>
              <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>Course Timetable</h1>
              <p className="text-lg" style={{ color: 'var(--muted)' }}>Manage your weekly schedule and class timings</p>
            </div>
          </div>
          
          {/* Program Info Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full" style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
            <BookOpen className="w-5 h-5 mr-2" />
            <span className="font-medium">{courseInfo.program} - {courseInfo.semester} ({courseInfo.academicYear})</span>
          </div>
        </div>

        {/* Enhanced Course Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group" 
               style={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ color: 'var(--muted)' }} className="text-sm font-medium">Current Semester</p>
                  <p className="text-3xl font-bold text-blue-600">{courseInfo.semester}</p>
                </div>
                <Calendar className="w-12 h-12 text-blue-600 opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
          
          <div className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group" 
               style={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ color: 'var(--muted)' }} className="text-sm font-medium">Total Subjects</p>
                  <p className="text-3xl font-bold text-green-600">{courseInfo.totalSubjects}</p>
                </div>
                <BookOpen className="w-12 h-12 text-green-600 opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
          
          <div className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group" 
               style={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ color: 'var(--muted)' }} className="text-sm font-medium">Total Credits</p>
                  <p className="text-3xl font-bold text-purple-600">{courseInfo.totalCredits}</p>
                </div>
                <CheckCircle2 className="w-12 h-12 text-purple-600 opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
          
          <div className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group" 
               style={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ color: 'var(--muted)' }} className="text-sm font-medium">Academic Year</p>
                  <p className="text-3xl font-bold text-orange-600">{courseInfo.academicYear}</p>
                </div>
                <Clock className="w-12 h-12 text-orange-600 opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>

        {/* Modern Controls */}
        <div className="p-6 mb-8 transition-all duration-300 hover:shadow-lg" 
             style={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <Search className="w-5 h-5" />
            Timetable Controls
          </h3>
          
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Enhanced Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search classes, subjects, or instructors..."
                className="pl-10 pr-4 py-3 w-full border-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ backgroundColor: 'var(--input)', borderColor: 'var(--border)', color: 'var(--text)' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Enhanced View Mode Toggle */}
            <div className="p-1 rounded-xl" style={{ backgroundColor: 'var(--hover)' }}>
              <div className="flex gap-1">
                <button
                  onClick={() => setViewMode('week')}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    viewMode === 'week' ? 'shadow-lg transform scale-105' : 'hover:scale-105'
                  }`}
                  style={viewMode === 'week' ? 
                    { backgroundColor: 'var(--accent)', color: 'white' } :
                    { backgroundColor: 'transparent', color: 'var(--text)' }
                  }
                >
                  <Grid className="h-4 w-4" />
                  Week View
                </button>
                <button
                  onClick={() => setViewMode('day')}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    viewMode === 'day' ? 'shadow-lg transform scale-105' : 'hover:scale-105'
                  }`}
                  style={viewMode === 'day' ? 
                    { backgroundColor: 'var(--accent)', color: 'white' } :
                    { backgroundColor: 'transparent', color: 'var(--text)' }
                  }
                >
                  <List className="h-4 w-4" />
                  Day View
                </button>
              </div>
            </div>

            {/* Enhanced Export Button */}
            <button 
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <Download className="h-5 w-5" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Enhanced Day Navigation for Day View */}
        {viewMode === 'day' && (
          <div className="p-6 mb-8 transition-all duration-300 hover:shadow-lg" 
               style={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between">
              <button 
                onClick={() => {
                  const dayKeys = Object.keys(days);
                  const currentIndex = dayKeys.indexOf(selectedDay);
                  const prevIndex = currentIndex > 0 ? currentIndex - 1 : dayKeys.length - 1;
                  setSelectedDay(dayKeys[prevIndex]);
                }}
                className="p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-md"
                style={{ backgroundColor: 'var(--hover)', color: 'var(--text)' }}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <div className="text-center">
                <h3 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
                  {days[selectedDay]}
                </h3>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>Daily Schedule</p>
              </div>
              
              <button 
                onClick={() => {
                  const dayKeys = Object.keys(days);
                  const currentIndex = dayKeys.indexOf(selectedDay);
                  const nextIndex = currentIndex < dayKeys.length - 1 ? currentIndex + 1 : 0;
                  setSelectedDay(dayKeys[nextIndex]);
                }}
                className="p-3 rounded-full transition-all duration-200 hover:scale-110 shadow-md"
                style={{ backgroundColor: 'var(--hover)', color: 'var(--text)' }}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Modern Timetable */}
        <div className="transition-all duration-300 hover:shadow-xl overflow-hidden" 
             style={{ backgroundColor: 'var(--card)', borderRadius: '24px', border: '1px solid var(--border)' }}>
        {viewMode === 'week' ? (
          // Week View
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: 'var(--accent)', color: 'white' }}>
                  <th className="p-3 text-left font-medium">Time</th>
                  {Object.entries(days).map(([key, day]) => (
                    <th key={key} className="p-3 text-center font-medium min-w-[150px]">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((timeSlot, timeIndex) => (
                  <tr key={timeSlot} className="border-b" style={{ borderColor: 'var(--border)' }}>
                    <td className="p-3 font-medium" style={{ color: 'var(--text)', backgroundColor: 'var(--hover)' }}>
                      {timeSlot}
                    </td>
                    {Object.keys(days).map((dayKey) => {
                      const dayClasses = filterClasses(initialTimetable[dayKey] || []);
                      const classForSlot = dayClasses.find(cls => cls.time === timeSlot);
                      const isCurrent = isCurrentClass(dayKey, timeSlot);
                      
                      return (
                        <td 
                          key={`${dayKey}-${timeSlot}`} 
                          className={`p-2 relative ${isCurrent ? 'ring-2 ring-yellow-400' : ''}`}
                          style={{ 
                            backgroundColor: isCurrent ? 'var(--soft)' : 'transparent',
                            minHeight: '80px'
                          }}
                        >
                          {classForSlot && classForSlot.subject ? (
                            <div 
                              className="rounded-lg p-3 text-xs shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                              style={getClassTypeStyle(classForSlot.type)}
                            >
                              <div className="font-semibold mb-1">{classForSlot.subject}</div>
                              <div className="opacity-90 mb-1">{classForSlot.code}</div>
                              <div className="flex items-center gap-1 opacity-80">
                                <User className="h-3 w-3" />
                                <span className="truncate">{classForSlot.instructor}</span>
                              </div>
                              <div className="flex items-center gap-1 opacity-80 mt-1">
                                <MapPin className="h-3 w-3" />
                                <span>{classForSlot.room}</span>
                              </div>
                              <div className="mt-1 px-1 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                                {classForSlot.type}
                              </div>
                            </div>
                          ) : (
                            <div className="h-full flex items-center justify-center text-xs" style={{ color: 'var(--muted)' }}>
                              Free
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // Day View
          <div className="p-4">
            <div className="space-y-4">
              {filterClasses(initialTimetable[selectedDay] || []).map((classItem, index) => {
                const isCurrent = isCurrentClass(selectedDay, classItem.time);
                return (
                  <div 
                    key={classItem.id}
                    className={`p-4 rounded-lg border-l-4 ${isCurrent ? 'ring-2 ring-yellow-400' : ''}`}
                    style={{ 
                      backgroundColor: isCurrent ? 'var(--soft)' : 'var(--hover)',
                      borderLeftColor: getClassTypeStyle(classItem.type).backgroundColor
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
                            {classItem.subject || 'Free Period'}
                          </h3>
                          {classItem.code && (
                            <span 
                              className="px-2 py-1 rounded text-xs font-medium"
                              style={getClassTypeStyle(classItem.type)}
                            >
                              {classItem.code}
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm" style={{ color: 'var(--muted)' }}>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{classItem.time}</span>
                          </div>
                          {classItem.instructor && (
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>{classItem.instructor}</span>
                            </div>
                          )}
                          {classItem.room && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{classItem.room}</span>
                            </div>
                          )}
                          {classItem.type && (
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4" />
                              <span>{classItem.type}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {isCurrent && (
                        <div className="flex items-center gap-2 text-yellow-600">
                          <Bell className="h-4 w-4" />
                          <span className="text-xs font-medium">Current</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

        {/* Enhanced Legend */}
        <div className="mt-8 p-6 transition-all duration-300 hover:shadow-lg" 
             style={{ backgroundColor: 'var(--card)', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
            <Filter className="w-5 h-5" />
            Class Types Legend
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {['Lecture', 'Lab', 'Tutorial', 'Seminar', 'Project', 'Assessment', 'Workshop'].map(type => (
              <div key={type} className="flex items-center gap-2 p-2 rounded-lg transition-colors duration-200" style={{ backgroundColor: 'var(--hover)' }}>
                <div 
                  className="w-4 h-4 rounded-full shadow-sm"
                  style={getClassTypeStyle(type)}
                ></div>
                <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course;
