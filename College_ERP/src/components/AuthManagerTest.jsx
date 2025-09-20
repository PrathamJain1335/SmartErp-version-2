import React, { useState, useEffect } from 'react';
import authManager from '../utils/authManager';

const AuthManagerTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (test, status, message, data = null) => {
    setTestResults(prev => [...prev, {
      id: Date.now() + Math.random(),
      test,
      status, // 'pass', 'fail', 'info'
      message,
      data,
      timestamp: new Date()
    }]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const runMigrationTests = async () => {
    setIsRunning(true);
    clearResults();

    addResult('Test Suite', 'info', '🚀 Starting AuthManager migration tests...');

    try {
      // Test 1: Clear all authentication data first
      addResult('Cleanup', 'info', 'Clearing all auth data to start clean...');
      authManager.clearAuth();
      
      // Test 2: Check initial state
      const initialState = authManager.getCurrentUser();
      addResult('Initial State', 
        !initialState.isAuthenticated ? 'pass' : 'fail',
        'Initial state should be unauthenticated',
        initialState
      );

      // Test 3: Simulate legacy token storage
      addResult('Legacy Setup', 'info', 'Setting up legacy token keys...');
      localStorage.setItem('token', 'legacy-token-123');
      localStorage.setItem('access_token', 'access-token-456');
      localStorage.setItem('userRole', 'student');
      localStorage.setItem('userId', 'test-user-001');

      // Test 4: Check legacy detection
      const legacyKeys = Object.keys(localStorage).filter(key => 
        ['token', 'access_token', 'accessToken', 'jwt_token'].includes(key)
      );
      addResult('Legacy Detection', 
        legacyKeys.length > 0 ? 'pass' : 'fail',
        `Found ${legacyKeys.length} legacy keys: ${legacyKeys.join(', ')}`
      );

      // Test 5: Force migration by creating new AuthManager instance
      addResult('Migration', 'info', 'Triggering token migration...');
      // Simulate page reload by manually calling migration
      authManager.migrateLegacyTokens();

      // Test 6: Verify migration
      const afterMigration = authManager.getToken();
      const legacyAfter = localStorage.getItem('token');
      
      addResult('Migration Result', 
        (afterMigration && !legacyAfter) ? 'pass' : 'fail',
        `Token migrated: ${!!afterMigration}, Legacy cleaned: ${!legacyAfter}`
      );

      // Test 7: Test authentication methods
      const testUser = {
        token: 'test-jwt-token-789',
        role: 'student',
        userId: 'student-123',
        user: {
          id: 'student-123',
          name: 'Test Student',
          email: 'test@example.com',
          role: 'student'
        }
      };

      addResult('Auth Data Set', 'info', 'Setting complete auth data...');
      authManager.setAuthData(testUser);

      // Test 8: Verify all data is set correctly
      const currentUser = authManager.getCurrentUser();
      const isAuth = authManager.isAuthenticated();

      addResult('Authentication Check', 
        isAuth ? 'pass' : 'fail',
        `User authenticated: ${isAuth}`,
        currentUser
      );

      addResult('Token Check', 
        currentUser.token === testUser.token ? 'pass' : 'fail',
        `Token matches: ${currentUser.token === testUser.token}`
      );

      addResult('Role Check', 
        currentUser.role === testUser.role ? 'pass' : 'fail',
        `Role matches: ${currentUser.role === testUser.role}`
      );

      addResult('Profile Check', 
        currentUser.profile?.name === testUser.user.name ? 'pass' : 'fail',
        `Profile matches: ${currentUser.profile?.name === testUser.user.name}`
      );

      // Test 9: Test auth header generation
      const authHeader = authManager.getAuthHeader();
      addResult('Auth Header', 
        authHeader?.Authorization === `Bearer ${testUser.token}` ? 'pass' : 'fail',
        `Auth header correct: ${authHeader?.Authorization}`,
        authHeader
      );

      // Test 10: Test token validation
      const isValidFormat = authManager.isValidTokenFormat(testUser.token);
      addResult('Token Format', 
        !isValidFormat ? 'pass' : 'fail', // Our test token is not JWT format, so it should fail
        `Token format validation working: ${!isValidFormat} (expected false for test token)`
      );

      // Test 11: Test debug function
      const debugInfo = authManager.debug();
      addResult('Debug Function', 
        debugInfo.hasToken && debugInfo.isAuthenticated ? 'pass' : 'fail',
        'Debug function provides comprehensive info',
        debugInfo
      );

      // Test 12: Test cleanup
      addResult('Final Cleanup', 'info', 'Testing cleanup functionality...');
      authManager.clearAuth();
      const afterCleanup = authManager.getCurrentUser();
      
      addResult('Cleanup Verification', 
        !afterCleanup.isAuthenticated ? 'pass' : 'fail',
        `All data cleared: ${!afterCleanup.isAuthenticated}`,
        afterCleanup
      );

      addResult('Test Suite', 'pass', '✅ All migration tests completed!');

    } catch (error) {
      addResult('Test Suite', 'fail', `❌ Test suite failed: ${error.message}`, error);
    } finally {
      setIsRunning(false);
    }
  };

  const simulateLegacyUser = () => {
    // Simulate a user with old token storage pattern
    localStorage.clear();
    localStorage.setItem('token', 'old-jwt-token-' + Date.now());
    localStorage.setItem('userRole', 'faculty');
    localStorage.setItem('userId', 'faculty-001');
    localStorage.setItem('userProfile', JSON.stringify({
      id: 'faculty-001',
      name: 'Dr. Legacy User',
      email: 'legacy@example.com',
      role: 'faculty'
    }));

    addResult('Legacy Simulation', 'info', 'Legacy user data simulated. Refresh page to test migration.');
  };

  const testCurrentAuth = () => {
    const currentUser = authManager.getCurrentUser();
    const debugInfo = authManager.debug();
    
    addResult('Current Auth State', 'info', 'Current authentication state', {
      user: currentUser,
      debug: debugInfo
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🔐 AuthManager Test Suite</h2>
      
      <div className="mb-6 space-x-4">
        <button
          onClick={runMigrationTests}
          disabled={isRunning}
          className={`px-4 py-2 rounded font-medium ${
            isRunning 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isRunning ? '🔄 Running Tests...' : '🧪 Run Migration Tests'}
        </button>
        
        <button
          onClick={simulateLegacyUser}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded font-medium"
        >
          👴 Simulate Legacy User
        </button>
        
        <button
          onClick={testCurrentAuth}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium"
        >
          📊 Check Current Auth
        </button>
        
        <button
          onClick={clearResults}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-medium"
        >
          🗑️ Clear Results
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3">Test Results:</h3>
        
        {testResults.length === 0 && (
          <p className="text-gray-500 italic">No tests run yet. Click "Run Migration Tests" to start.</p>
        )}
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {testResults.map((result) => (
            <div
              key={result.id}
              className={`p-3 rounded border-l-4 ${
                result.status === 'pass' 
                  ? 'bg-green-50 border-green-500' 
                  : result.status === 'fail'
                  ? 'bg-red-50 border-red-500'
                  : 'bg-blue-50 border-blue-500'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-medium ${
                      result.status === 'pass' 
                        ? 'text-green-700' 
                        : result.status === 'fail'
                        ? 'text-red-700'
                        : 'text-blue-700'
                    }`}>
                      {result.status === 'pass' && '✅'}
                      {result.status === 'fail' && '❌'}
                      {result.status === 'info' && 'ℹ️'}
                      {result.test}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">{result.message}</p>
                  {result.data && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                        View Data
                      </summary>
                      <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {result.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h4 className="font-semibold text-yellow-800 mb-2">💡 Testing Instructions:</h4>
        <ol className="text-sm text-yellow-700 space-y-1">
          <li>1. <strong>Run Migration Tests</strong> - Comprehensive test of all AuthManager functionality</li>
          <li>2. <strong>Simulate Legacy User</strong> - Sets up old token format, then refresh page to test migration</li>
          <li>3. <strong>Check Current Auth</strong> - View current authentication state</li>
          <li>4. After making changes, use the ERP Chatbot to verify it works with the new AuthManager</li>
        </ol>
      </div>
    </div>
  );
};

export default AuthManagerTest;