import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ className = '', theme, toggleTheme }) => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode

  useEffect(() => {
    // Use external theme prop if provided, otherwise manage internally
    if (theme !== undefined) {
      setIsDarkMode(theme === 'dark');
      return;
    }

    // Check for saved theme preference or default to dark mode
    const savedTheme = localStorage.getItem('theme');
    const shouldUseDarkMode = savedTheme === 'light' ? false : true; // Default to dark
    
    setIsDarkMode(shouldUseDarkMode);
    updateTheme(shouldUseDarkMode);
  }, [theme]);

  const updateTheme = (darkMode) => {
    if (darkMode) {
      document.documentElement.classList.add('dark-root');
    } else {
      document.documentElement.classList.remove('dark-root');
    }
  };

  const handleToggleTheme = () => {
    if (toggleTheme) {
      // Use external toggle function if provided
      toggleTheme();
    } else {
      // Internal theme management
      const newDarkMode = !isDarkMode;
      setIsDarkMode(newDarkMode);
      updateTheme(newDarkMode);
      localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    }
  };

  return (
    <button
      onClick={handleToggleTheme}
      className={`
        relative inline-flex items-center justify-center
        w-12 h-6 bg-gray-300 rounded-full
        transition-colors duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}
        ${className}
      `}
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