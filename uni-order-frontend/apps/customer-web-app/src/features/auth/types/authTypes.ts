// features/auth/types/authTypes.ts
export interface LoginRequest {
    email: string;
    password?: string;
    appSource: 'CUSTOMER' | 'MERCHANT' | 'ADMIN';
}

export interface GoogleLoginRequest {
    idToken: string;
    appSource: 'CUSTOMER' | 'MERCHANT' | 'ADMIN';
}

export interface RegisterRequest {
    email: string;
    password_hash?: string; // Tên trường khớp với request hoặc password tùy DTO FE nhận diện
    password?: string;
    fullName: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    newPassword?: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        userId: number;
        email: string;
        fullName: string;
        avatarUrl: string;
        phoneNumber: string;
        roles: string[];
    };
}