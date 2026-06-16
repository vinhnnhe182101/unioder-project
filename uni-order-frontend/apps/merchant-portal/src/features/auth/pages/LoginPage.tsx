import {LoginForm} from "../components/login/LoginForm";
import {Link} from "react-router-dom";
import {PATHS} from "../../../routes/paths";

export const LoginPage = () => {
	return (
		<div className="grid min-h-screen grid-cols-1 lg:grid-cols-[4.5fr_5.5fr] bg-bg-main">
			<div className="hidden lg:flex bg-brand p-12 flex-col justify-between relative overflow-hidden select-none">
				<div className="absolute -top-20 -left-20 w-80 h-80 bg-brand-dark rounded-full opacity-50 blur-3xl"></div>
				<div className="absolute -bottom-40 -right-20 w-96 h-96 bg-brand-light rounded-full opacity-10 blur-2xl"></div>

				<div className="flex items-center gap-2 text-white font-black text-2xl tracking-wider relative z-10">
					<span>🍔</span> UNIORDER
				</div>

				<div className="text-white relative z-10 my-auto py-10">
					<h2 className="text-4xl xl:text-5xl font-black leading-tight mb-4">
						Một tài khoản.<br/>Mở khóa mọi đặc quyền.
					</h2>
					<p className="text-white/80 text-base xl:text-lg font-medium max-w-sm leading-relaxed">
						Hệ thống xác thực tập trung dành cho Khách hàng, Đối tác nhà hàng và Tài xế công nghệ.
					</p>
				</div>

				<div className="text-white/40 text-xs relative z-10">
					© 2026 UniOrder Ecosystem. All rights reserved.
				</div>
			</div>

			{/* Right: login form */}
			<div className="w-full flex items-center justify-center p-6 sm:p-12 md:p-16 lg:p-20">
				<div className="w-full max-w-xl bg-white p-8 sm:p-10 rounded-custom-2xl shadow-2xl shadow-gray-200/50 border border-gray-100/80 animate-fade-in">
					<div className="mb-6 text-left">
						<h1 className="text-3xl font-black text-gray-900 tracking-tight">Chào mừng quay lại</h1>
						<p className="mt-2 text-sm text-gray-500 font-medium">Đăng nhập vào tài khoản Đối Tác Nhà Hàng</p>
					</div>

					<LoginForm />

					<div className="mt-8 text-center text-sm text-gray-500 border-t border-gray-100 pt-5">
						Chưa có tài khoản? {" "}
						<Link to={PATHS.REGISTER} className="font-bold text-brand hover:text-brand-dark hover:underline">Đăng ký ngay</Link>
					</div>
				</div>
			</div>
		</div>
	);
};