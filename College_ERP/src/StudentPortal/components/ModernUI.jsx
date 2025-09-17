import React from 'react';

// Modern Header Component
export const ModernHeader = ({ icon, title, subtitle }) => (
  <div className="flex items-center mb-6">
    <img src="/image.png" alt="JECRC University Logo" className="w-20 h-8 mr-4" />
    <div>
      <h2 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>{title}</h2>
      {subtitle && <p className="text-sm" style={{ color: 'var(--muted)' }}>{subtitle}</p>}
    </div>
  </div>
);

// Modern Stat Card Component
export const StatCard = ({ icon, label, value, subText, color = 'var(--accent)' }) => (
  <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--card)' }}>
    <div className="flex items-center gap-2 mb-2">
      {React.cloneElement(icon, { className: "h-5 w-5", style: { color } })}
      <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{label}</span>
    </div>
    <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{value}</p>
    {subText && <p className="text-xs" style={{ color: 'var(--muted)' }}>{subText}</p>}
  </div>
);

// Modern Card Component
export const ModernCard = ({ 
  icon, 
  title, 
  children, 
  onClick, 
  className = "", 
  hoverable = true,
  collapsible = false,
  defaultExpanded = false 
}) => {
  const [expanded, setExpanded] = React.useState(defaultExpanded);
  
  const handleClick = () => {
    if (collapsible) {
      setExpanded(!expanded);
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`p-6 rounded-lg cursor-pointer transition-colors ${className}`}
      style={{ backgroundColor: 'var(--card)' }}
      onMouseEnter={hoverable ? (e) => e.target.style.backgroundColor = 'var(--soft)' : undefined}
      onMouseLeave={hoverable ? (e) => e.target.style.backgroundColor = 'var(--card)' : undefined}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon && React.cloneElement(icon, { className: "h-6 w-6", style: { color: 'var(--accent)' } })}
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>{title}</h3>
        </div>
        {collapsible && (
          <span style={{ color: 'var(--muted)' }}>
            {expanded ? '▼' : '▶'}
          </span>
        )}
      </div>
      {(!collapsible || expanded) && (
        <div>{children}</div>
      )}
    </div>
  );
};

// Modern Info Grid Component
export const InfoGrid = ({ data, columns = 2 }) => (
  <div className={`grid grid-cols-1 ${columns === 2 ? 'md:grid-cols-2' : `md:grid-cols-${columns}`} gap-4 text-sm`}>
    {data.map((item, index) => (
      <div key={index}>
        <span className="font-medium" style={{ color: 'var(--text)' }}>{item.label}:</span>{' '}
        <span style={{ color: 'var(--muted)' }}>{item.value}</span>
      </div>
    ))}
  </div>
);

// Modern Button Component
export const ModernButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  icon,
  className = ""
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: 'var(--accent)', color: 'white' };
      case 'secondary':
        return { backgroundColor: 'var(--soft)', color: 'var(--text)' };
      case 'danger':
        return { backgroundColor: 'var(--danger)', color: 'white' };
      case 'success':
        return { backgroundColor: 'var(--success)', color: 'white' };
      default:
        return { backgroundColor: 'var(--accent)', color: 'white' };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-3 py-1 text-sm';
      case 'large':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${getSizeClasses()} rounded-lg font-medium transition-colors flex items-center gap-2 ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={getVariantStyles()}
      onMouseEnter={!disabled ? (e) => {
        const styles = getVariantStyles();
        if (variant === 'primary') {
          e.target.style.backgroundColor = 'var(--secondary)';
        } else if (variant === 'secondary') {
          e.target.style.backgroundColor = 'var(--hover)';
        }
      } : undefined}
      onMouseLeave={!disabled ? (e) => {
        e.target.style = Object.assign(e.target.style, getVariantStyles());
      } : undefined}
    >
      {icon && React.cloneElement(icon, { size: 16 })}
      {children}
    </button>
  );
};

// Modern Status Badge Component
export const StatusBadge = ({ status, variant }) => {
  const getStatusColor = () => {
    if (variant) {
      switch (variant) {
        case 'success': return 'var(--success)';
        case 'warning': return 'var(--warning)';
        case 'danger': return 'var(--danger)';
        case 'info': return 'var(--info)';
        default: return 'var(--muted)';
      }
    }

    // Auto-detect based on status text
    const statusLower = status.toLowerCase();
    if (statusLower.includes('completed') || statusLower.includes('resolved') || statusLower.includes('active')) {
      return 'var(--success)';
    } else if (statusLower.includes('pending') || statusLower.includes('progress')) {
      return 'var(--warning)';
    } else if (statusLower.includes('failed') || statusLower.includes('cancelled') || statusLower.includes('overdue')) {
      return 'var(--danger)';
    } else {
      return 'var(--info)';
    }
  };

  return (
    <span 
      className="px-2 py-1 rounded-full text-xs font-medium text-white"
      style={{ backgroundColor: getStatusColor() }}
    >
      {status}
    </span>
  );
};

