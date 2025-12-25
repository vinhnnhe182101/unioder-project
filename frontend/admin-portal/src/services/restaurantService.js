import axiosClient from '../config/axiosConfig';

const BASE_URL = '/catalog/restaurants';

const restaurantService = {
    getMyRestaurants: () => {
        return axiosClient.get(`${BASE_URL}/my-restaurants`);
    },

    createRestaurant: (formData) => {
        return axiosClient.post(BASE_URL, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    getRestaurantById: (id) => {
        return axiosClient.get(`${BASE_URL}/${id}`);
    },

    updateRestaurant: (id, formData) => {
        return axiosClient.put(`${BASE_URL}/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    getPaymentConfig: (id) => axiosClient.get(`${BASE_URL}/${id}/payment-config`),

    updatePaymentConfig: (id, data) => axiosClient.put(`${BASE_URL}/${id}/payment-config`, data),

};

export default restaurantService;