// features/auth/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthLayout } from '../components/AuthLayout';
import { authApi } from '../api/authApi';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await authApi.login({ email, password, appSource: 'CUSTOMER' });
            // Lưu token vào localStorage
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);

            toast.success('Đăng nhập thành công! Chào mừng quay trở lại.');
            navigate('/'); // Điều hướng về HomePage
        } catch (error: any) {
            const errMsg = error.response?.data?.message || 'Sai tài khoản hoặc mật khẩu!';
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        toast.loading('Đang mở cổng xác thực Google...');
        // Giả lập luồng: Thực tế bạn cấu hình thư viện @react-oauth/google
        // để lấy credential (idToken) rồi gửi lên authApi.loginWithGoogle({ idToken, appSource: 'CUSTOMER' })
    };

    return (
        <AuthLayout>
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">ĐĂNG NHẬP</h2>
            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none transition"
                        placeholder="example@student.edu.vn"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                    <input
                        type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none transition"
                        placeholder="••••••••"
                    />
                </div>

                <div className="text-right">
                    <Link to="/forgot-password" className="text-sm text-orange-600 hover:underline font-medium">Quên mật khẩu?</Link>
                </div>

                <button
                    type="submit" disabled={loading}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg shadow-md transition disabled:bg-gray-400"
                >
                    {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
                </button>
            </form>

            <div className="mt-6">
                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase">Hoặc</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Nút đăng nhập Google */}
                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium py-2 rounded-lg hover:bg-gray-50 shadow-sm transition"
                >
                    <img src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/web-24dp/copy_of_24dp.png" alt="Google Logo" className="w-5 h-5"/>
                    Đăng nhập bằng Google
                </button>
            </div>

            <p className="mt-8 text-sm text-center text-gray-600">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="text-orange-600 font-bold hover:underline">Đăng ký ngay</Link>
            </p>
        </AuthLayout>
    );
};