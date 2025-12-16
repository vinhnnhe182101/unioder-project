import axiosClient from '../config/axiosConfig';

const userService = {
    getMe: () => axiosClient.get('/users/me'),

    updateProfile: (formData) => {
        return axiosClient.put('/users/me', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
};

export default userService;