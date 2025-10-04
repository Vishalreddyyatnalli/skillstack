import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const skillsApi = {
  getAll: () => api.get('/skills/'),
  get: (id: number) => api.get(`/skills/${id}/`),
  create: (data: any) => api.post('/skills/', data),
  update: (id: number, data: any) => api.put(`/skills/${id}/`, data),
  delete: (id: number) => api.delete(`/skills/${id}/`),
  getStatistics: () => api.get('/skills/statistics/'),
};

export const progressApi = {
  create: (data: { skill: number; date: string; hours_spent: number; notes: string }) => 
    api.post('/progress/', data),
  update: (id: number, data: { date: string; hours_spent: number; notes: string }) => 
    api.put(`/progress/${id}/`, data),
  delete: (id: number) => api.delete(`/progress/${id}/`),
};

export default api;