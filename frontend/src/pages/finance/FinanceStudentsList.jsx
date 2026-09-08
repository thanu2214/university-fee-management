import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { feeService } from '../../services/feeService';
import { formatCurrency } from '../../utils/formatters';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import { Search, Eye, FileSpreadsheet, User, Phone, Mail, BookOpen } from 'lucide-react';

export const FinanceStudentsList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentFeeRecords, setStudentFeeRecords] = useState([]);
  const [loadingLedger, setLoadingLedger] = useState(false);

  const fetchStudents = async (query) => {
    try {
      setLoading(true);
      const data = await studentService.getAllStudents(query);
      setStudents(data || []);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleViewLedger = async (student) => {
    setSelectedStudent(student);
    try {
      setLoadingLedger(true);
      const records = await feeService.getRecordsByStudentId(student.id);
      setStudentFeeRecords(records || []);
    } catch (err) {
      console.error('Error loading ledger:', err);
    } finally {
      setLoadingLedger(false);
    }
  };

  const columns = [
    {
      header: 'Roll Number',
      accessor: 'rollNumber',
      render: (row) => <strong style={{ color: 'var(--primary)' }}>{row.rollNumber}</strong>,
    },
    {
      header: 'Student Name',
      accessor: 'fullName',
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.fullName}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{row.email}</div>
        </div>
      ),
    },
    {
      header: 'Degree / Program',
      accessor: 'program',
      render: (row) => `${row.program} (Sem ${row.currentSemester})`,
    },
    {
      header: 'Total Billed',
      accessor: 'totalFeesAllSemesters',
      align: 'right',
      render: (row) => formatCurrency(row.totalFeesAllSemesters),
    },
    {
      header: 'Paid Amount',
      accessor: 'totalPaidAllSemesters',
      align: 'right',
      render: (row) => (
        <strong style={{ color: 'var(--success)' }}>
          {formatCurrency(row.totalPaidAllSemesters)}
        </strong>
      ),
    },
    {
      header: 'Outstanding Balance',
      accessor: 'totalDueAllSemesters',
      align: 'right',
      render: (row) => (
        <strong style={{ color: row.totalDueAllSemesters > 0 ? 'var(--danger)' : 'var(--success)' }}>
          {formatCurrency(row.totalDueAllSemesters)}
        </strong>
      ),
    },
    {
      header: 'Fee Status',
      accessor: 'feeStatusOverview',
      render: (row) => <StatusBadge status={row.feeStatusOverview} />,
    },
    {
      header: 'Action',
      accessor: 'id',
      align: 'right',
      render: (row) => (
        <button
          className="btn btn-outline btn-sm"
          onClick={() => handleViewLedger(row)}
        >
          <Eye size={14} /> Fee Ledger
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Student Fee Accounts Directory</h1>
          <p className="page-header-desc">
            Lookup enrolled student fee ledgers, check payment histories, and inspect semester balances.
          </p>
        </div>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={students}
          searchPlaceholder="Search by student name, roll number, or program..."
          onSearch={(val) => fetchStudents(val)}
          loading={loading}
          emptyMessage="No student accounts found."
        />
      </div>

      {/* Student Ledger Modal */}
      {selectedStudent && (
        <Modal
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          title={`Student Fee Ledger — ${selectedStudent.fullName} (${selectedStudent.rollNumber})`}
          maxWidth="700px"
        >
          {loadingLedger ? (
            <LoadingSpinner message="Fetching fee records..." />
          ) : (
            <div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                backgroundColor: 'var(--surface-alt)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                fontSize: '0.85rem'
              }}>
                <div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Program: </span><strong>{selectedStudent.program}</strong></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Department: </span><strong>{selectedStudent.department}</strong></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Registration No: </span><strong>{selectedStudent.registrationNo}</strong></div>
                </div>
                <div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Email: </span><strong>{selectedStudent.email}</strong></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Phone: </span><strong>{selectedStudent.phone || '—'}</strong></div>
                  <div><span style={{ color: 'var(--text-muted)' }}>Guardian: </span><strong>{selectedStudent.guardianName} ({selectedStudent.guardianPhone})</strong></div>
                </div>
              </div>

              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Semester Fee Records</h4>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Semester</th>
                      <th style={{ textAlign: 'right' }}>Total Fee</th>
                      <th style={{ textAlign: 'right' }}>Paid</th>
                      <th style={{ textAlign: 'right' }}>Due</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentFeeRecords.map((r) => (
                      <tr key={r.id}>
                        <td><strong>Semester {r.semester}</strong> ({r.academicYear})</td>
                        <td style={{ textAlign: 'right' }}>{formatCurrency(r.totalFeeAmount)}</td>
                        <td style={{ textAlign: 'right', color: 'var(--success)', fontWeight: 600 }}>{formatCurrency(r.paidAmount)}</td>
                        <td style={{ textAlign: 'right', color: r.dueAmount > 0 ? 'var(--danger)' : 'var(--success)', fontWeight: 600 }}>
                          {formatCurrency(r.dueAmount)}
                        </td>
                        <td><StatusBadge status={r.feeStatus} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default FinanceStudentsList;
