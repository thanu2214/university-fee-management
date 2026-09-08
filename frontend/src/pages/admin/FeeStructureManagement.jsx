import React, { useState, useEffect } from 'react';
import { feeService } from '../../services/feeService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import DataTable from '../../components/common/DataTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import { Plus, Edit2, Trash2, ShieldAlert } from 'lucide-react';

export const FeeStructureManagement = () => {
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStructure, setEditingStructure] = useState(null);
  const [formData, setFormData] = useState({
    program: 'B.Tech Computer Science & Engineering',
    academicYear: '2025-2026',
    semester: 1,
    tuitionFee: 50000,
    examFee: 5000,
    libraryFee: 3000,
    labFee: 10000,
    hostelFee: 5000,
    sportsFee: 2000,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStructures = async () => {
    try {
      setLoading(true);
      const data = await feeService.getAllStructures();
      setStructures(data || []);
    } catch (err) {
      console.error('Error fetching fee structures:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStructures();
  }, []);

  const calculateTotal = (data) => {
    return (
      (parseFloat(data.tuitionFee) || 0) +
      (parseFloat(data.examFee) || 0) +
      (parseFloat(data.libraryFee) || 0) +
      (parseFloat(data.labFee) || 0) +
      (parseFloat(data.hostelFee) || 0) +
      (parseFloat(data.sportsFee) || 0)
    );
  };

  const handleOpenAddModal = () => {
    setEditingStructure(null);
    setFormData({
      program: 'B.Tech Computer Science & Engineering',
      academicYear: '2025-2026',
      semester: 1,
      tuitionFee: 50000,
      examFee: 5000,
      libraryFee: 3000,
      labFee: 10000,
      hostelFee: 5000,
      sportsFee: 2000,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (struct) => {
    setEditingStructure(struct);
    setFormData({
      program: struct.program,
      academicYear: struct.academicYear,
      semester: struct.semester,
      tuitionFee: struct.tuitionFee,
      examFee: struct.examFee,
      libraryFee: struct.libraryFee,
      labFee: struct.labFee,
      hostelFee: struct.hostelFee,
      sportsFee: struct.sportsFee,
      dueDate: struct.dueDate || new Date().toISOString().split('T')[0],
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    try {
      if (editingStructure) {
        await feeService.updateStructure(editingStructure.id, formData);
      } else {
        await feeService.createStructure(formData);
      }
      setIsModalOpen(false);
      fetchStructures();
    } catch (err) {
      setFormError(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this fee structure?')) {
      try {
        await feeService.deleteStructure(id);
        fetchStructures();
      } catch (err) {
        alert(err.message || 'Failed to delete fee structure');
      }
    }
  };

  const columns = [
    {
      header: 'Program / Degree',
      accessor: 'program',
      render: (row) => <strong>{row.program}</strong>,
    },
    {
      header: 'Session & Sem',
      accessor: 'semester',
      render: (row) => `${row.academicYear} • Sem ${row.semester}`,
    },
    {
      header: 'Tuition Fee',
      accessor: 'tuitionFee',
      align: 'right',
      render: (row) => formatCurrency(row.tuitionFee),
    },
    {
      header: 'Lab & Practical',
      accessor: 'labFee',
      align: 'right',
      render: (row) => formatCurrency(row.labFee),
    },
    {
      header: 'Exam Fee',
      accessor: 'examFee',
      align: 'right',
      render: (row) => formatCurrency(row.examFee),
    },
    {
      header: 'Total Semester Fee',
      accessor: 'totalFee',
      align: 'right',
      render: (row) => (
        <strong style={{ color: 'var(--primary)', fontSize: '0.95rem' }}>
          {formatCurrency(row.totalFee)}
        </strong>
      ),
    },
    {
      header: 'Due Date',
      accessor: 'dueDate',
      render: (row) => formatDate(row.dueDate),
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
            title="Edit fee structure"
          >
            <Edit2 size={13} />
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(row.id)}
            title="Delete fee structure"
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
          <h1 className="page-header-title">University Fee Structure Configuration</h1>
          <p className="page-header-desc">
            Define itemized fee heads, payment schedules, and tuition rates per academic degree and semester.
          </p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={handleOpenAddModal}>
            <Plus size={18} /> Create Fee Structure
          </button>
        </div>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={structures}
          searchPlaceholder="Search fee structures by program or session..."
          loading={loading}
          emptyMessage="No fee structures configured."
        />
      </div>

      {/* Add / Edit Structure Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingStructure ? 'Edit Fee Structure' : 'Define New Semester Fee Structure'}
          maxWidth="680px"
        >
          <form onSubmit={handleFormSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Degree Program</label>
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
                <label className="form-label">Semester</label>
                <select
                  className="form-select"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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

              <div className="form-group">
                <label className="form-label">Semester Due Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Fee Breakdown Inputs */}
            <div style={{
              backgroundColor: 'var(--surface-alt)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              margin: '0.75rem 0'
            }}>
              <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 700 }}>
                Itemized Fee Components (INR)
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Tuition Fee</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={formData.tuitionFee}
                    onChange={(e) => setFormData({ ...formData, tuitionFee: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Laboratory / Practical Fee</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={formData.labFee}
                    onChange={(e) => setFormData({ ...formData, labFee: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Examination Fee</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={formData.examFee}
                    onChange={(e) => setFormData({ ...formData, examFee: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Library & Resources</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={formData.libraryFee}
                    onChange={(e) => setFormData({ ...formData, libraryFee: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Hostel & Amenities</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={formData.hostelFee}
                    onChange={(e) => setFormData({ ...formData, hostelFee: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Sports & Welfare</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={formData.sportsFee}
                    onChange={(e) => setFormData({ ...formData, sportsFee: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>

              <div style={{
                marginTop: '1rem',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border-dark)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>CALCULATED TOTAL SEMESTER FEE:</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {formatCurrency(calculateTotal(formData))}
                </span>
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
                {isSubmitting ? 'Saving Fee Structure...' : (editingStructure ? 'Update Structure' : 'Create Structure')}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default FeeStructureManagement;
