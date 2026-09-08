import React from 'react';
import { Printer, Download, CheckCircle2, GraduationCap, X } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

export const PrintableReceipt = ({ receipt, onClose }) => {
  if (!receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 120 }}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '780px', padding: 0, backgroundColor: '#ffffff', overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Receipt Toolbar (Hidden when printing) */}
        <div className="no-print" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.5rem',
          backgroundColor: 'var(--surface-alt)',
          borderBottom: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
            <span className="badge badge-paid">Official E-Receipt</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{receipt.receiptNumber}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-primary btn-sm" onClick={handlePrint}>
              <Printer size={16} /> Print / Save PDF
            </button>
            <button className="btn btn-outline btn-sm" onClick={onClose}>
              <X size={16} /> Close
            </button>
          </div>
        </div>

        {/* Official Printable Area */}
        <div className="printable-area" style={{ padding: '2.5rem 3rem', color: '#1e293b', fontFamily: 'Georgia, serif' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', borderBottom: '2px solid #0f2942', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
              <div style={{ width: '42px', height: '42px', backgroundColor: '#0f2942', color: '#ffffff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GraduationCap size={26} />
              </div>
              <h1 style={{ fontSize: '1.75rem', color: '#0f2942', letterSpacing: '0.04em', margin: 0, fontFamily: 'var(--font-heading)' }}>
                APEX GLOBAL UNIVERSITY
              </h1>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
              Office of the Comptroller of Finance & Accounts
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', fontFamily: 'var(--font-sans)', marginTop: '0.2rem' }}>
              Knowledge City Campus, Tech Boulevard, Sector 62 • finance@apexuniv.edu.in
            </div>
            <div style={{
              display: 'inline-block',
              marginTop: '0.75rem',
              backgroundColor: '#0f2942',
              color: '#ffffff',
              padding: '0.25rem 1rem',
              borderRadius: '4px',
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              fontFamily: 'var(--font-sans)'
            }}>
              STUDENT FEE PAYMENT RECEIPT
            </div>
          </div>

          {/* Receipt Top Metadata */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
            padding: '1rem',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.85rem',
            marginBottom: '1.5rem'
          }}>
            <div>
              <div style={{ marginBottom: '0.35rem' }}>
                <span style={{ color: '#64748b' }}>Receipt Number: </span>
                <strong style={{ color: '#0f2942' }}>{receipt.receiptNumber}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Transaction Ref: </span>
                <strong style={{ fontFamily: 'monospace' }}>{receipt.transactionReference}</strong>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ marginBottom: '0.35rem' }}>
                <span style={{ color: '#64748b' }}>Issue Date & Time: </span>
                <strong>{formatDateTime(receipt.issueDate)}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Payment Mode: </span>
                <strong style={{ color: '#059669' }}>{receipt.paymentMethod}</strong>
              </div>
            </div>
          </div>

          {/* Student Particulars Table */}
          <div style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-sans)' }}>
            <h4 style={{ fontSize: '0.9rem', color: '#0f2942', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', fontWeight: 700 }}>
              Student Particulars
            </h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.5rem 0', color: '#64748b', width: '25%' }}>Student Name</td>
                  <td style={{ padding: '0.5rem 0', fontWeight: 600, color: '#0f172a', width: '35%' }}>{receipt.studentName}</td>
                  <td style={{ padding: '0.5rem 0', color: '#64748b', width: '20%' }}>Roll Number</td>
                  <td style={{ padding: '0.5rem 0', fontWeight: 600, color: '#0f172a', width: '20%' }}>{receipt.rollNumber}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.5rem 0', color: '#64748b' }}>Program / Degree</td>
                  <td style={{ padding: '0.5rem 0', fontWeight: 600, color: '#0f172a' }}>{receipt.program}</td>
                  <td style={{ padding: '0.5rem 0', color: '#64748b' }}>Registration No</td>
                  <td style={{ padding: '0.5rem 0', fontWeight: 600, color: '#0f172a' }}>{receipt.registrationNo || '—'}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.5rem 0', color: '#64748b' }}>Academic Session</td>
                  <td style={{ padding: '0.5rem 0', fontWeight: 600, color: '#0f172a' }}>{receipt.academicYear || '2025-2026'}</td>
                  <td style={{ padding: '0.5rem 0', color: '#64748b' }}>Current Semester</td>
                  <td style={{ padding: '0.5rem 0', fontWeight: 600, color: '#0f172a' }}>Semester {receipt.semester}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Fee Itemization Ledger Table */}
          <div style={{ marginBottom: '1.75rem', fontFamily: 'var(--font-sans)' }}>
            <h4 style={{ fontSize: '0.9rem', color: '#0f2942', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', fontWeight: 700 }}>
              Payment Particulars
            </h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#0f2942', color: '#ffffff' }}>
                  <th style={{ padding: '0.65rem 1rem', textAlign: 'left', fontWeight: 600 }}>S.No</th>
                  <th style={{ padding: '0.65rem 1rem', textAlign: 'left', fontWeight: 600 }}>Description / Fee Head</th>
                  <th style={{ padding: '0.65rem 1rem', textAlign: 'right', fontWeight: 600 }}>Amount (INR)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>1</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <strong>Academic Tuition & Semester Fee</strong>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      {receipt.program} — Semester {receipt.semester} ({receipt.academicYear})
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 600 }}>
                    {formatCurrency(receipt.amountPaid)}
                  </td>
                </tr>
                <tr style={{ backgroundColor: '#f8fafc', borderTop: '2px solid #0f2942', fontWeight: 700 }}>
                  <td colSpan="2" style={{ padding: '0.85rem 1rem', textAlign: 'right', color: '#0f2942' }}>
                    TOTAL AMOUNT PAID:
                  </td>
                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right', color: '#059669', fontSize: '1.05rem' }}>
                    {formatCurrency(receipt.amountPaid)}
                  </td>
                </tr>
                <tr style={{ backgroundColor: '#fff', borderTop: '1px solid #e2e8f0' }}>
                  <td colSpan="2" style={{ padding: '0.65rem 1rem', textAlign: 'right', color: '#64748b', fontSize: '0.85rem' }}>
                    Remaining Due Balance for Semester:
                  </td>
                  <td style={{ padding: '0.65rem 1rem', textAlign: 'right', fontWeight: 600, color: receipt.balanceRemaining > 0 ? '#d97706' : '#059669', fontSize: '0.9rem' }}>
                    {formatCurrency(receipt.balanceRemaining)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer & Authorized Signatures */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #e2e8f0',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.8rem'
          }}>
            <div style={{ maxWidth: '300px', color: '#64748b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#059669', fontWeight: 600, marginBottom: '0.3rem' }}>
                <CheckCircle2 size={16} /> Digitally Verified University Receipt
              </div>
              <p style={{ lineHeight: 1.4 }}>
                This is a computer-generated official receipt. No physical signature is required. Keep this document for future academic references.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '160px',
                borderBottom: '1px solid #0f2942',
                paddingBottom: '0.4rem',
                marginBottom: '0.4rem',
                color: '#0f2942',
                fontFamily: 'cursive',
                fontSize: '1.1rem',
                fontWeight: 600
              }}>
                R. Vance
              </div>
              <div style={{ fontWeight: 700, color: '#0f2942' }}>
                {receipt.authorizedSignatory || 'Finance Comptroller'}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                Apex Global University
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PrintableReceipt;
