import axiosClient from '../config/axiosConfig';

const BASE_URL = '/notifications';

const notificationService = {
    // Lấy danh sách thông báo của người dùng/nhà hàng hiện tại
    // Backend cần API: GET /api/notifications?page=0&size=20
    getMyNotifications: (params) => {
        return axiosClient.get(BASE_URL, { params });
    },

    // Đánh dấu một thông báo là đã đọc
    // Backend cần API: PUT /api/notifications/{id}/read
    markAsRead: (id) => {
        return axiosClient.put(`${BASE_URL}/${id}/read`);
    },

    // Đánh dấu tất cả là đã đọc
    // Backend cần API: PUT /api/notifications/read-all
    markAllAsRead: (params) => {
        return axiosClient.put(`${BASE_URL}/read-all`, null, { params });
    },

    // Gửi thông báo (thường dùng cho test hoặc admin gửi manual)
    sendNotification: (data) => {
        return axiosClient.post(`${BASE_URL}/send`, data);
    }
};

export default notificationService;