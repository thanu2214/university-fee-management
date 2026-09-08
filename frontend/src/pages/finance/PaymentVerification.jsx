import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { feeService } from '../../services/feeService';
import { paymentService } from '../../services/paymentService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PrintableReceipt from '../../components/receipt/PrintableReceipt';
import { CreditCard, CheckCircle2, ShieldAlert, ArrowRight, Loader2 } from 'lucide-react';

export const PaymentVerification = () => {
  const [searchParams] = useSearchParams();
  const preselectedRecordId = searchParams.get('recordId');

  const [feeRecords, setFeeRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedRecordId, setSelectedRecordId] = useState(preselectedRecordId || '');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('BANK_CHALLAN');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [bankRefNo, setBankRefNo] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successReceipt, setSuccessReceipt] = useState(null);

  const fetchDueRecords = async () => {
    try {
      setLoading(true);
      const data = await feeService.getAllRecords();
      const dues = data ? data.filter((r) => r.dueAmount > 0) : [];
      setFeeRecords(dues);

      if (preselectedRecordId && dues.some((r) => String(r.id) === String(preselectedRecordId))) {
        const found = dues.find((r) => String(r.id) === String(preselectedRecordId));
        setSelectedRecordId(found.id);
        setAmount(found.dueAmount);
      } else if (dues.length > 0 && !selectedRecordId) {
        setSelectedRecordId(dues[0].id);
        setAmount(dues[0].dueAmount);
      }
    } catch (err) {
      console.error('Error fetching due records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDueRecords();
  }, []);

  const handleRecordSelect = (recId) => {
    setSelectedRecordId(recId);
    const found = feeRecords.find((r) => String(r.id) === String(recId));
    if (found) {
      setAmount(found.dueAmount);
    }
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const numericAmount = parseFloat(amount);
    const foundRecord = feeRecords.find((r) => String(r.id) === String(selectedRecordId));

    if (!foundRecord) {
      setErrorMessage('Please select an active student fee record.');
      return;
    }

    if (isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMessage('Payment amount must be greater than zero.');
      return;
    }

    if (numericAmount > foundRecord.dueAmount) {
      setErrorMessage(`Payment amount cannot exceed remaining due (${formatCurrency(foundRecord.dueAmount)}).`);
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        studentFeeRecordId: foundRecord.id,
        amount: numericAmount,
        paymentMethod,
        paymentNotes: paymentNotes || `Offline counter payment - Ref: ${bankRefNo || 'Counter Cash'}`,
        bankName: bankRefNo ? `Challan / DD Ref: ${bankRefNo}` : undefined,
      };

      const response = await paymentService.recordOfflinePayment(payload);
      setSuccessReceipt(response);
      fetchDueRecords();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to record offline payment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading pending fee records..." />;
  }

  const selectedRecord = feeRecords.find((r) => String(r.id) === String(selectedRecordId));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Record Offline Fee Payment</h1>
          <p className="page-header-desc">
            Authorized counter for recording Bank Challans, Demand Drafts, and Cash deposits.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '1.5rem' }}>
        
        {/* Payment Entry Form */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Payment Entry Particulars</h3>
          </div>

          <form onSubmit={handleSubmitPayment}>
            <div className="form-group">
              <label className="form-label">Select Student Account with Due Balance</label>
              <select
                className="form-select"
                value={selectedRecordId}
                onChange={(e) => handleRecordSelect(e.target.value)}
                required
              >
                {feeRecords.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.studentName} ({r.rollNumber}) — {r.program} Sem {r.semester} [Due: {formatCurrency(r.dueAmount)}]
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Payment Amount (₹)</label>
                <input
                  type="number"
                  step="100"
                  min="1"
                  max={selectedRecord?.dueAmount || 999999}
                  className="form-input"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Payment Mode</label>
                <select
                  className="form-select"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="BANK_CHALLAN">Bank Challan</option>
                  <option value="CASH">Cash Counter</option>
                  <option value="NET_BANKING">Direct Bank Wire / NEFT</option>
                  <option value="DEBIT_CARD">POS Debit Card</option>
                  <option value="CREDIT_CARD">POS Credit Card</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Challan / DD / Transaction Reference Number</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. SBI-CHL-998124 or DD-004512"
                value={bankRefNo}
                onChange={(e) => setBankRefNo(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Administrative Notes / Comments</label>
              <textarea
                className="form-textarea"
                rows="2"
                placeholder="e.g. Verified at Finance counter 2 by authorized cashier"
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
              />
            </div>

            {errorMessage && (
              <div style={{
                backgroundColor: 'var(--danger-bg)',
                color: 'var(--danger-text)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem'
              }}>
                <ShieldAlert size={18} />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-success btn-lg"
              style={{ width: '100%', marginTop: '0.5rem' }}
              disabled={submitting || !selectedRecord}
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                  Verifying & Issuing Receipt...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} /> Record & Generate Official Receipt
                </>
              )}
            </button>
          </form>
        </div>

        {/* Selected Record Summary */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Student Fee Account Summary</h3>
          </div>

          {selectedRecord ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
              <div style={{ backgroundColor: 'var(--surface-alt)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.2rem' }}>
                  {selectedRecord.studentName}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Roll Number: <strong>{selectedRecord.rollNumber}</strong> • Reg: {selectedRecord.registrationNo}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                  {selectedRecord.program} — Semester {selectedRecord.semester} ({selectedRecord.academicYear})
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ border: '1px solid var(--border)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Semester Fee</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>{formatCurrency(selectedRecord.totalFeeAmount)}</div>
                </div>
                <div style={{ border: '1px solid var(--border)', padding: '0.85rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Already Paid</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--success)' }}>{formatCurrency(selectedRecord.paidAmount)}</div>
                </div>
              </div>

              <div style={{ border: '2px solid var(--danger-border)', backgroundColor: 'var(--danger-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--danger-text)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Outstanding Amount Due
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--danger)', marginTop: '0.2rem' }}>
                  {formatCurrency(selectedRecord.dueAmount)}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--danger-text)', marginTop: '0.25rem' }}>
                  Official Due Date: {formatDate(selectedRecord.dueDate)}
                </div>
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem 0' }}>
              Select a student fee record to preview details.
            </p>
          )}
        </div>

      </div>

      {/* Success Printable Receipt Modal */}
      {successReceipt && (
        <PrintableReceipt
          receipt={{
            receiptNumber: successReceipt.receiptNumber,
            issueDate: successReceipt.paymentDate,
            studentName: successReceipt.studentName,
            rollNumber: successReceipt.rollNumber,
            registrationNo: selectedRecord?.registrationNo,
            program: successReceipt.program,
            semester: successReceipt.semester,
            academicYear: selectedRecord?.academicYear,
            amountPaid: successReceipt.amount,
            paymentMethod: successReceipt.paymentMethod,
            transactionReference: successReceipt.transactionReference,
            balanceRemaining: successReceipt.remainingDueAmount,
            authorizedSignatory: 'Finance Comptroller, Apex University'
          }}
          onClose={() => setSuccessReceipt(null)}
        />
      )}
    </div>
  );
};

export default PaymentVerification;
