import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex items-center justify-center
        w-12 h-6 rounded-full transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${isDarkMode ? 'bg-gray-600 focus:ring-blue-400' : 'bg-gray-300 focus:ring-blue-500'}
        ${className}
      `}
      style={{
        backgroundColor: isDarkMode ? 'var(--border)' : '#e5e7eb'
      }}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span
        className={`
          absolute left-1 inline-flex items-center justify-center
          w-4 h-4 bg-white rounded-full shadow transform
          transition-transform duration-300 ease-in-out
          ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}
        `}
      >
        {isDarkMode ? (
          <Moon size={12} className="text-gray-800" />
        ) : (
          <Sun size={12} className="text-yellow-500" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;