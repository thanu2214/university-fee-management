import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './components/layout/AppLayout';

// Pages
import LoginPage from './pages/LoginPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentManagement from './pages/admin/StudentManagement';
import FeeStructureManagement from './pages/admin/FeeStructureManagement';
import FeeRecordsLedger from './pages/admin/FeeRecordsLedger';
import StaffManagement from './pages/admin/StaffManagement';
import PaymentsAudit from './pages/admin/PaymentsAudit';
import ReceiptsList from './pages/admin/ReceiptsList';

// Finance Staff Pages
import FinanceDashboard from './pages/finance/FinanceDashboard';
import FinanceStudentsList from './pages/finance/FinanceStudentsList';
import FinanceFeeRecords from './pages/finance/FinanceFeeRecords';
import PaymentVerification from './pages/finance/PaymentVerification';
import FinanceReceipts from './pages/finance/FinanceReceipts';
import DefaultersReport from './pages/finance/DefaultersReport';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import MyFeeDetails from './pages/student/MyFeeDetails';
import PayFeePage from './pages/student/PayFeePage';
import PaymentHistoryPage from './pages/student/PaymentHistoryPage';
import StudentReceiptsPage from './pages/student/StudentReceiptsPage';
import StudentProfilePage from './pages/student/StudentProfilePage';

const RootRedirect = () => {
  const { isAuthenticated, role, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (role === 'ROLE_ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (role === 'ROLE_FINANCE_STAFF') return <Navigate to="/finance/dashboard" replace />;
  if (role === 'ROLE_STUDENT') return <Navigate to="/student/dashboard" replace />;

  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Root Redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Admin Protected Routes */}
          <Route element={<AppLayout allowedRoles={['ROLE_ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/students" element={<StudentManagement />} />
            <Route path="/admin/fee-structures" element={<FeeStructureManagement />} />
            <Route path="/admin/fee-records" element={<FeeRecordsLedger />} />
            <Route path="/admin/payments" element={<PaymentsAudit />} />
            <Route path="/admin/receipts" element={<ReceiptsList />} />
            <Route path="/admin/staff" element={<StaffManagement />} />
          </Route>

          {/* Finance Staff Protected Routes */}
          <Route element={<AppLayout allowedRoles={['ROLE_ADMIN', 'ROLE_FINANCE_STAFF']} />}>
            <Route path="/finance/dashboard" element={<FinanceDashboard />} />
            <Route path="/finance/students" element={<FinanceStudentsList />} />
            <Route path="/finance/fee-records" element={<FinanceFeeRecords />} />
            <Route path="/finance/payments" element={<PaymentVerification />} />
            <Route path="/finance/receipts" element={<FinanceReceipts />} />
            <Route path="/finance/defaulters" element={<DefaultersReport />} />
          </Route>

          {/* Student Protected Routes */}
          <Route element={<AppLayout allowedRoles={['ROLE_STUDENT']} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/my-fees" element={<MyFeeDetails />} />
            <Route path="/student/pay-fee" element={<PayFeePage />} />
            <Route path="/student/payment-history" element={<PaymentHistoryPage />} />
            <Route path="/student/receipts" element={<StudentReceiptsPage />} />
            <Route path="/student/profile" element={<StudentProfilePage />} />
          </Route>

          {/* Fallback Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
