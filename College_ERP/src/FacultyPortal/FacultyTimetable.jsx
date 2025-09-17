import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  TrendingUp,
  Search,
  Target,
  Award,
  Zap,
  Plus,
  Share2,
  Building,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import './theme.css';

// Time slots for the timetable
const timeSlots = [
  { id: '09:00', time: '09:00 AM', label: '9:00 - 10:00' },
  { id: '10:00', time: '10:00 AM', label: '10:00 - 11:00' },
  { id: '11:00', time: '11:00 AM', label: '11:00 - 12:00' },
  { id: '12:00', time: '12:00 PM', label: '12:00 - 1:00' },
  { id: '13:00', time: '01:00 PM', label: '1:00 - 2:00' },
  { id: '14:00', time: '02:00 PM', label: '2:00 - 3:00' },
  { id: '15:00', time: '03:00 PM', label: '3:00 - 4:00' },
  { id: '16:00', time: '04:00 PM', label: '4:00 - 5:00' },
];

const weekDays = [
  { id: 'monday', name: 'Monday', short: 'Mon' },
  { id: 'tuesday', name: 'Tuesday', short: 'Tue' },
  { id: 'wednesday', name: 'Wednesday', short: 'Wed' },
  { id: 'thursday', name: 'Thursday', short: 'Thu' },
  { id: 'friday', name: 'Friday', short: 'Fri' },
  { id: 'saturday', name: 'Saturday', short: 'Sat' },
];

// Sample timetable data
const initialTimetable = {
  // [Data remains unchanged, as provided]
  monday: {
    '09:00': {
      id: 'mon-09',
      subject: 'Machine Learning',
      section: 'CS301-A',
      room: 'Room 101',
      type: 'Lecture',
      students: 35,
      duration: 60,
      status: 'Scheduled',
    },
    '11:00': {
      id: 'mon-11',
      subject: 'Machine Learning Lab',
      section: 'CS301-A',
      room: 'Lab 201',
      type: 'Lab',
      students: 35,
      duration: 120,
      status: 'Scheduled',
    },
    '14:00': {
      id: 'mon-14',
      subject: 'Data Science',
      section: 'CS401-A',
      room: 'Room 205',
      type: 'Lecture',
      students: 28,
      duration: 60,
      status: 'Scheduled',
    },
  },
  // [Other days' data remains unchanged]
  tuesday: {
    '10:00': {
      id: 'tue-10',
      subject: 'Advanced AI',
      section: 'CS501-A',
      room: 'Room 301',
      type: 'Lecture',
      students: 25,
      duration: 60,
      status: 'Scheduled',
    },
    '13:00': {
      id: 'tue-13',
      subject: 'Machine Learning',
      section: 'CS301-B',
      room: 'Room 102',
      type: 'Lecture',
      students: 32,
      duration: 60,
      status: 'Scheduled',
    },
  },
  wednesday: {
    '09:00': {
      id: 'wed-09',
      subject: 'Data Science Lab',
      section: 'CS401-A',
      room: 'Lab 301',
      type: 'Lab',
      students: 28,
      duration: 120,
      status: 'Scheduled',
    },
    '15:00': {
      id: 'wed-15',
      subject: 'Advanced AI Workshop',
      section: 'CS501-A',
      room: 'Seminar Hall',
      type: 'Workshop',
      students: 25,
      duration: 90,
      status: 'Scheduled',
    },
  },
  thursday: {
    '10:00': {
      id: 'thu-10',
      subject: 'Machine Learning',
      section: 'CS301-A',
      room: 'Room 101',
      type: 'Tutorial',
      students: 35,
      duration: 60,
      status: 'Scheduled',
    },
    '14:00': {
      id: 'thu-14',
      subject: 'Data Science',
      section: 'CS401-A',
      room: 'Room 205',
      type: 'Lecture',
      students: 28,
      duration: 60,
      status: 'Scheduled',
    },
  },
  friday: {
    '11:00': {
      id: 'fri-11',
      subject: 'Advanced AI',
      section: 'CS501-A',
      room: 'Room 301',
      type: 'Lecture',
      students: 25,
      duration: 60,
      status: 'Scheduled',
    },
  },
  saturday: {
    '09:00': {
      id: 'sat-09',
      subject: 'Faculty Meeting',
      section: 'All Faculty',
      room: 'Conference Room',
      type: 'Meeting',
      students: 0,
      duration: 120,
      status: 'Scheduled',
    },
  },
};

