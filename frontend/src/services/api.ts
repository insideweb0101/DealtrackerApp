import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (email: string, password: string) =>
    apiClient.post('/users/login', { email, password }),
  register: (email: string, name: string, password: string, role?: string) =>
    apiClient.post('/users/register', { email, name, password, role }),
  getProfile: () => apiClient.get('/users/profile'),
  updateProfile: (data: any) => apiClient.patch('/users/profile', data),
};

export const dealService = {
  getAll: (status?: string) =>
    apiClient.get('/deals', { params: { status } }),
  getById: (id: string) => apiClient.get(`/deals/${id}`),
  create: (data: any) => apiClient.post('/deals', data),
  update: (id: string, data: any) => apiClient.patch(`/deals/${id}`, data),
  delete: (id: string) => apiClient.delete(`/deals/${id}`),
  getPipeline: () => apiClient.get('/deals/pipeline'),
};

export const alertService = {
  getUnread: () => apiClient.get('/alerts/unread'),
  markAsRead: (id: string) => apiClient.patch(`/alerts/${id}/read`),
};

export default apiClient;
