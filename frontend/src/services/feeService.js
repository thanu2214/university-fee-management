import { api } from './api';

export const feeService = {
  // Fee structures
  getAllStructures: async () => {
    const res = await api.get('/fees/structures');
    return res.data;
  },

  createStructure: async (data) => {
    const res = await api.post('/admin/fee-structures', data);
    return res.data;
  },

  updateStructure: async (id, data) => {
    const res = await api.put(`/admin/fee-structures/${id}`, data);
    return res.data;
  },

  deleteStructure: async (id) => {
    const res = await api.delete(`/admin/fee-structures/${id}`);
    return res.data;
  },

  // Fee records
  getAllRecords: async (search, status) => {
    let query = '';
    const params = [];
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (status) params.push(`status=${encodeURIComponent(status)}`);
    if (params.length > 0) query = '?' + params.join('&');
    const res = await api.get(`/fees/records${query}`);
    return res.data;
  },

  getRecordsByStudentId: async (studentId) => {
    const res = await api.get(`/fees/student/${studentId}`);
    return res.data;
  },

  getRecordById: async (id) => {
    const res = await api.get(`/fees/records/${id}`);
    return res.data;
  },

  allocateFee: async (studentId, feeStructureId) => {
    const res = await api.post(`/admin/allocate-fee?studentId=${studentId}&feeStructureId=${feeStructureId}`);
    return res.data;
  },

  applyConcession: async (recordId, amount, reason) => {
    const res = await api.post(`/finance/concession?recordId=${recordId}&amount=${amount}${reason ? `&reason=${encodeURIComponent(reason)}` : ''}`);
    return res.data;
  },

  getDefaulters: async () => {
    const res = await api.get('/finance/defaulters');
    return res.data;
  },
};
