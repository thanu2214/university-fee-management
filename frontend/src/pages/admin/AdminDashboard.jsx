import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PrintableReceipt from '../../components/receipt/PrintableReceipt';
import { receiptService } from '../../services/receiptService';
import {
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  UserCheck,
  Receipt,
  GraduationCap,
  ArrowRight,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getAdminStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching admin dashboard stats:', err);
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
    return <LoadingSpinner message="Aggregating university financial analytics..." />;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">University Administration Financial Overview</h1>
          <p className="page-header-desc">
            Executive financial intelligence, fee collections, student enrollment, and audit logs.
          </p>
        </div>
        <div className="page-header-actions">
          <Link to="/admin/students" className="btn btn-primary">
            <Users size={18} /> Manage Students
          </Link>
          <Link to="/admin/fee-structures" className="btn btn-outline">
            Fee Structures
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <StatCard
          label="Total Students Enrolled"
          value={stats?.totalStudents || 0}
          subtext={`Finance Staff: ${stats?.totalStaff || 0}`}
          icon={GraduationCap}
          variant="primary"
        />
        <StatCard
          label="Total Institutional Fee Billed"
          value={formatCurrency(stats?.totalFeeBilled)}
          subtext="Allocated across all programs"
          icon={DollarSign}
          variant="accent"
        />
        <StatCard
          label="Total Revenue Collected"
          value={formatCurrency(stats?.totalFeeCollected)}
          subtext={`Collection Rate: ${stats?.collectionRatePercentage}%`}
          icon={TrendingUp}
          variant="success"
        />
        <StatCard
          label="Total Outstanding Receivables"
          value={formatCurrency(stats?.totalFeePending)}
          subtext={`Defaulter records: ${stats?.overdueCount || 0}`}
          icon={AlertTriangle}
          variant="danger"
        />
      </div>

      {/* Status Breakdown Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>University Fee Settlement Status Distribution</h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Overall Collection Efficiency: <strong>{stats?.collectionRatePercentage}%</strong>
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--success-bg)', border: '1px solid var(--success-border)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--success-text)', textTransform: 'uppercase', fontWeight: 700 }}>Fully Paid</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success-text)' }}>{stats?.fullyPaidCount || 0}</div>
          </div>
          <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--warning-bg)', border: '1px solid var(--warning-border)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--warning-text)', textTransform: 'uppercase', fontWeight: 700 }}>Partially Paid</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--warning-text)' }}>{stats?.partiallyPaidCount || 0}</div>
          </div>
          <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--info-bg)', border: '1px solid var(--info-border)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--info-text)', textTransform: 'uppercase', fontWeight: 700 }}>Pending Dues</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--info-text)' }}>{stats?.pendingCount || 0}</div>
          </div>
          <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--danger-bg)', border: '1px solid var(--danger-border)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--danger-text)', textTransform: 'uppercase', fontWeight: 700 }}>Overdue Defaulters</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--danger-text)' }}>{stats?.overdueCount || 0}</div>
          </div>
        </div>
      </div>

      {/* Program Revenue Breakdown & Recent Transactions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        
        {/* Department Revenue Progress */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Program Revenue & Collections</h3>
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
                        borderRadius: 'var(--radius-full)'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Payment Transactions</h3>
            <Link to="/admin/payments" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              Full Audit Log <ArrowRight size={14} style={{ verticalAlign: 'middle' }} />
            </Link>
          </div>

          {(!stats?.recentPayments || stats.recentPayments.length === 0) ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2.5rem 0' }}>
              No payments recorded yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stats.recentPayments.slice(0, 5).map((p) => (
                <div
                  key={p.id}
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
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.studentName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {p.rollNumber} • {p.program} (Sem {p.semester}) • via {p.paymentMethod}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <strong style={{ color: 'var(--success-text)', fontSize: '0.95rem' }}>
                      {formatCurrency(p.amount)}
                    </strong>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleOpenReceipt(p.id)}
                      title="View Official Receipt"
                    >
                      <Receipt size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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

export default AdminDashboard;
