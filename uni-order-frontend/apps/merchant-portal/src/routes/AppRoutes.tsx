import {Navigate, Route, Routes} from "react-router-dom";
import {PATHS} from "./paths";
import {RegisterPage} from "../features/auth/pages/RegisterPage";
import {LoginPage} from "../features/auth/pages/LoginPage";
import {ForgotPasswordPage} from "../features/auth/pages/ForgotPasswordPage";
import {MerchantHome} from "../features/merchant/pages/MerchantHome";

export const AppRoutes = () => {
	return (
		<Routes>
			{/* Vào trang chủ mặc định đá thẳng sang trang LoginPage */}
			<Route path="/" element={<Navigate to={PATHS.LOGIN} replace/>}/>

			{/* Định nghĩa các Router Auth */}
			<Route path={PATHS.LOGIN} element={<LoginPage/>}/>
			<Route path={PATHS.REGISTER} element={<RegisterPage/>}/>
			<Route path={PATHS.FORGOT_PASSWORD} element={<ForgotPasswordPage/>}/>
			{/* Route cho link reset-password gửi từ email */}
			<Route path={PATHS.RESET_PASSWORD} element={<ForgotPasswordPage/>}/>
			<Route path={PATHS.MERCHANT_HOME} element={<MerchantHome/>}/>

			{/* Bắt bài tất cả các URL bậy bạ không tồn tại */}
			<Route path={PATHS.NOT_FOUND} element={<Navigate to={PATHS.LOGIN} replace/>}/>
		</Routes>
	);
}