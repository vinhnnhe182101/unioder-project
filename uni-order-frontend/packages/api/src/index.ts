// 🌟 Generated OpenAPI client wrapper (runtime require to avoid TS errors in generated output)
import {_registerUrlChangeListener, apiClient, setApiGatewayUrl} from "./config/apiClient";

declare const require: any;

let generated: any = null;
try {
	generated = require('./generated/user-service-api');
} catch (e) {
	console.warn('Generated API module not found at runtime. Falling back to axios calls.', e);
}

// 🌟 1. Khởi tạo cấu hình an toàn ban đầu cho SDK
let apiConfig: any = null;
export let authApiClient: any = null;

if (generated) {
	try {
		apiConfig = new generated.Configuration({ basePath: String(apiClient.defaults.baseURL) });
		authApiClient = new generated.AuthControllerApi(apiConfig, String(apiClient.defaults.baseURL), apiClient);
	} catch (e) {
		console.warn('Failed to instantiate generated SDK AuthControllerApi, falling back to plain axios.', e);
	}
}

// Fallback minimal implementation using axios when generated client is not available
if (!authApiClient) {
	authApiClient = {
		login: (payload: any) => apiClient.post('/api/auth/login', payload),
		register: (payload: any) => apiClient.post('/api/auth/register', payload),
		forgotPassword: (payload: any) => apiClient.post('/api/auth/forgot-password', payload),
		resetPassword: (payload: any) => apiClient.post('/api/auth/reset-password', payload),
		refreshToken: (payload: any) => apiClient.post('/api/auth/refresh-token', payload),
	};
}

// 🌟 2. ĐĂNG KÝ LẮNG NGHE ĐỂ CẬP NHẬT ĐỘNG KHI CÓ CONFIG MỚI
_registerUrlChangeListener((newUrl) => {
	if (generated) {
		try {
			apiConfig = new generated.Configuration({ basePath: newUrl });
			authApiClient = new generated.AuthControllerApi(apiConfig, newUrl, apiClient);
			console.log("⚙️ Package API: Đã đồng bộ cấu hình SDK mới thành công với URL:", newUrl);
		} catch (e) {
			console.warn('Failed to recreate generated SDK instance on URL change', e);
		}
	} else {
		// fallback uses apiClient directly — nothing to recreate
	}
});

// 🌟 3. EXPORT TOAN BO CAC TYPE/INTERFACE (DTO)
// Re-export typed DTOs (generated-types provides stable typings to avoid compiling generated sources)
export * from "./generated";
export * from "./types";
export {apiClient, setApiGatewayUrl};