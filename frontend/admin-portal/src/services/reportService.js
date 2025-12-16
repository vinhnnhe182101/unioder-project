import axiosClient from '../config/axiosConfig';

// Gateway route: /api/reports (Đã cấu hình ở bài trước)
// Lưu ý: Nếu bạn cấu hình route là /api/orders/reports thì sửa lại BASE_URL
const BASE_URL = '/reports';

const reportService = {
    // Thống kê doanh thu
    // params: { type: 'DAY' | 'MONTH', from: 'YYYY-MM-DD', to: 'YYYY-MM-DD' }
    getRevenue: (type, from, to) => {
        return axiosClient.get(`${BASE_URL}/revenue`, {
            params: { type, from, to }
        });
    },
    // Top sản phẩm bán chạy
    getTopProducts: (params) => {
        return axiosClient.get(`${BASE_URL}/top-products`, { params });
    },

    // (Tùy chọn) Thống kê tổng quan (KPIs)
    // Nếu chưa có API riêng, ta có thể tính toán từ API doanh thu hoặc tạo API mới
    getSummary: (params) => {
        return axiosClient.get(`${BASE_URL}/summary`, { params });
    }
};

export default reportService;