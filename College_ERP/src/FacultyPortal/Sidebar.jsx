import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Clock,
  CheckSquare,
  FileText,
  Clipboard,
  Wrench,
  Briefcase,
  User,
  Pin,
  PinOff,
} from "lucide-react";

const MENU = [
  { id: "Dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { id: "Students", label: "Students", icon: <Users size={18} /> },
  { id: "Courses", label: "Courses & Teaching", icon: <BookOpen size={18} /> },
  { id: "Timetable", label: "Time Table", icon: <Clock size={18} /> },
  { id: "Evaluation", label: "Evaluation & Result", icon: <CheckSquare size={18} /> },
  { id: "Approvals", label: "Student Documents", icon: <FileText size={18} /> },
  { id: "Assignments", label: "Assignments", icon: <Clipboard size={18} /> },
  { id: "Examination", label: "Examination", icon: <Wrench size={18} /> },
  { id: "Reports", label: "Reports & Analytics", icon: <Briefcase size={18} /> },
  { id: "Profile", label: "Profile", icon: <User size={18} /> },
];

export default function Sidebar({ activeSection, setActiveSection, pinned, setPinned, onExpandChange }) {
  const [hovered, setHovered] = useState(false);

  const expanded = pinned || hovered;

  useEffect(() => {
    onExpandChange?.(expanded);
  }, [expanded]);

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full z-40
        transition-all duration-300
        ${expanded ? "w-64" : "w-16"}
        border-r flex flex-col
      `}
      style={{ backgroundColor: 'var(--card)', color: 'var(--text)', borderColor: 'var(--border)' }}
      onMouseEnter={() => !pinned && setHovered(true)}
      onMouseLeave={() => !pinned && setHovered(false)}
    >
      {/* --- Header --- */}
      <div className="p-4 flex items-center gap-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <img
          src="/image.png" // 👈 Put JECRC logo in /public/image.png
          alt="JECRC University"
          className="w-20 h-8 object-contain"
        />
        {expanded && (
          <div className="flex-1">
            <div className="font-bold">Faculty Portal</div>
            {/* <div className="text-sm text-gray-500">JECRC University</div> */}
          </div>
        )}
        <button
          onClick={() => setPinned((p) => !p)}
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

      {/* --- Navigation --- */}
      <nav className="p-3 flex-1">
        {MENU.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveSection(m.id)}
            className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg mb-1 transition-all duration-200 ease-in-out font-medium hover:scale-[1.02] hover:shadow-sm"
            style={activeSection === m.id ? 
              { backgroundColor: 'var(--accent)', color: 'white', boxShadow: 'var(--shadow-md)' } :
              { backgroundColor: 'transparent', color: 'var(--muted)' }
            }
            onMouseEnter={(e) => {
              if (activeSection !== m.id) {
                e.target.style.backgroundColor = 'var(--hover)';
                e.target.style.color = 'var(--text)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeSection !== m.id) {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--muted)';
              }
            }}
          >
            {m.icon}
            {expanded && <span className="font-medium">{m.label}</span>}
          </button>
        ))}
      </nav>

      {/* --- Footer --- */}
      <div 
        className={`p-3 border-t text-center text-xs ${expanded ? "" : "hidden"}`}
        style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
      >
        v1.0
      </div>
    </aside>
  );
}
