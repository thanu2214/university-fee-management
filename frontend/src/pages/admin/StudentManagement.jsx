import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/studentService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import { UserPlus, Edit2, Trash2, CheckCircle, XCircle, ShieldAlert } from 'lucide-react';

export const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    rollNumber: '',
    registrationNo: '',
    program: 'B.Tech Computer Science & Engineering',
    department: 'School of Computing',
    currentSemester: 1,
    academicYear: '2025-2026',
    admissionDate: new Date().toISOString().split('T')[0],
    guardianName: '',
    guardianPhone: '',
    address: '',
  });

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStudents = async (query) => {
    try {
      setLoading(true);
      const data = await studentService.getAllStudents(query);
      setStudents(data || []);
    } catch (err) {
      console.error('Error loading students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setFormData({
      username: '',
      password: '',
      fullName: '',
      email: '',
      phone: '',
      rollNumber: '',
      registrationNo: '',
      program: 'B.Tech Computer Science & Engineering',
      department: 'School of Computing',
      currentSemester: 1,
      academicYear: '2025-2026',
      admissionDate: new Date().toISOString().split('T')[0],
      guardianName: '',
      guardianPhone: '',
      address: '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (student) => {
    setEditingStudent(student);
    setFormData({
      username: student.username,
      password: '',
      fullName: student.fullName,
      email: student.email,
      phone: student.phone || '',
      rollNumber: student.rollNumber,
      registrationNo: student.registrationNo,
      program: student.program,
      department: student.department,
      currentSemester: student.currentSemester,
      academicYear: student.academicYear,
      admissionDate: student.admissionDate || new Date().toISOString().split('T')[0],
      guardianName: student.guardianName || '',
      guardianPhone: student.guardianPhone || '',
      address: student.address || '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    try {
      if (editingStudent) {
        await studentService.updateStudent(editingStudent.id, formData);
      } else {
        await studentService.createStudent(formData);
      }
      setIsModalOpen(false);
      fetchStudents();
    } catch (err) {
      setFormError(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student record?')) {
      try {
        await studentService.deleteStudent(id);
        fetchStudents();
      } catch (err) {
        alert(err.message || 'Failed to delete student');
      }
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
      header: 'Program / Department',
      accessor: 'program',
      render: (row) => (
        <div>
          <div>{row.program}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Sem {row.currentSemester} • {row.department}</div>
        </div>
      ),
    },
    {
      header: 'Total Fee Billed',
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
      header: 'Outstanding Dues',
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
      header: 'Actions',
      accessor: 'id',
      align: 'right',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => handleOpenEditModal(row)}
            title="Edit student particulars"
          >
            <Edit2 size={13} /> Edit
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(row.id)}
            title="Delete student"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header-title">Student Admissions & Directory</h1>
          <p className="page-header-desc">
            Manage student registrations, degree enrollments, linked credentials, and academic statuses.
          </p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={handleOpenAddModal}>
            <UserPlus size={18} /> Register New Student
          </button>
        </div>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={students}
          searchPlaceholder="Search students by name, roll no, or program..."
          onSearch={(val) => fetchStudents(val)}
          loading={loading}
          emptyMessage="No students found in the registry."
        />
      </div>

      {/* Add / Edit Student Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingStudent ? `Edit Student — ${editingStudent.fullName}` : 'Register New Student Admission'}
          maxWidth="700px"
        >
          <form onSubmit={handleFormSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Aarav Sharma"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="student@apexuniv.edu.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. student7"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  disabled={!!editingStudent}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password {editingStudent && '(Leave blank to keep current)'}</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder={editingStudent ? '••••••••' : 'Enter password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingStudent}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Roll Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 2024-CSE-0110"
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  disabled={!!editingStudent}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Registration ID</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. REG-2024-00110"
                  value={formData.registrationNo}
                  onChange={(e) => setFormData({ ...formData, registrationNo: e.target.value })}
                  disabled={!!editingStudent}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Degree / Program</label>
                <select
                  className="form-select"
                  value={formData.program}
                  onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                >
                  <option value="B.Tech Computer Science & Engineering">B.Tech Computer Science & Engineering</option>
                  <option value="B.Tech Electronics & Communication">B.Tech Electronics & Communication</option>
                  <option value="MBA Finance & Marketing">MBA Finance & Marketing</option>
                  <option value="MBBS Medicine & Surgery">MBBS Medicine & Surgery</option>
                  <option value="B.Sc Data Science & AI">B.Sc Data Science & AI</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Current Semester</label>
                <select
                  className="form-select"
                  value={formData.currentSemester}
                  onChange={(e) => setFormData({ ...formData, currentSemester: parseInt(e.target.value) })}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Department / School</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Academic Session</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Parent / Guardian Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Guardian Name"
                  value={formData.guardianName}
                  onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Guardian Phone</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="+91 9876543210"
                  value={formData.guardianPhone}
                  onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                />
              </div>
            </div>

            {formError && (
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
                <span>{formError}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving Student...' : (editingStudent ? 'Update Student' : 'Register Student')}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default StudentManagement;
