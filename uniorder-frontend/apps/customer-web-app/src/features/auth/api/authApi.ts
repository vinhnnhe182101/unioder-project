// features/auth/api/authApi.ts
import axiosInstance from '../../../shared/api/axiosInstance'; // Trỏ về axiosInstance mới tạo

// SỬA DÒNG NÀY: Thêm từ khóa "type" để sửa lỗi TS1484
import type {
    LoginRequest,
    GoogleLoginRequest,
    RegisterRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    AuthResponse
} from '../types/authTypes';

export const authApi = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        // Gọi qua axiosInstance đã cấu hình Gateway, không dùng axios trực tiếp nữa
        return axiosInstance.post('/auth/login', data);
    },

    loginWithGoogle: async (data: GoogleLoginRequest): Promise<AuthResponse> => {
        return axiosInstance.post('/auth/google', data);
    },

    register: async (data: RegisterRequest): Promise<string> => {
        return axiosInstance.post('/auth/register', data);
    },

    forgotPassword: async (data: ForgotPasswordRequest): Promise<string> => {
        return axiosInstance.post('/auth/forgot-password', data);
    },

    resetPassword: async (data: ResetPasswordRequest): Promise<string> => {
        return axiosInstance.post('/auth/reset-password', data);
    }
};