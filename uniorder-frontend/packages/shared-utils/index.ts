import axios from 'axios';

export const apiGateway = axios.create({
    baseURL: 'http://localhost:8080', // Địa chỉ API Gateway của backend
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
});

// Hùng viết sẵn Interceptor xử lý Token (Auth) tại đây luôn
apiGateway.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});