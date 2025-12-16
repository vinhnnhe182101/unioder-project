import axiosClient from '../config/axiosConfig';

const BASE_URL = '/orders';

const orderService = {
    createOrder: (data) => {
        return axiosClient.post(BASE_URL, data);
    },

    getMyOrders: () => {
        return axiosClient.get(BASE_URL);
    },

    updateStatus: (orderId, status) => {
        return axiosClient.put(`${BASE_URL}/${orderId}/status`, null, {
            params: { status }
        });
    },

    cancelOrder: (orderId, reason) => {
        return axiosClient.put(`${BASE_URL}/${orderId}/cancel`, null, {
            params: { reason }
        });
    }
};

export default orderService;