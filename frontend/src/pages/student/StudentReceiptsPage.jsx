import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { receiptService } from '../../services/receiptService';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import DataTable from '../../components/common/DataTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PrintableReceipt from '../../components/receipt/PrintableReceipt';
import { Receipt, Printer, FileCheck } from 'lucide-react';

export const StudentReceiptsPage = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        setLoading(true);
        const profile = await studentService.getMyProfile();
        if (profile?.rollNumber) {
          const data = await receiptService.getReceiptsByRollNumber(profile.rollNumber);
          setReceipts(data || []);
        }
      } catch (err) {
        console.error('Error fetching receipts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReceipts();
  }, []);

  const columns = [
    {
      header: 'Receipt Number',
      accessor: 'receiptNumber',
      render: (row) => (
        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
          {row.receiptNumber}
        </span>
      ),
    },
    {
      header: 'Issue Date',
      accessor: 'issueDate',
      render: (row) => formatDateTime(row.issueDate),
    },
    {
      header: 'Program / Semester',
      accessor: 'program',
      render: (row) => `${row.program} (Sem ${row.semester})`,
    },
    {
      header: 'Amount Paid',
      accessor: 'amountPaid',
      align: 'right',
      render: (row) => (
        <strong style={{ color: 'var(--success)', fontSize: '0.95rem' }}>
          {formatCurrency(row.amountPaid)}
        </strong>
      ),
    },
    {
      header: 'Payment Mode',
      accessor: 'paymentMethod',
      render: (row) => <span className="badge badge-admin">{row.paymentMethod}</span>,
    },
    {
      header: 'Balance Left',
      accessor: 'balanceRemaining',
      align: 'right',
      render: (row) => formatCurrency(row.balanceRemaining),
    },
    {
      header: 'Action',
      accessor: 'id',
      align: 'right',
      render: (row) => (
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setSelectedReceipt(row)}
        >
          <Printer size={14} /> Print / View
        </button>
      ),
    },
  ];

  if (loading) {
    return <LoadingSpinner message="Loading your official university receipts..." />;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Official E-Fee Receipts</h1>
          <p className="page-header-desc">
            Download and print official, digitally verified university fee receipts for all completed payments.
          </p>
        </div>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={receipts}
          searchPlaceholder="Search receipts by number or semester..."
          emptyMessage="No official receipts generated yet."
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

export default StudentReceiptsPage;
