// features/auth/components/AuthLayout.tsx
import React from 'react';

interface AuthLayoutProps {
    children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <div className="flex h-screen w-screen overflow-hidden font-sans">
            {/* 70% Bên trái: Hình ảnh nhà hàng */}
            <div className="hidden md:block w-[70%] h-full relative">
                <img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200" // Đường dẫn ảnh nhà hàng thay thế mượt mà hơn
                    alt="Restaurant Workspace"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" /> {/* Phủ lớp mờ nhẹ cho nghệ thuật */}
            </div>

            {/* 30% Bên phải: Form chức năng với Background Cam nhẹ, trẻ trung */}
            <div className="w-full md:w-[30%] h-full bg-orange-50/60 flex flex-col justify-center px-8 sm:px-12 relative shadow-2xl">
                <div className="w-full max-w-md mx-auto">
                    {/* Logo ứng dụng */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-orange-600 tracking-wide">UniOrder</h1>
                        <p className="text-gray-500 text-sm mt-1">Hệ thống đặt món nhanh cho sinh viên</p>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
};