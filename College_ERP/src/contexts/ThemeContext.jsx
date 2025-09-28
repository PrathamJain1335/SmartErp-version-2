import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check for saved theme preference, default to dark mode
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'light' ? false : true; // Default to dark mode
  });

  // Apply theme changes to document
  useEffect(() => {
    const applyTheme = (darkMode) => {
      const root = document.documentElement;
      
      // Remove any existing theme classes
      root.classList.remove('dark-root', 'light-root', 'dark', 'light');
      
      // Apply the unified theme class
      if (darkMode) {
        root.classList.add('dark-root');
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
      } else {
        root.classList.add('light-root');
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
      }
      
      // Save theme preference
      localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    };

    applyTheme(isDarkMode);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = isDarkMode ? 'dark' : 'light';

  const contextValue = {
    isDarkMode,
    theme,
    toggleTheme,
    setTheme: (newTheme) => {
      setIsDarkMode(newTheme === 'dark');
    }
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeContext;