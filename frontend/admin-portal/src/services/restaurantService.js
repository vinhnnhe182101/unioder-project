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
    }
};

export default restaurantService;