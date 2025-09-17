// Theme utility functions to ensure consistent theme application
export const applyThemeToElement = (element, isDark = false) => {
  if (!element) return;
  
  const theme = isDark ? 'dark-root' : '';
  if (isDark) {
    document.documentElement.classList.add('dark-root');
  } else {
    document.documentElement.classList.remove('dark-root');
  }
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
  mutedText: { color: 'var(--muted)' },
  accent: { backgroundColor: 'var(--accent)', color: 'white' },
  hover: { backgroundColor: 'var(--hover)' },
  
  // Compound styles
  card: {
    backgroundColor: 'var(--card)',
    borderColor: 'var(--border)',
    color: 'var(--text)'
  },
  
  input: {
    backgroundColor: 'var(--card)',
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
    color: 'white'
  }
};

// Initialize theme on page load
export const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const shouldUseDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDark);
  
  applyThemeToElement(document.documentElement, shouldUseDarkMode);
  
  return shouldUseDarkMode;
};