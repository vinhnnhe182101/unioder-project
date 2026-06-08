// features/auth/pages/VerifySuccessPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const VerifySuccessPage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-orange-50 flex flex-col justify-center items-center font-sans p-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border border-orange-100">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h1 className="text-2xl font-black text-gray-800 mb-2">Xác Thực Thành Công!</h1>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    Chào mừng bạn mới gia nhập cộng đồng <span className="font-bold text-orange-600">UniOrder</span>! Tài khoản của bạn đã được kích hoạt thành công, trải nghiệm đặt món ngay nào.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl shadow-md transition transform active:scale-95"
                >
                    Khám phá Trang Chủ
                </button>
            </div>
        </div>
    );
};

// features/auth/pages/VerifyFailPage.tsx
export const VerifyFailPage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-orange-50 flex flex-col justify-center items-center font-sans p-6">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border border-orange-100">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                </div>
                <h1 className="text-2xl font-black text-red-600 mb-2">Xác Thực Thất Bại!</h1>
                <p className="text-gray-500 mb-6 text-sm leading-relaxed">
                    Mã xác thực tài khoản của bạn đã hết hạn hoặc không hợp lệ. Vui lòng thử đăng ký lại để nhận mã kích hoạt mới.
                </p>
                <button
                    onClick={() => navigate('/register')}
                    className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2.5 rounded-xl shadow-md transition"
                >
                    Quay lại trang Đăng Ký
                </button>
            </div>
        </div>
    );
};