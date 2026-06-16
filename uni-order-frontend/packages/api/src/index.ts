// 🌟 1. Khởi tạo cấu hình an toàn ban đầu cho SDK
import {_registerUrlChangeListener, apiClient} from "./config/apiClient";
import {userServiceApi} from "./generated";

// Dùng let thay vì const để có thể thay đổi/cập nhật cấu hình động
let apiConfig = new userServiceApi.Configuration({
	basePath: apiClient.defaults.baseURL,
});

// Khởi tạo instance controller ban đầu
export let authApiClient = new userServiceApi.UserControllerApi(
	apiConfig,
	apiClient.defaults.baseURL,
	apiClient
);

// 🌟 2. ĐĂNG KÝ LẮNG NGHE ĐỂ CẬP NHẬT ĐỘNG KHI CÓ CONFIG MỚI
_registerUrlChangeListener((newUrl) => {
	// Cập nhật lại Configuration Object
	apiConfig = new userServiceApi.Configuration({
		basePath: newUrl,
	});

	// Ép instance của SDK sử dụng cấu hình và basePath mới ngay lập tức
	authApiClient = new userServiceApi.UserControllerApi(
		apiConfig,
		newUrl,
		apiClient
	);

	// Nếu sau này bạn có thêm các service khác, gán lại tại đây:
	// orderApiClient = new orderServiceApi.OrderControllerApi(apiConfig, newUrl, apiClient);

	console.log("⚙️ Package API: Đã đồng bộ cấu hình SDK mới thành công với URL:", newUrl);
});

// 🌟 3. EXPORT TOAN BO CAC TYPE/INTERFACE (DTO) ĐỂ FRONTEND CÓ TYPING
export * from "./generated";
export * from "./types";
export {apiClient, setApiGatewayUrl} from "./config/apiClient";