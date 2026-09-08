import { api } from './api';

export const dashboardService = {
  getAdminStats: async () => {
    const res = await api.get('/dashboard/admin');
    return res.data;
  },

  getFinanceStats: async () => {
    const res = await api.get('/dashboard/finance');
    return res.data;
  },

  getStudentStats: async (studentId) => {
    const res = await api.get(`/dashboard/student/${studentId}`);
    return res.data;
  },
};

export const staffService = {
  getAllStaff: async () => {
    const res = await api.get('/admin/staff');
    return res.data;
  },

  createStaff: async (data) => {
    const res = await api.post('/admin/staff', data);
    return res.data;
  },

  updateStaff: async (id, data) => {
    const res = await api.put(`/admin/staff/${id}`, data);
    return res.data;
  },

  deleteStaff: async (id) => {
    const res = await api.delete(`/admin/staff/${id}`);
    return res.data;
  },

  toggleStaffStatus: async (id) => {
    const res = await api.patch(`/admin/staff/${id}/toggle-status`);
    return res.data;
  },
};
