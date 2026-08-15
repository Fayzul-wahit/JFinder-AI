import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('auth');
      // Only redirect to login if we're not on landing or signup
      if (window.location.pathname !== '/' && window.location.pathname !== '/signup') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const getCompanies = () => api.get('/api/companies');
export const getCompanyById = (id) => api.get(`/api/companies/${id}`);
export const getJobs = () => api.get('/api/jobs');
export const getNews = (params) => api.get('/api/news', { params });
export const getTrends = () => api.get('/api/trends');
export const getUserProfile = () => api.get('/api/users/profile');
export const updateUserProfile = (data) => api.put('/api/users/profile', data);
export const saveUserProfile = (data) => api.post('/api/users/profile', data);
export const getCRS = () => api.get('/api/crs');
export const getSkillGap = () => api.get('/api/skill-gap');
export const getRoadmap = (jobRole) => api.get(`/api/roadmap/${jobRole}`);
export const getRecommendations = () => api.get('/api/companies/recommendations');
export const sendMentorMessage = (message) => api.post('/api/ai-mentor/chat', { message });
export const uploadResume = (formData) => api.post('/api/users/resume', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
