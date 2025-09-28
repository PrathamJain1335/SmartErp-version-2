// Global theme setup and fixes
import { initializeTheme, fixHardcodedStyles, applyTheme } from './utils/themeUtils';

// Initialize theme on app load
export const setupGlobalTheme = () => {
  // Apply theme immediately
  const theme = initializeTheme();
  
  // Fix any hardcoded styles after DOM loads
  document.addEventListener('DOMContentLoaded', () => {
    fixHardcodedStyles();
  });
  
  // Set up observer to fix styles when new content is added
  const observer = new MutationObserver((mutations) => {
    let shouldFix = false;
    
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            shouldFix = true;
          }
        });
      }
    });
    
    if (shouldFix) {
      setTimeout(fixHardcodedStyles, 100);
    }
  });
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Handle theme changes from other tabs/windows
  window.addEventListener('storage', (e) => {
    if (e.key === 'theme') {
      applyTheme(e.newValue || 'light');
    }
  });
  
  return theme;
};

// Export for easy access
export default setupGlobalTheme;