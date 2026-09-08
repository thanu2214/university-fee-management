import React from 'react';
import { Menu, Calendar, ShieldCheck, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, role } = useAuth();

  const getRoleBadge = () => {
    if (role === 'ROLE_ADMIN') {
      return <span className="badge badge-admin">Administrator</span>;
    }
    if (role === 'ROLE_FINANCE_STAFF') {
      return <span className="badge badge-finance">Finance Staff</span>;
    }
    if (role === 'ROLE_STUDENT') {
      return <span className="badge badge-student">Student</span>;
    }
    return null;
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button 
          className="menu-toggle-btn" 
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h2 className="page-title" style={{ fontSize: '1.15rem' }}>
            University Financial Portal
          </h2>
          {getRoleBadge()}
        </div>
      </div>

      <div className="navbar-right">
        <div className="academic-session-tag">
          <Calendar size={14} />
          <span>Academic Session: <strong>2025-2026</strong></span>
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ShieldCheck size={16} style={{ color: 'var(--success)' }} />
          <span>Verified Session</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
