import { api } from './api';

export const studentService = {
  getAllStudents: async (search) => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    const res = await api.get(`/students${query}`);
    return res.data;
  },

  getStudentById: async (id) => {
    const res = await api.get(`/students/${id}`);
    return res.data;
  },

  getStudentByRoll: async (rollNumber) => {
    const res = await api.get(`/students/roll/${encodeURIComponent(rollNumber)}`);
    return res.data;
  },

  getMyProfile: async () => {
    const res = await api.get('/students/profile');
    return res.data;
  },

  createStudent: async (studentData) => {
    const res = await api.post('/students', studentData);
    return res.data;
  },

  updateStudent: async (id, studentData) => {
    const res = await api.put(`/students/${id}`, studentData);
    return res.data;
  },

  deleteStudent: async (id) => {
    const res = await api.delete(`/students/${id}`);
    return res.data;
  },

  toggleStudentStatus: async (id) => {
    const res = await api.patch(`/students/${id}/toggle-status`);
    return res.data;
  },
};
