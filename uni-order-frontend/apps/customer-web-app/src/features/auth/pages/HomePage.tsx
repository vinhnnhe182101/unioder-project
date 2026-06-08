// features/auth/pages/HomePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const HomePage: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        toast.success('Đã đăng xuất tài khoản.');
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-sans">
            <div className="p-8 bg-white rounded-xl shadow-md text-center">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">Đây là trang homepage</h1>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 text-sm shadow transition"
                >
                    Đăng xuất
                </button>
            </div>
        </div>
    );
};