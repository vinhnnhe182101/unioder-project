import React, {useState} from "react";
import {toast} from "sonner";
import {AppInput} from "../../../../components/AppInput";
import {Link} from "react-router-dom";
import {AppButton} from "../../../../components/AppButton";
import {useNavigate} from "react-router-dom";
import {authApiClient} from "@uniorder/api";
import {PATHS} from "../../../../routes/paths";

export const LoginForm = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			const resp = await authApiClient.login({ email, password, appSource: 'MERCHANT' } as any);

			const data = resp?.data || resp;
			// store tokens
			if (data?.accessToken) {
				localStorage.setItem('accessToken', data.accessToken);
				localStorage.setItem('refreshToken', data.refreshToken || '');
				toast.success('Đăng nhập thành công');
				navigate(PATHS.MERCHANT_HOME);
			} else {
				toast.error('Đăng nhập thất bại');
			}
		} catch (err) {
			console.error(err);
			toast.error('Đăng nhập thất bại');
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={onSubmit} className="space-y-5">
			<AppInput
				label="Địa chỉ Email"
				type="email"
				name="email"
				required
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="nhahang@domain.com"
				className=""
			/>

			<AppInput
				label="Mật khẩu"
				type="password"
				name="password"
				required
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder="Ít nhất 8 ký tự"
			/>

			<div className="flex items-center justify-between">
				<label className="flex items-center gap-2 text-sm">
					<input type="checkbox" className="form-checkbox h-4 w-4" />
					<span>Ghi nhớ đăng nhập</span>
				</label>
				<Link to="/forgot-password" className="text-sm text-brand hover:underline">Quên mật khẩu?</Link>
			</div>

			<div className="pt-4 flex flex-col">
				<AppButton type="submit" variant="brand" isLoading={loading} className="w-full">Đăng nhập</AppButton>
			</div>
		</form>
	);
};
