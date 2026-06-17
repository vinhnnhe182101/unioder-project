export interface AuthResponse {
accessToken?: string;
refreshToken?: string;
user?: UserProfileDTO;
}

export interface ForgotPasswordRequest {
email?: string;
}

export interface GoogleLoginRequest {
idToken: string;
appSource: string;
}

export interface LoginRequest {
email: string;
password: string;
appSource: string;
}

export interface RefreshTokenRequest {
refreshToken: string;
}

export interface RegisterRequest {
email: string;
password: string;
fullName: string;
}

export interface RegisterMerchantRequest {
email: string;
password: string;
fullName: string;
phoneNumber?: string;
restaurantId?: number | null;
roleName?: string | null;
}

export interface ResetPasswordRequest {
token?: string;
newPassword?: string;
}

export interface StaffDTO {
userId?: number;
email?: string;
fullName?: string;
phoneNumber?: string;
avatarUrl?: string;
roleName?: string;
createdAt?: string;
}

export interface UpdateProfileDTO {
fullName?: string;
avatarUrl?: string;
phoneNumber?: string;
}

export interface UserProfileDTO {
userId?: number;
email?: string;
fullName?: string;
avatarUrl?: string;
phoneNumber?: string;
roles?: Array<string>;
}
