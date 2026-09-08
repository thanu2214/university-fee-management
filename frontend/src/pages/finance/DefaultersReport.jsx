import React, { useState, useEffect } from 'react';
import { feeService } from '../../services/feeService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { AlertTriangle, Download, Mail, Phone, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DefaultersReport = () => {
  const [defaulters, setDefaulters] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDefaulters = async () => {
    try {
      setLoading(true);
      const data = await feeService.getDefaulters();
      setDefaulters(data || []);
    } catch (err) {
      console.error('Error fetching defaulters:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDefaulters();
  }, []);

  const totalOutstanding = defaulters.reduce((sum, r) => sum + (r.dueAmount || 0), 0);

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
      header: 'Degree Program',
      accessor: 'program',
      render: (row) => `${row.program} (Sem ${row.semester})`,
    },
    {
      header: 'Academic Session',
      accessor: 'academicYear',
    },
    {
      header: 'Total Fee',
      accessor: 'totalFeeAmount',
      align: 'right',
      render: (row) => formatCurrency(row.totalFeeAmount),
    },
    {
      header: 'Paid Amount',
      accessor: 'paidAmount',
      align: 'right',
      render: (row) => (
        <span style={{ color: 'var(--success)', fontWeight: 600 }}>
          {formatCurrency(row.paidAmount)}
        </span>
      ),
    },
    {
      header: 'Outstanding Due',
      accessor: 'dueAmount',
      align: 'right',
      render: (row) => (
        <strong style={{ color: 'var(--danger)', fontSize: '0.95rem' }}>
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
      header: 'Action',
      accessor: 'id',
      align: 'right',
      render: (row) => (
        <Link
          to={`/finance/payments?recordId=${row.id}`}
          className="btn btn-primary btn-sm"
        >
          <CreditCard size={14} /> Record Payment
        </Link>
      ),
    },
  ];

  if (loading) {
    return <LoadingSpinner message="Generating defaulters financial report..." />;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Fee Defaulters & Outstanding Dues Report</h1>
          <p className="page-header-desc">
            Comprehensive audit of all active student accounts with pending or overdue fee obligations.
          </p>
        </div>
      </div>

      {/* Summary Alert */}
      <div style={{
        backgroundColor: 'var(--danger-bg)',
        border: '1px solid var(--danger-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#fee2e2',
            color: 'var(--danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <AlertTriangle size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--danger-text)' }}>
              Total Outstanding Receivables: {formatCurrency(totalOutstanding)}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              <strong>{defaulters.length} students</strong> currently have unsettled fee balances across departments.
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={defaulters}
          searchPlaceholder="Search defaulters by student name, roll number, or program..."
          emptyMessage="No fee defaulters found! All student accounts are clear."
        />
      </div>
    </div>
  );
};

export default DefaultersReport;
