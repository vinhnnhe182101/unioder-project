import React, { useState } from "react";
import { toast } from "sonner";
import { AppInput } from "../../../../components/AppInput.tsx";
import { AppButton } from "../../../../components/AppButton.tsx";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../../routes/paths.ts";
import {authApiClient} from "@uniorder/api";

type RegisterFormData = {
	fullName: string;
	email: string;
	phoneNumber?: string;
	password: string;
	confirmPassword?: string;
};

export const RegisterForm = () => {
	// Ép cứng vai trò mặc định là MERCHANT (Đối tác nhà hàng)
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [formData, setFormData] = useState<RegisterFormData>({
		fullName: "",
		email: "",
		phoneNumber: "",
		password: "",
		confirmPassword: "",
	});
	const navigate = useNavigate();

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (formData.password !== formData.confirmPassword) {
			toast.error("Mật khẩu và xác nhận mật khẩu không khớp!");
			return;
		}

		// Đảm bảo request gửi đi luôn mang role MERCHANT bất chấp client-side thay đổi
		const payload = {
			email: formData.email,
			fullName: formData.fullName,
			password: formData.password,
			phoneNumber: formData.phoneNumber,
			role: "MERCHANT",
			// restaurantId có thể được cấp sau, để null tại thời điểm đăng ký
			restaurantId: null
		};

		setIsLoading(true);

		try {
			const response = await authApiClient.registerMerchant ? await authApiClient.registerMerchant(payload) : await authApiClient.register(payload);
			const status = response?.status || (response && response.data ? 200 : 201);
			if (status === 200 || status === 201) {
				toast.success("Tạo tài khoản Đối Tác Nhà Hàng thành công! Vui lòng kiểm tra email để xác thực.");
				navigate(PATHS.LOGIN);
			}
		} catch (err) {
			console.error("Luồng đăng ký thất bại:", err);
			toast.error("Đăng ký thất bại. Vui lòng thử lại.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-5">

			{/* Ẩn hoàn toàn thanh chọn vai trò vì trang này chỉ dành cho nhà hàng. 
			    Nếu muốn hiển thị ở dạng bị khóa, bạn có thể uncomment dòng dưới: */}
			{/* <RoleSelector role="MERCHANT" onChange={() => {}} disabled={true} /> */}

			{/* Họ và Tên */}
			<AppInput
				label="Họ và Tên Chủ Cửa Hàng / Nhà Hàng"
				type="text"
				name="fullName"
				required
				disabled={isLoading}
				value={formData.fullName}
				onChange={handleInputChange}
				placeholder="Nguyễn Văn A"
			/>

			{/* Email & Số điện thoại */}
			<div className="grid grid-cols-2 gap-4">
				<AppInput
					label="Địa chỉ Email"
					type="email"
					name="email"
					required
					disabled={isLoading}
					value={formData.email}
					onChange={handleInputChange}
					placeholder="nhahang@gmail.com"
				/>
				<AppInput
					label="Số điện thoại liên hệ"
					type="tel"
					name="phoneNumber"
					required
					disabled={isLoading}
					value={formData.phoneNumber}
					onChange={handleInputChange}
					placeholder="0912345678"
				/>
			</div>

			{/* Mật khẩu & Xác nhận mật khẩu */}
			<div className="grid grid-cols-2 gap-4">
				<AppInput
					label="Mật khẩu"
					type="password"
					name="password"
					required
					disabled={isLoading}
					value={formData.password}
					onChange={handleInputChange}
					placeholder="••••••••"
				/>
				<AppInput
					label="Xác nhận mật khẩu"
					type="password"
					name="confirmPassword"
					required
					disabled={isLoading}
					value={formData.confirmPassword}
					onChange={handleInputChange}
					placeholder="••••••••"
				/>
			</div>

			{/* Nút đăng ký */}
			<div className="pt-4 flex flex-col">
				<AppButton
					type="submit"
					variant="brand"
					isLoading={isLoading}
					className="w-full"
				>
					Đăng Ký Tài Khoản Đối Tác Nhà Hàng
				</AppButton>
			</div>

		</form>
	);
};