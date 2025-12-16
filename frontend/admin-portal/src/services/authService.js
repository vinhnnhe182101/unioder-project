import axiosClient from '../config/axiosConfig';

const authService = {
    login: (credentials) => {
        // credentials: { email, password }
        return axiosClient.post('/auth/login', credentials);
    },

    register: (data) => {
        // data: { fullName, email, password }
        return axiosClient.post('/auth/register', data);
    },

    verifyEmail: (token) => {
        return axiosClient.get(`/auth/verify?token=${token}`);
    },

    forgotPassword: (email) => {
        return axiosClient.post('/auth/forgot-password', { email });
    },

    resetPassword: (token, newPassword) => {
        return axiosClient.post('/auth/reset-password', { token, newPassword });
    },
};

export default authService;