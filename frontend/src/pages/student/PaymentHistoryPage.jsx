import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { paymentService } from '../../services/paymentService';
import { receiptService } from '../../services/receiptService';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PrintableReceipt from '../../components/receipt/PrintableReceipt';
import { Receipt, History } from 'lucide-react';

export const PaymentHistoryPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const profile = await studentService.getMyProfile();
        if (profile?.id) {
          const data = await paymentService.getPaymentsByStudentId(profile.id);
          setPayments(data || []);
        }
      } catch (err) {
        console.error('Error fetching payments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
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
      header: 'Payment Date',
      accessor: 'paymentDate',
      render: (row) => formatDateTime(row.paymentDate),
    },
    {
      header: 'Semester',
      accessor: 'semester',
      render: (row) => `Sem ${row.semester}`,
    },
    {
      header: 'Payment Mode',
      accessor: 'paymentMethod',
      render: (row) => <span className="badge badge-admin">{row.paymentMethod}</span>,
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
      header: 'Action',
      accessor: 'id',
      align: 'right',
      render: (row) => (
        <button
          className="btn btn-outline btn-sm"
          onClick={() => handleOpenReceipt(row.id)}
        >
          <Receipt size={14} /> View Receipt
        </button>
      ),
    },
  ];

  if (loading) {
    return <LoadingSpinner message="Loading payment transactions..." />;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Payment Transaction History</h1>
          <p className="page-header-desc">
            Chronological audit log of all online and offline university fee payments.
          </p>
        </div>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={payments}
          searchPlaceholder="Search by transaction reference or method..."
          emptyMessage="No payment transactions found on your account."
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

export default PaymentHistoryPage;
