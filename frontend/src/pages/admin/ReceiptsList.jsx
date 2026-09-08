import React, { useState, useEffect } from 'react';
import { receiptService } from '../../services/receiptService';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import DataTable from '../../components/common/DataTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PrintableReceipt from '../../components/receipt/PrintableReceipt';
import { Printer, Receipt } from 'lucide-react';

export const ReceiptsList = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const fetchReceipts = async (query) => {
    try {
      setLoading(true);
      const data = await receiptService.getAllReceipts(query);
      setReceipts(data || []);
    } catch (err) {
      console.error('Error fetching receipts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  const columns = [
    {
      header: 'Receipt No',
      accessor: 'receiptNumber',
      render: (row) => <strong style={{ color: 'var(--primary)' }}>{row.receiptNumber}</strong>,
    },
    {
      header: 'Student Particulars',
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
      header: 'Issue Date',
      accessor: 'issueDate',
      render: (row) => formatDateTime(row.issueDate),
    },
    {
      header: 'Amount Paid',
      accessor: 'amountPaid',
      align: 'right',
      render: (row) => (
        <strong style={{ color: 'var(--success-text)', fontSize: '0.95rem' }}>
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

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Institutional Official Receipts Master</h1>
          <p className="page-header-desc">
            Authorized registry of all digitally issued and stamped student fee payment receipts.
          </p>
        </div>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={receipts}
          searchPlaceholder="Search receipts by receipt number, student name, or roll no..."
          onSearch={(val) => fetchReceipts(val)}
          loading={loading}
          emptyMessage="No official receipts found in the archive."
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

export default ReceiptsList;
