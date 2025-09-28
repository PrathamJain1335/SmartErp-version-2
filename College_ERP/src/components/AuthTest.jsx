import React, { useState } from 'react';
import { authAPI } from '../services/api';

export default function AuthTest() {
  const [testResult, setTestResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const testLogin = async (credentials) => {
    setIsLoading(true);
    setTestResult('Testing...');
    
    try {
      console.log('🧪 AuthTest: Starting login test with:', credentials);
      
      // Clear any existing auth data
      localStorage.clear();
      
      const response = await authAPI.login(credentials);
      console.log('🧪 AuthTest: Login response:', response);
      
      // Check what was stored
      const stored = {
        authToken: localStorage.getItem('authToken'),
        userRole: localStorage.getItem('userRole'),
        userId: localStorage.getItem('userId'),
        userProfile: localStorage.getItem('userProfile')
      };
      
      console.log('🧪 AuthTest: Stored data:', stored);
      
      // Test getCurrentUser
      const currentUser = authAPI.getCurrentUser();
      console.log('🧪 AuthTest: getCurrentUser result:', currentUser);
      
      setTestResult(`✅ Success!\nResponse: ${JSON.stringify(response, null, 2)}\n\nStored: ${JSON.stringify(stored, null, 2)}\n\nGetCurrentUser: ${JSON.stringify(currentUser, null, 2)}`);
      
    } catch (error) {
      console.error('🧪 AuthTest: Error:', error);
      setTestResult(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testCases = [
    { name: 'Student Email', email: 'suresh.shah.21.1@jecrc.ac.in', password: 'student123', role: 'student' },
    { name: 'Student Roll No', email: 'JECRC-CSE-21-001', password: 'student123', role: 'student' },
    { name: 'Faculty', email: 'kavya.sharma1@jecrc.ac.in', password: 'faculty123', role: 'faculty' },
    { name: 'Admin', email: 'admin@jecrc.ac.in', password: 'admin123', role: 'admin' }
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Authentication Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        {testCases.map((testCase) => (
          <button
            key={testCase.name}
            onClick={() => testLogin(testCase)}
            disabled={isLoading}
            style={{
              margin: '5px',
              padding: '10px',
              backgroundColor: isLoading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            Test {testCase.name}
          </button>
        ))}
      </div>
      
      <button
        onClick={() => {
          localStorage.clear();
          setTestResult('localStorage cleared');
        }}
        style={{
          margin: '5px',
          padding: '10px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        Clear localStorage
      </button>
      
      <div style={{
        marginTop: '20px',
        padding: '10px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #ddd',
        borderRadius: '4px',
        whiteSpace: 'pre-wrap'
      }}>
        <strong>Result:</strong><br />
        {testResult || 'No test run yet'}
      </div>
    </div>
  );
}