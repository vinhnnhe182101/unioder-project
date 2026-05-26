// shared/api/axiosInstance.ts
import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';

const BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:80/api';

const axiosInstance: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Biến cờ tránh việc gọi Refresh Token trùng lặp nhiều lần cùng lúc
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
    refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
    refreshSubscribers.map((cb) => cb(token));
    refreshSubscribers = [];
};

// 1. Request Interceptor: Đính kèm token và dữ liệu môi trường vào Header
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Giữ nguyên logic lấy nhà hàng hiện tại từ code cũ của bạn
        const currentRestaurant = localStorage.getItem('currentRestaurant');
        if (currentRestaurant) {
            try {
                const restaurant = JSON.parse(currentRestaurant);
                if (restaurant && restaurant.restId) {
                    config.headers['x-restaurant-id'] = restaurant.restId;
                }
            } catch (e) {
                console.error('Error parsing currentRestaurant', e);
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 2. Response Interceptor: Xử lý lỗi tập trung & Tự động xử lý Silent Refresh
axiosInstance.interceptors.response.use(
    (response) => response.data, // Trả trực tiếp data về giống như file cấu hình cũ của bạn
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Nếu lỗi 401 (Unauthorized) và không phải là request đang cố thử lại (prevent infinite loop)
        if (error.response?.status === 401 && !originalRequest._retry) {

            // Nếu đang ở màn hình login thì xóa token lỗi và báo lỗi thẳng luôn, không refresh làm gì
            if (window.location.pathname.startsWith('/login')) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                return Promise.reject(error);
            }

            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
                // Không có refresh token -> Cho đăng xuất thẳng
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(error);
            }

            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    // Gọi trực tiếp axios thuần lên Endpoint Gateway để làm mới token
                    const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh-token`, {
                        refreshToken: refreshToken,
                    });

                    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data;

                    // Lưu cặp token mới vào bộ nhớ thiết bị
                    localStorage.setItem('accessToken', newAccessToken);
                    localStorage.setItem('refreshToken', newRefreshToken);

                    isRefreshing = false;
                    onRefreshed(newAccessToken);

                    // Cập nhật lại token mới cho Request hiện tại bị lỗi và kích hoạt chạy lại
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    }
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    isRefreshing = false;
                    // Refresh thất bại (ví dụ Refresh Token quá hạn 7 ngày trên DB) -> Ép đăng nhập lại
                    localStorage.clear();
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }

            // Nếu có nhiều request đồng thời bị lỗi 401 cùng lúc, đưa chúng vào hàng đợi đợi token mới
            return new Promise((resolve) => {
                subscribeTokenRefresh((token: string) => {
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                    }
                    resolve(axiosInstance(originalRequest));
                });
            });
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;