const rooms = [
  { id: 'room-101', name: 'Room 101', capacity: 50, type: 'Classroom', building: 'A Block' },
  { id: 'room-102', name: 'Room 102', capacity: 45, type: 'Classroom', building: 'A Block' },
  { id: 'room-205', name: 'Room 205', capacity: 40, type: 'Classroom', building: 'B Block' },
  { id: 'room-301', name: 'Room 301', capacity: 60, type: 'Classroom', building: 'C Block' },
  { id: 'lab-201', name: 'Lab 201', capacity: 30, type: 'Computer Lab', building: 'A Block' },
  { id: 'lab-301', name: 'Lab 301', capacity: 25, type: 'Computer Lab', building: 'C Block' },
  { id: 'seminar-hall', name: 'Seminar Hall', capacity: 100, type: 'Seminar Hall', building: 'Main Block' },
  { id: 'conference-room', name: 'Conference Room', capacity: 20, type: 'Meeting Room', building: 'Admin Block' },
];

const FacultyTimetable = () => {
  const [timetable, setTimetable] = useState(initialTimetable);
  const [activeView, setActiveView] = useState('week');
  const [selectedWeek, setSelectedWeek] = useState(0); // Current week
  const [selectedClass, setSelectedClass] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [conflicts, setConflicts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newClass, setNewClass] = useState({
    day: '',
    timeSlot: '',
    subject: '',
    section: '',
    room: '',
    type: 'Lecture',
    students: 0,
    duration: 60,
  });

  // Analytics
  const analytics = useMemo(() => {
    let totalClasses = 0;
    let totalHours = 0;
    let totalStudents = 0;
    const classTypes = {};
    const roomUtilization = {};

    Object.values(timetable).forEach((day) => {
      Object.values(day).forEach((cls) => {
        totalClasses++;
        totalHours += cls.duration / 60;
        totalStudents += cls.students;
        classTypes[cls.type] = (classTypes[cls.type] || 0) + 1;
        roomUtilization[cls.room] = (roomUtilization[cls.room] || 0) + 1;
      });
    });

    return {
      totalClasses,
      totalHours: totalHours.toFixed(1),
      totalStudents,
      avgStudentsPerClass:
        totalClasses > 0 ? Math.round(totalStudents / totalClasses) : 0,
      classTypes,
      roomUtilization,
      weeklyLoad: Math.round(totalHours / 6), // Average hours per day
    };
  }, [timetable]);

  // Chart data
  const classTypeData = Object.entries(analytics.classTypes).map(([type, count], index) => ({
    name: type,
    value: count,
    color: `var(--chart-color-${(index % 10) + 1})`,
  }));

  const dailyLoadData = weekDays.map((day) => {
    const dayClasses = Object.values(timetable[day.id] || {});
    const hours = dayClasses.reduce((sum, cls) => sum + cls.duration / 60, 0);
    return {
      day: day.short,
      hours: hours.toFixed(1),
      classes: dayClasses.length,
    };
  });

  const getClassTypeColor = (type) => {
    const colors = {
      Lecture: 'var(--chart-color-1)',
      Lab: 'var(--chart-color-2)',
      Tutorial: 'var(--chart-color-3)',
      Workshop: 'var(--chart-color-4)',
      Meeting: 'var(--chart-color-5)',
    };
    return colors[type] || 'var(--chart-color-6)';
  };

  // Conflict detection (basic placeholder)
  const checkConflicts = (newClassData) => {
    const { day, timeSlot, room } = newClassData;
    const conflicts = [];
    if (timetable[day]?.[timeSlot]) {
      conflicts.push(`Time slot ${timeSlot} on ${day} is already occupied.`);
    }
    Object.values(timetable[day] || {}).forEach((cls) => {
      if (cls.timeSlot === timeSlot && cls.room === room) {
        conflicts.push(`Room ${room} is already booked at ${timeSlot} on ${day}.`);
      }
    });
    setConflicts(conflicts);
    return conflicts.length === 0;
  };

  const handleAddClass = (e) => {
    e.preventDefault();
    if (checkConflicts(newClass)) {
      const newClassId = `${newClass.day}-${newClass.timeSlot}-${Date.now()}`;
      setTimetable((prev) => ({
        ...prev,
        [newClass.day]: {
          ...prev[newClass.day],
          [newClass.timeSlot]: {
            id: newClassId,
            ...newClass,
            status: 'Scheduled',
          },
        },
      }));
      setShowCreateModal(false);
      setNewClass({
        day: '',
        timeSlot: '',
        subject: '',
        section: '',
        room: '',
        type: 'Lecture',
        students: 0,
        duration: 60,
      });
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, color }) => (
    <div className="faculty-card p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl bg-opacity-10" style={{ backgroundColor: color }}>
          <Icon size={24} style={{ color }} />
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              trend > 0 ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {trend > 0 ? <TrendingUp size={16} /> : <TrendingUp size={16} className="rotate-180" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <div className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          {value}
        </div>
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          {title}
        </p>
        {subtitle && (
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );

  const ClassCard = ({ classData, day, timeSlot }) => {
    if (!classData) {
      return (
        <div
          className="h-full min-h-[85px] border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 group hover:shadow-md"
          style={{ 
            borderColor: 'var(--border)',
            backgroundColor: 'transparent'
          }}
          onClick={() => setShowCreateModal(true)}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--hover)';
            e.currentTarget.style.borderColor = 'var(--faculty-primary)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div className="text-center p-2">
            <Plus size={22} className="mx-auto mb-2 group-hover:scale-125 transition-transform duration-300" style={{ color: 'var(--text-muted)' }} />
            <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Add Class</p>
          </div>
        </div>
      );
    }

    const getDurationHeight = (duration) => {
      // Adjust card height based on duration with better spacing
      if (duration >= 120) return 'min-h-[110px]';
      if (duration >= 90) return 'min-h-[95px]';
      return 'min-h-[85px]';
    };

    const getStatusIndicator = (status) => {
      const indicators = {
        'Scheduled': { color: 'var(--chart-color-2)', icon: '●' },
        'In Progress': { color: 'var(--chart-color-4)', icon: '▶' },
        'Completed': { color: 'var(--chart-color-3)', icon: '✓' },
        'Cancelled': { color: 'var(--chart-color-1)', icon: '✕' }
      };
      return indicators[status] || indicators['Scheduled'];
    };

    const statusInfo = getStatusIndicator(classData.status);

    return (
      <div
        className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${getDurationHeight(classData.duration)}`}
        style={{
          background: `linear-gradient(135deg, ${getClassTypeColor(classData.type)}12, ${getClassTypeColor(classData.type)}20)`,
          border: `1px solid ${getClassTypeColor(classData.type)}40`,
          borderLeft: `5px solid ${getClassTypeColor(classData.type)}`,
          boxShadow: `0 2px 8px ${getClassTypeColor(classData.type)}10`
        }}
        onClick={() => setSelectedClass({ ...classData, day, timeSlot })}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {/* Status indicator */}
        <div className="absolute top-3 right-3 flex items-center gap-1">
          <div
            className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: statusInfo.color }}
            title={classData.status}
          />
        </div>

        {/* Main content */}
        <div className="flex flex-col h-full">
          <div className="flex-1">
            {/* Subject and Type */}
            <div className="mb-3">
              <h4 
                className="font-bold text-base leading-tight mb-2 group-hover:text-opacity-90 transition-all duration-200" 
                style={{ color: 'var(--text-primary)' }}
                title={classData.subject}
              >
                {classData.subject.length > 18 ? `${classData.subject.substring(0, 18)}...` : classData.subject}
              </h4>
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white shadow-md backdrop-blur-sm"
                style={{ 
                  backgroundColor: getClassTypeColor(classData.type),
                  boxShadow: `0 2px 4px ${getClassTypeColor(classData.type)}40`
                }}
              >
                {classData.type}
              </span>
            </div>

            {/* Class details */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                <Users size={14} className="flex-shrink-0" style={{ color: getClassTypeColor(classData.type) }} />
                <span className="truncate">
                  {classData.section} ({classData.students} students)
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                <MapPin size={14} className="flex-shrink-0" style={{ color: getClassTypeColor(classData.type) }} />
                <span className="truncate font-medium">{classData.room}</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                <Clock size={14} className="flex-shrink-0" style={{ color: getClassTypeColor(classData.type) }} />
                <span className="font-medium">{classData.duration} minutes</span>
              </div>
            </div>
          </div>

          {/* Duration indicator for long classes */}
          {classData.duration > 60 && (
            <div 
              className="mt-3 text-xs text-center py-2 rounded-lg font-semibold"
              style={{ 
                backgroundColor: getClassTypeColor(classData.type) + '25',
                color: getClassTypeColor(classData.type),
                border: `1px solid ${getClassTypeColor(classData.type)}30`
              }}
            >
              Extended Class ({Math.floor(classData.duration / 60)}h {classData.duration % 60}min)
            </div>
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-white bg-opacity-0 group-hover:bg-opacity-5 rounded-xl transition-all duration-300 pointer-events-none" />
      </div>
    );
  };

  const TimetableGrid = () => {
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1 + (selectedWeek * 7)));
    
    const getDateForDay = (dayIndex) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + dayIndex);
      return date;
    };

    return (
      <div className="faculty-card p-4 lg:p-6">
        {/* Mobile view - Stacked layout */}
        <div className="block lg:hidden">
          <div className="space-y-4">
            {weekDays.map((day, dayIndex) => {
              const dayDate = getDateForDay(dayIndex);
              const dayClasses = Object.entries(timetable[day.id] || {}).map(([time, cls]) => ({ time, ...cls }));
              
              return (
                <div key={day.id} className="border rounded-lg" style={{ borderColor: 'var(--border)' }}>
                  <div className="p-4 border-b" style={{ backgroundColor: 'var(--hover)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{day.name}</h3>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                          {dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="text-sm font-medium" style={{ color: 'var(--faculty-primary)' }}>
                        {dayClasses.length} {dayClasses.length === 1 ? 'class' : 'classes'}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    {dayClasses.length > 0 ? (
                      dayClasses.sort((a, b) => a.time.localeCompare(b.time)).map((cls) => (
                        <div key={cls.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                                {cls.subject}
                              </h4>
                              <span
                                className="px-2 py-1 rounded text-xs font-medium text-white"
                                style={{ backgroundColor: getClassTypeColor(cls.type) }}
                              >
                                {cls.type}
                              </span>
                            </div>
                            <div className="text-xs space-y-1" style={{ color: 'var(--text-muted)' }}>
                              <div>⏰ {timeSlots.find(t => t.id === cls.time)?.label}</div>
                              <div>📍 {cls.room} • 👥 {cls.section} ({cls.students})</div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Plus size={24} className="mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No classes scheduled</p>
                        <button
                          onClick={() => setShowCreateModal(true)}
                          className="mt-2 text-sm" 
                          style={{ color: 'var(--faculty-primary)' }}
                        >
                          Add class
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop view - Grid layout */}
        <div className="hidden lg:block overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Enhanced Header */}
            <div className="grid grid-cols-8 gap-3 mb-6">
              <div className="col-span-1 flex items-center justify-center py-4 rounded-lg" style={{ backgroundColor: 'var(--hover)' }}>
                <div className="text-center">
                  <Clock size={16} className="mx-auto mb-1" style={{ color: 'var(--text-muted)' }} />
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Time</div>
                </div>
              </div>
              {weekDays.map((day, dayIndex) => {
                const dayDate = getDateForDay(dayIndex);
                const dayClasses = Object.keys(timetable[day.id] || {}).length;
                const isToday = dayDate.toDateString() === new Date().toDateString();
                
                return (
                  <div
                    key={day.id}
                    className={`col-span-1 p-4 rounded-lg text-center transition-all duration-200 ${
                      isToday ? 'ring-2 ring-red-500 ring-opacity-50' : ''
                    }`}
                    style={{
                      backgroundColor: isToday ? 'var(--faculty-primary)20' : 'var(--hover)',
                    }}
                  >
                    <div className="font-bold text-lg" style={{ color: isToday ? 'var(--faculty-primary)' : 'var(--text-primary)' }}>
                      {day.short}
                    </div>
                    <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                      {dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      {dayClasses} {dayClasses === 1 ? 'class' : 'classes'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Enhanced Time slots */}
            <div className="space-y-3">
              {timeSlots.map((slot, slotIndex) => (
                <div key={slot.id} className="grid grid-cols-8 gap-3">
                  <div
                    className="col-span-1 flex items-center justify-center py-4 rounded-lg font-medium transition-all duration-200"
                    style={{
                      backgroundColor: 'var(--card)',
                      color: 'var(--text-secondary)',
                      minHeight: '80px',
                    }}
                  >
                    <div className="text-center">
                      <div className="text-sm font-bold">{slot.time}</div>
                      <div className="text-xs opacity-75">{slot.label.split(' - ')[1]}</div>
                    </div>
                  </div>
                  {weekDays.map((day) => (
                    <div key={`${day.id}-${slot.id}`} className="col-span-1" style={{ minHeight: '80px' }}>
                      <ClassCard classData={timetable[day.id]?.[slot.id]} day={day.id} timeSlot={slot.id} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CreateClassModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl" style={{ backgroundColor: 'var(--card)' }}>
        {/* Modal Header */}
        <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--faculty-primary)20' }}>
                <Plus size={20} style={{ color: 'var(--faculty-primary)' }} />
              </div>
              <div>
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Add New Class
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Schedule a new class in your timetable
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(false)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <ChevronLeft size={20} style={{ color: 'var(--text-muted)' }} />
            </button>
          </div>
        </div>
        {/* Modal Body */}
        <div className="p-6">
          <form onSubmit={handleAddClass} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Basic Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    <BookOpen size={16} className="inline mr-2" />
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={newClass.subject}
                    onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                    style={{ backgroundColor: 'var(--card)', color: 'var(--text)', borderColor: 'var(--border)' }}
                    placeholder="e.g., Machine Learning"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    <Users size={16} className="inline mr-2" />
                    Section
                  </label>
                  <input
                    type="text"
                    required
                    value={newClass.section}
                    onChange={(e) => setNewClass({ ...newClass, section: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                    style={{ backgroundColor: 'var(--card)', color: 'var(--text)', borderColor: 'var(--border)' }}
                    placeholder="e.g., CS301-A"
                  />
                </div>
              </div>
            </div>

            {/* Schedule Information */}
            <div>
              <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Schedule Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    <Calendar size={16} className="inline mr-2" />
                    Day
                  </label>
                  <select
                    required
                    value={newClass.day}
                    onChange={(e) => setNewClass({ ...newClass, day: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                    style={{ backgroundColor: 'var(--card)', color: 'var(--text)', borderColor: 'var(--border)' }}
                  >
                    <option value="">Select Day</option>
                    {weekDays.map((day) => (
                      <option key={day.id} value={day.id}>
                        {day.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    <Clock size={16} className="inline mr-2" />
                    Time Slot
                  </label>
                  <select
                    required
                    value={newClass.timeSlot}
                    onChange={(e) => setNewClass({ ...newClass, timeSlot: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                    style={{ backgroundColor: 'var(--card)', color: 'var(--text)', borderColor: 'var(--border)' }}
                  >
                    <option value="">Select Time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot.id} value={slot.id}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    <Clock size={16} className="inline mr-2" />
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    required
                    min="15"
                    max="240"
                    step="15"
                    value={newClass.duration}
                    onChange={(e) => setNewClass({ ...newClass, duration: parseInt(e.target.value) || 60 })}
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                    style={{ backgroundColor: 'var(--card)', color: 'var(--text)', borderColor: 'var(--border)' }}
                    placeholder="60"
                  />
                </div>
              </div>
            </div>

            {/* Location & Type */}
            <div>
              <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                Location & Type
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    <MapPin size={16} className="inline mr-2" />
                    Room
                  </label>
                  <select
                    required
                    value={newClass.room}
                    onChange={(e) => setNewClass({ ...newClass, room: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                    style={{ backgroundColor: 'var(--card)', color: 'var(--text)', borderColor: 'var(--border)' }}
                  >
                    <option value="">Select Room</option>
                    {rooms.map((room) => (
                      <option key={room.id} value={room.name}>
                        {room.name} - {room.type} ({room.capacity} capacity)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    <Target size={16} className="inline mr-2" />
                    Class Type
                  </label>
                  <select
                    value={newClass.type}
                    onChange={(e) => setNewClass({ ...newClass, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                    style={{ backgroundColor: 'var(--card)', color: 'var(--text)', borderColor: 'var(--border)' }}
                  >
                    <option value="Lecture">Lecture</option>
                    <option value="Lab">Lab</option>
                    <option value="Tutorial">Tutorial</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Meeting">Meeting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    <Users size={16} className="inline mr-2" />
                    Number of Students
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="200"
                    value={newClass.students}
                    onChange={(e) => setNewClass({ ...newClass, students: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                    style={{ backgroundColor: 'var(--card)', color: 'var(--text)', borderColor: 'var(--border)' }}
                    placeholder="30"
                  />
                </div>
              </div>
            </div>

            {/* Conflicts Warning */}
            {conflicts.length > 0 && (
              <div className="p-4 rounded-lg border-l-4 border-red-500" style={{ backgroundColor: 'var(--chart-color-1)10' }}>
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-red-700 mb-2">Schedule Conflicts Detected</h5>
                    <div className="space-y-1">
                      {conflicts.map((conflict, index) => (
                        <p key={index} className="text-sm text-red-600">{conflict}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t flex justify-end gap-3" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--hover)' }}>
          <button
            type="button"
            onClick={() => setShowCreateModal(false)}
            className="px-6 py-3 rounded-lg border transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-class-form"
            onClick={handleAddClass}
            disabled={conflicts.length > 0 || !newClass.subject || !newClass.day || !newClass.timeSlot}
            className="px-6 py-3 rounded-lg text-white transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'var(--faculty-primary)' }}
          >
            <Plus size={16} className="inline mr-2" />
            Add Class
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="faculty-portal min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Timetable Management
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Manage your schedule and class timings
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white"
            style={{ backgroundColor: 'var(--faculty-primary)' }}
          >
            <Plus size={18} />
            Add Class
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600"
            style={{ color: 'var(--text)' }}
          >
            <Share2 size={18} />
            Export Schedule
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <StatCard
          icon={BookOpen}
          title="Total Classes"
          value={analytics.totalClasses}
          subtitle="Weekly schedule"
          color="var(--chart-color-1)"
          trend={5}
        />
        <StatCard
          icon={Clock}
          title="Teaching Hours"
          value={analytics.totalHours}
          subtitle="Per week"
          color="var(--chart-color-2)"
          trend={3}
        />
        <StatCard
          icon={Users}
          title="Total Students"
          value={analytics.totalStudents}
          subtitle="Across all classes"
          color="var(--chart-color-3)"
          trend={8}
        />
        <StatCard
          icon={Building}
          title="Daily Load"
          value={`${analytics.weeklyLoad}h`}
          subtitle="Average hours/day"
          color="var(--chart-color-4)"
          trend={-2}
        />
        <StatCard
          icon={Target}
          title="Avg Class Size"
          value={analytics.avgStudentsPerClass}
          subtitle="Students per class"
          color="var(--chart-color-5)"
          trend={1}
        />
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {['week', 'daily', 'rooms', 'analytics'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveView(tab)}
            className={`px-4 py-2 font-medium capitalize transition-colors ${
              activeView === tab
                ? 'border-b-2 border-red-500 text-red-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            {tab === 'week' ? 'Weekly View' : tab}
          </button>
        ))}
      </div>

      {/* Content based on active view */}
      {activeView === 'week' && (
        <div className="space-y-6">
          {/* Enhanced Weekly Header */}
          <div className="faculty-card p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar size={24} style={{ color: 'var(--faculty-primary)' }} />
                  <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    Weekly Schedule
                  </h2>
                </div>
                <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-muted)' }}>
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} />
                    <span>{analytics.totalClasses} classes this week</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{analytics.totalHours} teaching hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    <span>{analytics.totalStudents} total students</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Week Navigation */}
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 rounded-lg transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: 'var(--hover)' }}
                    onClick={() => setSelectedWeek((prev) => Math.max(prev - 1, 0))}
                    disabled={selectedWeek === 0}
                  >
                    <ChevronLeft size={20} style={{ color: 'var(--text-primary)' }} />
                  </button>
                  
                  <div className="px-4 py-2 rounded-lg text-center min-w-[140px]" style={{ backgroundColor: 'var(--faculty-primary)20' }}>
                    <div className="text-sm font-bold" style={{ color: 'var(--faculty-primary)' }}>
                      Week {selectedWeek + 1}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {(() => {
                        const currentDate = new Date();
                        const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1 + (selectedWeek * 7)));
                        const endOfWeek = new Date(startOfWeek);
                        endOfWeek.setDate(startOfWeek.getDate() + 5); // Friday
                        return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
                      })()}
                    </div>
                  </div>
                  
                  <button
                    className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                    style={{ backgroundColor: 'var(--hover)' }}
                    onClick={() => setSelectedWeek((prev) => prev + 1)}
                  >
                    <ChevronRight size={20} style={{ color: 'var(--text-primary)' }} />
                  </button>
                </div>
                
                {/* Quick Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedWeek(0)}
                    className="px-3 py-2 text-sm rounded-lg border transition-colors duration-200"
                    style={{ 
                      borderColor: 'var(--border)',
                      color: selectedWeek === 0 ? 'var(--faculty-primary)' : 'var(--text-muted)',
                      backgroundColor: selectedWeek === 0 ? 'var(--faculty-primary)20' : 'transparent'
                    }}
                  >
                    This Week
                  </button>
                  
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-3 py-2 text-sm rounded-lg text-white transition-all duration-200 hover:shadow-md"
                    style={{ backgroundColor: 'var(--faculty-primary)' }}
                  >
                    <Plus size={16} className="inline mr-1" />
                    Add Class
                  </button>
                </div>
              </div>
            </div>
            
            {/* Week Summary Bar */}
            <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <div className="grid grid-cols-6 gap-2">
                {weekDays.map((day, index) => {
                  const dayClasses = Object.keys(timetable[day.id] || {}).length;
                  const dayHours = Object.values(timetable[day.id] || {}).reduce((sum, cls) => sum + cls.duration / 60, 0);
                  const isToday = (() => {
                    const currentDate = new Date();
                    const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1 + (selectedWeek * 7)));
                    const dayDate = new Date(startOfWeek);
                    dayDate.setDate(startOfWeek.getDate() + index);
                    return dayDate.toDateString() === new Date().toDateString();
                  })();
                  
                  return (
                    <div 
                      key={day.id} 
                      className={`p-3 rounded-lg text-center transition-all duration-200 ${
                        isToday ? 'ring-2 ring-red-500 ring-opacity-30' : ''
                      }`}
                      style={{ 
                        backgroundColor: isToday ? 'var(--faculty-primary)15' : 'var(--hover)'
                      }}
                    >
                      <div className={`text-sm font-medium ${
                        isToday ? 'text-red-600' : ''
                      }`} style={{ color: isToday ? 'var(--faculty-primary)' : 'var(--text-primary)' }}>
                        {day.short}
                      </div>
                      <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                        {dayClasses} classes
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {dayHours.toFixed(1)}h
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <TimetableGrid />
        </div>
      )}

      {activeView === 'daily' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Daily Schedule
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {weekDays.map((day) => {
              const dayClasses = Object.entries(timetable[day.id] || {}).map(([time, cls]) => ({
                time,
                ...cls,
              }));

              return (
                <div key={day.id} className="faculty-card p-6">
                  <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                    {day.name}
                  </h3>

                  <div className="space-y-3">
                    {dayClasses.length > 0 ? (
                      dayClasses.map((cls) => (
                        <div
                          key={cls.id}
                          className="p-3 rounded-lg"
                          style={{ backgroundColor: 'var(--hover)' }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium">{cls.subject}</h4>
                            <span
                              className="text-xs px-2 py-1 rounded"
                              style={{
                                backgroundColor: getClassTypeColor(cls.type) + '30',
                                color: getClassTypeColor(cls.type),
                              }}
                            >
                              {cls.type}
                            </span>
                          </div>
                          <div className="text-sm space-y-1" style={{ color: 'var(--text-muted)' }}>
                            <div>🕒 {timeSlots.find((t) => t.id === cls.time)?.label}</div>
                            <div>📍 {cls.room}</div>
                            <div>👥 {cls.section} ({cls.students} students)</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Calendar
                          size={48}
                          className="mx-auto mb-2"
                          style={{ color: 'var(--text-muted)' }}
                        />
                        <p style={{ color: 'var(--text-muted)' }}>No classes scheduled</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeView === 'rooms' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Room Allocation
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {rooms.map((room) => {
              const roomUsage = analytics.roomUtilization[room.name] || 0;
              const utilizationPercentage = Math.round((roomUsage / analytics.totalClasses) * 100);

              return (
                <div key={room.id} className="faculty-card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                        {room.name}
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        {room.type} • {room.building}
                      </p>
                    </div>
                    <div className="text-right">
                      <div
                        className="text-2xl font-bold"
                        style={{ color: 'var(--chart-color-1)' }}
                      >
                        {roomUsage}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Classes
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Capacity:</span>
                      <span className="font-medium">{room.capacity} students</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Utilization:</span>
                      <span className="font-medium">{utilizationPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${utilizationPercentage}%`,
                          backgroundColor:
                            utilizationPercentage > 75
                              ? 'var(--chart-color-1)'
                              : utilizationPercentage > 50
                              ? 'var(--chart-color-4)'
                              : 'var(--chart-color-3)',
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeView === 'analytics' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Schedule Analytics
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Class Types Distribution */}
            <div className="faculty-card p-6">
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Class Types Distribution
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={classTypeData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {classTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        color: 'var(--text)',
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Daily Teaching Load */}
            <div className="faculty-card p-6">
              <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Daily Teaching Load
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyLoadData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                    <XAxis dataKey="day" stroke="var(--text-muted)" />
                    <YAxis stroke="var(--text-muted)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        color: 'var(--text)',
                      }}
                    />
                    <Bar dataKey="hours" fill="var(--chart-color-1)" radius={[4, 4, 0, 0]} />
                    <Legend />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
      {showCreateModal && <CreateClassModal />}
    </div>
  );
};

export default FacultyTimetable;