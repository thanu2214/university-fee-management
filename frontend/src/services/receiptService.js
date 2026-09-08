import { api } from './api';

export const receiptService = {
  getReceiptById: async (id) => {
    const res = await api.get(`/receipts/${id}`);
    return res.data;
  },

  getReceiptByPaymentId: async (paymentId) => {
    const res = await api.get(`/receipts/payment/${paymentId}`);
    return res.data;
  },

  getReceiptByNumber: async (receiptNumber) => {
    const res = await api.get(`/receipts/number/${encodeURIComponent(receiptNumber)}`);
    return res.data;
  },

  getReceiptsByRollNumber: async (rollNumber) => {
    const res = await api.get(`/receipts/student/${encodeURIComponent(rollNumber)}`);
    return res.data;
  },

  getAllReceipts: async (search) => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    const res = await api.get(`/receipts${query}`);
    return res.data;
  },
};
