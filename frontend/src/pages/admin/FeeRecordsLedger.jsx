import React, { useState, useEffect } from 'react';
import { feeService } from '../../services/feeService';
import { studentService } from '../../services/studentService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import { PlusCircle, Tag, ShieldAlert } from 'lucide-react';

export const FeeRecordsLedger = () => {
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  // Allocate Modal
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedStructureId, setSelectedStructureId] = useState('');
  const [allocateError, setAllocateError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Concession Modal
  const [concessionRecord, setConcessionRecord] = useState(null);
  const [concessionAmount, setConcessionAmount] = useState('');
  const [concessionReason, setConcessionReason] = useState('Merit-based Academic Scholarship');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [recordsData, studentsData, structuresData] = await Promise.all([
        feeService.getAllRecords(null, statusFilter || null),
        studentService.getAllStudents(),
        feeService.getAllStructures(),
      ]);
      setRecords(recordsData || []);
      setStudents(studentsData || []);
      setStructures(structuresData || []);

      if (studentsData?.length > 0 && !selectedStudentId) setSelectedStudentId(studentsData[0].id);
      if (structuresData?.length > 0 && !selectedStructureId) setSelectedStructureId(structuresData[0].id);
    } catch (err) {
      console.error('Error loading fee records ledger:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const handleAllocateFee = async (e) => {
    e.preventDefault();
    setAllocateError('');
    setIsSubmitting(true);

    try {
      await feeService.allocateFee(selectedStudentId, selectedStructureId);
      setIsAllocateModalOpen(false);
      fetchData();
    } catch (err) {
      setAllocateError(err.message || 'Failed to allocate fee record');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyConcession = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await feeService.applyConcession(concessionRecord.id, parseFloat(concessionAmount), concessionReason);
      setConcessionRecord(null);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to apply concession');
    } finally {
      setIsSubmitting(false);
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
      header: 'Outstanding Balance',
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
        <button
          className="btn btn-outline btn-sm"
          onClick={() => {
            setConcessionRecord(row);
            setConcessionAmount(row.concessionAmount || '');
          }}
          title="Apply Fee Concession"
        >
          <Tag size={13} /> Concession
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Institutional Fee Records Ledger</h1>
          <p className="page-header-desc">
            Master repository of all student fee allocations, payment progress, and scholarship waivers.
          </p>
        </div>

        <div className="page-header-actions">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ minWidth: '170px' }}
          >
            <option value="">All Statuses</option>
            <option value="PAID">Paid in Full</option>
            <option value="PARTIALLY_PAID">Partially Paid</option>
            <option value="PENDING">Pending</option>
            <option value="OVERDUE">Overdue</option>
          </select>

          <button className="btn btn-primary" onClick={() => setIsAllocateModalOpen(true)}>
            <PlusCircle size={18} /> Allocate Fee to Student
          </button>
        </div>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={records}
          searchPlaceholder="Search ledger by student name, roll number, or program..."
          loading={loading}
          emptyMessage="No fee records found in the ledger."
        />
      </div>

      {/* Allocate Fee Modal */}
      {isAllocateModalOpen && (
        <Modal
          isOpen={isAllocateModalOpen}
          onClose={() => setIsAllocateModalOpen(false)}
          title="Allocate Semester Fee Record to Student"
          maxWidth="550px"
        >
          <form onSubmit={handleAllocateFee}>
            <div className="form-group">
              <label className="form-label">Select Student</label>
              <select
                className="form-select"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                required
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.rollNumber}) — {s.program} (Sem {s.currentSemester})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Select Fee Structure Template</label>
              <select
                className="form-select"
                value={selectedStructureId}
                onChange={(e) => setSelectedStructureId(e.target.value)}
                required
              >
                {structures.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.program} — Sem {st.semester} ({st.academicYear}) [{formatCurrency(st.totalFee)}]
                  </option>
                ))}
              </select>
            </div>

            {allocateError && (
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
                <span>{allocateError}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setIsAllocateModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Allocating Fee...' : 'Assign Fee Record'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Concession Modal */}
      {concessionRecord && (
        <Modal
          isOpen={!!concessionRecord}
          onClose={() => setConcessionRecord(null)}
          title={`Adjust Fee Concession — ${concessionRecord.studentName}`}
          maxWidth="500px"
        >
          <form onSubmit={handleApplyConcession}>
            <div className="form-group">
              <label className="form-label">Concession Amount (₹)</label>
              <input
                type="number"
                min="0"
                max={concessionRecord.totalFeeAmount}
                className="form-input"
                value={concessionAmount}
                onChange={(e) => setConcessionAmount(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={concessionReason}
                onChange={(e) => setConcessionReason(e.target.value)}
              >
                <option value="Merit-based Academic Scholarship">Merit-based Academic Scholarship</option>
                <option value="Sports Excellence Quota">Sports Excellence Quota</option>
                <option value="Financial Hardship Aid">Financial Hardship Aid</option>
                <option value="Staff Ward Concession">Staff Ward Concession</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setConcessionRecord(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                Save Concession
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default FeeRecordsLedger;
