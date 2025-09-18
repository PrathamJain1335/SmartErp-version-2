// Test script to validate chatbot navigation functionality
import { createNavigationHandler } from './src/utils/chatbotNavigation.js';

// Mock functions for testing
const mockNavigate = (path) => {
  console.log('✅ Navigate called with:', path);
};

const mockSetActiveTab = (tab) => {
  console.log('✅ SetActiveTab called with:', tab);
};

// Create navigation handler
const handler = createNavigationHandler(mockNavigate, 'student', mockSetActiveTab);

// Test different navigation types
console.log('🧪 Testing chatbot navigation...\n');

console.log('1. Testing dashboard navigation:');
handler.handleNavigation('dashboard');

console.log('\n2. Testing grades navigation:');
handler.handleNavigation('grades');

console.log('\n3. Testing attendance navigation:');
handler.handleNavigation('attendance');

console.log('\n4. Testing profile navigation:');
handler.handleNavigation('profile');

console.log('\n5. Testing courses navigation:');
handler.handleNavigation('courses');

console.log('\n6. Testing unknown navigation:');
handler.handleNavigation('unknown');

console.log('\n🎯 Navigation test completed!');