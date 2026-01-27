import axios from 'axios';

// Create an Axios instance
const api = axios.create({
    baseURL: 'http://localhost:8081/api', // Backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Ensure strictly "Bearer <token>"
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        if (response.data && response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('token');
    }
};

export const taskService = {
    createTask: async (taskData) => {
        const response = await api.post('/tasks', taskData);
        return response.data;
    },
    getAllTasks: async () => {
        const response = await api.get('/tasks');
        return response.data;
    },
    getMyTasks: async () => {
        const response = await api.get('/tasks/my');
        return response.data;
    },
    approveTask: async (id, decision, reason) => {
        const response = await api.post(`/tasks/${id}/decision`, { decision, reason });
        return response.data;
    },
    escalateTask: async (id) => {
        const response = await api.post(`/tasks/${id}/escalate`);
        return response.data;
    },
    getCollectorSummary: async () => {
        const response = await api.get('/tasks/analytics');
        return response.data;
    },
    downloadReport: async () => {
        const response = await api.get('/reports/export/csv', { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'tasks_report.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
    },
    getAutomationStatus: async () => {
        const response = await api.get('/tasks/automation/status');
        return response.data;
    },
    retryTask: async (id) => {
        const response = await api.post(`/tasks/${id}/retry`);
        return response.data;
    }
};

export default api;
