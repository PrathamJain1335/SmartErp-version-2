// utils/mockDataGenerator.js - Generate personalized mock data for different students

const generateStudentSpecificData = (studentId, rollNo) => {
  // Use student ID to generate consistent but different data for each student
  const seed = rollNo ? rollNo.split('-').pop() : studentId.slice(-3);
  const numericSeed = parseInt(seed) || 1;
  
  // Generate attendance data
  const generateAttendance = () => {
    const subjects = ['Data Structures', 'Mathematics-III', 'Database Management', 'Operating Systems', 'Computer Networks'];
    const attendance = [];
    
    // Generate last 30 days attendance
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      subjects.forEach((subject, index) => {
        // Use student seed to create different attendance patterns
        const attendanceRate = 0.6 + (numericSeed % 4) * 0.1; // 60-90% attendance
        const shouldAttend = Math.random() < attendanceRate;
        
        attendance.push({
          id: attendance.length + 1,
          date: date.toISOString().split('T')[0],
          subject: subject,
          status: shouldAttend ? 'present' : 'absent',
          faculty: `Prof. ${['Sharma', 'Gupta', 'Singh', 'Patel', 'Agarwal'][index]}`,
          timestamp: date.toISOString()
        });
      });
    }
    
    return attendance.slice(0, 50); // Return last 50 records
  };
  
  // Generate assignment data
  const generateAssignments = () => {
    const assignments = [
      {
        id: 1,
        title: 'Data Structures Assignment 1',
        description: 'Implement Binary Search Tree with insertion, deletion and traversal',
        subject: 'Data Structures',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: numericSeed % 3 === 0 ? 'submitted' : 'pending',
        maxMarks: 100,
        obtainedMarks: numericSeed % 3 === 0 ? 75 + (numericSeed % 20) : null,
        assignedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        title: 'Database Lab Assignment',
        description: 'Design and implement a library management system database',
        subject: 'Database Management',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: numericSeed % 2 === 0 ? 'submitted' : 'pending',
        maxMarks: 50,
        obtainedMarks: numericSeed % 2 === 0 ? 35 + (numericSeed % 15) : null,
        assignedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        title: 'OS Practical Assignment',
        description: 'Implement CPU scheduling algorithms (FCFS, SJF, Priority)',
        subject: 'Operating Systems',
        dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        maxMarks: 75,
        obtainedMarks: null,
        assignedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    return assignments;
  };
  
  // Generate grades data
  const generateGrades = () => {
    const subjects = [
      { name: 'Data Structures', credits: 4 },
      { name: 'Mathematics-III', credits: 4 },
      { name: 'Database Management', credits: 3 },
      { name: 'Operating Systems', credits: 4 },
      { name: 'Computer Networks', credits: 3 }
    ];
    
    return subjects.map((subject, index) => {
      // Generate different grade patterns based on student seed
      const baseMarks = 60 + (numericSeed % 30);
      const variation = (index * numericSeed) % 20;
      const marks = Math.min(100, baseMarks + variation);
      
      let grade = 'F';
      if (marks >= 90) grade = 'A';
      else if (marks >= 80) grade = 'B';
      else if (marks >= 70) grade = 'C';
      else if (marks >= 60) grade = 'D';
      
      return {
        id: index + 1,
        subject: subject.name,
        credits: subject.credits,
        marks: marks,
        maxMarks: 100,
        grade: grade,
        semester: '5',
        examType: 'End Semester'
      };
    });
  };
  
  // Generate upcoming exams
  const generateExams = () => {
    return [
      {
        id: 1,
        subject: 'Data Structures',
        examType: 'Mid Semester',
        date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        time: '10:00 AM',
        duration: '3 hours',
        room: 'CS-101',
        syllabus: 'Chapters 1-5: Arrays, Linked Lists, Stacks, Queues, Trees'
      },
      {
        id: 2,
        subject: 'Database Management',
        examType: 'Internal Assessment',
        date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
        time: '2:00 PM',
        duration: '1 hour',
        room: 'CS-102',
        syllabus: 'ER Diagrams, Normalization, SQL Queries'
      }
    ];
  };
  
  const attendance = generateAttendance();
  const totalClasses = attendance.length;
  const presentClasses = attendance.filter(a => a.status === 'present').length;
  const attendancePercentage = Math.round((presentClasses / totalClasses) * 100);
  
  return {
    attendance: attendance,
    assignments: generateAssignments(),
    grades: generateGrades(),
    exams: generateExams(),
    statistics: {
      attendancePercentage,
      totalClasses,
      presentClasses,
      cgpa: (7.0 + (numericSeed % 2)).toFixed(2)
    }
  };
};

module.exports = {
  generateStudentSpecificData
};