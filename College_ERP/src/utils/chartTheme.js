// Utility for getting theme-aware colors for charts
export const getChartThemeColors = () => {
  const isDark = document.documentElement.classList.contains('dark-root');
  
  const colors = {
    // Primary theme colors
    primary: '#1E3A8A',
    secondary: '#10B981', 
    accent: '#dc2626',
    danger: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
    success: '#10B981',
    
    // Chart-specific colors that work well in both themes
    chartColors: isDark ? [
      '#60A5FA', // Light blue
      '#34D399', // Light green
      '#F87171', // Light red
      '#FBBF24', // Light yellow
      '#A78BFA', // Light purple
      '#FB7185', // Light pink
      '#4ADE80', // Bright green
      '#38BDF8', // Sky blue
    ] : [
      '#1E40AF', // Dark blue
      '#047857', // Dark green
      '#DC2626', // Dark red
      '#D97706', // Dark orange
      '#7C3AED', // Dark purple
      '#BE185D', // Dark pink
      '#059669', // Dark emerald
      '#0284C7', // Dark sky
    ],
    
    // Background colors
    background: isDark ? '#0b1120' : '#f6f7fb',
    cardBackground: isDark ? '#1e293b' : '#ffffff',
    
    // Text colors
    textPrimary: isDark ? '#e2e8f0' : '#1e293b',
    textSecondary: isDark ? '#94a3b8' : '#64748b',
    
    // Grid and border colors
    gridColor: isDark ? '#334155' : '#e5e7eb',
    borderColor: isDark ? '#475569' : '#d1d5db',
  };
  
  return colors;
};

// Default chart options that work well with both themes
export const getDefaultChartOptions = (options = {}) => {
  const colors = getChartThemeColors();
  
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: colors.textPrimary,
          font: {
            family: 'Inter, system-ui, sans-serif',
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: colors.cardBackground,
        titleColor: colors.textPrimary,
        bodyColor: colors.textSecondary,
        borderColor: colors.borderColor,
        borderWidth: 1,
      },
    },
    scales: options.scales !== false ? {
      x: {
        grid: {
          color: colors.gridColor,
        },
        ticks: {
          color: colors.textSecondary,
        },
      },
      y: {
        grid: {
          color: colors.gridColor,
        },
        ticks: {
          color: colors.textSecondary,
        },
      },
    } : undefined,
    ...options,
  };
};

// Specific configurations for different chart types
export const getPieChartOptions = (options = {}) => {
  const colors = getChartThemeColors();
  
  return getDefaultChartOptions({
    scales: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: colors.textPrimary,
          padding: 20,
          usePointStyle: true,
        },
      },
    },
    ...options,
  });
};

export const getLineChartOptions = (options = {}) => {
  const colors = getChartThemeColors();
  
  return getDefaultChartOptions({
    elements: {
      line: {
        tension: 0.4,
        borderWidth: 3,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
      },
    },
    ...options,
  });
};

export const getBarChartOptions = (options = {}) => {
  return getDefaultChartOptions({
    elements: {
      bar: {
        borderRadius: 4,
        borderSkipped: false,
      },
    },
    ...options,
  });
};