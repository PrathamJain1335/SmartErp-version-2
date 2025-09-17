// Test script to verify StudentDetails component
import React from 'react';

// Test if component can be imported without errors
try {
  const StudentDetails = require('./src/AdminPortal/StudentDetails.jsx').default;
  console.log('✅ StudentDetails component imported successfully');
  console.log('✅ Component type:', typeof StudentDetails);
  
  // Check if it's a React component
  if (typeof StudentDetails === 'function') {
    console.log('✅ StudentDetails is a valid React component');
  } else {
    console.log('❌ StudentDetails is not a function component');
  }
} catch (error) {
  console.log('❌ Error importing StudentDetails:', error.message);
}