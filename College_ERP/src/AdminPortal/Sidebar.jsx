import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Users, BookOpen, GraduationCap, FileText,
  ClipboardList, Library, Receipt, MessageSquare, Pin, PinOff
} from "lucide-react";

const UNIVERSITY_LOGO = "/image.png";

const MENU = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/admin/dashboard" },
  {id : "faculty", label: "Faculty", icon: <Users size={18} />, path: "/admin/faculty-list"},
  { id: "students", label: "Students", icon: <GraduationCap size={18} />, path: "/admin/student-details" },
  { id: "reports", label: "Reports", icon: <FileText size={18} />, path: "/admin/reports" },
  { id: "examination", label: "Examination", icon: <ClipboardList size={18} />, path: "/admin/examination" },
  { id: "library", label: "Library", icon: <Library size={18} />, path: "/admin/library" },
  { id: "fee", label: "Fee", icon: <Receipt size={18} />, path: "/admin/fee-management" },
  { id: "curriculum", label: "Curriculum", icon: <BookOpen size={18} />, path: "/admin/curriculum" },
  { id: "communication-hub", label: "Communication Hub", icon: <MessageSquare size={18} />, path: "/admin/communication-hub" },
];

export default function Sidebar({ pinned, setPinned, onExpandChange }) {
  const [hovered, setHovered] = useState(false);
  const expanded = pinned || hovered;

  useEffect(() => {
    onExpandChange?.(expanded);
  }, [expanded, onExpandChange]);

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full z-40
        transition-all duration-300
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
          alt="JECRC University"
          className="w-40 h-20 object-contain"
        />
        {/* {expanded && (
          <div>
            <div className="font-bold text-lg text-black dark:text-white">JECRC University</div>
          </div>
        )} */}
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
          {pinned ? <PinOff size={18} /> : <Pin size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {MENU.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg mb-1 transition-all duration-200 ease-in-out font-medium hover:scale-[1.02] hover:shadow-sm ${
                isActive
                  ? "shadow-md"
                  : ""
              }`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'var(--accent)' : 'transparent',
              color: isActive ? 'white' : 'var(--muted)'
            })}
            onMouseEnter={(e) => {
              if (!e.target.classList.contains('active')) {
                e.target.style.backgroundColor = 'var(--hover)';
                e.target.style.color = 'var(--text)';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.target.classList.contains('active')) {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--muted)';
              }
            }}
            tabIndex={0}
            aria-disabled={false}
          >
            {item.icon}
            {expanded && <span>{item.label}</span>}
          </NavLink>
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
