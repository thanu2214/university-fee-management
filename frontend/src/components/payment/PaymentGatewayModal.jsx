import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CreditCard, QrCode, Building2, CheckCircle2, ShieldAlert, Lock, ArrowRight, Loader2 } from 'lucide-react';
import Modal from '../common/Modal';
import { formatCurrency } from '../../utils/formatters';
import { paymentService } from '../../services/paymentService';

export const PaymentGatewayModal = ({ isOpen, onClose, feeRecord, onSuccess }) => {
  if (!feeRecord) return null;

  const [paymentMode, setPaymentMode] = useState('CARD'); // 'CARD', 'UPI', 'NET_BANKING'
  const [payAmount, setPayAmount] = useState(feeRecord.dueAmount || 0);
  const [isFullPayment, setIsFullPayment] = useState(true);

  // Card details
  const [cardNumber, setCardNumber] = useState('4532 8901 2345 6789');
  const [cardHolder, setCardHolder] = useState(feeRecord.studentName || 'Student Name');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('892');

  // UPI details
  const [upiId, setUpiId] = useState('student@oksbi');
  const [upiMethod, setUpiMethod] = useState('QR'); // 'QR' or 'VPA'

  // Net Banking details
  const [selectedBank, setSelectedBank] = useState('State Bank of India');

  // Processing state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentSuccessData, setPaymentSuccessData] = useState(null);

  const handleAmountToggle = (full) => {
    setIsFullPayment(full);
    if (full) {
      setPayAmount(feeRecord.dueAmount);
    } else {
      setPayAmount(Math.min(10000, feeRecord.dueAmount));
    }
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const numericAmount = parseFloat(payAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMessage('Please enter a valid payment amount greater than zero.');
      return;
    }

    if (numericAmount > feeRecord.dueAmount) {
      setErrorMessage(`Payment amount cannot exceed outstanding balance (${formatCurrency(feeRecord.dueAmount)}).`);
      return;
    }

    setIsSubmitting(true);

    try {
      // Realistic simulation delay for payment processing
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const payload = {
        studentFeeRecordId: feeRecord.id,
        amount: numericAmount,
        paymentMethod: paymentMode === 'CARD' ? 'CREDIT_CARD' : (paymentMode === 'UPI' ? 'UPI' : 'NET_BANKING'),
        paymentNotes: `Online payment of ${formatCurrency(numericAmount)} for Sem ${feeRecord.semester}`,
        cardNumber: paymentMode === 'CARD' ? cardNumber : undefined,
        cardHolderName: paymentMode === 'CARD' ? cardHolder : undefined,
        cardExpiry: paymentMode === 'CARD' ? cardExpiry : undefined,
        cardCvv: paymentMode === 'CARD' ? cardCvv : undefined,
        upiId: paymentMode === 'UPI' ? upiId : undefined,
        bankName: paymentMode === 'NET_BANKING' ? selectedBank : undefined,
      };

      const response = await paymentService.processDemoPayment(payload);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      setPaymentSuccessData(response);
      if (onSuccess) {
        onSuccess(response);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setPaymentSuccessData(null);
    setErrorMessage('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={paymentSuccessData ? 'Payment Confirmation' : 'University Payment Gateway (Demo)'}
      maxWidth="620px"
    >
      {paymentSuccessData ? (
        <div style={{ textAlign: 'center', padding: '1rem 0.5rem' }}>
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
            <CheckCircle2 size={38} />
          </div>

          <h3 style={{ fontSize: '1.4rem', color: 'var(--success-text)', marginBottom: '0.4rem' }}>
            Payment Successful!
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Your fee payment has been confirmed and recorded in the university ledger.
          </p>

          <div style={{
            background: 'var(--surface-alt)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            textAlign: 'left',
            marginBottom: '1.75rem',
            fontSize: '0.9rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Transaction Reference:</span>
              <strong style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }}>{paymentSuccessData.transactionReference}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Amount Paid:</span>
              <strong style={{ color: 'var(--success)', fontSize: '1.05rem' }}>{formatCurrency(paymentSuccessData.amount)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Receipt Number:</span>
              <strong>{paymentSuccessData.receiptNumber || 'Generated'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Remaining Balance Due:</span>
              <strong style={{ color: paymentSuccessData.remainingDueAmount > 0 ? 'var(--warning-text)' : 'var(--success-text)' }}>
                {formatCurrency(paymentSuccessData.remainingDueAmount)}
              </strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={handleClose}>
              Done / Return to Dashboard
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleProcessPayment}>
          {/* Fee Record Summary Banner */}
          <div style={{
            backgroundColor: 'var(--primary-subtle)',
            border: '1px solid var(--accent-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            marginBottom: '1.25rem',
            fontSize: '0.875rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <div>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{feeRecord.studentName}</span>
                <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>({feeRecord.rollNumber})</span>
              </div>
              <span className="badge badge-primary">{feeRecord.program} — Sem {feeRecord.semester}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-dark)' }}>
              <span>Total Fee: <strong>{formatCurrency(feeRecord.totalFeeAmount)}</strong></span>
              <span>Paid So Far: <strong style={{ color: 'var(--success)' }}>{formatCurrency(feeRecord.paidAmount)}</strong></span>
              <span>Outstanding Due: <strong style={{ color: 'var(--danger)' }}>{formatCurrency(feeRecord.dueAmount)}</strong></span>
            </div>
          </div>

          {/* Amount Selection */}
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Select Payment Amount</label>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <button
                type="button"
                className={`btn btn-sm ${isFullPayment ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1 }}
                onClick={() => handleAmountToggle(true)}
              >
                Pay Full Due ({formatCurrency(feeRecord.dueAmount)})
              </button>
              <button
                type="button"
                className={`btn btn-sm ${!isFullPayment ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1 }}
                onClick={() => handleAmountToggle(false)}
              >
                Pay Custom Partial Amount
              </button>
            </div>
            {!isFullPayment && (
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 600, color: 'var(--text-muted)' }}>₹</span>
                <input
                  type="number"
                  step="100"
                  min="1"
                  max={feeRecord.dueAmount}
                  className="form-input"
                  style={{ paddingLeft: '2rem' }}
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          {/* Payment Method Selector */}
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Payment Mode (Demo Gateway)</label>
            <div className="payment-tabs">
              <button
                type="button"
                className={`payment-tab-btn ${paymentMode === 'CARD' ? 'active' : ''}`}
                onClick={() => setPaymentMode('CARD')}
              >
                <CreditCard size={18} /> Credit / Debit Card
              </button>
              <button
                type="button"
                className={`payment-tab-btn ${paymentMode === 'UPI' ? 'active' : ''}`}
                onClick={() => setPaymentMode('UPI')}
              >
                <QrCode size={18} /> UPI / QR Code
              </button>
              <button
                type="button"
                className={`payment-tab-btn ${paymentMode === 'NET_BANKING' ? 'active' : ''}`}
                onClick={() => setPaymentMode('NET_BANKING')}
              >
                <Building2 size={18} /> Net Banking
              </button>
            </div>
          </div>

          {/* Payment Details per Tab */}
          {paymentMode === 'CARD' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Card Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="4532 8901 2345 6789"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Cardholder Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Full name as on card"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Expiry Date</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">CVV / CVC</label>
                  <input
                    type="password"
                    maxLength="4"
                    className="form-input"
                    placeholder="•••"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMode === 'UPI' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${upiMethod === 'QR' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1 }}
                  onClick={() => setUpiMethod('QR')}
                >
                  Scan QR Code
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${upiMethod === 'VPA' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1 }}
                  onClick={() => setUpiMethod('VPA')}
                >
                  Enter UPI ID (VPA)
                </button>
              </div>

              {upiMethod === 'QR' ? (
                <div style={{ background: '#ffffff', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                  <svg width="150" height="150" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100" height="100" fill="white"/>
                    <path d="M10 10H35V35H10V10ZM15 15V30H30V15H15Z" fill="#0f2942"/>
                    <rect x="20" y="20" width="5" height="5" fill="#0f2942"/>
                    <path d="M65 10H90V35H65V10ZM70 15V30H85V15H70Z" fill="#0f2942"/>
                    <rect x="75" y="20" width="5" height="5" fill="#0f2942"/>
                    <path d="M10 65H35V90H10V65ZM15 70V85H30V70H15Z" fill="#0f2942"/>
                    <rect x="20" y="75" width="5" height="5" fill="#0f2942"/>
                    <rect x="45" y="10" width="10" height="10" fill="#2563eb"/>
                    <rect x="45" y="30" width="10" height="25" fill="#0f2942"/>
                    <rect x="65" y="45" width="15" height="10" fill="#0f2942"/>
                    <rect x="45" y="65" width="20" height="25" fill="#0f2942"/>
                    <rect x="75" y="75" width="15" height="15" fill="#2563eb"/>
                  </svg>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    Scan with BHIM, Google Pay, PhonePe, or Paytm
                  </p>
                </div>
              ) : (
                <div className="form-group" style={{ width: '100%', textAlign: 'left', margin: 0 }}>
                  <label className="form-label">Virtual Payment Address (UPI ID)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="student@oksbi / 9876543210@paytm"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>
          )}

          {paymentMode === 'NET_BANKING' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <label className="form-label">Select Popular Bank</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
                {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Punjab National Bank', 'Kotak Mahindra'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    className={`btn btn-sm ${selectedBank === b ? 'btn-primary' : 'btn-outline'}`}
                    style={{ fontSize: '0.78rem', padding: '0.5rem 0.25rem', whiteSpace: 'normal', textAlign: 'center', height: '48px' }}
                    onClick={() => setSelectedBank(b)}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )}

          {errorMessage && (
            <div style={{
              backgroundColor: 'var(--danger-bg)',
              color: 'var(--danger-text)',
              border: '1px solid var(--danger-border)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '1rem'
            }}>
              <ShieldAlert size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <Lock size={14} />
              <span>256-Bit SSL Demo Sandbox</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" className="btn btn-outline" onClick={handleClose} disabled={isSubmitting}>
                Cancel
              </button>
              <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                    Processing...
                  </>
                ) : (
                  <>
                    Pay {formatCurrency(payAmount)} <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default PaymentGatewayModal;