// Modern List Item Component
export const ModernListItem = ({ 
  title, 
  subtitle, 
  icon, 
  status, 
  onClick, 
  actions,
  hoverable = true 
}) => (
  <div
    className="p-4 rounded-lg cursor-pointer transition-colors flex items-center justify-between"
    style={{ backgroundColor: 'var(--soft)' }}
    onMouseEnter={hoverable ? (e) => e.target.style.backgroundColor = 'var(--hover)' : undefined}
    onMouseLeave={hoverable ? (e) => e.target.style.backgroundColor = 'var(--soft)' : undefined}
    onClick={onClick}
  >
    <div className="flex items-center gap-3 flex-1">
      {icon && React.cloneElement(icon, { className: "h-5 w-5", style: { color: 'var(--accent)' } })}
      <div className="flex-1">
        <p className="font-medium" style={{ color: 'var(--text)' }}>{title}</p>
        {subtitle && <p className="text-sm" style={{ color: 'var(--muted)' }}>{subtitle}</p>}
      </div>
    </div>
    <div className="flex items-center gap-2">
      {status && <StatusBadge status={status} />}
      {actions}
    </div>
  </div>
);

// Modern Form Components
export const FormField = ({ label, type = 'text', value, onChange, placeholder, required = false, options = [] }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium" style={{ color: 'var(--text)' }}>
      {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
    </label>
    {type === 'select' ? (
      <select
        value={value}
        onChange={onChange}
        required={required}
        className="w-full p-3 border rounded-lg"
        style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
      >
        <option value="">{placeholder || `Select ${label}`}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
    ) : type === 'textarea' ? (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={4}
        className="w-full p-3 border rounded-lg"
        style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full p-3 border rounded-lg"
        style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
      />
    )}
  </div>
);

// Modern Search Bar Component
export const SearchBar = ({ value, onChange, placeholder = "Search...", icon }) => (
  <div className="relative">
    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
      {icon ? React.cloneElement(icon, { className: "h-4 w-4", style: { color: 'var(--muted)' } }) : (
        <svg className="h-4 w-4" style={{ color: 'var(--muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )}
    </div>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="pl-10 pr-4 py-2 w-full border rounded-lg"
      style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
    />
  </div>
);

// Modern Tab Navigation Component
export const TabNavigation = ({ tabs, activeTab, onChange }) => (
  <div className="flex gap-2 mb-6 border-b" style={{ borderColor: 'var(--border)' }}>
    {tabs.map(tab => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors ${
          activeTab === tab.id ? 'border-b-2' : ''
        }`}
        style={{
          backgroundColor: activeTab === tab.id ? 'var(--soft)' : 'transparent',
          color: activeTab === tab.id ? 'var(--accent)' : 'var(--muted)',
          borderColor: activeTab === tab.id ? 'var(--accent)' : 'transparent'
        }}
      >
        {tab.icon}
        {tab.label}
      </button>
    ))}
  </div>
);

// Modern Modal Component
export const ModernModal = ({ isOpen, onClose, title, children, size = 'medium' }) => {
  if (!isOpen) return null;

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-full max-w-md';
      case 'large':
        return 'w-full max-w-4xl';
      case 'full':
        return 'w-full h-full max-w-none';
      default:
        return 'w-full max-w-lg';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className={`${getSizeClasses()} rounded-lg shadow-xl`} style={{ backgroundColor: 'var(--card)' }}>
        <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--border)' }}>
          <h4 className="font-medium" style={{ color: 'var(--text)' }}>{title}</h4>
          <button
            onClick={onClose}
            className="p-1 rounded transition-colors"
            style={{ backgroundColor: 'var(--hover)', color: 'var(--text)' }}
          >
            ✕
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Loading Spinner Component
export const LoadingSpinner = ({ size = 'medium' }) => {
  const sizeClass = size === 'small' ? 'w-4 h-4' : size === 'large' ? 'w-12 h-12' : 'w-8 h-8';
  
  return (
    <div className={`${sizeClass} animate-spin rounded-full border-2 border-t-transparent`} 
         style={{ borderColor: 'var(--accent)' }}>
    </div>
  );
};

export default {
  ModernHeader,
  StatCard,
  ModernCard,
  InfoGrid,
  ModernButton,
  StatusBadge,
  ModernListItem,
  FormField,
  SearchBar,
  TabNavigation,
  ModernModal,
  LoadingSpinner
};