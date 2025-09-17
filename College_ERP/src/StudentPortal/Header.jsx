import React, { useState } from "react";
import { Notifications as NotificationsIcon, Settings as SettingsIcon, Brightness4 as Brightness4Icon, Brightness7 as Brightness7Icon, Logout as LogoutIcon } from "@mui/icons-material";
import ThemeToggle from "../components/ThemeToggle/ThemeToggle";

export default function Header({ activePage, theme, toggleTheme, notifications, user, onLogout, onProfile }) {
  const [notificationOpen, setNotificationOpen] = useState(false);

  return (
    <header className="p-4 flex justify-between items-center border-b" style={{ backgroundColor: 'var(--card)', color: 'var(--text)', borderColor: 'var(--border)' }}>
      {/* Left: Page Title */}
      <h1 className="text-xl font-bold">{activePage || "Dashboard"}</h1>

      {/* Right: User Info and Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <NotificationsIcon
            className="cursor-pointer"
            onClick={() => setNotificationOpen(!notificationOpen)}
          />
          {notifications.length > 0 && (
            <span className="absolute -top-2 -right-2 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs" style={{ backgroundColor: 'var(--accent)' }}>
              {notifications.length}
            </span>
          )}
          {notificationOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded shadow-lg p-2 z-50 border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
              {notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className="p-2 rounded cursor-pointer transition-colors"
                  style={{ backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--hover)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <p className="text-sm" style={{ color: 'var(--text)' }}>{notif.title}</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>{notif.timestamp}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2">
          <div>
            <p className="font-medium" style={{ color: 'var(--text)' }}>{user.name}</p>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>Student ID: {user.id || "12345"}</p>
          </div>
          <SettingsIcon
            className="cursor-pointer"
            onClick={onProfile}
          />
        </div>

        {/* Theme Toggle */}
        <ThemeToggle 
          className="ml-2" 
          theme={theme}
          toggleTheme={toggleTheme}
        />

        {/* Logout */}
        <LogoutIcon
          className="cursor-pointer"
          onClick={onLogout}
        />
      </div>
    </header>
  );
}