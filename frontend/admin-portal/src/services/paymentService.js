import axiosClient from '../config/axiosConfig';

const BASE_URL = '/orders';

const paymentService = {
    // Tạo thanh toán (Tiền mặt hoặc QR)
    // POST /api/orders/{orderId}/payments
    createPayment: (orderId, data) => {
        return axiosClient.post(`${BASE_URL}/${orderId}/payments`, data);
    },

    // Xác nhận thanh toán thủ công
    // PUT /api/orders/payments/{paymentId}/confirm
    confirmPayment: (paymentId) => {
        return axiosClient.put(`${BASE_URL}/payments/${paymentId}/confirm`);
    }
};

export default paymentService;