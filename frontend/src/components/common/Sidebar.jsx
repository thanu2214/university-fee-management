import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  CreditCard,
  Receipt,
  FileText,
  UserCheck,
  AlertTriangle,
  History,
  User,
  LogOut,
  Shield,
  DollarSign
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderNavLinks = () => {
    if (role === 'ROLE_ADMIN') {
      return (
        <>
          <div className="nav-heading">Administration</div>
          <NavLink to="/admin/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/admin/students" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <Users size={18} />
            <span>Students Directory</span>
          </NavLink>
          <NavLink to="/admin/fee-structures" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <FileText size={18} />
            <span>Fee Structures</span>
          </NavLink>
          <NavLink to="/admin/fee-records" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <DollarSign size={18} />
            <span>Fee Records Ledger</span>
          </NavLink>
          <NavLink to="/admin/payments" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <CreditCard size={18} />
            <span>Payments Audit</span>
          </NavLink>
          <NavLink to="/admin/receipts" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <Receipt size={18} />
            <span>Official Receipts</span>
          </NavLink>

          <div className="nav-heading">Staff & Permissions</div>
          <NavLink to="/admin/staff" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <UserCheck size={18} />
            <span>Finance Staff</span>
          </NavLink>
        </>
      );
    }

    if (role === 'ROLE_FINANCE_STAFF') {
      return (
        <>
          <div className="nav-heading">Finance Portal</div>
          <NavLink to="/finance/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <LayoutDashboard size={18} />
            <span>Finance Dashboard</span>
          </NavLink>
          <NavLink to="/finance/students" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <Users size={18} />
            <span>Student Lookup</span>
          </NavLink>
          <NavLink to="/finance/fee-records" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <DollarSign size={18} />
            <span>Student Fee Records</span>
          </NavLink>
          <NavLink to="/finance/payments" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <CreditCard size={18} />
            <span>Record Offline Fee</span>
          </NavLink>
          <NavLink to="/finance/receipts" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <Receipt size={18} />
            <span>Receipt Repository</span>
          </NavLink>
          <NavLink to="/finance/defaulters" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <AlertTriangle size={18} />
            <span>Defaulters Report</span>
          </NavLink>
        </>
      );
    }

    if (role === 'ROLE_STUDENT') {
      return (
        <>
          <div className="nav-heading">Student Portal</div>
          <NavLink to="/student/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/student/my-fees" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <FileText size={18} />
            <span>My Fee Breakdown</span>
          </NavLink>
          <NavLink to="/student/pay-fee" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <CreditCard size={18} />
            <span>Pay Fee Online</span>
          </NavLink>
          <NavLink to="/student/payment-history" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <History size={18} />
            <span>Payment History</span>
          </NavLink>
          <NavLink to="/student/receipts" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <Receipt size={18} />
            <span>Fee Receipts</span>
          </NavLink>
          <NavLink to="/student/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <User size={18} />
            <span>Student Profile</span>
          </NavLink>
        </>
      );
    }

    return null;
  };

  const getRoleDisplayName = () => {
    if (role === 'ROLE_ADMIN') return 'Administrator';
    if (role === 'ROLE_FINANCE_STAFF') return 'Finance Officer';
    if (role === 'ROLE_STUDENT') return 'Enrolled Student';
    return 'User';
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo-icon">
          <GraduationCap size={22} />
        </div>
        <div>
          <div className="sidebar-brand-title">APEX UNIVERSITY</div>
          <div className="sidebar-brand-sub">Fee Management ERP</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {renderNavLinks()}
      </nav>

      <div className="sidebar-footer">
        <div className="user-snippet">
          <div className="user-avatar">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-details">
            <div className="user-name">{user?.fullName || user?.username}</div>
            <div className="user-role-text">{getRoleDisplayName()}</div>
          </div>
          <button 
            onClick={handleLogout} 
            title="Sign out of system"
            style={{ color: 'rgba(255,255,255,0.7)', padding: '0.4rem', borderRadius: '4px' }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
