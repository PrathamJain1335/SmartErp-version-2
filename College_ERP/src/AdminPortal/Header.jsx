// src/AdminPortal/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { Bell, MessageSquare, User, Moon, Sun } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle/ThemeToggle";

export default function Header({ notifications = [], user = {}, onLogout, onProfile }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const headerRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setNotificationOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="p-4 flex justify-between items-center shadow-md sticky top-0 z-50" style={{ backgroundColor: 'var(--card)', color: 'var(--text)' }}>
      {/* Title */}
      <h1 className="text-xl font-semibold">Admin</h1>

      {/* Right-side action buttons */}
      <div className="flex items-center space-x-6 relative" ref={headerRef}>
        {/* Dark/Light Mode Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <div className="relative">
          <button
            className="relative p-2 rounded-full transition-all duration-200 ease-in-out hover:scale-110"
            style={{ backgroundColor: 'transparent' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--hover)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            aria-label="Notifications"
            onClick={() => setNotificationOpen((v) => !v)}
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 text-white text-xs px-1.5 py-0.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)' }}>
                {notifications.length}
              </span>
            )}
          </button>
          
          {notificationOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-lg shadow-lg z-50 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
                <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Notifications</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm" style={{ color: 'var(--muted)' }}>
                    No new notifications
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notif) => (
                    <div 
                      key={notif.id} 
                      className="p-3 border-b cursor-pointer transition-colors hover:scale-[1.01]"
                      style={{ borderColor: 'var(--border)', backgroundColor: 'transparent' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--hover)'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{notif.title}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{notif.message}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{notif.timestamp}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        <button 
          className="p-2 rounded-full transition-all duration-200 ease-in-out hover:scale-110" 
          style={{ backgroundColor: 'transparent' }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--hover)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          aria-label="Messages"
        >
          <MessageSquare size={20} />
        </button>

        {/* User/Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 p-2 rounded-full transition-all duration-200 ease-in-out hover:scale-110"
            style={{ backgroundColor: 'transparent' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--hover)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            aria-label="User menu"
          >
            <User size={20} />
            {user.name && <span className="text-sm font-medium">{user.name}</span>}
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-50 border overflow-hidden" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="py-1">
                <button
                  className="flex items-center w-full px-4 py-2 text-sm transition-colors hover:scale-[1.02]"
                  style={{ backgroundColor: 'transparent', color: 'var(--text)' }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--hover)';
                    e.target.style.color = 'var(--text)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = 'var(--text)';
                  }}
                  onClick={() => {
                    setDropdownOpen(false);
                    onProfile?.();
                  }}
                >
                  <User size={16} className="mr-2" />
                  View Profile
                </button>
                <div className="border-t" style={{ borderColor: 'var(--border)' }}></div>
                <button
                  className="flex items-center w-full px-4 py-2 text-sm transition-colors hover:scale-[1.02]"
                  style={{ backgroundColor: 'transparent', color: 'var(--error)' }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--hover)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                  onClick={() => {
                    setDropdownOpen(false);
                    onLogout?.();
                  }}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
