import React, { useState, useEffect } from 'react';
import { feeService } from '../../services/feeService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import { DollarSign, Tag, CreditCard, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FinanceFeeRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  // Concession Modal
  const [concessionRecord, setConcessionRecord] = useState(null);
  const [concessionAmount, setConcessionAmount] = useState('');
  const [concessionReason, setConcessionReason] = useState('Merit-based Academic Scholarship');
  const [submittingConcession, setSubmittingConcession] = useState(false);
  const [concessionError, setConcessionError] = useState('');

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await feeService.getAllRecords(null, filterStatus || null);
      setRecords(data || []);
    } catch (err) {
      console.error('Error fetching fee records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [filterStatus]);

  const handleApplyConcession = async (e) => {
    e.preventDefault();
    setConcessionError('');
    const amt = parseFloat(concessionAmount);
    if (isNaN(amt) || amt <= 0) {
      setConcessionError('Please enter a valid concession amount.');
      return;
    }

    try {
      setSubmittingConcession(true);
      await feeService.applyConcession(concessionRecord.id, amt, concessionReason);
      setConcessionRecord(null);
      setConcessionAmount('');
      fetchRecords();
    } catch (err) {
      setConcessionError(err.message || 'Failed to apply concession');
    } finally {
      setSubmittingConcession(false);
    }
  };

  const columns = [
    {
      header: 'Student Name',
      accessor: 'studentName',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.studentName}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Roll: {row.rollNumber}</div>
        </div>
      ),
    },
    {
      header: 'Program / Semester',
      accessor: 'program',
      render: (row) => `${row.program} (Sem ${row.semester})`,
    },
    {
      header: 'Total Fee',
      accessor: 'totalFeeAmount',
      align: 'right',
      render: (row) => formatCurrency(row.totalFeeAmount),
    },
    {
      header: 'Concession',
      accessor: 'concessionAmount',
      align: 'right',
      render: (row) => row.concessionAmount > 0 ? (
        <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
          -{formatCurrency(row.concessionAmount)}
        </span>
      ) : '—',
    },
    {
      header: 'Paid Amount',
      accessor: 'paidAmount',
      align: 'right',
      render: (row) => (
        <strong style={{ color: 'var(--success)' }}>
          {formatCurrency(row.paidAmount)}
        </strong>
      ),
    },
    {
      header: 'Remaining Due',
      accessor: 'dueAmount',
      align: 'right',
      render: (row) => (
        <strong style={{ color: row.dueAmount > 0 ? 'var(--danger)' : 'var(--success)' }}>
          {formatCurrency(row.dueAmount)}
        </strong>
      ),
    },
    {
      header: 'Due Date',
      accessor: 'dueDate',
      render: (row) => formatDate(row.dueDate),
    },
    {
      header: 'Status',
      accessor: 'feeStatus',
      render: (row) => <StatusBadge status={row.feeStatus} />,
    },
    {
      header: 'Actions',
      accessor: 'id',
      align: 'right',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => {
              setConcessionRecord(row);
              setConcessionAmount(row.concessionAmount || '');
            }}
            title="Apply Fee Concession or Scholarship"
          >
            <Tag size={13} /> Concession
          </button>
          {row.dueAmount > 0 && (
            <Link
              to={`/finance/payments?recordId=${row.id}`}
              className="btn btn-primary btn-sm"
              title="Record Offline Payment"
            >
              <CreditCard size={13} /> Pay
            </Link>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">University Fee Records & Ledger</h1>
          <p className="page-header-desc">
            Monitor institutional fee allocations, adjust fee concessions, and verify account balances.
          </p>
        </div>

        <div className="page-header-actions">
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ minWidth: '180px' }}
          >
            <option value="">All Statuses</option>
            <option value="PAID">Paid in Full</option>
            <option value="PARTIALLY_PAID">Partially Paid</option>
            <option value="PENDING">Pending</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={records}
          searchPlaceholder="Search records by student name, roll number, or program..."
          loading={loading}
          emptyMessage="No fee records matching the criteria."
        />
      </div>

      {/* Concession Modal */}
      {concessionRecord && (
        <Modal
          isOpen={!!concessionRecord}
          onClose={() => setConcessionRecord(null)}
          title={`Adjust Fee Concession — ${concessionRecord.studentName}`}
          maxWidth="500px"
        >
          <form onSubmit={handleApplyConcession}>
            <div style={{
              backgroundColor: 'var(--surface-alt)',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem',
              fontSize: '0.875rem'
            }}>
              <div>Total Semester Fee: <strong>{formatCurrency(concessionRecord.totalFeeAmount)}</strong></div>
              <div>Already Paid: <strong style={{ color: 'var(--success)' }}>{formatCurrency(concessionRecord.paidAmount)}</strong></div>
            </div>

            <div className="form-group">
              <label className="form-label">Concession / Scholarship Amount (₹)</label>
              <input
                type="number"
                min="0"
                max={concessionRecord.totalFeeAmount}
                className="form-input"
                placeholder="e.g. 10000"
                value={concessionAmount}
                onChange={(e) => setConcessionAmount(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Reason / Category for Concession</label>
              <select
                className="form-select"
                value={concessionReason}
                onChange={(e) => setConcessionReason(e.target.value)}
              >
                <option value="Merit-based Academic Scholarship">Merit-based Academic Scholarship</option>
                <option value="Sports Excellence Quota">Sports Excellence Quota</option>
                <option value="Financial Hardship Aid">Financial Hardship Aid</option>
                <option value="Staff Ward Concession">Staff Ward Concession</option>
                <option value="Other Authorized Waiver">Other Authorized Waiver</option>
              </select>
            </div>

            {concessionError && (
              <div style={{
                backgroundColor: 'var(--danger-bg)',
                color: 'var(--danger-text)',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <ShieldAlert size={16} />
                <span>{concessionError}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setConcessionRecord(null)}
                disabled={submittingConcession}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submittingConcession}
              >
                {submittingConcession ? 'Saving Concession...' : 'Save Concession'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default FinanceFeeRecords;
