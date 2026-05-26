// features/auth/pages/ForgotPasswordPage.tsx
import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthLayout } from '../components/AuthLayout';
import { authApi } from '../api/authApi';

export const ForgotPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token'); // Đọc token từ email bắn về link

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!token) {
        // Luồng Yêu cầu cấp mã reset
        await authApi.forgotPassword({ email });
        toast.success('Hệ thống đã gửi link đổi mật khẩu vào Mail của bạn.');
      } else {
        // Luồng cập nhật mật khẩu mới thực tế
        await authApi.resetPassword({ token, newPassword });
        toast.success('Đổi mật khẩu thành công! Hãy đăng nhập lại.');
        navigate('/login');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        {!token ? 'QUÊN MẬT KHẨU' : 'CẬP NHẬT MẬT KHẨU MỚI'}
      </h2>
      <p className="text-xs text-gray-500 text-center mb-6">
        {!token ? 'Nhập email hệ thống để nhận đường dẫn thay đổi mật mật khẩu bảo mật.' : 'Vui lòng điền mật khẩu mới độ bảo mật cao.'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!token ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ Email</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
              placeholder="nhapemailcua-ban@gmail.com"
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-semibold">Mật khẩu mới</label>
            <input
              type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
              placeholder="••••••••"
            />
          </div>
        )}

        <button
          type="submit" disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg shadow-md transition"
        >
          {loading ? 'Đang xử lý...' : !token ? 'Gửi yêu cầu' : 'Xác nhận đổi mật khẩu'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link to="/login" className="text-sm text-gray-600 hover:underline">Quay lại Đăng nhập</Link>
      </div>
    </AuthLayout>
  );
};