import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { feeService } from '../../services/feeService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PaymentGatewayModal from '../../components/payment/PaymentGatewayModal';
import { CreditCard, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

export const MyFeeDetails = () => {
  const [student, setStudent] = useState(null);
  const [feeRecords, setFeeRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePaymentRecord, setActivePaymentRecord] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const profile = await studentService.getMyProfile();
      setStudent(profile);
      if (profile?.id) {
        const records = await feeService.getRecordsByStudentId(profile.id);
        setFeeRecords(records || []);
      }
    } catch (err) {
      console.error('Error fetching fee details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading semester fee details..." />;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Semester Fee Ledger & Breakdown</h1>
          <p className="page-header-desc">
            Complete schedule of all semester fee obligations, itemized fee heads, paid amounts, and due balances.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {feeRecords.map((record) => (
          <div key={record.id} className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h3 className="card-title" style={{ fontSize: '1.2rem' }}>
                  {record.program} — Semester {record.semester}
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  ({record.academicYear})
                </span>
              </div>
              <StatusBadge status={record.feeStatus} />
            </div>

            {/* Financial Overview Tiles */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              backgroundColor: 'var(--surface-alt)',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              border: '1px solid var(--border)'
            }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Billed</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>{formatCurrency(record.totalFeeAmount)}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Amount Paid</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--success)' }}>{formatCurrency(record.paidAmount)}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Outstanding Balance</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: record.dueAmount > 0 ? 'var(--danger)' : 'var(--success)' }}>
                  {formatCurrency(record.dueAmount)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Due Date</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>{formatDate(record.dueDate)}</div>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Fee Component</th>
                    <th>Category</th>
                    <th style={{ textAlign: 'right' }}>Amount (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Tuition Fee</strong></td>
                    <td>Academic Instruction & Faculty</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(record.tuitionFee)}</td>
                  </tr>
                  <tr>
                    <td><strong>Laboratory & Practical Computing Fee</strong></td>
                    <td>High-Performance Computing & Equipment</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(record.labFee)}</td>
                  </tr>
                  <tr>
                    <td><strong>Semester Examination & Assessment Fee</strong></td>
                    <td>Controller of Examinations</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(record.examFee)}</td>
                  </tr>
                  <tr>
                    <td><strong>Library & Online Journals Subscription</strong></td>
                    <td>Digital & Central Library</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(record.libraryFee)}</td>
                  </tr>
                  <tr>
                    <td><strong>Campus Hostel, Utilities & Maintenance</strong></td>
                    <td>Residential Life (if opted)</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(record.hostelFee)}</td>
                  </tr>
                  <tr>
                    <td><strong>Sports, Gymnasium & Student Welfare</strong></td>
                    <td>Campus Facilities</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(record.sportsFee)}</td>
                  </tr>
                  <tr style={{ backgroundColor: 'var(--surface-alt)', fontWeight: 700 }}>
                    <td colSpan="2" style={{ textAlign: 'right' }}>Grand Total Net Payable:</td>
                    <td style={{ textAlign: 'right', color: 'var(--primary)', fontSize: '1rem' }}>{formatCurrency(record.totalFeeAmount)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem', gap: '0.75rem' }}>
              {record.dueAmount > 0 ? (
                <button
                  className="btn btn-success"
                  onClick={() => setActivePaymentRecord(record)}
                >
                  <CreditCard size={18} /> Pay Due Balance ({formatCurrency(record.dueAmount)})
                </button>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--success)', fontWeight: 600, fontSize: '0.9rem' }}>
                  <CheckCircle2 size={18} /> All dues settled for this semester
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {activePaymentRecord && (
        <PaymentGatewayModal
          isOpen={!!activePaymentRecord}
          onClose={() => setActivePaymentRecord(null)}
          feeRecord={activePaymentRecord}
          onSuccess={() => loadData()}
        />
      )}
    </div>
  );
};

export default MyFeeDetails;
