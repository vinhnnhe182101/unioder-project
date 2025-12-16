import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:80/api';

const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': "application/json",
    },
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization =  `Bearer ${token}`;
        }
        const currentRestaurant = localStorage.getItem('currentRestaurant');
        if (currentRestaurant) {
            try {
                const restaurant = JSON.parse(currentRestaurant);
                if (restaurant && restaurant.restId) {
                    config.headers['x-restaurant-id'] = restaurant.restId;
                }
            } catch (e) {
                console.error("Error parsing currentRestaurant", e);
            }
        }
        return config
    },
    (error) => Promise.reject(error)
);

instance.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            if (!window.location.pathname.startsWith('/login')) {
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error)
    }
);

export default instance;