import React, { useState, useEffect } from "react";
import {
  Dashboard as DashboardIcon,
  PersonOutline as PersonOutlineIcon,
  MenuBook as MenuBookIcon,
  Article as ArticleIcon,
  AttachMoney as AttachMoneyIcon,
  LocalLibrary as LocalLibraryIcon,
  WorkOutline as WorkOutlineIcon,
  FolderOpen as FolderOpenIcon,
  SupportAgent as SupportAgentIcon,
  Logout as LogoutIcon,
  Pin as PinIcon,
  PushPin as PinOffIcon,
  Assessment as AssessmentIcon,
  School as SchoolIcon,
  EventNote as EventNoteIcon,
  Notifications as NotificationsIcon,
  Assignment as AssignmentIcon,
  AccountBox as PortfolioIcon,
} from "@mui/icons-material";

const UNIVERSITY_LOGO = "/image.png";

const MENU = [
  { id: "Dashboard", label: "Dashboard", icon: <DashboardIcon /> },
  { id: "Profile", label: "Student Details", icon: <PersonOutlineIcon /> },
  { id: "Academics", label: "Academics", icon: <MenuBookIcon /> },
  { id: "Examination", label: "Examination", icon: <ArticleIcon /> },
  { id: "Assignments", label: "Assignments", icon: <AssignmentIcon /> },
  { id: "Result", label: "Result", icon: <AssessmentIcon /> },
  { id: "Fees", label: "Fees", icon: <AttachMoneyIcon /> },
  { id: "Library", label: "Library", icon: <LocalLibraryIcon /> },
  { id: "Career", label: "Career", icon: <WorkOutlineIcon /> },
  { id: "Portfolio", label: "Digital Portfolio", icon: <PortfolioIcon /> },
  { id: "Documents", label: "Documents", icon: <FolderOpenIcon /> },
  // { id: "Records", label: "Records", icon: <FolderOpenIcon /> },
  { id: "NotificationPanel", label: "Notification", icon: <NotificationsIcon /> },
  { id: "Support", label: "Support", icon: <SupportAgentIcon /> },
  { id: "Logout", label: "Logout", icon: <LogoutIcon /> },
];

export default function Sidebar({ pinned, setPinned, onExpandChange, activePage, setActivePage }) {
  const [hovered, setHovered] = useState(false);
  const expanded = pinned || hovered;

  useEffect(() => {
    onExpandChange?.(expanded);
  }, [expanded, onExpandChange]);

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full z-40
        transition-all duration-300 ease-in-out
        border-r flex flex-col
        ${expanded ? "w-64" : "w-16"}
      `}
      style={{ backgroundColor: 'var(--card)', color: 'var(--text)', borderColor: 'var(--border)' }}
      onMouseEnter={() => !pinned && setHovered(true)}
      onMouseLeave={() => !pinned && setHovered(false)}
    >
      {/* Header */}
      <div className="p-4 flex items-center gap-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <img
          src={UNIVERSITY_LOGO}
          alt="JECRC University Logo"
          className="w-40 h-20 object-contain"
        />
        <button
          onClick={() => setPinned((prev) => !prev)}
          className="ml-auto p-2 rounded transition-all duration-200 ease-in-out hover:scale-110"
          style={{ 
            backgroundColor: pinned ? 'var(--accent)' : 'transparent',
            color: pinned ? 'white' : 'var(--icon)'
          }}
          onMouseEnter={(e) => {
            if (!pinned) e.target.style.backgroundColor = 'var(--hover)';
          }}
          onMouseLeave={(e) => {
            if (!pinned) e.target.style.backgroundColor = 'transparent';
          }}
          aria-label={pinned ? "Unpin sidebar" : "Pin sidebar"}
        >
          {pinned ? <PinOffIcon fontSize="small" /> : <PinIcon fontSize="small" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {MENU.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.id === "Logout") {
                window.location.href = "/";
              } else {
                setActivePage(item.id);
              }
            }}
            className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg mb-1 transition-all duration-200 ease-in-out font-medium hover:scale-[1.02] hover:shadow-sm"
            style={activePage === item.id ? 
              { backgroundColor: 'var(--accent)', color: 'white', boxShadow: 'var(--shadow-md)' } :
              { color: 'var(--muted)', backgroundColor: 'transparent' }
            }
            onMouseEnter={(e) => {
              if (activePage !== item.id) {
                e.target.style.backgroundColor = 'var(--hover)';
                e.target.style.color = 'var(--text)';
              }
            }}
            onMouseLeave={(e) => {
              if (activePage !== item.id) {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--muted)';
              }
            }}
            tabIndex={0}
            aria-disabled={false}
          >
            {item.icon}
            {expanded && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div 
        className={`p-3 border-t text-center text-xs ${expanded ? "" : "hidden"}`}
        style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
      >
        v1.0
      </div>
    </aside>
  );
}