import React, { useState, useEffect } from 'react';
import { paymentService } from '../../services/paymentService';
import { receiptService } from '../../services/receiptService';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PrintableReceipt from '../../components/receipt/PrintableReceipt';
import { CreditCard, Receipt, ShieldCheck } from 'lucide-react';

export const PaymentsAudit = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const fetchPayments = async (query) => {
    try {
      setLoading(true);
      const data = await paymentService.getAllPayments(query);
      setPayments(data || []);
    } catch (err) {
      console.error('Error fetching payment audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleOpenReceipt = async (paymentId) => {
    try {
      const receipt = await receiptService.getReceiptByPaymentId(paymentId);
      setSelectedReceipt(receipt);
    } catch (err) {
      console.error('Failed to load receipt:', err);
    }
  };

  const columns = [
    {
      header: 'Transaction Ref',
      accessor: 'transactionReference',
      render: (row) => (
        <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--primary)' }}>
          {row.transactionReference}
        </span>
      ),
    },
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
      header: 'Degree / Sem',
      accessor: 'program',
      render: (row) => `${row.program} (Sem ${row.semester})`,
    },
    {
      header: 'Payment Date',
      accessor: 'paymentDate',
      render: (row) => formatDateTime(row.paymentDate),
    },
    {
      header: 'Method',
      accessor: 'paymentMethod',
      render: (row) => <span className="badge badge-admin">{row.paymentMethod}</span>,
    },
    {
      header: 'Processed By',
      accessor: 'processedBy',
      render: (row) => (
        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          {row.processedBy || 'System Gateway'}
        </span>
      ),
    },
    {
      header: 'Amount Paid',
      accessor: 'amount',
      align: 'right',
      render: (row) => (
        <strong style={{ color: 'var(--success-text)', fontSize: '0.95rem' }}>
          {formatCurrency(row.amount)}
        </strong>
      ),
    },
    {
      header: 'Status',
      accessor: 'paymentStatus',
      render: (row) => <StatusBadge status={row.paymentStatus} />,
    },
    {
      header: 'Receipt',
      accessor: 'id',
      align: 'right',
      render: (row) => (
        <button
          className="btn btn-outline btn-sm"
          onClick={() => handleOpenReceipt(row.id)}
          title="View Official University Receipt"
        >
          <Receipt size={14} /> View
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">University Payment Audit Log</h1>
          <p className="page-header-desc">
            Immutable transaction record of all student fee payments, channel sources, and verification timestamps.
          </p>
        </div>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={payments}
          searchPlaceholder="Search audit log by transaction reference, student name, or roll no..."
          onSearch={(val) => fetchPayments(val)}
          loading={loading}
          emptyMessage="No payment records found in the audit log."
        />
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

export default PaymentsAudit;
