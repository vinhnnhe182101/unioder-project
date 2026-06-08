// features/auth/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthLayout } from '../components/AuthLayout';
import { authApi } from '../api/authApi';
import axios from 'axios';

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authApi.register(formData);
            toast.success('Đăng ký thành công! Hãy kiểm tra Email để xác thực tài khoản.', { duration: 6000 });
            navigate('/login');
        } catch (error) { // BỎ ": any" đi, để mặc định là unknown
            let errMsg = 'Đăng ký thất bại, email có thể đã tồn tại!';

            // Kiểm tra xem lỗi có phải do Axios (API) trả về không
            if (axios.isAxiosError(error)) {
                // Ép kiểu cấu trúc data trả về từ server backend của bạn
                const serverMessage = error.response?.data?.message;
                if (serverMessage) errMsg = serverMessage;
            } else if (error instanceof Error) {
                // Lỗi hệ thống thông thường (mất mạng, crash code...)
                errMsg = error.message;
            }

            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">ĐĂNG KÝ TÀI KHOẢN</h2>
            <form onSubmit={handleRegister} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ và Tên</label>
                    <input
                        type="text" required value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
                        placeholder="Nguyễn Văn A"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email" required value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
                        placeholder="van-a.student@edu.vn"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                    <input
                        type="password" required value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
                        placeholder="Tối thiểu 8 ký tự"
                    />
                </div>

                <button
                    type="submit" disabled={loading}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg shadow-md transition mt-2"
                >
                    {loading ? 'Đang xử lý...' : 'Đăng Ký'}
                </button>
            </form>

            <p className="mt-8 text-sm text-center text-gray-600">
                Đã có tài khoản?{' '}
                <Link to="/login" className="text-orange-600 font-bold hover:underline">Đăng nhập</Link>
            </p>
        </AuthLayout>
    );
};