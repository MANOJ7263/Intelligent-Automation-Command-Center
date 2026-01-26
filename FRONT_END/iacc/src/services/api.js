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
    }
};

export default api;
