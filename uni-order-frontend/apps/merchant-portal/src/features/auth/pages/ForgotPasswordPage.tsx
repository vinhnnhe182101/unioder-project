import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { AppInput } from '../../../components/AppInput';
import { AppButton } from '../../../components/AppButton';
import { authApiClient } from '@uniorder/api';
import { PATHS } from '../../../routes/paths';

export const ForgotPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!token) {
        await authApiClient.forgotPassword({ email } as any);
        toast.success('Hệ thống đã gửi link đổi mật khẩu vào Mail của bạn.');
      } else {
        await authApiClient.resetPassword({ token, newPassword } as any);
        toast.success('Đổi mật khẩu thành công! Hãy đăng nhập lại.');
        navigate(PATHS.LOGIN);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[4.5fr_5.5fr] bg-bg-main">
      <div className="hidden lg:flex bg-brand p-12 flex-col justify-between relative overflow-hidden select-none">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-brand-dark rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-20 w-96 h-96 bg-brand-light rounded-full opacity-10 blur-2xl"></div>

        <div className="flex items-center gap-2 text-white font-black text-2xl tracking-wider relative z-10">
          <span>🍔</span> UNIORDER
        </div>

        <div className="text-white relative z-10 my-auto py-10">
          <h2 className="text-4xl xl:text-5xl font-black leading-tight mb-4">Một tài khoản.<br/>Mở khóa mọi đặc quyền.</h2>
          <p className="text-white/80 text-base xl:text-lg font-medium max-w-sm leading-relaxed">Hệ thống xác thực tập trung dành cho Khách hàng, Đối tác nhà hàng và Tài xế công nghệ.</p>
        </div>

        <div className="text-white/40 text-xs relative z-10">© 2026 UniOrder Ecosystem. All rights reserved.</div>
      </div>

      <div className="w-full flex items-center justify-center p-6 sm:p-12 md:p-16 lg:p-20">
        <div className="w-full max-w-xl bg-white p-8 sm:p-10 rounded-custom-2xl shadow-2xl shadow-gray-200/50 border border-gray-100/80 animate-fade-in">
          <div className="mb-6 text-left">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight text-center">{!token ? 'QUÊN MẬT KHẨU' : 'CẬP NHẬT MẬT KHẨU MỚI'}</h1>
            <p className="mt-2 text-sm text-gray-500 font-medium text-center">{!token ? 'Nhập email hệ thống để nhận đường dẫn thay đổi mật khẩu.' : 'Vui lòng điền mật khẩu mới độ bảo mật cao.'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!token ? (
              <AppInput label="Địa chỉ Email" type="email" name="email" required value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} placeholder="nhapemail@domain.com" />
            ) : (
              <AppInput label="Mật khẩu mới" type="password" name="newPassword" required value={newPassword} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)} placeholder="••••••••" />
            )}

            <div className="pt-4 flex flex-col">
              <AppButton type="submit" variant="brand" isLoading={loading} className="w-full">{!token ? 'Gửi yêu cầu' : 'Xác nhận đổi mật khẩu'}</AppButton>
            </div>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500 border-t border-gray-100 pt-5">
            <Link to={PATHS.LOGIN} className="font-bold text-brand hover:text-brand-dark hover:underline">Quay lại Đăng nhập</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

