// Enhanced Theme Utility Functions for Dark Mode Support

/**
 * Apply theme classes to document root
 * @param {string} theme - 'light' or 'dark'
 */
export const applyTheme = (theme) => {
  const root = document.documentElement;
  const body = document.body;
  
  // Remove existing theme classes
  root.classList.remove('dark', 'light', 'dark-root', 'light-root');
  body.classList.remove('dark', 'light', 'dark-mode', 'light-mode');
  
  // Apply new theme classes
  if (theme === 'dark') {
    root.classList.add('dark', 'dark-root');
    body.classList.add('dark', 'dark-mode');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.add('light', 'light-root');
    body.classList.add('light', 'light-mode');
    root.style.colorScheme = 'light';
  }
  
  // Force repaint to ensure changes are applied
  setTimeout(() => {
    fixHardcodedStyles();
  }, 10);
};

/**
 * Legacy function for backward compatibility
 */
export const applyThemeToElement = (element, isDark = false) => {
  applyTheme(isDark ? 'dark' : 'light');
};

/**
 * Get current theme from localStorage or default to light
 * @returns {string} 'light' or 'dark'
 */
export const getCurrentTheme = () => {
  return localStorage.getItem('theme') || 'light';
};

/**
 * Save theme to localStorage and apply it
 * @param {string} theme - 'light' or 'dark'
 */
export const setTheme = (theme) => {
  localStorage.setItem('theme', theme);
  applyTheme(theme);
};

/**
 * Toggle between light and dark theme
 * @returns {string} The new theme
 */
export const toggleTheme = () => {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  return newTheme;
};

/**
 * Fix any remaining hardcoded styles that might not be properly themed
 */
export const fixHardcodedStyles = () => {
  // Fix any elements with hardcoded white backgrounds
  const whiteElements = document.querySelectorAll('[style*="background: white"], [style*="background-color: white"]');
  whiteElements.forEach(el => {
    el.style.backgroundColor = 'var(--card)';
  });
  
  // Fix any elements with hardcoded black text
  const blackTextElements = document.querySelectorAll('[style*="color: black"]');
  blackTextElements.forEach(el => {
    el.style.color = 'var(--text-primary)';
  });
  
  // Fix any elements with hardcoded gray backgrounds
  const grayElements = document.querySelectorAll('[style*="background: gray"], [style*="background-color: gray"]');
  grayElements.forEach(el => {
    el.style.backgroundColor = 'var(--hover)';
  });
};

export const getThemeColors = () => {
  const isDark = document.documentElement.classList.contains('dark-root');
  
  return {
    isDark,
    bg: getComputedStyle(document.documentElement).getPropertyValue('--bg'),
    card: getComputedStyle(document.documentElement).getPropertyValue('--card'),
    border: getComputedStyle(document.documentElement).getPropertyValue('--border'),
    text: getComputedStyle(document.documentElement).getPropertyValue('--text'),
    muted: getComputedStyle(document.documentElement).getPropertyValue('--muted'),
    accent: getComputedStyle(document.documentElement).getPropertyValue('--accent'),
    soft: getComputedStyle(document.documentElement).getPropertyValue('--soft'),
    brand: getComputedStyle(document.documentElement).getPropertyValue('--brand'),
    hover: getComputedStyle(document.documentElement).getPropertyValue('--hover'),
    active: getComputedStyle(document.documentElement).getPropertyValue('--active'),
  };
};

export const createThemeAwareStyle = (lightStyles, darkStyles) => {
  const isDark = document.documentElement.classList.contains('dark-root');
  return isDark ? darkStyles : lightStyles;
};

// Helper function to create CSS variables style objects
export const createVarStyle = (varName, fallback = '') => ({
  [varName.replace('--', '')]: `var(${varName}${fallback ? `, ${fallback}` : ''})`
});

export const themeVarStyles = {
  background: { backgroundColor: 'var(--bg)' },
  cardBackground: { backgroundColor: 'var(--card)' },
  border: { borderColor: 'var(--border)' },
  text: { color: 'var(--text)' },
  textPrimary: { color: 'var(--text-primary)' },
  textSecondary: { color: 'var(--text-secondary)' },
  mutedText: { color: 'var(--muted)' },
  accent: { backgroundColor: 'var(--accent)', color: 'white' },
  hover: { backgroundColor: 'var(--hover)' },
  
  // Compound styles
  card: {
    backgroundColor: 'var(--card)',
    borderColor: 'var(--border)',
    color: 'var(--text)',
    boxShadow: 'var(--shadow-lg)'
  },
  
  input: {
    backgroundColor: 'var(--input)',
    borderColor: 'var(--border)',
    color: 'var(--text)'
  },
  
  button: {
    backgroundColor: 'var(--card)',
    borderColor: 'var(--border)',
    color: 'var(--text)'
  },
  
  primaryButton: {
    backgroundColor: 'var(--accent)',
    color: 'white',
    borderColor: 'var(--accent)'
  }
};

// Initialize theme on page load
export const initializeTheme = () => {
  const savedTheme = getCurrentTheme();
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const shouldUseDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDark);
  
  const finalTheme = shouldUseDarkMode ? 'dark' : 'light';
  applyTheme(finalTheme);
  
  // Set up media query listener for system preference changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleChange = (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  };
  
  mediaQuery.addEventListener('change', handleChange);
  
  return finalTheme;
};
