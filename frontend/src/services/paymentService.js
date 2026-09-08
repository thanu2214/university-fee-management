import { api } from './api';

export const paymentService = {
  processDemoPayment: async (paymentData) => {
    const res = await api.post('/payments/process-demo', paymentData);
    return res.data;
  },

  recordOfflinePayment: async (paymentData) => {
    const res = await api.post('/finance/record-offline-payment', paymentData);
    return res.data;
  },

  getPaymentById: async (id) => {
    const res = await api.get(`/payments/${id}`);
    return res.data;
  },

  getPaymentsByStudentId: async (studentId) => {
    const res = await api.get(`/payments/student/${studentId}`);
    return res.data;
  },

  getAllPayments: async (search, status) => {
    let query = '';
    const params = [];
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (status) params.push(`status=${encodeURIComponent(status)}`);
    if (params.length > 0) query = '?' + params.join('&');
    const res = await api.get(`/payments${query}`);
    return res.data;
  },
};
