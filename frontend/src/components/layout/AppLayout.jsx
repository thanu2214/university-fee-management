import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../common/Sidebar';
import Navbar from '../common/Navbar';
import LoadingSpinner from '../common/LoadingSpinner';

export const AppLayout = ({ allowedRoles }) => {
  const { isAuthenticated, role, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return <LoadingSpinner message="Verifying security credentials..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to proper role dashboard
    if (role === 'ROLE_ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (role === 'ROLE_FINANCE_STAFF') return <Navigate to="/finance/dashboard" replace />;
    if (role === 'ROLE_STUDENT') return <Navigate to="/student/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="page-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
