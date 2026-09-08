import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PrintableReceipt from '../../components/receipt/PrintableReceipt';
import { receiptService } from '../../services/receiptService';
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CreditCard,
  Receipt,
  Users,
  Calendar,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const FinanceDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getFinanceStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching finance dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
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
    return <LoadingSpinner message="Loading finance accounts data..." />;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Finance Accounts & Collections Dashboard</h1>
          <p className="page-header-desc">
            University revenue tracking, offline fee entries, defaulter monitoring, and receipt archives.
          </p>
        </div>
        <div className="page-header-actions">
          <Link to="/finance/payments" className="btn btn-primary">
            <CreditCard size={18} /> Record Offline Payment
          </Link>
          <Link to="/finance/defaulters" className="btn btn-outline">
            <AlertTriangle size={18} /> View Defaulters ({stats?.overdueCount || 0})
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <StatCard
          label="Total Fee Billed"
          value={formatCurrency(stats?.totalFeeBilled)}
          subtext={`Enrolled Students: ${stats?.totalStudents}`}
          icon={DollarSign}
          variant="primary"
        />
        <StatCard
          label="Total Fee Collected"
          value={formatCurrency(stats?.totalFeeCollected)}
          subtext={`Collection Rate: ${stats?.collectionRatePercentage}%`}
          icon={TrendingUp}
          variant="success"
        />
        <StatCard
          label="Outstanding Dues"
          value={formatCurrency(stats?.totalFeePending)}
          subtext={`Overdue accounts: ${stats?.overdueCount}`}
          icon={AlertTriangle}
          variant="danger"
        />
        <StatCard
          label="Today's Collections"
          value={formatCurrency(stats?.todayCollections)}
          subtext="Verified receipts generated today"
          icon={CheckCircle2}
          variant="accent"
        />
      </div>

      {/* Program-Wise Collection Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        
        {/* Program Collections Breakdown */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Department & Program Revenue Collection</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {stats?.programWiseStats?.map((prog, idx) => {
              const billed = prog.totalBilled || 1;
              const collected = prog.totalCollected || 0;
              const pct = Math.min(100, Math.round((collected / billed) * 100));

              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                    <strong>{prog.program}</strong>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {formatCurrency(prog.totalCollected)} / {formatCurrency(prog.totalBilled)} (<strong>{pct}%</strong>)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        backgroundColor: pct >= 80 ? 'var(--success)' : pct >= 40 ? 'var(--accent)' : 'var(--warning)',
                        borderRadius: 'var(--radius-full)',
                        transition: 'width 0.5s ease'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* High-Priority Defaulters Preview */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Outstanding Fee Dues (Action Required)</h3>
            <Link to="/finance/defaulters" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              View All <ArrowRight size={14} style={{ verticalAlign: 'middle' }} />
            </Link>
          </div>

          {(!stats?.overdueRecords || stats.overdueRecords.length === 0) ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2.5rem 0' }}>
              No overdue student records at present.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stats.overdueRecords.map((rec) => (
                <div
                  key={rec.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--surface)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{rec.studentName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Roll: {rec.rollNumber} • {rec.program} (Sem {rec.semester})
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: 'var(--danger)', fontSize: '0.95rem' }}>
                      {formatCurrency(rec.dueAmount)}
                    </div>
                    <StatusBadge status={rec.feeStatus} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Recent Global Transactions Ledger */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Fee Collections & Verified Receipts</h3>
        </div>

        {(!stats?.recentPayments || stats.recentPayments.length === 0) ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2.5rem 0' }}>
            No recent payments recorded.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tx Reference</th>
                  <th>Student Name</th>
                  <th>Roll Number</th>
                  <th>Program</th>
                  <th>Payment Date</th>
                  <th>Method</th>
                  <th style={{ textAlign: 'right' }}>Amount Paid</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentPayments.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{p.transactionReference}</td>
                    <td><strong>{p.studentName}</strong></td>
                    <td>{p.rollNumber}</td>
                    <td>{p.program} (Sem {p.semester})</td>
                    <td>{formatDateTime(p.paymentDate)}</td>
                    <td><span className="badge badge-admin">{p.paymentMethod}</span></td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--success-text)' }}>
                      {formatCurrency(p.amount)}
                    </td>
                    <td><StatusBadge status={p.paymentStatus} /></td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => handleOpenReceipt(p.id)}
                      >
                        <Receipt size={14} /> Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedReceipt && (
        <PrintableReceipt
          receipt={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
};

export default FinanceDashboard;
