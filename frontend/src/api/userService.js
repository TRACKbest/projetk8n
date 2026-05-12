import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const data = err.response?.data;
    const fieldErrors = data?.errors;
    const message =
      (fieldErrors && fieldErrors.map((e) => `${e.field}: ${e.message}`).join(', ')) ||
      data?.message ||
      err.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

const unwrap = (res) => res.data?.data ?? res.data;

export const userService = {
  list: (params = {}) => api.get('/users', { params }).then((r) => r.data),
  stats: () => api.get('/users/stats').then(unwrap),
  create: (data) => api.post('/users', data).then(unwrap),
  update: (id, data) => api.put(`/users/${id}`, data).then(unwrap),
  remove: (id) => api.delete(`/users/${id}`).then((r) => r.data),
};

export default api;
