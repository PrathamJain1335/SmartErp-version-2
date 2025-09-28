import React from 'react';
import { useNavigate } from 'react-router-dom';

const DemoAccess = () => {
  const navigate = useNavigate();

  const setupDemoAuth = (role) => {
    // Clear any existing auth data
    localStorage.clear();
    
    const authData = {
      student: {
        authToken: 'demo-student-direct-' + Date.now(),
        userRole: 'student',
        userId: 'JECRC-CSE-21-001',
        userProfile: JSON.stringify({
          id: 'JECRC-CSE-21-001',
          name: 'Demo Student',
          fullName: 'Demo Student',
          email: 'demo.student@jecrc.edu',
          role: 'student',
          rollNo: 'JECRC-CSE-21-001',
          department: 'Computer Science Engineering',
          currentSemester: 6
        })
      },
      faculty: {
        authToken: 'demo-faculty-direct-' + Date.now(),
        userRole: 'faculty',
        userId: 'FAC001',
        userProfile: JSON.stringify({
          id: 'FAC001',
          name: 'Dr. Demo Faculty',
          fullName: 'Dr. Demo Faculty',
          email: 'demo.faculty@jecrc.edu',
          role: 'faculty',
          department: 'Computer Science Department'
        })
      }
    };

    const userData = authData[role];
    
    // Set authentication data
    Object.entries(userData).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });

    console.log(`✅ Demo ${role} authentication set up`);
    
    // Navigate to the portal
    navigate(`/${role}`);
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: 9999,
      backgroundColor: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '8px',
      fontSize: '12px'
    }}>
      <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>🚀 Demo Access</div>
      <button
        onClick={() => setupDemoAuth('student')}
        style={{
          marginRight: '5px',
          padding: '4px 8px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '11px'
        }}
      >
        📚 Student
      </button>
      <button
        onClick={() => setupDemoAuth('faculty')}
        style={{
          padding: '4px 8px',
          backgroundColor: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '11px'
        }}
      >
        👨‍🏫 Faculty
      </button>
    </div>
  );
};

export default DemoAccess;