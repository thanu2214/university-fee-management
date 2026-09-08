import React, { useState, useEffect } from 'react';
import { staffService } from '../../services/dashboardService';
import { formatDateTime } from '../../utils/formatters';
import DataTable from '../../components/common/DataTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import { UserPlus, Edit2, Trash2, CheckCircle, XCircle, ShieldCheck, ShieldAlert } from 'lucide-react';

export const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
  });

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const data = await staffService.getAllStaff();
      setStaffList(data || []);
    } catch (err) {
      console.error('Error loading staff:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleOpenAddModal = () => {
    setEditingStaff(null);
    setFormData({
      username: '',
      password: '',
      fullName: '',
      email: '',
      phone: '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (staff) => {
    setEditingStaff(staff);
    setFormData({
      username: staff.username,
      password: '',
      fullName: staff.fullName,
      email: staff.email,
      phone: staff.phone || '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    try {
      if (editingStaff) {
        await staffService.updateStaff(editingStaff.id, formData);
      } else {
        await staffService.createStaff(formData);
      }
      setIsModalOpen(false);
      fetchStaff();
    } catch (err) {
      setFormError(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await staffService.toggleStaffStatus(id);
      fetchStaff();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this finance staff account?')) {
      try {
        await staffService.deleteStaff(id);
        fetchStaff();
      } catch (err) {
        alert(err.message || 'Failed to delete staff');
      }
    }
  };

  const columns = [
    {
      header: 'Full Name',
      accessor: 'fullName',
      render: (row) => <strong>{row.fullName}</strong>,
    },
    {
      header: 'Username',
      accessor: 'username',
      render: (row) => <span style={{ fontFamily: 'monospace' }}>{row.username}</span>,
    },
    {
      header: 'Email Address',
      accessor: 'email',
    },
    {
      header: 'Contact Phone',
      accessor: 'phone',
      render: (row) => row.phone || '—',
    },
    {
      header: 'Role / Designation',
      accessor: 'role',
      render: () => <span className="badge badge-finance">Finance Officer</span>,
    },
    {
      header: 'Account Status',
      accessor: 'active',
      render: (row) => (
        <span
          className="badge"
          style={{
            backgroundColor: row.active ? 'var(--success-bg)' : 'var(--danger-bg)',
            color: row.active ? 'var(--success-text)' : 'var(--danger-text)',
            cursor: 'pointer'
          }}
          onClick={() => handleToggleStatus(row.id)}
          title="Click to toggle status"
        >
          {row.active ? 'Active' : 'Deactivated'}
        </span>
      ),
    },
    {
      header: 'Created On',
      accessor: 'createdAt',
      render: (row) => formatDateTime(row.createdAt),
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
            title="Edit staff account"
          >
            <Edit2 size={13} />
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(row.id)}
            title="Delete staff account"
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
          <h1 className="page-header-title">Finance Staff User Management</h1>
          <p className="page-header-desc">
            Manage university financial officers, cashiers, accounts staff credentials, and role permissions.
          </p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={handleOpenAddModal}>
            <UserPlus size={18} /> Add Finance Staff
          </button>
        </div>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          data={staffList}
          searchPlaceholder="Search staff by name, username, or email..."
          loading={loading}
          emptyMessage="No finance staff users found."
        />
      </div>

      {/* Add / Edit Staff Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingStaff ? `Edit Finance Staff — ${editingStaff.fullName}` : 'Create New Finance Staff Account'}
          maxWidth="520px"
        >
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Sarah Jenkins"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Official University Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="s.jenkins@apexuniv.edu.in"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. finance3"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  disabled={!!editingStaff}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password {editingStaff && '(Leave blank to keep)'}</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder={editingStaff ? '••••••••' : 'Enter password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingStaff}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-input"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
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
                {isSubmitting ? 'Saving...' : (editingStaff ? 'Update Staff' : 'Create Staff Account')}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default StaffManagement;
