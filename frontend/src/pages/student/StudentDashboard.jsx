import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';
import { feeService } from '../../services/feeService';
import { paymentService } from '../../services/paymentService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PaymentGatewayModal from '../../components/payment/PaymentGatewayModal';
import PrintableReceipt from '../../components/receipt/PrintableReceipt';
import { receiptService } from '../../services/receiptService';
import {
  DollarSign,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Receipt,
  ArrowUpRight,
  Clock,
  BookOpen,
  Calendar
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [feeRecords, setFeeRecords] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activePaymentRecord, setActivePaymentRecord] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const profile = await studentService.getMyProfile();
      setStudent(profile);

      if (profile && profile.id) {
        const [records, payments] = await Promise.all([
          feeService.getRecordsByStudentId(profile.id),
          paymentService.getPaymentsByStudentId(profile.id),
        ]);
        setFeeRecords(records || []);
        setRecentPayments(payments || []);
      }
    } catch (err) {
      console.error('Error fetching student dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenReceipt = async (paymentId) => {
    try {
      const receipt = await receiptService.getReceiptByPaymentId(paymentId);
      setSelectedReceipt(receipt);
    } catch (err) {
      console.error('Failed to load receipt:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading student financial ledger..." />;
  }

  // Calculate totals
  const totalBilled = feeRecords.reduce((sum, r) => sum + (r.totalFeeAmount || 0), 0);
  const totalPaid = feeRecords.reduce((sum, r) => sum + (r.paidAmount || 0), 0);
  const totalDue = feeRecords.reduce((sum, r) => sum + (r.dueAmount || 0), 0);

  // Active or latest fee record
  const currentRecord = feeRecords.length > 0 ? feeRecords[feeRecords.length - 1] : null;

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        backgroundColor: 'var(--primary)',
        color: '#ffffff',
        padding: '1.75rem 2rem',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.75)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Student Academic & Financial Portal
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 700, color: '#ffffff', marginTop: '0.2rem' }}>
            Welcome back, {student?.fullName || user?.fullName}!
          </h1>
          <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.6rem', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)', flexWrap: 'wrap' }}>
            <span>Roll No: <strong>{student?.rollNumber}</strong></span>
            <span>Program: <strong>{student?.program}</strong></span>
            <span>Semester: <strong>Semester {student?.currentSemester}</strong></span>
          </div>
        </div>

        {currentRecord && currentRecord.dueAmount > 0 && (
          <button
            className="btn btn-success btn-lg"
            onClick={() => setActivePaymentRecord(currentRecord)}
            style={{ fontWeight: 700, boxShadow: '0 4px 14px rgba(5, 150, 105, 0.4)' }}
          >
            <CreditCard size={20} /> Pay Outstanding Fee ({formatCurrency(currentRecord.dueAmount)})
          </button>
        )}
      </div>

      {/* Due Alert Banner if there are overdue/pending fees */}
      {totalDue > 0 && (
        <div style={{
          backgroundColor: 'var(--warning-bg)',
          border: '1px solid var(--warning-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem 1.5rem',
          marginBottom: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle size={24} style={{ color: 'var(--warning)' }} />
            <div>
              <div style={{ fontWeight: 700, color: 'var(--warning-text)', fontSize: '0.95rem' }}>
                Fee Payment Due Alert — {formatCurrency(totalDue)} Outstanding
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Please clear your outstanding dues on or before the semester due date (<strong>{formatDate(currentRecord?.dueDate)}</strong>) to avoid late fee penalties.
              </div>
            </div>
          </div>
          {currentRecord && (
            <button className="btn btn-warning btn-sm" onClick={() => setActivePaymentRecord(currentRecord)} style={{ backgroundColor: 'var(--warning)', color: '#ffffff' }}>
              Clear Balance
            </button>
          )}
        </div>
      )}

      {/* Financial KPIs Grid */}
      <div className="stats-grid">
        <StatCard
          label="Total Fee Allocated"
          value={formatCurrency(totalBilled)}
          subtext="Total academic semester fees"
          icon={DollarSign}
          variant="primary"
        />
        <StatCard
          label="Total Amount Paid"
          value={formatCurrency(totalPaid)}
          subtext="Verified university receipts"
          icon={CheckCircle2}
          variant="success"
        />
        <StatCard
          label="Balance Outstanding"
          value={formatCurrency(totalDue)}
          subtext={totalDue === 0 ? 'All dues cleared!' : 'Pending payment'}
          icon={AlertCircle}
          variant={totalDue === 0 ? 'success' : 'danger'}
        />
        <StatCard
          label="Academic Session"
          value={student?.academicYear || '2025-2026'}
          subtext={`Current: Sem ${student?.currentSemester}`}
          icon={Calendar}
          variant="accent"
        />
      </div>

      {/* Main Content Grid: Fee Ledger & Recent Payments */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem', marginTop: '0.5rem' }}>
        
        {/* Active Fee Ledger Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Current Semester Fee Breakdown</h3>
            {currentRecord && <StatusBadge status={currentRecord.feeStatus} />}
          </div>

          {currentRecord ? (
            <div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.65rem 0', color: 'var(--text-secondary)' }}>Tuition Fee</td>
                    <td style={{ padding: '0.65rem 0', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(currentRecord.tuitionFee)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.65rem 0', color: 'var(--text-secondary)' }}>Laboratory & Practical Fee</td>
                    <td style={{ padding: '0.65rem 0', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(currentRecord.labFee)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.65rem 0', color: 'var(--text-secondary)' }}>Examination Fee</td>
                    <td style={{ padding: '0.65rem 0', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(currentRecord.examFee)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.65rem 0', color: 'var(--text-secondary)' }}>Library & Digital Resources</td>
                    <td style={{ padding: '0.65rem 0', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(currentRecord.libraryFee)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.65rem 0', color: 'var(--text-secondary)' }}>Hostel & Amenities</td>
                    <td style={{ padding: '0.65rem 0', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(currentRecord.hostelFee)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.65rem 0', color: 'var(--text-secondary)' }}>Sports & Student Welfare</td>
                    <td style={{ padding: '0.65rem 0', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(currentRecord.sportsFee)}</td>
                  </tr>
                  <tr style={{ backgroundColor: 'var(--surface-alt)', fontWeight: 700 }}>
                    <td style={{ padding: '0.75rem 0.5rem', color: 'var(--primary)' }}>Net Semester Fee</td>
                    <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', color: 'var(--primary)', fontSize: '1.05rem' }}>
                      {formatCurrency(currentRecord.totalFeeAmount)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: 'var(--surface-hover)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Due Date: </span>
                  <strong>{formatDate(currentRecord.dueDate)}</strong>
                </div>
                {currentRecord.dueAmount > 0 && (
                  <button className="btn btn-accent btn-sm" onClick={() => setActivePaymentRecord(currentRecord)}>
                    Pay Balance Now <ArrowUpRight size={14} />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
              No active fee record found for this semester.
            </p>
          )}
        </div>

        {/* Recent Payment Receipts */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Payment Transactions</h3>
          </div>

          {recentPayments.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem 0' }}>
              No payments recorded yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {recentPayments.map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--surface)',
                    transition: 'border-color var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--success-bg)',
                      color: 'var(--success)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <CheckCircle2 size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{formatCurrency(p.amount)}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {formatDate(p.paymentDate)} • via {p.paymentMethod}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleOpenReceipt(p.id)}
                      title="View Official University Receipt"
                    >
                      <Receipt size={14} /> View Receipt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Payment Gateway Modal */}
      {activePaymentRecord && (
        <PaymentGatewayModal
          isOpen={!!activePaymentRecord}
          onClose={() => setActivePaymentRecord(null)}
          feeRecord={activePaymentRecord}
          onSuccess={() => {
            fetchData();
          }}
        />
      )}

      {/* Official Printable Receipt Modal */}
      {selectedReceipt && (
        <PrintableReceipt
          receipt={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
};

export default StudentDashboard;
