import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { feeService } from '../../services/feeService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PaymentGatewayModal from '../../components/payment/PaymentGatewayModal';
import { CreditCard, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

export const PayFeePage = () => {
  const [feeRecords, setFeeRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePaymentRecord, setActivePaymentRecord] = useState(null);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const profile = await studentService.getMyProfile();
      if (profile?.id) {
        const records = await feeService.getRecordsByStudentId(profile.id);
        setFeeRecords(records || []);
      }
    } catch (err) {
      console.error('Error loading fee records for payment:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Checking fee dues..." />;
  }

  const unpaidRecords = feeRecords.filter((r) => r.dueAmount > 0);
  const paidRecords = feeRecords.filter((r) => r.dueAmount === 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Online Fee Payment Portal</h1>
          <p className="page-header-desc">
            Secure, encrypted instant fee settlement with automatic university receipt generation.
          </p>
        </div>
      </div>

      {unpaidRecords.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--success-bg)',
            color: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem'
          }}>
            <CheckCircle2 size={36} />
          </div>
          <h3 style={{ fontSize: '1.35rem', color: 'var(--success-text)', marginBottom: '0.4rem' }}>
            No Pending Fee Obligations!
          </h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', margin: '0 auto 1.5rem' }}>
            All your semester fees are fully settled. You can review your transaction history and download official university receipts at any time.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {unpaidRecords.map((record) => (
            <div
              key={record.id}
              className="card"
              style={{
                borderLeft: '4px solid var(--warning)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1.5rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>
                    {record.program} — Semester {record.semester}
                  </h3>
                  <StatusBadge status={record.feeStatus} />
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  <span>Academic Year: <strong>{record.academicYear}</strong></span>
                  <span>Due Date: <strong>{formatDate(record.dueDate)}</strong></span>
                  <span>Total Fee: <strong>{formatCurrency(record.totalFeeAmount)}</strong></span>
                  <span>Already Paid: <strong style={{ color: 'var(--success)' }}>{formatCurrency(record.paidAmount)}</strong></span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Amount Due</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--danger)' }}>
                    {formatCurrency(record.dueAmount)}
                  </div>
                </div>

                <button
                  className="btn btn-success btn-lg"
                  onClick={() => setActivePaymentRecord(record)}
                  style={{ fontWeight: 700 }}
                >
                  <CreditCard size={20} /> Proceed to Pay
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activePaymentRecord && (
        <PaymentGatewayModal
          isOpen={!!activePaymentRecord}
          onClose={() => setActivePaymentRecord(null)}
          feeRecord={activePaymentRecord}
          onSuccess={() => loadRecords()}
        />
      )}
    </div>
  );
};

export default PayFeePage;
