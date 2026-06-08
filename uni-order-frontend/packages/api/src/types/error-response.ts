export interface ErrorResponse {
	timestamp?: string;
	status: number;
	error: string;
	message: string; // Tin nhắn lỗi cụ thể như "Không thể tạo tài khoản trên Keycloak..."
	path: string;
}